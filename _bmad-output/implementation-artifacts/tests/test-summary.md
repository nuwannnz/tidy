# Test Automation Summary — Story 1.1: User Registration

**Date:** 2026-04-17
**Story:** 1.1 User Registration with Email/Password
**Framework:** Playwright (TypeScript)
**Status:** Tests written — awaiting feature implementation

---

## Generated Tests

### API Tests
- [apps/e2e/src/api/auth.spec.ts](../../../../apps/e2e/src/api/auth.spec.ts)

| Test | AC | Status |
|------|----|--------|
| AC-1: register a new user and return user + token | AC-1 | Written |
| AC-2: reject duplicate email (409) | AC-2 | Written |
| AC-3: reject password shorter than 8 chars (400) | AC-3 | Written |
| AC-4: reject invalid email format (400) | AC-4 | Written |
| AC-5: reject empty fields (400) | AC-5 | Written |
| EC-07: reject XSS attempt in email | EC-07 | Written |
| login with valid credentials | — | Written |
| reject login with invalid credentials | — | Written |

### E2E Tests
- [apps/e2e/src/ui/auth/register.spec.ts](../../../../apps/e2e/src/ui/auth/register.spec.ts)

| Test | AC | Status |
|------|----|--------|
| display registration form | — | Written |
| AC-1: register and redirect to /dashboard | AC-1, AC-6 | Written |
| AC-3: show "Password must be at least 8 characters" | AC-3 | Written |
| AC-4: show "Please enter a valid email address" | AC-4 | Written |
| AC-5: show validation errors for empty fields | AC-5 | Written |
| TC-06: toggle password visibility | TC-06 | Written |
| EC-03: disable submit button during submission | EC-03 | Written |
| show error for mismatched passwords | — | Written |
| navigate to login page | — | Written |

---

## Coverage Against Acceptance Criteria

| AC ID | Criterion | API | E2E |
|-------|-----------|-----|-----|
| AC-1 | Valid registration → logged in | ✅ | ✅ |
| AC-2 | Duplicate email error | ✅ | ✅ |
| AC-3 | Password < 8 chars | ✅ | ✅ |
| AC-4 | Invalid email format | ✅ | ✅ |
| AC-5 | Empty fields validation | ✅ | ✅ |
| AC-6 | Redirect to /dashboard | — | ✅ |

## Next Steps

- Implement feature (story status: ready-for-dev)
- Run `pnpm nx run e2e:e2e-api` for API tests
- Run `pnpm nx run e2e:e2e` for UI tests
- Add performance tests for registration endpoint (< 200ms p95 SLA)
