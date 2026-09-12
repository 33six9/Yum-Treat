const express = require("express");
const {
    getFoods,
    getFoodById,
    addFood,
    updateFood,
    deleteFood,
} = require("../controllers/foodController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getFoods);
router.get("/:id", getFoodById);
router.post("/add", requireAuth, requireAdmin, addFood);
router.put("/update/:id", requireAuth, requireAdmin, updateFood);
router.delete("/delete/:id", requireAuth, requireAdmin, deleteFood);

module.exports = router;
