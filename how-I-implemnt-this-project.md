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


------


---

## Feature 02 — Configure Clerk Authentication Foundation

### Goal

Set up the real Clerk authentication layer for **Moallem Academy** on top of the established web foundation with:

- correct Clerk root integration
- sign-in and sign-up routes
- localized auth routes
- public and protected route behavior
- signed-in and signed-out app awareness
- role-ready auth structure without overbuilding authorization
- decisions that stay compatible with future mobile app identity flows

This feature is about the **real authentication foundation**, not full dashboard implementation.

---

## Decisions used for this feature

- Next.js version: 16.x App Router
- Clerk integration uses `proxy.ts` in the root for current Next.js 16 setup
- Auth pages live under localized routes: `app/[locale]/sign-in/...` and `app/[locale]/sign-up/...`
- Clerk stays on prebuilt auth components for stability, but the pages are wrapped with a branded shell
- Auth role logic is not fully implemented yet; only the foundation is prepared
- Locale support begins now because Arabic-first and RTL-first are product-level requirements, not later polish work

---

## Step 1 — Verify Clerk environment variables

### File to verify

`.env.local`

### Code

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Why this matters

Clerk must be configured with real environment variables from the start.  
Redirect values are kept simple at this stage because the app does not yet implement full role-based destination routing.

### Verify

```bash
npm run dev
```

The app should start without Clerk key errors.

---

## Step 2 — Keep Clerk mounted at the app root

### File to update

`app/layout.tsx`

### Code

```ts
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moallem Academy | أكاديمية المعلم",
  description: "منصة أكاديمية المعلم للتعليم الإلكتروني",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

### Why this matters

When routes moved under `app/[locale]`, the root layout still had to keep the required `<html>` and `<body>` tags.  
Next.js App Router requires that structure in the root layout even when localization is handled in nested layouts.

---

## Step 3 — Add locale-aware Clerk and next-intl providers

### File to create

`app/[locale]/layout.tsx`

### Code

```ts
import { ClerkProvider } from "@clerk/nextjs";
import { arSA, enUS } from "@clerk/localizations";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <ClerkProvider localization={locale === "ar" ? arSA : enUS}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div dir={direction}>{children}</div>
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
```

### Why this matters

This keeps Clerk and translations locale-aware while preserving Arabic RTL and English LTR behavior.  
It also ensures Clerk’s own built-in copy follows the active locale instead of only translating the surrounding page shell.

---

## Step 4 — Add Next.js 16 `proxy.ts` for Clerk + locale routing

### File to update

`proxy.ts`

### Code

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default clerkMiddleware(async (_auth, req) => {
  return handleI18nRouting(req);
});

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### Why this matters

Clerk requires `clerkMiddleware()` to run so Clerk components and auth helpers work correctly.  
At the same time, locale routing had to be composed into the same `proxy.ts` so `/` redirects into locale-aware routes like `/ar` and `/en`.

### Verify

- `/` redirects into the localized app
- `/ar` loads
- `/en` loads
- Clerk no longer throws the `auth() was called but Clerk can't detect usage of clerkMiddleware()` error

---

## Step 5 — Add i18n routing config

### Files to create

- `i18n/routing.ts`
- `i18n/navigation.ts`
- `i18n/request.ts`

### Code

`i18n/routing.ts`
```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
});
```

`i18n/navigation.ts`
```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

`i18n/request.ts`
```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "ar" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.ts`)).default,
  };
});
```

### Why this matters

Localization needed to be introduced now, not later, because Arabic-first and English-secondary affect routes, layout direction, auth pages, and future app shell structure.  
Using locale-based routing from the start avoids retrofitting all pages later.

---

## Step 6 — Add locale message files

### Files to create

- `messages/ar.ts`
- `messages/en.ts`

### Code

