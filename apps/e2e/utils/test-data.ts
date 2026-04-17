/**
 * Generates a unique email address for test isolation.
 */
export function uniqueEmail(prefix = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
}

/**
 * Generates a unique project name for test isolation.
 */
export function uniqueProjectName(prefix = 'Test Project'): string {
  return `${prefix} ${Date.now().toString(36)}`;
}

/**
 * Default test user credentials (seeded in local dev).
 */
export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'password123',
} as const;
