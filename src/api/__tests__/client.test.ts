import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, post, ApiRequestError, handleApiError, apiInstance } from '../client';
import type { AxiosError } from 'axios';

describe('API Client & Error Handler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('performs typed GET requests successfully', async () => {
    const mockData = { id: '123', username: 'testuser' };
    vi.spyOn(apiInstance, 'get').mockResolvedValueOnce({ data: mockData });

    const result = await get<{ id: string; username: string }>('/users/profile');
    expect(result).toEqual(mockData);
  });

  it('performs typed POST requests with payload', async () => {
    const mockPayload = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { message: 'Success' };
    const postSpy = vi.spyOn(apiInstance, 'post').mockResolvedValueOnce({ data: mockResponse });

    const result = await post<{ message: string }>('/auth/login', mockPayload);
    expect(postSpy).toHaveBeenCalledWith('/auth/login', mockPayload, undefined);
    expect(result).toEqual(mockResponse);
  });

  it('transforms 401 response into ApiRequestError', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 401,
        data: { error: { message: 'Authentication required', code: 'AUTH_REQUIRED' } },
      },
    } as unknown as AxiosError;

    const error = handleApiError(axiosError);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(401);
    expect(error.code).toBe('AUTH_REQUIRED');
    expect(error.message).toBe('Authentication required');
  });

  it('transforms 429 response into ApiRequestError with rate limit code', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 429,
        data: { error: { message: 'Too many requests — please wait', code: 'RATE_LIMITED' } },
      },
    } as unknown as AxiosError;

    const error = handleApiError(axiosError);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(429);
    expect(error.code).toBe('RATE_LIMITED');
  });

  it('transforms 400 validation response into ApiRequestError with details', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          error: {
            message: 'Invalid request',
            code: 'VALIDATION_ERROR',
            details: { email: ['Invalid email address'] },
          },
        },
      },
    } as unknown as AxiosError;

    const error = handleApiError(axiosError);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.details).toEqual({ email: ['Invalid email address'] });
  });

  it('handles network disconnection gracefully', () => {
    const networkError = new Error('Network Error');
    const error = handleApiError(networkError);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(0);
    expect(error.code).toBe('NETWORK_ERROR');
  });
});
