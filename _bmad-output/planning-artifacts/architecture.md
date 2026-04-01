---
stepsCompleted:
  - step-01-init
  - step-02-context
  - step-03-starter
  - step-04-decisions
  - step-05-patterns
  - step-06-complete
inputDocuments:
  - /Users/nuwankarunarathna/projects/personal/tidy/_bmad-output/planning-artifacts/prd.md
workflowType: 'architecture'
project_name: tidy
user_name: nuwannnz
date: '2026-03-31'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
30+ functional requirements organized into 5 categories:
- **Authentication System** (5 reqs) — Email/password auth, session management, password reset
- **Project Management** (5 reqs) — CRUD operations, color-coded projects, master list view
- **Project Items** (6 reqs) — Ideas, tasks, notes with metadata and CRUD operations
- **Dashboard** (5 reqs) — Cross-project aggregation, filtering, drag-and-drop canvas layout
- **UI/UX** (6 reqs) — Master-slave layout, Material Design, PWA capabilities

**Non-Functional Requirements:**
- **Code Quality:** TypeScript strict mode, ESLint/Prettier, ≥80% test coverage, Storybook, CI pipeline
- **Performance:** <3s initial load, <500ms dashboard render, 60fps drag-and-drop, <200ms API (p95)
- **Security:** Bcrypt passwords, authenticated APIs, secure JWT storage, HTTPS/TLS, input validation
- **Usability:** WCAG 2.1 AA, offline PWA support, responsive design, 5-minute onboarding
- **Reliability:** 99.9% uptime, atomic mutations, automatic backups

### Scale & Complexity

- **Project Complexity:** Medium — Multi-tenant single-user, real-time UI interactions, serverless architecture
- **Primary Domain:** Full-stack web/PWA with serverless backend
- **Estimated Architectural Components:** 12-15 (Auth, Projects, Items, Dashboard, API Gateway, Lambda functions, Database, PWA services, State management, UI components, Drag-and-drop, Offline sync)

### Technical Constraints & Dependencies

**Mandated Stack (from PRD):**
- **Frontend:** React + TypeScript, Material UI
- **Backend:** AWS SAM (Lambda), API Gateway
- **Monorepo:** Nx workspace
- **PWA:** Service workers, offline support, installable

**Key Technical Requirements:**
- Drag-and-drop canvas-style auto-arrangeable layout (not rigid grid)
- Strict code quality: linting, testing, CI/CD pipelines
- Master-slave layout with project list (left) and details/dashboard (right)

### Cross-Cutting Concerns Identified

1. **Authentication** — Required across all API endpoints and frontend routes
2. **State Management** — Shared state between project list, details pane, and dashboard
3. **Type Safety** — End-to-end TypeScript with shared types (frontend ↔ backend)
4. **Performance** — Dashboard aggregation queries, drag-and-drop responsiveness
5. **Offline Support** — PWA caching strategy for previously loaded data
6. **Data Consistency** — Atomic operations for project/item mutations

### Unique Technical Challenges

| Challenge | Impact |
|-----------|--------|
| **Canvas Layout** | Requires flexible drag-and-drop library (dnd-kit evaluation needed) |
| **Cross-Project Aggregation** | Dashboard queries need efficient filtering across all projects |
| **Offline-First PWA** | Service worker caching strategy for React app with mutable data |
| **Nx Monorepo Structure** | Need clear boundaries between frontend, backend, shared libs |

### Architectural Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Database** | DynamoDB | Serverless-native, auto-scaling, cost-effective for read-heavy workloads |
| **Authentication** | Custom JWT | Simpler initial setup, full control over auth flow, cost-effective for MVP |
| **State Management** | Redux Toolkit | Predictable state management, DevTools support, well-suited for complex UI state |
| **Drag-and-Drop** | dnd-kit | Modern, lightweight, flexible for canvas-style layouts, active maintenance |
| **Backend Architecture** | Single Lambda + Express + API Gateway Proxy | Simplified deployment, all routes handled by one Lambda, Express for routing/middleware |
| **Code Quality** | ESLint + Prettier (strict config) | Enforced code consistency, automated formatting, priority requirement |

---

## Starter Template & Project Structure

### Selected Approach: Custom Nx Workspace

