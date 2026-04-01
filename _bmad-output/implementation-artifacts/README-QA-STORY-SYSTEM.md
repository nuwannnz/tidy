# Custom QA-Enabled Story Creation System

## Summary

A custom user story creation system that enables **parallel QA and development work** through comprehensive story specifications. This system uses project-specific templates that persist across BMad upgrades.

---

## Files Created

### 1. Custom Story Template
**Path:** `_bmad-output/implementation-artifacts/story-template.md`

**Purpose:** Strict template with 11 sections for comprehensive story specifications.

**Key Features:**
- Meta header with `last_updated` field for QA change tracking
- Backend API specs with full request/response examples
- Frontend component requirements with `data-testid` attributes
- Edge scenario matrix with test status tracking
- Manual test cases in QA-ready format
- Automation test script examples (Playwright/Jest)
- QA sign-off section for formal approval

**Sections:**
1. Description (user story, business context, technical overview)
2. Acceptance Criteria (functional & non-functional)
3. Backend API Changes (endpoints, requests, responses, database, services)
4. Frontend Changes (components, state, UI/UX, routing, test hooks)
5. Edge Scenarios & Test Cases (edge cases, validation, manual tests, automation)
6. Dependencies (internal & external)
7. Security Considerations (auth, data protection, OWASP)
8. Deployment & Rollback (migration, feature flags, rollback plan)
9. Dev Agent Record (files, implementation notes, code review)
10. QA Sign-Off (approval tracking)
11. References

---

### 2. Custom Workflow
**Path:** `_bmad-output/implementation-artifacts/create-story-qa-enabled-workflow.md`

**Purpose:** Workflow logic that populates the custom template.

**Key Steps:**
1. Determine target story (auto-discover or manual)
2. Load and analyze core artifacts (epics, architecture, UX)
3. Extract API requirements for QA test planning
4. Extract UX requirements for frontend specs
5. Research latest technical specifics
6. Create story using **custom template** (not BMad default)
7. Validate against QA checklist and update sprint status

---

### 3. Custom Skill
**Path:** `.qwen/skills/create-qa-story/SKILL.md`

**Purpose:** Skill definition for creating QA-enabled stories.

**Commands:**
- `/create-qa-story` - Auto-discover next backlog story
- `/create-qa-story 1-2-user-auth` - Create specific story
- `/create-qa-story --show-template` - Review template structure

**Integration:**
- Reads config via `bmad-init`
- Uses project-specific template and workflow
- Compatible with `dev-story`, `code-review`, `bmad-tea-automate`

---

### 4. Quality Checklist
**Path:** `_bmad-output/implementation-artifacts/qa-story-checklist.md`

**Purpose:** Validate story completeness and QA readiness.

**Validation Areas:**
- Meta header completeness
- All 11 sections populated
- API specs with full examples
- Frontend test hooks provided
- Minimum 5 edge cases
- Manual test cases ready
- Security requirements documented
- QA sign-off section present

**Readiness Levels:**
- 🟢 Green Light: Ready for parallel work
- 🟡 Yellow Light: Needs work
- 🔴 Red Light: Not ready

---

### 5. Quick Start Guide
**Path:** `_bmad-output/implementation-artifacts/QA-STORY-QUICKSTART.md`

**Purpose:** User guide for QA and dev teams.

**Contents:**
- Overview of QA-enabled vs traditional stories
- Quick start instructions
- Template structure reference
- File locations
- QA workflow
- Dev workflow
- Customization guide
- Best practices
- Troubleshooting

---

### 6. Scrum Master Integration
**Path:** `.qwen/skills/bmad-agent-sm/SKILL.md` (updated)

**Changes:**
- Added **CQ** capability code for `create-qa-story`
- Recommended CQ over CS for new projects
- Maintains backward compatibility with standard story creation

---

## How to Use

### For Scrum Master / Project Manager

1. Activate Scrum Master:
   ```
   /bmad-agent-sm
   ```

2. Choose **CQ** (Create QA-Enabled Story):
   ```
   CQ
   ```

3. Story is auto-generated with all QA enablement features

### For QA Engineers

**When story is created:**
1. Review story file in `_bmad-output/implementation-artifacts/`
2. Validate using `qa-story-checklist.md`
3. Write API tests from Section 3 specifications
4. Create automation scripts using Section 4.6 test IDs
5. Plan manual test execution from Section 5.3

**When story changes:**
1. Developer updates `last_updated` in meta header
2. Update test cases accordingly
3. Track changes in QA sign-off section

### For Developers

**When implementing:**
1. Follow API specs from Section 3
2. Build components from Section 4
3. Add `data-testid` attributes as specified
4. Document implementation in Section 9
5. Complete code review checklist

---

## Benefits

### Parallel Work Enablement

**Before (Sequential):**
```
Story Created → Dev Implements → QA Writes Tests → QA Tests
```

**After (Parallel):**
```
Story Created
    ├─→ Dev Implements ──┐
    └─→ QA Writes Tests ─┴─→ QA Tests
```

### QA Benefits
- ✅ Write API tests before backend exists
- ✅ Create automation scripts with test IDs upfront
- ✅ Plan manual tests from detailed scenarios
- ✅ Track test status in edge case matrix
- ✅ Formal sign-off process

### Dev Benefits
- ✅ Clear API contracts to implement
- ✅ Component structure specified
- ✅ Security requirements explicit
- ✅ Test expectations clear
- ✅ Less rework from missed requirements

### Business Benefits
- ✅ Faster time to market (parallel work)
- ✅ Higher quality (comprehensive requirements)
- ✅ Better traceability (meta header tracking)
- ✅ Reduced defects (edge cases documented)

---

## Upgrade Persistence

**Critical:** This system uses **project-specific files** that persist across BMad upgrades:

| File | Location | Upgrade Safe? |
|------|----------|---------------|
| Template | `_bmad-output/implementation-artifacts/` | ✅ Yes |
| Workflow | `_bmad-output/implementation-artifacts/` | ✅ Yes |
| Skill | `.qwen/skills/` | ✅ Yes |
| Checklist | `_bmad-output/implementation-artifacts/` | ✅ Yes |
| Quickstart | `_bmad-output/implementation-artifacts/` | ✅ Yes |

**To customize:** Edit files directly in these locations. They will NOT be overwritten by BMad updates.

---

## Template Example (Meta Header)

```yaml
---
story_number: "1.2"
story_key: "1-2-user-auth"
story_name: "User Authentication"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"  # QA updates this when story changes
---
```

---

## Next Steps

1. **Test the system:**
   ```
   /bmad-agent-sm
   CQ
   ```

2. **Customize the template** for your project needs:
   - Edit: `_bmad-output/implementation-artifacts/story-template.md`

3. **Train your team:**
   - Share `QA-STORY-QUICKSTART.md` with QA and dev teams
   - Review the checklist during story refinement

4. **Integrate with your workflow:**
   - Use for all new stories
   - Migrate existing stories as needed

---

## Support Files

All support documentation is in:
- `_bmad-output/implementation-artifacts/` - Templates, workflows, guides
- `.qwen/skills/create-qa-story/` - Skill definition
- `.qwen/skills/bmad-agent-sm/` - Scrum master integration

---

**Version:** 1.0.0  
**Created:** 2026-04-01  
**System:** QA-Enabled Story Creation for BMad Method
