const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not set. Copy .env.example to .env and fill it in.");
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (err) {
        console.error(`Failed to connect to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
