// routes/userRoutes.ts

import express, { Request, Response } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import asyncHandler from '../utils/asyncHandler';
import { User } from '../types/User';
import admin from '../utils/firebaseAdmin';

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

router.post(
  '/profile-picture',
  authMiddleware,
  upload.single('profileImage'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: no user ID' });
      return;
    }

    const bucket = admin.storage().bucket();
    const fileName = `profileImages/${userId}_${uuidv4()}`;
    const file = bucket.file(fileName);

    // Upload file to storage
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
        cacheControl: 'public, max-age=3600',
      },
    });

    // Generate signed URL (valid for 1 hour)
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    // Save signedUrl to Firestore
    const updatedFields: Partial<User> = {
      profileImage: file.name,           // Storage path
      profileImageUrl: signedUrl,        // Readable URL for display
    };

    await admin.firestore().collection('authUsers').doc(userId).set(updatedFields, { merge: true });

    const userDoc = await admin.firestore().collection('authUsers').doc(userId).get();
    const updatedUser = userDoc.data() as User | undefined;

    res.status(200).json({
      message: 'Profile picture updated successfully',
      signedUrl,
      user: updatedUser,
    });
  })
);

export default router;
