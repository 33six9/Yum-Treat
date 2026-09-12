const express = require("express");
const { getAccount } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Sign-up/sign-in happen client-side via the Firebase SDK. This is the only
// auth route left server-side: it verifies the Firebase ID token, syncs the
// local user record, and returns the resulting profile (incl. role).
router.get("/account", requireAuth, getAccount);

module.exports = router;