**Rationale:**
Given the requirement for a well-structured monorepo that supports future component library extraction, we'll use Nx workspace with custom project structure rather than a pre-built starter. This provides:
- Clear separation between frontend, backend, and shared libraries
- Ability to extract reusable components into a publishable library later
- Build caching and affected commands for faster CI/CD
- Enforced module boundaries

### Initialization Command

```bash
# Create Nx workspace
npx create-nx-workspace@latest tidy \
  --preset=ts \
  --appName=web \
  --style=css \
  --e2eTestRunner=cypress \
  --testRunner=jest \
  --directory=apps/web

# Install dependencies
cd tidy
npm install @mui/material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux
npm install @dnd-kit/core @dnd-kit/utilities
npm install express @types/express
npm install aws-sdk @aws-sdk/client-dynamodb
```

### Project Structure

```
tidy/
├── apps/
│   ├── web/                          # React + TypeScript PWA
│   │   ├── src/
│   │   │   ├── app/                  # App component, providers
│   │   │   ├── features/             # Feature-sliced folders
│   │   │   │   ├── auth/
│   │   │   │   ├── projects/
│   │   │   │   ├── items/
│   │   │   │   └── dashboard/
│   │   │   ├── shared/               # Shared UI components
│   │   │   │   ├── components/       # Reusable components (Button, Input, etc.)
│   │   │   │   ├── hooks/            # Shared hooks
│   │   │   │   └── utils/            # Shared utilities
│   │   │   ├── store/                # Redux store, slices, selectors
│   │   │   ├── services/             # API client, HTTP layer
│   │   │   ├── types/                # TypeScript types
│   │   │   └── styles/               # Global styles, theme
│   │   ├── jest.config.ts            # Unit test configuration
│   │   └── project.json
│   │
│   ├── api/                          # Express Lambda handler
│   │   ├── src/
│   │   │   ├── main.ts               # Lambda entry point
│   │   │   ├── app.ts                # Express app setup
│   │   │   ├── handlers/             # Route handlers
│   │   │   ├── middleware/           # Auth, validation, error handling
│   │   │   ├── services/             # Business logic, DynamoDB access
│   │   │   ├── models/               # TypeScript interfaces
│   │   │   └── utils/                # Helpers, validators
│   │   ├── jest.config.ts            # Unit test configuration
│   │   └── project.json
│   │
│   └── e2e/                          # Playwright E2E tests
│       ├── tests/
│       │   ├── api/                  # API E2E tests (separate from UI)
│       │   │   ├── auth.api.spec.ts
│       │   │   ├── projects.api.spec.ts
│       │   │   └── items.api.spec.ts
│       │   └── ui/                   # UI E2E tests (separate from API)
│       │       ├── auth.ui.spec.ts
│       │       ├── projects.ui.spec.ts
│       │       ├── items.ui.spec.ts
│       │       └── dashboard.ui.spec.ts
│       ├── fixtures/
│       │   ├── api.fixtures.ts
│       │   └── ui.fixtures.ts
│       ├── utils/
│       │   ├── api-client.ts
│       │   └── test-data.ts
│       ├── playwright.config.ts      # E2E test configuration
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
├── tools/                            # Custom build tools, scripts
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, build (all environments)
│       └── deploy.yml                # Multi-environment deployment
│
├── docker/                           # Docker configuration for local development
│   ├── Dockerfile.api                # Dockerfile for backend API
│   └── docker-compose.yml            # Local development stack
│
├── .eslintrc.json                    # Base ESLint configuration
├── .prettierrc                       # Prettier configuration
├── samconfig.toml                    # AWS SAM configuration (dev/prod)
├── template.yaml                     # AWS SAM template
├── nx.json                           # Nx workspace configuration
├── tsconfig.base.json                # Base TypeScript configuration
└── package.json
```

### Architectural Decisions from Starter

**Language & Runtime:**
- TypeScript 5.x with strict mode enabled across all projects
- ES2022 target for backend (Node 18+ Lambda runtime)
- ES2020 target for frontend (broad browser support)

**Styling Solution:**
- Material UI v5 with Emotion for styled components
- Custom theme extending Material Design
- CSS modules for component-specific styles when needed
- Responsive breakpoints: mobile-first approach

