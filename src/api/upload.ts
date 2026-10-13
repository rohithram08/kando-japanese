// ─── Upload API ──────────────────────────────────────────────────────────────

import { upload, del } from './client';
import type { AvatarUploadResponse, AvatarDeleteResponse } from '../types/api';

/**
 * Upload a custom avatar image.
 * Server validates: file type (JPEG/PNG/WebP/GIF), size (2MB max),
 * content signature (magic bytes), and rejects dangerous extensions.
 */
export function uploadAvatar(file: File): Promise<AvatarUploadResponse> {
  const formData = new FormData();
  formData.append('avatar', file);
  return upload<AvatarUploadResponse>('/upload/avatar', formData);
}

/**
 * Delete the authenticated user's custom avatar.
 */
export function deleteAvatar(): Promise<AvatarDeleteResponse> {
  return del<AvatarDeleteResponse>('/upload/avatar');
}
