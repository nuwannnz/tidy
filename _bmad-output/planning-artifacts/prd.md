---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-03-personas
  - step-04-requirements
  - step-05-stories
  - step-06-nfr
  - step-07-complete
inputDocuments: []
workflowType: 'prd'
classification:
  projectType: Web/PWA Application
  domain: Productivity/Project Management
  complexity: Medium
  projectContext: greenfield
---

# Product Requirements Document - tidy

**Author:** nuwannnz
**Date:** 2026-03-31

---

## 1. Executive Summary

**tidy** is a modern, minimal project management PWA designed for individuals who juggle multiple projects simultaneously. It provides a unified dashboard that aggregates ideas, tasks, and notes across all projects, enabling users to maintain a clear snapshot of everything happening across their portfolio.

### Core Value Proposition

For professionals managing multiple concurrent projects, tidy eliminates the cognitive overhead of switching between disparate tools and provides a single, organized view of all ongoing work through an intuitive, canvas-style dashboard.

### Key Differentiators

- **Cross-project visibility** — Aggregate view of all items from all projects
- **Flexible canvas dashboard** — Auto-arrangeable, drag-and-drop interface
- **Minimal cognitive load** — Clean, modern UI focused on clarity
- **Multi-item support** — Ideas, tasks, and notes within a single project structure

---

## 2. Product Vision

### Vision Statement

To become the go-to productivity platform for multi-project professionals who need clarity and control over their distributed work without the complexity of enterprise project management tools.

### Target Users

- **Primary:** Independent professionals, consultants, and freelancers managing 3-10 concurrent projects
- **Secondary:** Small team leads who need personal organization alongside team tools
- **Tertiary:** Creative professionals tracking multiple client engagements

### User Problems Solved

| Problem | Current State | tidy Solution |
|---------|---------------|---------------|
| Fragmented visibility | Multiple tools, scattered notes | Single dashboard with all projects |
| Context switching overhead | Opening/closing apps, losing track | Unified workspace |
| Lack of high-level overview | Deep in details, missing big picture | Canvas dashboard with filters |
| Over-engineered tools | Enterprise PM tools are too heavy | Minimal, focused experience |

---

## 3. Product Classification

| Attribute | Value |
|-----------|-------|
| **Project Type** | Web/PWA Application |
| **Domain** | Productivity/Project Management |
| **Complexity** | Medium |
| **Project Context** | Greenfield |
| **Platform** | Web browser + PWA (installable) |
| **Deployment** | AWS Serverless (Lambda via SAM) |

---

## 4. Features & Requirements

### 4.1 Authentication System

| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | Users shall be able to register with email and password | Must Have |
| AUTH-02 | Users shall be able to login with email and password | Must Have |
| AUTH-03 | Passwords shall be securely hashed and stored | Must Have |
| AUTH-04 | Session management with secure token handling | Must Have |
| AUTH-05 | Password reset functionality via email | Should Have |

### 4.2 Project Management

| ID | Requirement | Priority |
|----|-------------|----------|
| PROJ-01 | Users shall be able to create projects with name, description, and color | Must Have |
| PROJ-02 | Users shall be able to edit project details | Must Have |
| PROJ-03 | Users shall be able to delete projects | Must Have |
| PROJ-04 | Projects shall be displayed in a left-side pane (master list) | Must Have |
| PROJ-05 | Project color shall be used for visual identification | Must Have |

### 4.3 Project Items (Ideas, Tasks, Notes)

| ID | Requirement | Priority |
|----|-------------|----------|
| ITEM-01 | Users shall be able to create ideas within a project | Must Have |
| ITEM-02 | Users shall be able to create tasks within a project | Must Have |
| ITEM-03 | Users shall be able to create notes within a project | Must Have |
| ITEM-04 | Each item type shall have appropriate metadata (e.g., task status, idea tags) | Must Have |
| ITEM-05 | Users shall be able to edit and delete items | Must Have |
| ITEM-06 | Items shall be displayed in the project details pane | Must Have |

### 4.4 Dashboard (Canvas View)

| ID | Requirement | Priority |
|----|-------------|----------|
| DASH-01 | Users shall be able to view a dashboard aggregating items from all projects | Must Have |
| DASH-02 | Dashboard shall filter by item type (ideas, tasks, notes) | Must Have |
| DASH-03 | Users shall be able to drag and rearrange projects on the dashboard | Must Have |
| DASH-04 | Dashboard shall use an auto-arrangeable canvas layout (not rigid grid) | Must Have |
| DASH-05 | Dashboard shall provide a snapshot view of all ongoing projects | Must Have |

