// ─── Auth API ────────────────────────────────────────────────────────────────

import { get, post } from './client';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  AuthMeResponse,
  ResetPasswordRequestPayload,
  ResetPasswordPayload,
} from '../types/api';

/**
 * Register a new user account.
 * Backend sets httpOnly session cookie on success.
 */
export function register(data: RegisterRequest): Promise<RegisterResponse> {
  return post<RegisterResponse>('/auth/register', data);
}

/**
 * Log in with email and password.
 * Backend sets httpOnly session cookie on success.
 */
export function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>('/auth/login', data);
}

/**
 * Log out and clear session cookie.
 */
export function logout(): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/logout');
}

/**
 * Get the currently authenticated user.
 * Uses the httpOnly cookie sent automatically.
 * Returns 401 if not authenticated.
 */
export function getMe(): Promise<AuthMeResponse> {
  return get<AuthMeResponse>('/auth/me');
}

/**
 * Initiate Google OAuth flow.
 * Returns the URL to redirect the user to.
 */
export function getGoogleOAuthUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL || '/api';
  return `${baseUrl}/auth/google`;
}

/**
 * Request a password reset email.
 */
export function requestPasswordReset(data: ResetPasswordRequestPayload): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/reset-password-request', data);
}

/**
 * Reset password using a token.
 */
export function resetPassword(data: ResetPasswordPayload): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/reset-password', data);
}
