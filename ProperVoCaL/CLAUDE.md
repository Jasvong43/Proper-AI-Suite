# ProperVoCaL Project Reference

## Overview
ProperVoCaL is the audio engineering and voice synthesis powerhouse of the Proper AI Suite. It specializes in creating high-retention, psychologically optimized voiceovers and soundscapes that drive engagement and trust.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with a "Centered Rectangle" layout.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Layout**: "Centered Rectangle" Design:
    - **Header**: Center-aligned branding and high-impact description.
    - **Audio Studio**: A centered glassmorphic rectangle containing the Voice synthesis controls and tone selectors.
    - **Soundscape Mixer**: A modular zone for selecting background music, adding sfx (pattern interrupts), and managing audio levels.
- **Glassmorphism**: `.glass` for all containers.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent suite branding.

## AI Agent: Master Voice Architect
- **Expertise**: Top-tier mastery of vocal psychology, tonality, and audio production.
- **Core Capabilities**:
    - **Persona Design**: Ability to create specific vocal personas (e.g., "The Confident Expert", "The Relatable Peer", "The Urgent Insider").
    - **Retention Engineering**: strategically placing pauses, emphasis, and "pattern interrupts" to prevent viewer drop-off.
    - **BGM Synchronization**: Matching the energy of the background music to the psychological arc of the script.
    - **Audio Polish**: Simulating professional studio quality with clarity and depth.

## Key Functions
- `handleLogin()`: Standard suite authorization and lead capture.
- `generateVoiceover()`: Orchestrates the voice synthesis based on script and persona.
- `applyAudioEffects()`: Adds sfx and filters (like low-pass or high-pass) for cinematic effect.
- `syncBGM()`: Matches background music to the script's pacing and energy.

## Project Structure
- `index.html`: All logic, styles, and HTML for the application.
