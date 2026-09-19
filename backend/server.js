require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const authRoutes = require("./src/routes/authRoutes");
const foodRoutes = require("./src/routes/foodRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");

connectDB();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

// Matches http(s)://localhost:<any port> or http(s)://127.0.0.1:<any port> —
// covers Flutter web (flutter run -d chrome, random port each run), Vite,
// Next.js, etc. without needing CORS_ORIGIN updated every time a dev tool
// picks a new port.
const isLocalDevOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(
    cors({
        origin: (origin, callback) => {
            // No Origin header at all = same-origin request, server-to-server
            // call, curl, or a native mobile app (not subject to browser CORS
            // anyway) — always allow.
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`Not allowed by CORS: ${origin}`));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({ status: "ok", service: "yumtreat-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`YumTreat API listening on http://localhost:${PORT}`);
});
