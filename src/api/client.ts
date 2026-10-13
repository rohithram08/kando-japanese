// ─── Centralized HTTP Client ────────────────────────────────────────────────
// Single source of truth for all backend API communication.
// Handles: base URL, credentials, JSON, timeouts, error normalization.
// ─────────────────────────────────────────────────────────────────────────────

import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '../types/api';

// ─── Configuration ───────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const DEFAULT_TIMEOUT = 15_000; // 15 seconds

// ─── Error Types ─────────────────────────────────────────────────────────────

export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: unknown;

  constructor(status: number, message: string, code: string, details?: unknown) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Normalizes any AxiosError or network failure into a structured ApiRequestError.
 */
export function handleApiError(error: AxiosError<ApiErrorResponse> | Error): ApiRequestError {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    const serverError = data?.error;

    if (status === 401) {
      return new ApiRequestError(
        401,
        serverError?.message || 'Authentication required',
        serverError?.code || 'AUTH_REQUIRED',
        serverError?.details,
      );
    }

    if (status === 429) {
      return new ApiRequestError(
        429,
        serverError?.message || 'Too many requests — please wait',
        serverError?.code || 'RATE_LIMITED',
        serverError?.details,
      );
    }

    if (status === 400) {
      return new ApiRequestError(
        400,
        serverError?.message || 'Invalid request',
        serverError?.code || 'VALIDATION_ERROR',
        serverError?.details,
      );
    }

    if (status === 404) {
      return new ApiRequestError(
        404,
        serverError?.message || 'Resource not found',
        serverError?.code || 'NOT_FOUND',
        serverError?.details,
      );
    }

    if (status === 403) {
      return new ApiRequestError(
        403,
        serverError?.message || 'Access denied',
        serverError?.code || 'FORBIDDEN',
        serverError?.details,
      );
    }

    return new ApiRequestError(
      status,
      serverError?.message || 'An unexpected error occurred',
      serverError?.code || 'SERVER_ERROR',
      serverError?.details,
    );
  }

  // Network or other unexpected error
  return new ApiRequestError(
    0,
    error.message || 'Network error — please check your connection',
    'NETWORK_ERROR',
  );
}

// ─── Client Instance ─────────────────────────────────────────────────────────

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true, // Send httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Response Interceptor ────────────────────────────────────────────────────

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    throw handleApiError(error);
  },
);

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Typed GET request.
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await instance.get<T>(url, config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw handleApiError(error as any);
  }
}

/**
 * Typed POST request.
 */
export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await instance.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw handleApiError(error as any);
  }
}

/**
 * Typed PUT request.
 */
export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await instance.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw handleApiError(error as any);
  }
}

/**
 * Typed DELETE request.
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await instance.delete<T>(url, config);
    return response.data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw handleApiError(error as any);
  }
}

/**
 * Upload a file via multipart form data.
 */
export async function upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await instance.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30_000,
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiRequestError) throw error;
    throw handleApiError(error as any);
  }
}

export { instance as apiInstance };
