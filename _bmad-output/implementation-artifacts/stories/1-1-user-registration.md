---
story_number: "1.1"
story_key: "1-1-user-registration"
story_name: "User Registration with Email/Password"
status: review
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 1.1: User Registration with Email/Password

> **QA Note:** This story enables parallel test case development. QA can write manual test cases and automation scripts using the specifications in sections 3-5 while development is in progress.

## 1. Description

### 1.1 User Story Statement
As a new user,
I want to register with my email and password,
so that I can create an account and access my projects.

### 1.2 Business Context
First-time user onboarding is critical for conversion. A smooth registration flow reduces drop-off and establishes trust. This is the entry point for all user data in the tidy application.

### 1.3 Technical Overview
- **Frontend:** React registration form with validation using Material UI components
- **Backend:** Express API endpoint with bcrypt password hashing
- **Database:** DynamoDB user table with email as GSI
- **Security:** Password hashing (bcrypt), input validation, XSS/SQL injection prevention

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am on the registration page, when I enter valid email and password (min 8 chars), then I am registered and logged in automatically | Must Have | Yes |
| AC-2 | Given I enter an email that already exists, then I see "This email is already registered" | Must Have | Yes |
| AC-3 | Given I enter a password shorter than 8 characters, then I see "Password must be at least 8 characters" | Must Have | Yes |
| AC-4 | Given I enter an invalid email format, then I see "Please enter a valid email address" | Must Have | Yes |
| AC-5 | Given I submit empty fields, then validation errors appear for each empty field | Must Have | Yes |
| AC-6 | Given registration succeeds, then I am redirected to the dashboard | Should Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** Registration API response < 200ms (p95)
- **Security:** Passwords hashed with bcrypt (cost factor 12), input sanitization
- **Accessibility:** WCAG 2.1 AA compliant (form labels, error announcements)
- **Compatibility:** Chrome, Firefox, Safari, Edge (latest 2 versions)

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required | Rate Limit |
|----------|--------|---------|---------------|------------|
| `/api/v1/auth/register` | POST | Create new user account | No | 10/min |

### 3.2 Request Details
**Endpoint:** `POST /api/v1/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required) - valid email format",
  "password": "string (required) - min 8 characters"
}
```

**Field Validation Rules:**
| Field | Type | Required | Min/Max | Pattern | Error Message |
|-------|------|----------|---------|---------|---------------|
| email | string | Yes | 5-254 | email regex | "Please enter a valid email address" |
| password | string | Yes | 8-128 | N/A | "Password must be at least 8 characters" |

