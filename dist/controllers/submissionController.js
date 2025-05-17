"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseConfig = void 0;
const getFirebaseConfig = async (req, res, next) => {
    try {
        const { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID, } = process.env;
        if (!FIREBASE_API_KEY ||
            !FIREBASE_AUTH_DOMAIN ||
            !FIREBASE_PROJECT_ID ||
            !FIREBASE_STORAGE_BUCKET ||
            !FIREBASE_MESSAGING_SENDER_ID ||
            !FIREBASE_APP_ID ||
            !FIREBASE_MEASUREMENT_ID) {
            res.status(500).json({ error: 'Missing one or more Firebase config values in environment' });
            return;
        }
        res.json({
            apiKey: FIREBASE_API_KEY,
            authDomain: FIREBASE_AUTH_DOMAIN,
            projectId: FIREBASE_PROJECT_ID,
            storageBucket: FIREBASE_STORAGE_BUCKET,
            messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
            appId: FIREBASE_APP_ID,
            measurementId: FIREBASE_MEASUREMENT_ID,
        });
    }
    catch (error) {
        console.error('Error fetching Firebase config:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getFirebaseConfig = getFirebaseConfig;
