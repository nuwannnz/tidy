---
story_number: "{{epic_num}}.{{story_num}}"
story_key: "{{story_key}}"
story_name: "{{story_title}}"
status: ready-for-dev
created_date: "{{date}}"
last_updated: "{{date}}"
---

# Story {{epic_num}}.{{story_num}}: {{story_title}}

> **QA Note:** This story template enables parallel test case development. QA can write manual test cases and automation scripts using the specifications in sections 3-5 while development is in progress. Update `last_updated` in the header when story changes.

## 1. Description

### 1.1 User Story Statement
As a {{role}},
I want {{action}},
so that {{benefit}}.

### 1.2 Business Context
[Why this story matters, business value, user impact]

### 1.3 Technical Overview
[High-level technical approach, system components involved]

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | [BDD format: Given/When/Then] | Must Have | Yes/No |
| AC-2 | [BDD format] | Should Have | Yes/No |

### 2.2 Non-Functional Requirements
- **Performance:** [Response times, load expectations]
- **Security:** [Auth requirements, data protection]
- **Accessibility:** [WCAG compliance level]
- **Compatibility:** [Browser/device support]

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required | Rate Limit |
|----------|--------|---------|---------------|------------|
| `/api/v1/resource` | POST | Create new resource | Bearer Token | 100/min |

### 3.2 Request Details
**Endpoint:** `POST /api/v1/resource`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "field1": "type (required) - description",
  "field2": "type (optional) - description"
}
```

**Field Validation Rules:**
| Field | Type | Required | Min/Max | Pattern | Error Message |
|-------|------|----------|---------|---------|---------------|
| field1 | string | Yes | 1-100 | N/A | "Field1 is required" |
| field2 | email | No | N/A | email regex | "Invalid email format" |

### 3.3 Response Details
**Success Response (201 Created):**
```json
{
  "id": "uuid",
  "data": {},
  "metadata": {
    "created_at": "ISO8601",
    "created_by": "user_id"
  }
}
```

**Error Responses:**
| Code | Error | Response Body | Handling |
|------|-------|---------------|----------|
| 400 | Validation Error | `{"errors": [{"field": "field1", "message": "..."}]}` | Display field-level errors |
| 401 | Unauthorized | `{"error": "Unauthorized"}` | Redirect to login |
| 403 | Forbidden | `{"error": "Forbidden"}` | Show access denied message |
| 409 | Conflict | `{"error": "Resource already exists"}` | Display conflict message, offer merge |
| 500 | Server Error | `{"error": "Internal server error"}` | Log error, show user-friendly message |

### 3.4 Database Changes
- **Tables Affected:** `[table_names]`
- **New Tables:**
```sql
CREATE TABLE IF NOT EXISTS table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  -- add columns
);
```
- **Schema Changes:** `[ALTER/CREATE statements]`
- **Indexes:** `[CREATE INDEX statements for performance]`
- **Data Migration:** [If applicable - migration script details]

### 3.5 Service Layer Changes
- **New Services:**
  - `ResourceService` - Handles business logic for resource operations
  - `ResourceValidator` - Validates resource data and business rules
- **Modified Services:** `[Existing services to update]`
- **Repository Layer:**
  - `ResourceRepository` - Database access methods
  - Methods: `create()`, `findById()`, `update()`, `delete()`
- **Integration Points:**
  - External APIs: `[Third-party service integrations]`
  - Message Queues: `[Events published/consumed]`
  - Cache Strategy: `[Redis/Memcached usage]`

### 3.6 API Test Cases for QA
**Test Case API-01: Create Resource - Success**
```javascript
// Automation-ready test structure
POST /api/v1/resource
Headers: { Authorization: "Bearer {valid_token}" }
Body: { "field1": "valid_value" }
Expected: 201 Created, response contains id and data
```

**Test Case API-02: Create Resource - Validation Failure**
```javascript
POST /api/v1/resource
Body: { "field1": "" }
Expected: 400 Bad Request, errors array with field1 message
```

**Test Case API-03: Create Resource - Unauthorized**
```javascript
POST /api/v1/resource
Headers: { Authorization: "Bearer {invalid_token}" }
Expected: 401 Unauthorized
```

## 4. Frontend Changes

### 4.1 New Components
| Component | Path | Purpose | Props | State | Parent/Child |
|-----------|------|---------|-------|-------|--------------|
| ResourceForm.tsx | `src/components/resource/ResourceForm.tsx` | Form for creating resources | onSubmit, initialData | formData, errors, isLoading | Parent: ResourcePage, Child: FormInput |
| ResourceList.tsx | `src/components/resource/ResourceList.tsx` | Display resource list | resources, onEdit, onDelete | search, sort, pagination | Parent: ResourcePage |

### 4.2 Modified Components
| Component | Path | Changes Required | Impact |
|-----------|------|------------------|--------|
| Navbar.tsx | `src/components/layout/Navbar.tsx` | Add "Resources" navigation link | Low |
| AppRoutes.tsx | `src/routes/AppRoutes.tsx` | Add resource routes | Medium |

### 4.3 State Management
- **Store Updates:**
```typescript
// Redux/Zustand slice example
interface ResourceState {
  items: Resource[];
  selected: Resource | null;
  loading: boolean;
  error: string | null;
}
```
- **New Actions/Reducers:**
  - `fetchResources()` - GET /api/v1/resources
  - `createResource(data)` - POST /api/v1/resource
  - `updateResource(id, data)` - PUT /api/v1/resource/:id
  - `deleteResource(id)` - DELETE /api/v1/resource/:id
- **API Integration:**
```typescript
// React Query hook example
export const useResourceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => api.post('/resources', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['resources']);
      }
    }
  );
};
```

### 4.4 UI/UX Specifications
- **Layout:** [Reference to Figma/wireframe or description]
- **Component Library:** [Material-UI / Ant Design / Chakra UI]
- **Styling Approach:** [Tailwind / CSS Modules / Styled Components]
- **Theme:** [Light/Dark mode support, custom theme tokens]
- **Responsive Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Interactions:**
  - Form validation: Real-time on blur
  - Submit: Disable button, show loading spinner
  - Success: Toast notification + redirect
  - Error: Inline error messages, preserve form data
- **Animations:**
  - Page transitions: Fade-in 200ms
  - Button hover: Scale 1.05
  - Loading states: Skeleton screens

### 4.5 Routing
- **New Routes:**
```typescript
{
  path: '/resources',
  element: <ResourcePage />,
  children: [
    { path: ':id', element: <ResourceDetailPage /> },
    { path: 'new', element: <ResourceCreatePage /> },
    { path: ':id/edit', element: <ResourceEditPage /> }
  ]
}
```
- **Route Guards:**
  - Authentication required: All resource routes
  - Authorization: Admin role for delete operations
- **Navigation Flow:**
  1. User clicks "Resources" in navbar
  2. Navigate to `/resources` (list view)
  3. Click "Create New" → `/resources/new`
  4. Submit form → Success toast → Redirect to `/resources`

### 4.6 Frontend Test Hooks for QA
**Test IDs for Automation:**
```typescript
// Add these data-testid attributes to components
<ResourceForm data-testid="resource-form" />
  <input data-testid="resource-form-field1" />
  <input data-testid="resource-form-field2" />
  <button data-testid="resource-form-submit" />
  <button data-testid="resource-form-cancel" />
  <div data-testid="resource-form-errors" />
