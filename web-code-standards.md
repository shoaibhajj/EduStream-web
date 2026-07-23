# EduStream Web — Code Standards

Repo: https://github.com/shoaibhajj/EduStream-web.git

## General Rules

- Read `web-project-overview.md` and `web-architecture.md` before implementing any feature.
- Build in the exact order defined in `web-build-plan.md`.
- Keep UI, business logic, and data access separated.
- Prefer clear code over clever abstractions.

## TypeScript

- Strict mode enabled.
- Never use `any`.
- Explicitly type function parameters and return values.

## Next.js Rules

- App Router only.
- Server Components by default.
- Add `"use client"` only when needed.
- Keep API route handlers small and focused.
- Put mutations in Server Actions when appropriate.
- Revalidate affected paths after successful mutations.

## Files and Naming

- Folders use kebab-case.
- Components use PascalCase.
- Utility files use camelCase.
- One component per file.
- Use named exports for components.

## Error Handling

- Every async function uses try/catch.
- Never expose raw backend or provider errors to users.
- Log errors with a context prefix like `[api/clerk-webhook]`.

## Supabase Rules

- Use the server client in server contexts.
- Use the browser client only in client contexts.
- Always handle returned errors.
- Scope reads and writes correctly to the current user.

## Approved Dependencies

- `next`
- `react`
- `react-dom`
- `@clerk/nextjs`
- `@supabase/supabase-js`
- `@supabase/ssr`
- `react-player`
- `zod`
- `svix`
- `cloudinary`
- `tailwindcss`
- `shadcn/ui`
