---
story_number: "2.3"
story_key: "2-3-edit-project"
story_name: "Edit Project Details"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 2.3: Edit Project Details

> **QA Note:** This story enables parallel test case development.

## 1. Description

### 1.1 User Story Statement
As a project owner,
I want to edit my project's name, description, and color,
so that I can keep my project information current and accurate.

### 1.2 Business Context
Projects evolve over time. Easy editing ensures users can keep their organization accurate and meaningful.

### 1.3 Technical Overview
- **Frontend:** Edit modal with pre-filled form
- **Backend:** PUT endpoint for project updates
- **State:** Update project in Redux store after edit

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am viewing a project, when I click "Edit", then form opens with pre-filled values | Must Have | Yes |
| AC-2 | Given I change fields and click "Save", then changes are saved and sidebar updates | Must Have | Yes |
| AC-3 | Given I enter existing project name, when I save, then error appears | Must Have | Yes |
| AC-4 | Given I clear name field, when I try to save, then validation error appears | Must Have | Yes |

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/v1/projects/:id` | PUT | Update project | Bearer Token |

### 3.2 Request Details
**PUT `/api/v1/projects/:id`:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "color": "string (required)"
}
```

### 3.3 Database Update Pattern
```typescript
// Update project in tidy-{env} table
await db.update({
  TableName: `tidy-${environment}`,
  Key: { PK: `PROJECT#${id}`, SK: 'PROFILE' },
  UpdateExpression: 'SET #name = :name, #description = :description, #color = :color, #updatedAt = :updatedAt',
  ExpressionAttributeNames: {
    '#name': 'name',
    '#description': 'description',
    '#color': 'color',
    '#updatedAt': 'updatedAt'
  },
  ExpressionAttributeValues: {
    ':name': name,
    ':description': description,
    ':color': color,
    ':updatedAt': new Date().toISOString()
  },
  ReturnValues: 'ALL_NEW'
});
```

### 3.4 API Test Considerations for QA
QA team will create API tests based on the endpoint specifications above. Key test areas:
- Successful project update
- Duplicate name detection
- Validation errors
- Authentication and ownership verification

### 4.1 New Components
| Component | Path | Purpose |
|-----------|------|---------|
| EditProjectModal.tsx | `apps/web/src/features/projects/EditProjectModal.tsx` | Edit form modal |

### 4.2 Test Hooks for QA
```typescript
<form data-testid="edit-project-form">
  <input data-testid="edit-project-name-input" />
  <textarea data-testid="edit-project-description-input" />
  <button data-testid="edit-project-submit" />
  <button data-testid="edit-project-cancel" />
</form>
```

## 5. Edge Scenarios & Test Cases

### 5.1 Manual Test Cases

**TC-01: Edit Project - Happy Path**
- **Steps:** Open project → Click "Edit" → Change name/color → Save → Verify updates in sidebar
- **Expected:** Changes saved, sidebar reflects updates

**TC-02: Edit Project - Duplicate Name**
- **Steps:** Change name to existing project name → Save → Verify error
- **Expected:** Error "Project with this name already exists"

**TC-03: Edit Project - Empty Name**
- **Steps:** Clear name field → Save → Verify validation error
- **Expected:** Error "Project name is required"

### 5.2 Automation Test Notes for QA
QA team will create automation scripts using the test IDs from section 4.2. Key scenarios to cover:
- Edit modal opens with pre-filled values
- Form submission and validation
- Sidebar update after save

## 6. Dependencies
- Story 2.1: Create Project
- Story 5a.4: Color Picker

## 7. Security Considerations
- User can only edit their own projects
- Name uniqueness per user

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/routes/projects.ts` | MODIFY | Add PUT endpoint |
| `apps/web/src/features/projects/EditProjectModal.tsx` | CREATE | Edit form |
| `tests/e2e/project-edit.spec.ts` | CREATE | E2E tests |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
