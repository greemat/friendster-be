import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import admin from '../utils/firebaseAdmin';

const db = admin.firestore();

const asyncHandler = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const signToken = (payload: object, expiresIn: string, secretEnvVar: string): string => {
  const secret = process.env[secretEnvVar];
  if (!secret) {
    throw new Error(`${secretEnvVar} is not defined`);
  }
  return (jwt.sign as any)(payload, secret, { expiresIn });
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' });
    return;
  }

  try {
    const userRecord = await admin.auth().createUser({ email, password });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('authUsers').doc(userRecord.uid).set({ hashedPassword });

    // Create access and refresh tokens
    const accessToken = signToken({ uid: userRecord.uid, email }, '15m', 'JWT_SECRET');
    const refreshToken = signToken({ uid: userRecord.uid, email }, '7d', 'JWT_REFRESH_SECRET');

    // Store refresh token in Firestore
    await db.collection('refreshTokens').doc(userRecord.uid).set({ token: refreshToken });

    res.status(201).json({ token: accessToken, refreshToken });
    return;
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      res.status(409).json({ error: 'Email already registered' });
      return;
    } else {
      console.error(err);
      res.status(500).json({ error: err.message || 'Internal server error' });
      return;
    }
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' });
    return;
  }

  const userRecord = await admin.auth().getUserByEmail(email).catch(() => null);
  if (!userRecord) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const userDoc = await db.collection('authUsers').doc(userRecord.uid).get();
  const userData = userDoc.data();
  if (!userData?.hashedPassword) {
    res.status(400).json({ error: 'No password set for this user' });
    return;
  }

  const isMatch = await bcrypt.compare(password, userData.hashedPassword);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // Create access and refresh tokens
  const accessToken = signToken({ uid: userRecord.uid, email }, '15m', 'JWT_SECRET');
  const refreshToken = signToken({ uid: userRecord.uid, email }, '7d', 'JWT_REFRESH_SECRET');

  // Store refresh token in Firestore
  await db.collection('refreshTokens').doc(userRecord.uid).set({ token: refreshToken });

  res.status(200).json({ token: accessToken, refreshToken });
  return;
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token required' });
    return;
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
    return;
  }

  const storedTokenDoc = await db.collection('refreshTokens').doc(decoded.uid).get();
  if (!storedTokenDoc.exists) {
    res.status(401).json({ error: 'Refresh token revoked' });
    return;
  }
  const storedToken = storedTokenDoc.data()?.token;
  if (storedToken !== refreshToken) {
    res.status(401).json({ error: 'Refresh token mismatch' });
    return;
  }

  // Issue new access token
  const accessToken = signToken({ uid: decoded.uid, email: decoded.email }, '15m', 'JWT_SECRET');

  res.status(200).json({ token: accessToken, refreshToken });

  return;
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // You can pass refresh token in body or auth header
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token required' });
    return;
  }

  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, refreshSecret);
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
    return;
  }

  // Delete refresh token from Firestore (revoke it)
  await db.collection('refreshTokens').doc(decoded.uid).delete();

  res.status(200).json({ message: 'Logged out successfully' });
  return;
});

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  let decoded: any;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    decoded = jwt.verify(token, secret);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const user = await admin.auth().getUser(decoded.uid);
  res.status(200).json({ email: user.email, uid: user.uid });
  return;
});
