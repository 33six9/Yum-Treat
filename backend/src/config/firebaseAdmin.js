// firebase-admin v14+ uses modular subpath imports (mirrors the client SDK)
// rather than the old `admin.initializeApp()` / `admin.auth()` namespace API.
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let app;
if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // .env stores the private key with literal "\n" sequences; convert them
    // back into real newlines, which the PEM format requires.
    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
        console.warn(
            "[firebaseAdmin] Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY. " +
                "Auth-protected routes will fail to verify tokens until these are set in backend/.env."
        );
    }

    app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
    });
} else {
    app = getApps()[0];
}

const auth = getAuth(app);

module.exports = { auth };
