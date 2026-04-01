---
story_number: "1.2"
story_key: "1-2-user-login"
story_name: "User Login with Credentials"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 1.2: User Login with Credentials

> **QA Note:** This story enables parallel test case development. QA can write manual test cases and automation scripts using the specifications in sections 3-5 while development is in progress.

## 1. Description

### 1.1 User Story Statement
As a registered user,
I want to login with my email and password,
so that I can access my existing projects and data.

### 1.2 Business Context
Login is the primary entry point for returning users. A smooth, secure login experience is critical for user retention and trust. Failed logins must be handled gracefully without revealing user enumeration vulnerabilities.

### 1.3 Technical Overview
- **Frontend:** React login form with validation, "Forgot Password" link
- **Backend:** Express API endpoint with credential verification, JWT generation
- **Security:** bcrypt password comparison, JWT tokens (access + refresh), httpOnly cookies
- **Session Management:** 15-minute access token, 7-day refresh token

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am on the login page, when I enter registered email and correct password, then I am logged in and redirected to dashboard | Must Have | Yes |
| AC-2 | Given I enter an incorrect password, then I see "Invalid email or password" | Must Have | Yes |
| AC-3 | Given I enter an email that doesn't exist, then I see the same generic error (prevent enumeration) | Must Have | Yes |
| AC-4 | Given I submit empty fields, then validation errors appear for each field | Must Have | Yes |
| AC-5 | Given I click "Forgot Password", then I am taken to password reset request page | Should Have | Yes |
| AC-6 | Given I am logged in, when I navigate to login, then I am redirected to dashboard | Should Have | Yes |

### 2.2 Non-Functional Requirements
- **Performance:** Login API response < 200ms (p95)
- **Security:** Generic error messages (prevent enumeration), rate limiting, brute force protection
- **Accessibility:** WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- **Compatibility:** Chrome, Firefox, Safari, Edge (latest 2 versions)

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required | Rate Limit |
|----------|--------|---------|---------------|------------|
| `/api/v1/auth/login` | POST | Authenticate user, issue tokens | No | 5/min |
| `/api/v1/auth/refresh` | POST | Refresh access token | Refresh Token | 10/min |

### 3.2 Request Details
**Endpoint:** `POST /api/v1/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required) - valid email format",
  "password": "string (required)"
}
```

**Field Validation Rules:**
| Field | Type | Required | Min/Max | Pattern | Error Message |
|-------|------|----------|---------|---------|---------------|
| email | string | Yes | 5-254 | email regex | "Please enter a valid email address" |
| password | string | Yes | 1-128 | N/A | "Password is required" |

### 3.3 Response Details
**Success Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**Error Responses:**
| Code | Error | Response Body | Handling |
|------|-------|---------------|----------|
| 400 | Validation Error | `{"errors": [{"field": "email", "message": "..."}]}` | Display field-level errors |
| 401 | Unauthorized | `{"error": "Invalid email or password"}` | Show generic error |
| 429 | Rate Limited | `{"error": "Too many login attempts. Try again in 15 minutes"}` | Show retry message |
| 500 | Server Error | `{"error": "Internal server error"}` | Log error, show user-friendly message |

### 3.4 Database Changes
- **Tables Affected:** `tidy-users-{env}` (single-table design, existing from Story 1.1)
- **Query Pattern:**
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
// Compare password
const isValid = await bcrypt.compare(password, user.passwordHash);
```

### 3.5 Service Layer Changes
- **New Services:**
  - `TokenService` - JWT generation, validation, refresh
  - `SessionService` - Session tracking, refresh token management
- **Modified Services:**
  - `AuthService` - Add login method
- **Repository Layer:**
  - `UserRepository.findByEmail(email)` - Existing method

### 3.6 API Test Considerations for QA
QA team will create API tests based on the endpoint specifications above. Key test areas:
- Successful login with valid credentials
- Invalid credentials (generic error message)
- Token refresh flow
- Rate limiting enforcement

## 4. Frontend Changes

### 4.1 New Components
| Component | Path | Purpose | Props | State | Parent/Child |
|-----------|------|---------|-------|-------|--------------|
| LoginForm.tsx | `apps/web/src/features/auth/LoginForm.tsx` | Login form with validation | onSubmit, isLoading | formData, errors, touched | Parent: LoginPage |
| LoginPage.tsx | `apps/web/src/pages/LoginPage.tsx` | Login page container | none | submitState | Parent: AppRoutes |

### 4.2 Modified Components
| Component | Path | Changes Required | Impact |
|-----------|------|------------------|--------|
| AppRoutes.tsx | `apps/web/src/routes/AppRoutes.tsx` | Add `/login` route, auth guard redirect | Medium |
| Navbar.tsx | `apps/web/src/components/layout/Navbar.tsx` | Add "Login" link (when logged out) | Low |

### 4.3 State Management
- **Store Updates:**
```typescript
// Auth slice (extends from Story 1.1)
interface AuthState {
  user: { id: string; email: string } | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}
