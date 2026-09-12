const Food = require("../models/Food");

// GET /api/foods
const getFoods = async (req, res, next) => {
    try {
        const foods = await Food.find().sort({ createdAt: -1 });
        res.json(foods);
    } catch (err) {
        next(err);
    }
};

// GET /api/foods/:id
const getFoodById = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ message: "Food item not found" });
        res.json(food);
    } catch (err) {
        next(err);
    }
};

// POST /api/foods/add
const addFood = async (req, res, next) => {
    try {
        const food = await Food.create(req.body);
        res.status(201).json(food);
    } catch (err) {
        next(err);
    }
};

// PUT /api/foods/update/:id
const updateFood = async (req, res, next) => {
    try {
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!food) return res.status(404).json({ message: "Food item not found" });
        res.json(food);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/foods/delete/:id
const deleteFood = async (req, res, next) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);
        if (!food) return res.status(404).json({ message: "Food item not found" });
        res.json({ message: "Food item deleted", _id: req.params.id });
    } catch (err) {
        next(err);
    }
};

module.exports = { getFoods, getFoodById, addFood, updateFood, deleteFood };
