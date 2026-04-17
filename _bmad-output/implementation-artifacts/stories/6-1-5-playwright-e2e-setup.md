---
story_number: "6.1.5"
story_key: "6-1-5-playwright-e2e-setup"
story_name: "Playwright E2E Testing Foundation"
status: done
created_date: "2026-04-01"
last_updated: "2026-04-16"
---

# Story 6.1.5: Playwright E2E Testing Foundation

> **QA Note:** This is a foundation story for E2E testing infrastructure. QA should validate the test setup, CI integration, and ensure tests can run in headless mode.

## 1. Description

### 1.1 User Story Statement
As a development team,
I want a properly configured Playwright E2E testing framework,
so that we can write and run comprehensive end-to-end tests for critical user flows.

### 1.2 Business Context
E2E tests provide confidence that the application works correctly from the user's perspective. Playwright offers cross-browser testing, auto-waiting, and powerful debugging tools. Setting this up early ensures all feature stories include E2E tests from the start.

### 1.3 Technical Overview
- **Tool:** Playwright with TypeScript
- **Test Structure:** Separate UI and API test suites
- **Browsers:** Chromium, Firefox, WebKit (headless in CI)
- **Integration:** GitHub Actions CI pipeline
- **Reporting:** HTML reporter with CI artifacts

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given Playwright is installed, when I run `npx playwright test`, then tests execute successfully | Must Have | Yes |
| AC-2 | Given the test suite exists, when I run tests, then they execute on Chromium, Firefox, and WebKit | Must Have | Yes |
| AC-3 | Given API tests exist, when I run the test suite, then API tests execute separately from UI tests | Must Have | Yes |
| AC-4 | Given the CI pipeline runs, when tests execute, then they run in headless mode | Must Have | Yes |
| AC-5 | Given tests fail, when I check the output, then HTML report is generated with screenshots | Must Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** E2E tests should complete within 10 minutes in CI
- **Reliability:** Tests must be deterministic and not flaky
- **Maintainability:** Clear test structure with page objects and fixtures

## 3. Technical Specifications

### 3.1 Directory Structure
```
tidy/
├── tests/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.spec.ts
│   │   │   ├── register.spec.ts
│   │   │   └── logout.spec.ts
│   │   ├── projects/
│   │   │   ├── create.spec.ts
│   │   │   ├── edit.spec.ts
│   │   │   ├── delete.spec.ts
│   │   │   └── list.spec.ts
│   │   └── api/
│   │       ├── auth.spec.ts
│   │       └── projects.spec.ts
│   │
│   ├── fixtures/
│   │   ├── test-fixtures.ts
│   │   └── api-fixtures.ts
│   │
│   ├── page-objects/
│   │   ├── base.page.ts
│   │   ├── login.page.ts
│   │   ├── register.page.ts
│   │   ├── dashboard.page.ts
│   │   └── projects.page.ts
│   │
│   ├── utils/
│   │   ├── test-data.ts
│   │   └── api-helper.ts
│   │
│   └── playwright.config.ts
│
├── apps/
│   ├── web/
│   └── api/
│
└── package.json
```

### 3.2 Playwright Configuration
**tests/playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../playwright-report' }],
    ['list'],
    ['junit', { outputFile: '../test-results/junit.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev:web',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### 3.3 Package Dependencies
**Add to root package.json:**
```json
{
  "devDependencies": {
    "@playwright/test": "^1.42.0",
    "dotenv": "^16.3.0"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "test:e2e:chromium": "playwright test --project=chromium",
    "test:e2e:api": "playwright test tests/e2e/api"
  }
}
```

### 3.4 Test Fixtures
**tests/fixtures/test-fixtures.ts:**
```typescript
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';
import { RegisterPage } from '../page-objects/register.page';
import { DashboardPage } from '../page-objects/dashboard.page';

type Fixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dashboardPage: DashboardPage;
  authenticatedPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login('test@example.com', 'password123');
    await expect(page).toHaveURL(/dashboard/);
    await use(new DashboardPage(page));
  },
});

export { expect };
```

### 3.5 Page Objects
**tests/page-objects/login.page.ts:**
```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByText('Invalid credentials');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### 3.6 Example Test
**tests/e2e/auth/login.spec.ts:**
```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Login', () => {
  test('should login successfully with valid credentials', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.page.getByText('Dashboard')).toBeVisible();
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
});
```

### 3.7 API Tests
**tests/e2e/api/auth.spec.ts:**
```typescript
import { test, expect } from '../../fixtures/api-fixtures';

test.describe('Auth API', () => {
  test('should register a new user', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
      },
    });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.user).toBeDefined();
    expect(data.token).toBeDefined();
  });

  test('should login with valid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.token).toBeDefined();
  });
});
```

## 4. Setup Instructions

### 4.1 Installation Commands
```bash
# Install Playwright
npm install -D @playwright/test dotenv

# Install Playwright browsers
npx playwright install

# Install Playwright dependencies (for CI)
npx playwright install-deps
```

### 4.2 Environment Configuration
**Create .env.test:**
```bash
BASE_URL=http://localhost:3000
API_URL=http://localhost:4000
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