### 4.5 User Interface & Layout

| ID | Requirement | Priority |
|----|-------------|----------|
| UI-01 | Application shall use a master-slave layout | Must Have |
| UI-02 | Left pane shall display project list | Must Have |
| UI-03 | Right pane shall display selected project details or dashboard | Must Have |
| UI-04 | UI shall follow Material Design principles | Must Have |
| UI-05 | Interface shall be minimal and modern | Must Have |
| UI-06 | Application shall be PWA-capable (installable, offline support) | Must Have |

---

## 5. User Stories

### Epic 1: User Authentication

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-AUTH-01 | As a user, I want to register with email/password so I can access my projects | Given I'm on the signup page, when I enter valid email/password, then my account is created and I'm logged in |
| US-AUTH-02 | As a user, I want to login so I can access my existing projects | Given I have an account, when I enter correct credentials, then I'm authenticated and see my dashboard |
| US-AUTH-03 | As a user, I want to logout so I can secure my account | Given I'm logged in, when I click logout, then I'm returned to the login screen |

### Epic 2: Project Management

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-PROJ-01 | As a user, I want to create a project so I can organize my work | Given I'm in the app, when I create a project with name/description/color, then it appears in my project list |
| US-PROJ-02 | As a user, I want to edit my projects so I can keep information current | Given I have a project, when I edit its details, then changes are saved and reflected immediately |
| US-PROJ-03 | As a user, I want to delete projects so I can remove completed work | Given I have a project, when I delete it, then it's removed from my list with confirmation |

### Epic 3: Item Management (Ideas, Tasks, Notes)

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-ITEM-01 | As a user, I want to add ideas to my projects so I can capture inspiration | Given I have a project open, when I add an idea, then it's saved and displayed in the project |
| US-ITEM-02 | As a user, I want to create tasks so I can track actionable items | Given I have a project open, when I create a task, then it appears with a status indicator |
| US-ITEM-03 | As a user, I want to add notes so I can store reference information | Given I have a project open, when I add a note, then it's saved and searchable |

### Epic 4: Dashboard & Cross-Project View

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-DASH-01 | As a user, I want to see all my project items in one view so I get a complete snapshot | Given I have multiple projects, when I open the dashboard, then I see aggregated items from all projects |
| US-DASH-02 | As a user, I want to filter dashboard items by type so I can focus on what matters | Given I'm viewing the dashboard, when I filter by type, then only matching items are shown |
| US-DASH-03 | As a user, I want to rearrange projects on the dashboard so I can prioritize visually | Given I'm on the dashboard, when I drag a project, then it moves to my desired position |

---

## 6. Technical Architecture

### 6.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend Framework** | React + TypeScript | Type safety, component architecture, strong ecosystem |
| **UI Framework** | Material UI | Modern, accessible, follows Material Design |
| **Monorepo Tool** | Nx | Code sharing, build optimization, project management |
| **Backend** | AWS Lambda (Node.js/TypeScript) | Serverless, auto-scaling, cost-effective |
| **Infrastructure** | AWS SAM | Infrastructure as code, simplified deployment |
| **Database** | DynamoDB or RDS | To be determined based on query patterns |
| **Authentication** | AWS Cognito or custom JWT | Secure, managed authentication |
| **PWA** | Service Workers + Manifest | Offline support, installable experience |

### 6.2 Architecture Principles

- **Code Quality First** — Strict TypeScript, linting, testing, code reviews
- **Serverless-Native** — Leverage AWS managed services where possible
- **Component-Driven** — Reusable UI components with Storybook documentation
- **Type Safety** — End-to-end TypeScript with shared types
- **Monorepo Structure** — Nx workspace for frontend, backend, shared libraries

### 6.3 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client (PWA)                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  React + TypeScript + Material UI                  │ │
│  │  - Project List Pane                               │ │
│  │  - Project Details Pane                            │ │
│  │  - Dashboard Canvas                                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS / API Gateway
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 AWS Backend (Serverless)                 │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │   API Gateway   │──│    Lambda       │              │
│  └─────────────────┘  │   Functions     │              │
│                       │  - Auth         │              │
│                       │  - Projects     │              │
│                       │  - Items        │              │
│                       │  - Dashboard    │              │
│                       └────────┬────────┘              │
│                                │                        │
│                       ┌────────▼────────┐              │
│                       │    Database     │              │
│                       └─────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Non-Functional Requirements