### 3.3 Response Details
**Success Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2026-04-01T10:00:00Z"
  },
  "token": "jwt_access_token_here"
}
```

**Error Responses:**
| Code | Error | Response Body | Handling |
|------|-------|---------------|----------|
| 400 | Validation Error | `{"errors": [{"field": "email", "message": "..."}]}` | Display field-level errors |
| 409 | Conflict | `{"error": "Email already registered"}` | Show email exists message |
| 429 | Rate Limited | `{"error": "Too many registration attempts"}` | Show retry after message |
| 500 | Server Error | `{"error": "Internal server error"}` | Log error, show user-friendly message |

### 3.4 Database Changes
- **Tables Affected:** `tidy-{env}` (single-table for entire application)
- **Table Structure:**
```typescript
// DynamoDB Single-Table Design (stores ALL data: users, projects, items, etc.)
{
  TableName: `tidy-${environment}`,
  KeySchema: [
    { AttributeName: "PK", KeyType: "HASH" },
    { AttributeName: "SK", KeyType: "RANGE" }
  ],
  AttributeDefinitions: [
    { AttributeName: "PK", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
    { AttributeName: "GSI1PK", AttributeType: "S" },
    { AttributeName: "GSI1SK", AttributeType: "S" },
    { AttributeName: "GSI2PK", AttributeType: "S" },
    { AttributeName: "GSI2SK", AttributeType: "S" }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "GSI1",
      KeySchema: [
        { AttributeName: "GSI1PK", KeyType: "HASH" },
        { AttributeName: "GSI1SK", KeyType: "RANGE" }
      ],
      Projection: { ProjectionType: "ALL" }
    },
    {
      IndexName: "GSI2",
      KeySchema: [
        { AttributeName: "GSI2PK", KeyType: "HASH" },
        { AttributeName: "GSI2SK", KeyType: "RANGE" }
      ],
      Projection: { ProjectionType: "ALL" }
    }
  ]
}
```
- **Item Structure (User):**
```typescript
{
  PK: "USER#user-uuid",
  SK: "PROFILE",
  GSI1PK: "EMAIL#user@example.com",
  GSI1SK: "PROFILE",
  GSI2PK: "USER#user-uuid",
  GSI2SK: "PROFILE",
  entityType: "USER",
  email: "user@example.com",
  passwordHash: "bcrypt_hash",
  createdAt: "ISO8601",
  updatedAt: "ISO8601"
}
```
- **Query Patterns:**
```typescript
// Find user by email (GSI1)
const user = await db.query({
  IndexName: 'GSI1',
  KeyConditionExpression: 'GSI1PK = :pk AND GSI1SK = :sk',
  ExpressionAttributeValues: {
    ':pk': `EMAIL#${email}`,
    ':sk': 'PROFILE'
  }
});
```

### 3.5 Service Layer Changes
- **New Services:**
  - `AuthService` - Handles registration, login, token generation
  - `UserValidator` - Validates user input and business rules
- **Repository Layer:**
  - `UserRepository` - DynamoDB access methods: `create()`, `findByEmail()`
- **Integration Points:**
  - bcrypt for password hashing
  - JWT for token generation

### 3.6 API Test Considerations for QA
QA team will create API tests based on the endpoint specifications above. Key test areas:
- Successful registration with valid credentials
- Duplicate email detection (409 Conflict)
- Validation errors (400 Bad Request)
- Rate limiting enforcement (429 Too Many Requests)

## 4. Frontend Changes

### 4.1 New Components
| Component | Path | Purpose | Props | State | Parent/Child |
|-----------|------|---------|-------|-------|--------------|
| RegistrationForm.tsx | `apps/web/src/features/auth/RegistrationForm.tsx` | Registration form with validation | onSubmit, isLoading | formData, errors, touched | Parent: RegisterPage |
| RegisterPage.tsx | `apps/web/src/pages/RegisterPage.tsx` | Registration page container | none | submitState | Parent: AppRoutes |

### 4.2 Modified Components
| Component | Path | Changes Required | Impact |
|-----------|------|------------------|--------|
| AppRoutes.tsx | `apps/web/src/routes/AppRoutes.tsx` | Add `/register` route | Low |
| Navbar.tsx | `apps/web/src/components/layout/Navbar.tsx` | Add "Register" link (when logged out) | Low |

### 4.3 State Management
- **Store Updates:**
```typescript
// Auth slice (Redux Toolkit)
interface AuthState {
  user: { id: string; email: string } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
```
- **New Actions:**
  - `register({ email, password })` - POST /api/v1/auth/register
  - `setAuth({ user, token })` - Store auth state
  - `clearError()` - Clear error state

### 4.4 UI/UX Specifications
- **Layout:** Centered card on full-page background
- **Component Library:** Material UI v5
- **Styling:** Custom theme with design tokens
- **Form Fields:**
  - Email input with label and helper text
  - Password input with visibility toggle
  - Register button (full width)
  - Link to login page
- **Validation:** Real-time on blur, submit triggers all validations
- **Loading State:** Button shows spinner, form disabled
- **Error Display:** Inline errors below each field

### 4.5 Routing
- **New Routes:**
```typescript
{
  path: '/register',
  element: <RegisterPage />,
  // Public route (no auth guard)
}
```
- **Navigation Flow:**
  1. User clicks "Register" from login page or navbar
  2. Navigate to `/register`
  3. Submit form → Success → Redirect to `/dashboard`

### 4.6 Frontend Test Hooks for QA
**Test IDs for Automation:**
```typescript
// Add these data-testid attributes
<form data-testid="registration-form">
  <input data-testid="register-email-input" />
  <input data-testid="register-password-input" />
  <button data-testid="register-password-visibility" />
  <button data-testid="register-submit-button" />
  <a data-testid="register-to-login-link" />
  <div data-testid="register-form-errors" />
</form>
```

**Component Test Selectors:**
```typescript
export const RegistrationSelectors = {
  form: () => screen.getByTestId('registration-form'),
  emailInput: () => screen.getByTestId('register-email-input'),
  passwordInput: () => screen.getByTestId('register-password-input'),
  submitButton: () => screen.getByTestId('register-submit-button'),
  errorMessage: (field) => screen.getByTestId(`error-${field}`),
  loginLink: () => screen.getByTestId('register-to-login-link'),
};
```

## 5. Edge Scenarios & Test Cases

### 5.1 Edge Cases
| ID | Scenario | Trigger | Expected Behavior | Priority | Test Status |
|----|----------|---------|-------------------|----------|-------------|
| EC-01 | Network failure during submission | Disconnect internet | Show "Network error. Please try again.", preserve form data | High | [ ] Not Started |
| EC-02 | Duplicate registration | Submit existing email | Show "Email already registered", allow login redirect | High | [ ] Not Started |
| EC-03 | Rapid submissions | Click submit multiple times | Disable button after first click, prevent duplicate requests | High | [ ] Not Started |
| EC-04 | Browser back after registration | Click back button | Redirect to dashboard, prevent re-registration | Medium | [ ] Not Started |
| EC-05 | Password paste with leading/trailing spaces | Paste "  password123  " | Trim whitespace before validation | Medium | [ ] Not Started |
| EC-06 | Email case sensitivity | Register "User@Example.com" after "user@example.com" | Treat as same email (case-insensitive) | Medium | [ ] Not Started |
| EC-07 | XSS attempt in email | Enter "<script>alert('x')</script>@example.com" | Sanitize input, reject invalid format | High | [ ] Not Started |

### 5.2 Validation Scenarios
| Field | Valid Input | Invalid Input | Boundary Case | Error Message |
|-------|-------------|---------------|---------------|---------------|
| email | user@example.com | invalid, @example.com | 254 char email | "Please enter a valid email address" |
| password | MyP@ss123! | 123456, abc | Exactly 8 chars | "Password must be at least 8 characters" |

### 5.3 Manual Test Cases (QA Ready)

**TC-01: Register - Happy Path**
- **Preconditions:** User is not logged in, has valid email/password
- **Test Steps:**
  1. Navigate to `/register`
  2. Enter valid email: `testuser@example.com`
  3. Enter valid password: `SecurePass123!`
  4. Click "Register" button
  5. Verify success toast appears
  6. Verify redirect to `/dashboard`
  7. Verify user is logged in (navbar shows logout)
- **Expected Result:** User registered, logged in, redirected to dashboard
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-02: Register - Email Already Exists**
- **Preconditions:** User account exists with email `existing@example.com`
- **Test Steps:**
  1. Navigate to `/register`
  2. Enter email: `existing@example.com`
  3. Enter password: `SecurePass123!`
  4. Click "Register" button
  5. Verify error message appears below email field
- **Expected Result:** Error "This email is already registered", form not submitted
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-03: Register - Password Too Short**
- **Preconditions:** User is not logged in
- **Test Steps:**
  1. Navigate to `/register`
  2. Enter valid email
  3. Enter password: `short`
  4. Click "Register" button
  5. Verify validation error appears
- **Expected Result:** Error "Password must be at least 8 characters", form not submitted
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-04: Register - Invalid Email Format**
- **Preconditions:** User is not logged in
- **Test Steps:**
  1. Navigate to `/register`
  2. Enter email: `invalid-email`
  3. Enter valid password
  4. Click "Register" button
  5. Verify validation error appears
- **Expected Result:** Error "Please enter a valid email address", form not submitted
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-05: Register - Empty Fields**
- **Preconditions:** User is not logged in
- **Test Steps:**
  1. Navigate to `/register`
  2. Leave all fields empty
  3. Click "Register" button
  4. Verify validation errors appear for each field
- **Expected Result:** Errors for email and password, form not submitted
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-06: Register - Password Visibility Toggle**
- **Preconditions:** User is on registration page
- **Test Steps:**
  1. Enter password in password field
  2. Click eye icon (visibility toggle)
  3. Verify password is shown in plain text
  4. Click eye icon again
  5. Verify password is masked
- **Expected Result:** Password visibility toggles correctly
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

### 5.4 Automation Test Notes for QA
QA team will create automation scripts using the test IDs from section 4.6. Key scenarios to cover:
- Happy path registration and redirect
- Validation error display
- Duplicate email error handling
- Network failure handling

### 5.5 Performance Test Scenarios
- **Load Test:**
  - Concurrent users: 50
  - Requests per second: 10
  - Expected response time: < 200ms (p95)
- **Stress Test:**
  - Breaking point: Identify at what load registration fails
  - Rate limiting: Verify 10 req/min limit enforced
- **Response Time SLA:**
  - Registration API: < 300ms (p95)
  - Page load: < 2s on 3G

## 6. Dependencies

### 6.1 Internal Dependencies
- **Prerequisite Stories:**
  - Story 5a.1: Material UI Theme (for form components)
  - Story 5a.2: Master-Slave Layout (for app shell)
  - Story 6.1.1: Nx Monorepo Workspace (for project structure)
  - Story 6.1.2: Docker Local Dev Stack (for local testing)
- **Reusable Components:**
  - `FormInput` - Shared form input component
  - `Button` - Shared button component
- **Existing Services:**
  - `LoggerService` - For error tracking

### 6.2 External Dependencies
- **npm Packages:**
```json
{
  "dependencies": {
    "bcrypt": "^5.x.x",
    "jsonwebtoken": "^9.x.x",
    "zod": "^3.x.x",
    "react-hook-form": "^7.x.x"
  }
}
```

## 7. Security Considerations

### 7.1 Authentication & Authorization
- **Authentication Required:** No (public endpoint)
- **Rate Limiting:** 10 requests per minute per IP
- **Brute Force Protection:** Account lockout after 5 failed attempts from same IP

### 7.2 Data Protection
- **Encryption:**
  - In Transit: TLS 1.3 required
  - At Rest: Passwords hashed with bcrypt (cost factor 12)
- **Sensitive Data Handling:**
  - Never log passwords
  - Email stored in lowercase
  - Password hash never returned in API responses

### 7.3 Input Security
- **XSS Prevention:**
  - Sanitize all user inputs
  - React's built-in escaping
- **SQL Injection Prevention:**
  - DynamoDB (NoSQL) - parameterized queries
- **Email Validation:**
  - Regex validation server-side
  - Case-insensitive uniqueness check

### 7.4 Rate Limiting
- **API Rate Limits:**
  - Registration: 10 requests/minute per IP
  - Global: 100 requests/minute per user
- **DDoS Protection:**
  - Cloudflare/WAF rules
  - Automatic IP blocking after 100 failed requests

## 8. Deployment & Rollback

### 8.1 Migration Steps
```bash
# 1. Deploy backend
cd apps/api && npm run build && npm run deploy

# 2. Deploy frontend
cd apps/web && npm run build && npm run deploy

# 3. Verify
curl -X POST https://api.tidy-app.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### 8.2 Feature Flags
```typescript
const featureFlags = {
  'auth-registration': {
    enabled: true,
    rollout: 100,
    environments: ['production', 'staging']
  }
};
```

### 8.3 Rollback Plan
- **Rollback Triggers:**
  - Critical security vulnerability
  - Data corruption detected
  - > 50% failure rate
- **Rollback Steps:**
```bash
# Disable feature flag
UPDATE feature_flags SET enabled = false WHERE name = 'auth-registration';

# Restore previous build
cd apps/api && git checkout HEAD~1 && npm run deploy
```

## 9. Dev Agent Record

### Agent Model Used
claude-sonnet-4-6

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/repositories/user.repository.ts` | CREATE | DynamoDB user create/findByEmail with GSI1 email lookup |
| `apps/api/src/services/auth.service.ts` | CREATE | Registration logic: bcrypt hash (cost 12) + JWT (7d) |
| `apps/api/src/routes/auth.ts` | CREATE | POST /api/v1/auth/register with Zod validation |
| `apps/api/src/app.ts` | MODIFY | Mount authRouter at /api/v1/auth |
| `apps/api/src/repositories/user.repository.spec.ts` | CREATE | Unit tests for UserRepository (mock dynamoDb) |
| `apps/api/src/services/auth.service.spec.ts` | CREATE | Unit tests for AuthService (mock bcrypt/jwt/repo) |
| `apps/api/src/routes/auth.spec.ts` | CREATE | Route integration tests (real server, mocked service) |
| `apps/web/src/store/authSlice.ts` | CREATE | Redux auth slice with registerUser thunk |
| `apps/web/src/store/store.ts` | CREATE | Redux store configuration |
| `apps/web/src/features/auth/RegistrationForm.tsx` | CREATE | Controlled form with client-side validation + confirm password |
| `apps/web/src/pages/RegisterPage.tsx` | CREATE | Page container dispatching registerUser and navigating to /dashboard |
| `apps/web/src/app/App.tsx` | MODIFY | Added BrowserRouter + /register route |
| `apps/web/src/main.tsx` | MODIFY | Wrapped App in Redux Provider |
| `apps/web/src/app/App.spec.tsx` | MODIFY | Updated tests for routing-based App |
| `apps/web/src/features/auth/RegistrationForm.spec.tsx` | CREATE | Unit tests for form validation (all ACs covered) |
| `apps/web/src/store/authSlice.spec.ts` | CREATE | Unit tests for auth reducer and thunk states |

### Implementation Notes
- Passwords hashed with bcrypt cost factor 12 (never stored or returned in plain text)
- Email normalized to lowercase before storing and querying (case-insensitive uniqueness via DynamoDB ConditionExpression)
- DynamoDB ConditionExpression `attribute_not_exists(GSI1PK)` enforces email uniqueness at write time
- JWT signed with JWT_SECRET from env, 7-day expiry
- Zod validates email + password server-side; RegistrationForm validates client-side on blur and submit
- Confirm password field added to match existing E2E page objects (register.page.ts)
- `react-hook-form` not used (not installed); controlled useState used instead with zod patterns
- 48 tests total: 29 API + 19 web — all passing, lint clean

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

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#authentication)
- [Epic 1: User Authentication](_bmad-output/planning-artifacts/epics.md#epic-1-user-authentication--account-management)
- [API Documentation](docs/api.md)
- [Figma Designs](https://figma.com/file/...)
