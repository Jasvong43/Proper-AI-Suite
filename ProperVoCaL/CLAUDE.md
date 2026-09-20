# ProperVoCal Project Reference

## Overview
ProperVoCal is the voice synthesis and cloning powerhouse of the Proper AI Suite. It allows users to generate professional AI voiceovers and create hyper-realistic voice clones for content creation.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with view-switching.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Glassmorphism**: `.glass` for all main containers.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent branding.
- **Voice Cards**: `.voice-card` with active states to indicate the currently selected voice.
- **Audio Visuals**: Simulated waveform using `.waveform-bar` for a high-tech feel.

## Key Features
- **Authentication & Lead Capture**:
    - Mirror of ProperViral/ProperStory login flow.
    - Lead capture for email list building.
    - Simulated authorization sequence.
- **Text-to-Speech (TTS) Studio**:
    - Input area for script entry.
    - Voice selection from a library of 50 professional presets (25 Male / 25 Female).
    - Real-time generation simulation with a custom audio player and waveform.
- **Voice Cloning Lab**:
    - File upload interface for voice samples.
    - Multi-phase simulation: Upload $\rightarrow$ Analyze $\rightarrow$ Train $\rightarrow$ Finalize.
    - Ability to save and name cloned voices in the library.
- **Voice Library**:
    - Grid of preset and cloned voices.
    - Preview functionality and active voice tracking.

## Key Functions
- `handleLogin()`: Standard suite authorization and lead capture.
- `generateVoiceover()`: Simulates the TTS generation process and triggers the audio player.
- `handleVoiceUpload()`: Manages the voice cloning pipeline and updates the voice library.
- `selectVoice()`: Updates the active voice context and refreshes the UI.
- `startWaveform()`: Animates the audio visualizer.

## Project Structure
- `index.html`: All logic, styles, and HTML for the application.
