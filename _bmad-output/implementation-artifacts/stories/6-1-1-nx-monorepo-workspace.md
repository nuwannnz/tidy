---
story_number: "6.1.1"
story_key: "6-1-1-nx-monorepo-workspace"
story_name: "Initialize Nx Monorepo Workspace"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 6.1.1: Initialize Nx Monorepo Workspace

> **QA Note:** This is a foundation/setup story. QA validation focuses on workspace structure, build commands, and project boundaries rather than feature testing.

## 1. Description

### 1.1 User Story Statement
As a developer,
I want a properly configured Nx monorepo workspace,
so that I can manage frontend, backend, and shared code in a structured, scalable architecture.

### 1.2 Business Context
A well-structured monorepo is the foundation for all development. It enables code sharing, consistent tooling, and efficient CI/CD pipelines. Getting this right from day one prevents costly refactoring later.

### 1.3 Technical Overview
- **Tool:** Nx workspace with TypeScript preset
- **Projects:** apps/web (React), apps/api (Node.js/Express), libs/shared-types
- **Configuration:** TypeScript strict mode, project boundaries, path mappings

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I run Nx workspace initialization, then apps/web, apps/api, and libs/shared-types are created | Must Have | Yes |
| AC-2 | Given the workspace is initialized, when I check the structure, then TypeScript strict mode is enabled across all projects | Must Have | Yes |
| AC-3 | Given I run `npx nx build web`, then the React app builds successfully | Must Have | Yes |
| AC-4 | Given I run `npx nx build api`, then the API builds successfully | Must Have | Yes |
| AC-5 | Given I import from @tidy/shared-types, then TypeScript resolves the import correctly | Must Have | Yes |

### 2.2 Non-Functional Requirements
- **Structure:** Follow Nx recommended conventions
- **Performance:** Nx caching enabled for faster rebuilds
- **Scalability:** Clear project boundaries for future growth

## 3. Technical Specifications

### 3.1 Workspace Structure
```
tidy/
├── apps/
│   ├── web/                          # React + TypeScript PWA
│   │   ├── src/
│   │   │   ├── app/                  # App component, providers
│   │   │   ├── features/             # Feature-sliced folders
│   │   │   ├── shared/               # Shared UI components
│   │   │   ├── store/                # Redux store
│   │   │   ├── services/             # API client
│   │   │   └── types/                # TypeScript types
│   │   ├── jest.config.ts
│   │   ├── tsconfig.json
│   │   └── project.json
│   │
│   └── api/                          # Express Lambda handler
│       ├── src/
│       │   ├── main.ts               # Lambda entry point
│       │   ├── app.ts                # Express app setup
│       │   ├── handlers/             # Route handlers
│       │   ├── middleware/           # Auth, validation, error handling
│       │   ├── services/             # Business logic, DynamoDB access
│       │   └── models/               # TypeScript interfaces
│       ├── jest.config.ts
│       ├── tsconfig.json
│       └── project.json
│
├── libs/
│   └── shared-types/                 # Shared TypeScript types
│       ├── src/
│       │   ├── project.types.ts
│       │   ├── item.types.ts
│       │   ├── user.types.ts
│       │   └── api.types.ts
│       └── project.json
│
├── nx.json
├── package.json
├── tsconfig.base.json
└── jest.config.ts
```

### 3.2 Package Dependencies
**Root package.json:**
```json
{
  "name": "@tidy/source",
  "version": "0.0.0",
  "scripts": {
    "dev:web": "npx nx serve web",
    "dev:api": "npx nx serve api",
    "build:web": "npx nx build web",
    "build:api": "npx nx build api",
    "test": "npx nx affected:test",
    "lint": "npx nx affected:lint"
  },
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "@reduxjs/toolkit": "^2.x",
    "react-redux": "^9.x",
    "@mui/material": "^5.x",
    "@emotion/react": "^11.x",
    "express": "^4.x",
    "aws-sdk": "^3.x",
    "@aws-sdk/client-dynamodb": "^3.x",
    "@aws-sdk/lib-dynamodb": "^3.x",
    "bcrypt": "^5.x",
    "jsonwebtoken": "^9.x",
    "zod": "^3.x"
  },
  "devDependencies": {
    "@nx/react": "^18.x",
    "@nx/node": "^18.x",
    "@nx/jest": "^18.x",
    "@nx/eslint": "^18.x",
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x",
    "jest": "^29.x",
    "@types/jest": "^29.x"
  }
}
```