`messages/ar.ts`
```ts
const messages = {
  HomePage: {
    brand: "أكاديمية المعلم",
    title: "منصة أكاديمية المعلم للتعليم الإلكتروني",
    description: "تصفح الكورسات وابدأ رحلتك التعليمية.",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    startNow: "ابدأ الآن",
  },
  auth: {
    signIn: {
      title: "مرحباً بعودتك",
      description: "سجّل الدخول للوصول إلى رحلتك التعليمية داخل أكاديمية المعلم.",
    },
    signUp: {
      title: "أنشئ حسابك",
      description: "ابدأ رحلتك في أكاديمية المعلم وادخل إلى تجربة تعليمية عربية أولاً.",
    },
    shell: {
      brand: "أكاديمية المعلم",
      tagline: "تجربة تعليمية عربية أولاً، مع أساس جاهز لأدوار الطالب والمعلم والإدارة.",
    },
  },
} as const;

export default messages;
```

`messages/en.ts`
```ts
const messages = {
  HomePage: {
    brand: "Moallem Academy",
    title: "Moallem Academy e-learning platform",
    description: "Browse courses and begin your learning journey.",
    signIn: "Sign in",
    signUp: "Sign up",
    startNow: "Get started",
  },
  auth: {
    signIn: {
      title: "Welcome back",
      description: "Sign in to continue your learning journey in Moallem Academy.",
    },
    signUp: {
      title: "Create your account",
      description: "Start your Moallem Academy journey with an Arabic-first learning experience.",
    },
    shell: {
      brand: "Moallem Academy",
      tagline: "An Arabic-first learning experience with a clean foundation for student, teacher, and admin roles.",
    },
  },
} as const;

export default messages;
```

### Why this matters

Messages were kept in single locale files because the project already followed that pattern.  
The auth namespace was added inside those files so sign-in and sign-up pages could use the same translation source as the rest of the app.

---

## Step 7 — Move the home page into locale routing

### File to create

`app/[locale]/page.tsx`

### Code

```ts
import { Show, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="font-semibold">{t("brand")}</p>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              {t("signIn")}
            </Link>

            <Link
              href="/sign-up"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              {t("signUp")}
            </Link>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-5xl flex-col justify-center gap-6 px-6 py-16">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>

        <p className="max-w-2xl text-base text-text-secondary">
          {t("description")}
        </p>

        <Show when="signed-out">
          <Link
            href="/sign-up"
            className="w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            {t("startNow")}
          </Link>
        </Show>
      </section>
    </main>
  );
}
```

### Why this matters

The home page needed to be locale-aware and auth-aware at the same time.  
This confirmed the app could render different UI states for signed-in and signed-out users while keeping the page fully localized.

---

## Step 8 — Move sign-in and sign-up routes under `[locale]`

### Files to create

- `app/[locale]/sign-in/[[...sign-in]]/page.tsx`
- `app/[locale]/sign-up/[[...sign-up]]/page.tsx`

### Code

`app/[locale]/sign-in/[[...sign-in]]/page.tsx`
```ts
import { SignIn } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("auth");

  return (
    <AuthShell
      brand={t("shell.brand")}
      tagline={t("shell.tagline")}
      title={t("signIn.title")}
      description={t("signIn.description")}
    >
      <SignIn
        appearance={clerkAppearance}
        path={`/${locale}/sign-in`}
        routing="path"
        signUpUrl={`/${locale}/sign-up`}
      />
    </AuthShell>
  );
}
```

`app/[locale]/sign-up/[[...sign-up]]/page.tsx`
```ts
import { SignUp } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("auth");

  return (
    <AuthShell
      brand={t("shell.brand")}
      tagline={t("shell.tagline")}
      title={t("signUp.title")}
      description={t("signUp.description")}
    >
      <SignUp
        appearance={clerkAppearance}
        path={`/${locale}/sign-up`}
        routing="path"
        signInUrl={`/${locale}/sign-in`}
      />
    </AuthShell>
  );
}
```

### Why this matters

Localized auth routes are necessary so authentication does not break the language structure of the app.  
This also keeps sign-in and sign-up links consistent for Arabic and English users.

---

## Step 9 — Add a branded auth shell

### File to create

`components/auth/auth-shell.tsx`

### Code

