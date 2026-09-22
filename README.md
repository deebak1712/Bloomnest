# 🌸 BloomNest: AI-Powered Pregnancy Companion

BloomNest is a comprehensive, ultra-premium web application designed to support expectant mothers through all 40 weeks of their pregnancy journey. It replaces traditional "fruit size" trackers with clinically accurate, hyper-realistic, and deeply empathetic features.

## 🚀 Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Custom Vanilla CSS Design System (Tailwind-inspired utility classes)
- **Backend (AI Proxy):** Node.js + Express
- **AI Integration:** Google Gemini API (for the "AI Doctor" Assistant)
- **Database:** Static Frontend Data (`src/data/`) + LocalStorage (No SQL/Cloud database currently connected)

## ✨ Core Features
- **Cinematic Baby Development (NEW):** A premium UI mode featuring dynamic trimester-based background gradients, a glowing "cosmic womb" masking effect, and hyper-realistic 8K AI-generated fetal macro photography. 
- **AI Doctor Assistant:** A secure, context-aware chatbot powered by Gemini that answers maternal health questions.
- **Health Trackers:** Comprehensive logging for Vitals, Mood, Kick Counting, and Contraction Timing.
- **Actionable Guides:** Built-in Nutrition plans, Prenatal Yoga poses, and Hospital Bag checklists.
- **Multilingual Support:** Scaffolding in place for 6 local Indian languages (Hindi, Tamil, Marathi, Telugu, Bengali, English).

## 🛠️ Recent Updates & Add-ons
1. **Medical Terminology Standardized:** Replaced casual "fruit sizes" with medically accurate fetal development stages (e.g., "Fetus (Viability Threshold)").
2. **Cinematic UI Overhaul:** Rebuilt the `BabyDevelopmentPage` to feature a layered composition: a gorgeous maternal silhouette portrait seamlessly blended with a holographic, rotating womb bubble.
3. **Automated Asset Generation:** Created a pipeline to generate custom 8K fetal images for all 40 weeks using background AI agents (currently populating `public/assets/cinematic/`).
4. **Port Conflict Resilience:** Configured the development environment to automatically recover from `EADDRINUSE` port 3000 hangs using automated zombie process cleanup.

## 💻 How to Run Locally

**Prerequisites:** Node.js v18+

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up your environment variables:**
   Create a `.env` file in the root directory (you can copy `.env.example`) and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 🤝 Hackathon 6-Member Team Branching & Contribution Workflow

This project is configured for seamless team collaboration during the hackathon. Follow this workflow to prevent merge conflicts.

### 1. Clone & Setup
```bash
git clone https://github.com/deebaksandosh/bloomnest.git
cd bloomnest
npm install
copy .env.example .env
npm run dev
```

### 2. Branch Allocation Strategy
Each team member works on their dedicated feature branch:
- **Member 1 (Lead - Deebak):** `main` (Architecture & PR Review)
- **Member 2:** `m2/pregnancy-tracking` (Pregnancy Trackers & Fetal Milestones)
- **Member 3:** `m3/nutrition-kitchen` (Nutrition & AI Recipe Kitchen)
- **Member 4:** `m4/postpartum-recovery` (Maternal Postpartum Recovery & Lochia)
- **Member 5:** `m5/baby-care-module` (Newborn Baby Care & Pediatric Milestones)
- **Member 6:** `m6/clinical-safety-brief` (Safety Shield & Doctor Brief Generator)

### 3. Making Changes & Submitting Pull Requests
```bash
# 1. Create and switch to your feature branch
git checkout -b <your-branch-name>

# 2. Make your code changes, then stage and commit
git add .
git commit -m "feat: description of changes"

# 3. Push your branch to GitHub
git push origin <your-branch-name>
```
Once pushed, open a **Pull Request (PR)** on GitHub targeting `main`. The team lead will review and merge it cleanly into the demo build.

## 🚧 Upcoming Roadmap
- [ ] Connect a PostgreSQL database (e.g., Supabase) to persist user data (Mood Logs, Notifications, Vitals) across devices.
- [ ] Complete the Multi-Language translation dictionary mapping in `translations.ts`.
- [ ] Convert the application into an installable Progressive Web App (PWA) for offline mobile access.

