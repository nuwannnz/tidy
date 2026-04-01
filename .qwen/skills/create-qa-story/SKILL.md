---
name: create-qa-story
description: Creates a user story with strict QA-enabled template including API specs, frontend changes, edge scenarios, and test hooks for parallel QA/dev work.
---

# Create QA-Enabled User Story

## Overview

This skill creates comprehensive user stories using a **project-specific strict template** that enables parallel QA and development work. Stories include detailed API specifications, frontend component requirements, edge cases, and automation-ready test hooks.

**Key Features:**
- Uses custom template at `_bmad-output/implementation-artifacts/story-template.md` (persists across BMad upgrades)
- Meta header with story number, name, status, created date, and **last updated** date
- Detailed backend API specs with request/response examples for API test writing
- Frontend component requirements with `data-testid` attributes for automation
- Edge scenario matrix with test status tracking
- Manual test cases in QA-ready format
- Automation test script structure examples
- QA sign-off section for approval tracking

## On Activation

1. **Load configuration** via bmad-init skill
   - Store `{user_name}`, `{communication_language}`, `{document_output_language}`
   - Store `{implementation_artifacts}`, `{planning_artifacts}`

2. **Verify custom template exists**
   <check if="template file does not exist">
     <output>🚫 Custom story template not found!</output>
     <output>Expected location: `_bmad-output/implementation-artifacts/story-template.md`</output>
     <output>This template should be created during BMad setup for your project.</output>
     <action>HALT - Template required</action>
   </check>

3. **Load custom workflow**
   - Load: `_bmad-output/implementation-artifacts/create-story-qa-enabled-workflow.md`
   - Execute workflow steps to create story

4. **Greet user** in `{communication_language}` using `{user_name}`

5. **Present story creation options:**
   - Auto-discover next backlog story from sprint status
   - Create specific story by number (e.g., "1-2-user-auth")
   - Review existing story template structure

## Usage

### Automatic (Next Story)
```
/create-qa-story
```
Automatically finds the first backlog story in sprint-status.yaml and creates it.

### Manual (Specific Story)
```
/create-qa-story 1-2-user-authentication
```
Creates the specified story by epic-story number.

### Review Template
```
/create-qa-story --show-template
```
Displays the custom template structure for reference.

## Output Location

Stories are created in: `_bmad-output/implementation-artifacts/stories/{story-key}.md`

## Template Persistence

This skill uses a **project-specific template** that persists across BMad upgrades:
- **Template:** `_bmad-output/implementation-artifacts/story-template.md`
- **Workflow:** `_bmad-output/implementation-artifacts/create-story-qa-enabled-workflow.md`

To modify the template for your project needs, edit the template file directly. The skill will use your customizations.

## QA Parallel Work Features

### For QA Engineers:
- **Section 3 (Backend API Changes):** Write API tests before backend is complete
- **Section 4.6 (Frontend Test Hooks):** Use `data-testid` attributes for automation scripts
- **Section 5.1 (Edge Scenarios):** Ensure all edge cases are covered in test plans
- **Section 5.3 (Manual Test Cases):** Execute ready-to-run manual test cases
- **Section 5.4 (Automation Scripts):** Extend provided Playwright/Jest examples
- **Section 10 (QA Sign-Off):** Formal approval tracking

### For Developers:
- **Section 3.2-3.3:** Exact API contracts to implement
- **Section 4.1-4.5:** Component structure and state management requirements
- **Section 7:** Security requirements to implement
- **Section 9:** Implementation record template

## Integration with BMad

This skill integrates with the BMad ecosystem:
- Reads from: `sprint-status.yaml`, `epics.md`, `architecture.md`, `ux-design.md`
- Updates: `sprint-status.yaml` (marks story as ready-for-dev)
- Compatible with: `dev-story`, `code-review`, `bmad-tea-automate`

## Version

- **Template Version:** 1.0.0 (QA-Enabled)
- **Created:** 2026-04-01
- **Last Updated:** [Track in template file]
