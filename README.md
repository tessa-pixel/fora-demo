# Fora Advisor Success Platform — Demo

## Setup (5 minutes)

### 1. Install dependencies
```bash
cd fora-demo
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.local.example .env.local
```
Open `.env.local` and replace `your_api_key_here` with your actual key from console.anthropic.com

### 3. Run the app
```bash
npm run dev
```

Open http://localhost:3000

---

## Demo flow (15–20 min presentation)

### Screen 1 — Home (/)
Landing page. Shows the three pillars: quiz, plan, agent.

### Screen 2 — Quiz (/quiz)
4 questions:
1. Name
2. Biggest barrier → sorts into Track A / B / C
3. Travel background
4. Goal date (up to 60 days) + hours per week

### Screen 3 — Plan (/plan)
- Toggle between all 3 tracks (show the audience each one)
- Your recommended track is highlighted
- AI generates a week-by-week schedule in real time
- Click "Regenerate" to show it's live AI, not static content

### Screen 4 — Calendar (/calendar)
- Shows the 60-day session schedule
- Click "+ Connect Google Calendar" (simulated — shows the connected state)
- Use the +/- buttons to reschedule sessions
- Check off completed sessions

### Screen 5 — Journey (/journey)
- Passport with advisor name pulled from quiz
- Itinerary stops, tier badges, membership payoff bar
- Current destination card with requirements + unlocks

### Screen 6 — Agent (/agent)
- Shows 6 mock advisors with real behavioral signals
- Click "Run agent" — watch Claude analyse each at-risk advisor live
- Each card shows: risk reason, intervention type, actual message written by Claude

---

## Branding
All Fora brand colors are defined in tailwind.config.ts:
- Indigo:  #34387F
- Crimson: #8C0A14
- Olive:   #78742B
- Cream:   #FAF8F3

Fonts: Playfair Display (headers) + Public Sans (body) via Google Fonts.
To use Chiswick: add @font-face in app/globals.css pointing to your woff2 file,
then replace 'Playfair Display' with 'Chiswick' in tailwind.config.ts.

---

## Notes
- Google Calendar connection is simulated (no OAuth needed for demo)
- All advisor data on the agent page is mock data
- The quiz answers persist in localStorage so refreshing keeps your state
- AI calls require a valid ANTHROPIC_API_KEY in .env.local
