import { test, expect } from '../../../fixtures/test-fixtures';
import { uniqueEmail } from '../../../utils/test-data';

test.describe('Register', () => {
  test('should display registration form', async ({ registerPage }) => {
    await registerPage.goto();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
  });

  test('should register a new user successfully', async ({ registerPage, page }) => {
    await registerPage.goto();
    await registerPage.register(uniqueEmail(), 'password123');
    await expect(page).toHaveURL(/dashboard|login/);
  });

  test('should show error for mismatched passwords', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.register(uniqueEmail(), 'password123', 'differentpassword');
    await expect(registerPage.errorMessage).toBeVisible();
  });

  test('should navigate to login page', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.loginLink.click();
    await expect(registerPage.page).toHaveURL(/login/);
  });
});
