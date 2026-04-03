# CareerReady — Development Guide

## Project Overview

CareerReady is a job preparation web app for college graduates. It provides 8 interactive tools that guide users from self-discovery to landing their first job.

- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Hosting**: Cloudflare Pages + Workers (`@cloudflare/next-on-pages`)
- **Database**: Cloudflare D1 with Drizzle ORM
- **Auth**: Lucia Auth (session-based, optional — app works without login)
- **AI**: Claude API for optional enhancements
- **PDF**: @react-pdf/renderer for client-side PDF generation

## Architecture

Modular monolith. Each of the 8 tools is a self-contained module under `src/app/(app)/[tool-name]/`. Tools share UI components and a common data layer but are otherwise independent.

### The 8 Tools
1. `know-yourself` — Mindset, goals, skills, values, branding, power statement
2. `applications` — Application tips, experience builder, master application, assessment prep
3. `resumes` — Resume builder, cover letters, reference page, email templates
4. `interviews` — STAR method, question prep, company research, thank you notes
5. `job-search` — Networking, job boards, cold calling, job fairs, follow-up
6. `social-media` — Platform guides, online presence audit
7. `landing-the-job` — Workplace success, self-evaluation tracker
8. `contact-log` — Application tracker, follow-up reminders

## Coding Standards

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig)
- No `any` types — use `unknown` and narrow, or define proper interfaces
- Prefer `interface` for object shapes, `type` for unions/intersections
- Export types from each module's `types.ts` file
- Use `as const` for literal arrays and objects

### File Naming
- Components: `PascalCase.tsx` (e.g., `SkillsInventory.tsx`)
- Utilities/hooks: `camelCase.ts` (e.g., `useLocalStorage.ts`)
- Route files: Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)
- Database: `schema.ts`, `migrations/` directory
- Types: `types.ts` per module

### File Structure Rules
- Each tool directory contains its own `components/`, `types.ts`, and `actions.ts` (server actions)
- Shared components go in `src/components/ui/` (design system) or `src/components/layout/` (app shell)
- Do NOT put tool-specific components in the shared directory
- Keep components under 150 lines — extract sub-components when they grow
- One component per file

### Component Patterns

**Shared UI components** (`src/components/ui/`):
- Button, Input, Textarea, Select, Checkbox, RadioGroup
- Card, Dialog, Sheet, Tooltip
- Worksheet (interactive fill-in form wrapper)
- Checklist (interactive checklist with progress)
- ProgressBar, StepIndicator

**Tool-specific components** (`src/app/(app)/[tool]/components/`):
- Contain tool business logic
- Import shared UI components
- Use server actions for data mutations

**Data components**:
- Use the storage adapter (`src/lib/storage/`) — never call localStorage or D1 directly from components
- The storage adapter handles the anonymous (localStorage) vs authenticated (D1) split transparently

### Tailwind Patterns
- Use the design system's color tokens (defined in `tailwind.config.ts`), never raw hex values
- Prefer Tailwind utilities over custom CSS
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)
- Dark mode: not in V1, but use `bg-background` / `text-foreground` tokens for future compatibility

### Data Layer
- **Storage adapter pattern**: `src/lib/storage/adapter.ts` provides a unified interface
  - `getProfile()`, `saveProfile()`, `getResumes()`, `saveResume()`, etc.
  - Implementation checks if user is authenticated → D1, otherwise → localStorage
  - All data shapes are defined in `src/types/data.ts`
- **Server actions**: Use Next.js server actions for authenticated mutations
- **Client-side**: Use React hooks (`useProfile()`, `useResumes()`, etc.) that wrap the adapter

### Cross-Tool Data Flow
Skills, brand statement, and power statement from "Know Yourself" flow into other tools:
- Access via `getProfile()` — the adapter handles fetching from the right source
- Components that consume cross-tool data should show a helpful prompt if the source data is empty (e.g., "Complete the Skills Inventory in Know Yourself to auto-populate this section")

## Testing

- **Unit tests**: Vitest for utilities, data transformations, storage adapter
- **Component tests**: Vitest + Testing Library for interactive components
- Test files: colocated with source (`*.test.ts` / `*.test.tsx`)
- Minimum coverage: storage adapter and cross-tool data flow must be tested

## Git Workflow

- `main` — production (auto-deploys to Cloudflare Pages)
- `dev` — integration branch
- Feature branches: `feat/tool-name-feature` (e.g., `feat/resumes-builder`)
- Bug fixes: `fix/description`
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- PR into `dev`, then `dev` into `main` for releases

