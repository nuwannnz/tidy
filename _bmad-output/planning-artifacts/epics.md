---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics-list
  - step-03-create-stories
inputDocuments:
  - /Users/nuwankarunarathna/projects/personal/tidy/_bmad-output/planning-artifacts/prd.md
  - /Users/nuwankarunarathna/projects/personal/tidy/_bmad-output/planning-artifacts/architecture.md
workflowType: 'epics-and-stories'
project_name: tidy
user_name: nuwannnz
date: '2026-04-01'
---

# tidy - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for tidy, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Authentication System:**
FR1: Users shall be able to register with email and password (AUTH-01)
FR2: Users shall be able to login with email and password (AUTH-02)
FR3: Passwords shall be securely hashed and stored (AUTH-03)
FR4: Session management with secure token handling (AUTH-04)
FR5: Password reset functionality via email (AUTH-05)

**Project Management:**
FR6: Users shall be able to create projects with name, description, and color (PROJ-01)
FR7: Users shall be able to edit project details (PROJ-02)
FR8: Users shall be able to delete projects (PROJ-03)
FR9: Projects shall be displayed in a left-side pane (master list) (PROJ-04)
FR10: Project color shall be used for visual identification (PROJ-05)

**Project Items (Ideas, Tasks, Notes):**
FR11: Users shall be able to create ideas within a project (ITEM-01)
FR12: Users shall be able to create tasks within a project (ITEM-02)
FR13: Users shall be able to create notes within a project (ITEM-03)
FR14: Each item type shall have appropriate metadata (e.g., task status, idea tags) (ITEM-04)
FR15: Users shall be able to edit and delete items (ITEM-05)
FR16: Items shall be displayed in the project details pane (ITEM-06)

**Dashboard (Canvas View):**
FR17: Users shall be able to view a dashboard aggregating items from all projects (DASH-01)
FR18: Dashboard shall filter by item type (ideas, tasks, notes) (DASH-02)
FR19: Users shall be able to drag and rearrange projects on the dashboard (DASH-03)
FR20: Dashboard shall use an auto-arrangeable canvas layout (not rigid grid) (DASH-04)
FR21: Dashboard shall provide a snapshot view of all ongoing projects (DASH-05)

**User Interface & Layout:**
FR22: Application shall use a master-slave layout (UI-01)
FR23: Left pane shall display project list (UI-02)
FR24: Right pane shall display selected project details or dashboard (UI-03)
FR25: UI shall follow Material Design principles (UI-04)
FR26: Interface shall be minimal and modern (UI-05)
FR27: Application shall be PWA-capable (installable, offline support) (UI-06)

### Non-Functional Requirements

**Code Quality:**
NFR-Q-01: All code must be written in TypeScript with strict mode enabled
NFR-Q-02: ESLint and Prettier must be configured with strict rules
NFR-Q-03: Unit test coverage must be ≥80% for all business logic
NFR-Q-04: All components must have Storybook stories
NFR-Q-05: CI pipeline must run linting, type checking, and tests on every commit
NFR-Q-06: Code reviews required for all pull requests

**Performance:**
NFR-P-01: Initial page load must be <3 seconds on 4G connection
NFR-P-02: Dashboard must render within 500ms for up to 100 items
NFR-P-03: Drag-and-drop operations must maintain 60fps
NFR-P-04: API responses must be <200ms (p95)

**Security:**
NFR-S-01: All passwords must be hashed using bcrypt or equivalent
NFR-S-02: All API endpoints must require authentication
NFR-S-03: JWT tokens must be securely stored (httpOnly cookies or secure storage)
NFR-S-04: All data in transit must use HTTPS/TLS
NFR-S-05: Input validation and sanitization on all user inputs

**Usability:**
NFR-U-01: Application must be intuitive for new users within 5 minutes
NFR-U-02: All interactive elements must meet WCAG 2.1 AA accessibility standards
NFR-U-03: PWA must support offline viewing of previously loaded data
NFR-U-04: Application must be responsive (desktop, tablet, mobile)

**Reliability:**
NFR-R-01: Backend must achieve 99.9% uptime
NFR-R-02: All data mutations must be atomic and consistent
NFR-R-03: Automatic backup of all user data

### Additional Requirements

**Architecture-Mandated Technical Requirements:**
- Nx monorepo workspace with apps/web, apps/api, libs/shared-types structure
- AWS SAM for infrastructure as code with dev/prod environment support
- Single Lambda function with Express + API Gateway proxy pattern
- DynamoDB single-table design with GSI1 (by project) and GSI2 (dashboard view)
- Custom JWT authentication with httpOnly cookies (15min access + 7-day refresh)
- Redux Toolkit for state management with feature-sliced architecture
- dnd-kit for canvas-style drag-and-drop dashboard
- Material UI v5 with Emotion for styling
- Docker Compose for local development (DynamoDB Local + API emulator)
- Playwright for E2E tests with separate UI and API test suites
- GitHub Actions CI pipeline with lint, type check, test, and E2E execution
- PWA with service worker (NetworkFirst for API, CacheFirst for assets)
- OpenAPI 3.0 documentation for all endpoints
- Centralized error handling middleware with standard response format
- Environment-specific deployments (dev.tidy-app.com, tidy-app.com)

