# CLAUDE.md

답변은 '한글'로 합니다.
기획 후 '가보자고' 입력하면 코딩을 시작합니다.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Law-fi (로파이) is a premium anonymous professional lounge for Korean lawyers and law students. The platform includes a user-facing Next.js web app and an admin backoffice, built as a Turborepo monorepo.

## Tech

Turborepo, pnpm(v9), Next.js 15(App Router, React Compiler), Supabase(Auth/Storage), Prisma(DB/ORM), TailwindCSS v4, shadcn/ui, Framer Motion, Zustand, TanStack Query

## Coding Standards & Rules

- Document Compression: AI responses and generated docs must be strictly compressed. Omit emojis, excessive line breaks, and human-centric formatting.
- SSoT & DRY: Strict adherence. Prisma schema is the single source of truth for all data models. Do not repeat logic.
- DB Access: Supabase SDK for Auth/Storage ONLY. Use Prisma for all DB CRUD operations.
- Component Naming: [Domain/Location][Target][Action/State][Form/Type] (e.g., AuthEmailCheckForm)
- Styling: Use CSS Semantic variables ONLY (e.g., var(--accent-primary)). No hardcoded hex values.
- Animation: Use Framer Motion <AnimatePresence> for transitions.
- TDD: When testing is required, strictly follow Red-Green-Refactor cycle.

## Commands

All commands are run from the repo root using `pnpm`.

```bash
# Development
pnpm dev                  # Start all apps in dev mode (turbo)
pnpm build                # Build all apps
pnpm lint                 # Lint all packages
pnpm check-types          # TypeScript type checking
pnpm format               # Prettier format all files

# Database (Prisma - runs in packages/db context)
pnpm db:generate          # Generate Prisma client
pnpm db:push              # Push schema to DB (no migration file)
pnpm db:migrate           # Create and apply migration
pnpm db:studio            # Open Prisma Studio
```

To run a single app directly:

```bash
cd apps/web && pnpm dev
cd apps/admin && pnpm dev
```

## Architecture

### Monorepo Structure

```
apps/
  web/       # Next.js 15 (App Router) — main user service
  admin/     # Vite + React — backoffice (early stage)
packages/
  db/        # Prisma schema + generated client
  supabase/  # Supabase client utilities (browser/server/middleware)
  ui/        # shadcn/ui components
  config-tailwind/  # Shared design tokens (CSS variables)
  eslint-config/
  typescript-config/
```

Internal packages are imported as `@law-fi/*` (e.g., `@law-fi/db`, `@law-fi/supabase`, `@law-fi/ui`).

### Admin App (`apps/admin`) 특수 규칙

Admin은 **Vite + React SPA** (Refine 프레임워크). Next.js가 아니므로 Server Actions, Server Components, Middleware 없음.

| 항목 | Web (`apps/web`) | Admin (`apps/admin`) |
|---|---|---|
| 런타임 | Node.js (서버 포함) | 브라우저 전용 SPA |
| DB 접근 | Prisma (Server Actions 경유) | **Supabase SDK 직접 사용** (Prisma 불가) |
| 인증 관리 | Supabase server client | Refine `authProvider` 객체 |
| 상태 관리 | Zustand | Refine 내장 Context |

**Prisma 규칙 예외**: Admin SPA는 브라우저에서 실행되므로 Prisma(Node.js 전용) 사용 불가. `supabase.from()`으로 DB를 직접 조회하되, Supabase RLS가 적용된 상태여야 한다.

---

### Web App Layer Architecture (FSD-inspired)

The `apps/web/src/` follows strict unidirectional dependency flow:

| Layer    | Path                      | Role                             | Rules                                        |
| -------- | ------------------------- | -------------------------------- | -------------------------------------------- |
| Routing  | `app/*`                   | Next.js pages & API routes       | Server Components only, no UI markup         |
| Widgets  | `components/widgets/*`    | Multi-feature assemblers         | Orchestrates features, manages Zustand state |
| Features | `components/features/*`   | Single-feature Client Components | No imports between feature directories       |
| Actions  | `lib/actions/*.action.ts` | Server Actions for all mutations | —                                            |
| Store    | `store/*.ts`              | Zustand state                    | Client state only                            |

No upward imports (features cannot import from widgets, etc.).

### Auth & Onboarding Flow

Supabase handles auth (Email + Password + OTP). After signup:

1. Email verification → `/auth/callback`
2. Onboarding wizard: nickname → role selection → document upload
3. Admin reviews documents → sets `verificationStatus` to `APPROVED` or `REJECTED`

Supabase clients:

- Browser: `@law-fi/supabase/client`
- Server Components/Actions: `@law-fi/supabase/server`
- Middleware: `@law-fi/supabase/middleware`

Zod validation schemas: `@law-fi/supabase/zod/auth`

### Database

Single source of truth: `packages/db/prisma/schema.prisma`

Key models: `Profile` (with `UserRole`: ADMIN/LAWYER/STUDENT/GUEST and `VerificationStatus`: NOT_SUBMITTED/PENDING/APPROVED/REJECTED)

Prisma client is re-exported from `@law-fi/db`.

### Design System

Theme name: Aerocano (light/dark). Only semantic CSS variables are used — never hardcoded Tailwind color classes.

Semantic tokens (defined in `packages/config-tailwind/theme.css`):
`--bg-base`, `--bg-surface`, `--text-primary`, `--text-secondary`, `--accent-primary`, `--accent-hover`, `--accent-foam`, `--border-subtle`

Shape conventions: buttons use `rounded-full`, cards/modals use `rounded-2xl`.

Animations use Framer Motion (fade/slide transitions).

## Code Style

- **Formatter:** Prettier — no semicolons, tabs (2), single quotes, 100 char width, trailing commas off
- **Paths:** Always use `@/*` alias (maps to `src/*` in `apps/web`)
- **TypeScript:** Strict mode enabled

## Environment Variables

Required in `.env` (root level, gitignored):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
DATABASE_URL=
```

## Anti-patterns (DO NOT)

- DO NOT place source code outside `apps/web/src/`.
- DO NOT cross-import between feature components. Assemble them in widgets.
- DO NOT call Prisma directly from client components. Use lib/actions.

# References

Architecture: @docs/dev-log.md
Theme: @packages/config-tailwind/theme.css // @docs/design-system.md
