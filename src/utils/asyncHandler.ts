// utils/asyncHandler.ts
import { NextFunction, Request, Response, RequestHandler } from 'express';

/**
 * Wraps an async route handler to catch and forward errors to Express error handlers.
 */
export default function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