<ResourceList data-testid="resource-list" />
  <div data-testid="resource-list-item-{id}" />
  <button data-testid="resource-edit-btn-{id}" />
  <button data-testid="resource-delete-btn-{id}" />
```

**Component Test Selectors:**
```typescript
// For testing library queries
export const ResourceSelectors = {
  form: () => screen.getByTestId('resource-form'),
  field1: () => screen.getByTestId('resource-form-field1'),
  submitButton: () => screen.getByTestId('resource-form-submit'),
  errorMessage: (field) => screen.getByTestId(`error-${field}`),
  listItem: (id) => screen.getByTestId(`resource-list-item-${id}`),
};
```

## 5. Edge Scenarios & Test Cases

### 5.1 Edge Cases
| ID | Scenario | Trigger | Expected Behavior | Priority | Test Status |
|----|----------|---------|-------------------|----------|-------------|
| EC-01 | Network failure during submission | Disconnect internet | Show retry option, preserve form data, offline indicator | High | [ ] Not Started |
| EC-02 | Duplicate entry detection | Submit existing resource | Display conflict message, offer merge/view existing | High | [ ] Not Started |
| EC-03 | Session timeout during operation | Token expires | Save state to localStorage, redirect to login, restore on return | High | [ ] Not Started |
| EC-04 | Empty state handling | No resources exist | Show placeholder with CTA "Create First Resource" | Medium | [ ] Not Started |
| EC-05 | Large file upload | Upload > 10MB | Show progress, validate size, reject with clear message | Medium | [ ] Not Started |
| EC-06 | Concurrent edits | Two users edit same resource | Last save wins with conflict warning, show diff | Low | [ ] Not Started |
| EC-07 | Browser back during submit | Click back button | Prevent navigation, show "Changes will be lost" warning | Low | [ ] Not Started |

### 5.2 Validation Scenarios
| Field | Valid Input | Invalid Input | Boundary Case | Error Message |
|-------|-------------|---------------|---------------|---------------|
| email | user@example.com | invalid, @example.com | 254 char email | "Please enter a valid email address" |
| password | MyP @ss123! | 123456, abc | Exactly 8 chars | "Password must be 8-128 chars with letter, number, special" |
| phone | +1-555-123-4567 | 123, abc-defg | International format | "Enter valid phone with country code" |
| name | John Doe | <script>alert('x')</script> | 100 char name | "Name must be 1-100 characters, no special chars" |

### 5.3 Manual Test Cases (QA Ready)

**TC-01: Create Resource - Happy Path**
- **Preconditions:** User is logged in, has create permission
- **Test Steps:**
  1. Navigate to `/resources/new`
  2. Fill all required fields with valid data
  3. Click "Submit" button
  4. Verify success toast appears
  5. Verify redirect to resource list
  6. Verify new resource appears in list
- **Expected Result:** Resource created successfully, user notified, list updated
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-02: Create Resource - Validation Error**
- **Preconditions:** User is logged in
- **Test Steps:**
  1. Navigate to `/resources/new`
  2. Leave required fields empty
  3. Click "Submit" button
  4. Verify inline error messages appear
  5. Fill one field with invalid format
  6. Verify specific error message
- **Expected Result:** Form displays validation errors, submission prevented
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-03: View Resource Details**
- **Preconditions:** At least one resource exists
- **Test Steps:**
  1. Navigate to `/resources`
  2. Click on a resource item
  3. Verify all details display correctly
  4. Verify edit and delete buttons visible (if permitted)
- **Expected Result:** Resource details load and display accurately
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-04: Edit Resource**
- **Preconditions:** Resource exists, user has edit permission
- **Test Steps:**
  1. Navigate to resource detail page
  2. Click "Edit" button
  3. Modify one or more fields
  4. Click "Save" button
  5. Verify changes persist
- **Expected Result:** Resource updated successfully, changes reflected
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-05: Delete Resource**
- **Preconditions:** Resource exists, user has delete permission
- **Test Steps:**
  1. Navigate to resource detail page
  2. Click "Delete" button
  3. Confirm deletion in modal
  4. Verify success message
  5. Verify resource removed from list
- **Expected Result:** Resource deleted, user notified, list updated
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

### 5.4 Automation Test Scripts Structure

**Playwright E2E Test Example:**
```typescript
// tests/e2e/resource-create.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Resource Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-submit"]');
  });

  test('TC-01: Create resource - happy path', async ({ page }) => {
    await page.goto('/resources/new');
    
    // Fill form using test IDs
    await page.fill('[data-testid="resource-form-field1"]', 'Test Value');
    await page.fill('[data-testid="resource-form-field2"]', 'test@example.com');
    
    // Submit
    await page.click('[data-testid="resource-form-submit"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    await expect(page).toHaveURL('/resources');
    await expect(page.locator('[data-testid="resource-list-item-1"]')).toBeVisible();
  });

  test('TC-02: Create resource - validation error', async ({ page }) => {
    await page.goto('/resources/new');
    await page.click('[data-testid="resource-form-submit"]');
    
    // Verify validation errors
    await expect(page.locator('[data-testid="resource-form-errors"]')).toBeVisible();
  });
});
```

**API Test Example (Supertest):**
```typescript
// tests/api/resource-api.spec.ts
import request from 'supertest';
import { app } from '../../src/app';

