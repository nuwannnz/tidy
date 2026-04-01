# Custom Create Story Workflow (QA-Enabled)

**Goal:** Create a comprehensive story file using the strict project-specific template that enables parallel QA and development work.

**Your Role:** Story context engine that prevents LLM developer mistakes and provides QA with everything needed to write test cases in parallel.

**Key Principles:**
- Use the **project-specific template** at `_bmad-output/implementation-artifacts/story-template.md`
- Populate ALL sections thoroughly - QA depends on this for test planning
- Include explicit test IDs, API specs, and edge cases for automation
- Never skip sections - even if "N/A", document why
- Think like both a developer AND a QA engineer

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `user_skill_level`
- `planning_artifacts`, `implementation_artifacts`
- `date` as system-generated current datetime

### Paths

- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `epics_file` = `{planning_artifacts}/epics.md`
- `prd_file` = `{planning_artifacts}/prd.md`
- `architecture_file` = `{planning_artifacts}/architecture.md`
- `ux_file` = `{planning_artifacts}/*ux*.md`
- `project_context` = `**/project-context.md` (load if exists)
- `custom_template` = `{implementation_artifacts}/story-template.md` **(USE THIS, NOT default)**
- `default_output_file` = `{implementation_artifacts}/stories/{{story_key}}.md`

### Input Files

| Input | Description | Path Pattern(s) | Load Strategy |
|-------|-------------|------------------|---------------|
| prd | PRD (fallback - epics file should have most content) | whole: `{planning_artifacts}/*prd*.md`, sharded: `{planning_artifacts}/*prd*/*.md` | SELECTIVE_LOAD |
| architecture | Architecture (fallback - epics file should have relevant sections) | whole: `{planning_artifacts}/*architecture*.md`, sharded: `{planning_artifacts}/*architecture*/*.md` | SELECTIVE_LOAD |
| ux | UX design (fallback - epics file should have relevant sections) | whole: `{planning_artifacts}/*ux*.md`, sharded: `{planning_artifacts}/*ux*/*.md` | SELECTIVE_LOAD |
| epics | Enhanced epics+stories file with BDD and source hints | whole: `{planning_artifacts}/*epic*.md`, sharded: `{planning_artifacts}/*epic*/*.md` | SELECTIVE_LOAD |

---

## EXECUTION

<workflow>