```
- **New Actions:**
  - `login({ email, password })` - POST /api/v1/auth/login
  - `refreshToken()` - POST /api/v1/auth/refresh
  - `logout()` - Clear auth state

### 4.4 UI/UX Specifications
- **Layout:** Centered card on full-page background (consistent with registration)
- **Component Library:** Material UI v5
- **Form Fields:**
  - Email input with label and helper text
  - Password input with visibility toggle
  - "Forgot Password?" link below password field
  - Login button (full width)
  - Link to registration page
- **Validation:** Real-time on blur, submit triggers all validations
- **Loading State:** Button shows spinner, form disabled
- **Error Display:** Inline errors below each field, generic error banner for auth failures

### 4.5 Routing
- **New Routes:**
```typescript
{
  path: '/login',
  element: <LoginPage />,
  // Public route (no auth guard)
  // If already logged in → redirect to /dashboard
}
```
- **Navigation Flow:**
  1. User navigates to `/login`
  2. Enter credentials
  3. Submit → Success → Redirect to `/dashboard`
  4. Click "Forgot Password" → Navigate to `/reset-password`

### 4.6 Frontend Test Hooks for QA
**Test IDs for Automation:**
```typescript
<form data-testid="login-form">
  <input data-testid="login-email-input" />
  <input data-testid="login-password-input" />
  <button data-testid="login-password-visibility" />
  <a data-testid="login-forgot-password-link" />
  <button data-testid="login-submit-button" />
  <a data-testid="login-to-register-link" />
  <div data-testid="login-form-errors" />
