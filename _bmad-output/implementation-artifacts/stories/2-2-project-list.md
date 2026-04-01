---
story_number: "2.2"
story_key: "2-2-project-list"
story_name: "View Project List (Left Sidebar)"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 2.2: View Project List (Left Sidebar)

> **QA Note:** This story enables parallel test case development.

## 1. Description

### 1.1 User Story Statement
As a logged-in user,
I want to see all my projects in the left sidebar,
so that I can quickly navigate between projects.

### 1.2 Business Context
The project list is the primary navigation mechanism. Fast, clear project listing is essential for usability.

### 1.3 Technical Overview
- **Frontend:** Sidebar component with project list, using ListItem components
- **Backend:** GET endpoint to fetch all user projects
- **State:** Redux slice for project list state

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am logged in, when app loads, then left sidebar shows all my projects | Must Have | Yes |
| AC-2 | Given I have projects, when list renders, then each project shows name and color indicator | Must Have | Yes |
| AC-3 | Given I click a project, when it becomes selected, then right pane shows project details | Must Have | Yes |
| AC-4 | Given I have no projects, when list renders, then empty state with "Create first project" shown | Must Have | Yes |

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/v1/projects` | GET | Get all user projects | Bearer Token |

### 3.2 Response Details
**Success (200 OK):**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project A",
      "description": "Description",
      "color": "#FF5733",
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ]
}
```

### 3.3 Database Query Pattern
```typescript
// List projects by user (GSI1) - queries tidy-{env} table
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
- List projects returns user's projects only
- Empty list for new users
- Authentication required

## 4. Frontend Changes

### 4.1 New Components
| Component | Path | Purpose |
|-----------|------|---------|
| ProjectList.tsx | `apps/web/src/features/projects/ProjectList.tsx` | Sidebar project list |
| ProjectListItem.tsx | `apps/web/src/features/projects/ProjectListItem.tsx` | Individual project item |

### 4.2 Test Hooks for QA
```typescript
<aside data-testid="project-list-sidebar">
  <div data-testid="project-list-item-{projectId}" />
  <div data-testid="project-list-empty-state" />
</aside>
```

## 5. Edge Scenarios & Test Cases

### 5.1 Manual Test Cases

**TC-01: Project List - With Projects**
- **Steps:** Login → Verify sidebar shows all projects with colors
- **Expected:** Projects listed alphabetically

**TC-02: Project List - Empty State**
- **Steps:** Login with no projects → Verify empty state message
- **Expected:** "No projects yet" with create button

**TC-03: Project Selection**
- **Steps:** Click project → Verify highlighted, details shown in right pane
- **Expected:** Selected state, URL updates

### 5.2 Automation Test Notes for QA
QA team will create automation scripts using the test IDs from section 4.2. Key scenarios to cover:
- Project list displays with projects
- Empty state when no projects
- Project selection and URL update

## 6. Dependencies
- Story 2.1: Create Project (projects exist)
- Story 5a.3: ListItem Component

## 7. Security Considerations
- User can only see their own projects
- Authentication required

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/routes/projects.ts` | MODIFY | Add GET endpoint |
| `apps/web/src/features/projects/ProjectList.tsx` | CREATE | Project list |
| `apps/web/src/store/projectSlice.ts` | CREATE | Project state |
| `tests/e2e/project-list.spec.ts` | CREATE | E2E tests |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