### UX Design Requirements

*No UX Design document found. UX-related requirements are extracted from PRD and Architecture:*
- Master-slave layout with left project pane and right details/dashboard pane
- Material Design principles throughout
- Canvas-style auto-arrangeable dashboard (not rigid grid)
- Drag-and-drop project rearrangement on dashboard
- Color-coded projects for visual identification
- Minimal and modern interface design
- Responsive design (desktop, tablet, mobile)
- WCAG 2.1 AA accessibility compliance

### FR Coverage Map

| FR ID | Epic | Description |
|-------|------|-------------|
| FR1 | Epic 1 | Users shall be able to register with email and password |
| FR2 | Epic 1 | Users shall be able to login with email and password |
| FR3 | Epic 1 | Passwords shall be securely hashed and stored |
| FR4 | Epic 1 | Session management with secure token handling |
| FR5 | Epic 1 | Password reset functionality via email |
| FR6 | Epic 2 | Users shall be able to create projects with name, description, and color |
| FR7 | Epic 2 | Users shall be able to edit project details |
| FR8 | Epic 2 | Users shall be able to delete projects |
| FR9 | Epic 2 | Projects shall be displayed in a left-side pane (master list) |
| FR10 | Epic 2 | Project color shall be used for visual identification |
| FR11 | Epic 3 | Users shall be able to create ideas within a project |
| FR12 | Epic 3 | Users shall be able to create tasks within a project |
| FR13 | Epic 3 | Users shall be able to create notes within a project |
| FR14 | Epic 3 | Each item type shall have appropriate metadata |
| FR15 | Epic 3 | Users shall be able to edit and delete items |
| FR16 | Epic 3 | Items shall be displayed in the project details pane |
| FR17 | Epic 4 | Users shall be able to view a dashboard aggregating items from all projects |
| FR18 | Epic 4 | Dashboard shall filter by item type (ideas, tasks, notes) |
| FR19 | Epic 4 | Users shall be able to drag and rearrange projects on the dashboard |
| FR20 | Epic 4 | Dashboard shall use an auto-arrangeable canvas layout |
| FR21 | Epic 4 | Dashboard shall provide a snapshot view of all ongoing projects |
| FR22 | Epic 5a | Application shall use a master-slave layout |
| FR23 | Epic 5a | Left pane shall display project list |
| FR24 | Epic 5a | Right pane shall display selected project details or dashboard |
| FR25 | Epic 5a | UI shall follow Material Design principles |
| FR26 | Epic 5a | Interface shall be minimal and modern |
| FR27 | Epic 5b | Application shall be PWA-capable (installable, offline support) |

## Epic List

### Epic 6 Phase 1: Development Foundation
**Sprint 0 (Part 1)** — Foundation for all development
**User Outcome:** Development team has fast local development workflow and code quality standards from day one
**FRs covered:** None (infrastructure/NFRs only)
**NFRs covered:** NFR-Q-01, NFR-Q-02, NFR-Q-03, NFR-Q-05 (core subset)
**Key Deliverables:**
- Nx monorepo workspace (apps/web, apps/api, libs/shared-types)
- Docker Compose for local dev (DynamoDB Local + API emulator)
- TypeScript strict mode, ESLint, Prettier configuration
- Jest + React Testing Library setup
- Basic CI pipeline structure
- Local database seeding scripts

### Epic 5a: Design Foundation
**Sprint 0 (Part 2)** — Design system before feature development
**User Outcome:** Consistent, accessible UI components and layout patterns for all features
**FRs covered:** FR22, FR23, FR24, FR25, FR26
**NFRs covered:** NFR-U-01, NFR-U-02 (accessibility foundation)
**Key Deliverables:**
- Material UI theme with design tokens (colors, typography, spacing)
- Master-slave layout shell (left pane + right pane)
- Core components: Button, Input, List, ListItem, Modal, Spinner
- Color picker component for projects
- Basic responsive structure
- Keyboard navigation foundation

### Epic 1: User Authentication & Account Management
**Sprint 0 (Part 3)** — First user-facing value
**User Outcome:** Users can register, login, logout, and manage their session securely
**FRs covered:** FR1, FR2, FR3, FR4, FR5
**NFRs covered:** NFR-S-01, NFR-S-02, NFR-S-03, NFR-S-04, NFR-S-05
**Key Deliverables:**
- Registration form with email/password
- Login form with credential validation
- JWT token management (access + refresh)
- Protected routes and API middleware
- Logout functionality
- Password reset flow (email-based)

### Epic 2: Project Creation & Management
**Sprint 1** — Core container for all work
**User Outcome:** Users can create, edit, delete, and organize projects with color-coded visual identification
**FRs covered:** FR6, FR7, FR8, FR9, FR10
**NFRs covered:** NFR-P-02 (project list performance), NFR-U-04 (responsive)
**Key Deliverables:**
- Project creation form (name, description, color)
- Project list pane (left sidebar)
- Project edit/delete functionality
- Project detail view (right pane)
- Color picker for visual identification
- Project API endpoints (CRUD)

