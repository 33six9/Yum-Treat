// Sign-up / sign-in now happen client-side against Firebase Authentication
// (see frontend/lib/firebase.js). This controller only ever deals with an
// already-verified request — requireAuth has already verified the Firebase
// ID token and upserted/synced the local User record onto req.user.

// GET /api/auth/account  (protected)
// Also doubles as the "sync" call the frontend makes right after a
// Firebase sign-in, since requireAuth already provisioned the user.
const getAccount = async (req, res) => {
    res.json({ profileDetails: req.user });
};

module.exports = { getAccount };
