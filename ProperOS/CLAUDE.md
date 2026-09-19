# ProperOS Project Reference

## Overview
ProperOS is the Orchestrator and Central Nervous System of the Proper AI Suite. It serves as the master interface and command center that coordinates the specialized Master AI Agents across all other applications (Pixelz, Fuzion, Storyz, Viral, Socialz, and Flux). 

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with a "Centered Rectangle" layout.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Layout**: "Centered Rectangle" Design:
    - **Header**: Center-aligned branding ("ProperOS") and high-impact description.
    - **The Core (Command Center)**: A large, centered glassmorphic rectangle containing the Overseer's chat interface and high-level command input.
    - **Agent Status Grid**: A grid of 6 status cards representing the other suite apps, showing current project status and agent availability.
    - **Workflow Orchestrator**: A visual pipeline that shows the movement of a project from one app to another (e.g., Viral $\rightarrow$ Storyz $\rightarrow$ Fuzion).
- **Glassmorphism**: `.glass` for all containers.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent suite branding.

## AI Agent: The Overseer
- **Expertise**: Master Orchestrator, Project Manager, and Suite Integration Expert.
- **Core Capabilities**:
    - **Workflow Triggering**: Ability to initialize projects in one app and pass the output as input to the next.
    - **Cross-App Memory**: Maintains a global context of all active projects across the suite.
    - **Knowledge Base Management**: Oversees the periodic refinement of the specialized agents' knowledge bases.
    - **System Health Monitoring**: Tracks the "up-to-date" status of each niche-specific agent.

## Key Functions
- `handleCommand()`: Parses high-level user requests and maps them to specific app workflows.
- `triggerWorkflow(pipeline)`: Automates the sequence of apps (e.g., Viral $\rightarrow$ Storyz $\rightarrow$ Fuzion $\rightarrow$ Socialz).
- `updateAgentStatus()`: Updates the status cards based on the latest activity in the suite.
- `syncKnowledgeBases()`: (Simulated) Triggers the weekly refinement process for niche agents.

## Project Structure
- `index.html`: All logic, styles, and HTML for the orchestration layer.
