# Childcare

A public, forum-style website built by an operations management research team (Jun Li,
University of Michigan; Senthil Veeraraghavan, University of Pennsylvania; Yueyang Zhong,
London Business School) to share working families' experiences with childcare. Seeded with 55
anonymized responses from a July 2026 survey within the MSOM Society; visitors can add their
own sharing in the same five-question format, comment on existing sharings, and browse a live
summary of major topics.

## Features

- **Topics dashboard** (`/`) — word cloud of what families talk about (waiting list, waiting
  time, availability, and access lead), representative quotes, and recent sharings.
- **Browse** (`/sharings`) — all sharings, filterable by topic category and full-text search.
- **Sharing detail** (`/sharings/[id]`) — the five answers with a public comment thread.
- **Share your experience** (`/share`) — form mirroring the original survey (all questions
  optional, anonymous by default).
- **Discussion Board** (`/discussions`) — anonymous, account-free threads for research ideas,
  brainstorming, solutions, and policy. Anyone can start a discussion or reply; each post has
  an optional, publicly displayed contact email so collaborators can choose to take a
  conversation offline. Direct team email addresses are listed in the intro.
- **About** (`/about`) — research team bios with photos, motivation, privacy notes.
- **Moderation** (`/admin`) — password-protected; hide/unhide or delete any sharing, comment,
  discussion, or reply.

## Theme engine

`lib/themes.ts` tags each sharing by case-insensitive keyword matching over its free-text
answers, at read time. On Browse Sharings, waitlists, waiting time, availability, and access
are one filter, “Waitlist & access.” The home-page word cloud still shows those words
separately, and they stay the largest. To tune the categories, edit the keyword lists in
that file.

## Anti-spam

Honeypot form field plus a per-IP in-memory rate limit (5 sharings / 10 comments per
10 minutes). For multi-instance deployments, replace `lib/rate-limit.ts` with a shared store.

## Running locally

```bash
npm install
npx prisma db push      # creates prisma/dev.db (SQLite) and generates the client
node prisma/seed.mjs    # seeds the 55 anonymized survey responses (idempotent)
npm run dev             # http://localhost:3000
```

Configuration in `.env`:

- `DATABASE_URL` — SQLite by default (`file:./dev.db`).
- `ADMIN_PASSWORD` — password for `/admin` (change before deploying; default `childcare-admin`).

## Seed data pipeline

`../tools/export_survey_seed.py` reads the Qualtrics export
(`../survey/Childcare Experience Survey_July 26, 2026.xlsx`), drops the question-wording header
row, decodes Q2 (1=Yes, 2=No), strips ALL identifying columns (IP address, geolocation,
timestamps, response IDs), and writes `prisma/seed-data.json`. Respondents are labeled
"Anonymous". Re-run it and then `node prisma/seed.mjs` to refresh from a new export
(the seeder skips if survey rows already exist; it still renames any leftover
"Survey respondent #N" labels to Anonymous).

## Deploying publicly

1. Change `ADMIN_PASSWORD` in the host's environment settings.
2. Move the database to a hosted Postgres (Neon/Supabase): set `provider = "postgresql"` in
   `prisma/schema.prisma`, point `DATABASE_URL` at it, run `npx prisma db push` and the seeder.
   (SQLite on Vercel is ephemeral — user posts would not persist.)
3. Deploy to Vercel (`vercel`) or any Node host (`npm run build && npm start`).

## Stack

Next.js 16 (App Router, server actions) · React 19 · Tailwind CSS 4 · Prisma 6 · SQLite
