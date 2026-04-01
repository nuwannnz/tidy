---
story_number: "1.5"
story_key: "1-5-jwt-session-management"
story_name: "JWT Session Management"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"
---

# Story 1.5: JWT Session Management

> **QA Note:** This story enables parallel test case development.

## 1. Description

### 1.1 User Story Statement
As a logged-in user,
I want my session to be securely managed with JWT tokens,
so that I can use the app without being logged out unexpectedly.

### 1.2 Business Context
Seamless session management is critical for user experience. Users should stay logged in during active use while maintaining security.

### 1.3 Technical Overview
- **Access Token:** 15-minute expiry, used for API requests
- **Refresh Token:** 7-day expiry, used to obtain new access tokens
- **Storage:** httpOnly cookies (XSS protection)
- **Auto-refresh:** Transparent token refresh before expiry

## 2. Acceptance Criteria

### 2.1 Functional Requirements
| ID | Criterion | Priority | Testable |
|----|-----------|----------|----------|
| AC-1 | Given access token expires (15 min), when I make API request, then token is auto-refreshed | Must Have | Yes |
| AC-2 | Given refresh token expires (7 days), when I make API request, then I am redirected to login | Must Have | Yes |
| AC-3 | Given I am logged in, when I inspect cookies, then tokens are httpOnly | Must Have | Yes |
| AC-4 | Given I make API request, when token is invalid, then I receive 401 | Must Have | Yes |

## 3. Backend API Changes

### 3.1 Endpoints
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/v1/auth/refresh` | POST | Refresh access token | Refresh Token |
| `/api/v1/auth/verify` | GET | Verify token validity | Bearer Token |

### 3.2 Token Structure
```typescript
// Access Token (15 min)
{
  userId: "uuid",
  email: "user@example.com",
  type: "access",
  exp: 1680000900 // 15 minutes
}

// Refresh Token (7 days)
{
  userId: "uuid",
  type: "refresh",
  exp: 1680604800 // 7 days
}
```

## 4. Frontend Changes

### 4.1 Modified Components
| Component | Path | Changes |
|-----------|------|---------|
| `apiClient.ts` | `apps/web/src/lib/apiClient.ts` | Auto-refresh logic |
| `authSlice.ts` | `apps/web/src/store/authSlice.ts` | Token refresh action |

### 4.2 Auto-Refresh Logic
```typescript
// Intercept 401 responses
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Try refresh
      await refreshToken();
      // Retry original request
      return apiClient.request(originalRequest);
    }
  }
);
```

### 4.3 API Test Considerations for QA
QA team will create API tests based on the endpoint specifications above. Key test areas:
- Token refresh with valid refresh token
- Expired refresh token handling
- Token verification endpoint

## 5. Edge Scenarios & Test Cases

### 5.1 Manual Test Cases

**TC-01: Auto-Refresh - Success**
- **Steps:** Login → Wait 15 min → Make API request → Verify success
- **Expected:** Token auto-refreshed, request succeeds

**TC-02: Refresh Token Expired**
- **Steps:** Wait 7 days → Make API request → Verify redirect to login
- **Expected:** 401, redirect to login

**TC-03: Invalid Token**
- **Steps:** Tamper token → Make API request → Verify 401
- **Expected:** Token rejected

### 5.2 Automation Test Notes for QA
QA team will create automation scripts. Key scenarios to cover:
- Auto-refresh token flow
- Refresh token expiry redirect
- Invalid token rejection

## 6. Dependencies
- Story 1.2: User Login (JWT tokens)

## 7. Security Considerations
- httpOnly cookies (XSS protection)
- Token expiry (15 min / 7 days)
- Token blacklisting on logout
- Secure cookie flags (SameSite, Secure, HttpOnly)

## 9. Dev Agent Record

### Files Created/Modified
| Path | Action | Purpose |
|------|--------|---------|
| `apps/api/src/services/token.service.ts` | MODIFY | Add refresh/verify methods |
| `apps/web/src/lib/apiClient.ts` | CREATE | Auto-refresh interceptor |
| `tests/api/session-management.spec.ts` | CREATE | API tests |

## 10. QA Sign-Off

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| QA Engineer | _________ | _________ | [ ] Approved [ ] Rejected | |