## What to Avoid

- **No LACOE references**: The source guide is by LACOE. Never reference this organization in any code, copy, or comments. All content is original.
- **No hardcoded colors**: Always use Tailwind tokens from the design system
- **No direct localStorage/D1 calls**: Always use the storage adapter
- **No tool-specific code in shared directories**: Keep tool logic in tool directories
- **No heavy client-side libraries**: Keep bundle size small. Avoid moment.js (use date-fns), avoid lodash (use native methods)
- **No server-side secrets in client code**: Claude API key stays in Workers/server actions only
- **No blocking AI calls**: AI features are always async with loading states and graceful fallbacks
- **No gender-specific language**: The original guide has gendered content (pp. 13-14). Use inclusive language throughout.
- **No outdated advice**: The guide is from 2017. Modernize references (e.g., Twitter → X, add Instagram/TikTok awareness, update job board references, use modern resume conventions)

## Common Pitfalls

1. **Cloudflare D1 limitations**: D1 has a 1MB row size limit. Store large JSON objects thoughtfully. Consider splitting resume content across tables if needed.
2. **`@cloudflare/next-on-pages` compatibility**: Not all Next.js features work on Cloudflare. Avoid `next/image` optimization (use Cloudflare Images or unoptimized), avoid ISR (use SSR or static), check middleware compatibility.
3. **localStorage size limits**: ~5MB per origin. Monitor usage, especially if users create many resumes. Show warnings at 80% capacity.
4. **PDF generation**: `@react-pdf/renderer` runs client-side and can be heavy. Lazy-load the PDF module. Show loading state during generation.
5. **Data migration**: When a user creates an account, localStorage → D1 migration must be atomic. Handle partial failures gracefully.

## Quick Reference

| Task | Location |
|------|----------|
| Add a new UI component | `src/components/ui/` |
| Add a tool feature | `src/app/(app)/[tool]/components/` |
| Modify database schema | `src/lib/db/schema.ts` + new migration |
| Add an AI feature | `src/lib/ai/` + `src/app/api/ai/` |
| Add a storage method | `src/lib/storage/adapter.ts` |
| Add a PDF template | `src/lib/pdf/templates/` |
| Run tests | `pnpm test` |
| Deploy to Cloudflare | `npx @cloudflare/next-on-pages && npx wrangler pages deploy .vercel/output/static` |
| Deploy preview | Push to any branch (auto-deploys) |
| Deploy production | Merge to `main` |

## Shared Hooks & Components (added 2026-03-20)

- **`useProfileSave`** — handles get/merge/set profile pattern for 12+ pages. Returns `{ saved, save, storage }`.
- **`SavedIndicator`** — `aria-live="polite"` indicator, used across all save-capable pages.
- **`ToggleButton`** — checkbox-style toggle with `role="checkbox"` and `aria-checked`.
- **`TabStrip`** — accessible tab bar with `role="tablist/tab"` and `aria-selected`.
- **`Breadcrumb`** — back-navigation link, used on all 22 sub-pages.
- **`AICoverLetterForm`** — AI cover letter generator in `resumes/cover-letter/components/`.
- **`resumeToText`** — converts Resume object to plain text for AI prompts.
- **`useToolProgress`** — reads localStorage to check which tools have saved data. Returns `{ started, count, total }`. Used in Sidebar for progress bar + checkmarks.
- **`NextStepLink`** — bottom-of-page "Next step: [Tool] →" link. Used on all 22 sub-tool pages to chain the guided flow.

## i18n (added 2026-03-31)

- **Architecture:** JSON translation files + React Context. No external i18n library.
- **Files:** `src/lib/i18n/en.json`, `src/lib/i18n/zh.json` (~1210 lines each, must stay in parity)
- **Context:** `src/lib/i18n/LanguageContext.tsx` — provides `useLanguage()` hook with `t(key)`, `language`, `setLanguage`
- **`useTranslations()`** — returns full translation object for array access (checklist items, audit items) since `t()` only returns strings
- **Toggle:** `src/components/ui/LanguageToggle.tsx` — in Sidebar (desktop) and TopNav (mobile)
- **localStorage key:** `careerready-lang` — defaults to `"en"`
- **Font stack:** Inter + PingFang SC + Microsoft YaHei + Hiragino Sans GB (system Chinese fonts, no downloads)
- **What gets translated:** All UI text, nav, headings, buttons, placeholders, aria-labels, callouts, tips
- **What stays English:** User-entered data, AI responses, resume PDF content, URLs, brand name "CareerReady"
- **Pages outside `(app)` layout** (marketing, not-found, error) wrap content in their own `<LanguageProvider>`
- **SEO metadata** lives in `layout.tsx` files (server components), not in page.tsx (client components)

