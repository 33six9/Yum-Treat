const express = require("express");
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getOrderStats,
    updateStatus,
    cancelOrder,
    completeOrder,
} = require("../controllers/orderController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/place", requireAuth, placeOrder);
router.get("/my-orders", requireAuth, getMyOrders);

// Admin order management — properly protected (previously these two
// endpoints had no auth at all, which let anyone view/edit every order).
router.get("/admin/stats", requireAuth, requireAdmin, getOrderStats);
router.get("/admin", requireAuth, requireAdmin, getAllOrders);
router.patch("/update-status/:id", requireAuth, requireAdmin, updateStatus);

router.patch("/cancel/:id", requireAuth, cancelOrder);
router.patch("/complete/:id", requireAuth, completeOrder);

module.exports = router;
