import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { RegisterPage } from '../page-objects/register.page';
import { DashboardPage } from '../page-objects/dashboard.page';
import { ProjectsPage } from '../page-objects/projects.page';

type UIFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dashboardPage: DashboardPage;
  projectsPage: ProjectsPage;
  authenticatedPage: DashboardPage;
};

export const test = base.extend<UIFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  projectsPage: async ({ page }, use) => {
    await use(new ProjectsPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USER_EMAIL || 'test@example.com',
      process.env.TEST_USER_PASSWORD || 'password123'
    );
    await expect(page).toHaveURL(/dashboard/);
    await use(new DashboardPage(page));
  },
});

export { expect };