**Build Tooling:**
- Vite (via Nx React plugin) for frontend bundling
- ESBuild for Lambda function packaging
- Nx build caching for incremental builds
- Tree-shaking and code splitting enabled

**Testing Framework:**
- Jest for unit tests (frontend + backend)
- React Testing Library for component tests
- Cypress for E2E tests
- Test coverage threshold: 80% minimum

**Code Organization:**
- Feature-sliced architecture for frontend
- Domain-driven structure for backend
- Shared types library for type safety
- Strict dependency constraints (backend cannot import frontend)

**Development Experience:**
- Hot module replacement (HMR) for frontend
- Nx affected commands for targeted testing/building
- Storybook for component documentation (optional addition)
- ESLint + Prettier with strict configuration

**Code Quality Configuration:**

```json
// .eslintrc.json (base)
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

---

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Backend: Single Lambda + Express + API Gateway Proxy
- Database: DynamoDB
- Authentication: Custom JWT
- State Management: Redux Toolkit
- Drag-and-Drop: dnd-kit
- Monorepo: Nx workspace

**Important Decisions (Shape Architecture):**
- API Design: RESTful with OpenAPI documentation
- Error Handling: Centralized middleware with standard response format
- DynamoDB Design: Single-table design with GSIs for queries
- PWA Strategy: Service worker with stale-while-revalidate caching

**Deferred Decisions (Post-MVP):**
- Real-time sync (WebSocket integration)
- Advanced analytics/tracking
- Multi-user/team collaboration features
- Mobile native apps

---

### Data Architecture

**Database: DynamoDB**

| Attribute | Decision |
|-----------|----------|
| **Type** | NoSQL, document-key-value store |
| **Access Pattern** | Single-table design with composite keys |
| **Primary Key** | `PK` (partition key), `SK` (sort key) |
| **GSIs** | GSI1: By project, GSI2: By user, GSI3: By item type |
| **Provisioning** | On-demand (pay-per-request for MVP) |
| **Streams** | Enabled for potential future features |

**Data Model:**

```typescript
// User
{
  PK: "USER#<userId>",
  SK: "PROFILE",
  email: string,
  passwordHash: string,
  createdAt: ISO8601,
  updatedAt: ISO8601
}

// Project
{
  PK: "USER#<userId>",
  SK: "PROJECT#<projectId>",
  name: string,
  description: string,
  color: string,
  dashboardOrder: number,
  createdAt: ISO8601,
  updatedAt: ISO8601
}

// Item (Idea/Task/Note)
{
  PK: "USER#<userId>#PROJECT#<projectId>",
  SK: "ITEM#<itemType>#<itemId>",
  type: "IDEA" | "TASK" | "NOTE",
  title: string,
  content: string,
  status?: "TODO" | "IN_PROGRESS" | "DONE",
  tags: string[],
  dashboardPosition: { x: number, y: number },
  createdAt: ISO8601,
  updatedAt: ISO8601
}

// GSI1: Project-centric view
{
  GSI1PK: "PROJECT#<projectId>",
  GSI1SK: "ITEM#<itemType>#<itemId>",
  // ... rest of item data
}

