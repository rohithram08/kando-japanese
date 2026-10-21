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
app.use('/storage', express.static(path.resolve(process.cwd(), 'uploads')));

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

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`🚀 Nihongo API running on http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
});

export default app;
