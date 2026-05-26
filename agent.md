# Taleo Agent Guide

This project is a Next.js 16 voice-first storybook app with Supabase-backed auth, storage, and story persistence.

## Project Basics

- Package manager: `npm` or `pnpm` both work, but `package-lock.json` is present so default to `npm`.
- Frontend: Next.js App Router with React 19.
- Backend routes: `app/api/*`.
- Supabase config: `supabase/config.toml`, `supabase/migrations/*`, `supabase/schema.sql`.
- Local auth callback route: `app/auth/callback/route.ts`.

## Environment Setup

Use `.env.local` for local development. The app expects:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ACCESS_TOKEN=
SUPABASE_PROJECT_REF=
GEMINI_API_KEY=
```

Notes:

- `SUPABASE_ACCESS_TOKEN` is used for Supabase CLI actions such as linking, pushing migrations, deploying functions, and setting secrets.
- `SUPABASE_PROJECT_REF` should stay set to the hosted project ref for this workspace.
- `NEXT_PUBLIC_SUPABASE_URL` should match `https://<project-ref>.supabase.co`.

## Install

```bash
npm install
```

## Run The App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful routes:

- `/` main landing page
- `/play` story experience
- `/stories` saved stories
- `/settings` auth and storage setup
- `/auth/callback` Supabase auth callback handler

## Supabase CLI Workflow

This repo's `supabase/config.toml` uses newer config keys, so prefer the latest CLI through `npx` instead of relying on an older global install.

### Login

PowerShell:

```powershell
$env:SUPABASE_ACCESS_TOKEN=(Get-Content .env.local | Select-String '^SUPABASE_ACCESS_TOKEN=').ToString().Split('=')[1]
```

Then run:

```powershell
npx -y supabase@2.101.0 login --token $env:SUPABASE_ACCESS_TOKEN
```

### Link This Repo To The Hosted Project

```powershell
$env:SUPABASE_PROJECT_REF=(Get-Content .env.local | Select-String '^SUPABASE_PROJECT_REF=').ToString().Split('=')[1]
npx -y supabase@2.101.0 link --project-ref $env:SUPABASE_PROJECT_REF
```

The repo is already linked to `fmtaybjbglsiinbctqeo`.

## Database Workflows

### Push Migrations

```powershell
npx -y supabase@2.101.0 db push
```

### Generate A New Migration

```powershell
npx -y supabase@2.101.0 migration new <migration_name>
```

### Reset Local Database

```powershell
npx -y supabase@2.101.0 db reset
```

### Apply Manual Schema

If needed, `supabase/schema.sql` can still be run manually in the Supabase SQL editor, but prefer checked-in migrations for repeatable changes.

## Edge Functions

There is no `supabase/functions` directory yet. To add one:

```powershell
npx -y supabase@2.101.0 functions new <function_name>
```

### Run Functions Locally

```powershell
npx -y supabase@2.101.0 functions serve
```

### Deploy Functions

```powershell
npx -y supabase@2.101.0 functions deploy <function_name> --project-ref $env:SUPABASE_PROJECT_REF
```

## Secrets

Set hosted project secrets with:

```powershell
npx -y supabase@2.101.0 secrets set NAME=value --project-ref $env:SUPABASE_PROJECT_REF
```

Supabase reserves secret names starting with `SUPABASE_` for platform-managed values. For custom edge-function secrets, use app-specific aliases instead, for example:

```powershell
npx -y supabase@2.101.0 secrets set TALEO_SUPABASE_SERVICE_ROLE_KEY=... TALEO_SUPABASE_PROJECT_REF=... --project-ref $env:SUPABASE_PROJECT_REF
```

List secrets names:

```powershell
npx -y supabase@2.101.0 secrets list --project-ref $env:SUPABASE_PROJECT_REF
```

## Storage Setup

After the app is running, initialize storage from:

- UI: `/settings`
- API: `POST http://localhost:3000/api/setup-storage`

Reference doc: `STORAGE.md`.

## Recommended Skills For This Project

- Use the `browser:browser` skill after frontend changes to verify local routes like `http://localhost:3000`.
- Use `openai-docs` only when changing OpenAI integration details and you need current official guidance.
- For normal repo work, inspect the existing Supabase and API route files first before changing behavior.

## Safe Working Rules

- Do not commit `.env.local`.
- Do not expose `SUPABASE_ACCESS_TOKEN` or `SUPABASE_SERVICE_ROLE_KEY` in client code.
- Prefer migrations in `supabase/migrations` over one-off dashboard changes.
- Avoid touching unrelated in-progress edits unless the task explicitly requires it.
