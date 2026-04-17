import { test, expect } from '../../../fixtures/test-fixtures';

test.describe('Logout', () => {
  test('should logout successfully', async ({ authenticatedPage }) => {
    await authenticatedPage.logout();
    await expect(authenticatedPage.page).toHaveURL(/login/);
  });

  test('should not access protected routes after logout', async ({ authenticatedPage }) => {
    await authenticatedPage.logout();
    await authenticatedPage.page.goto('/dashboard');
    await expect(authenticatedPage.page).toHaveURL(/login/);
  });
});
