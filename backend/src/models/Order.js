const mongoose = require("mongoose");

// Line items store a snapshot of the product at order time (name/price/image)
// rather than only a reference — so an order's receipt stays accurate even if
// the Food document's price or name changes later.
const orderedProductSchema = new mongoose.Schema(
    {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        name: { type: String, required: true },
        imageUrl: { type: String, default: "" },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1, default: 1 },
    },
    { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
    {
        status: { type: String, required: true },
        at: { type: Date, default: Date.now },
    },
    { _id: false }
);

const STATUSES = ["preparing", "ready", "out_for_delivery", "delivered", "cancel"];

const orderSchema = new mongoose.Schema(
    {
        // Short, human-friendly reference shown to customers/admins, e.g. "YT-4F92A1".
        orderNumber: { type: String, required: true, unique: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true },
        note: { type: String, default: "" },
        products: { type: [orderedProductSchema], required: true },
        // Computed server-side from the live Food prices at order time —
        // never trust a client-supplied total.
        subtotal: { type: Number, required: true, min: 0 },
        deliveryFee: { type: Number, required: true, min: 0, default: 2.99 },
        payed: { type: Number, required: true, min: 0 },
        paymentMethod: {
            type: String,
            enum: ["card", "cash", "bkash"],
            default: "cash",
        },
        status: {
            type: String,
            enum: STATUSES,
            default: "preparing",
        },
        statusHistory: { type: [statusHistorySchema], default: [] },
        cancelReason: { type: String, default: "" },
        isComplete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

orderSchema.index({ user_id: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ fullName: "text", phone: "text", orderNumber: "text" });

// Track every status transition so both customers and admins get a real
// timeline, not just the current snapshot.
orderSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("status")) {
        this.statusHistory.push({ status: this.status, at: new Date() });
    }
    next();
});

orderSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model("Order", orderSchema);
