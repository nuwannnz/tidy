import { test as base, expect, APIRequestContext } from '@playwright/test';

type APIFixtures = {
  authenticatedRequest: APIRequestContext;
};

export const test = base.extend<APIFixtures>({
  authenticatedRequest: async ({ playwright }, use) => {
    const apiURL = process.env.API_URL || 'http://localhost:4000';

    const context = await playwright.request.newContext({
      baseURL: apiURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });

    // Login to get a token
    const loginResponse = await context.post('/api/auth/login', {
      data: {
        email: process.env.TEST_USER_EMAIL || 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'password123',
      },
    });

    if (loginResponse.ok()) {
      const { token } = await loginResponse.json();
      const authenticatedContext = await playwright.request.newContext({
        baseURL: apiURL,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      await use(authenticatedContext);
      await authenticatedContext.dispose();
    } else {
      // Fall back to unauthenticated context if login fails
      await use(context);
    }

    await context.dispose();
  },
});

export { expect };
