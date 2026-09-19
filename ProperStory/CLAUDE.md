# ProperStoryz Project Reference

## Overview
ProperStoryz is the cinematic scripting powerhouse of the Proper AI Suite. It transforms a viral title or niche into a professional-grade "Production Packet" through a multi-step AI-driven workflow, specializing in psychological hooks and high-retention storyboarding.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with a "Centered Rectangle" workflow manager.
- **PDF Export**: `html2pdf.js` for professional document generation.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Layout**: "Centered Rectangle" Design:
    - **Header**: Center-aligned branding and high-impact description.
    - **The Production Vault**: A large, centered glassmorphic rectangle that serves as the state-based workflow container.
    - **Workflow Steps**: A sequence of centered views (Entry $\rightarrow$ Script $\rightarrow$ Scenes $\rightarrow$ Pacing $\rightarrow$ Prompts $\rightarrow$ Delivery) that animate into view.
    - **Final Packet**: A high-contrast professional white document design for delivery.
- **Glassmorphism**: `.glass` for all containers.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent suite branding.

## Workflow Logic
The app follows a strict linear sequence where each step must be approved before the next AI generation triggers:
1. **Step 0 (Entry)**: Input viral title or niche.
2. **Step 1 (Script)**: Master Storyteller generates a psychological script $\rightarrow$ Human review/edit $\rightarrow$ Approve.
3. **Step 2 (Scenes)**: AI Producer maps out cinematic storyboard scenes $\rightarrow$ Human review/edit $\rightarrow$ Approve.
4. **Step 3 (VO Timing)**: AI Director calculates exact pacing for retention $\rightarrow$ Human review/edit $\rightarrow$ Approve.
5. **Step 4 (Prompts)**: Prompt Engineer designs high-fidelity visual prompts $\rightarrow$ Human review/edit $\rightarrow$ Approve.
6. **Step 5 (Delivery)**: Renders the "Production Packet" with a "Generated with ProperStoryz" badge.

## Key Features
- **Authentication & Lead Capture**: Mirror of the suite's standard login and lead generation flow.
- **AI Persona**: A combined force of a top-tier viral storyteller, emotional psychologist, master producer, and prompt engineer.
- **Production Delivery**: Generates a professional PDF production packet via `html2pdf.js`.

## Key Functions
- `handleLogin()`: Standard suite authorization and lead capture.
- `nextStep(step)`: Manages transition between workflow states and triggers `simulateGeneration()`.
- `simulateGeneration(step)`: Mimics AI streaming output for scripts, scenes, timing, and prompts.
- `renderFinalPacket()`: Aggregates all approved content into a clean, organized final document.
- `downloadPacket()`: Triggers the PDF conversion of the final packet.

## Project Structure
- `index.html`: All logic, styles, and HTML for the application.
