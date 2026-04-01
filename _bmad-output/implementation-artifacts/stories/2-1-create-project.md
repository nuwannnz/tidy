---
story_number: "2.1"
story_key: "2-1-create-project"
story_name: "Create New Project"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 2.1: Create New Project

> **QA Note:** This story enables parallel test case development.

## 1. Description

### 1.1 User Story Statement
As a logged-in user,
I want to create a new project with a name, description, and color,
so that I can organize my work into meaningful containers.

### 1.2 Business Context
Projects are the core organizational unit in tidy. Easy project creation is essential for user onboarding and engagement.

### 1.3 Technical Overview
- **Frontend:** Modal form with name, description, color picker
- **Backend:** Express API endpoint for project creation
- **Database:** DynamoDB projects table with user GSI

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am on dashboard, when I click "Create Project", then form modal opens | Must Have | Yes |
| AC-2 | Given I enter valid name and color, when I click "Create", then project is saved and appears in sidebar | Must Have | Yes |
| AC-3 | Given I submit without name, when I click "Create", then validation error appears | Must Have | Yes |
| AC-4 | Given I enter existing project name, when I click "Create", then error "name already exists" appears | Must Have | Yes |

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/v1/projects` | POST | Create new project | Bearer Token |

### 3.2 Request Details
**POST `/api/v1/projects`:**
```json
{
  "name": "string (required) - 1-100 chars",
  "description": "string (optional) - 0-500 chars",
  "color": "string (required) - hex color code"
}
```

### 3.3 Database Changes
- **Tables Affected:** `tidy-{env}` (single-table for entire application)
- **Table Structure:** See Story 1.1 for full table definition
- **Item Structure (Project):**
```typescript
{
  PK: "PROJECT#project-uuid",
  SK: "PROFILE",
  GSI1PK: "USER#user-uuid",
  GSI1SK: "PROJECT#project-name",
  GSI2PK: "USER#user-uuid",
  GSI2SK: "PROJECT#project-uuid",
  entityType: "PROJECT",
  name: "string",
  description: "string",
  color: "#FF5733",
  userId: "user-uuid",
  createdAt: "ISO8601",
  updatedAt: "ISO8601"
}
```
- **Query Patterns:**
```typescript
// List projects by user (GSI1)
const projects = await db.query({
  IndexName: 'GSI1',
  KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
  ExpressionAttributeValues: {
    ':pk': `USER#${userId}`,
    ':sk': 'PROJECT#'
  }
});
```

### 3.4 API Test Considerations for QA
QA team will create API tests based on the endpoint specifications above. Key test areas:
- Successful project creation
- Duplicate name detection
- Validation errors
- Authentication required

### 4.1 New Components
| Component | Path | Purpose |
|-----------|------|---------|
| CreateProjectModal.tsx | `apps/web/src/features/projects/CreateProjectModal.tsx` | Project creation form |
| ColorPicker.tsx | `apps/web/src/components/ColorPicker.tsx` | Color selection (from 5a.4) |

### 4.2 Test Hooks for QA
```typescript
<form data-testid="create-project-form">
  <input data-testid="project-name-input" />
  <textarea data-testid="project-description-input" />
  <div data-testid="color-picker" />
  <button data-testid="color-option-{color}" />
  <button data-testid="project-create-submit" />
  <button data-testid="project-create-cancel" />
</form>
```

## 5. Edge Scenarios & Test Cases

### 5.1 Manual Test Cases

**TC-01: Create Project - Happy Path**
- **Steps:** Click "Create Project" → Enter name, description, color → Submit → Verify appears in sidebar
- **Expected:** Project created, sidebar updated

**TC-02: Create Project - Name Required**
- **Steps:** Leave name empty → Submit → Verify error
- **Expected:** Error "Project name is required"

**TC-03: Create Project - Duplicate Name**
- **Steps:** Enter existing project name → Submit → Verify error
- **Expected:** Error "Project with this name already exists"

### 5.2 Automation Test Notes for QA
QA team will create automation scripts using the test IDs from section 4.2. Key scenarios to cover:
- Create project modal open/close
- Form submission and validation
- Success redirect and sidebar update

## 6. Dependencies
- Story 5a.4: Color Picker Component
- Story 1.x: Authentication (protected route)

## 7. Security Considerations
- User must be authenticated
- Project name uniqueness per user
- Input sanitization

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/routes/projects.ts` | CREATE | Project API endpoints |
| `apps/web/src/features/projects/CreateProjectModal.tsx` | CREATE | Create form |
| `tests/e2e/project-create.spec.ts` | CREATE | E2E tests |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