// GSI2: Dashboard view (all items across projects)
{
  GSI2PK: "USER#<userId>#DASHBOARD",
  GSI2SK: "ITEM#<itemType>#<projectId>#<itemId>",
  // ... rest of item data
}
```

**Data Validation:**
- Zod schema validation on API layer
- TypeScript interfaces for type safety
- DynamoDB DocumentClient with marshall/unmarshall

**Caching Strategy:**
- API Gateway built-in caching (optional for MVP)
- Frontend React Query for server state caching
- LocalStorage for offline PWA support

---

### Authentication & Security

**Authentication: Custom JWT**

| Attribute | Decision |
|-----------|----------|
| **Method** | JWT (JSON Web Tokens) |
| **Signing** | HS256 with secret stored in AWS Secrets Manager |
| **Token Structure** | Access token (15min) + Refresh token (7 days) |
| **Storage** | httpOnly cookies (secure, sameSite=strict) |
| **Password Hashing** | bcrypt (cost factor: 12) |

**Authentication Flow:**

```
1. POST /auth/register → Create user, hash password, store in DynamoDB
2. POST /auth/login → Verify credentials, return JWT pair
3. POST /auth/refresh → Exchange refresh token for new access token
4. POST /auth/logout → Invalidate refresh token
```

**Authorization Middleware:**

```typescript
// Express middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};
```

**Security Measures:**

| Concern | Mitigation |
|---------|------------|
| **SQL Injection** | N/A (NoSQL), but use parameterized queries |
| **XSS** | React escapes by default, CSP headers |
| **CSRF** | httpOnly cookies, sameSite=strict |
| **Rate Limiting** | express-rate-limit (100 req/15min per IP) |
| **Input Validation** | Zod schemas on all endpoints |
| **CORS** | Strict origin whitelist (frontend domain only) |
| **Headers** | Helmet.js for security headers |

---

### API & Communication Patterns

**API Design: RESTful**

| Attribute | Decision |
|-----------|----------|
| **Style** | RESTful with resource-based URLs |
| **Format** | JSON (request/response) |
| **Documentation** | OpenAPI 3.0 (Swagger) |
| **Versioning** | URL path versioning (`/api/v1/`) |

**API Gateway Configuration:**

```yaml
# template.yaml (excerpt)
ApiGateway:
  Type: AWS::Serverless::Api
  Properties:
    StageName: prod
    Auth:
      DefaultAuthorizer: JWTAuthorizer
    Cors:
      AllowOrigin: "'https://your-domain.com'"
      AllowMethods: "'GET,POST,PUT,DELETE,OPTIONS'"
      AllowHeaders: "'Content-Type,Authorization'"
```

**Endpoint Structure:**

```
# Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

# Projects
GET    /api/v1/projects          # List all projects
POST   /api/v1/projects          # Create project
GET    /api/v1/projects/:id      # Get project with items
PUT    /api/v1/projects/:id      # Update project
DELETE /api/v1/projects/:id      # Delete project

# Items (nested under projects)
GET    /api/v1/projects/:projectId/items?type=idea|task|note
POST   /api/v1/projects/:projectId/items
PUT    /api/v1/projects/:projectId/items/:itemId
DELETE /api/v1/projects/:projectId/items/:itemId

# Dashboard
GET    /api/v1/dashboard         # Aggregated view with filters
PUT    /api/v1/dashboard/order   # Update project order
```

**Standard Response Format:**

```typescript
// Success
{
  data: T,
  meta: {
    timestamp: ISO8601,
    requestId: string
  }
}

// Error
{
  error: {
    code: string,
    message: string,
    details?: object
  },
  meta: {
    timestamp: ISO8601,
    requestId: string
  }
}
```

**Error Handling:**

```typescript
// Centralized error middleware
const errorMiddleware = (err, req, res, next) => {
  console.error(`[${req.id}]`, err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: err.message }
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' }
    });
  }
  
  // Default: 500
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' }
  });
};
```

---

### Frontend Architecture

**State Management: Redux Toolkit**

```typescript
// Store structure
store/
├── store.ts              # Store configuration
├── slices/
│   ├── authSlice.ts      # User auth state
│   ├── projectsSlice.ts  # Projects list
│   ├── activeProjectSlice.ts  # Currently selected project
│   ├── dashboardSlice.ts # Dashboard state, filters
│   └── uiSlice.ts        # UI state (sidebar open, modals)
├── selectors/
│   ├── auth.selectors.ts
│   ├── projects.selectors.ts
│   └── dashboard.selectors.ts
└── middleware/
    └── apiMiddleware.ts  # RTK Query or custom
```

**Component Architecture:**

```
apps/web/src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── authSlice.ts
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectList.tsx
│   │   │   ├── ProjectItem.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   └── ProjectColorPicker.tsx
│   │   └── projectsSlice.ts
│   ├── items/
│   │   ├── components/
│   │   │   ├── ItemList.tsx
│   │   │   ├── IdeaCard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── NoteCard.tsx
│   │   └── itemsSlice.ts
│   └── dashboard/
│       ├── components/
│       │   ├── DashboardCanvas.tsx
│       │   ├── DashboardFilter.tsx
│       │   └── ProjectCard.tsx
│       └── dashboardSlice.ts
│
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Spinner.tsx
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainContent.tsx
│   └── hooks/
│       ├── useApi.ts
│       └── useLocalStorage.ts
│
└── services/
    ├── api.ts              # Axios/fetch client
    ├── auth.api.ts
    ├── projects.api.ts
    └── items.api.ts
