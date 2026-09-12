const Category = require("../models/Category");

// GET /api/categories
const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdAt: 1 });
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

// POST /api/categories  (used by seed/admin tooling)
const addCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
};

module.exports = { getCategories, addCategory };