### Epic 3: Project Items Management (Ideas, Tasks, Notes)
**Sprint 2** — Capture and organize work
**User Outcome:** Users can capture and organize ideas, tasks, and notes within their projects
**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16
**NFRs covered:** NFR-P-02 (item list performance), NFR-R-02 (atomic mutations)
**Key Deliverables:**
- Create idea/task/note forms
- Item type-specific metadata (status for tasks, tags for ideas, content for notes)
- Item list display within project
- Edit/delete item functionality
- Items API endpoints (CRUD)
- Redux slices for item state

### Epic 4: Dashboard & Cross-Project View
**Sprint 3** — The signature tidy experience
**User Outcome:** Users can see all their project items in one canvas view, filter by type, and rearrange projects visually
**FRs covered:** FR17, FR18, FR19, FR20, FR21
**NFRs covered:** NFR-P-02 (500ms render), NFR-P-03 (60fps drag-and-drop)
**Key Deliverables:**
- Dashboard canvas with auto-arrangeable layout
- Cross-project item aggregation
- Filter by item type (ideas, tasks, notes)
- dnd-kit drag-and-drop for project rearrangement
- Dashboard API endpoint (aggregated query)
- Collision detection and positioning logic

### Epic 5b: PWA + Accessibility Polish
**Sprint 4** — Enhanced user experience (optional/parallel)
**User Outcome:** Users have offline support and fully accessible interface
**FRs covered:** FR27
**NFRs covered:** NFR-U-03 (offline), NFR-U-02 (WCAG 2.1 AA complete), NFR-P-01 (load time)
**Key Deliverables:**
- Service worker with caching strategy
- Offline viewing of previously loaded data
- PWA manifest (installable app)
- WCAG 2.1 AA audit and fixes
- Advanced keyboard navigation
- Screen reader optimization
- Performance optimization (code splitting, lazy loading)

### Epic 6 Phase 2: AWS SAM + Deployment
**Sprint 5** — Production deployment (optional)
**User Outcome:** Application deployed to production with multi-environment support
**NFRs covered:** NFR-R-01 (99.9% uptime), NFR-R-03 (automatic backups)
**Key Deliverables:**
- AWS SAM template (Lambda, API Gateway, DynamoDB)
- Multi-environment deployment (dev/prod)
- GitHub Actions CI/CD pipeline
- CloudWatch logging and monitoring
- Automated backups
- Production security hardening

---

## Epic 6 Phase 1: Development Foundation

### Story 6.1.1: Initialize Nx Monorepo Workspace

As a developer,
I want a properly configured Nx monorepo workspace,
So that I can manage frontend, backend, and shared code in a structured, scalable architecture.

**Acceptance Criteria:**

**Given** I have a new project directory
**When** I run the Nx workspace initialization command
**Then** the workspace is created with apps/web, apps/api, and libs/shared-types projects
**And** TypeScript strict mode is enabled across all projects

**Given** the workspace is initialized
**When** I check the project structure
**Then** apps/web contains React + TypeScript configuration
**And** apps/api contains Node.js + TypeScript configuration
**And** libs/shared-types contains TypeScript type definitions
**And** nx.json is configured with proper project boundaries

---

### Story 6.1.2: Docker Local Development Stack

As a developer,
I want a Docker Compose stack for local development,
So that I can run the full application stack (API + DynamoDB) locally without AWS deployment.

**Acceptance Criteria:**

**Given** I have Docker installed
**When** I run `npm run dev:local`
**Then** DynamoDB Local starts on port 8000
**And** the API container starts on port 3001
**And** both containers are connected via Docker network

**Given** the stack is running
**When** I access http://localhost:3001/api/v1/health
**Then** I receive a healthy response
**And** the API can communicate with DynamoDB Local

**Given** I want to seed test data
**When** I run `npm run dev:local:seed`
**Then** a test user is created in DynamoDB Local
**And** the seed script completes without errors

---

### Story 6.1.3: Code Quality Tooling Setup

As a developer,
I want ESLint, Prettier, and Jest configured with strict rules,
So that code quality standards are enforced automatically.

**Acceptance Criteria:**

**Given** the workspace is initialized
**When** I run `npm run lint`
**Then** ESLint runs with strict TypeScript rules
**And** errors are reported for unused variables, missing return types, etc.

**Given** I have TypeScript files
**When** I run `npm run format`
**Then** Prettier formats all files with: semi=true, singleQuote=true, printWidth=100
**And** formatting is applied consistently across apps/web and apps/api

**Given** I have test files
**When** I run `npm run test`
**Then** Jest executes all tests with coverage reporting
**And** coverage threshold is set to 80%
**And** React Testing Library is configured for frontend tests

---

### Story 6.1.4: Basic CI Pipeline Structure

As a developer,
I want a GitHub Actions CI pipeline,
So that linting, type checking, and tests run automatically on every commit.

**Acceptance Criteria:**

**Given** I have a GitHub repository
**When** I push to a branch
**Then** GitHub Actions CI workflow triggers
**And** runs lint, type check, and test jobs

**Given** the CI pipeline runs
**When** any job fails (lint/type/test)
**Then** the pipeline fails with clear error messages
**And** the commit is blocked from merging

