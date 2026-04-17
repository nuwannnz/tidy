import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(readonly page: Page) {}

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  getURL(): string {
    return this.page.url();
  }
}
