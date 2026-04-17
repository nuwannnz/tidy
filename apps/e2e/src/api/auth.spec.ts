import { test, expect } from '../../fixtures/api-fixtures';
import { uniqueEmail, TEST_USER } from '../../utils/test-data';

test.describe('Auth API', () => {
  test('should register a new user', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        email: uniqueEmail(),
        password: 'password123',
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.token).toBeDefined();
  });

  test('should reject registration with existing email', async ({ request }) => {
    const email = uniqueEmail();

    // Register first time
    await request.post('/api/auth/register', {
      data: { email, password: 'password123' },
    });

    // Attempt duplicate registration
    const response = await request.post('/api/auth/register', {
      data: { email, password: 'password123' },
    });

    expect(response.status()).toBe(409);
  });

  test('should login with valid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: TEST_USER.email,
        password: TEST_USER.password,
      },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.token).toBeDefined();
  });

  test('should reject login with invalid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      },
    });

    expect(response.ok()).toBeFalsy();
  });

  test('should reject registration with invalid email', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        email: 'not-an-email',
        password: 'password123',
      },
    });

    expect(response.ok()).toBeFalsy();
  });
});
