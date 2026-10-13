// ─── API Barrel Export ───────────────────────────────────────────────────────
// Import API modules via: import { authApi, progressApi } from '@/api';

export * as authApi from './auth';
export * as usersApi from './users';
export * as lessonsApi from './lessons';
export * as progressApi from './progress';
export * as srsApi from './srs';
export * as quizApi from './quiz';
export * as aiApi from './ai';
export * as uploadApi from './upload';
export * as senseiApi from './sensei';

// Re-export client utilities for edge cases
export { ApiRequestError } from './client';