**Given** all checks pass
**When** the pipeline completes
**Then** a success status is shown on the commit
**And** coverage report is generated

---

## Epic 5a: Design Foundation

### Story 5a.1: Material UI Theme & Design Tokens

As a UI developer,
I want a Material UI theme with design tokens,
So that all components have consistent colors, typography, and spacing.

**Acceptance Criteria:**

**Given** the app/web project is set up
**When** I create the theme configuration
**Then** a color palette is defined with primary, secondary, error, warning, success colors
**And** typography scale includes h1-h6, body1-2, caption, button styles
**And** spacing scale uses 4px base unit (4, 8, 12, 16, 24, 32, 48)

**Given** the theme is configured
**When** I import the theme in a component
**Then** I can access colors via `theme.palette.primary.main`
**And** typography via `theme.typography.h4`
**And** spacing via `theme.spacing(3)`

**Given** the theme is applied
**When** I render a component
**Then** Material UI components use the custom theme by default

---

### Story 5a.2: Master-Slave Layout Shell

As a user,
I want a master-slave layout with left project pane and right content pane,
So that I can navigate projects and view details in a structured interface.

**Acceptance Criteria:**

**Given** I am logged in
**When** the app loads
**Then** the layout displays a left sidebar (250-300px width) for project list
**And** a right main content area for project details or dashboard
**And** the layout is responsive (sidebar collapses on mobile)

**Given** I am viewing the layout
**When** I resize the browser window
**Then** the layout adapts to available space
**And** on mobile (<768px), the sidebar becomes a drawer

**Given** the layout is rendered
**When** I inspect the component structure
**Then** it uses Material UI Drawer for sidebar
**And** Material UI AppBar for top navigation
**And** Material UI Box/Main for content area

---

### Story 5a.3: Core UI Components (Button, Input, List)

As a UI developer,
I want reusable Button, Input, and List components,
So that forms and lists are consistent across the application.

**Acceptance Criteria:**

**Given** the theme is configured
**When** I create a Button component
**Then** it supports variants: contained, outlined, text
**And** it supports sizes: small, medium, large
**And** it has disabled and loading states
**And** it meets WCAG 2.1 AA contrast requirements

**Given** the theme is configured
**When** I create an Input component
**Then** it supports text, email, password types
**And** it has error state with helper text
**And** it has proper label and placeholder support
**And** keyboard focus is clearly visible

**Given** the theme is configured
**When** I create List and ListItem components
**Then** ListItem supports primary text, secondary text, and avatar/color indicator
**And** ListItem has hover and selected states
**And** List supports dense and default spacing

---

### Story 5a.4: Color Picker Component

As a user,
I want a color picker for selecting project colors,
So that I can visually identify my projects.

**Acceptance Criteria:**

**Given** I am creating or editing a project
**When** I click the color picker
**Then** a palette of 8-12 predefined colors is displayed
**And** I can select one color
**And** the selected color is visually indicated

**Given** I have selected a color
**When** I confirm the selection
**Then** the color value is saved to the form state
**And** the color preview is updated

**Given** I am using the color picker
**When** I navigate with keyboard
**Then** I can arrow between colors
**And** press Enter to select
**And** the component meets WCAG 2.1 AA accessibility standards

---

### Story 5a.5: Keyboard Navigation Foundation

As a keyboard user,
I want basic keyboard navigation throughout the UI,
So that I can use the application without a mouse.

**Acceptance Criteria:**

**Given** I am using the application
**When** I press Tab
**Then** focus moves to the next interactive element
**And** focus is clearly visible with a focus ring

**Given** I am in the project list
**When** I press Arrow Up/Down
**Then** focus moves between project items
**And** pressing Enter selects the project

**Given** a modal is open
**When** I press Escape
**Then** the modal closes
**And** focus returns to the trigger element

**Given** I am navigating the app
**When** I inspect any interactive element
**Then** it has proper tabIndex and role attributes
**And** screen readers can announce the element purpose

---

## Epic 1: User Authentication & Account Management

### Story 1.1: User Registration with Email/Password

As a new user,
I want to register with my email and password,
So that I can create an account and access my projects.

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I enter a valid email and password (min 8 characters)
**And** I click "Register"
**Then** my password is hashed with bcrypt
**And** a user record is created in DynamoDB
**And** I am automatically logged in
**And** I am redirected to the dashboard

**Given** I am registering
**When** I enter an email that already exists
**Then** I see an error message "This email is already registered"
**And** the form is not submitted

**Given** I am registering
**When** I enter a password shorter than 8 characters
**Then** I see a validation error "Password must be at least 8 characters"
**And** the form cannot be submitted

**Given** I am registering
**When** I enter an invalid email format
**Then** I see a validation error "Please enter a valid email address"
**And** the form cannot be submitted

---

### Story 1.2: User Login with Credentials

As a registered user,
I want to login with my email and password,
So that I can access my existing projects and data.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I enter my registered email and correct password
**And** I click "Login"
**Then** my credentials are verified against the database
**And** a JWT access token (15min) and refresh token (7 days) are generated
**And** tokens are stored in httpOnly cookies
**And** I am redirected to the dashboard

