---
story_number: "6.1.3"
story_key: "6-1-3-code-quality-tooling"
story_name: "Code Quality Tooling Setup"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 6.1.3: Code Quality Tooling Setup

> **QA Note:** This is a foundation/setup story. QA validation focuses on tool execution, rule enforcement, and coverage thresholds.

## 1. Description

### 1.1 User Story Statement
As a developer,
I want ESLint, Prettier, and Jest configured with strict rules,
so that code quality standards are enforced automatically.

### 1.2 Business Context
Consistent code quality prevents technical debt accumulation. Automated linting, formatting, and testing catch issues early and maintain codebase health as the team scales.

### 1.3 Technical Overview
- **ESLint:** TypeScript linting with strict rules
- **Prettier:** Code formatting with consistent style
- **Jest:** Unit testing framework with coverage thresholds
- **React Testing Library:** Component testing for frontend
- **Nx Integration:** Affected commands for efficient CI

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I run `npm run lint`, then ESLint runs with strict TypeScript rules | Must Have | Yes |
| AC-2 | Given I run `npm run format`, then Prettier formats all files with configured rules | Must Have | Yes |
| AC-3 | Given I run `npm run test`, then Jest executes all tests with coverage reporting | Must Have | Yes |
| AC-4 | Given test coverage is below 80%, then the test command fails | Must Have | Yes |
| AC-5 | Given unused variables or missing return types, then ESLint reports errors | Must Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** Lint completes in < 30 seconds
- **Coverage:** ≥80% coverage for all business logic
- **Consistency:** Same rules applied to web and api projects

## 3. Technical Specifications

### 3.1 ESLint Configuration
**.eslintrc.json (root):**
```json
{
  "root": true,
  "ignorePatterns": ["**/dist", "**/node_modules", "**/coverage"],
  "plugins": ["@typescript-eslint", "prettier"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["./tsconfig.base.json"]
  },
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "no-console": "warn",
    "eqeqeq": ["error", "always"],
    "curly": ["error", "all"],
    "no-var": "error",
    "prefer-const": "error"
  },
  "overrides": [
    {
      "files": ["*.tsx"],
      "extends": ["plugin:react/recommended", "plugin:react-hooks/recommended"],
      "settings": {
        "react": {
          "version": "detect"
        }
      },
      "rules": {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off"
      }
    }
  ]
}
```

### 3.2 Prettier Configuration
**.prettierrc:**
```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**.prettierignore:**
```
dist
node_modules
coverage
*.min.js
```

### 3.3 Jest Configuration
**jest.config.ts (root):**
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/apps', '<rootDir>/libs'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.base.json',
      isolatedModules: true
    }]
  },
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx}',
    'libs/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@tidy/shared-types$': '<rootDir>/libs/shared-types/src/index.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  verbose: true,
  collectCoverage: true
};

export default config;
```

### 3.4 Web-Specific Jest Configuration
**apps/web/jest.config.ts:**
```typescript
import type { Config } from 'jest';

const config: Config = {
  displayName: 'web',
  preset: '../../jest.config.ts',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {
      tsconfig: '<rootDir>/apps/web/tsconfig.json',
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@tidy/shared-types$': '<rootDir>/libs/shared-types/src/index.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/apps/web/jest.setup.ts'],
  testMatch: ['**/*.spec.ts', '**/*.spec.tsx']
};

export default config;
```

### 3.5 React Testing Library Setup
**apps/web/jest.setup.ts:**
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from '@jest/globals';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
} as any;
```

### 3.6 Nx Project Configuration
**apps/web/project.json:**
```json
{
  "name": "web",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/web/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/web"
      }
    },
    "serve": {
      "executor": "@nx/vite:dev-server",
      "options": {
        "buildTarget": "web:build",
        "port": 3000
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "apps/web/jest.config.ts",
        "passWithNoTests": false,
        "coverage": true
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["apps/web/**/*.{ts,tsx}"]
      }
    }
  }
}
```

**apps/api/project.json:**
```json
{
  "name": "api",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/api/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/api",
        "tsConfig": "apps/api/tsconfig.json"
      }
    },
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "ts-node -r tsconfig-paths/register apps/api/src/main.ts"
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": {
        "jestConfig": "apps/api/jest.config.ts",
        "passWithNoTests": false,
        "coverage": true
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["apps/api/**/*.ts"]
      }
    }
  }
}
```

## 4. Setup Instructions

### 4.1 Installation Commands
```bash
# Install ESLint and TypeScript ESLint
npm install -D eslint@8 @typescript-eslint/parser@6 @typescript-eslint/eslint-plugin@6
npm install -D eslint-config-prettier@9 eslint-plugin-prettier@5

# Install Prettier
npm install -D prettier@3

# Install Jest and testing libraries
npm install -D jest@29 ts-jest@29 @types/jest@29
npm install -D @nx/jest@18

# Install React Testing Library
npm install -D @testing-library/react@14 @testing-library/jest-dom@6 @testing-library/user-event@14
npm install -D @types/react-test-renderer@18 identity-obj-proxy@3

