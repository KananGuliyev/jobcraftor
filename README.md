# JobCraftor

JobCraftor turns a job or internship posting plus a resume into a personalized application execution plan.

The app is designed for fast demo value:
- paste a job posting or URL
- paste or upload a resume
- generate a structured plan with fit analysis, blockers, resume improvements, networking copy, and interview prep
- launch an instant software engineering internship demo in one click

## Why this app exists

Students often know they are interested in a role, but they do not know how competitive they are yet or what to do next. JobCraftor focuses that uncertainty into a concrete next-step workflow instead of a generic AI chat.

## Product flow

1. Landing page with a clear product promise and instant demo path
2. Input workflow for job posting, resume, target role, and deadline
3. Server-side analysis with strict schema validation
4. Results dashboard with:
   - role breakdown
   - fit analysis
   - top blockers
   - 7-day action plan
   - resume improvements
   - networking message
   - interview prep
5. Export/share actions and lightweight local history

## Tech stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Zod for shared schemas and runtime validation
- OpenAI Responses API for structured analysis
- Deterministic mock fallback engine for demo reliability
- Vitest for lightweight critical-path tests

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables live AI analysis. If missing, the app falls back to the built-in mock analysis engine. |
| `OPENAI_MODEL` | No | Overrides the default model. Defaults to `gpt-4o-mini`. |

Notes:
- No API keys are exposed to the client.
- The app is still usable without `OPENAI_API_KEY`; it will continue to work with the validated fallback path.

## Local setup

### Prerequisites

- Node.js `20.11+`
- npm `10+`

### Install

```bash
npm install
```

### Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

Run the main checks individually:

```bash
npm run test
npm run lint
npm run build
```

Or run the full verification pass:

```bash
npm run check
```

## Deployment recommendation

### Best target: Vercel

Vercel is the best production target for this app because:
- it is the most straightforward host for a Next.js App Router project
- server routes for analysis and resume parsing work naturally there
- the deployment workflow is fast and contest-friendly
- preview deployments are easy if you want a shareable review URL

### Recommended production settings

- Framework preset: `Next.js`
- Node version: `20.x`
- Build command: `npm run build`
- Install command: `npm install`
- Start command: `npm run start`
- Environment variables:
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL` optional

### Deploy steps on Vercel

1. Import the GitHub repository.
2. Confirm the framework is detected as Next.js.
3. Set `OPENAI_API_KEY` in the Vercel project settings if you want live AI analysis.
4. Optionally set `OPENAI_MODEL`.
5. Deploy.

If the OpenAI key is not configured, the production app still works using the mock fallback engine.

## Production notes

- The analysis and resume parsing routes are pinned to the Node runtime because they rely on Node-compatible libraries.
- Resume parsing supports `TXT`, `MD`, `RTF`, `PDF`, and `DOCX`.
- Legacy `.doc` files are intentionally rejected for lower parsing risk.
- Successful analyses, demo usage, and lightweight debug events are stored locally in the browser for MVP reliability.
- Export uses browser-native print/save behavior instead of a heavy PDF generation dependency.

## Deployment blockers review

No obvious blockers remain for a normal Vercel deployment.

Known practical considerations:
- Live AI analysis requires `OPENAI_API_KEY`.
- PDF and DOCX parsing increase server-side bundle/runtime needs, so the Node runtime is required.
- Local saved history and diagnostics are browser-only by design and do not sync across devices.

## Project scripts

```bash
npm run dev
npm run test
npm run lint
npm run build
npm run check
npm run start
```

## Demo path

For a contest demo, use the instant demo CTA on the landing page first. It opens a polished, precomputed software engineering internship walkthrough immediately, which makes the app reliable even if live AI is unavailable.
