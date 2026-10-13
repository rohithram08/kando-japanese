import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { env } from '../config/env.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { authLimiter } from '../middleware/rateLimit.js';

export const authRouter = Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(2).max(100),
  }),
});

authRouter.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    
    // Check if user exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (existing) {
      throw new AppError(400, 'User with this email already exists', 'USER_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const userId = uuidv4();
    await db.insert(users).values({
      id: userId,
      email,
      username,
      passwordHash,
    });

    const token = jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: '7d' as jwt.SignOptions['expiresIn'] });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});

authRouter.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (!user) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '7d' as jwt.SignOptions['expiresIn'] });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }
    
    // Omit password hash
    const { passwordHash, ...profile } = user;
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/reset-password-request', authLimiter, (req, res) => {
  // TODO: implement reset logic
  res.json({ message: 'If an account exists, a reset link will be sent.' });
});

authRouter.post('/reset-password', authLimiter, (req, res) => {
  // TODO: implement reset logic
  res.json({ message: 'Password reset functionality stub.' });
});

// Google OAuth
authRouter.get('/google', (req, res, next) => {
  try {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
      throw new AppError(501, 'Google OAuth is not configured', 'NOT_IMPLEMENTED');
    }

    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_CALLBACK_URL,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  } catch (err) {
    next(err);
  }
});

authRouter.get('/google/callback', async (req, res, next) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      throw new AppError(400, 'No code provided', 'INVALID_REQUEST');
    }

    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
      throw new AppError(501, 'Google OAuth is not configured', 'NOT_IMPLEMENTED');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: env.GOOGLE_CALLBACK_URL,
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new AppError(400, 'Failed to exchange token', 'OAUTH_ERROR');
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();
    if (!userResponse.ok || !googleUser.email) {
      throw new AppError(400, 'Failed to fetch user profile', 'OAUTH_ERROR');
    }

    // Find or create user
    let user = await db.query.users.findFirst({
      where: (users, { or, eq }) => or(
        eq(users.googleId, googleUser.id),
        eq(users.email, googleUser.email)
      )
    });

    if (!user) {
      const userId = uuidv4();
      await db.insert(users).values({
        id: userId,
        email: googleUser.email,
        username: googleUser.name || googleUser.email.split('@')[0],
        passwordHash: '', // Empty password hash for OAuth users
        googleId: googleUser.id,
        avatarUrl: googleUser.picture,
      });
      user = (await db.query.users.findFirst({ where: eq(users.id, userId) }))!;
    } else if (!user.googleId) {
      await db.update(users)
        .set({ googleId: googleUser.id })
        .where(eq(users.id, user.id));
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      env.JWT_SECRET, 
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect(env.FRONTEND_URL);
  } catch (err) {
    next(err);
  }
});
