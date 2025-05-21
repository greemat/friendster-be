import express, { Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../utils/firebaseAdmin';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

const requiredFirebaseConfigKeys = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
];

function getFirebaseConfig() {
  const config: Record<string, string> = {};

  for (const key of requiredFirebaseConfigKeys) {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required Firebase config environment variable: ${key}`);
    }
    // Convert env key to camelCase client key (e.g. FIREBASE_API_KEY -> apiKey)
    const clientKey = key
      .replace('FIREBASE_', '')
      .replace(/_(.)/g, (_, c) => c.toUpperCase())
      .replace(/^./, (c) => c.toLowerCase());

    config[clientKey] = value;
  }

  return config;
}

router.get('/firebase-config', (req, res) => {
  try {
    const config = getFirebaseConfig();
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/submitForm', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, description } = req.body;
    const file = req.file;

    if (!name || !email || !description) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    /*
    console.log('Form Submission:', { name, email, description });
    if (file) {
      console.log('Received file:', file.originalname);
    }
    */

    let imageUrl = '';

    if (file) {
      const ext = file.originalname.split('.').pop() || 'jpg';
      const filename = `images/${uuidv4()}.${ext}`;
      const bucket = storage.bucket();
      const fileRef = bucket.file(filename);

      //console.log('Uploading image to:', filename);
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      //console.log('Image uploaded.');

      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
      imageUrl = signedUrl;
    }

    await firestore.collection('submissions').add({
      name,
      email,
      description,
      imageUrl,
      createdAt: new Date(),
    });
    //console.log('Firestore write complete');

    res.status(200).json({
      message: 'Submission successful',
      savedData: { name, email, description, imageUrl },
    });
  } catch (err) {
    //console.error('Error in /submitForm:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