</form>
```

**Component Test Selectors:**
```typescript
export const LoginSelectors = {
  form: () => screen.getByTestId('login-form'),
  emailInput: () => screen.getByTestId('login-email-input'),
  passwordInput: () => screen.getByTestId('login-password-input'),
  submitButton: () => screen.getByTestId('login-submit-button'),
  forgotPasswordLink: () => screen.getByTestId('login-forgot-password-link'),
  registerLink: () => screen.getByTestId('login-to-register-link'),
};
```

## 5. Edge Scenarios & Test Cases

### 5.1 Edge Cases
| ID | Scenario | Trigger | Expected Behavior | Priority | Test Status |
|----|----------|---------|-------------------|----------|-------------|
| EC-01 | Network failure during login | Disconnect internet | Show "Network error. Please try again.", preserve credentials | High | [ ] Not Started |
| EC-02 | Rapid login attempts | Submit 5+ times in 1 minute | Show rate limit message, block further attempts | High | [ ] Not Started |
| EC-03 | Expired refresh token | Use 7-day expired token | Return 401, redirect to login | High | [ ] Not Started |
| EC-04 | Concurrent sessions | Login from multiple devices | All sessions valid, independent refresh tokens | Medium | [ ] Not Started |
| EC-05 | Browser back after login | Click back button | Redirect to dashboard, prevent re-login | Medium | [ ] Not Started |
| EC-06 | XSS attempt in email | Enter "<script>alert('x')</script>@example.com" | Sanitize input, reject invalid format | High | [ ] Not Started |
| EC-07 | Credential stuffing attack | Automated login attempts from botnet | Rate limit + IP block after threshold | High | [ ] Not Started |

### 5.2 Validation Scenarios
| Field | Valid Input | Invalid Input | Boundary Case | Error Message |
|-------|-------------|---------------|---------------|---------------|
| email | user@example.com | invalid, @example.com | 254 char email | "Please enter a valid email address" |
| password | SecurePass123! | (empty) | 128 char password | "Password is required" |

### 5.3 Manual Test Cases (QA Ready)

**TC-01: Login - Happy Path**
- **Preconditions:** User account exists with email `test@example.com`, password `SecurePass123!`
- **Test Steps:**
  1. Navigate to `/login`
  2. Enter email: `test@example.com`
  3. Enter password: `SecurePass123!`
  4. Click "Login" button
  5. Verify redirect to `/dashboard`
  6. Verify navbar shows logout button
- **Expected Result:** User logged in, redirected to dashboard
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-02: Login - Wrong Password**
- **Preconditions:** User account exists
- **Test Steps:**
  1. Navigate to `/login`
  2. Enter valid email
  3. Enter wrong password
  4. Click "Login" button
  5. Verify error message appears
- **Expected Result:** Generic error "Invalid email or password", form not submitted
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-03: Login - User Not Found**
- **Preconditions:** None
- **Test Steps:**
  1. Navigate to `/login`
  2. Enter non-existent email
  3. Enter any password
  4. Click "Login" button
  5. Verify same generic error appears
- **Expected Result:** Same error as wrong password (prevent enumeration)
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-04: Login - Empty Fields**
- **Preconditions:** None
- **Test Steps:**
  1. Navigate to `/login`
  2. Leave all fields empty
  3. Click "Login" button
  4. Verify validation errors appear
- **Expected Result:** Errors for email and password, form not submitted
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-05: Login - Forgot Password Link**
- **Preconditions:** None
- **Test Steps:**
  1. Navigate to `/login`
  2. Click "Forgot Password?" link
  3. Verify navigation to `/reset-password`
- **Expected Result:** Redirected to password reset page
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

**TC-06: Login - Already Logged In**
- **Preconditions:** User is logged in
- **Test Steps:**
  1. Navigate to `/login` directly
  2. Verify redirect to `/dashboard`
- **Expected Result:** Automatically redirected, login form not shown
- **Actual Result:** [QA to fill]
- **Status:** [ ] Pass [ ] Fail [ ] Blocked
- **Tested By:** _________ **Date:** _________

### 5.4 Automation Test Notes for QA
QA team will create automation scripts using the test IDs from section 4.6. Key scenarios to cover:
- Happy path login and redirect
- Invalid credentials error handling
- Forgot password link navigation
- Already logged in redirect

### 5.5 Performance Test Scenarios
- **Load Test:**
  - Concurrent users: 100
  - Requests per second: 20
  - Expected response time: < 200ms (p95)
- **Stress Test:**
  - Rate limiting: Verify 5 req/min enforced
  - Brute force protection: Account lockout after 5 failed attempts
- **Response Time SLA:**
  - Login API: < 300ms (p95)
  - Refresh API: < 100ms (p95)

## 6. Dependencies

### 6.1 Internal Dependencies
- **Prerequisite Stories:**
  - Story 1.1: User Registration (user table exists)
  - Story 5a.1: Material UI Theme
  - Story 5a.2: Master-Slave Layout
- **Reusable Components:**
  - `FormInput`, `Button` (from Story 1.1)

### 6.2 External Dependencies
- **npm Packages:**
```json
{
  "dependencies": {
    "bcrypt": "^5.x.x",
    "jsonwebtoken": "^9.x.x"
  }
}
```

## 7. Security Considerations

### 7.1 Authentication & Authorization
- **Authentication Required:** No (public endpoint)
- **Rate Limiting:** 5 requests per minute per IP
- **Brute Force Protection:** Account lockout after 5 failed attempts

### 7.2 Data Protection
- **Encryption:** TLS 1.3 in transit, bcrypt for password verification
- **Token Storage:** httpOnly cookies (not accessible via JavaScript)
- **Token Expiry:** Access token 15 min, refresh token 7 days

### 7.3 Input Security
- **XSS Prevention:** Input sanitization, React escaping
- **User Enumeration Prevention:** Generic error messages

## 8. Deployment & Rollback

### 8.1 Migration Steps
```bash
# Deploy backend and frontend
cd apps/api && npm run deploy
cd apps/web && npm run deploy
```

### 8.2 Rollback Plan
- **Triggers:** Security vulnerability, > 50% failure rate
- **Steps:** Disable feature flag, restore previous build

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose | Lines |
|------|--------|---------|-------|
| `apps/api/src/routes/auth.ts` | MODIFY | Add login endpoint | ~60 |
| `apps/api/src/services/token.service.ts` | CREATE | JWT token management | ~100 |
| `apps/web/src/features/auth/LoginForm.tsx` | CREATE | Login form | ~140 |
| `apps/web/src/pages/LoginPage.tsx` | CREATE | Login page | ~40 |
| `tests/e2e/auth-login.spec.ts` | CREATE | E2E tests | ~80 |
| `tests/api/auth-login.spec.ts` | CREATE | API tests | ~100 |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
| Dev Lead | _________ | _________ | [ ] Approved [ ] Rejected | |
| Product Owner | _________ | _________ | [ ] Approved [ ] Rejected | |

## 11. References

- [Architecture Document](_bmad-output/planning-artifacts/architecture.md#authentication)
- [Story 1.1: User Registration](./1-1-user-registration.md)
- [Epic 1: User Authentication](_bmad-output/planning-artifacts/epics.md#epic-1)
