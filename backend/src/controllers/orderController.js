const Order = require("../models/Order");
const Food = require("../models/Food");

const DELIVERY_FEE = 2.99;

const generateOrderNumber = () =>
    `YT-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

// POST /api/orders/place  (protected)
const placeOrder = async (req, res, next) => {
    try {
        const { fullName, address, city, postalCode, phone, note, paymentMethod, products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Order must include at least one product" });
        }

        // Never trust client-supplied prices/totals — look the real, current
        // prices up server-side and build a priced+named snapshot from them.
        const foodIds = products.map((p) => p.product_id);
        const foods = await Food.find({ _id: { $in: foodIds } });
        const foodsById = new Map(foods.map((f) => [f._id.toString(), f]));

        const lineItems = [];
        for (const p of products) {
            const food = foodsById.get(String(p.product_id));
            const quantity = Math.max(1, Number(p.quantity) || 1);
            if (!food) {
                return res.status(400).json({ message: `Item ${p.product_id} is no longer available` });
            }
            if (!food.isAvailable) {
                return res.status(400).json({ message: `${food.name} is currently unavailable` });
            }
            lineItems.push({
                product_id: food._id,
                name: food.name,
                imageUrl: food.imageUrl,
                price: food.currentPrice,
                quantity,
            });
        }

        const subtotal = lineItems.reduce((sum, li) => sum + li.price * li.quantity, 0);
        const payed = Math.round((subtotal + DELIVERY_FEE) * 100) / 100;

        const order = await Order.create({
            orderNumber: generateOrderNumber(),
            user_id: req.user.id, // trust the authenticated user, not the client-sent user_id
            fullName,
            address,
            city,
            postalCode,
            phone,
            note,
            paymentMethod,
            products: lineItems,
            subtotal: Math.round(subtotal * 100) / 100,
            deliveryFee: DELIVERY_FEE,
            payed,
        });

        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

// GET /api/orders/my-orders  (protected)
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// GET /api/orders/admin?status=&search=&from=&to=&page=&limit=&sort=  (admin)
const getAllOrders = async (req, res, next) => {
    try {
        const { status, search, from, to, sort } = req.query;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

        const query = {};

        if (status && status !== "all") {
            if (!Order.STATUSES.includes(status)) {
                return res.status(400).json({ message: `status must be one of: ${Order.STATUSES.join(", ")}` });
            }
            query.status = status;
        }

        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        if (search) {
            const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            query.$or = [{ fullName: regex }, { phone: regex }, { orderNumber: regex }];
        }

        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            highest_total: { payed: -1 },
            lowest_total: { payed: 1 },
        };
        const sortBy = sortMap[sort] || sortMap.newest;

        const [orders, total] = await Promise.all([
            Order.find(query)
                .sort(sortBy)
                .skip((page - 1) * limit)
                .limit(limit),
            Order.countDocuments(query),
        ]);

        res.json({
            orders,
            pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/orders/admin/stats  (admin)
// Powers a small real-time dashboard: counts per status, revenue, today's volume.
const getOrderStats = async (req, res, next) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [byStatus, revenueAgg, todayCount] = await Promise.all([
            Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
            Order.aggregate([
                { $match: { status: { $ne: "cancel" } } },
                { $group: { _id: null, revenue: { $sum: "$payed" }, orders: { $sum: 1 } } },
            ]),
            Order.countDocuments({ createdAt: { $gte: startOfToday } }),
        ]);

        const statusCounts = Object.fromEntries(Order.STATUSES.map((s) => [s, 0]));
        byStatus.forEach((row) => {
            statusCounts[row._id] = row.count;
        });

        res.json({
            statusCounts,
            totalOrders: revenueAgg[0]?.orders || 0,
            totalRevenue: Math.round((revenueAgg[0]?.revenue || 0) * 100) / 100,
            ordersToday: todayCount,
        });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/orders/update-status/:id  (admin)
const updateStatus = async (req, res, next) => {
    try {
        const { status, cancelReason } = req.body;
        if (!Order.STATUSES.includes(status)) {
            return res.status(400).json({ message: `status must be one of: ${Order.STATUSES.join(", ")}` });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (["delivered", "cancel"].includes(order.status)) {
            return res.status(400).json({ message: `Order is already ${order.status} and can no longer be updated` });
        }

        order.status = status;
        if (status === "cancel" && cancelReason) order.cancelReason = cancelReason;
        await order.save();

        res.json(order);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/orders/cancel/:id  (protected — customer cancels their own order)
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user_id: req.user.id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== "preparing") {
            return res.status(400).json({ message: "Only orders that are still preparing can be cancelled" });
        }

        order.status = "cancel";
        order.cancelReason = req.body?.reason || "Cancelled by customer";
        await order.save();

        res.json(order);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/orders/complete/:id  (protected — customer confirms receipt)
const completeOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user_id: req.user.id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== "delivered") {
            return res.status(400).json({ message: "Only delivered orders can be marked complete" });
        }

        order.isComplete = true;
        await order.save();

        res.json(order);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderStats,
    updateStatus,
    cancelOrder,
    completeOrder,
};
