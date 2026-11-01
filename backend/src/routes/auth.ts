import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { eq, sql } from 'drizzle-orm';
import { createHash, randomBytes } from 'node:crypto';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { env } from '../config/env.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { serializeProfile } from '../services/userSerializer.js';
import { sendEmail } from '../services/emailService.js';

export const authRouter = Router();

const cookieBase = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

function signSession(userId: string, email: string): string {
  return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

/** Sets the session cookie; its lifetime always matches the JWT's own expiry (JWT_EXPIRES_IN). */
function setSessionCookie(res: import('express').Response, token: string): void {
  const exp = (jwt.decode(token) as { exp?: number } | null)?.exp;
  const maxAge = exp ? Math.max(0, exp * 1000 - Date.now()) : 7 * 24 * 60 * 60 * 1000;
  res.cookie('token', token, { ...cookieBase, maxAge });
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const emailEquals = (email: string) => sql`lower(${users.email}) = ${email}`;

/** Fingerprint of the current password hash: a reset token stops working once the password changes. */
const pwdFingerprint = (hash: string) => createHash('sha256').update(hash || 'none').digest('hex').slice(0, 16);
const MIN_PASSWORD_LENGTH = 8;

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(2).max(100),
    // Self-declared starting level from the sign-up wizard; sets the initial study level.
    currentLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']).optional(),
  }),
});

authRouter.post('/register', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { password, username } = req.body;
    const email = normalizeEmail(req.body.email);

    // Check if user exists (case-insensitive)
    const existing = await db.query.users.findFirst({
      where: emailEquals(email),
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
      // Initial verified study level is always N5. Higher levels require passing placement qualification test.
      studyLevel: 'N5',
      currentLevel: 'N5',
    });

    setSessionCookie(res, signSession(userId, email));

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
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    const user = await db.query.users.findFirst({
      where: emailEquals(email),
    });
    
    if (!user) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    setSessionCookie(res, signSession(user.id, user.email));

    res.json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token', cookieBase);
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
    
    // Omit password hash, parse avatarConfig
    res.json(serializeProfile(user));
  } catch (err) {
    next(err);
  }
});

const resetRequestSchema = z.object({ body: z.object({ email: z.string().email() }) });
const resetSchema = z.object({
  body: z.object({ token: z.string().min(10), newPassword: z.string().min(MIN_PASSWORD_LENGTH).max(200) }),
});

const GENERIC_RESET_REPLY = { message: 'If an account exists for that email, a reset link has been sent.' };

authRouter.post('/reset-password-request', authLimiter, validate(resetRequestSchema), async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await db.query.users.findFirst({ where: emailEquals(email) });

    // Identical response whether or not the account exists (no email enumeration), and the token is
    // NEVER returned to the caller - it is only delivered to the mailbox that owns the account.
    if (!user) return res.json(GENERIC_RESET_REPLY);

    const token = jwt.sign(
      { userId: user.id, email: user.email, type: 'pwd_reset', pwv: pwdFingerprint(user.passwordHash) },
      env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    const resetUrl = `${env.FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;

    const sent = await sendEmail({
      to: user.email,
      subject: 'Reset your Kando Japanese password',
      text: `Someone asked to reset the password for your Kando Japanese account.\n\nOpen this link within 1 hour:\n${resetUrl}\n\nIf this wasn't you, ignore this email - your password stays the same.`,
    });

    // Local development only, when no email provider is configured: print the link to the server console.
    if (!sent && env.NODE_ENV !== 'production') console.log(`🔑 [dev] Password reset link for ${user.email}: ${resetUrl}`);
    if (!sent && env.NODE_ENV === 'production') console.error('[auth] RESEND_API_KEY is not set: password reset emails cannot be delivered');

    res.json(GENERIC_RESET_REPLY);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/reset-password', authLimiter, validate(resetSchema), async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    let decoded: { type?: string; userId?: string; pwv?: string };
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as typeof decoded;
    } catch {
      throw new AppError(400, 'Invalid or expired reset token', 'INVALID_TOKEN');
    }
    if (decoded.type !== 'pwd_reset' || !decoded.userId) {
      throw new AppError(400, 'Invalid reset token', 'INVALID_TOKEN');
    }

    const user = await db.query.users.findFirst({ where: eq(users.id, decoded.userId) });
    // Single use: the token embeds a fingerprint of the old password hash, which changes below.
    if (!user || decoded.pwv !== pwdFingerprint(user.passwordHash)) {
      throw new AppError(400, 'This reset link has already been used or has expired', 'INVALID_TOKEN');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
});

// Google OAuth
authRouter.get('/google', (req, res, next) => {
  try {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_CALLBACK_URL) {
      throw new AppError(501, 'Google OAuth is not configured', 'NOT_IMPLEMENTED');
    }

    const state = randomBytes(16).toString('hex');
    res.cookie('oauth_state', state, { ...cookieBase, maxAge: 10 * 60 * 1000 });
    const params = new URLSearchParams({
      state,
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
    // CSRF protection: the state we issued must come back unchanged.
    const expectedState = req.cookies?.oauth_state;
    if (!expectedState || expectedState !== req.query.state) {
      throw new AppError(400, 'Invalid OAuth state', 'INVALID_STATE');
    }
    res.clearCookie('oauth_state', cookieBase);

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
    // Linking by email is only safe when Google has verified that address.
    if (googleUser.verified_email !== true) {
      throw new AppError(400, 'Your Google email address is not verified', 'EMAIL_NOT_VERIFIED');
    }
    googleUser.email = normalizeEmail(googleUser.email);

    // Find or create user
    let user = await db.query.users.findFirst({
      where: (users, { or, eq }) => or(
        eq(users.googleId, googleUser.id),
        emailEquals(googleUser.email)
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

    setSessionCookie(res, signSession(user.id, user.email));

    res.redirect(env.FRONTEND_URL);
  } catch (err) {
    next(err);
  }
});