# Install Nx ESLint plugin
npm install -D @nx/eslint@18 @nx/eslint-plugin@18
```

### 4.2 NPM Scripts
**package.json (root):**
```json
{
  "scripts": {
    "lint": "npx nx affected:lint",
    "lint:all": "npx nx run-many --target=lint --all",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "test": "npx nx affected:test",
    "test:all": "npx nx run-many --target=test --all",
    "test:coverage": "npx nx run-many --target=test --all --coverage"
  }
}
```

### 4.3 Verification Commands
```bash
# Run lint on all projects
npm run lint:all

# Check formatting
npm run format:check

# Run all tests with coverage
npm run test:all

# Run tests for affected projects only
npm run test
```

## 5. Validation Checklist

### 5.1 Tooling Validation
| Check | Command | Expected Result |
|-------|---------|-----------------|
| ESLint runs | `npm run lint:all` | No errors (or expected errors only) |
| Prettier check | `npm run format:check` | All files formatted correctly |
| Tests run | `npm run test:all` | All tests pass |
| Coverage threshold | Check test output | ≥80% coverage |
| Unused variables | Add unused var to code | ESLint reports error |
| Missing return types | Add function without return type | ESLint reports error |

### 5.2 Sample Test File
**apps/api/src/utils/validator.spec.ts:**
```typescript
import { validateEmail, validatePassword } from './validator';

describe('Validator', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      expect(validatePassword('SecurePass123!')).toBe(true);
    });

    it('should return false for short password', () => {
      expect(validatePassword('short')).toBe(false);
    });
  });
});
```

### 5.3 Sample Component Test
**apps/web/src/shared/components/Button/Button.spec.tsx:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## 6. Dependencies

### 6.1 Prerequisites
- Nx workspace initialized (Story 6.1.1)
- Node.js 18.x or higher

### 6.2 External Dependencies
- ESLint 8.x
- Prettier 3.x
- Jest 29.x
- React Testing Library 14.x
- TypeScript ESLint 6.x

## 7. Technical Considerations

### 7.1 ESLint Rules Explained
| Rule | Purpose |
|------|---------|
| `explicit-function-return-type` | Enforce explicit return types on functions |
| `no-unused-vars` | Prevent unused variables (prefix with _ to ignore) |
| `strict-boolean-expressions` | Require explicit boolean checks |
| `no-console` | Warn on console.log statements |
| `eqeqeq` | Require === and !== instead of == and != |
| `curly` | Require curly braces for all blocks |

### 7.2 Coverage Thresholds
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

### 7.3 Nx Affected Commands
- `nx affected:lint` - Lint only changed projects
- `nx affected:test` - Test only changed projects
- Uses Git to determine affected projects

## 8. Troubleshooting

### 8.1 Common Issues
| Issue | Solution |
|-------|----------|
| ESLint TypeScript errors | Ensure tsconfig paths match ESLint parserOptions |
| Prettier conflicts with ESLint | Use eslint-config-prettier to disable conflicting rules |
| Jest import errors | Check moduleNameMapper matches tsconfig paths |
| Coverage threshold fails | Add tests or lower threshold temporarily |
| React Testing Library errors | Ensure jest.setup.ts imports @testing-library/jest-dom |

### 8.2 Disable Rule for Single Line
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const value: any = getValue();
```

### 8.3 Disable Rule for File
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// File contents
```

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `.eslintrc.json` | CREATE | ESLint configuration | ~50 |
| `.prettierrc` | CREATE | Prettier configuration | ~15 |
| `.prettierignore` | CREATE | Prettier ignore patterns | ~5 |
| `jest.config.ts` | CREATE | Root Jest configuration | ~40 |
| `apps/web/jest.config.ts` | CREATE | Web-specific Jest config | ~25 |
| `apps/web/jest.setup.ts` | CREATE | React Testing Library setup | ~30 |
| `apps/api/jest.config.ts` | CREATE | API-specific Jest config | ~20 |
| `apps/web/project.json` | MODIFY | Add test/lint targets | ~30 |
| `apps/api/project.json` | MODIFY | Add test/lint targets | ~30 |
| `package.json` | MODIFY | Add lint/format/test scripts | ~15 |

### Implementation Notes
- Use ts-jest for TypeScript support
- Configure jsdom for React component tests
- Set up coverage thresholds to enforce quality

### Code Review Checklist
- [ ] ESLint runs without configuration errors
- [ ] Prettier formats files consistently
- [ ] Jest executes all tests
- [ ] Coverage threshold enforced (≥80%)
- [ ] React Testing Library configured correctly
- [ ] Nx affected commands work

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#starter-template--project-structure)
- [Story 6.1.1: Nx Monorepo Workspace](./6-1-1-nx-monorepo-workspace.md)
- [ESLint Documentation](https://eslint.org)
- [Prettier Documentation](https://prettier.io)
- [Jest Documentation](https://jestjs.io)
- [React Testing Library](https://testing-library.com/react)
