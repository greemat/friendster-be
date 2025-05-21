//src/routes/submitForm.ts
import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from '../utils/firebaseAdmin'; // <-- import these

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/submitForm', upload.single('image'), async (req, res): Promise<void> => {
  try {
    const { name, email, description } = req.body;
    if (!name || !email || !description) {
      res.status(400).json({ error: 'Missing required fields' });
    }

    let imageUrl = '';

    if (req.file) {
      const file = req.file;
      const ext = file.originalname.split('.').pop() || 'jpg';
      const filename = `images/${uuidv4()}.${ext}`;
      const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET!);
      const fileRef = bucket.file(filename);

      //console.log("Uploading image to:", filename);
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });
      //console.log("Image uploaded.");

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
    //console.log("Firestore write complete")

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
