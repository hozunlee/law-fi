# Law-fi Style and Conventions

## Coding Standards
* **Languages**: Prefer TypeScript over JavaScript.
* **Documentation**: Include detailed comments in all code.
* **Naming**: Function names must use camelCase.
* **Error Handling**: Use `try-catch` blocks for error handling.

## Design & UI
* **Colors**: Avoid hardcoded color values. Always use CSS Variables (Semantic Tokens) defined in `design-system.md`.
* **Animations**: Apply smooth Fade/Slide animations for screen transitions and modal popups using Framer Motion.

## Architecture & Security
* **Single Source of Truth**: Prisma schema is the definitive standard for all data structures.
* **Row Level Security (RLS)**: Strict isolation based on User Role when accessing Supabase DB.
* **Verification Security**: Immediately "Hard Delete" uploaded verification images (IDs) from Supabase Storage once approved.