```ts
type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  brand: string;
  tagline: string;
};

export function AuthShell({
  children,
  title,
  description,
  brand,
  tagline,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-surface-secondary px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{brand}</p>
          </div>

          <div className="max-w-lg space-y-5">
            <h1 className="text-4xl font-semibold leading-tight text-text-primary">
              {title}
            </h1>
            <p className="text-base leading-7 text-text-secondary">
              {description}
            </p>
          </div>

          <div className="text-sm text-text-secondary">{tagline}</div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-6 space-y-2 text-center lg:hidden">
              <p className="text-sm text-text-secondary">{brand}</p>
              <h1 className="text-2xl font-semibold text-text-primary">
                {title}
              </h1>
              <p className="text-sm text-text-secondary">{description}</p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
```

### Why this matters

The goal was not to rebuild auth forms from scratch, but to stop the app from feeling like default Clerk pages.  
This shell gave sign-in and sign-up a branded product feel while keeping Clerk’s real authentication flow intact.

---

## Step 10 — Add Clerk appearance customization

### File to create

`lib/clerk-appearance.ts`

### Code

```ts
import type { Appearance } from "@clerk/types";
import { simple } from "@clerk/themes";

export const clerkAppearance: Appearance = {
  theme: simple,
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "#7C5CFC",
    colorForeground: "#101828",
    colorMutedForeground: "#6A7282",
    colorBackground: "#FFFFFF",
    colorInput: "#F9FAFB",
    colorInputForeground: "#101828",
    colorNeutral: "#E7EAF3",
    colorPrimaryForeground: "#FFFFFF",
    colorDanger: "#EF4444",
    colorSuccess: "#10B981",
    colorWarning: "#FF8904",
    borderRadius: "1rem",
    fontFamily: "inherit"
  },
  elements: {
    card: "border border-[#E7EAF3] bg-white shadow-none",
    headerTitle: "text-[#101828]",
    headerSubtitle: "text-[#6A7282]",
    formFieldLabel: "text-[#101828]",
    formFieldInput: "bg-[#F9FAFB] text-[#101828] border border-[#E7EAF3]",
    formButtonPrimary: "bg-[#7C5CFC] text-white hover:opacity-90",
    footerActionText: "text-[#6A7282]",
    footerActionLink: "text-[#7C5CFC]",
    dividerText: "text-[#99A1AF]",
    dividerLine: "bg-[#E7EAF3]",
    socialButtonsBlockButton:
      "bg-white text-[#101828] border border-[#E7EAF3] hover:bg-[#F9FAFB]",
    socialButtonsBlockButtonText: "text-[#101828]",
    socialButtonsProviderIcon: "opacity-100",
    identityPreviewText: "text-[#101828]",
    formResendCodeLink: "text-[#7C5CFC]"
  },
  layout: {
    socialButtonsPlacement: "bottom",
    socialButtonsVariant: "blockButton"
  }
};
```

### Why this matters

The original auth UI colors did not match the actual Moallem Academy design tokens, and some text was not readable.  
Using Clerk’s simpler theme base and overriding it with the real product palette made the auth flow visually consistent with the app.

---

## Step 11 — Add CSS overrides for stubborn Clerk elements

### File to update

`app/globals.css`

### Code

```css
@layer clerk {
  .cl-card {
    background: #ffffff !important;
    border: 1px solid #e7eaf3 !important;
    box-shadow: none !important;
  }

  .cl-headerTitle,
  .cl-formFieldLabel,
  .cl-identityPreviewText,
  .cl-formFieldSuccessText,
  .cl-formFieldWarningText,
  .cl-navbarTitle {
    color: #101828 !important;
  }

  .cl-headerSubtitle,
  .cl-footerActionText,
  .cl-dividerText {
    color: #6a7282 !important;
  }

  .cl-formFieldInput,
  .cl-otpCodeFieldInput {
    background: #f9fafb !important;
    color: #101828 !important;
    border-color: #e7eaf3 !important;
  }

  .cl-formFieldInput::placeholder {
    color: #99a1af !important;
  }

  .cl-formButtonPrimary {
    background: #7c5cfc !important;
    color: #ffffff !important;
    box-shadow: none !important;
  }

  .cl-socialButtonsBlockButton {
    background: #ffffff !important;
    color: #101828 !important;
    border: 1px solid #e7eaf3 !important;
    box-shadow: none !important;
  }

  .cl-socialButtonsBlockButton:hover {
    background: #f9fafb !important;
  }

  .cl-socialButtonsBlockButtonText {
    color: #101828 !important;
  }

  .cl-socialButtonsProviderIcon {
    opacity: 1 !important;
  }

  .cl-footerActionLink,
  .cl-formResendCodeLink,
  .cl-identityPreviewEditButton {
    color: #7c5cfc !important;
  }

  .cl-dividerLine {
    background: #e7eaf3 !important;
  }
}
```

