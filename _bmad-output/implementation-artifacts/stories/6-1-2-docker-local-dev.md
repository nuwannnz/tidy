---
story_number: "6.1.2"
story_key: "6-1-2-docker-local-dev"
story_name: "Docker Local Development Stack"
status: done
created_date: "2026-04-01"
last_updated: "2026-04-16"
---

# Story 6.1.2: Docker Local Development Stack

> **QA Note:** This is a foundation/setup story. QA validation focuses on Docker stack functionality, API health checks, and local database connectivity.

## 1. Description

### 1.1 User Story Statement
As a developer,
I want a Docker Compose stack for local development,
so that I can run the full application stack (API + DynamoDB) locally without AWS deployment.

### 1.2 Business Context
Fast local development is critical for developer productivity. A Docker-based local stack eliminates AWS deployment delays during development and provides a consistent environment across the team.

### 1.3 Technical Overview
- **DynamoDB Local:** Containerized DynamoDB for local testing
- **API Container:** Express Lambda emulator running locally
- **Docker Compose:** Orchestrates multi-container setup
- **Seed Scripts:** Populate local database with test data

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I run `npm run dev:local`, then DynamoDB Local starts on port 8000 | Must Have | Yes |
| AC-2 | Given I run `npm run dev:local`, then the API container starts on port 3001 | Must Have | Yes |
| AC-3 | Given the stack is running, when I access http://localhost:3001/api/v1/health, then I receive a healthy response | Must Have | Yes |
| AC-4 | Given I run `npm run dev:local:seed`, then a test user is created in DynamoDB Local | Must Have | Yes |
| AC-5 | Given the stack is running, when I stop it, then data persists for next session | Should Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** API responds in < 500ms locally
- **Usability:** Single command to start entire stack
- **Reliability:** Consistent behavior across developer machines

## 3. Technical Specifications

### 3.1 Docker Compose Configuration
**docker/docker-compose.yml:**
```yaml
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
      - ./dynamodb-data:/home/dynamodblocal/data
    working_dir: /home/dynamodblocal
    networks:
      - tidy-network

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
      - DYNAMODB_TABLE_NAME=tidy-local
      - JWT_SECRET=local-dev-secret-change-in-prod
    volumes:
      - ../apps/api:/app/apps/api
      - ../libs:/app/libs
      - /app/node_modules
    depends_on:
      - dynamodb-local
    networks:
      - tidy-network
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
    networks:
      - tidy-network

networks:
  tidy-network:
    driver: bridge
```

### 3.2 API Dockerfile
**docker/Dockerfile.api:**
```dockerfile
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

### 3.3 DynamoDB Client Configuration
**apps/api/src/utils/dynamodb.ts:**
```typescript
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

### 3.4 API Handler for Local/Cloud Agnosticism
**apps/api/src/main.ts:**
```typescript
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

### 3.5 Seed Script
**tools/scripts/seed-local-db.ts:**
```typescript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcrypt';

const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: { accessKeyId: 'mock', secretAccessKey: 'mock' },
  })
);

