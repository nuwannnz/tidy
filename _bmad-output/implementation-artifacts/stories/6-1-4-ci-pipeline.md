---
story_number: "6.1.4"
story_key: "6-1-4-ci-pipeline"
story_name: "Basic CI Pipeline Structure"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 6.1.4: Basic CI Pipeline Structure

> **QA Note:** This is a foundation/setup story. QA validation focuses on pipeline execution, job success/failure behavior, and status reporting.

## 1. Description

### 1.1 User Story Statement
As a developer,
I want a GitHub Actions CI pipeline,
so that linting, type checking, and tests run automatically on every commit.

### 1.2 Business Context
Automated CI ensures code quality standards are enforced consistently. Early detection of issues prevents broken code from merging and reduces review burden.

### 1.3 Technical Overview
- **GitHub Actions:** CI/CD platform integrated with GitHub
- **Workflow:** Lint, type check, and test on every push/PR
- **Caching:** npm cache for faster builds
- **Status Checks:** Pipeline status visible on PRs

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I push to a branch, then GitHub Actions CI workflow triggers | Must Have | Yes |
| AC-2 | Given the workflow runs, then lint job executes successfully | Must Have | Yes |
| AC-3 | Given the workflow runs, then type check job executes successfully | Must Have | Yes |
| AC-4 | Given the workflow runs, then test job executes with coverage | Must Have | Yes |
| AC-5 | Given any job fails, then the pipeline fails with clear error messages | Must Have | Yes |
| AC-6 | Given all checks pass, then the commit shows success status | Must Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** CI completes in < 10 minutes
- **Reliability:** Consistent results across runs
- **Visibility:** Clear pass/fail status on PRs

## 3. Technical Specifications

### 3.1 CI Workflow Configuration
**.github/workflows/ci.yml:**
```yaml
name: CI

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npx nx affected:lint --base=origin/develop --head=HEAD
        continue-on-error: false

      - name: Type Check
        run: npx nx affected --target=build --base=origin/develop --head=HEAD
        continue-on-error: false

      - name: Unit Tests
        run: npx nx affected:test --base=origin/develop --head=HEAD --coverage
        continue-on-error: false

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        if: always()
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false

  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: quality

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Web
        run: npx nx build web
        continue-on-error: false

      - name: Build API
        run: npx nx build api
        continue-on-error: false

      - name: Upload Web Build
        uses: actions/upload-artifact@v4
        if: success()
        with:
          name: web-build
          path: dist/apps/web
          retention-days: 7

      - name: Upload API Build
        uses: actions/upload-artifact@v4
        if: success()
        with:
          name: api-build
          path: dist/apps/api
          retention-days: 7
```

### 3.2 Branch Protection Rules
**GitHub Repository Settings → Branches → Add rule:**
```
Branch name pattern: main
✓ Require a pull request before merging
  ✓ Require approvals
    Required number of approvals: 1
  ✓ Dismiss stale pull request approvals when new commits are pushed
✓ Require status checks to pass before merging
  ✓ Require branches to be up to date before merging
  ✓ Status checks required:
    - Quality Checks
    - Build
✓ Include administrators
✓ Require linear history
✓ Allow force pushes: No
✓ Allow deletions: No
```

### 3.3 Nx Configuration for CI
**nx.json (CI optimizations):**
```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true,
      "inputs": ["production", "^production"]
    },
    "test": {
      "cache": true,
      "inputs": ["default", "^production"]
    },
    "lint": {
      "cache": true,
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"]
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/.eslintrc.json"
    ],
    "sharedGlobals": []
  },
  "defaultProject": "web",
  "useInferencePlugins": false,
  "defaultBase": "develop"
}
```

### 3.4 Environment Variables
**GitHub Secrets to Configure:**
```
# Repository Settings → Secrets and variables → Actions

CODECOV_TOKEN=<codecov-token>  # Optional: for coverage reporting
```

### 3.5 PR Template
**.github/PULL_REQUEST_TEMPLATE.md:**
```markdown
## Description

<!-- Provide a brief description of the changes -->

## Related Issue

<!-- Link to the issue this PR addresses -->
Fixes #<issue-number>

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

<!-- Describe the testing performed for this PR -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist

- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally

## Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->
```

## 4. Setup Instructions

### 4.1 GitHub Actions Setup
```bash
# Initialize Git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/<username>/tidy.git
git branch -M main
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop
```

