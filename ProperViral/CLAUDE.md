# ProperViral Project Reference

## Overview
ProperViral is the entry point of the Proper AI Suite. It is a Master YouTube Ideation Agent that provides comprehensive niche analysis, viral concepts, and a detailed growth blueprint to help creators scale to $10k/month.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with a modular "Centered Rectangle" layout.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Layout**: "Centered Rectangle" Design:
    - **Header**: Center-aligned branding and high-impact description.
    - **Interaction Zone**: A centered glassmorphic rectangle containing the niche input and "Quick Select" category buttons.
    - **Results Area**: A series of centered horizontal rectangles (stacked but gapped) that render the Master Report sections.
- **Glassmorphism**: `.glass` for all containers.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent suite branding.

## Key Features
- **Authentication & Lead Capture**:
    - Login Page: High-impact hero section with email capture and OAuth buttons (Google, Apple).
    - Authorization Logic: Simulated async auth flow using `authOverlay`.
- **Master Ideation Engine**:
    - `generateFullReport()`: Performs a multi-step simulated analysis of a niche using a "Master Agent" persona.
    - **Analytical Depth**: Provides comprehensive breakdowns of market gaps, competitor sizing, and monetization strategies.
    - **Viral Logic**: Produces high-CTR titles and specific thumbnail design concepts based on psychological triggers.
    - **Monetization Blueprint**: Maps a path to $5k pre-monetization (Digital/Affiliate) and $5k post-monetization (AdSense/Sponsorships).

## Key Functions
- `handleLogin()`: Manages the authorization simulation and captures the user's email.
- `generateFullReport()`: The main orchestration function that simulates the AI agent's thinking process and renders the detailed report.
- `fillList()`: Utility function for rendering various types of data (lists, badges, styled rows).
- `toggleSetupGuide()`: Toggles the visibility of the channel setup prompts.

## Project Structure
- `index.html`: All HTML, CSS, and JavaScript for the application.
