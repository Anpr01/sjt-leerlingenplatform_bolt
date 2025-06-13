# SJT Leerlingenplatform Bolt

This project uses Vite with React and TypeScript.

## Development

1. Copy `.env.example` to `.env` and adjust the Turnstile keys if necessary.
2. Install dependencies with `npm install`.
3. In separate terminals, run:
   - `npm run server` – starts the Express backend on port 3000
   - `npm run dev` – starts the Vite dev server on port 5173 (use your workspace URL)

The Vite dev server proxies `/api` requests to the Express backend so the
Turnstile verification works locally.

## Bypass code

The `LandingPage` lets you skip the Turnstile check by entering a bypass code. Set `VITE_BYPASS_CODE` in your `.env` file to customize this code. If the code is correct it is saved to `localStorage` so you only verify once per browser.