### Why this matters

Some Clerk UI parts, especially social login buttons and some text elements, still did not fully respect the intended product colors.  
These overrides fixed the remaining visual mismatch while still using Clerk’s official UI components.

---

## Step 12 — Prepare the role-aware foundation

### File to create

`types/auth.ts`

### Code

```ts
export type AppRole = "student" | "teacher" | "admin" | "staff";

export interface ClerkUserPublicMetadata {
  role?: AppRole;
}
```

### Why this matters

The app will later need teacher, student, and admin behavior, but this feature should not overbuild full authorization.  
This creates a clean role-ready contract that can later map to Clerk metadata and Supabase profile records without using web-only shortcuts.

---

## Step 13 — Add locale-aware local verification

### Command

```bash
npm run dev
```

### What to verify

- `/` redirects into the localized app
- `/ar` renders Arabic home page
- `/en` renders English home page
- `/ar/sign-in` renders branded Arabic sign-in
- `/ar/sign-up` renders branded Arabic sign-up
- `/en/sign-in` renders branded English sign-in
- `/en/sign-up` renders branded English sign-up
- signed-out users see auth calls to action
- signed-in users see Clerk session-aware UI
- auth pages keep the locale in their routing
- RTL remains correct on Arabic pages
- auth text and social login buttons are visually readable

---

## Step 14 — Commit the auth and localization foundation

### Command

```bash
git add .
git commit -m "feat(02): configure clerk auth foundation"
git push origin main
```

Later, after the localization and app-shell work was completed as part of the same implementation track:

```bash
git add .
git commit -m "feat(04): establish rtl localization and app shell foundation"
git push origin main
```

### Why this matters

The implementation ended up completing both the Clerk auth foundation and the RTL/localization/app-shell foundation together because the localized route structure and auth pages depended on each other.  
Committing them clearly keeps the project history understandable.

---

## Feature 02 completion checklist

- [x] Clerk is integrated into the real app structure
- [x] `proxy.ts` is configured for Next.js 16
- [x] Sign-in and sign-up routes work with localized routing
- [x] Signed-in and signed-out app awareness is working
- [x] Auth structure is prepared for later role-aware logic
- [x] No fake auth data was introduced
- [x] Auth decisions remain compatible with future mobile identity alignment
- [x] Clerk auth pages were upgraded from default shell to branded app pages

---

## Feature 04 — Establish RTL, Localization, and App Shell Foundation

### Goal

Establish the localization and app-shell foundation for **Moallem Academy** with:

- Arabic as the primary locale
- English as the secondary locale
- locale-aware routing
- RTL-first layout handling
- localized home and auth pages
- app shell direction that future pages can follow without rework

This feature is about making localization and directionality a real foundation, not an afterthought.

---

## Decisions used for this feature

- Locale routing uses `app/[locale]/...`
- Supported locales are `ar` and `en`
- Default locale is `ar`
- Arabic is treated as RTL-first from the beginning
- Localization messages stay in one file per locale for now
- Auth and home routes were migrated into locale-aware structure immediately

---

## Step 1 — Move routes under `[locale]`

### Command

```bash
mkdir -p "app/[locale]"
```

Then move/create the relevant pages under:

