const mongoose = require("mongoose");

// `img` matches a filename (without extension) under
// frontend/src/assets/image/, e.g. "cat-1" -> cat-1.png
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        img: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
