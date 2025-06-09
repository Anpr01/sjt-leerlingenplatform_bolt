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
