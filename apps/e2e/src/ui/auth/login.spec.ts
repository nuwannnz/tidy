import { test, expect } from '../../../fixtures/test-fixtures';

test.describe('Login', () => {
  test('should display login form', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.heading).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register page', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.registerLink.click();
    await expect(loginPage.page).toHaveURL(/register/);
  });
});
