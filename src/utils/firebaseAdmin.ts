// Initializes Firebase Admin SDK with service account credentials.

import * as admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json';

const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

if (!admin.apps.length) {
  //console.log('🪣 Initializing Firebase Admin with bucket:', bucketName);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: bucketName, 
  });
}

export default admin;
export const firestore = admin.firestore();
export const storage = admin.storage();
