const mongoose = require("mongoose");

// `imageUrl` matches a filename (without extension) under
// frontend/src/assets/foods/, e.g. "burger-1" -> burger-1.png
//
// `category` is stored as the category NAME (string), not an id —
// this matches how the frontend's Menu/Category components filter
// foods (by category.name), so seeded/created foods must use the
// same category names as returned by GET /api/categories.
const foodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
        rating: { type: Number, min: 0, max: 5, default: 0 },
        numberOfReviews: { type: Number, default: 0 },
        currentPrice: { type: Number, required: true, min: 0 },
        pastPrice: { type: Number, min: 0 },
        category: { type: String, required: true, trim: true },
        tags: { type: [String], default: [] },
        customOrder: { type: Boolean, default: false },
        isAvailable: { type: Boolean, default: true },
        isPopular: { type: Boolean, default: false },
        isSpecial: { type: Boolean, default: false },
        isSuperDeals: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
