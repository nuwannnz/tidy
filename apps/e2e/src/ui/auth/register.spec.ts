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

  test('AC-1: should register a new user and redirect to dashboard', async ({ registerPage, page }) => {
    await registerPage.goto();
    await registerPage.register(uniqueEmail(), 'SecurePass123!');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('AC-2: should show error when email already registered', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.register(uniqueEmail(), 'password123', 'differentpassword');
    await expect(registerPage.errorMessage).toBeVisible();
  });

  test('AC-3: should show error for password shorter than 8 characters', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.emailInput.fill('valid@example.com');
    await registerPage.passwordInput.fill('short');
    await registerPage.confirmPasswordInput.fill('short');
    await registerPage.registerButton.click();
    await expect(registerPage.page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('AC-4: should show error for invalid email format', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.emailInput.fill('invalid-email');
    await registerPage.passwordInput.fill('SecurePass123!');
    await registerPage.confirmPasswordInput.fill('SecurePass123!');
    await registerPage.registerButton.click();
    await expect(registerPage.page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('AC-5: should show validation errors for empty fields', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.registerButton.click();
    await expect(registerPage.page.getByText('Please enter a valid email address')).toBeVisible();
    await expect(registerPage.page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('TC-06: should toggle password visibility', async ({ registerPage }) => {
    await registerPage.goto();
    await registerPage.passwordInput.fill('MyPassword123!');

    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = registerPage.page.getByTestId('register-password-visibility');
    await toggleButton.click();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'text');

    await toggleButton.click();
    await expect(registerPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('EC-03: should disable submit button during form submission', async ({ registerPage, page }) => {
    await registerPage.goto();

    await page.route('**/api/auth/register', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.continue();
    });

    await registerPage.emailInput.fill(uniqueEmail());
    await registerPage.passwordInput.fill('SecurePass123!');
    await registerPage.confirmPasswordInput.fill('SecurePass123!');
    await registerPage.registerButton.click();

    await expect(registerPage.registerButton).toBeDisabled();
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
