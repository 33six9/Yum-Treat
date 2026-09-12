const notFound = (req, res, next) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(", ") });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(409).json({ message: `${field} already in use` });
    }

    if (err.name === "CastError") {
        return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
    }

    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Something went wrong" });
};

module.exports = { notFound, errorHandler };
