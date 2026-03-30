# JobCraftor

JobCraftor turns a job or internship posting into a personalized action plan.

It is a focused application-prep product for students and early-career candidates: paste a posting, add a resume, and get a concrete execution plan instead of vague career advice.

## Product Overview

JobCraftor is built around a single high-value workflow:

1. Paste a job posting or job URL
2. Paste or upload a resume
3. Generate a structured analysis
4. Leave with a clearer understanding of fit, gaps, and what to do over the next 7 days

The goal is not to be a generic AI assistant. The goal is to help a candidate move from uncertainty to action quickly.

## The Problem It Solves

Students often find promising roles but struggle with the next step:
- what does this role actually prioritize?
- how competitive am I right now?
- what is missing from my resume?
- what should I fix before I apply?

Most tools stop at generic resume tips or unstructured chat. JobCraftor translates a real job posting and a real resume into a practical, role-specific application plan.

## Core Workflow

JobCraftor is designed to be easy to demo and easy to use:

1. Start from the landing page or launch instant demo mode
2. Add a job posting, optional job URL, resume text or uploaded file, and optional target role/deadline
3. Run analysis through the server-side structured analysis pipeline
4. Review a polished dashboard with:
   - role breakdown
   - fit analysis
   - top 3 blockers
   - 7-day action plan
   - resume improvements
   - networking message
   - interview prep
5. Export or reuse the output through print/export, copy actions, and saved local history

## Feature List

- Clean landing page with clear product positioning
- One-click instant demo for contest judging
- Resume input via paste or upload
- Practical resume parsing for `TXT`, `MD`, `RTF`, `PDF`, and `DOCX`
- Server-side AI analysis with strict schema validation
- Deterministic fallback engine for demo reliability
- Full results dashboard with actionable sections
- Export and share actions for key outputs
- Lightweight saved history in the browser
- Lightweight internal diagnostics for demo/debug confidence

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Zod for shared schemas and runtime validation
- OpenAI Responses API for structured analysis
- Mammoth for `DOCX` extraction
- `pdf-parse` for PDF text extraction
- Vitest for lightweight critical-path tests

## Local Setup

### Prerequisites

- Node.js `20.11+`
- npm `10+`

### Install dependencies

```bash
npm install
```

### Configure environment

Copy `.env.example` to `.env.local` in the project root:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Available environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables live AI analysis. If missing, JobCraftor falls back to the validated mock engine. |
| `OPENAI_MODEL` | No | Optional model override. Defaults to `gpt-4o-mini`. |

Important:
- `.env.local` should live at the repository root: `C:\Users\kenan\OneDrive\İş masası\JobCraftor`
- after adding or changing `OPENAI_API_KEY` or `OPENAI_MODEL`, restart `npm run dev`
- `OPENAI_MODEL` is optional; if omitted, JobCraftor uses `gpt-4o-mini`

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verify locally

```bash
npm run test
npm run lint
npm run build
```

Or run the full check:

```bash
npm run check
```

## How AI Analysis Works

At a high level, JobCraftor uses a server-side structured analysis pipeline:

1. The client sends validated job and resume input to `/api/analyze`
2. The server builds a constrained prompt around the current product schema
3. The model returns structured JSON shaped to the app's Zod schemas
4. The response is validated before it reaches the UI
5. If live AI fails or is unavailable, JobCraftor falls back to a deterministic mock analysis engine so the product still works reliably

This keeps API keys server-side, keeps the frontend contract stable, and makes the app safer to demo.

### How to verify live AI is working

1. Add `OPENAI_API_KEY` to `.env.local`
2. Restart the dev server
3. Submit a real analysis from the input workflow
4. Confirm the results header shows `Live AI analysis` instead of `Validated fallback`
5. Confirm the dashboard does not show the fallback warning about missing live AI configuration

## Demo Mode

JobCraftor includes a polished instant demo path tailored to a software engineering internship.

With one click, a judge can open:
- a realistic sample job posting
- a realistic student resume
- a precomputed high-quality results dashboard

This makes the core product value visible immediately and avoids depending on live generation during a contest demo.

## Future Improvements

- Save analysis history across devices with authenticated accounts
- Add richer resume parsing and section-aware extraction
- Improve export options with richer branded PDFs
- Add recruiter-facing cover letter generation
- Support more role families beyond internship-heavy workflows
- Add deeper analysis memory and application tracking over time

## Deployment Notes

Vercel is the best deployment target for this app. It fits the Next.js architecture naturally, supports the server routes cleanly, and is the fastest path to a polished hosted demo.

Key production notes:
- The homepage already exists at `src/app/page.tsx`
- The App Router layout already exists at `src/app/layout.tsx`
- The AI and resume parsing routes run on the Node runtime
- The app is deployable even without `OPENAI_API_KEY` because the fallback engine preserves the experience
- Browser-local history and diagnostics are intentionally local-only for this MVP

### Vercel deployment checklist

- Use Node.js `20.11+`
- Keep the Framework Preset as `Next.js`
- Keep the Root Directory at the repository root or leave it blank
- Keep the Production Branch as `main`
- Keep the Output Directory blank/default for Next.js
- Set `OPENAI_API_KEY` in Vercel if you want live AI analysis
- Optionally set `OPENAI_MODEL` if you want to override the default `gpt-4o-mini`
- Verify `npm run build` passes before deploying
- Expect browser-local history and diagnostics to remain device-local by design

### Exact Vercel steps

1. Push the repo to GitHub
2. In Vercel, click `Add New...` -> `Project`
3. Import the `jobcraftor` repository
4. Keep the detected framework preset as `Next.js`
5. Make sure `Root Directory` is the repo root or blank, not `src`, `docs`, or another subfolder
6. Make sure `Production Branch` is `main`
7. Leave `Output Directory` blank so Vercel uses the normal Next.js output
8. Keep the build command as `npm run build`
9. In `Environment Variables`, add:
   - `OPENAI_API_KEY` = your real OpenAI key if you want live AI
   - `OPENAI_MODEL` = optional override
10. Deploy
11. If the deployed root path still returns `404 NOT_FOUND`, re-check the Vercel project settings above before changing app code, because the App Router homepage already exists in the repo
12. After deployment, verify:
   - the landing page loads at `/`
   - `Launch instant demo` works
   - `Generate plan` works
   - `/api/analyze` returns live AI results when `OPENAI_API_KEY` is set, otherwise validated fallback results
   - `/api/parse-resume` works with a supported upload such as `.docx` or `.txt`