### 3.3 TypeScript Configuration
**tsconfig.base.json:**
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "paths": {
      "@tidy/shared-types": ["libs/shared-types/src/index.ts"]
    }
  }
}
```

### 3.4 Nx Configuration
**nx.json:**
```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": {
      "cache": true
    },
    "lint": {
      "cache": true
    }
  },
  "defaultProject": "web",
  "generators": {
    "@nx/react": {
      "application": {
        "style": "css",
        "linter": "eslint",
        "bundler": "vite",
        "compiler": "babel"
      }
    }
  }
}
```

### 3.5 Shared Types Structure
**libs/shared-types/src/index.ts:**
```typescript
export * from './user.types';
export * from './project.types';
export * from './item.types';
export * from './api.types';
```

**libs/shared-types/src/user.types.ts:**
```typescript
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
```

**libs/shared-types/src/project.types.ts:**
```typescript
export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
}
```

## 4. Setup Instructions

### 4.1 Initialization Commands
```bash
# Create Nx workspace
npx create-nx-workspace@latest tidy \
  --preset=ts \
  --appName=web \
  --style=css \
  --e2eTestRunner=cypress \
  --testRunner=jest \
  --directory=apps/web

cd tidy

# Install frontend dependencies
npm install react@18 react-dom@18 react-router-dom@6
npm install @reduxjs/toolkit@2 react-redux@9
npm install @mui/material@5 @emotion/react@11 @emotion/styled@11

# Install backend dependencies
npm install express@4 aws-sdk@3 @aws-sdk/client-dynamodb@3 @aws-sdk/lib-dynamodb@3
npm install bcrypt@5 jsonwebtoken@9 zod@3

# Install dev dependencies
npm install -D @nx/react@18 @nx/node@18 @nx/jest@18 @nx/eslint@18
npm install -D typescript@5 @types/react@18 @types/node@20
npm install -D jest@29 @types/jest@29 ts-node@10
```

### 4.2 Generate Projects
```bash
# Generate API project (Node.js Express)
npx nx g @nx/node:application api --directory=apps/api --linter=eslint --testRunner=jest

# Generate shared-types library
npx nx g @nx/js:library shared-types --directory=libs/shared-types
```

### 4.3 Verification Commands
```bash
# Verify workspace structure
npx nx show projects

# Build all projects
npx nx run-many --target=build --all

# Run tests
npx nx run-many --target=test --all

# Lint all projects
npx nx run-many --target=lint --all
```

## 5. Validation Checklist

### 5.1 Structure Validation
| Check | Command | Expected Result |
|-------|---------|-----------------|
| Workspace initialized | `npx nx show projects` | Lists: web, api, shared-types |
| Web app builds | `npx nx build web` | Build succeeds, dist/ created |
| API builds | `npx nx build api` | Build succeeds, dist/ created |
| Shared types import | TypeScript compile | No import errors |
| Strict mode enabled | Check tsconfig.json | `"strict": true` |

### 5.2 Import Path Validation
```typescript
// In apps/web/src/app/App.tsx
import { Project } from '@tidy/shared-types'; // Should resolve correctly

// In apps/api/src/handlers/projects.ts
import { CreateProjectDto } from '@tidy/shared-types'; // Should resolve correctly
```

## 6. Dependencies

### 6.1 Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git for version control

### 6.2 External Dependencies
- Nx workspace tooling
- TypeScript 5.x
- React 18.x (frontend)
- Express 4.x (backend)

## 7. Technical Considerations

### 7.1 Project Boundaries
- **apps/web:** Frontend React application only
- **apps/api:** Backend Express/Lambda only
- **libs/shared-types:** TypeScript types only (no runtime code)
- Cross-project imports must go through shared-types

### 7.2 Build Order
1. libs/shared-types (no dependencies)
2. apps/api (depends on shared-types)
3. apps/web (depends on shared-types)

### 7.3 Caching Strategy
- Nx caches build outputs
- Incremental builds use cached results
- Cache stored in .nx/cache directory

## 8. Deployment & Rollback

### 8.1 Verification Steps
```bash
# After setup, verify everything works
npm run build:web && npm run build:api
npm run test
npm run lint
```

### 8.2 Troubleshooting
| Issue | Solution |
|-------|----------|
| Import path errors | Check tsconfig.base.json paths configuration |
| Build fails | Verify all dependencies installed (npm install) |
| TypeScript errors | Ensure strict mode settings are correct |

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `nx.json` | CREATE | Nx workspace configuration | ~40 |
| `tsconfig.base.json` | CREATE | Base TypeScript configuration | ~30 |
| `package.json` | CREATE | Dependencies and scripts | ~60 |
| `apps/web/project.json` | CREATE | Web app project configuration | ~30 |
| `apps/api/project.json` | CREATE | API project configuration | ~30 |
| `libs/shared-types/project.json` | CREATE | Shared types project configuration | ~20 |
| `libs/shared-types/src/*.types.ts` | CREATE | Shared TypeScript types | ~100 |

### Implementation Notes
- Ensure Nx version matches across all @nx/* packages
- Use Vite as bundler for faster dev server startup
- Configure Jest for both web and api test runners

### Code Review Checklist
- [ ] Workspace structure matches architecture
- [ ] All projects build successfully
- [ ] Shared types import correctly in both web and api
- [ ] TypeScript strict mode enabled
- [ ] Nx caching configured
- [ ] Package versions are compatible

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#starter-template--project-structure)
- [Epic 6 Phase 1: Development Foundation](_bmad-output/planning-artifacts/epics.md#epic-6-phase-1-development-foundation)
- [Nx Documentation](https://nx.dev)