<step n="1" goal="Determine target story">
  <check if="{{story_path}} is provided by user or user provided the epic and story number such as 2-4 or 1.6 or epic 1 story 5">
    <action>Parse user-provided story path: extract epic_num, story_num, story_title from format like "1-2-user-auth"</action>
    <action>Set {{epic_num}}, {{story_num}}, {{story_key}} from user input</action>
    <action>GOTO step 2a</action>
  </check>

  <action>Check if {{sprint_status}} file exists for auto discover</action>
  <check if="sprint status file does NOT exist">
    <output>🚫 No sprint status file found and no story specified</output>
    <output>
      **Required Options:**
      1. Run `sprint-planning` to initialize sprint tracking (recommended)
      2. Provide specific epic-story number to create (e.g., "1-2-user-auth")
      3. Provide path to story documents if sprint status doesn't exist yet
    </output>
    <ask>Choose option [1], provide epic-story number, path to story docs, or [q] to quit:</ask>

    <check if="user chooses 'q'">
      <action>HALT - No work needed</action>
    </check>

    <check if="user chooses '1'">
      <output>Run sprint-planning workflow first to create sprint-status.yaml</output>
      <action>HALT - User needs to run sprint-planning</action>
    </check>

    <check if="user provides epic-story number">
      <action>Parse user input: extract epic_num, story_num, story_title</action>
      <action>Set {{epic_num}}, {{story_num}}, {{story_key}} from user input</action>
      <action>GOTO step 2a</action>
    </check>

    <check if="user provides story docs path">
      <action>Use user-provided path for story documents</action>
      <action>GOTO step 2a</action>
    </check>
  </check>

  <!-- Auto-discover from sprint status -->
  <check if="no user input provided">
    <critical>MUST read COMPLETE {sprint_status} file from start to end to preserve order</critical>
    <action>Load the FULL file: {{sprint_status}}</action>
    <action>Read ALL lines from beginning to end - do not skip any content</action>
    <action>Parse the development_status section completely</action>

    <action>Find the FIRST story (by reading in order from top to bottom) where:
      - Key matches pattern: number-number-name (e.g., "1-2-user-auth")
      - NOT an epic key (epic-X) or retrospective (epic-X-retrospective)
      - Status value equals "backlog"
    </action>

    <check if="no backlog story found">
      <output>📋 No backlog stories found in sprint-status.yaml

        All stories are either already created, in progress, or done.

        **Options:**
        1. Run sprint-planning to refresh story tracking
        2. Load PM agent and run correct-course to add more stories
        3. Check if current sprint is complete and run retrospective
      </output>
      <action>HALT</action>
    </check>

    <action>Extract from found story key (e.g., "1-2-user-authentication"):
      - epic_num: first number before dash (e.g., "1")
      - story_num: second number after first dash (e.g., "2")
      - story_title: remainder after second dash (e.g., "user-authentication")
    </action>
    <action>Set {{story_id}} = "{{epic_num}}.{{story_num}}"</action>
    <action>Store story_key for later use (e.g., "1-2-user-authentication")</action>

    <!-- Mark epic as in-progress if this is first story -->
    <action>Check if this is the first story in epic {{epic_num}} by looking for {{epic_num}}-1-* pattern</action>
    <check if="this is first story in epic {{epic_num}}">
      <action>Load {{sprint_status}} and check epic-{{epic_num}} status</action>
      <action>If epic status is "backlog" → update to "in-progress"</action>
      <action>If epic status is "contexted" (legacy status) → update to "in-progress" (backward compatibility)</action>
      <action>If epic status is "in-progress" → no change needed</action>
      <check if="epic status is 'done'">
        <output>🚫 ERROR: Cannot create story in completed epic</output>
        <output>Epic {{epic_num}} is marked as 'done'. All stories are complete.</output>
        <output>If you need to add more work, either:</output>
        <output>1. Manually change epic status back to 'in-progress' in sprint-status.yaml</output>
        <output>2. Create a new epic for additional work</output>
        <action>HALT - Cannot proceed</action>
      </check>
      <check if="epic status is not one of: backlog, contexted, in-progress, done">
        <output>🚫 ERROR: Invalid epic status '{{epic_status}}'</output>
        <output>Epic {{epic_num}} has invalid status. Expected: backlog, in-progress, or done</output>
        <output>Please fix sprint-status.yaml manually or run sprint-planning to regenerate</output>
        <action>HALT - Cannot proceed</action>
      </check>
      <output>📊 Epic {{epic_num}} status updated to in-progress</output>
    </check>

    <action>GOTO step 2a</action>
  </check>
</step>

<step n="2" goal="Load and analyze core artifacts">
  <critical>🔬 EXHAUSTIVE ARTIFACT ANALYSIS - Extract everything for BOTH Dev and QA!</critical>

  <action>Read fully and follow `./discover-inputs.md` to load all input files</action>
  <note>Available content: {epics_content}, {prd_content}, {architecture_content}, {ux_content},
  {project_context}</note>

  <!-- Analyze epics file for story foundation -->
  <action>From {epics_content}, extract Epic {{epic_num}} complete context:</action>
  **EPIC ANALYSIS:**
  - Epic objectives and business value
  - ALL stories in this epic for cross-story context
  - Our specific story's requirements, user story statement, acceptance criteria
  - Technical requirements and constraints
  - Dependencies on other stories/epics
  - Source hints pointing to original documents

  <!-- Extract specific story requirements -->
  <action>Extract our story ({{epic_num}}-{{story_num}}) details:</action>
  **STORY FOUNDATION:**
  - User story statement (As a, I want, so that)
  - Detailed acceptance criteria (already BDD formatted)
  - Technical requirements specific to this story
  - Business context and value
  - Success criteria

  <!-- Previous story analysis for context continuity -->
  <check if="story_num > 1">
    <action>Find {{previous_story_num}}: scan {implementation_artifacts}/stories for the story file in epic {{epic_num}} with the highest story number less than {{story_num}}</action>
    <action>Load previous story file: {implementation_artifacts}/stories/{{epic_num}}-{{previous_story_num}}-*.md</action>
    **PREVIOUS STORY INTELLIGENCE:**
    - Dev notes and learnings from previous story
    - Review feedback and corrections needed
    - Files that were created/modified and their patterns
    - Testing approaches that worked/didn't work
    - Problems encountered and solutions found
    - Code patterns established
    <action>Extract all learnings that could impact current story implementation</action>
  </check>

  <!-- Git intelligence for previous work patterns -->
  <check if="previous story exists AND git repository detected">
    <action>Get last 5 commit titles to understand recent work patterns</action>
    <action>Analyze 1-5 most recent commits for relevance to current story:
      - Files created/modified
      - Code patterns and conventions used
      - Library dependencies added/changed
      - Architecture decisions implemented
      - Testing approaches used
    </action>
    <action>Extract actionable insights for current story implementation</action>
  </check>