```

**Routing Strategy:**

```typescript
// React Router v6
const routes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { 
    path: '/', 
    element: <AppLayout />,
    children: [
      { path: '', element: <Dashboard /> }, // Default: dashboard
      { path: 'projects/:projectId', element: <ProjectDetail /> },
    ]
  }
];
```

**PWA Configuration:**

```typescript
// Service Worker Strategy (Workbox)
const swConfig = {
  strategies: {
    // API calls: network first, fallback to cache
    api: 'NetworkFirst',
    // Static assets: cache first
    assets: 'CacheFirst',
    // HTML: network first, fallback to cache
    pages: 'NetworkFirst',
  },
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.yourdomain\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 300 },
      },
    },
  ],
};
```

**Drag-and-Drop (dnd-kit):**

```typescript
// Dashboard canvas with dnd-kit
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';

// Sortable project cards on dashboard
// Auto-arrangeable canvas layout with collision detection
```

---

### Infrastructure & Deployment

**AWS SAM Template Structure:**

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  # API Gateway
  ApiGateway:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Cors: ...

  # Lambda Function (Single Lambda for all routes)
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: dist/apps/api/main.handler
      Runtime: nodejs18.x
      MemorySize: 512
      Timeout: 30
      Environment:
        Variables:
          NODE_ENV: production
          JWT_SECRET: !Ref JwtSecret
      Events:
        ProxyResource:
          Type: Api
          Properties:
            RestApiId: !Ref ApiGateway
            Path: /{proxy+}
            Method: ANY

  # DynamoDB Table
  UsersTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: tidy-users
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
        - AttributeName: GSI1PK
          AttributeType: S
        - AttributeName: GSI1SK
          AttributeType: S
        - AttributeName: GSI2PK
          AttributeType: S
        - AttributeName: GSI2SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      GlobalSecondaryIndexes:
        - IndexName: GSI1
          KeySchema:
            - AttributeName: GSI1PK
              KeyType: HASH
            - AttributeName: GSI1SK
              KeyType: RANGE
        - IndexName: GSI2
          KeySchema:
            - AttributeName: GSI2PK
              KeyType: HASH
            - AttributeName: GSI2SK
              KeyType: RANGE

  # Secrets Manager (JWT Secret)
  JwtSecret:
    Type: AWS::SecretsManager::Secret
    Properties:
      Description: JWT signing secret for tidy API
      GenerateSecretString:
        SecretStringLength: 64
```

**CI/CD Pipeline (GitHub Actions):**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - run: npm ci

      - name: Lint
        run: npx nx affected:lint

      - name: Type Check
        run: npx nx affected --target=build

      - name: Test
        run: npx nx affected:test --coverage

      - name: E2E Test
        run: npx nx e2e:e2e --headless
```

**Environment Configuration:**

```bash
# .env (frontend)
VITE_API_URL=https://api.tidy-app.com
VITE_APP_ENV=production

# .env (backend - Lambda environment variables)
NODE_ENV=production
JWT_SECRET=<from Secrets Manager>
USERS_TABLE_NAME=tidy-users
```

---

### Testing Strategy

**Unit Testing Requirements:**

| Component | Framework | Requirement |
|-----------|-----------|-------------|
| **Frontend** | Jest + React Testing Library | Unit tests for every story |
| **Backend** | Jest | Unit tests for every story |
| **Coverage** | Istanbul (built-in to Jest) | ≥80% coverage per story |

**E2E Testing: Playwright**

| Attribute | Decision |
|-----------|----------|
| **Framework** | Playwright (TypeScript) |
| **Test Separation** | UI tests and API tests in separate folders |
| **Test Runner** | Playwright test runner with parallel execution |
| **Reporting** | HTML + JUnit reporters |
| **Browsers** | Chromium, WebKit, Firefox |

**Story Completion Definition:**
- ✅ Feature implemented
- ✅ Frontend unit tests (components, slices, hooks)
- ✅ Backend unit tests (handlers, services, models)
- ✅ API tests (if applicable)
- ✅ E2E tests (for user-facing flows)
- ✅ All tests passing in CI

---

### Multi-Environment Deployment

**Environments:**

| Environment | Purpose | Domain |
|-------------|---------|--------|
| **dev** | Development, feature testing | dev.tidy-app.com |
| **prod** | Production | tidy-app.com |

**Frontend Deployment: S3 + CloudFront**

```yaml
# template.yaml (excerpt)
CloudFrontDistribution:
  Type: AWS::CloudFront::Distribution
  Properties:
    DistributionConfig:
      Origins:
        - Id: S3Origin
          DomainName: !GetAtt S3Bucket.DomainName
          S3OriginConfig:
            OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${CloudFrontOriginAccessIdentity}'
      DefaultCacheBehavior:
        TargetOriginId: S3Origin
        ViewerProtocolPolicy: redirect-to-https
        Compress: true
      Aliases:
        - !Ref DomainName
      ViewerCertificate:
        AcmCertificateArn: !Ref Certificate
        SslSupportMethod: sni-only