async function createTables() {
  console.log('Creating tidy-local table...');
  // Table creation handled by Docker volume mount
  console.log('Table ready!');
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash('SecurePass123!', 12);
  
  await dynamoDb.send(new PutCommand({
    TableName: 'tidy-local',
    Item: {
      PK: 'USER#test-user-id',
      SK: 'PROFILE',
      GSI1PK: 'EMAIL#test@example.com',
      GSI1SK: 'PROFILE',
      GSI2PK: 'USER#test-user-id',
      GSI2SK: 'PROFILE',
      entityType: 'USER',
      email: 'test@example.com',
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }));

  console.log('Test user created: test@example.com / SecurePass123!');
}

async function seed() {
  console.log('Seeding local DynamoDB...');
  await createTables();
  await seedUsers();
  console.log('Seed complete!');
}

seed().catch(console.error);
```

## 4. Setup Instructions

### 4.1 NPM Scripts
**package.json (root):**
```json
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

### 4.2 Installation Commands
```bash
# Ensure Docker Desktop is installed and running

# Start local stack
npm run dev:local

# View logs
npm run dev:local:logs

# Seed test data
npm run dev:local:seed

# Stop local stack
npm run dev:local:down

# Rebuild containers
npm run dev:local:rebuild
```

### 4.3 Verification Commands
```bash
# Check API health
curl http://localhost:3001/api/v1/health

# Access DynamoDB Admin UI
open http://localhost:8001

# Check container status
docker ps

# View API logs
docker logs tidy-api-local -f
```

## 5. Validation Checklist

### 5.1 Stack Validation
| Check | Command | Expected Result |
|-------|---------|-----------------|
| DynamoDB running | `docker ps` | Container `tidy-dynamodb-local` is up |
| API running | `docker ps` | Container `tidy-api-local` is up |
| API health | `curl http://localhost:3001/api/v1/health` | Returns `{"status": "healthy"}` |
| DynamoDB Admin | Access http://localhost:8001 | Admin UI loads |
| Test user exists | Run seed script | User created in DynamoDB |
| Data persistence | Stop/start stack | Data persists in volume |

### 5.2 API Connectivity Test
```bash
# Test health endpoint
curl http://localhost:3001/api/v1/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2026-04-01T10:00:00Z",
  "environment": "local"
}
```

### 5.3 Database Connectivity Test
```bash
# After seeding, verify user exists
# Use DynamoDB Admin UI at http://localhost:8001
# Navigate to tidy-local table
# Verify USER#test-user-id item exists
```

## 6. Environment Variables

### 6.1 API Environment Variables
```bash
# .env.local (for local development)
NODE_ENV=local
PORT=3001
AWS_ACCESS_KEY_ID=mock-access-key
AWS_SECRET_ACCESS_KEY=mock-secret-key
AWS_REGION=us-east-1
DYNAMODB_ENDPOINT=http://dynamodb-local:8000
DYNAMODB_TABLE_NAME=tidy-local
JWT_SECRET=local-dev-secret-change-in-prod
```

## 7. Dependencies

### 7.1 Prerequisites
- Docker Desktop installed and running
- Node.js 18.x or higher
- npm 9.x or higher

### 7.2 Docker Images
- `amazon/dynamodb-local:latest` - DynamoDB Local
- `aaronshaf/dynamodb-admin:latest` - DynamoDB Admin UI (optional)
- `node:18-alpine` - API base image

### 7.3 npm Packages
```json
{
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.x",
    "@aws-sdk/lib-dynamodb": "^3.x",
    "aws-serverless-express": "^3.x",
    "bcrypt": "^5.x"
  },
  "devDependencies": {
    "ts-node": "^10.x",
    "@types/bcrypt": "^5.x"
  }
}
```

## 8. Troubleshooting

### 8.1 Common Issues
| Issue | Solution |
|-------|----------|
| Port 8000 already in use | Change port in docker-compose.yml or stop conflicting service |
| API can't connect to DynamoDB | Verify DYNAMODB_ENDPOINT is correct in environment |
| Seed script fails | Ensure DynamoDB Local is running before seeding |
| Volume mount issues | Check Docker Desktop file sharing settings |
| Container exits immediately | Check logs: `docker logs tidy-api-local` |

### 8.2 Reset Local Database
```bash
# Stop stack
npm run dev:local:down

# Delete volume data
rm -rf docker/dynamodb-data

# Restart fresh
npm run dev:local
npm run dev:local:seed
```

## 9. Dev Agent Record

### Implementation Plan
**Started:** 2026-04-16
**Strategy:** Create Docker Compose stack with DynamoDB Local, API container, and admin UI. Add versioned health endpoint, DynamoDB client utility, seed script, and npm convenience scripts.

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `docker/docker-compose.yml` | CREATE | Docker Compose stack with DynamoDB Local, API, and Admin UI | ~55 |
| `docker/Dockerfile.api` | CREATE | API container build instructions (node:18-alpine) | ~18 |
| `apps/api/src/utils/dynamodb.ts` | CREATE | DynamoDB client with local/cloud agnosticism | ~20 |
| `apps/api/src/utils/dynamodb.spec.ts` | CREATE | Unit tests for DynamoDB client config | ~30 |
| `apps/api/src/app.ts` | MODIFY | Added /api/v1/health endpoint, fixed lint warnings | ~80 |
| `apps/api/src/app.spec.ts` | MODIFY | Added HTTP integration tests for health endpoints | ~55 |
| `apps/api/src/main.ts` | MODIFY | Added local dev server mode with port/endpoint logging | ~25 |
| `tools/scripts/seed-local-db.ts` | CREATE | Database table creation and test user seeding | ~80 |
| `package.json` | MODIFY | Added dev:local scripts and ts-node dependency | +7 lines |
| `.gitignore` | MODIFY | Added docker/dynamodb-data to ignores | +3 lines |

### Debug Log
- Created Docker Compose with 3 services: dynamodb-local (port 8000), api (port 3001), dynamodb-admin (port 8001)
- API Dockerfile uses node:18-alpine, runs nx build, then starts built output
- DynamoDB client conditionally uses local endpoint when NODE_ENV=local
- Added /api/v1/health returning {status, timestamp, environment}
- Seed script creates DynamoDB table with PK/SK and GSI1 index, seeds test user
- Added 5 npm scripts: dev:local, dev:local:down, dev:local:logs, dev:local:rebuild, dev:local:seed
- Fixed pre-existing lint warnings (unused vars) in app.ts and main.ts
- All 7 API tests pass, 17 total across workspace, lint clean

### Completion Notes
**All acceptance criteria satisfied:**
- AC-1: ✅ `npm run dev:local` starts DynamoDB Local on port 8000
- AC-2: ✅ `npm run dev:local` starts API container on port 3001
- AC-3: ✅ GET /api/v1/health returns healthy response
- AC-4: ✅ `npm run dev:local:seed` creates test user in DynamoDB Local
- AC-5: ✅ Data persists via Docker volume mount (docker/dynamodb-data)

**Tests Written:** 7 unit/integration tests (3 DynamoDB client + 4 API endpoints)
**Build Status:** All projects build successfully
**Test Status:** All 17 tests pass across workspace (0 regressions)
**Lint Status:** Clean (0 errors, 0 warnings)

### Code Review Checklist
- [x] Docker Compose starts all services (DynamoDB, API, Admin)
- [x] API connects to DynamoDB Local via env-driven endpoint
- [x] Health endpoint responds correctly at /api/v1/health
- [x] Seed script creates table and test data
- [x] Data persists across container restarts (volume mount)
- [x] Logs accessible via `npm run dev:local:logs`

## Change Log

- **2026-04-16:** Implemented Docker local dev stack (docker-compose, Dockerfile, DynamoDB client, health endpoint, seed script, npm scripts)
- **2026-04-16:** Fixed lint warnings in app.ts and main.ts
- **2026-04-16:** All 17 tests pass, lint clean, story marked for review

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#local-development-with-docker)
- [Story 6.1.1: Nx Monorepo Workspace](./6-1-1-nx-monorepo-workspace.md)
- [Docker Documentation](https://docs.docker.com)
- [DynamoDB Local Documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
