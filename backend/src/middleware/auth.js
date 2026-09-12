const { auth: firebaseAuth } = require("../config/firebaseAdmin");
const User = require("../models/User");

const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

// Verifies the Firebase ID token on every request and keeps our local
// User record (role, profile info) in sync with the Firebase account —
// there is no separate "register" endpoint; the first authenticated
// request from a new Firebase user provisions their local record.
// Attaches req.user = { id, firebaseUid, email, name, photoURL, role }.
const requireAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const idToken = header.startsWith("Bearer ") ? header.slice(7) : null;

        if (!idToken) {
            return res.status(401).json({ message: "No token provided" });
        }

        let decoded;
        try {
            decoded = await firebaseAuth.verifyIdToken(idToken);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const email = (decoded.email || "").toLowerCase();
        const shouldBeAdmin = email && adminEmails.includes(email);

        let user = await User.findOne({ firebaseUid: decoded.uid });

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email,
                name: decoded.name || "",
                photoURL: decoded.picture || "",
                emailVerified: !!decoded.email_verified,
                role: shouldBeAdmin ? "admin" : "user",
            });
        } else {
            // Keep profile fields fresh and never let them drift out of sync
            // with Firebase; only ever *promote* to admin here, never demote
            // an admin who was granted the role some other way.
            user.email = email || user.email;
            if (decoded.name) user.name = decoded.name;
            if (decoded.picture) user.photoURL = decoded.picture;
            user.emailVerified = !!decoded.email_verified;
            if (shouldBeAdmin && user.role !== "admin") user.role = "admin";
            await user.save();
        }

        req.user = {
            id: user._id.toString(),
            firebaseUid: user.firebaseUid,
            email: user.email,
            name: user.name,
            photoURL: user.photoURL,
            role: user.role,
        };
        next();
    } catch (err) {
        next(err);
    }
};

// Requires requireAuth to have run first; restricts to admin role.
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

module.exports = { requireAuth, requireAdmin };
