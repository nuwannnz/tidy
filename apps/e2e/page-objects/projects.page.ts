import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProjectsPage extends BasePage {
  readonly createButton: Locator;
  readonly projectList: Locator;
  readonly projectNameInput: Locator;
  readonly projectColorInput: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: import('@playwright/test').Page) {
    super(page);
    this.createButton = page.getByRole('button', { name: /create|new project/i });
    this.projectList = page.getByTestId('project-list');
    this.projectNameInput = page.getByLabel('Project Name');
    this.projectColorInput = page.getByTestId('project-color-picker');
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.deleteButton = page.getByRole('button', { name: /delete/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
  }

  async goto() {
    await this.page.goto('/projects');
  }

  async createProject(name: string) {
    await this.createButton.click();
    await this.projectNameInput.fill(name);
    await this.saveButton.click();
  }

  getProjectByName(name: string): Locator {
    return this.projectList.getByText(name);
  }
}
