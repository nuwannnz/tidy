---
story_number: "2.5"
story_key: "2-5-project-api-endpoints"
story_name: "Project API Endpoints"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 2.5: Project API Endpoints

> **QA Note:** This story enables parallel test case development.

## 1. Description

### 1.1 User Story Statement
As a frontend developer,
I want backend API endpoints for project CRUD operations,
so that the frontend can create, read, update, and delete projects.

### 1.2 Business Context
Complete, well-documented API endpoints are the foundation for frontend development and enable parallel work streams.

### 1.3 Technical Overview
- **Backend:** Express API with full CRUD operations
- **Database:** DynamoDB with single-table design
- **Security:** JWT authentication, ownership verification

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am authenticated, when I GET /api/v1/projects, then all my projects are returned | Must Have | Yes |
| AC-2 | Given I am authenticated, when I POST with valid data, then project is created with 201 status | Must Have | Yes |
| AC-3 | Given I am authenticated, when I PUT with updated fields, then project is updated | Must Have | Yes |
| AC-4 | Given I am authenticated, when I DELETE, then project returns 204 No Content | Must Have | Yes |
| AC-5 | Given I am not authenticated, when I make any request, then I receive 401 Unauthorized | Must Have | Yes |
| AC-6 | Given I request non-existent project, when I GET/PUT/DELETE, then I receive 404 Not Found | Must Have | Yes |

## 3. Backend API Changes

### 3.1 Endpoints Summary
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/v1/projects` | GET | List all user projects | Bearer Token |
| `/api/v1/projects` | POST | Create new project | Bearer Token |
| `/api/v1/projects/:id` | GET | Get single project | Bearer Token |
| `/api/v1/projects/:id` | PUT | Update project | Bearer Token |
| `/api/v1/projects/:id` | DELETE | Delete project | Bearer Token |

### 3.2 Database Query Patterns
```typescript
// All operations use the single tidy-{env} table

// List projects (GSI1: by user)
const projects = await db.query({
  IndexName: 'GSI1',
  KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
  ExpressionAttributeValues: {
    ':pk': `USER#${userId}`,
    ':sk': 'PROJECT#'
  }
});

// Get single project
const project = await db.get({
  TableName: `tidy-${environment}`,
  Key: { PK: `PROJECT#${id}`, SK: 'PROFILE' }
});

// Create project
await db.put({
  TableName: `tidy-${environment}`,
  Item: {
    PK: `PROJECT#${id}`,
    SK: 'PROFILE',
    GSI1PK: `USER#${userId}`,
    GSI1SK: `PROJECT#${name}`,
    GSI2PK: `USER#${userId}`,
    GSI2SK: `PROJECT#${id}`,
    entityType: 'PROJECT',
    // ... other fields
  }
});

// Update project
await db.update({
  TableName: `tidy-${environment}`,
  Key: { PK: `PROJECT#${id}`, SK: 'PROFILE' },
  UpdateExpression: 'SET #name = :name, #updatedAt = :updatedAt',
  ExpressionAttributeNames: { '#name': 'name', '#updatedAt': 'updatedAt' },
  ExpressionAttributeValues: { ':name': name, ':updatedAt': new Date().toISOString() },
  ReturnValues: 'ALL_NEW'
});

// Delete project
await db.delete({
  TableName: `tidy-${environment}`,
  Key: { PK: `PROJECT#${id}`, SK: 'PROFILE' }
});
```

### 3.3 API Test Considerations for QA
QA team will create API tests based on the endpoint specifications above. Key test areas:
- CRUD operations (GET all, GET by id, POST, PUT, DELETE)
- Authentication required for all endpoints
- Ownership verification (user can only access their projects)
- 404 for non-existent projects
- Rate limiting enforcement

## 4. Frontend Changes

### 4.1 API Integration
| File | Purpose |
|------|---------|
| `apps/web/src/api/projectsApi.ts` | API client for project operations |

### 4.2 API Client Example
```typescript
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: CreateProjectDto) => api.post('/projects', data),
  update: (id: string, data: UpdateProjectDto) => 
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};
```

## 5. Edge Scenarios & Test Cases

### 5.1 Manual Test Cases

**TC-01: List Projects - Success**
- **Steps:** Call GET /api/v1/projects with valid token → Verify projects array returned
- **Expected:** All user projects returned, sorted alphabetically

**TC-02: Get Project - Not Found**
- **Steps:** Call GET /api/v1/projects/non-existent-id → Verify 404
- **Expected:** Error "Project not found"

**TC-03: Create Project - Unauthorized**
- **Steps:** Call POST without token → Verify 401
- **Expected:** Error "Unauthorized"

**TC-04: Update Project - Wrong User**
- **Steps:** Try to update another user's project → Verify 403 or 404
- **Expected:** Access denied

### 5.2 Automation Test Notes for QA
QA team will create API automation scripts. Key scenarios to cover:
- Full CRUD workflow (create, read, update, delete)
- Authentication and authorization
- Error handling (404, 401, 400)

## 6. Dependencies
- Story 1.x: Authentication (JWT middleware)
- Story 2.1-2.4: Project CRUD operations

## 7. Security Considerations
- JWT authentication required for all endpoints
- Ownership verification (user can only access their projects)
- Input validation and sanitization
- Rate limiting (100 req/min per user)

## 8. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#api-patterns)
- [Story 2.1-2.4: Project CRUD](./2-1-create-project.md)

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/routes/projects.ts` | CREATE | Full CRUD endpoints |
| `apps/api/src/repositories/project.repository.ts` | CREATE | DynamoDB access layer |
| `apps/api/src/services/project.service.ts` | CREATE | Business logic |
| `apps/web/src/api/projectsApi.ts` | CREATE | API client |
| `tests/api/projects-api.spec.ts` | CREATE | API tests (QA team) |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#api-patterns)
- [Story 2.1-2.4: Project CRUD](./2-1-create-project.md)
