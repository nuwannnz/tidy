import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly logoutButton: Locator;
  readonly projectList: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: /dashboard/i });
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    this.projectList = page.getByTestId('project-list');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async logout() {
    await this.logoutButton.click();
  }
}
