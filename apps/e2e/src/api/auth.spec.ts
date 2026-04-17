import { test, expect } from '../../fixtures/api-fixtures';
import { uniqueEmail, TEST_USER } from '../../utils/test-data';

test.describe('Auth API', () => {
  test.describe('POST /api/auth/register', () => {
    test('AC-1: should register a new user and return user + token', async ({ request }) => {
      const email = uniqueEmail();
      const response = await request.post('/api/auth/register', {
        data: { email, password: 'SecurePass123!' },
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data.user.id).toBeDefined();
      expect(data.user.email).toBe(email);
      expect(data.user.createdAt).toBeDefined();
      expect(data.token).toBeDefined();
      expect(data.user.passwordHash).toBeUndefined();
    });

    test('AC-2: should reject registration with duplicate email (409)', async ({ request }) => {
      const email = uniqueEmail();

      await request.post('/api/auth/register', {
        data: { email, password: 'SecurePass123!' },
      });

      const response = await request.post('/api/auth/register', {
        data: { email, password: 'SecurePass123!' },
      });

      expect(response.status()).toBe(409);
    });

    test('AC-3: should reject password shorter than 8 characters (400)', async ({ request }) => {
      const response = await request.post('/api/auth/register', {
        data: { email: uniqueEmail(), password: 'short' },
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.errors).toBeDefined();
    });

    test('AC-4: should reject invalid email format (400)', async ({ request }) => {
      const response = await request.post('/api/auth/register', {
        data: { email: 'not-an-email', password: 'SecurePass123!' },
      });

      expect(response.status()).toBe(400);
    });

    test('AC-5: should reject empty email and password (400)', async ({ request }) => {
      const response = await request.post('/api/auth/register', {
        data: { email: '', password: '' },
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.errors).toBeDefined();
    });

    test('EC-07: should reject XSS attempt in email field', async ({ request }) => {
      const response = await request.post('/api/auth/register', {
        data: {
          email: '<script>alert("x")</script>@example.com',
          password: 'SecurePass123!',
        },
      });

      expect(response.ok()).toBeFalsy();
    });
  });

  test.describe('POST /api/auth/login', () => {
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
  });
});
