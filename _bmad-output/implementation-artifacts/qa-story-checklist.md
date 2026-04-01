# QA-Enabled Story Creation - Quality Checklist

## Template Validation

Use this checklist to validate stories created with the QA-enabled template.

### Meta Header (Required)
- [ ] `story_number` populated (e.g., "1.2")
- [ ] `story_key` populated (e.g., "1-2-user-auth")
- [ ] `story_name` populated (e.g., "User Authentication")
- [ ] `status` set to "ready-for-dev"
- [ ] `created_date` populated with ISO date
- [ ] `last_updated` populated with ISO date

### Section 1: Description
- [ ] User story statement follows "As a... I want... So that..." format
- [ ] Business context explains why this story matters
- [ ] Technical overview provides high-level approach

### Section 2: Acceptance Criteria
- [ ] Functional requirements in BDD format (Given/When/Then)
- [ ] Priority assigned (Must Have / Should Have / Could Have)
- [ ] Testable flag set for each criterion
- [ ] Non-functional requirements defined (performance, security, accessibility)

### Section 3: Backend API Changes
- [ ] All endpoints documented with method and purpose
- [ ] Request headers specified (Content-Type, Authorization)
- [ ] Request body schema with field types and validation rules
- [ ] Response schema for success case (2xx)
- [ ] Error response schemas (4xx, 5xx) with handling instructions
- [ ] Database changes documented (CREATE/ALTER statements)
- [ ] Service layer changes identified
- [ ] API test case examples provided

### Section 4: Frontend Changes
- [ ] New components listed with file paths and purposes
- [ ] Modified components identified with change descriptions
- [ ] State management updates documented (Redux/Zustand slices)
- [ ] API integration hooks defined (React Query, axios calls)
- [ ] UI/UX specifications complete (layout, styling, responsive)
- [ ] Routing changes documented with route guards
- [ ] **data-testid attributes provided for automation**

### Section 5: Edge Scenarios & Test Cases
- [ ] Minimum 5 edge cases documented with scenarios and expected behavior
- [ ] Validation scenarios matrix with field-level rules
- [ ] Manual test cases with clear steps and pass/fail criteria
- [ ] Automation test script structure provided (Playwright/Jest examples)
- [ ] Performance test scenarios with SLAs defined

### Section 6: Dependencies
- [ ] Internal dependencies listed (prerequisite stories, components)
- [ ] External dependencies documented (npm packages, APIs, tools)
- [ ] Version numbers specified for all dependencies

### Section 7: Security Considerations
- [ ] Authentication requirements defined
- [ ] Authorization rules documented (RBAC)
- [ ] Data protection requirements (encryption, masking)
- [ ] Input sanitization requirements (XSS, SQL injection prevention)
- [ ] Rate limiting rules specified

### Section 8: Deployment & Rollback
- [ ] Migration steps documented (commands, order)
- [ ] Feature flags configured (if applicable)
- [ ] Rollback triggers defined
- [ ] Rollback steps documented
- [ ] Data recovery procedure outlined

### Section 9: Dev Agent Record
- [ ] Agent model documented
- [ ] Files created/modified table populated
- [ ] Implementation notes section available
- [ ] Code review checklist included

### Section 10: QA Sign-Off
- [ ] QA Engineer approval section present
- [ ] Dev Lead approval section present
- [ ] Product Owner approval section present

### Section 11: References
- [ ] Architecture document referenced
- [ ] UX design referenced
- [ ] Related stories linked
- [ ] External resources (Figma, Jira) linked

---

## QA Readiness Assessment

**Green Light (Ready for Parallel Work):**
- ✅ All sections 1-8 complete
- ✅ API specs have full request/response examples
- ✅ Frontend components have data-testid attributes
- ✅ Minimum 5 edge cases documented
- ✅ Manual test cases have clear pass/fail criteria
- ✅ Automation test hooks provided

**Yellow Light (Needs Work):**
- ⚠️ Some sections have TODO placeholders
- ⚠️ API specs missing error response examples
- ⚠️ Fewer than 5 edge cases
- ⚠️ Test IDs not provided for all interactive elements

**Red Light (Not Ready):**
- ❌ Critical sections empty (3, 4, or 5)
- ❌ No API request/response examples
- ❌ No test cases or edge scenarios
- ❌ No automation hooks provided

---

## Usage

Run this checklist when:
1. Story is first created (automated validation in workflow step 7)
2. Before starting development (dev team review)
3. Before writing test cases (QA team review)
4. During sprint refinement (continuous improvement)

**Note:** This checklist validates the **structure**. Content quality should be reviewed by Dev Lead and QA Engineer during story refinement.
