import express, { Request, Response } from 'express';
import { db, auth } from '../firebase/firebaseAdmin';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// GET API key endpoint
router.get('/getApiKey', (req: Request, res: Response) => {
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }
  return res.json({ apiKey });
});

// POST submission endpoint
router.post('/', async (req: Request, res: Response) => {
  const { idToken, name, email, description, imageUrl } = req.body;

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const docRef = await db.collection('submissions').add({
      uid,
      name,
      email,
      description,
      imageUrl,
      createdAt: new Date()
    });

    return res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
});

export default router;
