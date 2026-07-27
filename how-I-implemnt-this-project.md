# Moallem Academy Web — Implementation Log

This file tracks exactly how the web project is being implemented feature by feature.  
Each feature should be added as a new section with:
- the goal
- exact commands
- files created or updated
- code snippets
- short explanation
- what to verify locally

---

## Feature 01 — Establish Real Web Foundation

### Goal

Set up the real foundational web architecture for **Moallem Academy** using:

- Next.js App Router
- Clerk authentication
- Supabase foundation
- production-minded folder structure
- Arabic-first / RTL-ready app shell
- architecture that will not fight mobile later

This feature is about building the **real app foundation**, not mock/demo architecture.

---

## Decisions used for this feature

- Root structure: `app/`
- Package manager: `npm`
- Styling direction: Tailwind v4
- Existing repo is kept as-is, including all markdown files
- Production-facing product name: **Moallem Academy**
- Internal markdown files may still mention EduStream for continuity

---

## Step 1 — Clone the existing repo

### Command

```bash
git clone https://github.com/shoaibhajj/EduStream-web.git
cd EduStream-web
```

### Why this matters

The repo already contains the required project context markdown files.  
They must stay in place and the web app should be built in the same repository.

### Verify

```bash
ls *.md
```

You should still see all markdown files in the repo root.

---

## Step 2 — Create the Next.js app in a temporary folder

### Command

```bash
cd ..
npx create-next-app@latest temp-moallem \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

When prompted:
- Use Turbopack: choose the option you want locally
- Keep App Router
- Keep TypeScript
- Keep Tailwind

### Why this matters

The repo is not empty, so creating the app directly inside it is not safe.  
Creating it in a temp folder avoids overwriting the markdown files.

---

## Step 3 — Move the generated app into the real repo

### Command

```bash
cp -r temp-moallem/. EduStream-web/
rm -rf temp-moallem
cd EduStream-web
```

### Why this matters

This merges the clean Next.js app into the existing repo while keeping the markdown files.

### Verify

```bash
ls *.md
ls app
```

You should see:
- all markdown files still present
- the `app/` folder created

---

## Step 4 — Install real foundation dependencies

### Command

```bash
npm install @clerk/nextjs @supabase/supabase-js @supabase/ssr zod svix cloudinary
```

### Why this matters

These are the real foundation packages needed for:
- Clerk auth
- Supabase database access
- validation
- Clerk webhook support
- future Cloudinary-aware media support

### Verify

```bash
npm ls @clerk/nextjs
npm ls @supabase/ssr
```

---

## Step 5 — Create environment variables

### File to create

`.env.local`

### Code

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/select-role

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxx
```

### Why this matters

The app should connect to real services from the foundation stage.  
No secret values should be hardcoded in source files.

### Verify

```bash
grep ".env.local" .gitignore
```

If it is missing, add `.env.local` to `.gitignore`.

---

## Step 6 — Use Clerk `proxy.ts` for route protection

### File to create

`proxy.ts`

### Code

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### Why this matters

This is the official current Clerk approach for Next.js App Router in the newer setup.  
It protects non-public routes from the foundation stage.

---

## Step 7 — Update the root layout for Clerk and RTL

### File to update

`app/layout.tsx`

### Code

```ts
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Moallem Academy | أكاديمية المعلم',
  description: 'منصة أكاديمية المعلم للتعليم الإلكتروني',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Why this matters

This does three important things:
- wraps the app with Clerk
- sets Arabic as the default app direction
- sets RTL from the start so directionality is not delayed to later features

---

## Step 8 — Replace the default starter home page

### File to update

`app/page.tsx`

### Code

```ts
export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-6 px-6 py-16">
        <p className="text-sm text-text-secondary">Moallem Academy</p>
        <h1 className="text-3xl font-semibold">Real web foundation is active.</h1>
        <p className="max-w-2xl text-base text-text-secondary">
          Next.js App Router, Clerk authentication, and Supabase foundation are now connected for the web app.
        </p>
      </section>
    </main>
  )
}
```

### Why this matters

The default Next.js starter content should be removed immediately.  
The project should show Moallem Academy branding and real foundation status instead of placeholder starter UI.

---

## Step 9 — Remove starter assets

### Command

Windows cmd:

```bash
del public\next.svg
del public\vercel.svg
```

Git Bash:

```bash
rm -f public/next.svg public/vercel.svg
```

### Why this matters

These files are part of the default starter page and cause unnecessary warnings and leftover boilerplate.

---

## Step 10 — Update Tailwind v4 global theme tokens

### File to update

`app/globals.css`

### Code

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", sans-serif;
  --color-background: #F6F7FB;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F9FAFB;
  --color-border: #E7EAF3;
  --color-text-primary: #101828;
  --color-text-secondary: #6A7282;
  --color-text-muted: #99A1AF;
  --color-accent: #7C5CFC;
  --color-accent-light: #F3E8FF;
  --color-success: #10B981;
  --color-success-light: #D0FAE5;
  --color-warning: #FF8904;
  --color-error: #EF4444;
  --color-locked: #99A1AF;
}
```