- `app/[locale]/page.tsx`
- `app/[locale]/sign-in/[[...sign-in]]/page.tsx`
- `app/[locale]/sign-up/[[...sign-up]]/page.tsx`

### Why this matters

Locale-based routing is easier to establish early than to retrofit later.  
It keeps Arabic and English page structure explicit and prepares the app for future localized content flows.

---

## Step 2 — Add translation message files

### Files used

- `messages/ar.ts`
- `messages/en.ts`

### Why this matters

This creates a single source of truth for visible app copy.  
Keeping both home page and auth messages in the same locale files avoids scattered hardcoded strings.

---

## Step 3 — Add next-intl infrastructure

### Files used

- `i18n/routing.ts`
- `i18n/navigation.ts`
- `i18n/request.ts`

### Why this matters

This gives the app locale-aware links, locale-aware request loading, and a structured translation system that can scale as more product pages are added.

---

## Step 4 — Add locale-aware app shell layout

### File used

`app/[locale]/layout.tsx`

### Why this matters

A locale-specific layout lets the app apply the correct providers and direction handling to each active locale.  
This keeps Arabic-first and English-secondary behavior centralized instead of scattered across pages.

---

## Step 5 — Confirm RTL and LTR rendering behavior

### What was implemented

- Arabic pages render with `dir="rtl"`
- English pages render with `dir="ltr"`

### Why this matters

RTL cannot be deferred to a later styling cleanup because it changes layout flow, spacing direction, and navigation structure.  
This feature made directionality part of the core page structure from the beginning.

---

## Step 6 — Verify localized home and auth flows

### What to verify locally

- `/ar` uses Arabic text and RTL layout
- `/en` uses English text and LTR layout
- `/ar/sign-in` and `/ar/sign-up` stay Arabic-first
- `/en/sign-in` and `/en/sign-up` stay English-first
- locale routing works together with Clerk
- no route falls back to a broken unlocalized path

---

## Feature 04 completion checklist

- [x] Arabic is the default locale
- [x] English is added as the secondary locale
- [x] Locale routing is active
- [x] Home page is localized
- [x] Sign-in and sign-up routes are localized
- [x] RTL is treated as a first-class requirement
- [x] App shell direction now supports future localized product pages
- [x] Localization structure is ready to scale beyond auth and landing pages

---

## Notes for future features

- Protected role-specific routes should move toward resource-based auth checks as Clerk evolves
- Supabase profile sync should later mirror Clerk identity and role metadata
- Locale files should keep expanding instead of reintroducing hardcoded strings
- Shared shell components for student, teacher, and admin areas should build on the same locale-aware structure
- UI polish can continue later without changing the auth or localization foundation


---


## Feature 03 — Configure Database Foundation (Neon + Prisma)


### Goal


Set up the real database foundation for **Moallem Academy** using:


- Neon PostgreSQL
- Prisma ORM
- production-minded server-only database access
- initial shared entity direction
- localized proof-query path direction
- architecture that stays compatible with future Clerk-based user alignment


This feature is about the **real database foundation**, not full schema expansion or full product flows.


---


## Important implementation change


This feature was originally planned as a **Supabase database foundation** feature.  
During implementation, the database direction was intentionally changed to **Neon + Prisma** instead.


So for Feature 03:
- Supabase database connection work was abandoned
- Neon became the active database provider
- Prisma became the server-side database access layer
- old Supabase-specific database helper direction should be treated as outdated for the web project unless future architecture decisions reverse this


---


## Decisions used for this feature


- Database provider: **Neon**
- ORM: **Prisma**
- Prisma client output: `lib/generated/prisma`
- Runtime connection uses `DATABASE_URL`
- Prisma CLI/config uses `prisma.config.ts`
- Initial database foundation stays intentionally small:
  - `profiles`
  - `academic_years`
  - `subjects`
- Clerk remains the identity/auth source of truth
- `profiles` remains the app-level user/profile table direction
- Database access must stay server-only
- No Neon credentials should ever be exposed through `NEXT_PUBLIC_*` variables


---


## Step 1 — Remove or stop using the old Supabase database path


