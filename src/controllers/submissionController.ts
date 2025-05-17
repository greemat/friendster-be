import { Request, Response, NextFunction } from 'express';

export const getApiKey = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'API key not set in environment' });
      return;
    }
    res.json({ apiKey });
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