### 4.2 Workflow File Setup
```bash
# Create workflow directory
mkdir -p .github/workflows

# Add ci.yml workflow file
# (See section 3.1 for content)

# Commit and push
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

### 4.3 Branch Protection Setup
1. Go to GitHub repository Settings
2. Navigate to Branches
3. Click "Add branch protection rule"
4. Enter branch name pattern: `main`
5. Configure settings as per section 3.2
6. Click "Create"

### 4.4 Verification Commands
```bash
# Test workflow locally (optional)
npm install -g @act-cli/act
act push

# Trigger workflow manually
git commit --allow-empty -m "Trigger CI"
git push
```

## 5. Validation Checklist

### 5.1 Workflow Validation
| Check | Expected Result |
|-------|-----------------|
| Workflow triggers on push | CI starts automatically |
| Workflow triggers on PR | CI starts automatically |
| Checkout step succeeds | Code checked out correctly |
| Node.js setup succeeds | Node 18.x installed |
| npm install succeeds | All dependencies installed |
| Lint job passes | No lint errors |
| Type check passes | No TypeScript errors |
| Test job passes | All tests pass |
| Build job passes | Both web and api build |
| Artifacts uploaded | Build artifacts available |

### 5.2 Failure Scenarios
| Scenario | Expected Behavior |
|----------|-------------------|
| Lint error introduced | Lint job fails, pipeline stops |
| TypeScript error | Build job fails |
| Test failure | Test job fails |
| Missing dependency | Install step fails |

### 5.3 Status Check Validation
```
# On Pull Request, verify:
✓ "Quality Checks" status shows ✓ or ✗
✓ "Build" status shows ✓ or ✗
✓ Merge button disabled if checks fail
✓ "Required status checks" enforced
```

## 6. Dependencies

### 6.1 Prerequisites
- GitHub repository created
- Nx workspace initialized (Story 6.1.1)
- Code quality tooling setup (Story 6.1.3)

### 6.2 External Dependencies
- GitHub Actions
- Node.js 18.x
- npm 9.x
- Codecov (optional for coverage reporting)

## 7. Technical Considerations

### 7.1 CI Optimization Strategies
| Strategy | Benefit |
|----------|---------|
| `nx affected` commands | Only test changed projects |
| npm cache | Faster dependency installation |
| concurrency group | Cancel duplicate workflows |
| artifact uploads | Preserve builds for deployment |

### 7.2 Workflow Timeout Settings
- **Quality job:** 15 minutes
- **Build job:** 15 minutes
- **Total workflow:** ~10 minutes typical

### 7.3 Caching Strategy
```yaml
# npm cache
cache: 'npm'

# Nx cache (optional for advanced setups)
- uses: actions/cache@v4
  with:
    path: .nx/cache
    key: nx-cache-${{ github.sha }}
    restore-keys: |
      nx-cache-
```

## 8. Troubleshooting

### 8.1 Common Issues
| Issue | Solution |
|-------|----------|
| Workflow doesn't trigger | Check .github/workflows/ci.yml path and syntax |
| npm install fails | Verify package.json is valid |
| Nx affected fails | Ensure fetch-depth: 0 for git history |
| Artifacts not uploading | Check artifact path exists |
| Workflow timeout | Increase timeout-minutes |

### 8.2 Debug Mode
```yaml
# Add to workflow for debugging
- name: Debug
  run: |
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Working directory: $(pwd)"
    echo "Files: $(ls -la)"
```

### 8.3 Re-run Failed Jobs
1. Go to Actions tab
2. Select failed workflow run
3. Click "Re-run jobs" button
4. Select specific job or re-run all

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `.github/workflows/ci.yml` | CREATE | CI workflow configuration | ~100 |
| `.github/PULL_REQUEST_TEMPLATE.md` | CREATE | PR template | ~40 |
| `nx.json` | MODIFY | Add CI optimizations | ~30 |
| Repository settings | Configure | Branch protection rules | N/A |

### Implementation Notes
- Use `fetch-depth: 0` for Nx affected commands
- Concurrency group prevents duplicate workflows
- Artifacts retained for 7 days

### Code Review Checklist
- [ ] Workflow triggers on push and PR
- [ ] All jobs complete successfully
- [ ] Failed jobs block merge
- [ ] Coverage report uploads (if configured)
- [ ] Build artifacts available
- [ ] Branch protection enforced

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#testing-strategy)
- [Story 6.1.1: Nx Monorepo Workspace](./6-1-1-nx-monorepo-workspace.md)
- [Story 6.1.3: Code Quality Tooling](./6-1-3-code-quality-tooling.md)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Nx CI Documentation](https://nx.dev/ci/intro)
