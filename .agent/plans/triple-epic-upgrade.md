# 💠 Implementation Plan: Triple Epic Upgrade (v1.0)
**Features:** Real-time Itinerary, Price Predictor, Proof of Hunt (Gamification)
**Protocol:** AI-First | Spec-Driven

## 1. 🗺️ Feature 2: Real-time Itinerary Architect
**Objective:** Transform static itineraries into living documents that react to weather and events.

### 🏗️ Architecture
- **Agent:** `ArchitectAgent` - Scans weather inputs and local events.
- **Trigger:** Manual refresh or auto-polling on page load.
- **Logic:**
  - Input: Current Itinerary + Destination + Local Time.
  - Output: Adjusted JSON (e.g., swapping outdoor activities for indoor if rain is predicted).

### 🛠️ Tasks
- [ ] Create `app/actions/itinerary-architect.ts` (Server Action).
- [ ] Implement `WeatherSentinel` (Fetch real weather data - use OpenWeatherMap if API key, else simulation).
- [ ] Enhance `ItineraryDrawer.tsx` with a "Real-time Sync" button and "Lumina Adjustments" badge.

---

## 2. 📉 Feature 5: Ghost Signal Predictor
**Objective:** Predict price movements and provide a "Tactical Buy Window".

### 🏗️ Architecture
- **Agent:** `PredictorAgent` - Analyzes current market vs. historical volatility.
- **Visuals:** High-performance "Heatmap" and "Confidence Score".
- **Logic:**
  - Input: Deal ID + Current Price.
  - Output: `BUY_NOW`, `WAIT_48H`, `HIGH_VOLATILITY`.

### 🛠️ Tasks
- [ ] Create `app/actions/price-predictor.ts`.
- [ ] Add `PredictorTool.tsx` to `app/ai-tools/`.
- [ ] Implement "Price Pulse" chart using Framer Motion or Light Charting.

---

## 3. 🔗 Feature 7: Proof of Hunt
**Objective:** High-end gamification system using "Elite Badges" and user progression.

### 🏗️ Architecture
- **Schema:** Update Prisma to include `Achievement` and `UserLevel`.
- **UI:** The "Hunter Vault" - a dedicated 3D-feeling gallery for rewards.
- **Logic:**
  - `BadgeSentinel`: Checks criteria after a search or booking (e.g., "First Luxury Catch", "Price Error Hunter").

### 🛠️ Tasks
- [ ] Update `prisma/schema.prisma` with `Badge` and `UserProgress` models.
- [ ] Create `app/components/hunter/BadgeReveal.tsx` (Premium animation).
- [ ] Build `app/hunter-portal/vault/page.tsx` (The 3D-style gallery).

---

## 🛡️ Pre-Flight Verification
- [x] Zero-Any Policy.
- [x] Lumina Aesthetic (Glows, Glassmorphism).
- [x] Hebrew Localization (Global RTL).

**Human Review Gate:** Ready for architectural approval?