S3Bucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'tidy-app-${Environment}-frontend'
    WebsiteConfiguration:
      IndexDocument: index.html
      ErrorDocument: index.html
```

**SAM Configuration (samconfig.toml):**

```toml
version = 0.1

[default.deploy.parameters]
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-xxxxx"
s3_prefix = "tidy"
region = "us-east-1"
confirm_changeset = false
capabilities = "CAPABILITY_IAM"

[default.deploy.parameters.dev]
stack_name = "tidy-dev"
parameter_overrides = "Environment=dev DomainName=dev.tidy-app.com"

[default.deploy.parameters.prod]
stack_name = "tidy-prod"
parameter_overrides = "Environment=prod DomainName=tidy-app.com"
```

**Deployment Strategy:**

```bash
# Dev environment (develop branch)
sam deploy --stack-name tidy-dev \
  --parameter-overrides Environment=dev DomainName=dev.tidy-app.com

# Prod environment (main branch)
sam deploy --stack-name tidy-prod \
  --parameter-overrides Environment=prod DomainName=tidy-app.com
```

**Environment Variables by Stage:**

```typescript
// apps/api/src/config/environment.ts
export const config = {
  environment: process.env.ENVIRONMENT || 'dev',
  jwtSecret: process.env.JWT_SECRET,
  usersTableName: `tidy-users-${process.env.ENVIRONMENT}`,
  corsOrigins: {
    dev: 'https://dev.tidy-app.com',
    prod: 'https://tidy-app.com',
  }[process.env.ENVIRONMENT],
};
```

---

### Local Development with Docker

**Purpose:** Enable fast local development for backend without deploying to AWS.

**Docker Compose Stack:**

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  # Local DynamoDB (DynamoDB Local)
  dynamodb-local:
    image: amazon/dynamodb-local:latest
    container_name: tidy-dynamodb-local
    ports:
      - "8000:8000"
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath /home/dynamodblocal/data"
    volumes:
      - ./docker/dynamodb-data:/home/dynamodblocal/data
    working_dir: /home/dynamodblocal

  # Backend API (Express Lambda emulator)
  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile.api
    container_name: tidy-api-local
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=local
      - AWS_ACCESS_KEY_ID=mock-access-key
      - AWS_SECRET_ACCESS_KEY=mock-secret-key
      - AWS_REGION=us-east-1
      - DYNAMODB_ENDPOINT=http://dynamodb-local:8000
      - DYNAMODB_TABLE_NAME=tidy-users-local
      - JWT_SECRET=local-dev-secret-change-in-prod
    volumes:
      - ../apps/api:/app/apps/api
      - ../libs:/app/libs
      - /app/node_modules
    depends_on:
      - dynamodb-local
    command: npm run dev:api

  # DynamoDB Admin UI (optional)
  dynamodb-admin:
    image: aaronshaf/dynamodb-admin:latest
    container_name: tidy-dynamodb-admin
    ports:
      - "8001:8001"
    environment:
      - DYNAMO_ENDPOINT=http://dynamodb-local:8000
    depends_on:
      - dynamodb-local
```

**Dockerfile for Backend API:**

```dockerfile
# docker/Dockerfile.api
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm ci

# Copy source code
COPY apps/api ./apps/api
COPY libs ./libs
COPY nx.json ./
COPY tsconfig.base.json ./

# Build the API
RUN npx nx build api

EXPOSE 3001

CMD ["npx", "nx", "dev:api"]
```