### What changed


The original Supabase connection flow was abandoned in practice and the active database foundation moved to Neon instead.


### Why this matters


Feature 03 had to be unblocked with a real working database path.  
Neon + Prisma became the practical working path for this web implementation.


### Notes


Any old files or markdown references that still describe Supabase as the current web database foundation should be updated later to match the new Neon-based implementation direction.


---


## Step 2 — Install Prisma and Neon database dependencies


### Command


```bash
npm uninstall @supabase/ssr @supabase/supabase-js
npm install @prisma/client @prisma/adapter-neon @neondatabase/serverless
npm install -D prisma dotenv tsx
```


### Why this matters


These packages are the real foundation for:
- Prisma schema management
- Neon database connectivity
- server-side database access
- TypeScript seed execution


### Verify


```bash
npm ls @prisma/client
npm ls @prisma/adapter-neon
npm ls @neondatabase/serverless
```


---


## Step 3 — Configure environment variables for Neon


### File to update


`.env.local`


### Code


```env
# Neon database
DATABASE_URL="postgresql://<user>:<password>@<pooled-host>/<database>?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://<user>:<password>@<direct-host>/<database>?sslmode=require&channel_binding=require"
```


### Why this matters


The app needs real server-side database access from the foundation stage.  
Credentials must stay private and must never be exposed through public env variables.


### Important note


During implementation, direct connections were unreliable on the active machine/network, so the working Prisma path was ultimately adjusted around the connection that successfully worked in local development.


---


## Step 4 — Create Prisma config


### File to create/update


`prisma.config.ts`


### Code


```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```


### Why this matters


Prisma 7 uses `prisma.config.ts` as the active configuration source.  
This centralizes:
- schema location
- seed command
- datasource URL


---


## Step 5 — Create the initial Prisma schema


### File to create


`prisma/schema.prisma`


### Code


```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum AppRole {
  student
  teacher
  admin
}

model Profile {
  id          String   @id @default(cuid())
  clerkUserId String   @unique @map("clerk_user_id")
  role        AppRole  @default(student)
  displayName String?  @map("display_name")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("profiles")
}

model AcademicYear {
  id        String    @id @default(cuid())
  nameAr    String    @map("name_ar")
  nameEn    String?   @map("name_en")
  sortOrder Int       @default(0) @map("sort_order")
  isActive  Boolean   @default(true) @map("is_active")
  createdAt DateTime  @default(now()) @map("created_at")

  subjects  Subject[]

  @@map("academic_years")
}

model Subject {
  id             String       @id @default(cuid())
  academicYearId String       @map("academic_year_id")
  nameAr         String       @map("name_ar")
  nameEn         String?      @map("name_en")
  sortOrder      Int          @default(0) @map("sort_order")
  isActive       Boolean      @default(true) @map("is_active")
  createdAt      DateTime     @default(now()) @map("created_at")

  academicYear   AcademicYear @relation(fields: [academicYearId], references: [id], onDelete: Cascade)

  @@index([academicYearId])
  @@map("subjects")
}
```


### Why this matters


This creates the first controlled schema direction without overbuilding the full product.  
These three tables cover:
- app-level user/profile alignment
- the first browse hierarchy
- future mobile/web shared entity modeling direction


---


## Step 6 — Validate and generate Prisma client


### Command


```bash
npx prisma validate
npx prisma generate
```


### Why this matters


This confirms the schema is valid and generates the Prisma client into the app codebase for real server-side use.


### Verify


You should see Prisma generate successfully into:


```bash
lib/generated/prisma
```


---


## Step 7 — Push the schema to Neon


### Command


```bash
npx prisma db push
```


### Why this matters


This creates the actual database tables in Neon from the Prisma schema.  
After push, the first three tables should exist in the real database:
- `profiles`
- `academic_years`
- `subjects`


### Verify


Open Neon and confirm those tables exist in the database browser.


---


## Step 8 — Add a seed file for minimal real data


### File to create


`prisma/seed.ts`


### Code