**Given** I am logging in
**When** I enter an incorrect password
**Then** I see an error message "Invalid email or password"
**And** I am not logged in

**Given** I am logging in
**When** I enter an email that doesn't exist
**Then** I see the same generic error "Invalid email or password"
**And** user enumeration is prevented

**Given** I am on the login page
**When** I submit the form with empty fields
**Then** validation errors appear for each empty field
**And** the form is not submitted

---

### Story 1.3: User Logout

As a logged-in user,
I want to logout,
So that I can secure my account when I'm done using the application.

**Acceptance Criteria:**

**Given** I am logged in
**When** I click the "Logout" button in the navigation
**Then** my refresh token is invalidated
**And** httpOnly cookies are cleared
**And** I am redirected to the login page
**And** I cannot access protected routes without logging in again

**Given** I am logged out
**When** I try to access a protected route directly
**Then** I am redirected to the login page
**And** I see a message "Please login to continue"

---

### Story 1.4: Password Reset via Email

As a user who forgot my password,
I want to request a password reset email,
So that I can regain access to my account.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Forgot Password?"
**Then** I am taken to a password reset request page
**And** I can enter my email address

**Given** I am on the password reset page
**When** I enter my registered email
**And** I click "Send Reset Link"
**Then** a reset token is generated and stored (1-hour expiry)
**And** an email is sent with a reset link (simulated in dev, SES in prod)
**And** I see a confirmation message "If this email exists, you'll receive a reset link"

**Given** I received the reset email
**When** I click the reset link
**Then** I am taken to a password reset form
**And** the token is validated

**Given** I am on the password reset form
**When** I enter a new password (min 8 characters)
**And** I click "Reset Password"
**Then** my password is updated in the database
**And** the reset token is invalidated
**And** I am redirected to the login page with a success message

---

### Story 1.5: JWT Session Management

As a logged-in user,
I want my session to be securely managed with JWT tokens,
So that I can use the app without being logged out unexpectedly.

**Acceptance Criteria:**

**Given** I am logged in
**When** my access token expires (15 minutes)
**And** I make an API request
**Then** the refresh token is used to obtain a new access token
**And** the request completes successfully without requiring re-login

**Given** I am logged in
**When** my refresh token expires (7 days)
**And** I make an API request
**Then** I receive a 401 Unauthorized response
**And** I am redirected to the login page

**Given** I am logged in
**When** I inspect my browser cookies
**Then** access and refresh tokens are stored in httpOnly cookies
**And** tokens are not accessible via JavaScript (XSS protection)

**Given** I am making API requests
**When** any request is made
**Then** the JWT token is included in the Authorization header
**And** the backend validates the token signature
**And** unauthorized requests return 401

---

## Epic 2: Project Creation & Management

### Story 2.1: Create New Project

As a logged-in user,
I want to create a new project with a name, description, and color,
So that I can organize my work into meaningful containers.

**Acceptance Criteria:**

**Given** I am on the dashboard or project list
**When** I click "Create Project"
**Then** a form modal opens with fields for name, description, and color
**And** the name field is required
**And** the color picker component (from Story 5a.4) is displayed

**Given** I am creating a project
**When** I enter a valid name and select a color
**And** I click "Create"
**Then** a POST request is made to `/api/v1/projects`
**And** the project is saved to DynamoDB with my user ID
**And** the project appears in the left sidebar immediately
**And** the modal closes

**Given** I am creating a project
**When** I try to submit without a name
**Then** I see a validation error "Project name is required"
**And** the form is not submitted

**Given** I am creating a project
**When** I enter a name that already exists
**Then** I see an error "A project with this name already exists"
**And** the form is not submitted

---

### Story 2.2: View Project List (Left Sidebar)

As a logged-in user,
I want to see all my projects in the left sidebar,
So that I can quickly navigate between projects.

**Acceptance Criteria:**

**Given** I am logged in
**When** the app loads
**Then** the left sidebar displays all my projects as a list
**And** each project shows its name and color indicator
**And** projects are sorted alphabetically by default

**Given** I have multiple projects
**When** the project list renders
**Then** each project uses the ListItem component (from Story 5a.3)
**And** the project color is displayed as a left border or avatar background
**And** the list scrolls independently if it overflows

**Given** I am viewing the project list
**When** I click on a project
**Then** the project becomes selected (highlighted state)
**And** the right pane displays the project details
**And** the URL updates to `/projects/:projectId`

**Given** I have no projects
**When** the project list renders
**Then** an empty state is displayed with "No projects yet"
**And** a "Create your first project" button is shown

---

### Story 2.3: Edit Project Details

As a project owner,
I want to edit my project's name, description, and color,
So that I can keep my project information current and accurate.

**Acceptance Criteria:**

**Given** I am viewing a project
**When** I click "Edit Project"
**Then** a form modal opens with pre-filled values for name, description, and color
**And** all fields are editable

**Given** I am editing a project
**When** I change the name, description, or color
**And** I click "Save"
**Then** a PUT request is made to `/api/v1/projects/:id`
**And** the changes are saved to DynamoDB
**And** the project list updates immediately to reflect changes
**And** the modal closes