</step>

<step n="3" goal="Architecture analysis for developer guardrails">
  <critical>🏗️ ARCHITECTURE INTELLIGENCE - Extract everything the developer MUST follow AND QA can test against!</critical>
  **ARCHITECTURE DOCUMENT ANALYSIS:**
  <action>Systematically analyze architecture content for story-relevant requirements:</action>

  <!-- Load architecture - single file or sharded -->
  <check if="architecture file is single file">
    <action>Load complete {architecture_content}</action>
  </check>
  <check if="architecture is sharded to folder">
    <action>Load architecture index and scan all architecture files</action>
  </check>

  **CRITICAL ARCHITECTURE EXTRACTION:**
  <action>For each architecture section, determine if relevant to this story:</action>
  - **Technical Stack:** Languages, frameworks, libraries with versions → QA needs this for test environment setup
  - **Code Structure:** Folder organization, naming conventions, file patterns
  - **API Patterns:** Service structure, endpoint patterns, data contracts → QA needs this for API test planning
  - **Database Schemas:** Tables, relationships, constraints → QA needs this for data validation tests
  - **Security Requirements:** Authentication patterns, authorization rules → QA needs this for security testing
  - **Performance Requirements:** Caching strategies, optimization patterns → QA needs this for performance test SLAs
  - **Testing Standards:** Testing frameworks, coverage expectations, test patterns
  - **Deployment Patterns:** Environment configurations, build processes
  - **Integration Patterns:** External service integrations, data flows

  <action>Extract any story-specific requirements that the developer MUST follow</action>
  <action>Identify any architectural decisions that override previous patterns</action>
  <action>Extract performance benchmarks and security requirements for QA validation</action>
</step>

<step n="4" goal="UX analysis for frontend requirements">
  <critical>🎨 UX INTELLIGENCE - Extract frontend requirements for dev AND UI test validation!</critical>

  <check if="UX file exists">
    <action>Load complete {ux_content}</action>
    **UX ANALYSIS FOR STORY:**
    <action>Extract for current story:</action>
    - Component layouts and structures
    - User interaction flows
    - Responsive design requirements
    - Accessibility requirements (WCAG level)
    - Animation/transition specifications
    - Color schemes, typography, spacing tokens
    - Mobile/tablet/desktop breakpoints
    - Form validation UI patterns
    - Error state designs
    - Loading state designs (skeletons, spinners)
    <action>Map UX specs to template section 4.4 (UI/UX Specifications)</action>
  </check>
</step>

<step n="5" goal="Web research for latest technical specifics">
  <critical>🌐 ENSURE LATEST TECH KNOWLEDGE - Prevent outdated implementations!</critical>
  **WEB INTELLIGENCE:**
  <action>Identify specific technical areas that require latest version knowledge:</action>

  <!-- Check for libraries/frameworks mentioned in architecture -->
  <action>From architecture analysis, identify specific libraries, APIs, or frameworks</action>
  <action>For each critical technology, research latest stable version and key changes:
    - Latest API documentation and breaking changes
    - Security vulnerabilities or updates
    - Performance improvements or deprecations
    - Best practices for current version
  </action>

  **EXTERNAL CONTEXT INCLUSION:**
  <action>Include in story any critical latest information the developer needs:
    - Specific library versions and why chosen
    - API endpoints with parameters and authentication
    - Recent security patches or considerations
    - Performance optimization techniques
    - Migration considerations if upgrading
  </action>
</step>

