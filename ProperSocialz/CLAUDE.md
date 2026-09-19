# ProperSocialz Project Reference

## Overview
ProperSocialz is the social media orchestration hub of the Proper AI Suite. It is a professional-grade command center that leverages a Master Social Media Architect Agent to manage a comprehensive presence across Facebook, Instagram, Pinterest, X, TikTok, Reddit, and LinkedIn.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with a modular "Centered Rectangle" layout.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Layout**: "Centered Rectangle" Design:
    - **Header**: Center-aligned branding and high-impact description.
    - **Input Area**: Centered rectangle for topic-based generation.
    - **30-Day Interactive Calendar**: A large, centered glassmorphic grid representing the monthly content flow.
    - **7-Day Weekly Focus**: A detailed view of the current week's strategy and daily posts.
    - **Approval Center**: Dedicated zone for reviewing and approving blog posts and platform-specific content.
    - **Master Notes Dump**: A glassmorphic text area where users dump raw ideas for the Agent to summarize and file.
    - **Media Review Hub**: A link-input section where the Agent analyzes external media for strategic integration.
    - **Trend Pulse Hub**: Daily summaries (Morning, Afternoon, Evening) compiled into a daily blog.
- **Glassmorphism**: `.glass` for all containers.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent suite branding.

## AI Agent: Master Social Media Architect
- **Expertise**: Top-tier mastery of algorithm trends for all major platforms.
- **Strategic Planning**:
    - **Monthly Blueprint**: Generates a full 30-day high-level content calendar on the 1st of every month.
    - **Weekly Strategy**: Produes a detailed 7-day tactical plan every Monday, including weekends.
- **Core Workflows**:
    - **Trend Synthesis**: Generates three daily summaries (Morning, Afternoon, Evening) $\rightarrow$ Compiled into a Daily Blog $\rightarrow$ Distributed to platforms.
    - **Omni-Channel Distribution**: Transforms approved blog content into platform-specific formats.
    - **Intelligence Processing**: Summarizes raw "Notes Dumps" into actionable content pillars.
    - **Media Analysis**: Reviews provided links/assets to optimize content timing and style.

## Key Functions
- `handleLogin()`: Standard suite authorization and lead capture.
- `generateMonthlyPlan()`: Creates the 30-day interactive calendar.
- `generateWeeklyStrategy()`: Creates the 7-day detailed focus.
- `processNotesDump()`: Agent analyzes raw notes $\rightarrow$ Files into the calendar.
- `reviewMediaLink()`: Agent analyzes a link $\rightarrow$ Suggests integration strategy.
- `approveAndDistribute()`: Finalizes blog/post approval and schedules for posting.

## Project Structure
- `index.html`: All logic, styles, and HTML for the application.
