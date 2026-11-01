import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { lessonsRouter } from './routes/lessons.js';
import { progressRouter } from './routes/progress.js';
import { srsRouter } from './routes/srs.js';
import { quizRouter } from './routes/quiz.js';
import { aiRouter } from './routes/ai.js';
import { senseiRouter } from './routes/sensei.js';

const app = express();

// Behind Vercel / any reverse proxy the real client IP arrives in X-Forwarded-For. Without this every
// visitor shares the proxy's IP (one global rate-limit bucket) and express-rate-limit throws.
app.set('trust proxy', 1);

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: env.CORS_ORIGINS.split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(generalLimiter);

// ─── Static Storage ──────────────────────────────────────────────────────────
// Same files under /api/storage so dev proxies / reverse proxies that only forward
// "/api" can serve uploaded avatars (the frontend resolves "/storage/…" to this).
const uploadsDir = path.resolve(process.cwd(), 'uploads');
app.use('/storage', express.static(uploadsDir));
app.use('/api/storage', express.static(uploadsDir));

// ─── Parsing ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
import { uploadRouter } from './routes/upload.js';
import { readingRouter } from './routes/reading.js';
import { leagueRouter } from './routes/league.js';
import { dictionaryRouter } from './routes/dictionary.js';
import { socialRouter } from './routes/social.js';
import { learningRouter } from './routes/learning.js';

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/srs', srsRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/ai', aiRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/sensei', senseiRouter);
app.use('/api/reading', readingRouter);
app.use('/api/dictionary', dictionaryRouter);
app.use('/api/league', leagueRouter);
app.use('/api/social', socialRouter);
app.use('/api/learning', learningRouter);

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────
// On Vercel the platform invokes the exported app per request (see ../api/index.ts); only bind a
// port when running as a long-lived server (local dev, Docker, Render, Fly, ...).
if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`🚀 Kando API running on http://localhost:${env.PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
  });
}

export default app;
