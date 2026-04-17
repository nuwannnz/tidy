import { test, expect } from '../../../fixtures/test-fixtures';

test.describe('Project List', () => {
  test('should display the project list', async ({ authenticatedPage }) => {
    await authenticatedPage.page.goto('/projects');
    await expect(authenticatedPage.projectList).toBeVisible();
  });
});