describe('Resource API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Get auth token
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = res.body.token;
  });

  test('API-01: POST /api/v1/resource - success', async () => {
    const response = await request(app)
      .post('/api/v1/resource')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ field1: 'test value' })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.data.field1).toBe('test value');
  });

  test('API-02: POST /api/v1/resource - validation error', async () => {
    const response = await request(app)
      .post('/api/v1/resource')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ field1: '' })
      .expect(400);
    
    expect(response.body.errors).toBeInstanceOf(Array);
  });
});
```

### 5.5 Performance Test Scenarios
- **Load Test:**
  - Concurrent users: 100
  - Requests per second: 50
  - Expected response time: < 200ms (p95)
- **Stress Test:**
  - Breaking point: Identify at what load system fails
  - Recovery: System should auto-recover when load decreases
- **Response Time SLA:**
  - API endpoints: < 300ms (p95), < 500ms (p99)
  - Page load: < 2s on 3G, < 1s on broadband
  - Time to Interactive: < 3.5s

## 6. Dependencies

### 6.1 Internal Dependencies
- **Prerequisite Stories:**
  - [Story 1.1 - User Authentication](path/to/story-1-1.md)
  - [Story 1.2 - Base Layout](path/to/story-1-2.md)
- **Reusable Components:**
  - `FormInput` - Shared form input component
  - `DataTable` - Shared table component
- **Existing Services:**
  - `AuthService` - Must be implemented
  - `LoggerService` - For error tracking

### 6.2 External Dependencies
- **npm Packages:**
```json
{
  "dependencies": {
    "react-hook-form": "^7.x.x",
    "zod": "^3.x.x",
    "@tanstack/react-query": "^5.x.x",
    "axios": "^1.x.x"
  }
}
```
- **Third-Party APIs:**
  - `[API Name]` - [Purpose], API key required
- **Tools:**
  - Testing: Jest, React Testing Library, Playwright
  - Build: Vite, TypeScript 5.x

## 7. Security Considerations

### 7.1 Authentication & Authorization
- **Authentication Required:** Yes - Bearer token via Authorization header
- **Authorization Rules:**
  - Create: Authenticated users
  - Read: Authenticated users (own resources), Admin (all)
  - Update: Resource owner, Admin
  - Delete: Admin only
- **Role-Based Access Control:**
```typescript
const permissions = {
  'resource:create': ['user', 'admin'],
  'resource:read': ['user', 'admin'],
  'resource:update': ['user', 'admin'],
  'resource:delete': ['admin']
};
```

### 7.2 Data Protection
- **Encryption:**
  - In Transit: TLS 1.3 required
  - At Rest: AES-256 for sensitive fields
- **Sensitive Data Handling:**
  - Never log passwords, tokens, PII
  - Mask sensitive data in UI (e.g., `****@email.com`)
- **Data Retention:** [Retention policy, deletion rules]

### 7.3 Input Security
- **XSS Prevention:**
  - Sanitize all user inputs
  - Use React's built-in escaping (no dangerouslySetInnerHTML)
  - CSP headers configured
- **SQL Injection Prevention:**
  - Use parameterized queries only
  - ORM with built-in protection
- **CSRF Protection:**
  - CSRF tokens on all state-changing requests
  - SameSite cookies

### 7.4 Rate Limiting
- **API Rate Limits:**
  - General: 100 requests/minute per user
  - Create operations: 10 requests/minute
  - Auth endpoints: 5 requests/minute
- **DDoS Protection:**
  - Cloudflare/WAF rules
  - Automatic IP blocking after 1000 failed requests

## 8. Deployment & Rollback

### 8.1 Migration Steps
```bash
# 1. Database migration
cd backend && npm run db:migrate up