**Given** I am editing a project
**When** I change the name to an existing project name
**Then** I see an error "A project with this name already exists"
**And** the form is not submitted

**Given** I am editing a project
**When** I clear the name field
**Then** I see a validation error "Project name is required"
**And** the save button is disabled

---

### Story 2.4: Delete Project

As a user,
I want to delete a project,
So that I can remove completed or unwanted work.

**Acceptance Criteria:**

**Given** I am viewing a project
**When** I click "Delete Project"
**Then** a confirmation modal appears
**And** the modal warns "This will delete all items in this project. This action cannot be undone."

**Given** I am confirming deletion
**When** I click "Confirm Delete"
**Then** a DELETE request is made to `/api/v1/projects/:id`
**And** the project and all its items are deleted from DynamoDB
**And** the project is removed from the sidebar
**And** I am redirected to the dashboard
**And** a success message "Project deleted" is displayed

**Given** I am in the delete confirmation modal
**When** I click "Cancel"
**Then** the modal closes
**And** no deletion occurs

**Given** I am viewing a project with items
**When** I delete the project
**Then** all items (ideas, tasks, notes) in the project are also deleted
**And** the dashboard no longer shows items from this project

---

### Story 2.5: Project API Endpoints

As a frontend developer,
I want backend API endpoints for project CRUD operations,
So that the frontend can create, read, update, and delete projects.

**Acceptance Criteria:**

**Given** the API is running
**When** I make a GET request to `/api/v1/projects`
**Then** all projects for the authenticated user are returned
**And** each project includes: id, name, description, color, createdAt, updatedAt

**Given** I am authenticated
**When** I make a POST request to `/api/v1/projects` with name, description, and color
**Then** a new project is created in DynamoDB
**And** the created project is returned with a 201 status

**Given** I am authenticated
**When** I make a PUT request to `/api/v1/projects/:id` with updated fields
**Then** the project is updated in DynamoDB
**And** the updated project is returned

**Given** I am authenticated
**When** I make a DELETE request to `/api/v1/projects/:id`
**Then** the project and all its items are deleted from DynamoDB
**And** a 204 No Content response is returned

**Given** I am not authenticated
**When** I make any request to `/api/v1/projects`
**Then** I receive a 401 Unauthorized response

**Given** I make a request to a project that doesn't exist
**When** I call GET/PUT/DELETE on `/api/v1/projects/:id`
**Then** I receive a 404 Not Found response

---

## Epic 3: Project Items Management (Ideas, Tasks, Notes)

### Story 3.1: Create Idea

As a user,
I want to create ideas within a project,
So that I can capture inspiration and brainstorming thoughts.

**Acceptance Criteria:**

**Given** I am viewing a project
**When** I click "Add Idea"
**Then** a form modal opens with fields for title, content, and tags
**And** the title field is required

**Given** I am creating an idea
**When** I enter a valid title and optional content/tags
**And** I click "Create"
**Then** a POST request is made to `/api/v1/projects/:projectId/items` with type "IDEA"
**And** the idea is saved to DynamoDB with metadata: type, title, content, tags, createdAt
**And** the idea appears in the project's item list
**And** the modal closes

**Given** I am creating an idea
**When** I try to submit without a title
**Then** I see a validation error "Title is required"
**And** the form is not submitted

---

### Story 3.2: Create Task

As a user,
I want to create tasks within a project,
So that I can track actionable items.

**Acceptance Criteria:**

**Given** I am viewing a project
**When** I click "Add Task"
**Then** a form modal opens with fields for title, description, status, and due date (optional)
**And** the title field is required
**And** the status defaults to "TODO"

**Given** I am creating a task
**When** I enter a valid title and optional description/status/due date
**And** I click "Create"
**Then** a POST request is made to `/api/v1/projects/:projectId/items` with type "TASK"
**And** the task is saved to DynamoDB with metadata: type, title, description, status, dueDate, createdAt
**And** the task appears in the project's item list with a status indicator
**And** the modal closes

**Given** I am creating a task
**When** I try to submit without a title
**Then** I see a validation error "Title is required"
**And** the form is not submitted

---

### Story 3.3: Create Note

As a user,
I want to create notes within a project,
So that I can store reference information.

**Acceptance Criteria:**

**Given** I am viewing a project
**When** I click "Add Note"
**Then** a form modal opens with fields for title and content (markdown-supported)
**And** the title field is required
**And** the content field is a larger text area

**Given** I am creating a note
**When** I enter a valid title and content
**And** I click "Create"
**Then** a POST request is made to `/api/v1/projects/:projectId/items` with type "NOTE"
**And** the note is saved to DynamoDB with metadata: type, title, content, createdAt
**And** the note appears in the project's item list
**And** the modal closes

**Given** I am creating a note
**When** I try to submit without a title
**Then** I see a validation error "Title is required"
**And** the form is not submitted

---

### Story 3.4: View Item List in Project

As a user,
I want to see all items in a project,
So that I can view my ideas, tasks, and notes in one place.

**Acceptance Criteria:**

**Given** I am viewing a project
**When** the project details pane loads
**Then** items are displayed grouped by type (Ideas, Tasks, Notes)
**And** each item shows its title and relevant metadata (status for tasks, tags for ideas)

