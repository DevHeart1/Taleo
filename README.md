# Taleo

> **Voice-first, illustrated AI storybook for children.**  
> A child speaks a story idea — Taleo generates narrated, illustrated scenes with branching choices, ending with a shareable storybook the whole family can keep.

---

## Overview

Taleo is a Next.js 16 web application designed to run without a keyboard. Children tap once, speak a story prompt, and experience a fully narrated bedtime book where they are the hero. Parents receive a shareable link when the story is complete.

**Key experience traits:**
- 🎙️ **Voice-first input** — speech recognition via ElevenLabs STT (browser fallback available)
- 🖼️ **AI-generated illustrations** — Gemini 2.5 Flash Image via Vercel AI Gateway, with optional OpenAI `gpt-image-1` fallback
- 🔊 **Multi-character narration** — ElevenLabs streaming TTS with distinct narrator and character voices
- 📖 **Branching stories** — children choose the next direction out loud
- 💾 **Persistent storybooks** — stories saved to Supabase and shareable via `/story/[id]`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 6 |
| Runtime | React 19 |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | Supabase Auth (magic link) |
| AI — Story Text | Google Gemini (`@google/genai`) |
| AI — Illustrations | Vercel AI Gateway → Gemini 2.5 Flash Image / OpenAI `gpt-image-1` |
| AI — TTS / STT | ElevenLabs |
| Animation | GSAP 3 |
| Package Manager | pnpm 10 |
| Deployment | Vercel |

---

## Project Structure

```
app/
├── api/
│   ├── profile/          # User profile endpoints
│   ├── setup-storage/    # Supabase Storage bucket initialisation
│   ├── stories/          # Story listing and retrieval
│   ├── story/            # Story creation, image & audio generation
│   ├── stt/              # Speech-to-text upload route (ElevenLabs)
│   └── tts/              # Text-to-speech streaming route (ElevenLabs)
├── auth/callback/        # Supabase Auth callback handler
├── play/                 # Child-facing story experience
├── settings/             # Auth and storage configuration (parent-facing)
├── stories/              # Saved story gallery
└── story/[id]/           # Shareable storybook view

components/               # React UI components
hooks/                    # Custom React hooks
lib/                      # Shared utilities and API clients
types/                    # Shared TypeScript types
supabase/
├── migrations/           # Versioned database migrations
├── schema.sql            # Reference schema (apply via migrations)
└── config.toml           # Supabase CLI project config
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** 10 — `npm install -g pnpm`
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- An [ElevenLabs](https://elevenlabs.io) API key (TTS + STT)
- *(Optional)* A [Vercel AI Gateway](https://vercel.com/dashboard/ai-gateway/api-keys) key for cost-optimised image generation

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the required values:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `SUPABASE_ACCESS_TOKEN` | ☑️ CLI only | Used by the Supabase CLI for migrations |
| `SUPABASE_PROJECT_REF` | ☑️ CLI only | Supabase project reference ID |
| `AI_GATEWAY_API_KEY` | ☑️ Optional | Vercel AI Gateway key for cheaper Gemini image generation |
| `OPENAI_PIXAR_FALLBACK_ENABLED` | ☑️ Optional | Set `true` to enable OpenAI `gpt-image-1` as an illustration fallback |

> **Note:** `NEXT_PUBLIC_*` variables are inlined at build time. After changing them, redeploy or restart the dev server.

### 3. Initialise the database

Apply the Supabase migrations to your project:

```bash
# Link the repo to your Supabase project (one-time)
npx -y supabase@2.101.0 link --project-ref <your-project-ref>

# Push all migrations
npx -y supabase@2.101.0 db push
```

Alternatively, run `supabase/schema.sql` directly in the Supabase SQL editor.

### 4. Initialise storage buckets

Start the dev server, then visit [`/settings`](http://localhost:3000/settings) and click **Setup Supabase Storage**, or call the API directly:

```bash
curl -X POST http://localhost:3000/api/setup-storage
```

This creates three buckets: `story-images`, `story-audio`, and `assets`.

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Application Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/play` | Voice-first story experience (child-facing) |
| `/stories` | Saved story gallery |
| `/story/[id]` | Shareable storybook view (parent share page) |
| `/settings` | Auth and storage configuration |
| `/auth/callback` | Supabase Auth callback handler |

---

## Storage Architecture

Story assets are persisted across four layers, in priority order:

1. **Supabase Database** — story metadata, session data, and asset references
2. **Supabase Storage** — generated scene images (PNG/JPEG) and narration audio (MP3)
3. **Server Memory** — in-process cache for fast access during a session
4. **Browser LocalStorage** — client-side fallback for demo / no-auth mode

See [`STORAGE.md`](./STORAGE.md) for full details on bucket layout, API endpoints, and troubleshooting.

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server (source maps disabled for speed) |
| `pnpm dev:debug` | Start development server with source maps enabled |
| `pnpm build` | Build production bundle |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## Deployment

This project is deployed on **Vercel**. Pushes to `main` trigger automatic deployments.

Set the same environment variables listed above in your Vercel project settings under **Settings → Environment Variables**. `NEXT_PUBLIC_*` variables must be set before building — redeploy after adding them.

```bash
# Verify the build locally before pushing
pnpm build
```

---

## Security Notes

- Never commit `.env.local` — it is listed in `.gitignore`.
- `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ACCESS_TOKEN` must **never** appear in client-side code.
- Prefer versioned migrations in `supabase/migrations/` over one-off dashboard changes to keep schema history reproducible.

---

## License

ISC
