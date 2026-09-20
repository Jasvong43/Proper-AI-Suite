# Implementation Plan: ProperOS Project Management Dashboard

## Context
The Proper AI Suite currently operates as a series of isolated SPAs. While the ProperOS Overseer can trigger workflows, there is no persistent storage for the resulting campaigns. This implementation introduces a **Central Campaign Store** and a **Project Management Dashboard** to allow the user to save, review, and manage all assets, analytics, and scripts generated across the 6-agent pipeline.

## Recommended Approach

### 1. Data Architecture: The Campaign Store
Implement a `CampaignStore` singleton within `ProperOS/index.html` using `localStorage` for persistence.
- **Schema**: A `Project` object containing:
    - `id` (UUID), `campaignName`, `createdAt`, `status` ('Draft' | 'Running' | 'Complete').
    - `data`: An object with keys for each agent (`viral`, `storyz`, `vocal`, `pixelz`, `fuzion`, `socialz`) storing their respective outputs (scripts, asset URLs, scores, and platform copy).
    - `orchestration`: Metadata including run date and agent logs.

### 2. UI Implementation: The Dashboard Views
The Dashboard will be integrated into `ProperOS/index.html` as a view-toggle from the Command Center.

#### View A: Project Gallery (The Hub)
- **Layout**: A grid of glassmorphic cards.
- **Card Details**: Project Name, Status Badge, Date, and a "Launch" button.
- **Action**: "New Campaign" button to trigger the orchestrator.

#### View B: Project Detail (The War Room)
- **Layout**: A large centered rectangle with a Left Sidebar (Navigation) and a Main Content Area.
- **Sidebar Tabs**: `Analytics` $\rightarrow$ `Assets` $\rightarrow$ `Links` $\rightarrow$ `Scripts` $\rightarrow$ `Agent Status`.
- **Main Content Area**:
    - **Analytics**: KPI tiles for Virality and Niche scores (based on `ProperViral` styles).
    - **Assets**: A masonry gallery for images/thumbnails and a video player for the final cut.
    - **Links**: A list of affiliate and social links with "Copy" buttons.
    - **Scripts**: A formatted document view of the `ProperStoryz` and `ProperVoCaL` output.
    - **Agent Status**: A 6-column heartbeat grid showing the last-run status of each agent.

### 3. Orchestration Integration
- **Auto-Save**: Modify `triggerWorkflow()` to capture the output of each agent into a `sessionCurrentRun` object.
- **Finalization**: Upon completion of the `ProperSocialz` stage, automatically trigger `saveRunToStore()`, which persists the project to `localStorage` and redirects the user to the Project Detail view.

## Critical Files to Modify
- `ProperOS/index.html`: Main implementation of the Store, Dashboard views, and orchestration logic.
- `ProperOS/CLAUDE.md`: Update architecture docs to include the Campaign Store schema.

## Verification Plan
1. **Create Project**: Run a "Full Suite" command in the Overseer and verify that a new project is automatically created in the Project Gallery.
2. **Persist Data**: Refresh the page and ensure the project remains in the Gallery (testing `localStorage`).
3. **Asset Review**: Open a project and verify that the links, scripts, and (simulated) assets are correctly displayed in the Detail View.
4. **Navigation**: Verify seamless switching between the Overseer Command and the Dashboard Gallery.
