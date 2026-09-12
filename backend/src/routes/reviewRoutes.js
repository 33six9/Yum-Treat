const express = require("express");
const {
    getAllReviews,
    getReviewsByUser,
    getReviewsByProduct,
    addReview,
} = require("../controllers/reviewController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, getAllReviews);
router.get("/user/:userID", requireAuth, getReviewsByUser);
router.get("/product/:productID", requireAuth, getReviewsByProduct);
router.post("/", requireAuth, addReview);
router.post("/add-review", requireAuth, addReview); // alias used by ReviewForm.jsx

module.exports = router;
