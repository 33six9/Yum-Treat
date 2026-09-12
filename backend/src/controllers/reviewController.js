const Review = require("../models/Review");
const Food = require("../models/Food");

// GET /api/reviews/  (protected — admin overview)
const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

// GET /api/reviews/user/:userID  (protected)
const getReviewsByUser = async (req, res, next) => {
    try {
        const reviews = await Review.find({ userID: req.params.userID }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

// GET /api/reviews/product/:productID  (protected)
const getReviewsByProduct = async (req, res, next) => {
    try {
        const reviews = await Review.find({ productID: req.params.productID }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

// POST /api/reviews/  and  POST /api/reviews/add-review  (protected)
const addReview = async (req, res, next) => {
    try {
        const { orderID, productID, rating, feedback, orderCompleteDate } = req.body;

        if (!orderID || !productID || !rating || !feedback) {
            return res.status(400).json({ message: "orderID, productID, rating and feedback are required" });
        }

        const review = await Review.create({
            orderID,
            userID: req.user.id,
            productID,
            rating,
            feedback,
            orderCompleteDate,
        });

        // Keep the food's aggregate rating roughly in sync
        const stats = await Review.aggregate([
            { $match: { productID: review.productID } },
            { $group: { _id: "$productID", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
        ]);
        if (stats.length > 0) {
            await Food.findByIdAndUpdate(review.productID, {
                rating: Math.round(stats[0].avgRating * 10) / 10,
                numberOfReviews: stats[0].count,
            });
        }

        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllReviews, getReviewsByUser, getReviewsByProduct, addReview };