**Given** I have multiple items
**When** the item list renders
**Then** items are sorted by createdAt (newest first) within each type
**And** each item type section has a count badge (e.g., "Ideas (5)")

**Given** I am viewing the item list
**When** I click on an item
**Then** the item details are displayed in a view modal
**And** I can see the full content

**Given** a project has no items
**When** the item list renders
**Then** an empty state is displayed for each type
**And** a prompt to "Add your first idea/task/note" is shown

---

### Story 3.5: Edit Item (Idea/Task/Note)

As a user,
I want to edit my items,
So that I can update information as my work evolves.

**Acceptance Criteria:**

**Given** I am viewing an item
**When** I click "Edit"
**Then** a form modal opens with pre-filled values for all fields
**And** the form is appropriate for the item type (idea/task/note)

**Given** I am editing an idea
**When** I change the title, content, or tags
**And** I click "Save"
**Then** a PUT request is made to `/api/v1/projects/:projectId/items/:itemId`
**And** the changes are saved to DynamoDB
**And** the item list updates immediately

**Given** I am editing a task
**When** I change the title, description, status, or due date
**And** I click "Save"
**Then** the task is updated
**And** the status indicator reflects the new status

**Given** I am editing a note
**When** I change the title or content
**And** I click "Save"
**Then** the note is updated
**And** the markdown content is rendered correctly

---

### Story 3.6: Delete Item

As a user,
I want to delete items,
So that I can remove outdated or irrelevant information.

**Acceptance Criteria:**

**Given** I am viewing an item
**When** I click "Delete"
**Then** a confirmation modal appears
**And** the modal shows "Are you sure you want to delete this [idea/task/note]? This cannot be undone."

**Given** I am confirming deletion
**When** I click "Confirm Delete"
**Then** a DELETE request is made to `/api/v1/projects/:projectId/items/:itemId`
**And** the item is deleted from DynamoDB
**And** the item is removed from the list
**And** a success message is displayed

**Given** I am in the delete confirmation modal
**When** I click "Cancel"
**Then** the modal closes
**And** no deletion occurs

---

### Story 3.7: Items API Endpoints

As a frontend developer,
I want backend API endpoints for item CRUD operations,
So that the frontend can manage ideas, tasks, and notes.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I make a GET request to `/api/v1/projects/:projectId/items`
**Then** all items for the project are returned grouped by type
**And** each item includes: id, type, title, content/description, metadata, createdAt, updatedAt

**Given** I am authenticated
**When** I make a POST request to `/api/v1/projects/:projectId/items` with type, title, and appropriate fields
**Then** a new item is created in DynamoDB
**And** the created item is returned with a 201 status
**And** the item is associated with the correct project and user

**Given** I am authenticated
**When** I make a PUT request to `/api/v1/projects/:projectId/items/:itemId` with updated fields
**Then** the item is updated in DynamoDB
**And** the updated item is returned

**Given** I am authenticated
**When** I make a DELETE request to `/api/v1/projects/:projectId/items/:itemId`
**Then** the item is deleted from DynamoDB
**And** a 204 No Content response is returned

**Given** I make a request to an item that doesn't exist or isn't in my project
**When** I call GET/PUT/DELETE on `/api/v1/projects/:projectId/items/:itemId`
**Then** I receive a 404 Not Found response

---

## Epic 4: Dashboard & Cross-Project View

### Story 4.1: Dashboard Canvas Layout

As a user,
I want to view a dashboard with an auto-arrangeable canvas layout,
So that I can see all my projects in a flexible, visual arrangement.

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** the dashboard loads
**Then** projects are displayed as cards on a canvas (not a rigid grid)
**And** each project card shows the project name, color, and item counts
**And** the canvas uses dnd-kit for layout management

**Given** I have multiple projects
**When** the canvas renders
**Then** projects auto-arrange in a visually balanced layout
**And** the layout is responsive (adjusts to screen size)
**And** the dashboard renders within 500ms for up to 100 items

**Given** I am viewing the dashboard
**When** I have no projects
**Then** an empty state is displayed with "No projects yet"
**And** a "Create your first project" button is shown

---

### Story 4.2: Cross-Project Item Aggregation

As a user,
I want to see all my project items aggregated in one view,
So that I get a complete snapshot of everything happening across my portfolio.

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** I expand a project card
**Then** items (ideas, tasks, notes) from that project are displayed
**And** each item shows its title and type-specific metadata

**Given** I want to see all items across all projects
**When** I click "View All Items"
**Then** a consolidated list of all items from all projects is displayed
**And** items are grouped by type (Ideas, Tasks, Notes)
**And** each item shows which project it belongs to

**Given** I am viewing aggregated items
**When** the items load
**Then** a GET request is made to `/api/v1/dashboard/items`
**And** the API returns items from all projects efficiently using GSI2 (dashboard view)
**And** items are sorted by createdAt (newest first)

---

### Story 4.3: Filter Dashboard by Item Type

As a user,
I want to filter the dashboard by item type,
So that I can focus on what matters (e.g., just tasks or just ideas).

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** I click the filter dropdown
**Then** I see options: "All Items", "Ideas Only", "Tasks Only", "Notes Only"

