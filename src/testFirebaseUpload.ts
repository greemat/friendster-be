// Test for Firebase Uploads, can be used as entry point to bypass main app.

require('dotenv').config(); // ✅ load env vars
import * as fs from 'fs';
import * as path from 'path';
import admin from './utils/firebaseAdmin';

async function testFirebaseUpload() {
  try {
    const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const testFilename = 'test-upload.txt';
    const destination = `test/${Date.now()}-${testFilename}`;
    const localFilePath = path.join(__dirname, testFilename);

    // Create a dummy file to upload
    fs.writeFileSync(localFilePath, 'This is a test upload file for Firebase Storage');

    console.log('Uploading test file to:', destination);
    await bucket.upload(localFilePath, {
      destination,
      metadata: {
        contentType: 'text/plain',
      },
    });

    const [signedUrl] = await bucket.file(destination).getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    console.log('✅ Upload succeeded. Access URL:', signedUrl);
    fs.unlinkSync(localFilePath); // Clean up local test file
  } catch (err) {
    console.error('❌ Upload failed:', err);
  }
}

testFirebaseUpload();
