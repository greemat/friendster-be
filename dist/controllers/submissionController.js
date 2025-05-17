"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiKey = void 0;
const getApiKey = async (req, res) => {
    try {
        const apiKey = process.env.FIREBASE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not set in environment' });
        }
        return res.json({ apiKey });
    }
    catch (error) {
        console.error('Error fetching API key:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getApiKey = getApiKey;
