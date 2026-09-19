# ProperFuzion Project Reference

## Overview
ProperFuzion is the video production hub of the Proper AI Suite. It is a professional-grade video editor that combines human creativity with a Master AI Director & Producer to create high-impact content optimized for viral growth.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with a modular "Centered Rectangle" layout.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Layout**: "Centered Rectangle" Design:
    - **Header**: Center-aligned branding and high-impact description.
    - **Rectangle 1 (Playback & Timeline)**: Large centered area with a video player and a perfectly aligned timeline strip below it.
    - **Rectangle 2 (Production Hub)**: A wide modular zone divided into:
        - **Left (Assets)**: Library for uploaded videos.
        - **Center (AI Director)**: Command center for the AI Producer, featuring a "Full Control" toggle and viral clip scanning.
        - **Right (Editing Tools)**: Stacked dropdowns for EQ, Captions, Transitions, Fonts, and Music.
- **Glassmorphism**: `.glass` for all panels.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent suite branding.

## Key Features
- **Authentication & Lead Capture**: Mirror of ProperViral/ProperStory login flow.
- **AI Director & Producer Agent**:
    - **Master Production**: Automates professional cuts and music matching.
    - **Governance System**:
        - **Human-First**: AI offers a professional polish before export.
        - **AI-First**: Human review is MANDATORY before export if AI performed the edits.
    - **Whop Clipping Mogul**: Specialization in scanning long-form videos for high-viral-potential 30s clips, ranked 1-100.
    - **Campaign Memory**: Ability to remember specific campaign goals for optimized clipping.
- **Production Tools**:
    - Timeline-based video strip.
    - Integrated non-copyright music library.
    - Advanced styling options (Captions, Fonts, Transitions).

## Key Functions
- `handleLogin()`: Standard suite authorization.
- `addToTimeline(assetId)`: Adds a video clip to the editor strip.
- `handleAIEditing()`: Orchestrates the "Producer" agent to perform edits and music matching.
- `requestExport()`: Validates if a review has occurred based on who performed the edits.
- `scanForViralClips()`: AI-driven analysis of long-form content for viral highlights.
- `rememberCampaign()`: Sets a campaign context for the AI Director.

## Project Structure
- `index.html`: All logic, styles, and HTML for the application.
