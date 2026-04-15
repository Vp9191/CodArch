# CodArch

AI-powered code architecture evaluator. Paste your code, get an instant AI review covering quality, architecture, best practices, performance, and security.

## Features

- **AI Code Analysis** — Gemini 2.5 Flash reviews code across 5 dimensions with A+ → F rating
- **Multi-file Editor** — CodeMirror 6 with syntax highlighting, file explorer, tabs, drag-and-drop upload
- **Auth** — Firebase email/password and Google OAuth
- **PWA** — Installable, offline-first with service worker

## Tech Stack

React 19 · Vite 6 · Firebase 12 · CodeMirror 6 · Google Gemini (`@google/genai`) · Lucide Icons · Vanilla CSS

## Setup

```bash
git clone https://github.com/your-username/codarch.git
cd codarch
npm install
cp .env.example .env   # fill in your API keys
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID |
| `VITE_GEMINI_API_KEY` | Google AI / Gemini API key |

## Build

```bash
npm run build        # output in dist/
node server.js       # production server on port 3000
```

## Project Structure

```
src/
├── components/      # UI components (Navbar, Hero, Features, Editor, Modals...)
├── context/         # AuthContext (Firebase auth state)
├── pages/           # Landing, Auth, Editor
├── services/        # firebase.js, gemini.js
└── index.css        # Full vanilla CSS design system
```

## Creators

- Vedant P. — [GitHub](https://github.com/Vp9191)
