# QA-Enabled Story Creation - Quick Start Guide

## Overview

This guide explains how to use the **QA-Enabled Story Creation** system for parallel QA and development work.

## What's Different?

### Traditional BMad Stories
- Basic template with user story and acceptance criteria
- Limited technical specifications
- QA must wait for development to understand implementation
- Test cases written after code is complete

### QA-Enabled Stories (New)
- **Strict template** with 11 comprehensive sections
- **Detailed API specs** with request/response examples
- **Frontend component requirements** with automation test IDs
- **Edge scenario matrix** with test status tracking
- **Manual test cases** in ready-to-execute format
- **Automation script examples** (Playwright/Jest)
- **QA sign-off section** for approval tracking
- **Meta header** with `last_updated` for change tracking

## Quick Start

### Step 1: Activate Scrum Master

```
/bmad-agent-sm
```

Bob will greet you and present capabilities including:
- **SP** - Sprint Planning
- **CS** - Create Story (standard BMad)
- **CQ** - Create QA-Enabled Story ⭐ **Recommended**
- **ER** - Epic Retrospective
- **CC** - Correct Course

### Step 2: Choose Story Creation Method

#### Option A: QA-Enabled Story (Recommended)
```
CQ
```
Creates a comprehensive story with full QA enablement.

#### Option B: Standard BMad Story
```
CS
```
Creates a basic story using BMad's default template.

### Step 3: Story is Auto-Generated

The system will:
1. Find the next backlog story from `sprint-status.yaml`
2. Analyze epics, architecture, and UX documents
3. Populate the **QA-Enabled template** with all details
4. Create the story file in `_bmad-output/implementation-artifacts/`
5. Update sprint status to "ready-for-dev"

### Step 4: Parallel Work Begins

**QA Team Can Immediately:**
- Write API tests from Section 3 specifications
- Create automation scripts using Section 4.6 test IDs
- Plan manual test execution from Section 5.3
- Review edge scenarios in Section 5.1

**Dev Team Can:**
- Implement backend APIs from Section 3 contracts
- Build frontend components from Section 4 specs
- Follow security requirements from Section 7
- Reference architecture decisions

## Template Structure

```
---
story_number: "1.2"
story_key: "1-2-user-auth"
story_name: "User Authentication"
status: ready-for-dev
created_date: "2026-04-01"
last_updated: "2026-04-01"  ← QA updates this when story changes
---

# Story 1.2: User Authentication

## 1. Description
- User story statement
- Business context
- Technical overview

## 2. Acceptance Criteria
- Functional requirements (BDD format)
- Non-functional requirements

## 3. Backend API Changes          ← QA writes API tests from here
- Endpoint specifications
- Request/response schemas
- Error handling
- API test examples

## 4. Frontend Changes              ← QA uses test IDs for automation
- Component specifications
- State management
- UI/UX requirements
- Test hooks (data-testid)

## 5. Edge Scenarios & Test Cases  ← Manual and automation test foundation
- Edge case matrix
- Validation scenarios
- Manual test cases (ready to execute)
- Automation script examples
- Performance test SLAs

## 6. Dependencies
## 7. Security Considerations
## 8. Deployment & Rollback
## 9. Dev Agent Record
## 10. QA Sign-Off                 ← Formal approval tracking
## 11. References
```

## File Locations

| File | Purpose | Location |
|------|---------|----------|
| **Template** | Custom story template (persists across upgrades) | `_bmad-output/implementation-artifacts/story-template.md` |
| **Workflow** | Custom workflow logic | `_bmad-output/implementation-artifacts/create-story-qa-enabled-workflow.md` |
| **Stories** | Generated story files | `_bmad-output/implementation-artifacts/{story-key}.md` |
| **Checklist** | Quality validation | `_bmad-output/implementation-artifacts/qa-story-checklist.md` |
| **Skill** | Custom skill definition | `.qwen/skills/create-qa-story/SKILL.md` |

## QA Workflow

### When Story is Created
1. **Review** the story file in `_bmad-output/implementation-artifacts/`
2. **Validate** using the checklist (`qa-story-checklist.md`)
3. **Start API test development** from Section 3 specs
4. **Create automation scripts** using Section 4.6 test IDs
5. **Plan manual test execution** from Section 5.3

### When Story Changes
1. Developer updates the story file
2. **Update `last_updated`** in the meta header
3. Notify QA of changes
4. QA updates test cases accordingly

### When Testing is Complete
1. Fill in **Section 10 (QA Sign-Off)**
2. Update test status in Section 5.1 edge cases
3. Mark manual test cases as Pass/Fail in Section 5.3

## Dev Workflow

### When Story is Ready
1. **Review** Section 3 (API specs) for backend requirements
2. **Review** Section 4 (Frontend) for component structure
3. **Review** Section 7 (Security) for compliance requirements
4. Implement following the specifications
5. Add `data-testid` attributes as specified in Section 4.6

### When Implementation Complete
1. Fill in **Section 9 (Dev Agent Record)**
2. Complete the code review checklist
3. Run `code-review` skill
4. Notify QA for testing

## Customization

### Modify the Template
Edit: `_bmad-output/implementation-artifacts/story-template.md`

This is **your project-specific template** - it won't be overwritten by BMad upgrades.

### Modify the Workflow
Edit: `_bmad-output/implementation-artifacts/create-story-qa-enabled-workflow.md`

Customize the workflow logic for your team's needs.

### Update the Skill
Edit: `.qwen/skills/create-qa-story/SKILL.md`

Add custom commands or modify behavior.

## Best Practices

### For Product Owners
- ✅ Review stories before they reach "ready-for-dev"
- ✅ Ensure business context is clear in Section 1
- ✅ Participate in QA sign-off (Section 10)

### For Developers
- ✅ Follow API specs exactly as documented in Section 3
- ✅ Add all `data-testid` attributes from Section 4.6
- ✅ Update `last_updated` when story changes
- ✅ Document any deviations in Section 9

### For QA Engineers
- ✅ Start writing tests as soon as story is created
- ✅ Use the test IDs provided in Section 4.6
- ✅ Update test status in Section 5.1 as you work
- ✅ Complete QA sign-off in Section 10

## Troubleshooting

### "Custom template not found"
**Solution:** Ensure `_bmad-output/implementation-artifacts/story-template.md` exists. This file should be created during initial setup.

### "No backlog stories found"
**Solution:** Run sprint planning first (`SP`) or add more stories to the sprint.

### "Story missing sections"
**Solution:** Run the quality checklist (`qa-story-checklist.md`) and request story regeneration with missing details.

## Support

For questions about:
- **BMad Method:** Use `/bmad-help`
- **This Skill:** Edit the skill file or consult the workflow document
- **Template Changes:** Modify the project-specific template directly

---

**Version:** 1.0.0  
**Created:** 2026-04-01  
**Last Updated:** Track changes in template file header
