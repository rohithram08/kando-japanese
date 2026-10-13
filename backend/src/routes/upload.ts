import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const uploadRouter = Router();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const FILE_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], 
};

function validateFileSignature(buffer: Buffer, mimeType: string): boolean {
  const signatures = FILE_SIGNATURES[mimeType];
  if (!signatures) return false;
  return signatures.some(sig =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new AppError(400, 'Only JPEG, PNG, WebP, and GIF images are allowed', 'INVALID_FILE_TYPE') as any);
      return;
    }
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    const dangerousExts = ['exe', 'bat', 'cmd', 'sh', 'php', 'js', 'html', 'svg'];
    if (ext && dangerousExts.includes(ext)) {
      cb(new AppError(400, 'File type not allowed', 'DANGEROUS_EXTENSION') as any);
      return;
    }
    cb(null, true);
  },
});

uploadRouter.post('/avatar', requireAuth, upload.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No file provided', 'NO_FILE');
    }

    const userId = req.user!.userId;

    if (!validateFileSignature(req.file.buffer, req.file.mimetype)) {
      throw new AppError(400, 'File content does not match declared type', 'INVALID_FILE_CONTENT');
    }

    const ext = req.file.mimetype.split('/')[1] || 'jpg';
    const safeKey = `avatars/${userId}/${uuidv4()}.${ext}`;

    const avatarUrl = `/storage/${safeKey}`;

    await db.update(users)
      .set({ avatarUrl, avatarId: safeKey })
      .where(eq(users.id, userId));

    res.json({ url: avatarUrl, key: safeKey });
  } catch (err) {
    next(err);
  }
});

uploadRouter.delete('/avatar', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { avatarId: true },
    });

    if (user?.avatarId) {
      // await storageClient.delete(user.avatarId);
    }

    await db.update(users)
      .set({ avatarUrl: null, avatarId: null })
      .where(eq(users.id, userId));

    res.json({ message: 'Avatar removed' });
  } catch (err) {
    next(err);
  }
});
