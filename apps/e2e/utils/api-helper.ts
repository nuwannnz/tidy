import { APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:4000';

/**
 * Registers a new user via the API and returns the token.
 */
export async function registerUser(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; email: string } }> {
  const response = await request.post(`${API_URL}/api/auth/register`, {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(`Registration failed: ${response.status()} ${await response.text()}`);
  }

  return response.json();
}

/**
 * Logs in a user via the API and returns the token.
 */
export async function loginUser(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<{ token: string }> {
  const response = await request.post(`${API_URL}/api/auth/login`, {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
  }

  return response.json();
}
