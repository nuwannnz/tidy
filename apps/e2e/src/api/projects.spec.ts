import { test, expect } from '../../fixtures/api-fixtures';
import { uniqueProjectName } from '../../utils/test-data';

test.describe('Projects API', () => {
  test('should create a new project', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.post('/api/projects', {
      data: {
        name: uniqueProjectName(),
      },
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.name).toBeDefined();
  });

  test('should list projects', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/projects');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('should reject unauthenticated access', async ({ request }) => {
    const response = await request.get('/api/projects');

    expect(response.status()).toBe(401);
  });
});
