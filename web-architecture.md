# EduStream Web — Architecture

Repo: https://github.com/shoaibhajj/EduStream-web.git

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js App Router | Latest stable version |
| Auth | `@clerk/nextjs` | Install latest compatible version |
| Database | Supabase | Shared backend with mobile |
| Storage | Supabase Storage + Cloudinary | Thumbnails and videos |
| Video playback | `react-player` | Web player |
| Styling | Tailwind CSS v4 + shadcn/ui | Token-based styling |
| Validation | Zod | Request and form validation |
| Language | TypeScript strict | No `any` |

## Standalone Repo Rule

This web repo is independent from the mobile repo. It must never import from the mobile project. Shared behavior happens through the database, storage, auth provider, and shared product rules — not through shared source code.

## Version Compatibility Rule

Always install the latest stable Next.js and the latest compatible `@clerk/nextjs`. Never manually pin an old Next.js version in `package.json` before checking Clerk compatibility. This prevents the same dependency conflict that happened in the previous attempt.

## Folder Structure

```text
/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   └── select-role/page.tsx
│   ├── (student)/
│   │   ├── page.tsx
│   │   ├── [yearId]/page.tsx
│   │   ├── [yearId]/[subjectId]/page.tsx
│   │   ├── course/[courseId]/page.tsx
│   │   └── watch/[lessonId]/page.tsx
│   ├── (teacher)/
│   │   ├── dashboard/page.tsx
│   │   ├── course/new/page.tsx
│   │   ├── course/[courseId]/edit/page.tsx
│   │   └── enrollments/page.tsx
│   ├── (admin)/
│   │   ├── years/page.tsx
│   │   ├── subjects/page.tsx
│   │   └── overview/page.tsx
│   └── api/
│       ├── webhooks/clerk/route.ts
│       └── cloudinary/upload/route.ts
├── components/
│   ├── ui/
│   ├── student/
│   ├── teacher/
│   └── admin/
├── actions/
├── lib/
│   ├── supabase-client.ts
│   ├── supabase-server.ts
│   ├── cloudinary.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Backend Model

- Web connects to the same Supabase project as mobile.
- Web uses Clerk for authentication.
- Web contains the Clerk webhook that creates or syncs `profiles` rows.
- Web can use server-side code for Cloudinary upload helpers.
- Signed Cloudinary lesson URLs should still be generated via the shared Supabase Edge Function so logic stays centralized.

## Data Access Rules

- Students can access only free preview or confirmed content.
- Teachers can only manage their own courses.
- Admin screens are web-only.
- Empty years and subjects must be filtered at query level.

## Invariants

1. Never expose server secrets to the client.
2. Never manually pin an outdated Next.js version.
3. Keep the web repo independent from the mobile repo.
4. Use the shared backend instead of duplicating backend logic.
