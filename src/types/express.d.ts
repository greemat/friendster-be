// types/express.d.ts
import { DecodedIdToken } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken; // The user object from Firebase Admin
    }
  }
}
