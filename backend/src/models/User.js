const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Firebase's stable user id (from the decoded ID token's `uid` claim).
        // This is the source of truth for "who is this" — replaces password auth.
        firebaseUid: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: { type: String, trim: true, default: "" },
        photoURL: { type: String, default: "" },
        // True for Firebase accounts verified via a provider (Google) or
        // email-link/OTP verification; mirrors the token's `email_verified` claim.
        emailVerified: { type: Boolean, default: false },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
