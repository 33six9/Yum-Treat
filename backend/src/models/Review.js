const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        orderID: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        productID: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        feedback: { type: String, required: true, trim: true },
        orderCompleteDate: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
