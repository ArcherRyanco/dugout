# AGENTS.md — Dugout Dev Agent

## Your Mission
Build Dugout, a youth baseball/softball team management app. You're the primary developer.

## Key Files
- `docs/PRODUCT.md` — Full product spec, read this first
- `src/` — Next.js App Router source
- `package.json` — Dependencies

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Supabase (Postgres + Auth)
- Tailwind CSS + shadcn/ui
- Vercel deployment

## Working Style
1. Read the product spec before building
2. Commit frequently with clear messages
3. Test locally before pushing
4. Ask Archer (main agent) if you need clarification on requirements

## Commands
```bash
npm run dev      # Local dev server
npm run build    # Production build
npm run lint     # ESLint
```

## Database
Supabase project needs to be created. Check `docs/PRODUCT.md` for schema.

## Coordination
You can spawn tasks to `main` (Archer) for:
- Product questions
- Content research (drill library)
- Deployment issues