### 7.1 Code Quality

| ID | Requirement |
|----|-------------|
| NFR-Q-01 | All code must be written in TypeScript with strict mode enabled |
| NFR-Q-02 | ESLint and Prettier must be configured with strict rules |
| NFR-Q-03 | Unit test coverage must be ≥80% for all business logic |
| NFR-Q-04 | All components must have Storybook stories |
| NFR-Q-05 | CI pipeline must run linting, type checking, and tests on every commit |
| NFR-Q-06 | Code reviews required for all pull requests |

### 7.2 Performance

| ID | Requirement |
|----|-------------|
| NFR-P-01 | Initial page load must be <3 seconds on 4G connection |
| NFR-P-02 | Dashboard must render within 500ms for up to 100 items |
| NFR-P-03 | Drag-and-drop operations must maintain 60fps |
| NFR-P-04 | API responses must be <200ms (p95) |

### 7.3 Security

| ID | Requirement |
|----|-------------|
| NFR-S-01 | All passwords must be hashed using bcrypt or equivalent |
| NFR-S-02 | All API endpoints must require authentication |
| NFR-S-03 | JWT tokens must be securely stored (httpOnly cookies or secure storage) |
| NFR-S-04 | All data in transit must use HTTPS/TLS |
| NFR-S-05 | Input validation and sanitization on all user inputs |

### 7.4 Usability

| ID | Requirement |
|----|-------------|
| NFR-U-01 | Application must be intuitive for new users within 5 minutes |
| NFR-U-02 | All interactive elements must meet WCAG 2.1 AA accessibility standards |
| NFR-U-03 | PWA must support offline viewing of previously loaded data |
| NFR-U-04 | Application must be responsive (desktop, tablet, mobile) |

### 7.5 Reliability

| ID | Requirement |
|----|-------------|
| NFR-R-01 | Backend must achieve 99.9% uptime |
| NFR-R-02 | All data mutations must be atomic and consistent |
| NFR-R-03 | Automatic backup of all user data |

---

## 8. Out of Scope (v1.0)

The following are explicitly **not** included in the initial release:

- Team collaboration / multi-user projects
- File attachments
- Real-time sync / live collaboration
- Mobile native apps (PWA covers mobile web)
- Integrations with third-party tools
- Advanced reporting / analytics
- Custom workflows / statuses
- Time tracking

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| User onboarding completion | >80% | Analytics: signup → first project created |
| Daily active users | >60% of weekly users | Analytics: DAU/WAU ratio |
| Dashboard engagement | >70% of sessions | Analytics: dashboard views / total sessions |
| Performance satisfaction | >4.0/5.0 | User surveys |
| Code quality | 0 critical bugs, <5 minor bugs | Sprint retrospectives, bug tracking |

---

## 10. Open Questions & Decisions Needed

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| Q-01 | Database choice: DynamoDB vs RDS (PostgreSQL)? | Affects query patterns, scaling, cost | Technical Lead |
| Q-02 | Authentication: AWS Cognito vs custom JWT? | Affects development time, features | Technical Lead |
| Q-03 | State management: Redux, Zustand, or React Query? | Affects code structure, learning curve | Technical Lead |
| Q-04 | Drag-and-drop library: dnd-kit, react-beautiful-dnd? | Affects dashboard implementation | Frontend Lead |

---

## 11. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep from feature requests | Medium | High | Strict adherence to MVP scope; backlog for v2 |
| Performance issues with large datasets | Medium | Medium | Early performance testing; pagination strategies |
| AWS cost overruns | Low | Medium | Monitor usage; set up cost alerts; optimize Lambda |
| PWA limitations on iOS | Medium | Low | Test thoroughly on iOS; graceful degradation |

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **Project** | A container for ideas, tasks, and notes with a name, description, and color |
| **Dashboard** | A canvas-style view aggregating items from all projects |
| **Canvas Layout** | An auto-arrangeable, flexible layout (not rigid grid) |
| **PWA** | Progressive Web App — installable web application with offline support |

---

## 13. Appendix

### 13.1 Wireframe References

*To be added during UX design phase*

### 13.2 Technical Spikes

- Evaluate drag-and-drop libraries for canvas layout
- Prototype AWS SAM structure for Lambda functions
- Research PWA offline strategies for React applications

---

*Document Version: 1.0*  
*Last Updated: 2026-03-31*
