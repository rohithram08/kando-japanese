import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';

export interface AuthPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    // Check cookie first, then Authorization header
    const token = req.cookies?.token || extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN'));
      return;
    }
    next(error);
  }
}

function extractBearerToken(header?: string): string | null {
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7);
}

/**
 * Like requireAuth but never rejects: attaches req.user when a valid token is present and
 * continues anonymously otherwise. For endpoints that are public but personalise for members.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.token || extractBearerToken(req.headers.authorization);
    if (token) req.user = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  } catch {
    // invalid / expired token: treat as anonymous
  }
  next();
}