**Local Development Scripts:**

```json
// package.json (root)
{
  "scripts": {
    "dev:local": "docker compose -f docker/docker-compose.yml up -d",
    "dev:local:down": "docker compose -f docker/docker-compose.yml down",
    "dev:local:logs": "docker compose -f docker/docker-compose.yml logs -f",
    "dev:local:rebuild": "docker compose -f docker/docker-compose.yml up -d --build",
    "dev:local:seed": "ts-node tools/scripts/seed-local-db.ts"
  }
}
```

**API Handler for Local/Cloud Agnosticism:**

```typescript
// apps/api/src/main.ts - Lambda entry point
import { createServer, proxy } from 'aws-serverless-express';
import { app } from './app';

const server = createServer(app);

// Lambda handler
export const handler = async (event, context) => {
  return proxy(server, event, context, 'PROMISE').promise;
};

// Local development server (Docker)
if (process.env.NODE_ENV === 'local') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API running locally on port ${PORT}`);
    console.log(`DynamoDB endpoint: ${process.env.DYNAMODB_ENDPOINT}`);
  });
}
```

**DynamoDB Client Configuration:**

```typescript
// apps/api/src/utils/dynamodb.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isLocal = process.env.NODE_ENV === 'local';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: isLocal ? process.env.DYNAMODB_ENDPOINT : undefined,
  credentials: isLocal
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock',
      }
    : undefined,
});

export const dynamoDb = DynamoDBDocumentClient.from(client);
```

**Local Database Seeding:**

```typescript
// tools/scripts/seed-local-db.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: { accessKeyId: 'mock', secretAccessKey: 'mock' },
  })
);

async function seed() {
  // Create tables and seed data
  console.log('Seeding local DynamoDB...');
  
  // Add test users, projects, items
  await dynamoDb.send(new PutCommand({
    TableName: 'tidy-users-local',
    Item: {
      PK: 'USER#test-user-id',
      SK: 'PROFILE',
      email: 'test@example.com',
      passwordHash: '$2b$12$...',
      createdAt: new Date().toISOString(),
    },
  }));
  
  console.log('Seed complete!');
}

seed().catch(console.error);
```

**Development Workflow:**

```bash
# Start local stack (DynamoDB + API)
npm run dev:local

# View logs
npm run dev:local:logs

# Stop local stack
npm run dev:local:down

# Seed test data
npm run dev:local:seed

# Access DynamoDB Admin UI
open http://localhost:8001

# Access API
curl http://localhost:3001/api/v1/health
```

**Benefits:**
- **Fast iteration** — No AWS deployment needed for backend changes
- **Offline development** — Works without internet connection
- **Consistent environment** — Same DynamoDB version as production
- **Easy onboarding** — New developers: `npm run dev:local` and go
- **Cost-free** — No AWS charges for local development

---

### Decision Impact Analysis

**Implementation Sequence:**

1. **Nx Workspace Setup** — Foundation for all code
2. **Shared Types Library** — Type contracts for frontend/backend
3. **Docker Local Development Setup** — Docker Compose, DynamoDB Local, API container
4. **Backend: Express + Lambda** — API layer with local/cloud agnostic handler
5. **DynamoDB Table + Data Access** — Database layer with local endpoint support
6. **Authentication Module** — JWT auth flow
7. **Frontend: App Shell** — Routing, layout, providers
8. **Projects Feature** — CRUD operations
9. **Items Feature** — Ideas, tasks, notes
10. **Dashboard Feature** — Aggregation, dnd-kit canvas
11. **PWA Configuration** — Service worker, offline support
12. **E2E Testing Setup** — Playwright with separate UI/API test suites
13. **CI/CD Pipeline** — Multi-environment deployment (dev/prod)

**Per-Story Testing Requirements:**
- Frontend unit tests (Jest + React Testing Library)
- Backend unit tests (Jest)
- API tests (Playwright API)
- E2E tests (Playwright UI for user flows)

**Cross-Component Dependencies:**

```
Shared Types
    ↓
Backend (API) ←→ DynamoDB
    ↓
Frontend (API Client)
    ↓
Redux Store
    ↓
UI Components
```

---