### 4.3 CI Integration
**Add to GitHub Actions workflow:**
```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test
  env:
    BASE_URL: http://localhost:3000
    CI: true

- name: Upload Playwright report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

## 5. Validation Checklist

### 5.1 Setup Validation
| Check | Command | Expected Result |
|-------|---------|-----------------|
| Playwright installed | `npx playwright --version` | Version displayed |
| Browsers installed | `npx playwright install` | All browsers installed |
| Tests run | `npx playwright test` | Tests execute successfully |
| Multi-browser | `npx playwright test` | Tests run on 3 browsers |
| HTML report | `npx playwright show-report` | Report opens in browser |

### 5.2 CI Validation
| Check | Command | Expected Result |
|-------|---------|-----------------|
| Headless mode | Run in CI | Tests run without UI |
| Artifacts uploaded | Check CI artifacts | Report, screenshots available |
| Parallel execution | Check CI logs | Tests run in parallel |
| Retries on failure | Check CI logs | Failed tests retry 2 times |

## 6. Dependencies

### 6.1 Prerequisites
- Node.js 18.x or higher
- Web server running (for UI tests)
- API server running (for API tests)

### 6.2 External Dependencies
- Playwright testing framework
- GitHub Actions for CI execution

## 7. Technical Considerations

### 7.1 Test Isolation
- Each test should be independent
- Use fixtures for setup/teardown
- Clean test data after each test

### 7.2 Test Data Management
- Use unique data for each test run
- Clean up test data after execution
- Seed test data before tests

### 7.3 Flakiness Prevention
- Use Playwright's auto-waiting
- Avoid hardcoded timeouts
- Use data-testid attributes for selectors

## 8. Deployment & Rollback

### 8.1 Verification Steps
```bash
# Run all tests
npx playwright test

# Run specific project
npx playwright test --project=chromium

# Run with UI
npx playwright test --ui

# Generate report
npx playwright show-report
```

### 8.2 Troubleshooting
| Issue | Solution |
|-------|----------|
| Tests timeout | Increase timeout in config or check webServer |
| Browsers not found | Run `npx playwright install` |
| Tests flaky | Use data-testid, avoid timing-dependent selectors |
| CI fails | Check `install-deps` step, verify headless mode |

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/e2e/project.json` | CREATE | Nx project config with e2e, e2e-ui, e2e-api, e2e-report targets |
| `apps/e2e/tsconfig.json` | CREATE | TypeScript config for e2e project |
| `apps/e2e/playwright.config.ts` | CREATE | Base Playwright config (all tests, 3 browsers) |
| `apps/e2e/playwright.ui.config.ts` | CREATE | UI-only Playwright config (3 browsers) |
| `apps/e2e/playwright.api.config.ts` | CREATE | API-only Playwright config (single project) |
| `apps/e2e/.env.test` | CREATE | Test environment variables |
| `apps/e2e/fixtures/test-fixtures.ts` | CREATE | UI test fixtures with page objects |
| `apps/e2e/fixtures/api-fixtures.ts` | CREATE | API test fixtures with authenticated context |
| `apps/e2e/page-objects/base.page.ts` | CREATE | Base page object class |
| `apps/e2e/page-objects/login.page.ts` | CREATE | Login page object |
| `apps/e2e/page-objects/register.page.ts` | CREATE | Register page object |
| `apps/e2e/page-objects/dashboard.page.ts` | CREATE | Dashboard page object |
| `apps/e2e/page-objects/projects.page.ts` | CREATE | Projects page object |
| `apps/e2e/utils/test-data.ts` | CREATE | Test data generators (unique emails, project names) |
| `apps/e2e/utils/api-helper.ts` | CREATE | API helper functions (register, login) |
| `apps/e2e/src/ui/auth/login.spec.ts` | CREATE | Login UI E2E tests (5 tests) |
| `apps/e2e/src/ui/auth/register.spec.ts` | CREATE | Register UI E2E tests (4 tests) |
| `apps/e2e/src/ui/auth/logout.spec.ts` | CREATE | Logout UI E2E tests (2 tests) |
| `apps/e2e/src/ui/projects/create.spec.ts` | CREATE | Create project UI E2E test |
| `apps/e2e/src/ui/projects/list.spec.ts` | CREATE | Project list UI E2E test |
| `apps/e2e/src/api/auth.spec.ts` | CREATE | Auth API E2E tests (5 tests) |
| `apps/e2e/src/api/projects.spec.ts` | CREATE | Projects API E2E tests (3 tests) |
| `package.json` | UPDATE | Added e2e convenience scripts |
| `.gitignore` | UPDATE | Added playwright-report/, test-results/, apps/e2e/.env.test |

### Implementation Notes
- **Structured as Nx project** (`apps/e2e`) with separate targets: `e2e` (all), `e2e-ui` (UI only), `e2e-api` (API only)
- Playwright v1.59.1 installed with Chromium, Firefox, and WebKit browsers
- Separate configs allow independent execution: `nx run e2e:e2e-api`, `nx run e2e:e2e-ui`
- UI tests run across 3 browsers (39 tests), API tests run on single project (8 tests) = 47 total test cases
- webServer config auto-starts dev servers with `reuseExistingServer` for local dev
- Screenshots on failure, video retained on failure, trace on first retry
- HTML reporter + JUnit XML in CI for artifact upload
- All existing tests (3/3) and linting pass with no regressions

### Change Log
| Date | Change |
|------|--------|
| 2026-04-16 | Initial implementation: Playwright E2E testing foundation as Nx project with UI/API test separation |

### Code Review Checklist
- [ ] Playwright configuration is correct
- [ ] All browsers configured (Chromium, Firefox, WebKit)
- [ ] Test fixtures properly extend base test
- [ ] Page objects follow best practices
- [ ] API tests separate from UI tests
- [ ] CI integration configured
- [ ] HTML reporter configured

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#additional-requirements)
- [Epic 6 Phase 1: Development Foundation](_bmad-output/planning-artifacts/epics.md#epic-6-phase-1-development-foundation)
- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