```ts
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const year = await prisma.academicYear.upsert({
    where: { id: "foundation-year-2025" },
    update: {},
    create: {
      id: "foundation-year-2025",
      nameAr: "الصف التأسيسي",
      nameEn: "Foundation Year",
      sortOrder: 1,
      isActive: true,
    },
  });

  await prisma.subject.upsert({
    where: { id: "foundation-math" },
    update: {},
    create: {
      id: "foundation-math",
      academicYearId: year.id,
      nameAr: "الرياضيات",
      nameEn: "Mathematics",
      sortOrder: 1,
      isActive: true,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```


### Why this matters


This seeds a small amount of real database content for verification without turning the app into a mock-data-first implementation.


---


## Step 9 — Run the database seed


### Command


```bash
npx prisma db seed
```


### Why this matters


This inserts minimal initial data into the real Neon database so the first proof query path can return actual rows.


### Verify


In Neon, confirm that:
- one `academic_years` row exists
- one `subjects` row exists and links to that academic year


---


## Step 10 — Create the server-only Prisma helper


### File to create


`lib/prisma.ts`


### Code


```ts
import "server-only";
import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```


### Why this matters


This gives the app one clean, reusable, production-minded database entry point.  
The `server-only` import protects the project from accidentally using Prisma in client-side code.


---


## Step 11 — Prepare the localized proof-query route direction


### Planned route


`app/[locale]/(student)/db-check/page.tsx`


### Intended purpose


- query `academic_years`
- confirm real database reads work inside the app
- keep all visible strings localized through locale message files


### Why this matters


Feature 03 should end with at least one real query path, not only schema setup.  
The proof route direction was defined here as part of the database foundation track.


---


## Step 12 — Define Clerk ↔ app user alignment


### Direction used


- Clerk is the source of truth for authentication identity
- `profiles` is the app-level source of truth for role-ready user metadata
- future server-side flows should read Clerk `userId` first, then find the matching `profiles.clerkUserId` row


### Why this matters


This avoids identity mismatch later and keeps auth concerns separate from app-specific profile modeling.


---


## Step 13 — Define the secure database baseline


### Rules used


- Neon credentials stay server-only
- Prisma must only be used from the server
- No database secrets go into `NEXT_PUBLIC_*`
- Browser code must never connect to Neon directly
- Prisma is the web app’s database access layer


### Why this matters


This establishes a minimum production-minded safety baseline for Feature 03 without overbuilding authorization logic too early.


---


## Step 14 — Local verification used for this feature


### Commands


```bash
npx prisma validate
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```


### What to verify


- Prisma schema validates successfully
- Prisma client generates into `lib/generated/prisma`
- Neon contains:
  - `profiles`
  - `academic_years`
  - `subjects`
- seed data exists in Neon
- the app can now use `lib/prisma.ts` as the server-side database entry point
- no Neon secrets appear in client-side code


---


## Step 15 — Commit the database foundation


### Command


```bash
git add .
git commit -m "feat(03): configure neon prisma database foundation"
git push origin main
```


### Why this matters


This saves the first real database foundation for the web app using the actual backend path chosen during implementation.


---


## Feature 03 completion checklist


- [x] Supabase database path was abandoned in favor of Neon
- [x] Neon environment configuration was added
- [x] Prisma config was established
- [x] Initial schema was created for `profiles`, `academic_years`, and `subjects`
- [x] Prisma client generation is working
- [x] Schema was pushed to Neon
- [x] Minimal seed flow was added
- [x] Server-only Prisma entry point was added
- [x] Clerk-to-profile alignment direction was defined
- [x] Database secrets remain server-only
- [x] Foundation stayed focused without overbuilding the full product schema


---


## Notes for future features


- Any old Supabase-specific markdown or architecture references should be updated to match the active Neon + Prisma direction
- Feature 05 should use the seeded `academic_years` and `subjects` structure as the first real browse path
- The `profiles` table should later be connected to Clerk-driven creation/sync flows
- More tables should only be added when the next product flow truly requires them
- Visible database-driven UI text must continue to live in locale message files instead of being hardcoded