**Given** I am viewing the dashboard
**When** I select "Tasks Only"
**Then** only tasks from all projects are displayed
**And** the filter selection is reflected in the URL (`/dashboard?filter=tasks`)
**And** the filter persists on page refresh

**Given** I have applied a filter
**When** I create a new item of the filtered type
**Then** the new item appears in the filtered view immediately

**Given** I have applied a filter
**When** I clear the filter (select "All Items")
**Then** all items from all types are displayed again

---

### Story 4.4: Drag and Rearrange Projects on Dashboard

As a user,
I want to drag and rearrange projects on the dashboard,
So that I can prioritize projects visually and organize my workspace.

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** I click and drag a project card
**Then** the card follows my cursor smoothly
**And** other cards make space for the dragged card
**And** the drag operation maintains 60fps

**Given** I am dragging a project card
**When** I release the mouse
**Then** the project card drops into the new position
**And** a PUT request is made to `/api/v1/dashboard/order` with the new order
**And** the order is saved to DynamoDB (dashboardOrder field)

**Given** I have rearranged projects
**When** I refresh the page
**Then** projects appear in my saved order
**And** the layout is restored correctly

**Given** I am dragging a project
**When** I press Escape
**Then** the drag is cancelled
**And** the project returns to its original position

---

### Story 4.5: Dashboard Snapshot View

As a user,
I want the dashboard to provide a snapshot view of all ongoing projects,
So that I can quickly understand the status of everything at a glance.

**Acceptance Criteria:**

**Given** I am on the dashboard
**When** the dashboard loads
**Then** each project card displays:
- Project name and color
- Count of ideas, tasks, and notes
- For tasks: breakdown by status (TODO, IN_PROGRESS, DONE)

**Given** I am viewing a project card
**When** I hover over the card
**Then** a quick preview of recent items is shown
**And** a "View Project" button appears

**Given** I am viewing the dashboard
**When** I click on a project card
**Then** I am navigated to the project detail view (`/projects/:projectId`)
**And** I can see all items for that project

**Given** I am viewing the dashboard
**When** project data changes (e.g., new item added)
**Then** the dashboard updates in real-time (or on refresh)
**And** item counts are accurate

---

### Story 4.6: Dashboard API Endpoint

As a frontend developer,
I want a backend API endpoint for dashboard data,
So that the frontend can efficiently load aggregated project and item data.

**Acceptance Criteria:**

**Given** I am authenticated
**When** I make a GET request to `/api/v1/dashboard`
**Then** all projects for the user are returned with item counts
**And** the response includes: projects array with id, name, color, dashboardOrder, counts (ideas, tasks, notes)

**Given** I am authenticated
**When** I make a GET request to `/api/v1/dashboard/items`
**Then** all items across all projects are returned
**And** items are efficiently queried using GSI2 (USER#userId#DASHBOARD)
**And** the response includes: items array grouped by type

**Given** I am authenticated
**When** I make a PUT request to `/api/v1/dashboard/order` with an array of project IDs and positions
**Then** the dashboardOrder field is updated for each project in DynamoDB
**And** the updated projects are returned

**Given** I am not authenticated
**When** I make any request to `/api/v1/dashboard`
**Then** I receive a 401 Unauthorized response

---

## Deferred Epics (Optional)

### Epic 5b: PWA + Accessibility Polish
**Sprint 4** (optional)

**FRs covered:** FR27  
**NFRs covered:** NFR-U-03 (offline), NFR-U-02 (WCAG 2.1 AA complete), NFR-P-01 (load time)

**Stories to be created when epic is activated:**
- Service Worker with caching strategy
- Offline viewing support
- PWA manifest (installable app)
- WCAG 2.1 AA audit and fixes
- Advanced keyboard navigation
- Screen reader optimization
- Performance optimization (code splitting, lazy loading)

---

### Epic 6 Phase 2: AWS SAM + Deployment
**Sprint 5** (optional)

**NFRs covered:** NFR-R-01 (99.9% uptime), NFR-R-03 (automatic backups)

**Stories to be created when epic is activated:**
- AWS SAM template setup
- Lambda + API Gateway + DynamoDB infrastructure
- Multi-environment deployment (dev/prod)
- GitHub Actions CI/CD pipeline
- CloudWatch logging and monitoring
- Production security hardening

---

## Story Summary

| Epic | Stories | Sprint |
|------|---------|--------|
| Epic 6 Phase 1: Development Foundation | 4 | Sprint 0 (Part 1) |
| Epic 5a: Design Foundation | 5 | Sprint 0 (Part 2) |
| Epic 1: User Authentication | 5 | Sprint 0 (Part 3) |
| Epic 2: Project Management | 5 | Sprint 1 |
| Epic 3: Item Management | 7 | Sprint 2 |
| Epic 4: Dashboard | 6 | Sprint 3 |
| Epic 5b: PWA + Accessibility | Deferred | Sprint 4 (optional) |
| Epic 6 Phase 2: AWS SAM | Deferred | Sprint 5 (optional) |

**Total Stories: 32**

---

*Document Version: 1.0*
*Last Updated: 2026-04-01*
