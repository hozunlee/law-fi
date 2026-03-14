# Law-fi Suggested Commands

This project uses `pnpm` and `Turborepo`. Run all scripts from the project root `/Users/hoya/nodejs/law-fi`.

## Running the App
* Start development server: `pnpm dev`
* Build production artifacts: `pnpm build`

## Code Quality & Formatting
* Lint codebase: `pnpm lint`
* Format files: `pnpm format`
* Type-checking: `pnpm check-types`

## Database (Prisma)
* Generate Prisma client: `pnpm db:generate`
* Push schema changes to DB: `pnpm db:push`
* Run database migrations: `pnpm db:migrate`
* Open Prisma Studio: `pnpm db:studio`
* Run DB tests: `pnpm db:test`

## System Utilities (Darwin/Mac)
Since the system is macOS (Darwin), standard BSD utilities are used (e.g. `ls`, `grep`, `find`, `cat`, etc.).