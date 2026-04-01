---
story_number: "1.4"
story_key: "1-4-password-reset"
story_name: "Password Reset via Email"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 1.4: Password Reset via Email

> **QA Note:** This story enables parallel test case development.

## 1. Description

### 1.1 User Story Statement
As a user who forgot my password,
I want to request a password reset email,
so that I can regain access to my account.

### 1.2 Business Context
Password reset is essential for user recovery and reduces support costs. A smooth reset flow improves user retention.

### 1.3 Technical Overview
- **Frontend:** Request form, reset form
- **Backend:** Token generation, email sending, password update
- **Security:** Time-limited tokens (1 hour), secure password update

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given I am on login page, when I click "Forgot Password", then I am taken to reset request page | Must Have | Yes |
| AC-2 | Given I enter registered email, when I submit request, then I receive confirmation message | Must Have | Yes |
| AC-3 | Given I click reset link from email, when token is valid, then I can reset password | Must Have | Yes |
| AC-4 | Given I enter new password (min 8 chars), when I submit, then password is updated | Must Have | Yes |
| AC-5 | Given token is expired (>1 hour), when I try to reset, then I see error | Must Have | Yes |

## 3. Backend API Changes

### 3.1 New/Modified Endpoints
| Endpoint | Method | Purpose | Auth Required | Rate Limit |
|----------|--------|---------|---------------|------------|
| `/api/v1/auth/forgot-password` | POST | Request reset token | No | 5/min |
| `/api/v1/auth/reset-password` | POST | Reset password with token | No | 5/min |

### 3.2 Request/Response Details
**POST `/api/v1/auth/forgot-password`:**
```json
// Request
{ "email": "user@example.com" }

// Response (200 OK)
{ "message": "If this email exists, you'll receive a reset link" }
```

**POST `/api/v1/auth/reset-password`:**
```json
// Request
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!"
}

// Response (200 OK)
{ "message": "Password reset successfully" }
```

### 3.3 Database Changes
- **Tables Affected:** `tidy-{env}` (single-table for entire application)
- **Item Structure (Password Reset Token):**
```typescript
{
  PK: "USER#user-uuid",
  SK: "RESET#reset-token-uuid",
  GSI1PK: "RESET-TOKEN#hashed_token",
  GSI1SK: "PROFILE",
  entityType: "RESET-TOKEN",
  userId: "user-uuid",
  token: "hashed_reset_token",
  expiresAt: "ISO8601 (1 hour from creation)",
  used: false
}
```

## 4. Frontend Changes

### 4.1 New Components
| Component | Path | Purpose |
|-----------|------|---------|
| ForgotPasswordPage.tsx | `apps/web/src/pages/ForgotPasswordPage.tsx` | Request reset form |
| ResetPasswordPage.tsx | `apps/web/src/pages/ResetPasswordPage.tsx` | Reset password form |

### 4.2 Test Hooks for QA
```typescript
<form data-testid="forgot-password-form">
  <input data-testid="forgot-email-input" />
  <button data-testid="forgot-submit-button" />
</form>

<form data-testid="reset-password-form">
  <input data-testid="reset-password-input" />
  <input data-testid="reset-confirm-password-input" />
  <button data-testid="reset-submit-button" />
</form>
```

## 5. Edge Scenarios & Test Cases

### 5.1 Manual Test Cases

**TC-01: Request Reset - Email Sent**
- **Steps:** Enter email → Submit → Verify confirmation message
- **Expected:** Email sent (simulated in dev)

**TC-02: Reset Password - Success**
- **Steps:** Click reset link → Enter new password → Submit → Verify redirect to login
- **Expected:** Password updated, can login with new password

**TC-03: Reset Password - Expired Token**
- **Steps:** Use 1-hour expired token → Verify error message
- **Expected:** Error "Reset token has expired"

### 5.2 Automation Test Notes for QA
QA team will create automation scripts using the test IDs from section 4.2. Key scenarios to cover:
- Password reset request flow
- Reset password with valid token
- Expired token error handling

## 6. Dependencies
- Story 1.1: User Registration (user table)
- Email service (simulated in dev, SES in prod)

## 7. Security Considerations
- Token expiry (1 hour)
- Token hashing (store hash, not plain token)
- Rate limiting (5 req/min)
- Generic response (prevent enumeration)

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/routes/auth.ts` | MODIFY | Add forgot/reset endpoints |
| `apps/api/src/services/password-reset.service.ts` | CREATE | Reset logic |
| `apps/web/src/pages/ForgotPasswordPage.tsx` | CREATE | Request form |
| `apps/web/src/pages/ResetPasswordPage.tsx` | CREATE | Reset form |
| `tests/e2e/password-reset.spec.ts` | CREATE | E2E tests |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
