# Spec: Lumina Lab Elite Redesign

## 1. Core Architecture Changes
- **Layout:** Shift from a standard sidebar to a "Command Deck" feel. Use `backdrop-blur-3xl` and `border-white/10`.
- **Navigation:** Enhance tool switching with shared layout animations (`layoutId`).

## 2. Feature Redesign Details

### A. Smart Budget (BUDGET)
- **Visuals:** Use animated rings or progress bars for budget categories.
- **Interactions:** Drag-and-drop budget rebalancing (simulated).

### C. Squad Mode (SQUAD)
- **Concept:** "Agent Swarm Control".
- **Visuals:** Multiple agent avatars floating in a "Tactical Mesh".
- **UI:** A log of "Agent Conversations" discussing the user's trip.

### D. Visual Scan (VISUAL)
- **Concept:** "Neural Destination Recognition".
- **Visuals:** A scanner line moving over a user-uploaded image (or placeholder).
- **Output:** Extracted "Vibes" and "Price Points" from the image.

## 3. The "No Any" Law Compliance
- All new props and state must have strict TypeScript interfaces.

## 4. Atomic Component Law
- Keep tool components under 200 lines. Refactor sub-components like `BudgetChart` or `MapHUD` into separate files.