# 2. Backend deployment
cd backend && npm run build && pm2 restart api

# 3. Frontend deployment
cd frontend && npm run build && rsync -av dist/ server:/var/www/app/

# 4. Verification
curl -X GET https://api.example.com/health
curl -X GET https://app.example.com
```

### 8.2 Feature Flags
```typescript
// Feature flag configuration
const featureFlags = {
  'resource-module': {
    enabled: true,
    rollout: 100, // percentage
    environments: ['production', 'staging']
  }
};
```

### 8.3 Rollback Plan
- **Rollback Triggers:**
  - Critical bug affecting > 50% users
  - Data corruption detected
  - Performance degradation > 50%
  - Security vulnerability discovered
- **Rollback Steps:**
```bash
# 1. Disable feature flag
UPDATE feature_flags SET enabled = false WHERE name = 'resource-module';

# 2. Rollback database (if schema changed)
cd backend && npm run db:migrate down --to 0

# 3. Restore previous build
cd frontend && git checkout HEAD~1 && npm run build && rsync ...

# 4. Restart services
pm2 restart api
```
- **Data Recovery:**
  - Database backup location: `[backup path]`
  - Backup frequency: Daily at 02:00 UTC
  - Recovery time objective: < 1 hour

## 9. Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `src/api/resource.ts` | CREATE | Resource API endpoints | ~150 |
| `src/components/resource/ResourceForm.tsx` | CREATE | Resource creation form | ~200 |
| `src/store/resourceSlice.ts` | CREATE | Redux state management | ~100 |
| `src/routes/resourceRoutes.tsx` | CREATE | Resource page routes | ~50 |
| `tests/resource.spec.ts` | CREATE | Unit tests | ~150 |

### Implementation Notes
[Any deviations from plan, technical decisions made, trade-offs considered]

### Code Review Checklist
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests added
- [ ] API documentation updated (Swagger/OpenAPI)
- [ ] Security review completed (OWASP checklist)
- [ ] Performance benchmarks met (load test results)
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Cross-browser testing completed
- [ ] Mobile responsive verified

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#api-patterns)
- [UX Design](_bmad-output/planning-artifacts/ux-design.md#resource-pages)
- [API Documentation](docs/api.md)
- [Related Stories](./epic-1-story-1.md)
- [Figma Designs](https://figma.com/file/...)
- [Jira Ticket](https://jira.example.com/browse/PROJ-123)