<step n="6" goal="Create comprehensive story file using CUSTOM template">
  <critical>📝 CREATE ULTIMATE STORY FILE - Using PROJECT-SPECIFIC TEMPLATE for QA parallel work!</critical>

  <action>Load custom template from: {{custom_template}}</action>
  <action>Initialize story file from custom template (NOT default BMad template)</action>

  <!-- Story foundation from epics analysis -->
  <template-output file="{default_output_file}">story_header_with_meta</template-output>
  <template-output file="{default_output_file}">section_1_description</template-output>
  <template-output file="{default_output_file}">section_2_acceptance_criteria</template-output>
  <template-output file="{default_output_file}">section_3_backend_api_changes</template-output>
  <template-output file="{default_output_file}">section_4_frontend_changes</template-output>
  <template-output file="{default_output_file}">section_5_edge_scenarios_test_cases</template-output>
  <template-output file="{default_output_file}">section_6_dependencies</template-output>
  <template-output file="{default_output_file}">section_7_security_considerations</template-output>
  <template-output file="{default_output_file}">section_8_deployment_rollback</template-output>
  <template-output file="{default_output_file}">section_9_dev_agent_record</template-output>
  <template-output file="{default_output_file}">section_10_qa_signoff</template-output>
  <template-output file="{default_output_file}">section_11_references</template-output>

  **CRITICAL: Populate ALL sections - QA depends on this!**
  <action>For section 3 (Backend API Changes):
    - Define ALL endpoints with full request/response schemas
    - Include validation rules for each field
    - Document ALL error codes and handling
    - Provide API test case examples (QA will extend these)
  </action>
  <action>For section 4 (Frontend Changes):
    - List ALL new/modified components with paths
    - Define state management changes
    - Include UI/UX specs from UX analysis
    - Add data-testid attributes for automation
    - Provide component test selector examples
  </action>
  <action>For section 5 (Edge Scenarios & Test Cases):
    - Document minimum 5-7 edge cases with expected behavior
    - Create validation scenario matrix
    - Write manual test cases with clear steps (QA-ready format)
    - Provide automation test script structure (Playwright/Jest examples)
    - Define performance test scenarios with SLAs
  </action>
  <action>For section 7 (Security):
    - Document auth/authz requirements
    - List OWASP considerations
    - Define rate limiting rules
  </action>

  <!-- CRITICAL: Set status to ready-for-dev -->
  <action>Set story Status to: "ready-for-dev"</action>
  <action>Set last_updated to: current date</action>
  <action>Add completion note: "QA-enabled story context created with full API specs, frontend requirements, and test case foundation"</action>
</step>

<step n="7" goal="Update sprint status and finalize">
  <action>Validate the newly created story file {default_output_file} against quality checklist:</action>
  - [ ] All template sections populated (no "TODO" placeholders)
  - [ ] API endpoints have full request/response examples
  - [ ] Frontend components have data-testid attributes
  - [ ] Minimum 5 edge cases documented
  - [ ] Manual test cases have clear pass/fail criteria
  - [ ] Automation test hooks provided
  - [ ] Security requirements documented
  - [ ] Performance SLAs defined

  <action>Apply any required fixes before finalizing</action>
  <action>Save story document unconditionally</action>

  <!-- Update sprint status -->
  <check if="sprint status file exists">
    <action>Update {{sprint_status}}</action>
    <action>Load the FULL file and read all development_status entries</action>
    <action>Find development_status key matching {{story_key}}</action>
    <action>Verify current status is "backlog" (expected previous state)</action>
    <action>Update development_status[{{story_key}}] = "ready-for-dev"</action>
    <action>Update last_updated field to current date</action>
    <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>
  </check>

  <action>Report completion</action>
  <output>**🎯 QA-ENABLED STORY CONTEXT CREATED, {user_name}!**

    **Story Details:**
    - Story ID: {{story_id}}
    - Story Key: {{story_key}}
    - File: {{story_file}}
    - Status: ready-for-dev
    - Template: Custom QA-Enabled (project-specific)

    **QA Parallel Work Enabled:**
    ✅ API test cases can be written from section 3
    ✅ Automation scripts can use test IDs from section 4.6
    ✅ Manual test cases ready in section 5.3
    ✅ Edge scenarios documented in section 5.1
    ✅ Performance test SLAs defined in section 5.5

    **Next Steps:**
    1. Review the comprehensive story in {{story_file}}
    2. **QA Team:** Start writing test cases from sections 3-5
    3. **Dev Team:** Run dev agents `dev-story` for implementation
    4. Run `code-review` when development complete
    5. Optional: Run `/bmad:tea:automate` for additional guardrail tests

    **Note:** This story uses a custom project-specific template located at:
    `_bmad-output/implementation-artifacts/story-template.md`
    This template persists across BMad upgrades.
  </output>
</step>

</workflow>
