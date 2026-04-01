# Tidy - Project Management Application

A modern, intelligent project management tool built with a monorepo architecture.

## 🏗️ Architecture

Tidy is built as an Nx monorepo workspace with the following structure:

### Projects

| Project | Type | Tech Stack | Purpose |
|---------|------|------------|---------|
| **web** | Frontend | React 18, TypeScript, Vite, Material-UI | Progressive Web App for project management |
| **api** | Backend | Node.js, Express, TypeScript | RESTful API with AWS Lambda support |
| **shared-types** | Library | TypeScript | Shared type definitions across projects |

### Directory Structure

```
tidy/
├── apps/
│   ├── web/                          # React frontend application
│   │   ├── src/
│   │   │   ├── app/                  # App component and providers
│   │   │   ├── features/             # Feature-sliced architecture
│   │   │   ├── shared/               # Shared UI components
│   │   │   ├── store/                # Redux store
│   │   │   ├── services/             # API client services
│   │   │   └── types/                # Local type definitions
│   │   ├── project.json              # Nx project configuration
│   │   ├── tsconfig.json             # TypeScript configuration
│   │   ├── vite.config.ts            # Vite bundler config
│   │   └── jest.config.js            # Jest test config
│   │
│   └── api/                          # Express backend application
│       ├── src/
│       │   ├── main.ts               # Lambda entry point
│       │   ├── app.ts                # Express app setup
│       │   ├── handlers/             # Route handlers
│       │   ├── middleware/           # Auth, validation, error handling
│       │   ├── services/             # Business logic layer
│       │   └── models/               # Data models
│       ├── project.json              # Nx project configuration
│       ├── tsconfig.json             # TypeScript configuration
│       └── jest.config.js            # Jest test config
│
├── libs/
│   └── shared-types/                 # Shared TypeScript types
│       ├── src/
│       │   ├── index.ts              # Barrel exports
│       │   ├── user.types.ts         # User interfaces
│       │   ├── project.types.ts      # Project interfaces
│       │   ├── item.types.ts         # Item/task interfaces
│       │   └── api.types.ts          # API response types
│       ├── project.json              # Nx project configuration
│       └── jest.config.js            # Jest test config
│
├── nx.json                           # Nx workspace configuration
├── tsconfig.base.json                # Base TypeScript config
├── package.json                      # Dependencies and scripts
└── jest.preset.js                    # Root Jest preset
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the web development server
npm run dev:web

# Start the API development server
npm run dev:api

# Or use Nx directly
npx nx serve web
npx nx serve api
```

### Building

```bash
# Build all projects
npx nx run-many --target=build --all

# Build specific projects
npm run build:web
npm run build:api
```

### Testing

```bash
# Run all tests
npx nx run-many --target=test --all

# Run tests for specific projects
npx nx test web
npx nx test api
npx nx test shared-types
```

### Linting

```bash
# Lint all projects
npx nx run-many --target=lint --all
```

## 📦 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev:web` | `npx nx serve web` | Start web dev server (port 3000) |
| `dev:api` | `npx nx serve api` | Start API dev server (port 4000) |
| `build:web` | `npx nx build web` | Build web for production |
| `build:api` | `npx nx build api` | Build API for production |
| `test` | `npx nx affected:test` | Run affected tests |
| `lint` | `npx nx affected:lint` | Run affected linting |

## 🏛️ Shared Types

The `shared-types` library provides type-safe interfaces across the application:

### User Types
- `User` - User account interface
- `CreateUserDto` - User registration payload
- `LoginDto` - Login credentials
- `AuthResponse` - Authentication response with tokens

### Project Types
- `Project` - Project entity
- `CreateProjectDto` - Project creation payload
- `UpdateProjectDto` - Project update payload

### Item Types
- `Item` - Task/item entity
- `CreateItemDto` - Item creation payload
- `UpdateItemDto` - Item update payload

### API Types
- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResponse<T>` - Paginated list response
- `ApiError` - Error response structure

### Usage Example

```typescript
import { Project, CreateProjectDto } from '@tidy/shared-types';

// Use in frontend
const project: Project = {
  id: '1',
  name: 'My Project',
  color: '#FF5733',
  userId: 'user-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Use in API handlers
const createProject = (dto: CreateProjectDto) => {
  // Implementation
};
```

## 🔧 Configuration

### TypeScript

Strict mode is enabled across all projects with the following key settings:
- `strict: true`
- `strictNullChecks: true`
- `noImplicitAny: true`
- `noImplicitReturns: true`

Path aliases:
- `@tidy/shared-types` → `libs/shared-types/src/index.ts`

### Nx

Nx caching is configured for:
- Build outputs
- Test results
- Lint results

Cache location: `.nx/cache`

### Testing

- **Jest** - Unit and integration testing
- **ts-jest** - TypeScript support
- **Testing Library** - React component testing
- **jsdom** - Browser environment simulation

## 📝 Development Guidelines

### Project Boundaries

- **apps/web**: Frontend React application only
- **apps/api**: Backend Express/Lambda only
- **libs/shared-types**: TypeScript types only (no runtime code)

Cross-project imports must go through `shared-types`.

### Import Rules

```typescript
// ✅ Allowed in web app
import { Project } from '@tidy/shared-types';

// ✅ Allowed in API
import { CreateProjectDto } from '@tidy/shared-types';

// ❌ Not allowed - direct cross-project imports
import { something } from '../../apps/api/src/something';
```

### Commit Messages

Follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Build/config changes

## 🎯 Roadmap

### Sprint 0 Part 1 - Development Foundation ✅
- [x] Initialize Nx monorepo workspace
- [ ] Set up Docker local development stack
- [ ] Configure code quality tooling
- [ ] Set up CI pipeline

### Sprint 0 Part 2 - Design Foundation
- [ ] Material UI theme and design tokens
- [ ] Master-slave layout shell
- [ ] Core UI components
- [ ] Color picker component
- [ ] Keyboard navigation

### Sprint 0 Part 3 - Authentication
- [ ] User registration
- [ ] User login
- [ ] User logout
- [ ] Password reset
- [ ] JWT session management

### Sprint 1 - Project Management
- [ ] Create project
- [ ] View project list
- [ ] Edit project
- [ ] Delete project
- [ ] Project API endpoints

## 📚 Additional Resources

- [Nx Documentation](https://nx.dev)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Material-UI Documentation](https://mui.com)

## 📄 License

MIT
