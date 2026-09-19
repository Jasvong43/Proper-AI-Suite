# ProperPixelz Project Reference

## Overview
ProperPixelz is the visual powerhouse of the Proper AI Suite. It is a professional-grade image and video generation studio that supports multiple open-source engines and high-volume batch processing.

## Tech Stack
- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript.
- **Styling**: Proper AI Suite Standard (Midnight Slate `#020617` / Neon Cyan `#00f3ff`).
- **Architecture**: Single Page Application (SPA) with a modular "Centered Rectangle" layout.

## UI Components & Styling
- **Theme**: Dark theme with glowing neon accents.
- **Layout**: "Centered Rectangle" Design:
    - **Header**: Center-aligned branding and high-impact description.
    - **Rectangle 1 (Prompt Engineering)**: Focused area for primary prompt, negative prompt, and "AI Improve" logic.
    - **Rectangle 2 (Generator Settings)**: Modular settings for engine, asset type, resolution, and guidance scale.
    - **Rectangle 3 (Generation Canvas)**: Integrated result area for instant visual feedback.
    - **Rectangle 4 (Assets Area)**: Tabbed view for the Master Gallery and Batch Queue.
- **Glassmorphism**: `.glass` for all modular panels.
- **Neon Elements**: `.neon-border`, `.neon-text`, and `.neon-button` for consistent suite branding.

## Key Features
- **Authentication & Lead Capture**:
    - Mirror of ProperViral/ProperStory login flow.
    - Lead capture for email list building.
- **Multi-Engine Support**:
    - Supports simulated integration with multiple generators (e.g., Stable Diffusion, Sora, Midjourney, Runway).
- **Advanced Parameters**:
    - Aspect Ratio selection (1:1, 16:9, 9:16).
    - Resolution controls (1k, 2k, 4k).
    - Video Duration limits: Short (max 3 min), Long (max 10 min).
    - Step count and Guidance Scale (CFG).
- **Bulk Batching**:
    - Ability to queue multiple generation requests.
    - Progress tracking for each item in the batch.
- **Asset Management**:
    - Gallery view for all generated images and videos.
    - Zip download simulation for large batches of high-res assets.

## Key Functions
- `handleLogin()`: Standard suite authorization and lead capture.
- `generateAsset()`: Orchestrates the generation process based on the selected model and parameters.
- `addToBatch()`: Adds a request to the bulk queue.
- `downloadAssetsZip()`: simulate the bundling and downloading of large asset batches.
- `switchAssetsView(viewId)`: Manages navigation between the Gallery and the Batch Queue.
