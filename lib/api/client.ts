/**
 * Central API client placeholder.
 *
 * This module provides a thin wrapper around fetch() so that service
 * implementations can be swapped from mock to real REST API calls
 * without touching UI components.
 *
 * Set NEXT_PUBLIC_API_BASE_URL in your environment to point at a
 * real backend. When unset, services fall back to mock data.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  if (!BASE_URL) {
    throw new Error(
      'API client is not configured. Set NEXT_PUBLIC_API_BASE_URL or use mock services.'
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