### Why this matters

This aligns the app with the project UI token document and keeps the styling foundation consistent from the start.

---

## Step 11 — Create the production-minded folder structure

### Command

```bash
mkdir -p "app/(auth)/sign-in/[[...sign-in]]"
mkdir -p "app/(auth)/sign-up/[[...sign-up]]"
mkdir -p "app/(auth)/select-role"
mkdir -p "app/(student)"
mkdir -p "app/(teacher)"
mkdir -p "app/(admin)"
mkdir -p "app/api/webhooks/clerk"
mkdir -p "app/api/cloudinary/upload"
mkdir -p components/ui
mkdir -p components/student
mkdir -p components/teacher
mkdir -p components/admin
mkdir -p actions
mkdir -p lib
mkdir -p types
```

### Why this matters

This creates the structure described by the architecture plan:
- route groups for auth, student, teacher, admin
- api routes
- shared lib/types/actions areas
- separation that can grow safely with the real product

---

## Step 12 — Add Clerk auth pages

### File to create

`app/(auth)/sign-in/[[...sign-in]]/page.tsx`

```ts
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  )
}
```

### File to create

`app/(auth)/sign-up/[[...sign-up]]/page.tsx`

```ts
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  )
}
```

### Why this matters

These are the real auth entry pages using Clerk’s official components.  
This is enough for the base auth foundation without overbuilding role logic yet.

---

## Step 13 — Add Supabase browser and server helpers

### File to create

`lib/supabase-client.ts`

```ts
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### File to create

`lib/supabase-server.ts`

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {}
        },
      },
    }
  )
}
```

### File to create

`lib/supabase-admin.ts`

```ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

### Why this matters

This sets up:
- browser-safe Supabase client
- server-side cookie-aware Supabase client
- separate admin/service client for server-only tasks

This keeps the architecture safe and flexible for real product use.

---

## Step 14 — Add shared product types

### File to create

`types/index.ts`

### Code

```ts
export type UserRole = 'student' | 'teacher' | 'admin'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export type MediaSource = 'cloudinary_upload' | 'external_link'

export type LessonMedia = {
  id: string
  lesson_id: string
  source_type: MediaSource
  cloudinary_public_id: string | null
  external_url: string | null
  created_at: string
}
```

### Why this matters

This is the first shared product data direction for:
- users and roles
- profile alignment
- media architecture that supports both uploaded media and external media links

This avoids building a web-only video model that would later break mobile requirements.

---

## Step 15 — Run local verification

### Command

```bash
npm run dev
```

### Also run

```bash
npx tsc --noEmit
```

### What to verify

- `/` loads correctly
- home page shows **Moallem Academy**
- `/sign-in` loads Clerk sign-in
- `/sign-up` loads Clerk sign-up
- protected routes redirect correctly
- TypeScript passes
- `.env.local` is not tracked by git
- all markdown files still exist in the root

---

## Step 16 — Commit the feature foundation

### Command

```bash
git add .
git commit -m "feat(01): establish real web foundation"
git push origin main
```

### Why this matters

This saves the full real foundation as the first implementation feature for the web app.

---

## Feature 01 completion checklist

- [x] Real Next.js App Router foundation created
- [x] Clerk added at the app root
- [x] Clerk route protection added with `proxy.ts`
- [x] Supabase browser/server/admin helpers added
- [x] Environment variable structure prepared
- [x] Production-minded folder structure created
- [x] Moallem Academy branding applied on app-facing foundation
- [x] Arabic-first / RTL root layout direction applied
- [x] No mock data used as the foundation path
- [x] Media architecture direction started with shared `LessonMedia` shape

---

## Notes for future features

- Role-selection logic can be expanded later
- Clerk webhook sync to `profiles` should be added in a later auth/data feature
- Supabase schema and real table reads/writes will expand in later features
- Localization files and full i18n structure can be added in the RTL/localization feature
- Cloudinary upload implementation should come later, but the architecture direction is already prepared