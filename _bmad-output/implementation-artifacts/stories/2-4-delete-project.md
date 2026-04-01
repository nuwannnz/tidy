---
story_number: "2.4"
story_key: "2-4-delete-project"
story_name: "Delete Project"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 2.4: Delete Project

> **QA Note:** This story enables parallel test case development.

## 1. Description

### 1.1 User Story Statement
As a user,
I want to delete a project,
so that I can remove completed or unwanted work.

### 1.2 Business Context
Users need to cleanly remove projects they no longer need. Clear confirmation prevents accidental data loss.

### 1.3 Technical Overview
- **Frontend:** Confirmation modal with warning
- **Backend:** DELETE endpoint with cascade deletion of all items
- **Security:** Ownership verification before deletion

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am viewing a project, when I click "Delete", then confirmation modal appears with warning | Must Have | Yes |
| AC-2 | Given I confirm deletion, when I click "Confirm", then project and all items are deleted | Must Have | Yes |
| AC-3 | Given I cancel deletion, when I click "Cancel", then modal closes and no deletion occurs | Must Have | Yes |
| AC-4 | Given project is deleted, when I am redirected, then I see dashboard with success message | Must Have | Yes |

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/v1/projects/:id` | DELETE | Delete project and all items | Bearer Token |

### 3.2 Database Delete Pattern
```typescript
// Delete project and all items from tidy-{env} table (batch operation)
// First, find all items belonging to this project
const itemsToDelete = await db.query({
  IndexName: 'GSI1',
  KeyConditionExpression: 'GSI1PK = :pk',
  ExpressionAttributeValues: {
    ':pk': `PROJECT#${projectId}`
  }
});

// Batch delete project and all child items
await db.batchDelete(itemsToDelete.Items.map(item => ({
  PK: item.PK,
  SK: item.SK
})));
```

### 3.3 API Test Considerations for QA
QA team will create API tests based on the endpoint specifications above. Key test areas:
- Successful project deletion (204 No Content)
- Cascade deletion of all items
- Authentication and ownership verification
- Non-existent project returns 404

## 4. Frontend Changes

### 4.1 New Components
| Component | Path | Purpose |
|-----------|------|---------|
| DeleteProjectModal.tsx | `apps/web/src/features/projects/DeleteProjectModal.tsx` | Confirmation modal |

### 4.2 Test Hooks for QA
```typescript
<div data-testid="delete-project-modal">
  <p data-testid="delete-project-warning">This will delete all items...</p>
  <button data-testid="delete-project-confirm" />
  <button data-testid="delete-project-cancel" />
</div>
```

## 5. Edge Scenarios & Test Cases

### 5.1 Manual Test Cases

**TC-01: Delete Project - Happy Path**
- **Steps:** Open project → Click "Delete" → Confirm → Verify redirect to dashboard, success message
- **Expected:** Project deleted, sidebar updated

**TC-02: Delete Project - Cancel**
- **Steps:** Click "Delete" → Click "Cancel" → Verify modal closes, project remains
- **Expected:** No deletion

**TC-03: Delete Project - Cascade Delete**
- **Steps:** Delete project with items → Verify items also deleted from dashboard
- **Expected:** All items removed from database

### 5.2 Automation Test Notes for QA
QA team will create automation scripts using the test IDs from section 4.2. Key scenarios to cover:
- Delete confirmation modal display
- Confirm delete and redirect
- Cancel delete behavior

## 6. Dependencies
- Story 2.1: Create Project
- Epic 3: Items (cascade deletion)

## 7. Security Considerations
- User can only delete their own projects
- Cascade deletion must be atomic

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/routes/projects.ts` | MODIFY | Add DELETE endpoint |
| `apps/web/src/features/projects/DeleteProjectModal.tsx` | CREATE | Confirmation modal |
| `tests/e2e/project-delete.spec.ts` | CREATE | E2E tests |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