## AI Routes

- **`AI_MODEL`** constant in `src/lib/ai/client.ts` — single source of truth for the Claude model version used across all 7 AI routes. Change it once to update everywhere.
- All AI routes import `AI_MODEL` via `src/lib/api/ai-route-helpers.ts` re-export.
- Rate limiting falls back to in-memory when `getRequestContext()` is unavailable (local dev).

## Session Log

### 2026-04-03 — main

**What was done:**
- Full beta test: Playwright walkthrough of all 8 tools as a real user (30 min)
- Fixed 3 bugs: 40+ missing i18n keys, CSP blocking PDF WASM, deprecated meta tag
- 8 UX improvements: sidebar progress bar, NextStepLink on 22 pages, tool reorder (Job Search before Interviews, Contact Log before Landing the Job), save indicator redesign, contact log date fields, hard skills clarity, "Earned Secret" → "Lesson Learned", clear data button
- Expert panel: 10 executives × 3 rounds, ~60 auto-fixes (copy, a11y, focus states, touch targets, error handling, security headers, i18n hardcoded strings)
- Phases renamed: "Market Your Brand" → "Apply & Prepare", "Prove Yourself" → "Follow Through"
- Created `/beta-test` skill at ~/.claude/skills/beta-test/
- CSP tightened: removed `unsafe-eval`, added HSTS, cache-control headers

**Open items:**
- ~40 subjective expert panel findings flagged as "Needs Input" (mobile focus trap, component refactoring, contact log search, service worker)
- CSP change removed `unsafe-eval` — verify on production (Next.js may need it)
- `CLAUDE_API_KEY` still not set on Cloudflare — AI features return 503
- Not yet pushed to origin

**Next session:** Push and deploy. Verify CSP doesn't break production. Set `CLAUDE_API_KEY` on Cloudflare.

### 2026-03-31 — main

**What was done:**
- Built full bilingual i18n system: 970 EN + 970 ZH strings across 92 files
- LanguageContext + useLanguage hook + LanguageToggle in sidebar/header
- Chinese system fonts added to font stack
- 10 layout.tsx files created to restore SEO metadata after client component conversion
- CSP + security headers via `public/_headers`
- Expert panel: 10 executives × 3 rounds = ~139 findings applied (copy, a11y, mobile, SEO, design)
- OG image redesigned (dark gradient, bilingual tagline)
- JSON-LD enriched (featureList, inLanguage, availability)
- hreflang alternates, expanded keywords, viewport export
- 2 GitHub Issues created (#1 remote storage, #2 auth V2)
- Deployed to Cloudflare Pages (commit `53da382`)

**Open items:**
- `CLAUDE_API_KEY` not set on Cloudflare — AI features return 503
- D1 migration `0002` not yet run on remote
- `.github/workflows/ci.yml` not pushed

**Next session:** Run `npx wrangler secret put CLAUDE_API_KEY` and D1 migrations in Terminal

### 2026-03-23 — main

**What was done:**
- Expert panel review: 10 executives × 3 rounds + 30 anti-AI text fixes = 180 findings applied
- Extracted `AI_MODEL` constant across 7 AI routes
- Fixed rate limiter crash in local dev, timer leak in `useSaveIndicator`
- Added skip-to-content, `focus-visible` consistency, backdrop blur
- Rewrote all tool descriptions to be outcome-focused and conversational
- Deployed to Cloudflare Pages (commit `dbb7f58`)

**Open items:**
- Same as 2026-03-20 (API key, D1 migrations, CI workflow)
- 12 components exceed 150-line limit per coding standards (noted, not refactored)

**Next session:** Run `npx wrangler secret put CLAUDE_API_KEY` and D1 migrations

### 2026-03-20 — main

**What was done:**
- Expert panel (180 fixes), review, refactor, polish, preflight (18/18), security, roast — all applied
- Built AI cover letter generator (paste JD + resume, get tailored letter)
- Tested Resume Builder + Cover Letter Builder E2E with Playwright, exported PDFs
- Deployed to Cloudflare Pages

**Open items:**
- `.github/workflows/ci.yml` not pushed (OAuth needs `workflow` scope)
- `CLAUDE_API_KEY` not set on Cloudflare — AI features return 503
- D1 migration `0002` not yet run on remote

**Next session:** Run `npx wrangler secret put CLAUDE_API_KEY` and D1 migration
