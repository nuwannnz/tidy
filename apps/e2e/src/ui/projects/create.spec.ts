import { test, expect } from '../../../fixtures/test-fixtures';
import { uniqueProjectName } from '../../../utils/test-data';

test.describe('Create Project', () => {
  test('should create a new project', async ({ authenticatedPage }) => {
    const page = authenticatedPage.page;
    await page.goto('/projects');

    const projectName = uniqueProjectName();
    await page.getByRole('button', { name: /create|new project/i }).click();
    await page.getByLabel('Project Name').fill(projectName);
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByText(projectName)).toBeVisible();
  });
});
