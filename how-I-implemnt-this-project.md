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

---

## Feature 05 — Student Browse and Course Discovery Flow

### Goal

Build the real student browse flow for **Moallem Academy** on top of the Neon + Prisma foundation, using:

- a `Course` model added to the existing Prisma schema
- a shared, server-only read layer for browse data
- real Server Component pages for academic year → subject → course discovery
- a mobile-facing API layer that reuses the exact same query logic
- fully localized browse copy in Arabic and English
- an architecture pattern for reads vs writes that will apply to all future features

This feature is about wiring up the **first real product flow** end to end, not just database setup.

---

## Decisions used for this feature

- No new database provider changes; Neon + Prisma from Feature 03 stays as-is
- A `Course` model was added to the schema, linked to `Subject`
- Course fields were kept minimal on purpose: `nameAr`, `nameEn`, `descriptionAr`, `descriptionEn`, `thumbnailUrl`, `isPublished`, `sortOrder`
- Price, teacher ownership, and lesson/media fields are intentionally deferred to Feature 07/08
- All read logic lives in `lib/queries/browse.ts`, marked `server-only`
- Web pages call these query functions directly from Server Components — no HTTP round trip
- A parallel `app/api/browse/*` layer was added so the mobile app can reach the same data over HTTP
- Both the web pages and the API routes call the exact same functions in `lib/queries/browse.ts` — no duplicated Prisma queries
- All visible browse strings were added to `messages/ar.ts` and `messages/en.ts` under a new `Browse` namespace

---

## Step 1 — Add the `Course` model to the Prisma schema

### File to update

`prisma/schema.prisma`

### Code

```prisma
model Course {
  id            String   @id @default(cuid())
  subjectId     String   @map("subject_id")
  nameAr        String   @map("name_ar")
  nameEn        String?  @map("name_en")
  descriptionAr String?  @map("description_ar")
  descriptionEn String?  @map("description_en")
  thumbnailUrl  String?  @map("thumbnail_url")
  isPublished   Boolean  @default(false) @map("is_published")
  sortOrder     Int      @default(0) @map("sort_order")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  subject       Subject  @relation(fields: [subjectId], references: [id], onDelete: Cascade)

  @@index([subjectId])
  @@map("courses")
}
```

Also add the inverse relation on `Subject`:

```prisma
model Subject {
  // ...existing fields
  courses Course[]
}
```

### Why this matters

This is the first entity in the browse hierarchy that represents actual purchasable/learnable product content, kept intentionally thin so it doesn't get ahead of Feature 07 (teacher course management) and Feature 08 (media sources).

---

## Step 2 — Resolve migration drift and apply the schema change

### Problem encountered

Earlier schema changes had been applied with `prisma db push` instead of `prisma migrate dev`, which caused Prisma to detect drift between the migration history and the actual Neon database state.

### Command

```bash
npx prisma migrate reset
npx prisma migrate dev --name add_course_model
```

### Why this matters

`migrate reset` was safe to run at this stage because only seed data existed — no real user data was at risk. Moving to proper `migrate dev` from this point forward keeps schema history clean and avoids drift errors in future features.

### Verify

```bash
npx prisma studio
```

Confirm the `courses` table exists and is empty, then re-run the seed if needed.

---

## Step 3 — Extend the seed with a real course

### File to update

`prisma/seed.ts`

### Code (added to `main()`)

```ts
await prisma.course.upsert({
  where: { id: "foundation-math-course-01" },
  update: {},
  create: {
    id: "foundation-math-course-01",
    subjectId: "foundation-math",
    nameAr: "الرياضيات الأساسية",
    nameEn: "Core Mathematics",
    descriptionAr: "كورس شامل في أساسيات الرياضيات للمرحلة التأسيسية.",
    descriptionEn: "A comprehensive course covering core mathematics for the foundation year.",
    isPublished: true,
    sortOrder: 1,
  },
});
```

### Command

```bash
npx prisma db seed
```

### Why this matters

The browse flow needs at least one real, published course to verify the full year → subject → course path end to end without relying on mock data.

---

## Step 4 — Create the shared browse query layer

### File to create

`lib/queries/browse.ts`

### Code

```ts
import "server-only";
import { prisma } from "@/lib/prisma";

export async function getActiveAcademicYears() {
  return prisma.academicYear.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSubjectsByYear(academicYearId: string) {
  return prisma.subject.findMany({
    where: { academicYearId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPublishedCoursesBySubject(subjectId: string) {
  return prisma.course.findMany({
    where: { subjectId, isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
}
```

### Why this matters

This is the single source of truth for all browse-related reads. The `server-only` import guarantees this file can never be accidentally bundled into client-side code. Both the web Server Components and the mobile-facing API routes call these same three functions — no query logic is ever duplicated between platforms.

---

## Step 5 — Add localized browse copy

### Files to update

- `messages/ar.ts`
- `messages/en.ts`

### Code (added under a new `Browse` namespace)

```ts
// messages/ar.ts
Browse: {
  years: {
    title: "اختر السنة الدراسية",
    empty: "لا توجد سنوات دراسية متاحة حالياً.",
  },
  subjects: {
    title: "اختر المادة",
    empty: "لا توجد مواد متاحة لهذه السنة الدراسية.",
  },
  courses: {
    title: "الكورسات المتاحة",
    empty: "لا توجد كورسات منشورة لهذه المادة حالياً.",
  },
  errors: {
    loadFailed: "تعذر تحميل البيانات، حاول مرة أخرى.",
  },
},
```

```ts
// messages/en.ts
Browse: {
  years: {
    title: "Choose an academic year",
    empty: "No academic years are available right now.",
  },
  subjects: {
    title: "Choose a subject",
    empty: "No subjects are available for this academic year.",
  },
  courses: {
    title: "Available courses",
    empty: "No published courses are available for this subject yet.",
  },
  errors: {
    loadFailed: "Failed to load data, please try again.",
  },
},
```

### Why this matters

Every visible string in the browse flow — including empty and error states — is localized from the start, keeping Arabic as the default experience and avoiding hardcoded English fallback text anywhere in the flow.

---

## Step 6 — Build the student browse pages

### Files to create

- `app/[locale]/(student)/years/page.tsx`
- `app/[locale]/(student)/years/[yearId]/subjects/page.tsx`
- `app/[locale]/(student)/subjects/[subjectId]/courses/page.tsx`

### Pattern used (example: subjects page)

```ts
import { getSubjectsByYear } from "@/lib/queries/browse";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ yearId: string }>;
};

export default async function SubjectsPage({ params }: Props) {
  const { yearId } = await params;
  const t = await getTranslations("Browse.subjects");
  const subjects = await getSubjectsByYear(yearId);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("title")}</h1>

      {subjects.length === 0 ? (
        <p className="mt-6 text-text-secondary">{t("empty")}</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <li key={subject.id} className="rounded-lg border border-border bg-surface p-4">
              {subject.nameAr}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

### Why this matters

Each page is a Server Component that calls `lib/queries/browse.ts` directly — no client-side fetch, no API round trip for the web experience. This is the fastest possible data path for a read-only student flow.

---

## Step 7 — Build the mobile-facing browse API

### Files to create

- `app/api/browse/years/route.ts`
- `app/api/browse/years/[yearId]/subjects/route.ts`
- `app/api/browse/subjects/[subjectId]/courses/route.ts`

### Code (example: subjects route)

```ts
import { NextResponse } from "next/server";
import { getSubjectsByYear } from "@/lib/queries/browse";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ yearId: string }> }
) {
  const { yearId } = await params;

  try {
    const subjects = await getSubjectsByYear(yearId);
    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("GET /api/browse/years/[yearId]/subjects failed:", error);
    return NextResponse.json({ error: "load_failed" }, { status: 500 });
  }
}
```

The `years` and `subjects/[subjectId]/courses` routes follow the same pattern, calling `getActiveAcademicYears()` and `getPublishedCoursesBySubject()` respectively.

### Why this matters

This is the only way the React Native mobile app can reach browse data, since it cannot import Server Components or `server-only` files directly. Every route is a thin wrapper — no business logic lives here, only the HTTP boundary.

### Common mistake hit during this feature

An earlier attempt placed `route.ts` at `app/api/browse/years/subjects/route.ts` instead of nested inside the dynamic segment at `app/api/browse/years/[yearId]/subjects/route.ts`. This caused `/api/browse/years/foundation-year-2025/subjects` to 404, because there was no `[yearId]` folder in the path to match against. Fixed by deleting the misplaced folder and recreating the correct nested structure.

---

## Step 8 — Local verification used for this feature

### Commands

```bash
npm run dev
```

```bash
curl http://localhost:3000/api/browse/years
curl http://localhost:3000/api/browse/years/foundation-year-2025/subjects
curl http://localhost:3000/api/browse/subjects/foundation-math/courses
```

### What to verify

- `/ar/years` renders the seeded academic year in Arabic
- `/ar/years/foundation-year-2025/subjects` renders the seeded subject
- `/ar/subjects/foundation-math/courses` renders the seeded course
- all three `curl` calls return clean JSON, not an HTML 404 page
- empty states render correctly when a year/subject has no children
- no Prisma import errors appear in client-side bundles

---

## Step 9 — Commit the browse flow

### Command

```bash
git add .
git commit -m "feat(05): student browse and course discovery flow"
git push origin main
```

### Why this matters

This saves the first real end-to-end product flow, along with the shared query pattern that all future features (07, 08, 09) will follow for both web and mobile.

---

## Feature 05 completion checklist

- [x] `Course` model added to Prisma schema and linked to `Subject`
- [x] Migration drift resolved and clean `migrate dev` history established going forward
- [x] Seed data extended with a real published course
- [x] `lib/queries/browse.ts` created as the single shared read layer
- [x] Student browse pages built as Server Components with zero client-side fetching
- [x] Mobile-facing `app/api/browse/*` routes added, reusing the same query functions
- [x] All browse copy localized in Arabic and English, including empty/error states
- [x] No duplicated Prisma queries between web and mobile paths
- [x] Folder-routing mistake identified and fixed (`[yearId]` nesting)

---

## Notes for future features

- The cross-platform pattern established here — reads in `lib/queries/`, writes in `lib/mutations/`, `actions/` for web-only Server Action mutation triggers, `app/api/` for mobile/external HTTP access — should be followed starting with Feature 06 and onward.
- Feature 06 (course detail/preview/access states) should extend `lib/queries/browse.ts` or add a new `lib/queries/courses.ts` rather than querying Prisma directly from pages.
- Feature 07 (teacher course management) will be the first feature to introduce real mutations, and should introduce `lib/mutations/courses.ts` alongside a matching `actions/teacher/*` Server Action layer and `app/api/teacher/*` route layer.
- Always double-check dynamic route folder nesting (e.g. `[yearId]`) with `find` or `ls -R` after creating API routes by hand, since misplaced folders fail silently with a 404 rather than a build error.

---

## Feature 06 — Course Detail, Preview, and Access States

### Goal

Build the real course detail flow for students on **Moallem Academy** on top of the Feature 05 browse flow, using:

- minimal, clean Prisma schema additions for `Lesson` and `Enrollment`
- a shared, server-only read layer for course-detail and access-state data
- a real course detail page powered by Neon through Prisma
- clear preview / locked / accessible lesson states
- a mobile-facing API route that reuses the exact same query logic
- fully localized course-detail copy in Arabic and English
- no payment/access-confirmation logic (deferred to Feature 09)

This feature is about **detail + preview + access states**, not the full enrollment/payment workflow.

---

## Decisions used for this feature

- No new database provider changes; Neon + Prisma stays as-is.
- Two new models were added to the schema: `Lesson` and `Enrollment`.
- `Lesson.videoUrl` was added as a nullable placeholder string only — the real multi-source media system (Cloudinary upload, mobile upload, external link) is deferred to Feature 08.
- `Course.teacherId` was added now (nullable string, Clerk user ID) as a safe default so Feature 07 does not require another migration just to introduce ownership.
- `EnrollmentStatus` enum (`pending`, `confirmed`, `rejected`) was added as the minimal truthful access-state model. The actual enroll/payment-trigger mutation is deferred to Feature 09.
- Access state per lesson is resolved as: `preview` if `Lesson.isPreview` is true, `accessible` if the student has a `confirmed` enrollment, otherwise `locked`.
- All read logic lives in `lib/queries/course.ts`, marked `server-only`, following the exact same pattern as `lib/queries/browse.ts` from Feature 05.
- A parallel `app/api/courses/[courseId]/route.ts` was added so the mobile app can reach the same course-detail data over HTTP.
- All visible course-detail strings were added to `messages/ar.json` and `messages/en.json` under a new `CourseDetail` namespace.
- During this feature it was confirmed the project is fully on **Prisma 7**, and `schema.prisma` was cleaned up to remove the legacy `url` field from the `datasource` block, since Prisma 7 reads the connection URL exclusively from `prisma.config.ts`.

---

## Step 1 — Extend the Prisma schema with `Lesson` and `Enrollment`

### File to update

`prisma/schema.prisma`

### Code

```prisma
enum EnrollmentStatus {
  pending
  confirmed
  rejected
}

model Course {
  // ...existing fields
  teacherId String? @map("teacher_id")

  lessons     Lesson[]
  enrollments Enrollment[]
}

model Lesson {
  id          String   @id @default(cuid())
  courseId    String   @map("course_id")
  titleAr     String   @map("title_ar")
  titleEn     String?  @map("title_en")
  description String?
  videoUrl    String?  @map("video_url")
  isPreview   Boolean  @default(false) @map("is_preview")
  isPublished Boolean  @default(false) @map("is_published")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@index([courseId])
  @@map("lessons")
}

model Enrollment {
  id        String           @id @default(cuid())
  profileId String           @map("profile_id")
  courseId  String           @map("course_id")
  status    EnrollmentStatus @default(pending)
  createdAt DateTime         @default(now()) @map("created_at")
  updatedAt DateTime         @updatedAt @map("updated_at")

  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  course  Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([profileId, courseId])
  @@index([profileId])
  @@index([courseId])
  @@map("enrollments")
}
```

Also add the inverse relation on `Profile`:

```prisma
model Profile {
  // ...existing fields
  enrollments Enrollment[]
}
```

### Why this matters

`Lesson` carries the one field this feature truly needs beyond the obvious (`isPreview`) to distinguish free content from locked content. `videoUrl` is intentionally kept as a bare nullable string so Feature 08 can extend it into a real multi-source system without a breaking migration. `Enrollment` gives the app a real, truthful access-state model without building the actual payment/enroll-trigger flow yet — that stays fully deferred to Feature 09.

---

## Step 2 — Fix a stale `url` field in the datasource block

### Problem encountered

The project had already fully upgraded to **Prisma 7.9.1**, with `prisma.config.ts` correctly holding `datasource.url`. But `prisma/schema.prisma` still had a leftover `url = env("DATABASE_URL")` (commented and uncommented at different points), which is no longer valid syntax in Prisma 7 and caused a VS Code Prisma-extension validation error (`Argument "url" is missing in data source block "db"` when removed, or a "no longer supported" error when present).

### File to update

`prisma/schema.prisma`

### Code

```prisma
datasource db {
  provider = "postgresql"
}
```

### Why this matters

In Prisma 7, the `url` field must live exclusively in `prisma.config.ts`, never in `schema.prisma`. The VS Code Prisma extension's validator was still catching up with this and threw a false-positive error even though the CLI (`npx prisma generate`, `npx prisma migrate dev`) already worked correctly. The real fix is `schema.prisma` has no `url` at all, and the extension warning is either resolved by explicitly selecting the Prisma 7 version inside the extension (`Ctrl+Shift+P` → "Prisma: Select Prisma Version" → `7`) or safely ignored since it does not affect builds or migrations.

### Verify

```bash
npx prisma --version
```

Confirms `Loaded Prisma config from prisma.config.ts` and `prisma: 7.9.1` with no CLI error.

---

## Step 3 — Apply the migration

### Command

```bash
npx prisma migrate dev --name add-lesson-enrollment
npx prisma generate
```

### Why this matters

This creates the real `lessons` and `enrollments` tables in Neon and regenerates the Prisma client with the new model types.

### Verify

```bash
npx prisma studio
```

Confirm `lessons` and `enrollments` tables exist and are empty.

---

## Step 4 — Add the shared course-detail query layer

### File to create

`lib/queries/course.ts`

### Code

```ts
import "server-only";
import { prisma } from "@/lib/prisma";

export async function getCourseDetail(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId, isPublished: true },
    include: {
      subject: {
        include: {
          academicYear: true,
        },
      },
      lessons: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          titleAr: true,
          titleEn: true,
          isPreview: true,
          sortOrder: true,
        },
      },
    },
  });
}

export async function getStudentEnrollmentForCourse(
  profileId: string,
  courseId: string
) {
  return prisma.enrollment.findUnique({
    where: {
      profileId_courseId: { profileId, courseId },
    },
    select: {
      status: true,
    },
  });
}
```

### Why this matters

`getCourseDetail` is public data, always callable regardless of auth state. `getStudentEnrollmentForCourse` is only ever called when a signed-in student is viewing the page, keeping the two concerns cleanly separated and independently reusable from mobile API routes — the same shared-query pattern established in Feature 05's `lib/queries/browse.ts`.

---

## Step 5 — Add the mobile-facing course API route

### File to create

`app/api/courses/[courseId]/route.ts`

### Code

```ts
import { NextRequest, NextResponse } from "next/server";
import { getCourseDetail } from "@/lib/queries/course";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const course = await getCourseDetail(courseId);
    if (!course) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ course });
  } catch (error) {
    console.error("[api/courses/courseId] GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

### Why this matters

React Native cannot import Server Components or call `lib/queries/*` directly, so this thin Route Handler is the only door the mobile app has into course-detail data. It contains no business logic of its own — it only wraps `getCourseDetail`.

### Verify

```bash
curl http://localhost:3000/api/courses/<a-real-course-id>
```

Returns clean JSON, not an HTML error page.

---

## Step 6 — Add localized course-detail copy

### Files to update

`messages/ar.json`, `messages/en.json`

### Code (added as a new `CourseDetail` namespace)

```json
"CourseDetail": {
  "backToCourses": "العودة إلى الكورسات",
  "lessonsHeading": "محتوى الكورس",
  "lessonsEmpty": "لا توجد دروس منشورة لهذا الكورس بعد",
  "previewBadge": "معاينة مجانية",
  "lockedBadge": "مقفل",
  "accessibleBadge": "متاح",
  "enrollCta": "اشترك في الكورس",
  "pendingNote": "طلبك قيد المراجعة",
  "rejectedNote": "لم يتم قبول طلبك، يمكنك إعادة المحاولة",
  "confirmedNote": "لديك وصول كامل إلى هذا الكورس",
  "notFoundTitle": "الكورس غير موجود",
  "notFoundDescription": "لا يمكن العثور على هذا الكورس أو أنه غير منشور.",
  "errorLoad": "تعذّر تحميل بيانات الكورس، يرجى المحاولة مجدداً"
}
```

```json
"CourseDetail": {
  "backToCourses": "Back to courses",
  "lessonsHeading": "Course content",
  "lessonsEmpty": "No published lessons for this course yet",
  "previewBadge": "Free preview",
  "lockedBadge": "Locked",
  "accessibleBadge": "Accessible",
  "enrollCta": "Enroll in this course",
  "pendingNote": "Your enrollment request is under review",
  "rejectedNote": "Your request was not approved, you may try again",
  "confirmedNote": "You have full access to this course",
  "notFoundTitle": "Course not found",
  "notFoundDescription": "This course could not be found or is not published.",
  "errorLoad": "Could not load course data, please try again"
}
```

### Why this matters

Every visible string in the course detail flow — headings, badges, empty states, and enrollment-status banners — comes from the locale files, keeping Arabic as the default experience and preventing any hardcoded fallback text from creeping into the components.

---

## Step 7 — Build the `LessonRow` component

### File to create

`components/student/LessonRow.tsx`

### Code

```tsx
import { useTranslations } from "next-intl";
import { Lock, PlayCircle, Eye } from "lucide-react";

type LessonAccessState = "preview" | "accessible" | "locked";

interface LessonRowProps {
  titleAr: string;
  titleEn: string | null;
  accessState: LessonAccessState;
  locale: string;
  sortOrder: number;
}

export function LessonRow({
  titleAr,
  titleEn,
  accessState,
  locale,
  sortOrder,
}: LessonRowProps) {
  const t = useTranslations("CourseDetail");
  const title = locale === "ar" ? titleAr : titleEn ?? titleAr;

  const badgeConfig = {
    preview: {
      label: t("previewBadge"),
      className: "bg-success-light text-success",
      icon: <Eye size={14} />,
    },
    accessible: {
      label: t("accessibleBadge"),
      className: "bg-accent-light text-accent",
      icon: <PlayCircle size={14} />,
    },
    locked: {
      label: t("lockedBadge"),
      className: "bg-surface-secondary text-locked",
      icon: <Lock size={14} />,
    },
  } as const;

  const badge = badgeConfig[accessState];

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm text-text-muted w-6 shrink-0 text-center">
          {sortOrder}
        </span>
        <span
          className={`truncate text-sm font-medium ${
            accessState === "locked" ? "text-text-muted" : "text-text-primary"
          }`}
        >
          {title}
        </span>
      </div>
      <span
        className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    </li>
  );
}
```

### Why this matters

Isolating the lesson row into its own component keeps the badge logic (preview/accessible/locked) in one place, using the exact design tokens (`success`, `accent`, `locked`) already defined in `web-ui-context.md` instead of raw hex values.

---

## Step 8 — Build the course detail page

### File to create

`app/[locale]/(student)/course/[courseId]/page.tsx`

### Code

```tsx
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCourseDetail, getStudentEnrollmentForCourse } from "@/lib/queries/course";
import { prisma } from "@/lib/prisma";
import { LessonRow } from "@/components/student/LessonRow";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string }>;
}) {
  const { locale, courseId } = await params;
  const t = await getTranslations("CourseDetail");

  let course: Awaited<ReturnType<typeof getCourseDetail>> = null;
  let loadError = false;

  try {
    course = await getCourseDetail(courseId);
  } catch (error) {
    console.error("[CourseDetailPage] load error:", error);
    loadError = true;
  }

  if (!loadError && !course) notFound();

  const { userId: clerkUserId } = await auth();
  let enrollmentStatus: "none" | "pending" | "confirmed" | "rejected" = "none";

  if (clerkUserId && course) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId },
        select: { id: true },
      });
      if (profile) {
        const enrollment = await getStudentEnrollmentForCourse(profile.id, course.id);
        if (enrollment) {
          enrollmentStatus = enrollment.status as typeof enrollmentStatus;
        }
      }
    } catch (error) {
      console.error("[CourseDetailPage] enrollment check error:", error);
    }
  }

  const hasFullAccess = enrollmentStatus === "confirmed";
  const courseName = locale === "ar" ? course?.nameAr : course?.nameEn ?? course?.nameAr;
  const courseDescription =
    locale === "ar" ? course?.descriptionAr : course?.descriptionEn ?? course?.descriptionAr;

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto" dir="auto">
      {loadError ? (
        <p className="text-error">{t("errorLoad")}</p>
      ) : (
        <>
          <Link
            href={`/${locale}/browse`}
            className="mb-6 inline-block text-sm text-text-muted hover:underline"
          >
            ← {t("backToCourses")}
          </Link>

          <div className="mb-8">
            {course!.thumbnailUrl && (
              <img
                src={course!.thumbnailUrl}
                alt=""
                className="mb-5 w-full rounded-xl object-cover aspect-video"
              />
            )}
            <h1 className="text-2xl font-bold text-text-primary mb-2">{courseName}</h1>
            {courseDescription && (
              <p className="text-sm text-text-secondary">{courseDescription}</p>
            )}
          </div>

          {!clerkUserId && (
            <div className="mb-6 rounded-xl border border-border bg-surface-secondary px-5 py-4">
              <p className="text-sm text-text-secondary mb-3">{t("enrollCta")}</p>
              <Link
                href={`/${locale}/sign-in`}
                className="inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
              >
                {t("enrollCta")}
              </Link>
            </div>
          )}

          {clerkUserId && enrollmentStatus === "none" && (
            <div className="mb-6 rounded-xl border border-border bg-surface-secondary px-5 py-4">
              <p className="text-sm text-text-secondary">{t("enrollCta")}</p>
            </div>
          )}

          {clerkUserId && enrollmentStatus === "pending" && (
            <div className="mb-6 rounded-xl border border-warning bg-surface-secondary px-5 py-4">
              <p className="text-sm text-warning font-medium">{t("pendingNote")}</p>
            </div>
          )}

          {clerkUserId && enrollmentStatus === "rejected" && (
            <div className="mb-6 rounded-xl border border-error bg-surface-secondary px-5 py-4">
              <p className="text-sm text-error font-medium">{t("rejectedNote")}</p>
            </div>
          )}

          {clerkUserId && enrollmentStatus === "confirmed" && (
            <div className="mb-6 rounded-xl border border-success bg-success-light px-5 py-4">
              <p className="text-sm text-success font-medium">{t("confirmedNote")}</p>
            </div>
          )}

          <section>
            <h2 className="mb-4 text-base font-semibold text-text-primary">
              {t("lessonsHeading")}
            </h2>

            {course!.lessons.length === 0 ? (
              <p className="text-sm text-text-muted">{t("lessonsEmpty")}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {course!.lessons.map((lesson, index) => {
                  const accessState = lesson.isPreview
                    ? "preview"
                    : hasFullAccess
                    ? "accessible"
                    : "locked";

                  return (
                    <LessonRow
                      key={lesson.id}
                      titleAr={lesson.titleAr}
                      titleEn={lesson.titleEn}
                      accessState={accessState}
                      locale={locale}
                      sortOrder={index + 1}
                    />
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
```

### Why this matters

This is the real end-to-end course detail flow: it fetches public course data unconditionally, then layers in a signed-in student's enrollment status only when relevant, and resolves each lesson's access state (`preview` / `accessible` / `locked`) purely from real database fields — no enrollment or payment logic is faked.

### Bug encountered and fixed

TypeScript flagged `enrollmentStatus === "confirmed"` as an impossible comparison because the `let enrollmentStatus = "none"` declaration (without an explicit type) was narrowed to the literal type `"none"`. Fixed by explicitly typing the declaration:

```ts
let enrollmentStatus: "none" | "pending" | "confirmed" | "rejected" = "none";
```

and casting the Prisma enum value on assignment:

```ts
enrollmentStatus = enrollment.status as typeof enrollmentStatus;
```

---

## Step 9 — Seed a test lesson for manual verification

### Command

```bash
npx prisma studio
```

Manually added two rows to the `lessons` table for an existing published course:
- One row with `isPreview = true`, `isPublished = true`
- One row with `isPreview = false`, `isPublished = true`

### Why this matters

Without at least one lesson in the database, the lesson list always renders the empty state, making it impossible to visually confirm the preview vs. locked badge logic.

---

## Step 10 — Local verification used for this feature

### Commands

```bash
npx tsc --noEmit
npm run build
```

### What to verify

- `/ar/course/<valid-published-course-id>` loads the course detail page in Arabic with RTL layout
- `/en/course/<valid-published-course-id>` loads in English
- a lesson with `isPreview = true` shows the green "معاينة مجانية" / "Free preview" badge
- a lesson with `isPreview = false` and no confirmed enrollment shows the "مقفل" / "Locked" badge
- `curl http://localhost:3000/api/courses/<courseId>` returns valid JSON
- an invalid course ID hits the Next.js 404 page
- no hardcoded Arabic or English strings remain in any component
- `npx tsc --noEmit` and `npm run build` both pass with no errors

---

## Step 11 — Commit the course detail flow

### Command

```bash
git add .
git commit -m "feat(06): course detail, preview, and access states"
git push origin main
```

### Why this matters

This saves the real course detail flow, the shared `lib/queries/course.ts` read layer, and the mobile-facing `app/api/courses/[courseId]` route, all following the same cross-platform pattern established in Feature 05.

---

## Feature 06 completion checklist

- [x] `Lesson` and `Enrollment` models added to the Prisma schema with minimal fields
- [x] `Lesson.videoUrl` added only as a placeholder for Feature 08
- [x] `Course.teacherId` added as a safe default for Feature 07
- [x] `EnrollmentStatus` enum added without building the actual payment/enroll-trigger flow
- [x] Legacy `url` field removed from `schema.prisma`'s `datasource` block, consistent with Prisma 7's config-based model
- [x] Migration applied cleanly with `prisma migrate dev`
- [x] `lib/queries/course.ts` created as the shared read layer for course detail and enrollment status
- [x] `app/api/courses/[courseId]/route.ts` added for mobile consumption, reusing the same query functions
- [x] Real course detail page built as a Server Component with zero client-side fetching
- [x] Preview / locked / accessible lesson states rendered clearly via `LessonRow`
- [x] All course-detail copy localized in `messages/ar.json` and `messages/en.json` under `CourseDetail`
- [x] Enrollment-status banners (pending/confirmed/rejected) shown without faking payment completion
- [x] TypeScript union-narrowing bug on `enrollmentStatus` identified and fixed
- [x] No stale Supabase assumptions present in this feature

---

## Notes for future features

- Feature 07 (teacher dashboard/course management) can now safely add real mutations for `Course` and `Lesson` since `teacherId` already exists on `Course` — no additional migration needed just for ownership.
- Feature 08 (media source system) should extend `Lesson.videoUrl` into a proper multi-source model (Cloudinary upload, mobile upload, external link) rather than reusing the plain string as-is long term.
- Feature 09 (manual payment/access confirmation) should introduce the real `Enrollment`-creating mutation and the actual enroll button action — the UI placeholder ("enrollCta") added in Feature 06 is display-only and has no wired mutation yet.
- The enrollment-status check pattern used here (Clerk `userId` → `Profile.clerkUserId` → `Enrollment.profileId`) should be reused as-is in Feature 09 rather than reinvented.
- Keep an eye on the VS Code Prisma extension's Prisma-version detection setting after any future Prisma upgrade — it does not always auto-detect major version changes.


---

## Feature 07 — Establish Web Design System and Shared UI Components

### Goal

Establish the shared web UI foundation for **Moallem Academy** using:

- shadcn/ui as the shared component base
- reusable design-system-level UI components instead of page-specific styling
- consistent button, input, card, label, textarea, and badge patterns
- utility-based styling aligned with the existing Tailwind token setup
- a reusable `cn()` helper and variant-based component styling
- a corrected navigation-button pattern using `buttonVariants(...)` instead of `Button asChild`

This feature is about creating the **shared web design system foundation** that later product features can build on cleanly.

---

## Decisions used for this feature

- Tailwind remains the styling system and source of app-level visual tokens.
- shadcn/ui was adopted as the shared component layer instead of building every primitive manually.
- Shared UI files live under `components/ui`.
- Reusable class merging is centralized through `lib/utils.ts`.
- Button styling is variant-based through `class-variance-authority`.
- The generated `Button` component in this project shape does **not** support `asChild`, so links that should look like buttons must use `buttonVariants(...)` with `cn(...)` instead.
- Feature 07 focuses on the base component system, not on full teacher/student business flows.
- The design system is web-first, but it also creates a cleaner visual contract for later mobile/web parity at the product level.

---

## Step 1 — Initialize shadcn/ui in the project

### Command

```bash
npx shadcn@latest init
```

### Why this matters

This sets up the shared component foundation and connects shadcn/ui to the current Next.js + Tailwind project structure instead of continuing with only ad-hoc custom classes.

### What was configured

- components path points to `components`
- utils path points to `lib/utils`
- Tailwind integration stays aligned with the existing app structure

---

## Step 2 — Add the first shared UI primitives

### Command

```bash
npx shadcn@latest add button input textarea label card
```

Later, when needed for form-state work:

```bash
npx shadcn@latest add checkbox
```

### Files created or updated

- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/label.tsx`
- `components/ui/card.tsx`
- `components/ui/checkbox.tsx`
- `lib/utils.ts`

### Why this matters

These primitives become the shared language of the UI layer, so later pages do not need to keep rebuilding the same button, field, and container patterns from scratch.

---

## Step 3 — Add the shared `cn()` utility

### File created

`lib/utils.ts`

### Code

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Why this matters

Once shared UI components exist, class composition needs one consistent helper so variant classes and per-page overrides can be merged safely without duplicated utility conflicts.

---

## Step 4 — Add the shared button component

### File created

`components/ui/button.tsx`

### Code

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-white hover:opacity-90",
        outline: "border border-border bg-surface text-text-primary hover:bg-surface-secondary",
        secondary: "bg-surface-secondary text-text-primary hover:bg-surface",
        ghost: "text-text-primary hover:bg-surface-secondary",
        destructive: "bg-error text-white hover:opacity-90",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

### Why this matters

This gives the project one reusable button contract for sizing and variants, and it becomes the styling source for both real `<button>` elements and navigation links that need button appearance.

---

## Step 5 — Add the shared form and surface primitives

### Files created

- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/label.tsx`
- `components/ui/card.tsx`

### Code

`components/ui/input.tsx`
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
```

`components/ui/textarea.tsx`
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
```

`components/ui/label.tsx`
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-medium text-text-primary", className)}
      {...props}
    />
  );
}

export { Label };
```

`components/ui/card.tsx`
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-surface", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-base font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
```

### Why this matters

These components turn repeated field and container styling into shared primitives, which reduces duplication and keeps later pages visually consistent.

---

## Step 6 — Add checkbox when form-state UI started needing it

### File created

`components/ui/checkbox.tsx`

### Code

```tsx
"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <label className="inline-flex items-center">
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border border-border bg-surface text-white peer-checked:border-accent peer-checked:bg-accent",
          className
        )}
      >
        <Check className="h-3 w-3 opacity-0 peer-checked:opacity-100" />
      </span>
    </label>
  );
}

export { Checkbox };
```

### Why this matters

The design system needed a reusable boolean-input primitive so later forms could stay visually consistent instead of mixing browser-default checkboxes with custom field styling.

---

## Step 7 — Start using the shared UI primitives in real pages

### Pattern used

Instead of raw repeated markup such as:

```tsx
<input className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm" />
```

the app moved toward:

```tsx
<Input />
```

Instead of raw section wrappers like:

```tsx
<div className="rounded-xl border border-border bg-surface p-6">
  ...
</div>
```

the app moved toward:

```tsx
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Why this matters

Feature 07 is only useful if the shared components are actually used as the new default UI path instead of staying as unused generated files.

---

## Step 8 — Correct the `asChild` assumption on `Button`

### Error encountered

When trying to use:

```tsx
<Button asChild size="sm" className="w-fit">
  <Link href={`/${locale}/sign-in`}>{t("enrollCta")}</Link>
</Button>
```

TypeScript raised:

```ts
Property 'asChild' does not exist on type 'IntrinsicAttributes & ButtonProps ...'
```

### Why this happened

The generated `Button` component in this project shape does not include an `asChild` prop, so the common Radix Slot-based pattern was not available in the actual local implementation.

### Correct pattern used instead

```tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

<Link
  href={`/${locale}/sign-in`}
  className={cn(buttonVariants({ size: "sm" }), "w-fit")}
>
  {t("enrollCta")}
</Link>
```

### Why this matters

This became an important implementation rule for the shared design system: use `<Button>` for actual button behavior, and use `Link` plus `buttonVariants(...)` for navigation elements that should look like buttons.

---

## Step 9 — Apply the corrected button-link pattern across affected pages

### Pattern to use everywhere

Replace:

```tsx
<Button asChild size="sm" className="w-fit">
  <Link href="/somewhere">Action</Link>
</Button>
```

with:

```tsx
<Link
  href="/somewhere"
  className={cn(buttonVariants({ size: "sm" }), "w-fit")}
>
  Action
</Link>
```

For outline buttons:

```tsx
<Link
  href={`/somewhere`}
  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
>
  Action
</Link>
```

### Files affected by this correction

The implementation direction in this session specifically required updating places where link navigation had been styled through `<Button asChild>`, especially course-detail and browse-related page patterns.

### Why this matters

This prevents the same TypeScript error from reappearing and keeps the design system documentation truthful to the actual codebase instead of to a different shadcn template variant.

---

## Step 10 — Verification used for this feature

### Commands

```bash
npx tsc --noEmit
npm run build
npm run dev
```

### What to verify

- shared UI components compile correctly from `components/ui/*`
- `lib/utils.ts` resolves correctly through the `@/lib/utils` alias
- pages using `Button`, `Input`, `Textarea`, `Label`, and `Card` render correctly
- links styled as buttons use `buttonVariants(...)` instead of `asChild`
- no `Property 'asChild' does not exist on type ...` TypeScript error remains
- shared styling stays aligned with existing app color tokens such as `accent`, `border`, `surface`, and `text-*`

---

## Step 11 — Commit the shared UI foundation

### Command

```bash
git add .
git commit -m "feat(07): establish web design system and shared ui components"
git push origin main
```

### Why this matters

This saves the shared UI foundation before later features build more business-specific surfaces on top of it.

---

## Feature 07 completion checklist

- [x] shadcn/ui initialized in the project
- [x] Shared UI primitives added under `components/ui`
- [x] `lib/utils.ts` added with reusable `cn()` helper
- [x] Shared button variants established with `class-variance-authority`
- [x] Input, textarea, label, card, and checkbox primitives added
- [x] Real pages started moving from repeated raw classes to shared primitives
- [x] The incorrect `Button asChild` assumption was identified
- [x] The correct `Link + buttonVariants(...) + cn(...)` pattern was adopted
- [x] The shared design system now reflects the actual local implementation, not a generic template assumption

---

## Notes for future features

- All future navigation links that need button styling should use `buttonVariants(...)` instead of `Button asChild` unless the local `Button` component is intentionally rewritten to support Slot-based composition.
- Later features should keep building on `components/ui/*` before introducing page-local one-off primitives.
- If a future feature needs richer form handling, `form`, `select`, `dialog`, and `popover` can be added through shadcn/ui in the same shared pattern.
- Feature 08 and onward should treat Feature 07 as the visual foundation layer, not rebuild base controls from scratch.



---

## Feature 08 — Teacher Dashboard and Course Management Flow

### Goal

Build the real teacher dashboard and course management flow for **Moallem Academy** on top of the current Neon + Prisma foundation, using:

- real teacher-owned course reads from Neon through Prisma
- real course create / edit / publish mutations
- the shared cross-platform architecture:
  - `lib/queries/*` for reads
  - `lib/mutations/*` for business logic writes
  - `actions/*` for thin web-only Server Action wrappers
  - `app/api/*` for thin mobile/external Route Handler wrappers
- the shared shadcn-based design system established in Feature 07
- localized visible text in Arabic and English
- RTL-safe teacher-facing UI
- a clean base for future lesson/media work without implementing Feature 09 yet

This feature is about **teacher course management**, not the later media upload system, payment/access workflow, or playback/protection work.

---

## Decisions used for this feature

- Feature 07 is the active visual foundation, so all new teacher pages must reuse shared UI primitives instead of introducing page-specific markup.
- Neon + Prisma remains the active database path.
- `Course.teacherId` already existed from Feature 06, so ownership could be implemented without inventing a new teacher-only relation model.
- `Course.price` was added now as a small forward-compatible field so Feature 10 does not need to reopen the course basics schema for pricing.
- `teacherId` continues to store the Clerk user ID directly as the ownership key for web and future mobile/API reuse.
- Teacher reads were centralized in `lib/queries/teacher.ts`.
- Teacher write business logic was centralized in `lib/mutations/course.ts`.
- Web forms and buttons call thin wrappers in `actions/course.ts`.
- A mobile-facing teacher API route was added at `app/api/teacher/courses/route.ts`, reusing the same query layer.
- The teacher dashboard was built with the existing shared UI system: `Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `Label`, `EmptyState`, and `SectionCard`.
- All new visible strings were added to localization files under a new `TeacherDashboard` namespace.
- Full mobile/API auth hardening for teacher routes is intentionally deferred to a later feature; this feature only exposes the shared data path.

---

## Step 1 — Add missing shared shadcn form primitives

### Command

```bash
npx shadcn@latest add label
npx shadcn@latest add form
npm install react-hook-form @hookform/resolvers zod
```

### Files created or updated

- `components/ui/label.tsx`
- `components/ui/form.tsx`

### Why this matters

Feature 08 needs real create/edit course forms, and those forms should be built from the shared UI layer instead of local one-off labels and wrappers.  
This keeps the teacher flow aligned with the shared design system established in Feature 07.

---

## Step 2 — Extend the Prisma schema minimally for teacher course management

### File to update

`prisma/schema.prisma`

### Code

Add the `price` field and teacher index to `Course`:

```prisma
model Course {
  id            String   @id @default(cuid())
  subjectId     String   @map("subject_id")
  teacherId     String?  @map("teacher_id")
  nameAr        String   @map("name_ar")
  nameEn        String?  @map("name_en")
  descriptionAr String?  @map("description_ar")
  descriptionEn String?  @map("description_en")
  thumbnailUrl  String?  @map("thumbnail_url")
  price         Int      @default(0)
  isPublished   Boolean  @default(false) @map("is_published")
  sortOrder     Int      @default(0) @map("sort_order")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  subject       Subject      @relation(fields: [subjectId], references: [id], onDelete: Cascade)
  lessons       Lesson[]
  enrollments   Enrollment[]

  @@index([subjectId])
  @@index([teacherId])
  @@map("courses")
}
```

### Command

```bash
npx prisma migrate dev --name add_course_price_and_teacher_index
npx prisma generate
```

### Why this matters

Feature 08 needs only a small schema extension, not a full new teacher-content model.  
Adding `price` now avoids later schema churn, and indexing `teacherId` keeps teacher dashboard queries efficient as data grows.

---

## Step 3 — Create the shared teacher read layer

### File to create

`lib/queries/teacher.ts`

### Code

```ts
import "server-only";
import { prisma } from "@/lib/prisma";

export async function getTeacherCourses(clerkUserId: string) {
  return prisma.course.findMany({
    where: { teacherId: clerkUserId },
    include: {
      subject: {
        include: { academicYear: true },
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTeacherCourseById(
  courseId: string,
  clerkUserId: string
) {
  return prisma.course.findFirst({
    where: {
      id: courseId,
      teacherId: clerkUserId,
    },
    include: {
      subject: {
        include: { academicYear: true },
      },
    },
  });
}

export async function getSubjectsForCourseForm() {
  return prisma.subject.findMany({
    where: { isActive: true },
    include: {
      academicYear: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
        },
      },
    },
    orderBy: [
      { academicYear: { sortOrder: "asc" } },
      { sortOrder: "asc" },
    ],
  });
}
```

### Why this matters

This becomes the single shared source of truth for teacher-facing read operations.  
Both the web teacher dashboard and the future mobile app can reuse this read layer without duplicating Prisma queries.

---

## Step 4 — Create the shared teacher mutation layer

### File to create

`lib/mutations/course.ts`

### Code

```ts
import { prisma } from "@/lib/prisma";

export type CreateCourseInput = {
  teacherId: string;
  subjectId: string;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price?: number;
};

export async function createCourse(input: CreateCourseInput) {
  return prisma.course.create({
    data: {
      teacherId: input.teacherId,
      subjectId: input.subjectId,
      nameAr: input.nameAr,
      nameEn: input.nameEn ?? null,
      descriptionAr: input.descriptionAr ?? null,
      descriptionEn: input.descriptionEn ?? null,
      price: input.price ?? 0,
      isPublished: false,
    },
  });
}

export type UpdateCourseBasicsInput = {
  courseId: string;
  teacherId: string;
  subjectId?: string;
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price?: number;
};

export async function updateCourseBasics(input: UpdateCourseBasicsInput) {
  const existing = await prisma.course.findFirst({
    where: {
      id: input.courseId,
      teacherId: input.teacherId,
    },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("NOT_FOUND_OR_FORBIDDEN");
  }

  return prisma.course.update({
    where: { id: input.courseId },
    data: {
      ...(input.subjectId && { subjectId: input.subjectId }),
      ...(input.nameAr !== undefined && { nameAr: input.nameAr }),
      ...(input.nameEn !== undefined && { nameEn: input.nameEn }),
      ...(input.descriptionAr !== undefined && {
        descriptionAr: input.descriptionAr,
      }),
      ...(input.descriptionEn !== undefined && {
        descriptionEn: input.descriptionEn,
      }),
      ...(input.price !== undefined && { price: input.price }),
    },
  });
}

export async function toggleCoursePublish(courseId: string, teacherId: string) {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teacherId,
    },
    select: {
      id: true,
      isPublished: true,
    },
  });

  if (!course) {
    throw new Error("NOT_FOUND_OR_FORBIDDEN");
  }

  return prisma.course.update({
    where: { id: courseId },
    data: {
      isPublished: !course.isPublished,
    },
  });
}
```

### Why this matters

All actual business rules for course ownership, creation, editing, and publish state live here once.  
This prevents the web action layer and mobile API layer from drifting apart or bypassing ownership checks.

---

## Step 5 — Add thin web-only Server Action wrappers

### File to create

`actions/course.ts`

### Code

```ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createCourse,
  toggleCoursePublish,
  updateCourseBasics,
} from "@/lib/mutations/course";

const CreateCourseSchema = z.object({
  subjectId: z.string().min(1),
  nameAr: z.string().min(1),
  nameEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.coerce.number().int().min(0).optional(),
});

export async function createCourseAction(_: unknown, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const parsed = CreateCourseSchema.safeParse({
    subjectId: formData.get("subjectId"),
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn") || undefined,
    descriptionAr: formData.get("descriptionAr") || undefined,
    descriptionEn: formData.get("descriptionEn") || undefined,
    price: formData.get("price") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  try {
    const course = await createCourse({
      teacherId: userId,
      ...parsed.data,
    });

    return { success: true, courseId: course.id };
  } catch {
    return { success: false, error: "SERVER_ERROR" };
  }
}

const UpdateCourseSchema = CreateCourseSchema.extend({
  courseId: z.string().min(1),
});

export async function updateCourseAction(_: unknown, formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const parsed = UpdateCourseSchema.safeParse({
    courseId: formData.get("courseId"),
    subjectId: formData.get("subjectId") || undefined,
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn") || undefined,
    descriptionAr: formData.get("descriptionAr") || undefined,
    descriptionEn: formData.get("descriptionEn") || undefined,
    price: formData.get("price") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: "VALIDATION_ERROR" };
  }

  try {
    await updateCourseBasics({
      teacherId: userId,
      ...parsed.data,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND_OR_FORBIDDEN") {
      return { success: false, error: "FORBIDDEN" };
    }

    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function togglePublishAction(courseId: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const updated = await toggleCoursePublish(courseId, userId);
    return { success: true, isPublished: updated.isPublished };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND_OR_FORBIDDEN") {
      return { success: false, error: "FORBIDDEN" };
    }

    return { success: false, error: "SERVER_ERROR" };
  }
}
```

### Why this matters

The Server Action layer stays thin and web-only, exactly as required by the shared architecture.  
It handles auth and input parsing, then delegates all actual business logic to `lib/mutations/course.ts`.

---

## Step 6 — Add a mobile-facing teacher API route

### File to create

`app/api/teacher/courses/route.ts`

### Code

```ts
import { NextRequest, NextResponse } from "next/server";
import { getTeacherCourses } from "@/lib/queries/teacher";

export async function GET(request: NextRequest) {
  const teacherId = request.nextUrl.searchParams.get("teacherId");

  if (!teacherId) {
    return NextResponse.json(
      { error: "teacherId is required" },
      { status: 400 }
    );
  }

  try {
    const courses = await getTeacherCourses(teacherId);
    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
```

### Why this matters

The mobile app cannot import `server-only` query files directly, so it needs an HTTP surface.  
This route stays intentionally thin and reuses the exact same query logic as the web app.

---

## Step 7 — Add localized teacher dashboard strings

### Files to update

- `messages/ar.json`
- `messages/en.json`

### Code

`messages/ar.json`
```json
"TeacherDashboard": {
  "pageTitle": "لوحة تحكم المعلم",
  "myCourses": "كورساتي",
  "createCourse": "إنشاء كورس جديد",
  "editCourse": "تعديل الكورس",
  "publishCourse": "نشر الكورس",
  "unpublishCourse": "إلغاء النشر",
  "publishedBadge": "منشور",
  "draftBadge": "مسودة",
  "lessonsCount": "{count} درس",
  "enrollmentsCount": "{count} طالب",
  "emptyCourses": "لم تقم بإنشاء أي كورس بعد",
  "emptyCoursesAction": "أنشئ أول كورس لك الآن",
  "errorLoad": "تعذّر تحميل الكورسات، يرجى المحاولة مجدداً",
  "form": {
    "nameAr": "اسم الكورس بالعربي",
    "nameEn": "اسم الكورس بالإنجليزي (اختياري)",
    "descriptionAr": "الوصف بالعربي",
    "descriptionEn": "الوصف بالإنجليزي (اختياري)",
    "subject": "المادة الدراسية",
    "selectSubject": "اختر المادة",
    "price": "السعر (0 = مجاني)",
    "save": "حفظ",
    "saving": "جاري الحفظ...",
    "cancel": "إلغاء",
    "createSuccess": "تم إنشاء الكورس بنجاح",
    "updateSuccess": "تم تحديث الكورس بنجاح",
    "errorRequired": "هذا الحقل مطلوب",
    "errorServer": "حدث خطأ في الخادم، يرجى المحاولة مجدداً"
  }
}
```

`messages/en.json`
```json
"TeacherDashboard": {
  "pageTitle": "Teacher Dashboard",
  "myCourses": "My Courses",
  "createCourse": "Create New Course",
  "editCourse": "Edit Course",
  "publishCourse": "Publish Course",
  "unpublishCourse": "Unpublish",
  "publishedBadge": "Published",
  "draftBadge": "Draft",
  "lessonsCount": "{count} lessons",
  "enrollmentsCount": "{count} students",
  "emptyCourses": "You have not created any courses yet",
  "emptyCoursesAction": "Create your first course now",
  "errorLoad": "Could not load courses, please try again",
  "form": {
    "nameAr": "Course name (Arabic)",
    "nameEn": "Course name (English, optional)",
    "descriptionAr": "Description (Arabic)",
    "descriptionEn": "Description (English, optional)",
    "subject": "Subject",
    "selectSubject": "Select a subject",
    "price": "Price (0 = free)",
    "save": "Save",
    "saving": "Saving...",
    "cancel": "Cancel",
    "createSuccess": "Course created successfully",
    "updateSuccess": "Course updated successfully",
    "errorRequired": "This field is required",
    "errorServer": "A server error occurred, please try again"
  }
}
```

### Why this matters

Feature 08 introduces a full new teacher-facing flow, and every visible string in that flow must stay localized.  
This keeps Arabic-first and English-secondary behavior intact and avoids hardcoded text inside components.

---

## Step 8 — Build the shared teacher course form UI

### File to create

`components/teacher/CourseForm.tsx`

### Code

```tsx
"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createCourseAction, updateCourseAction } from "@/actions/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SubjectOption = {
  id: string;
  nameAr: string;
  nameEn: string | null;
  academicYear: {
    nameAr: string;
    nameEn: string | null;
  };
};

type Props = {
  mode: "create" | "edit";
  locale: string;
  subjects: SubjectOption[];
  defaultValues?: {
    courseId: string;
    subjectId: string;
    nameAr: string;
    nameEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
    price?: number;
  };
};

export function CourseForm({
  mode,
  locale,
  subjects,
  defaultValues,
}: Props) {
  const t = useTranslations("TeacherDashboard");
  const router = useRouter();

  const action = mode === "create" ? createCourseAction : updateCourseAction;
  const [state, formAction, isPending] = useActionState(action, null);

  if (state?.success && mode === "create" && state.courseId) {
    router.push(`/${locale}/teacher/courses/${state.courseId}/edit`);
  }

  if (state?.success && mode === "edit") {
    router.refresh();
  }

  return (
    <form action={formAction} className="space-y-6">
      {mode === "edit" && (
        <input type="hidden" name="courseId" value={defaultValues?.courseId} />
      )}

      <div className="space-y-2">
        <Label htmlFor="nameAr">{t("form.nameAr")}</Label>
        <Input
          id="nameAr"
          name="nameAr"
          defaultValue={defaultValues?.nameAr}
          required
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nameEn">{t("form.nameEn")}</Label>
        <Input
          id="nameEn"
          name="nameEn"
          defaultValue={defaultValues?.nameEn}
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionAr">{t("form.descriptionAr")}</Label>
        <Textarea
          id="descriptionAr"
          name="descriptionAr"
          defaultValue={defaultValues?.descriptionAr}
          rows={3}
          dir="rtl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionEn">{t("form.descriptionEn")}</Label>
        <Textarea
          id="descriptionEn"
          name="descriptionEn"
          defaultValue={defaultValues?.descriptionEn}
          rows={3}
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label>{t("form.subject")}</Label>
        <Select name="subjectId" defaultValue={defaultValues?.subjectId} required>
          <SelectTrigger>
            <SelectValue placeholder={t("form.selectSubject")} />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {locale === "ar"
                  ? subject.nameAr
                  : subject.nameEn ?? subject.nameAr}
                {" — "}
                {locale === "ar"
                  ? subject.academicYear.nameAr
                  : subject.academicYear.nameEn ?? subject.academicYear.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">{t("form.price")}</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min={0}
          defaultValue={defaultValues?.price ?? 0}
          dir="ltr"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-error">{t("form.errorServer")}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? t("form.saving") : t("form.save")}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          {t("form.cancel")}
        </Button>
      </div>
    </form>
  );
}
```

### Why this matters

The create and edit flows use the same form contract, so the UI should also be shared.  
This keeps form behavior and styling consistent while staying inside the shared design system.

---

## Step 9 — Build the teacher dashboard page

### File to update

`app/[locale]/(teacher)/teacher/page.tsx`

### Code

```tsx
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getTeacherCourses } from "@/lib/queries/teacher";
import { TeacherCourseList } from "@/components/teacher/TeacherCourseList";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TeacherDashboardPage({ params }: Props) {
  const { locale } = await params;
  const user = await currentUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const t = await getTranslations("TeacherDashboard");
  const courses = await getTeacherCourses(user.id);

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {t("pageTitle")}
            </h1>
          </div>

          <Link
            href={`/${locale}/teacher/courses/new`}
            className={buttonVariants({ variant: "default" })}
          >
            {t("createCourse")}
          </Link>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            message={t("emptyCourses")}
            action={
              <Link
                href={`/${locale}/teacher/courses/new`}
                className={buttonVariants({ variant: "outline" })}
              >
                {t("emptyCoursesAction")}
              </Link>
            }
          />
        ) : (
          <TeacherCourseList courses={courses} locale={locale} />
        )}
      </div>
    </main>
  );
}
```

### Why this matters

The teacher dashboard is the first real teacher-owned data view in the app.  
It reads directly from Neon through Prisma on the server, shows only the signed-in teacher’s own courses, and uses shared UI patterns instead of placeholder markup.

---

## Step 10 — Build the teacher course list and publish toggle

### Files to create

- `components/teacher/TeacherCourseList.tsx`
- `components/teacher/TogglePublishButton.tsx`

### Code

`components/teacher/TeacherCourseList.tsx`
```tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { TogglePublishButton } from "./TogglePublishButton";

type Course = {
  id: string;
  nameAr: string;
  nameEn: string | null;
  isPublished: boolean;
  _count: {
    lessons: number;
    enrollments: number;
  };
  subject: {
    nameAr: string;
    nameEn: string | null;
    academicYear: {
      nameAr: string;
      nameEn: string | null;
    };
  };
};

type Props = {
  courses: Course[];
  locale: string;
};

export async function TeacherCourseList({ courses, locale }: Props) {
  const t = await getTranslations("TeacherDashboard");

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardContent className="flex flex-wrap items-start justify-between gap-4 p-5">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-text-primary">
                  {locale === "ar" ? course.nameAr : course.nameEn ?? course.nameAr}
                </h2>

                <Badge variant={course.isPublished ? "default" : "secondary"}>
                  {course.isPublished
                    ? t("publishedBadge")
                    : t("draftBadge")}
                </Badge>
              </div>

              <p className="text-sm text-text-secondary">
                {locale === "ar"
                  ? course.subject.academicYear.nameAr
                  : course.subject.academicYear.nameEn ??
                    course.subject.academicYear.nameAr}
                {" · "}
                {locale === "ar"
                  ? course.subject.nameAr
                  : course.subject.nameEn ?? course.subject.nameAr}
              </p>

              <p className="text-xs text-text-muted">
                {t("lessonsCount", { count: course._count.lessons })}
                {" · "}
                {t("enrollmentsCount", { count: course._count.enrollments })}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <Link
                href={`/${locale}/teacher/courses/${course.id}/edit`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {t("editCourse")}
              </Link>

              <TogglePublishButton
                courseId={course.id}
                isPublished={course.isPublished}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

`components/teacher/TogglePublishButton.tsx`
```tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { togglePublishAction } from "@/actions/course";
import { Button } from "@/components/ui/button";

type Props = {
  courseId: string;
  isPublished: boolean;
};

export function TogglePublishButton({ courseId, isPublished }: Props) {
  const t = useTranslations("TeacherDashboard");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await togglePublishAction(courseId);
      router.refresh();
    });
  }

  return (
    <Button
      variant={isPublished ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPublished ? t("unpublishCourse") : t("publishCourse")}
    </Button>
  );
}
```

### Why this matters

The course list is the teacher’s main dashboard view, so it needs to clearly show ownership, publish state, and readiness for future lesson/media work.  
The publish toggle uses a thin client trigger but still routes the real mutation through the shared backend architecture.

---

## Step 11 — Build create and edit teacher course pages

### Files to create

- `app/[locale]/(teacher)/teacher/courses/new/page.tsx`
- `app/[locale]/(teacher)/teacher/courses/[courseId]/edit/page.tsx`

### Code

`app/[locale]/(teacher)/teacher/courses/new/page.tsx`
```tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getSubjectsForCourseForm } from "@/lib/queries/teacher";
import { CourseForm } from "@/components/teacher/CourseForm";
import { SectionCard } from "@/components/shared/SectionCard";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function NewCoursePage({ params }: Props) {
  const { locale } = await params;
  const user = await currentUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const t = await getTranslations("TeacherDashboard");
  const subjects = await getSubjectsForCourseForm();

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <SectionCard title={t("createCourse")}>
          <CourseForm mode="create" subjects={subjects} locale={locale} />
        </SectionCard>
      </div>
    </main>
  );
}
```

`app/[locale]/(teacher)/teacher/courses/[courseId]/edit/page.tsx`
```tsx
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getSubjectsForCourseForm,
  getTeacherCourseById,
} from "@/lib/queries/teacher";
import { CourseForm } from "@/components/teacher/CourseForm";
import { SectionCard } from "@/components/shared/SectionCard";

type Props = {
  params: Promise<{ locale: string; courseId: string }>;
};

export default async function EditCoursePage({ params }: Props) {
  const { locale, courseId } = await params;
  const user = await currentUser();

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const [course, subjects] = await Promise.all([
    getTeacherCourseById(courseId, user.id),
    getSubjectsForCourseForm(),
  ]);

  if (!course) {
    notFound();
  }

  const t = await getTranslations("TeacherDashboard");

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <SectionCard title={t("editCourse")}>
          <CourseForm
            mode="edit"
            subjects={subjects}
            locale={locale}
            defaultValues={{
              courseId: course.id,
              subjectId: course.subjectId,
              nameAr: course.nameAr,
              nameEn: course.nameEn ?? undefined,
              descriptionAr: course.descriptionAr ?? undefined,
              descriptionEn: course.descriptionEn ?? undefined,
              price: course.price,
            }}
          />
        </SectionCard>
      </div>
    </main>
  );
}
```

### Why this matters

Create and edit are the core real management flows of Feature 08.  
They use shared UI, localized labels, server-side reads, and ownership-aware data access without duplicating the underlying logic.

---

## Step 12 — Update shared supporting components only if needed

### Files that may need a small update

- `components/shared/EmptyState.tsx`
- `components/shared/SectionCard.tsx`

### Code

If `EmptyState` does not yet support actions:

```tsx
type Props = {
  message: string;
  action?: React.ReactNode;
};

export function EmptyState({ message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-sm text-text-muted">{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
```

If `SectionCard` does not yet support a title prop:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function SectionCard({ title, children }: Props) {
  return (
    <Card>
      {title ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}

      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

### Why this matters

Feature 08 should extend the shared UI layer when needed, not bypass it with temporary page-only structures.  
These small updates keep supporting components reusable across later teacher/admin flows.

---

## Step 13 — Local verification used for this feature

### Commands

```bash
npm run dev
npx prisma studio
npx tsc --noEmit
npm run build
```

### Also verify the teacher API route

```bash
curl "http://localhost:3000/api/teacher/courses?teacherId=YOUR_CLERK_USER_ID"
```

### What to verify

- `/ar/teacher` loads the teacher dashboard in Arabic with RTL layout.
- `/en/teacher` loads the same dashboard in English with LTR layout.
- A signed-in teacher only sees their own courses.
- The empty state appears correctly when the teacher has no courses.
- `/ar/teacher/courses/new` loads a localized create form.
- The subject select is populated from real Neon data.
- Creating a course inserts a real `courses` row in Neon with the current Clerk user ID in `teacherId`.
- New courses appear on the teacher dashboard as `Draft`.
- Editing a course updates the real row in Neon.
- Toggling publish state updates `isPublished` correctly.
- `/api/teacher/courses?teacherId=...` returns JSON using the shared query layer.
- No visible strings remain hardcoded in any teacher-facing component.
- `npx tsc --noEmit` and `npm run build` both pass.

---

## Step 14 — Commit the teacher dashboard and course management flow

### Command

```bash
git add .
git commit -m "feat(08): teacher dashboard and course management flow"
git push origin main
```

### Why this matters

This saves the first real teacher-owned product flow, using the shared read/write architecture, the shared shadcn-based UI system, and real Prisma-backed mutations instead of mock data.

---

## Feature 08 completion checklist

- [x] Teacher dashboard reads real teacher-owned courses from Neon through Prisma
- [x] `Course.price` added as a minimal forward-compatible schema field
- [x] Teacher reads centralized in `lib/queries/teacher.ts`
- [x] Teacher write business logic centralized in `lib/mutations/course.ts`
- [x] Web-only Server Actions added in `actions/course.ts` as thin wrappers
- [x] Mobile-facing teacher API route added in `app/api/teacher/courses/route.ts`
- [x] Real create course flow implemented
- [x] Real edit course basics flow implemented
- [x] Real publish / draft toggle implemented
- [x] Ownership checks enforced inside the shared mutation layer
- [x] Teacher UI built using the shared Feature 07 design system primitives
- [x] New visible strings localized under `TeacherDashboard`
- [x] Arabic-first / RTL-safe teacher flow preserved
- [x] No mock-data dependency used for this feature
- [x] No stale Supabase-specific implementation assumptions used in this feature

---

## Notes for future features

- Feature 09 should extend this teacher course-management base by adding lesson/media authoring, not by rebuilding course ownership or teacher dashboard reads.
- Full mobile/API auth enforcement for teacher routes should be tightened in a later feature once the mobile authentication contract is finalized.
- If future teacher flows need richer UI primitives such as dialog, sheet, or advanced form components, those should be added through the shared `components/ui` layer first.
- `teacherId` as Clerk user ID should continue to be treated as the ownership key unless the project deliberately introduces a different cross-platform teacher identity mapping later.
- Feature 10 and later monetization/access flows can safely build on the `price` field added here without reopening the teacher course basics implementation.




------


## Feature 09 — Course Media Source System, Teacher Upload Flow, Web/Mobile Delivery, and Postman Testing

### Goal

Build the real **Feature 09 media source system** for Moallem Academy so each lesson can use one of two video-source paths:

- teacher-uploaded video stored in Cloudinary
- teacher-provided external video link

This feature also establishes:

- lesson-level media metadata in the real database
- a safe teacher-only upload and update flow
- a shared server-side read layer for media playback decisions
- a web teacher UI for attaching and updating media
- a mobile-safe HTTP delivery path that does not depend on Server Components
- protected playback URL generation for uploaded media
- a clear testing path in Postman for API verification

This feature is about the **real media-source architecture**, not fake file placeholders and not open public video URLs by default.

---

## Decisions used for this feature

- The existing Neon + Prisma stack remains the database foundation.
- Cloudinary is used as the uploaded-video storage provider.
- A lesson can point to exactly one active media source at a time.
- The media model must support both web and mobile, so the database stores source metadata instead of storing UI-specific assumptions.
- External-link media is stored as a URL and opened directly.
- Uploaded Cloudinary media is stored by metadata such as public ID, resource type, format, bytes, and duration.
- Uploaded media playback URLs are generated on the server, never hardcoded into the client.
- The teacher web app can call Server Actions for mutations, but mobile must use Route Handlers, so the implementation keeps business logic in shared mutation/query files.
- Playback access is resolved from the same enrollment/access logic already established earlier in the project.
- For uploaded protected video, the app generates a signed Cloudinary authenticated URL.
- To make browser preview open as video instead of downloading a nameless file, the signed Cloudinary URL is generated with `format: "mp4"`.
- Web and mobile both rely on the same server-side media decision logic, but consume it in different ways: Server Components or server actions for web, HTTP JSON endpoints for mobile.

---

## What this feature solves

Before this feature, lessons only had a placeholder `videoUrl` string and the course detail flow could show preview / locked / accessible lesson states, but there was no real multi-source media model.

Feature 09 replaces that weak single-string approach with a proper source-aware model so the app can answer these questions correctly:

- Is this lesson using an uploaded video or an external link?
- If it is uploaded, what Cloudinary asset should be used?
- If it is external, what exact URL should open?
- Should the current user receive a playable URL at all?
- Should the web app open a new tab, show an inline player, or keep the lesson locked?
- How can mobile request the same answer over HTTP?

---

## Step 1 — Extend the Prisma schema for lesson media sources

### File to update

`prisma/schema.prisma`

### Code

```prisma
enum LessonMediaSourceType {
  cloudinary_upload
  external_link
}

model Lesson {
  id          String   @id @default(cuid())
  courseId    String   @map("course_id")
  titleAr     String   @map("title_ar")
  titleEn     String?  @map("title_en")
  description String?
  videoUrl    String?  @map("video_url")
  isPreview   Boolean  @default(false) @map("is_preview")
  isPublished Boolean  @default(false) @map("is_published")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
  media  LessonMedia?

  @@index([courseId])
  @@map("lessons")
}

model LessonMedia {
  id                        String                @id @default(cuid())
  lessonId                  String                @unique @map("lesson_id")
  sourceType                LessonMediaSourceType @map("source_type")
  externalUrl               String?               @map("external_url")
  cloudinaryPublicId        String?               @map("cloudinary_public_id")
  cloudinaryResourceType    String?               @map("cloudinary_resource_type")
  cloudinaryFormat          String?               @map("cloudinary_format")
  cloudinaryBytes           Int?                  @map("cloudinary_bytes")
  cloudinaryDurationSeconds Float?                @map("cloudinary_duration_seconds")
  createdAt                 DateTime              @default(now()) @map("created_at")
  updatedAt                 DateTime              @updatedAt @map("updated_at")

  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@index([sourceType])
  @@map("lesson_media")
}
```

### Why this matters

The old `Lesson.videoUrl` field was too weak for a real product because it could not truthfully describe whether the source came from Cloudinary or from an external provider. The new `LessonMedia` table creates a proper one-to-one media record per lesson and keeps the source description normalized.

### Important implementation note

The old `videoUrl` field can temporarily remain during the migration period so existing code does not break immediately. After all reads are moved to `LessonMedia`, the project can later remove `videoUrl` in a cleanup feature.

---

## Step 2 — Apply the migration and regenerate Prisma

### Command

```bash
npx prisma migrate dev --name add-lesson-media-source-system
npx prisma generate
```

### Why this matters

This creates the real `lesson_media` table in Neon and updates the Prisma client so the app can read and write the new model safely.

### Verify

```bash
npx prisma studio
```

Confirm:

- `lesson_media` exists
- `lesson_id` is unique
- `source_type` is present
- nullable Cloudinary fields are available
- nullable `external_url` is available

---

## Step 3 — Add the Cloudinary server helper

### File to create

`lib/cloudinary.ts`

### Code

```ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };
```

### Why this matters

Cloudinary configuration must live in one server-side place so upload handlers, signed delivery URLs, and later cleanup/delete operations all use the same connection.

---

## Step 4 — Add shared teacher media mutations

### File to create

`lib/mutations/media.ts`

### Code

```ts
import "server-only";
import { prisma } from "@/lib/prisma";

type SetExternalLessonMediaInput = {
  lessonId: string;
  teacherId: string;
  externalUrl: string;
};

type SetCloudinaryLessonMediaInput = {
  lessonId: string;
  teacherId: string;
  cloudinaryPublicId: string;
  cloudinaryResourceType: string;
  cloudinaryFormat: string | null;
  cloudinaryBytes: number | null;
  cloudinaryDurationSeconds: number | null;
};

async function assertTeacherOwnsLesson(lessonId: string, teacherId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      course: {
        select: {
          teacherId: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (lesson.course.teacherId !== teacherId) {
    throw new Error("Not authorized to manage this lesson");
  }

  return lesson;
}

export async function setExternalLessonMedia({
  lessonId,
  teacherId,
  externalUrl,
}: SetExternalLessonMediaInput) {
  await assertTeacherOwnsLesson(lessonId, teacherId);

  return prisma.lessonMedia.upsert({
    where: { lessonId },
    update: {
      sourceType: "external_link",
      externalUrl,
      cloudinaryPublicId: null,
      cloudinaryResourceType: null,
      cloudinaryFormat: null,
      cloudinaryBytes: null,
      cloudinaryDurationSeconds: null,
    },
    create: {
      lessonId,
      sourceType: "external_link",
      externalUrl,
    },
  });
}

export async function setCloudinaryLessonMedia({
  lessonId,
  teacherId,
  cloudinaryPublicId,
  cloudinaryResourceType,
  cloudinaryFormat,
  cloudinaryBytes,
  cloudinaryDurationSeconds,
}: SetCloudinaryLessonMediaInput) {
  await assertTeacherOwnsLesson(lessonId, teacherId);

  return prisma.lessonMedia.upsert({
    where: { lessonId },
    update: {
      sourceType: "cloudinary_upload",
      externalUrl: null,
      cloudinaryPublicId,
      cloudinaryResourceType,
      cloudinaryFormat,
      cloudinaryBytes,
      cloudinaryDurationSeconds,
    },
    create: {
      lessonId,
      sourceType: "cloudinary_upload",
      cloudinaryPublicId,
      cloudinaryResourceType,
      cloudinaryFormat,
      cloudinaryBytes,
      cloudinaryDurationSeconds,
    },
  });
}
```

### Why this matters

This keeps all media-write business rules in one place:

- verify the lesson exists
- verify the lesson belongs to the signed-in teacher
- upsert the lesson media record
- clear the unused fields when switching source type

That prevents web and mobile from drifting into different logic.

---

## Step 5 — Add the teacher upload API route for Cloudinary

### File to create

`app/api/teacher/lessons/[lessonId]/upload/route.ts`

### Code

```ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { setCloudinaryLessonMedia } from "@/lib/mutations/media";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "moallem-academy/lessons",
          type: "authenticated",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    await setCloudinaryLessonMedia({
      lessonId,
      teacherId: userId,
      cloudinaryPublicId: uploadResult.public_id,
      cloudinaryResourceType: uploadResult.resource_type,
      cloudinaryFormat: uploadResult.format ?? null,
      cloudinaryBytes: uploadResult.bytes ?? null,
      cloudinaryDurationSeconds: uploadResult.duration ?? null,
    });

    return NextResponse.json({
      success: true,
      media: {
        lessonId,
        sourceType: "cloudinary_upload",
        cloudinaryPublicId: uploadResult.public_id,
        format: uploadResult.format ?? null,
        bytes: uploadResult.bytes ?? null,
        duration: uploadResult.duration ?? null,
      },
    });
  } catch (error) {
    console.error("[teacher lesson upload] POST error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

### Why this matters

This is the real web/mobile-safe upload boundary. The file is received by the server, streamed into Cloudinary, and only then is the database updated. The browser or mobile client never writes Cloudinary metadata directly into Neon on its own.

---

## Step 6 — Add the teacher external-link API route

### File to create

`app/api/teacher/lessons/[lessonId]/external-link/route.ts`

### Code

```ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { setExternalLessonMedia } from "@/lib/mutations/media";

const schema = z.object({
  externalUrl: z.string().url(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await params;
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid external URL" }, { status: 400 });
    }

    const media = await setExternalLessonMedia({
      lessonId,
      teacherId: userId,
      externalUrl: parsed.data.externalUrl,
    });

    return NextResponse.json({ success: true, media });
  } catch (error) {
    console.error("[teacher lesson external-link] POST error:", error);
    return NextResponse.json({ error: "Failed to save external link" }, { status: 500 });
  }
}
```

### Why this matters

This route gives the teacher a second supported source path without mixing external-link validation into the upload route.

---

## Step 7 — Add shared media query logic

### File to create

`lib/queries/media.ts`

### Code

```ts
import "server-only";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getStudentEnrollmentForCourse } from "@/lib/queries/course";

export async function getLessonMediaByLessonId(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      titleAr: true,
      titleEn: true,
      isPreview: true,
      isPublished: true,
      courseId: true,
      media: true,
      course: {
        select: {
          id: true,
          isPublished: true,
        },
      },
    },
  });
}

export async function getProtectedPlaybackUrl(media: {
  sourceType: "cloudinary_upload" | "external_link";
  externalUrl: string | null;
  cloudinaryPublicId: string | null;
  cloudinaryResourceType: string | null;
}) {
  if (media.sourceType === "external_link") {
    return media.externalUrl;
  }

  if (!media.cloudinaryPublicId) {
    return null;
  }

  const url = cloudinary.url(media.cloudinaryPublicId, {
    resource_type:
      (media.cloudinaryResourceType as "video" | "image" | "raw") ?? "video",
    sign_url: true,
    expires_at: Math.round(Date.now() / 1000) + 600,
    type: "authenticated",
    format: "mp4",
  });

  return url;
}

export async function canUserAccessLessonMedia(input: {
  lessonId: string;
  profileId: string | null;
}) {
  const lesson = await getLessonMediaByLessonId(input.lessonId);

  if (!lesson || !lesson.isPublished || !lesson.course.isPublished || !lesson.media) {
    return {
      allowed: false,
      reason: "not_found",
      lesson: null,
      playbackUrl: null,
    } as const;
  }

  if (lesson.isPreview) {
    return {
      allowed: true,
      reason: "preview",
      lesson,
      playbackUrl: await getProtectedPlaybackUrl(lesson.media),
    } as const;
  }

  if (!input.profileId) {
    return {
      allowed: false,
      reason: "auth_required",
      lesson,
      playbackUrl: null,
    } as const;
  }

  const enrollment = await getStudentEnrollmentForCourse(input.profileId, lesson.courseId);

  if (!enrollment || enrollment.status !== "confirmed") {
    return {
      allowed: false,
      reason: "not_enrolled",
      lesson,
      playbackUrl: null,
    } as const;
  }

  return {
    allowed: true,
    reason: "confirmed",
    lesson,
    playbackUrl: await getProtectedPlaybackUrl(lesson.media),
  } as const;
}
```

### Why this matters

This file becomes the single source of truth for playback decisions. It answers both access control and delivery URL generation in one shared layer that web and mobile can both reuse.

### Important bug fixed in this feature

When the Cloudinary signed authenticated URL was generated without an explicit output format, the browser opened a new tab and downloaded a file named only by the public ID, without a useful extension. The fix was to generate the URL with:

```ts
format: "mp4"
```

That made the signed Cloudinary URL resolve as a real video resource that browsers can treat like video instead of a generic downloadable file.

---

## Step 8 — Add a mobile-safe lesson playback API route

### File to create

`app/api/lessons/[lessonId]/playback/route.ts`

### Code

```ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canUserAccessLessonMedia } from "@/lib/queries/media";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { userId } = await auth();
    const { lessonId } = await params;

    let profileId: string | null = null;

    if (userId) {
      const profile = await prisma.profile.findUnique({
        where: { clerkUserId: userId },
        select: { id: true },
      });
      profileId = profile?.id ?? null;
    }

    const result = await canUserAccessLessonMedia({
      lessonId,
      profileId,
    });

    if (!result.lesson) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!result.allowed) {
      return NextResponse.json(
        {
          allowed: false,
          reason: result.reason,
        },
        { status: result.reason === "auth_required" ? 401 : 403 }
      );
    }

    return NextResponse.json({
      allowed: true,
      reason: result.reason,
      sourceType: result.lesson.media?.sourceType ?? null,
      playbackUrl: result.playbackUrl,
    });
  } catch (error) {
    console.error("[lesson playback] GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
```

### Why this matters

Mobile cannot import server-only query logic or open a Server Component page to get the playback URL. This API route gives mobile one clean JSON response that says whether the lesson is allowed and, if allowed, which URL to open.

---

## Step 9 — Add teacher-side web actions as thin wrappers

### File to create

`actions/media.ts`

### Code

```ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { setExternalLessonMedia } from "@/lib/mutations/media";

export async function saveExternalLessonMediaAction(input: {
  lessonId: string;
  externalUrl: string;
  locale: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await setExternalLessonMedia({
    lessonId: input.lessonId,
    teacherId: userId,
    externalUrl: input.externalUrl,
  });

  revalidatePath(`/${input.locale}/teacher/courses`);
}
```

### Why this matters

The project pattern is consistent:

- shared business logic in `lib/mutations/*`
- thin Server Action wrapper for web-only forms
- thin Route Handler wrapper for mobile or HTTP access

---

## Step 10 — Build the teacher web media-management UI

### Files to create or update

- `components/teacher/lesson-media-form.tsx`
- `app/[locale]/(teacher)/teacher/lessons/[lessonId]/media/page.tsx`

### Example page code

```tsx
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LessonMediaForm } from "@/components/teacher/lesson-media-form";

export default async function TeacherLessonMediaPage({
  params,
}: {
  params: Promise<{ locale: string; lessonId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) notFound();

  const { locale, lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      media: true,
      course: {
        select: {
          teacherId: true,
          nameAr: true,
          nameEn: true,
        },
      },
    },
  });

  if (!lesson || lesson.course.teacherId !== userId) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <LessonMediaForm locale={locale} lesson={lesson} />
    </main>
  );
}
```

### What the form should do

The teacher page should present two source choices:

- **External link mode**: text input + save button
- **Upload mode**: file input + upload button

It should also show current media status such as:

- current source type
- Cloudinary public ID if uploaded
- external URL if linked
- upload success or error message
- preview/open button after save

### Why this matters

Feature 09 is not complete if the backend exists but the teacher has no real UI to attach media to a lesson.

---

## Step 11 — How the web playback path works

### Web flow used

For the web app, the playback/open logic works like this:

1. The student reaches the course detail page.
2. The page already knows which lessons are preview, locked, or accessible.
3. When the student clicks a lesson play/open action, the app requests the lesson playback decision from the server.
4. If the lesson uses an external link, the app opens that URL in a new tab.
5. If the lesson uses a Cloudinary upload, the server generates a signed authenticated playback URL.
6. That signed URL is opened in a new tab, or used inside a `<video controls>` player.

### Why this matters

The browser must never guess whether a lesson is accessible. The server decides first, then returns the final URL only for allowed cases.

### Important browser behavior note

External links naturally open like normal URLs because they come from a video-hosting provider that already serves browser-friendly playback pages.

Cloudinary authenticated media behaves differently because it is a protected asset delivery URL, not a hosted watch page. That is why the app had to explicitly generate the signed URL in `mp4` format to make browser behavior correct for preview/open flows.

---

## Step 12 — How the mobile playback path works

### Mobile flow used

For mobile, the implementation follows the same business rules but through an API boundary:

1. Mobile calls `GET /api/lessons/:lessonId/playback`.
2. The server identifies the signed-in user.
3. The server resolves the matching app profile.
4. The server checks whether the lesson is preview content or whether the student has a confirmed enrollment.
5. If access is allowed, the server returns JSON containing `playbackUrl` and `sourceType`.
6. The mobile app then opens the returned URL inside its video player or web view flow.

### Why this matters

React Native cannot use Server Actions or import server-only files, so the shared logic had to be wrapped behind HTTP while still keeping the real access rules centralized on the server.

---

## Step 13 — Add localized strings for the teacher media UI

### Files to update

- `messages/ar.json`
- `messages/en.json`

### Code

```json
"TeacherLessonMedia": {
  "title": "إدارة فيديو الدرس",
  "sourceType": "نوع المصدر",
  "externalLink": "رابط خارجي",
  "uploadVideo": "رفع فيديو",
  "externalUrlLabel": "رابط الفيديو الخارجي",
  "videoFileLabel": "ملف الفيديو",
  "saveExternal": "حفظ الرابط",
  "uploadNow": "رفع الآن",
  "currentMedia": "الوسائط الحالية",
  "openPreview": "فتح المعاينة",
  "uploadSuccess": "تم رفع الفيديو بنجاح",
  "saveSuccess": "تم حفظ الرابط بنجاح",
  "errorGeneric": "حدث خطأ أثناء حفظ الوسائط"
}
```

```json
"TeacherLessonMedia": {
  "title": "Lesson video management",
  "sourceType": "Source type",
  "externalLink": "External link",
  "uploadVideo": "Upload video",
  "externalUrlLabel": "External video URL",
  "videoFileLabel": "Video file",
  "saveExternal": "Save link",
  "uploadNow": "Upload now",
  "currentMedia": "Current media",
  "openPreview": "Open preview",
  "uploadSuccess": "Video uploaded successfully",
  "saveSuccess": "Link saved successfully",
  "errorGeneric": "An error occurred while saving media"
}
```

### Why this matters

Feature 09 adds a teacher-facing management surface, so all visible labels and result messages must stay localized like the rest of the project.

---

## Step 14 — Local verification used for this feature

### Commands

```bash
npx prisma migrate dev --name add-lesson-media-source-system
npx prisma generate
npm run dev
npx tsc --noEmit
npm run build
```

### What to verify on web

- Teacher can open the lesson media management page.
- Teacher can paste an external URL and save it.
- The `lesson_media` row is created with `source_type = external_link`.
- Teacher can upload a video file.
- The file is uploaded to Cloudinary under `moallem-academy/lessons`.
- The `lesson_media` row is updated to `source_type = cloudinary_upload`.
- Cloudinary metadata is saved in Neon.
- Switching from upload to external link clears old Cloudinary fields.
- Switching from external link to upload clears old external URL.
- A preview lesson can return a playback URL even without confirmed enrollment.
- A locked lesson does not return a playback URL for unauthenticated or unconfirmed users.
- A confirmed enrollment returns a playable URL.
- Cloudinary preview opens as video instead of downloading a file with no extension.

### What to verify for mobile

- `GET /api/lessons/:lessonId/playback` returns `401` when auth is required and missing.
- The same endpoint returns `403` when the lesson is locked and enrollment is not confirmed.
- The same endpoint returns `200` plus `playbackUrl` when the lesson is preview or confirmed.
- The returned `sourceType` matches the saved media row.

---

## Step 15 — How to test Feature 09 from Postman

### A. Test external-link save route

#### Request

- Method: `POST`
- URL: `http://localhost:3000/api/teacher/lessons/<LESSON_ID>/external-link`
- Auth: include the same session/cookie flow used by the signed-in teacher in local development
- Headers:

```text
Content-Type: application/json
```

- Body:

```json
{
  "externalUrl": "https://www.youtube.com/watch?v=example"
}
```

#### Expected result

- Status: `200`
- JSON contains `success: true`
- Database row is created or updated in `lesson_media`

#### Failure cases to test

- invalid URL should return `400`
- missing auth should return `401`
- lesson owned by another teacher should return `500` unless later mapped to `403`

---

### B. Test Cloudinary upload route

#### Request

- Method: `POST`
- URL: `http://localhost:3000/api/teacher/lessons/<LESSON_ID>/upload`
- Auth: include teacher session/cookies
- Body type: `form-data`
- Key:
  - `file` → choose a real `.mp4` file

#### Expected result

- Status: `200`
- JSON returns:
  - `success: true`
  - `sourceType: cloudinary_upload` inside the payload
  - `cloudinaryPublicId`
- A new asset appears in Cloudinary
- The matching `lesson_media` row is updated in Neon

#### Failure cases to test

- no file should return `400`
- missing auth should return `401`
- unsupported ownership should fail

---

### C. Test lesson playback route for preview lesson

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/lessons/<PREVIEW_LESSON_ID>/playback`

#### Expected result

For a published preview lesson with valid media:

- Status: `200`
- JSON contains:

```json
{
  "allowed": true,
  "reason": "preview",
  "sourceType": "external_link",
  "playbackUrl": "https://..."
}
```

or, for uploaded Cloudinary media:

```json
{
  "allowed": true,
  "reason": "preview",
  "sourceType": "cloudinary_upload",
  "playbackUrl": "https://res.cloudinary.com/...mp4?..."
}
```

---

### D. Test lesson playback route for locked lesson without enrollment

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/lessons/<LOCKED_LESSON_ID>/playback`

#### Expected result

- Status: `401` if sign-in is required and user is not authenticated
- or `403` if user is authenticated but not confirmed for the course

Typical JSON:

```json
{
  "allowed": false,
  "reason": "not_enrolled"
}
```

---

### E. Test lesson playback route for confirmed student

#### Setup first

Use Prisma Studio or the database to make sure there is a matching `enrollments` row:

- `profile_id` belongs to the signed-in student
- `course_id` matches the lesson's course
- `status = confirmed`

#### Request

- Method: `GET`
- URL: `http://localhost:3000/api/lessons/<LOCKED_LESSON_ID>/playback`
- Auth: signed-in student session/cookies

#### Expected result

- Status: `200`
- JSON contains `allowed: true`
- `playbackUrl` is present

---

## Step 16 — Notes about auth in Postman

Because these teacher and student endpoints depend on Clerk authentication, Postman testing in local development usually needs one of these approaches:

- copy the authenticated browser cookies into Postman
- use a temporary development-only test route that injects a known user for local debugging
- use Postman Interceptor so the signed-in browser session can be reused

The safest real-project approach is to test with the actual authenticated cookies from the browser session, because it verifies the route exactly as the web app uses it.

---

## Step 17 — Commit the feature

### Command

```bash
git add .
git commit -m "feat(09): add lesson media source system and protected playback flow"
git push origin main
```

### Why this matters

This saves the real multi-source lesson media architecture, the teacher media-management flow, the protected playback delivery logic, and the mobile-safe HTTP playback route in one coherent feature.

---

## Feature 09 completion checklist

- [x] `LessonMedia` model added as a real one-to-one lesson media table
- [x] Media source type supports both `cloudinary_upload` and `external_link`
- [x] Shared media mutation layer added in `lib/mutations/media.ts`
- [x] Shared media query/access layer added in `lib/queries/media.ts`
- [x] Teacher upload route added for Cloudinary video uploads
- [x] Teacher external-link route added
- [x] Teacher lesson media web page added
- [x] Mobile-safe playback route added at `GET /api/lessons/[lessonId]/playback`
- [x] Protected Cloudinary authenticated delivery URLs generated on the server
- [x] Cloudinary preview-download issue fixed by generating signed playback URLs with `format: "mp4"`
- [x] Web and mobile both use the same server-side media decision logic
- [x] Localization added for teacher media management UI
- [x] Feature tested through web flow, mobile-safe JSON flow, and Postman requests

---

## Notes for future features

- A later cleanup feature can safely remove `Lesson.videoUrl` once all reads fully depend on `LessonMedia`.
- A later UX feature can replace new-tab video opening with an inline secure video player component for a smoother teacher and student experience.
- If the mobile app later uploads directly to Cloudinary, it should still finalize the database update through the server so ownership and lesson linkage remain trusted.
- Future analytics can track which source type is most used per lesson without changing the schema again.



### Feature 09 update — Improve Cloudinary upload UX for large lesson videos

After the first working version of Feature 09 was completed, the teacher upload flow still had one weak point: when a teacher uploaded a large video file such as 150 MB or 200 MB, the UI only showed a loading spinner during the Cloudinary upload. That was technically correct, but it was not a good real product experience because the teacher could not tell how much had uploaded, whether the upload was healthy, or how long remained.

To fix that, the upload experience was upgraded inside the existing teacher lesson media component instead of introducing a separate upload page or replacing the whole media architecture.

---

## Why the change was made

The first implementation already supported the full Cloudinary media flow:

- generate a signed upload signature from the app
- upload the video directly from the browser to Cloudinary
- receive the Cloudinary asset response
- call the app action to save the media metadata to the lesson
- refresh the lesson page and show preview/success state

The missing piece was progress visibility during the direct upload itself. Since the upload goes from browser to Cloudinary, the progress state has to be tracked in the browser client, not in `lib/mutations/*`, not in Prisma code, and not in the lesson media query layer.

That is why this improvement was implemented inside `LessonMediaManager`.

---

## Where the update was applied

### File updated

`components/teacher/LessonMediaManager.tsx`

This is the correct place because this component already owns:

- source-type switching between Cloudinary and external link
- Cloudinary upload flow
- external-link save flow
- preview link rendering
- media delete action
- upload success/error feedback

The upload progress feature belongs to this same lesson-level teacher media manager because the browser is the only layer that can receive real upload-progress events while sending the file to Cloudinary.

---

## Architectural decision kept unchanged

The upload architecture itself was not replaced. The app still uses the same Feature 09 direct-upload flow:

1. The teacher selects a video file in the lesson media manager.
2. The client requests a signature from `/api/cloudinary/upload-signature`.
3. The client uploads the file directly to Cloudinary.
4. After Cloudinary accepts the upload, the client calls `saveCloudinaryMediaAction(...)`.
5. The server saves the Cloudinary metadata against the lesson.
6. The page refreshes and shows the updated media state.

This means the app still avoids streaming the full video file through the application server, which keeps the architecture lighter and closer to the mobile-friendly provider pattern already established for Feature 09.

---

## What was changed in the upload implementation

The old upload code used `fetch()` to send the file to Cloudinary. That worked functionally, but it did not provide browser upload-progress events in a practical way for the teacher UI.

So the implementation changed only the Cloudinary upload request method:

- old approach: `fetch(...)`
- new approach: `XMLHttpRequest`

The reason is that `XMLHttpRequest.upload.onprogress` gives real byte-level upload progress events from the browser while the file is being sent to Cloudinary.

This made it possible to show:

- percent complete
- uploaded bytes vs total file size
- upload speed
- estimated time remaining
- cancel upload action

---

## State added to the component

A new typed progress state was added to `LessonMediaManager` so the component can render truthful progress information during large uploads.

### Code added

```ts
type UploadProgressState = {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  speedBps: number;
  etaSeconds: number | null;
};

type CloudinaryUploadResponse = {
  public_id: string;
  duration?: number;
};
```

This state tracks:

- `progress` — integer percentage for the progress bar
- `uploadedBytes` — how many bytes have been sent so far
- `totalBytes` — full file size
- `speedBps` — current upload speed in bytes per second
- `etaSeconds` — estimated remaining time

The dedicated `CloudinaryUploadResponse` type was also added so the upload promise no longer used `Promise<any>`, which fixed the ESLint error about `Unexpected any`.

---

## New local state and refs added

### Code added

```ts
const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
  progress: 0,
  uploadedBytes: 0,
  totalBytes: 0,
  speedBps: 0,
  etaSeconds: null,
});

const xhrRef = useRef<XMLHttpRequest | null>(null);
```

`uploadProgress` stores the live progress values used by the UI.

`xhrRef` stores the active `XMLHttpRequest` instance so the teacher can cancel the upload with `xhr.abort()` while the file is still being sent.

---

## Helper functions added for display formatting

Because raw bytes and raw seconds are not useful teacher-facing values, helper functions were added inside the component to format progress details into readable text.

### Code added

```ts
function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatEta(seconds: number | null) {
  if (seconds == null || !Number.isFinite(seconds)) return "Calculating...";
  if (seconds < 60) return `${Math.ceil(seconds)} sec left`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);

  if (minutes < 60) {
    return `${minutes} min ${remainingSeconds} sec left`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours} hr ${remainingMinutes} min left`;
}
```

These helpers are used only for the teacher-facing progress UI and do not affect database or provider logic.

---

## Cloudinary upload function changed from spinner-only to progress-aware

The main logic change happened inside:

`handleCloudinaryUploadAndSave()`

The upload flow still starts the same way by requesting the upload signature from the app. That part stayed unchanged.

The actual file upload step was replaced with a Promise wrapping `XMLHttpRequest`.

### Updated upload code

```ts
async function handleCloudinaryUploadAndSave() {
  if (!uploadFile) return;

  setUploadError(null);
  setUploadSuccess(false);
  setIsUploading(true);
  setUploadProgress({
    progress: 0,
    uploadedBytes: 0,
    totalBytes: uploadFile.size,
    speedBps: 0,
    etaSeconds: null,
  });

  try {
    const sigRes = await fetch("/api/cloudinary/upload-signature");
    if (!sigRes.ok) throw new Error("signature_failed");

    const { signature, timestamp, cloudName, apiKey, folder, type } =
      await sigRes.json();

    const fd = new FormData();
    fd.append("file", uploadFile);
    fd.append("api_key", apiKey);
    fd.append("timestamp", String(timestamp));
    fd.append("signature", signature);
    fd.append("folder", folder);
    fd.append("resource_type", "video");
    fd.append("type", type);

    const uploadData = await new Promise<CloudinaryUploadResponse>(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        const startedAt = Date.now();

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          true
        );

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;

          const uploadedBytes = event.loaded;
          const totalBytes = event.total;
          const progress = Math.round((uploadedBytes / totalBytes) * 100);

          const elapsedSeconds = (Date.now() - startedAt) / 1000;
          const speedBps = elapsedSeconds > 0 ? uploadedBytes / elapsedSeconds : 0;
          const remainingBytes = totalBytes - uploadedBytes;
          const etaSeconds = speedBps > 0 ? remainingBytes / speedBps : null;

          setUploadProgress({
            progress,
            uploadedBytes,
            totalBytes,
            speedBps,
            etaSeconds,
          });
        };

        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const json = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
              resolve(json);
            } else {
              reject(new Error("upload_failed"));
            }
          } catch {
            reject(new Error("upload_failed"));
          }
        };

        xhr.onerror = () => reject(new Error("upload_failed"));
        xhr.onabort = () => reject(new Error("upload_cancelled"));

        xhr.send(fd);
      }
    );

    const saveForm = new FormData();
    saveForm.append("lessonId", lessonId);
    saveForm.append("cloudinaryPublicId", uploadData.public_id);
    saveForm.append("cloudinaryResourceType", "video");

    if (uploadData.duration) {
      saveForm.append(
        "durationSeconds",
        String(Math.round(uploadData.duration))
      );
    }

    const result = await saveCloudinaryMediaAction(saveForm);
    if (result.error) throw new Error(result.error);

    setUploadFile(null);
    setUploadSuccess(true);
    setUploadProgress((prev) => ({
      ...prev,
      progress: 100,
      uploadedBytes: prev.totalBytes,
      etaSeconds: 0,
    }));

    toast.success(t("successSave"));
    router.refresh();
  } catch (err) {
    console.error("[LessonMediaManager] upload failed", err);

    if (err instanceof Error && err.message === "upload_cancelled") {
      setUploadError("Upload canceled.");
    } else {
      setUploadError(t("errorUpload"));
    }
  } finally {
    setIsUploading(false);
    xhrRef.current = null;
  }
}
```

---

## How progress calculation works

Inside `xhr.upload.onprogress`, the browser gives two important values:

- `event.loaded`
- `event.total`

Using those values, the implementation calculates:

### Progress percentage

```ts
const progress = Math.round((uploadedBytes / totalBytes) * 100);
```

### Upload speed

```ts
const elapsedSeconds = (Date.now() - startedAt) / 1000;
const speedBps = elapsedSeconds > 0 ? uploadedBytes / elapsedSeconds : 0;
```

### Estimated remaining time

```ts
const remainingBytes = totalBytes - uploadedBytes;
const etaSeconds = speedBps > 0 ? remainingBytes / speedBps : null;
```

This keeps the UI honest for large uploads and avoids the “frozen spinner” feeling.

---

## Cancel support added

The new upload flow also added real cancellation support while the upload is still in progress.

### Code added

```ts
function handleCancelUpload() {
  xhrRef.current?.abort();
}
```

When this runs, the browser cancels the active Cloudinary upload request. The upload promise rejects with `upload_cancelled`, and the component shows a cancel message instead of pretending the upload failed unexpectedly.

This is especially useful for teachers who selected the wrong file or want to stop a very large upload before it completes.

---

## UI changed from overlay spinner to real progress panel

The old implementation used a full overlay spinner during upload. That hid the form and only showed that “something” was happening.

The improved version replaces that with a visible progress block inside the Cloudinary section.

### Code added in the Cloudinary block

```tsx
{isUploading && (
  <div className="rounded-md border border-border bg-background p-3 space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-text-primary">
        {uploadProgress.progress}%
      </span>
      <span className="text-text-secondary">
        {formatBytes(uploadProgress.uploadedBytes)} /{" "}
        {formatBytes(uploadProgress.totalBytes)}
      </span>
    </div>

    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-accent transition-all duration-300"
        style={{ width: `${uploadProgress.progress}%` }}
      />
    </div>

    <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
      <span>Speed: {formatBytes(uploadProgress.speedBps)}/s</span>
      <span>ETA: {formatEta(uploadProgress.etaSeconds)}</span>
    </div>
  </div>
)}
```

This gives the teacher four pieces of useful information:

- current percent complete
- uploaded size vs total size
- current upload speed
- estimated time remaining

---

## Cancel button added beside the upload button

### Code added

```tsx
<div className="flex flex-wrap gap-2">
  <Button
    onClick={handleCloudinaryUploadAndSave}
    disabled={!uploadFile || busy}
  >
    {isUploading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {t("uploading")}
      </>
    ) : (
      t("uploadButton")
    )}
  </Button>

  {isUploading && (
    <Button
      type="button"
      variant="outline"
      onClick={handleCancelUpload}
    >
      Cancel
    </Button>
  )}
</div>
```

This preserves the normal upload button but adds a second action only while upload is active.

---

## Why this was kept inside LessonMediaManager instead of moving to another layer

This was an important architecture choice.

The progress feature was intentionally **not** moved into:

- `lib/mutations/media.ts`
- `actions/media.ts`
- `app/api/teacher/...`
- server-only query code

The reason is simple:

upload progress belongs to the browser transport layer, not to the business-logic layer.

The server can validate the teacher, sign the upload, save metadata, and enforce ownership. But only the browser can know how many bytes have already been sent during the active direct upload request.

That is why the final implementation keeps:

- business logic in the existing shared mutation/action layers
- progress tracking in the client-side `LessonMediaManager`

This matches the cross-platform architecture already established earlier in the project.

---

## Important TypeScript / ESLint fix made during this update

During this improvement, one lint issue appeared in the Promise wrapping the upload request:

```ts
const uploadData = await new Promise<any>((resolve, reject) => {
```

This triggered:

`Unexpected any. Specify a different type.`

It was fixed by introducing a dedicated typed response shape for Cloudinary:

```ts
type CloudinaryUploadResponse = {
  public_id: string;
  duration?: number;
};
```

Then the Promise was changed to:

```ts
const uploadData = await new Promise<CloudinaryUploadResponse>(
  (resolve, reject) => {
    // upload logic
  }
);
```

This kept the code aligned with ESLint rules and made the upload result safer to use.

---

## What stayed unchanged after this update

This improvement did **not** change:

- the `LessonMedia` data model
- the media provider strategy
- the save/delete actions
- the lesson ownership checks
- the preview URL logic
- the external-link flow
- the signed Cloudinary preview fix using `format: "mp4"`
- the mobile/API parity architecture

It only improved the teacher experience during large direct uploads.

---

## What to verify after this update

Run the app:

```bash
npm run dev
```

Then verify on a teacher lesson page:

- choose Cloudinary as the source
- select a large video file such as 100 MB to 200 MB
- click upload
- confirm the UI shows:
  - percentage
  - uploaded bytes / total bytes
  - speed
  - ETA
- confirm cancel works before upload completes
- confirm successful upload still saves the media metadata correctly
- confirm the page refreshes after success
- confirm the teacher still gets the preview link after save

Also verify the usual checks still pass:

```bash
npx tsc --noEmit
npm run build
```

---

## Final result of this update

Feature 09 now has a more production-ready teacher upload experience.

The teacher no longer sees only a generic spinner while a large video uploads. The UI now gives truthful feedback for long uploads while preserving the same signed direct Cloudinary upload architecture, the same shared mutation/save flow, and the same lesson-level media management structure already established in Feature 09.




------



TITLE Moallem Academy Web Implementation Log - Feature 10 Manual Payment and Access Confirmation Web Flows - Goal...

Build the real Feature 10 manual payment and access-confirmation flow for Moallem Academy so the web app can support:
- admin-managed global payment instructions
- teacher-managed personal payment details
- admin-controlled visibility of teacher payment details to students
- student submission of manual payment requests
- admin approval/rejection of payment requests
- truthful access-state updates after admin review

This feature is about real manual payment workflow scaffolding and truthful access confirmation, not payment gateway integration and not fake UI-only status toggles.

---

TITLE Moallem Academy Web Implementation Log - Feature 10 Manual Payment and Access Confirmation Web Flows - Decisions used for this feature...

- Global payment instructions are a singleton admin-managed configuration.
- Teacher-specific payment details are stored separately from the global payment config.
- Teachers can edit their own payment details, but cannot control whether those details are visible to students.
- Admin controls teacher-detail visibility through a backend field on the teacher payment record.
- Student requests support two truthful cases:
  - one-course payment request
  - all-platform subscription payment request
- Approval and rejection must update real backend access state, not only the request status label.
- Business logic lives in shared server-side layers:
  - `lib/queries/payment.ts`
  - `lib/mutations/payment.ts`
- Web-triggered mutations use thin wrappers in:
  - `actions/payment.ts`
- Mobile or external consumers can later use matching HTTP endpoints under:
  - `app/api/payment/*`
- Visible strings stay localized in `messages/ar.json` and `messages/en.json`.
- Since full product-grade role assignment is deferred to Feature 11, local verification may still temporarily use direct Prisma Studio edits to `Profile.role`.

---

TITLE Moallem Academy Web Implementation Log - Step 1 Extend the Prisma schema for manual payment flows - File to update...

- `prisma/schema.prisma`

TITLE Moallem Academy Web Implementation Log - Step 1 Extend the Prisma schema for manual payment flows - Why this matters...

Feature 06 already introduced `EnrollmentStatus`, but the actual manual payment and admin-confirmation workflow was intentionally deferred to Feature 10. This feature needed real payment-related models plus one minimal subscription-access field on the profile model.

TITLE Moallem Academy Web Implementation Log - Step 1 Extend the Prisma schema for manual payment flows - Code...

```prisma
enum PaymentRequestStatus {
  pending
  approved
  rejected
}

enum PaymentRequestType {
  course
  subscription
}

model PaymentConfig {
  id                       String   @id
  instructionsAr           String?  @map("instructions_ar")
  instructionsEn           String?  @map("instructions_en")
  shamCashQrImageUrl       String?  @map("sham_cash_qr_image_url")
  shamCashWhatsappNumber   String?  @map("sham_cash_whatsapp_number")
  shamCashInstructionsAr   String?  @map("sham_cash_instructions_ar")
  shamCashInstructionsEn   String?  @map("sham_cash_instructions_en")
  createdAt                DateTime @default(now()) @map("created_at")
  updatedAt                DateTime @updatedAt @map("updated_at")

  @@map("payment_configs")
}

model TeacherPaymentDetail {
  id                  String   @id @default(cuid())
  teacherClerkId      String   @unique @map("teacher_clerk_id")
  detailsAr           String?  @map("details_ar")
  detailsEn           String?  @map("details_en")
  whatsappNumber      String?  @map("whatsapp_number")
  qrImageUrl          String?  @map("qr_image_url")
  isVisibleToStudents Boolean  @default(false) @map("is_visible_to_students")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  @@map("teacher_payment_details")
}

model PaymentRequest {
  id               String               @id @default(cuid())
  profileId        String               @map("profile_id")
  courseId         String?              @map("course_id")
  requestType      PaymentRequestType   @default(course) @map("request_type")
  status           PaymentRequestStatus @default(pending)
  phoneNumber      String?              @map("phone_number")
  paymentReference String?              @map("payment_reference")
  adminNote        String?              @map("admin_note")
  reviewedAt       DateTime?            @map("reviewed_at")
  createdAt        DateTime             @default(now()) @map("created_at")
  updatedAt        DateTime             @updatedAt @map("updated_at")

  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  course  Course? @relation(fields: [courseId], references: [id], onDelete: SetNull)

  @@index([profileId])
  @@index([courseId])
  @@index([status])
  @@map("payment_requests")
}
```

Also extend `Profile` with:

```prisma
hasActiveSubscription Boolean @default(false) @map("has_active_subscription")
paymentRequests       PaymentRequest[]
```

---

TITLE Moallem Academy Web Implementation Log - Step 2 Add the migration, generate Prisma client, and seed singleton payment config - Commands used...

```bash
npx prisma migrate dev --name add_manual_payment_flows
npx prisma generate
npx prisma db seed
```

TITLE Moallem Academy Web Implementation Log - Step 2 Add the migration, generate Prisma client, and seed singleton payment config - Why this matters...

The payment flow depends on the schema being real in the database, and the app also benefits from having the singleton payment-config row available from the start instead of assuming it already exists.

TITLE Moallem Academy Web Implementation Log - Step 2 Add the migration, generate Prisma client, and seed singleton payment config - Seed pattern used...

In `prisma/seed.ts`, ensure a singleton row exists:

```ts
await prisma.paymentConfig.upsert({
  where: { id: "global-payment-config" },
  update: {},
  create: {
    id: "global-payment-config",
  },
});
```

---

TITLE Moallem Academy Web Implementation Log - Step 3 Create the shared payment read layer - File to create...

- `lib/queries/payment.ts`

TITLE Moallem Academy Web Implementation Log - Step 3 Create the shared payment read layer - Why this matters...

All read-only payment data should be reusable from Server Components now and from Route Handlers later, without duplicating Prisma queries across web and mobile/external consumers.

TITLE Moallem Academy Web Implementation Log - Step 3 Create the shared payment read layer - Code...

```ts
import "server-only";
import { prisma } from "@/lib/prisma";

export async function getGlobalPaymentConfig() {
  return prisma.paymentConfig.findUnique({
    where: { id: "global-payment-config" },
  });
}

export async function getVisibleTeacherPaymentDetail(teacherClerkId: string) {
  return prisma.teacherPaymentDetail.findFirst({
    where: {
      teacherClerkId,
      isVisibleToStudents: true,
    },
  });
}

export async function getMyTeacherPaymentDetail(teacherClerkId: string) {
  return prisma.teacherPaymentDetail.findUnique({
    where: { teacherClerkId },
  });
}

export async function getAllTeacherPaymentDetails() {
  return prisma.teacherPaymentDetail.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAllPaymentRequests() {
  return prisma.paymentRequest.findMany({
    include: {
      profile: true,
      course: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyPaymentRequests(profileId: string) {
  return prisma.paymentRequest.findMany({
    where: { profileId },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 4 Create the shared payment mutation layer - File to create...

- `lib/mutations/payment.ts`

TITLE Moallem Academy Web Implementation Log - Step 4 Create the shared payment mutation layer - Why this matters...

This feature contains the real business logic:
- create/update global config
- upsert teacher payment details
- create payment requests
- approve/reject requests
- update enrollment/subscription access state

That logic should exist once in framework-agnostic server code, not inside pages or client components.

TITLE Moallem Academy Web Implementation Log - Step 4 Create the shared payment mutation layer - Core code structure used...

```ts
import { prisma } from "@/lib/prisma";

const PAYMENT_CONFIG_ID = "global-payment-config";

export async function updatePaymentConfig(data: {
  instructionsAr?: string;
  instructionsEn?: string;
  shamCashQrImageUrl?: string;
  shamCashWhatsappNumber?: string;
  shamCashInstructionsAr?: string;
  shamCashInstructionsEn?: string;
}) {
  return prisma.paymentConfig.upsert({
    where: { id: PAYMENT_CONFIG_ID },
    update: data,
    create: {
      id: PAYMENT_CONFIG_ID,
      ...data,
    },
  });
}

export async function upsertMyTeacherPaymentDetail(data: {
  teacherClerkId: string;
  detailsAr?: string;
  detailsEn?: string;
  whatsappNumber?: string;
  qrImageUrl?: string;
}) {
  return prisma.teacherPaymentDetail.upsert({
    where: { teacherClerkId: data.teacherClerkId },
    update: {
      detailsAr: data.detailsAr,
      detailsEn: data.detailsEn,
      whatsappNumber: data.whatsappNumber,
      qrImageUrl: data.qrImageUrl,
    },
    create: {
      teacherClerkId: data.teacherClerkId,
      detailsAr: data.detailsAr,
      detailsEn: data.detailsEn,
      whatsappNumber: data.whatsappNumber,
      qrImageUrl: data.qrImageUrl,
    },
  });
}

export async function setTeacherPaymentVisibility(data: {
  teacherClerkId: string;
  visible: boolean;
}) {
  return prisma.teacherPaymentDetail.update({
    where: { teacherClerkId: data.teacherClerkId },
    data: { isVisibleToStudents: data.visible },
  });
}

export async function createPaymentRequest(data: {
  profileId: string;
  courseId?: string | null;
  requestType: "course" | "subscription";
  phoneNumber?: string;
  paymentReference?: string;
}) {
  return prisma.paymentRequest.create({
    data: {
      profileId: data.profileId,
      courseId: data.courseId ?? null,
      requestType: data.requestType,
      phoneNumber: data.phoneNumber,
      paymentReference: data.paymentReference,
      status: "pending",
    },
  });
}
```

TITLE Moallem Academy Web Implementation Log - Step 4 Create the shared payment mutation layer - Approval and rejection logic used...

Approval/rejection was implemented as truthful backend state transitions, not just request-label changes.

```ts
export async function approvePaymentRequest(paymentRequestId: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.paymentRequest.findUnique({
      where: { id: paymentRequestId },
    });

    if (!request) {
      throw new Error("Payment request not found");
    }

    if (request.requestType === "subscription") {
      await tx.profile.update({
        where: { id: request.profileId },
        data: { hasActiveSubscription: true },
      });
    }

    if (request.requestType === "course" && request.courseId) {
      const existingEnrollment = await tx.enrollment.findFirst({
        where: {
          profileId: request.profileId,
          courseId: request.courseId,
        },
      });

      if (existingEnrollment) {
        await tx.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { status: "confirmed" },
        });
      } else {
        await tx.enrollment.create({
          data: {
            profileId: request.profileId,
            courseId: request.courseId,
            status: "confirmed",
          },
        });
      }
    }

    return tx.paymentRequest.update({
      where: { id: paymentRequestId },
      data: {
        status: "approved",
        reviewedAt: new Date(),
      },
    });
  });
}

export async function rejectPaymentRequest(paymentRequestId: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.paymentRequest.findUnique({
      where: { id: paymentRequestId },
    });

    if (!request) {
      throw new Error("Payment request not found");
    }

    if (request.requestType === "course" && request.courseId) {
      const existingEnrollment = await tx.enrollment.findFirst({
        where: {
          profileId: request.profileId,
          courseId: request.courseId,
        },
      });

      if (existingEnrollment) {
        await tx.enrollment.update({
          where: { id: existingEnrollment.id },
          data: { status: "rejected" },
        });
      } else {
        await tx.enrollment.create({
          data: {
            profileId: request.profileId,
            courseId: request.courseId,
            status: "rejected",
          },
        });
      }
    }

    return tx.paymentRequest.update({
      where: { id: paymentRequestId },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
      },
    });
  });
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 5 Add thin Server Action wrappers for web-triggered payment mutations - File to create...

- `actions/payment.ts`

TITLE Moallem Academy Web Implementation Log - Step 5 Add thin Server Action wrappers for web-triggered payment mutations - Why this matters...

Client Components should not import Prisma or business logic directly. Web forms and buttons call small Server Actions that delegate to `lib/mutations/payment.ts` and then revalidate the relevant pages.

TITLE Moallem Academy Web Implementation Log - Step 5 Add thin Server Action wrappers for web-triggered payment mutations - Code pattern used...

```ts
"use server";

import { revalidatePath } from "next/cache";
import {
  updatePaymentConfig,
  upsertMyTeacherPaymentDetail,
  setTeacherPaymentVisibility,
  createPaymentRequest,
  approvePaymentRequest,
  rejectPaymentRequest,
} from "@/lib/mutations/payment";

export async function updatePaymentConfigAction(input: {
  instructionsAr?: string;
  instructionsEn?: string;
  shamCashQrImageUrl?: string;
  shamCashWhatsappNumber?: string;
  shamCashInstructionsAr?: string;
  shamCashInstructionsEn?: string;
}) {
  await updatePaymentConfig(input);
  revalidatePath("/admin/payment");
  revalidatePath("/payment");
}

export async function upsertMyTeacherPaymentDetailAction(input: {
  teacherClerkId: string;
  detailsAr?: string;
  detailsEn?: string;
  whatsappNumber?: string;
  qrImageUrl?: string;
}) {
  await upsertMyTeacherPaymentDetail(input);
  revalidatePath("/teacher/payment");
  revalidatePath("/admin/payment/teachers");
  revalidatePath("/payment");
}

export async function setTeacherPaymentVisibilityAction(input: {
  teacherClerkId: string;
  visible: boolean;
}) {
  await setTeacherPaymentVisibility(input);
  revalidatePath("/admin/payment/teachers");
  revalidatePath("/payment");
}

export async function createPaymentRequestAction(input: {
  profileId: string;
  courseId?: string | null;
  requestType: "course" | "subscription";
  phoneNumber?: string;
  paymentReference?: string;
}) {
  await createPaymentRequest(input);
  revalidatePath("/payment/request");
  revalidatePath("/admin/payment/requests");
}

export async function approvePaymentRequestAction(paymentRequestId: string) {
  await approvePaymentRequest(paymentRequestId);
  revalidatePath("/admin/payment/requests");
}

export async function rejectPaymentRequestAction(paymentRequestId: string) {
  await rejectPaymentRequest(paymentRequestId);
  revalidatePath("/admin/payment/requests");
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 6 Add mobile/future-consumer Route Handlers for payment flow parity - Files to create...

- `app/api/payment/config/route.ts`
- `app/api/payment/requests/route.ts`
- `app/api/payment/requests/[requestId]/approve/route.ts`
- `app/api/payment/requests/[requestId]/reject/route.ts`

TITLE Moallem Academy Web Implementation Log - Step 6 Add mobile/future-consumer Route Handlers for payment flow parity - Why this matters...

Server Actions are web-only. The project architecture requires mobile/external HTTP consumers to reach shared logic through Route Handlers that delegate into the same `lib/queries/*` and `lib/mutations/*` layers.

TITLE Moallem Academy Web Implementation Log - Step 6 Add mobile/future-consumer Route Handlers for payment flow parity - Example pattern used...

```ts
import { NextResponse } from "next/server";
import { getGlobalPaymentConfig } from "@/lib/queries/payment";

export async function GET() {
  const config = await getGlobalPaymentConfig();
  return NextResponse.json({ config });
}
```

And for approval:

```ts
import { NextResponse } from "next/server";
import { approvePaymentRequest } from "@/lib/mutations/payment";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const result = await approvePaymentRequest(requestId);
  return NextResponse.json({ request: result });
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 7 Build the admin global payment config page and form - Files to create...

- `app/[locale]/(admin)/admin/payment/page.tsx`
- `app/[locale]/(admin)/admin/payment/PaymentConfigForm.tsx`

TITLE Moallem Academy Web Implementation Log - Step 7 Build the admin global payment config page and form - Why this matters...

The product needs one admin-managed source for global payment instructions that students can always see, separate from teacher-specific payment methods.

TITLE Moallem Academy Web Implementation Log - Step 7 Build the admin global payment config page and form - Page code structure used...

```tsx
import { getTranslations } from "next-intl/server";
import { getGlobalPaymentConfig } from "@/lib/queries/payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { PaymentConfigForm } from "./PaymentConfigForm";

export default async function AdminPaymentPage() {
  const t = await getTranslations("Payment");
  const config = await getGlobalPaymentConfig();

  return (
    <div className="space-y-6 p-6">
      <PageHeader title={t("adminConfig")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("adminConfig")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentConfigForm config={config} />
        </CardContent>
      </Card>
    </div>
  );
}
```

TITLE Moallem Academy Web Implementation Log - Step 7 Build the admin global payment config page and form - Form code used...

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updatePaymentConfigAction } from "@/actions/payment";
import type { PaymentConfig } from "@/lib/generated/prisma";

interface Props {
  config: PaymentConfig | null;
}

export function PaymentConfigForm({ config }: Props) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [instructionsAr, setInstructionsAr] = useState(config?.instructionsAr ?? "");
  const [instructionsEn, setInstructionsEn] = useState(config?.instructionsEn ?? "");
  const [qrUrl, setQrUrl] = useState(config?.shamCashQrImageUrl ?? "");
  const [whatsapp, setWhatsapp] = useState(config?.shamCashWhatsappNumber ?? "");
  const [shamAr, setShamAr] = useState(config?.shamCashInstructionsAr ?? "");
  const [shamEn, setShamEn] = useState(config?.shamCashInstructionsEn ?? "");

  function handleSaveConfig() {
    startTransition(async () => {
      await updatePaymentConfigAction({
        instructionsAr,
        instructionsEn,
        shamCashQrImageUrl: qrUrl,
        shamCashWhatsappNumber: whatsapp,
        shamCashInstructionsAr: shamAr,
        shamCashInstructionsEn: shamEn,
      });
      setSaved(true);
    });
  }

  return (
    <div className="grid gap-4">
      <div>
        <Label>{t("instructionsAr")}</Label>
        <Textarea value={instructionsAr} onChange={(e) => setInstructionsAr(e.target.value)} dir="rtl" />
      </div>
      <div>
        <Label>{t("instructionsEn")}</Label>
        <Textarea value={instructionsEn} onChange={(e) => setInstructionsEn(e.target.value)} dir="ltr" />
      </div>
      <div>
        <Label>{t("qrImageUrl")}</Label>
        <Input value={qrUrl} onChange={(e) => setQrUrl(e.target.value)} placeholder="https://..." dir="ltr" />
      </div>
      <div>
        <Label>{t("whatsappNumber")}</Label>
        <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+963..." dir="ltr" />
      </div>
      <div>
        <Label>{t("shamCashInstructionsAr")}</Label>
        <Textarea value={shamAr} onChange={(e) => setShamAr(e.target.value)} dir="rtl" />
      </div>
      <div>
        <Label>{t("shamCashInstructionsEn")}</Label>
        <Textarea value={shamEn} onChange={(e) => setShamEn(e.target.value)} dir="ltr" />
      </div>

      <Button onClick={handleSaveConfig} disabled={isPending}>
        {t("adminSaveConfig")}
      </Button>

      {saved ? <p className="text-sm text-success">{t("requestSubmitted")}</p> : null}
    </div>
  );
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 8 Build the teacher self-service payment details page - Files to create...

- `app/[locale]/(teacher)/teacher/payment/page.tsx`
- `app/[locale]/(teacher)/teacher/payment/TeacherPaymentForm.tsx`

TITLE Moallem Academy Web Implementation Log - Step 8 Build the teacher self-service payment details page - Why this matters...

Teachers need a real page to manage their own payment content, but they must not be able to bypass admin review by controlling visibility themselves.

TITLE Moallem Academy Web Implementation Log - Step 8 Build the teacher self-service payment details page - Form code used...

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertMyTeacherPaymentDetailAction } from "@/actions/payment";
import type { TeacherPaymentDetail } from "@/lib/generated/prisma";

interface Props {
  detail: TeacherPaymentDetail | null;
  teacherClerkId: string;
}

export function TeacherPaymentForm({ detail, teacherClerkId }: Props) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const [detailsAr, setDetailsAr] = useState(detail?.detailsAr ?? "");
  const [detailsEn, setDetailsEn] = useState(detail?.detailsEn ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(detail?.whatsappNumber ?? "");
  const [qrImageUrl, setQrImageUrl] = useState(detail?.qrImageUrl ?? "");

  function handleSave() {
    startTransition(async () => {
      await upsertMyTeacherPaymentDetailAction({
        teacherClerkId,
        detailsAr,
        detailsEn,
        whatsappNumber,
        qrImageUrl,
      });
      setSaved(true);
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("myPaymentDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("teacherDetailsAr")}</Label>
            <Textarea value={detailsAr} onChange={(e) => setDetailsAr(e.target.value)} dir="rtl" />
          </div>

          <div>
            <Label>{t("teacherDetailsEn")}</Label>
            <Textarea value={detailsEn} onChange={(e) => setDetailsEn(e.target.value)} dir="ltr" />
          </div>

          <div>
            <Label>{t("whatsappNumber")}</Label>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+963..."
              dir="ltr"
            />
          </div>

          <div>
            <Label>{t("qrImageUrl")}</Label>
            <Input
              value={qrImageUrl}
              onChange={(e) => setQrImageUrl(e.target.value)}
              placeholder="https://..."
              dir="ltr"
            />
          </div>

          <Button onClick={handleSave} disabled={isPending}>
            {t("saveMyDetails")}
          </Button>

          {saved ? <p className="text-sm text-success">{t("requestSubmitted")}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
```

TITLE Moallem Academy Web Implementation Log - Step 8 Build the teacher self-service payment details page - Important rule used...

No visibility switch was included in the teacher form. Visibility belongs only to admin review through `TeacherPaymentDetail.isVisibleToStudents`.

---

TITLE Moallem Academy Web Implementation Log - Step 9 Build the admin teacher-payment visibility review page - Files to create...

- `app/[locale]/(admin)/admin/payment/teachers/page.tsx`
- `app/[locale]/(admin)/admin/payment/teachers/TeacherVisibilityRow.tsx`

TITLE Moallem Academy Web Implementation Log - Step 9 Build the admin teacher-payment visibility review page - Why this matters...

Admins need a real review surface for teacher-submitted payment details, but the product rule is that they review teacher content and control visibility rather than directly editing teacher text.

TITLE Moallem Academy Web Implementation Log - Step 9 Build the admin teacher-payment visibility review page - Code used...

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { setTeacherPaymentVisibilityAction } from "@/actions/payment";

interface TeacherWithDetail {
  clerkUserId: string;
  displayName: string | null;
  paymentDetail: {
    detailsAr: string | null;
    detailsEn: string | null;
    whatsappNumber: string | null;
    qrImageUrl: string | null;
    isVisibleToStudents: boolean;
  } | null;
}

export function TeacherVisibilityRow({ teacher }: { teacher: TeacherWithDetail }) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [visible, setVisible] = useState(
    teacher.paymentDetail?.isVisibleToStudents ?? false
  );

  const hasDetail = Boolean(teacher.paymentDetail);

  function handleToggle(next: boolean) {
    setVisible(next);
    startTransition(async () => {
      await setTeacherPaymentVisibilityAction({
        teacherClerkId: teacher.clerkUserId,
        visible: next,
      });
    });
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium">{teacher.displayName ?? teacher.clerkUserId}</p>
        </div>

        {hasDetail ? (
          <div className="text-sm text-text-secondary space-y-1">
            {teacher.paymentDetail?.detailsAr ? (
              <p dir="rtl">{teacher.paymentDetail.detailsAr}</p>
            ) : null}
            {teacher.paymentDetail?.whatsappNumber ? (
              <p>
                {t("whatsappNumber")}: {teacher.paymentDetail.whatsappNumber}
              </p>
            ) : null}
          </div>
        ) : null}

        {hasDetail ? (
          <div className="flex items-center gap-3">
            <Switch checked={visible} onCheckedChange={handleToggle} disabled={isPending} />
            <Label>{t("visibleToStudents")}</Label>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 10 Build the student payment instructions page - Files to create...

- `app/[locale]/(student)/payment/page.tsx`
- supporting student-facing payment display components if needed

TITLE Moallem Academy Web Implementation Log - Step 10 Build the student payment instructions page - Why this matters...

Students need one localized place to see:
- the admin-managed global payment guidance
- optionally a teacher-specific payment block, but only if admin made that teacher visible

TITLE Moallem Academy Web Implementation Log - Step 10 Build the student payment instructions page - Pattern used...

The page loads:
- `getGlobalPaymentConfig()`
- `getVisibleTeacherPaymentDetail(teacherClerkId)` when relevant

And renders:
- global instructions always
- teacher-specific instructions only when the returned visible record exists

---

TITLE Moallem Academy Web Implementation Log - Step 11 Build the student manual payment request form - Files to create...

- `app/[locale]/(student)/payment/request/page.tsx`
- `app/[locale]/(student)/payment/request/PaymentRequestForm.tsx`

TITLE Moallem Academy Web Implementation Log - Step 11 Build the student manual payment request form - Why this matters...

Feature 06 showed pending/confirmed/rejected enrollment states, but there was still no real mutation path for a student to submit a manual payment request. This feature adds that truthful submission flow.

TITLE Moallem Academy Web Implementation Log - Step 11 Build the student manual payment request form - Code pattern used...

```tsx
"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createPaymentRequestAction } from "@/actions/payment";

interface Props {
  profileId: string;
  defaultCourseId?: string | null;
}

export function PaymentRequestForm({ profileId, defaultCourseId }: Props) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();
  const [requestType, setRequestType] = useState<"course" | "subscription">("course");
  const [courseId, setCourseId] = useState(defaultCourseId ?? "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit() {
    startTransition(async () => {
      await createPaymentRequestAction({
        profileId,
        courseId: requestType === "course" ? courseId : null,
        requestType,
        phoneNumber,
        paymentReference,
      });
      setSaved(true);
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>{t("whatsappNumber")}</Label>
        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} dir="ltr" />
      </div>

      <div>
        <Label>{t("paymentReference")}</Label>
        <Textarea value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} />
      </div>

      <Button onClick={handleSubmit} disabled={isPending}>
        {t("submitPaymentRequest")}
      </Button>

      {saved ? <p className="text-sm text-success">{t("requestSubmitted")}</p> : null}
    </div>
  );
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 12 Build the admin payment request review list - Files to create...

- `app/[locale]/(admin)/admin/payment/requests/page.tsx`
- `app/[locale]/(admin)/admin/payment/requests/PaymentRequestRow.tsx`

TITLE Moallem Academy Web Implementation Log - Step 12 Build the admin payment request review list - Why this matters...

The manual payment flow is incomplete unless admins can see submitted requests and perform real approve/reject actions from the web app.

TITLE Moallem Academy Web Implementation Log - Step 12 Build the admin payment request review list - Code pattern used...

```tsx
"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  approvePaymentRequestAction,
  rejectPaymentRequestAction,
} from "@/actions/payment";

export function PaymentRequestRow({
  request,
}: {
  request: {
    id: string;
    status: string;
    phoneNumber: string | null;
    paymentReference: string | null;
  };
}) {
  const t = useTranslations("Payment");
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approvePaymentRequestAction(request.id);
    });
  }

  function handleReject() {
    startTransition(async () => {
      await rejectPaymentRequestAction(request.id);
    });
  }

  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <p>{request.phoneNumber}</p>
      <p>{request.paymentReference}</p>
      <p>{request.status}</p>

      <div className="flex gap-2">
        <Button onClick={handleApprove} disabled={isPending}>
          {t("approve")}
        </Button>
        <Button variant="outline" onClick={handleReject} disabled={isPending}>
          {t("reject")}
        </Button>
      </div>
    </div>
  );
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 13 Add the localization strings for payment flow - Files to update...

- `messages/ar.json`
- `messages/en.json`

TITLE Moallem Academy Web Implementation Log - Step 13 Add the localization strings for payment flow - Why this matters...

Feature 10 introduced multiple new admin, teacher, and student surfaces. All visible strings must remain localized and Arabic-first, with English parity preserved.

TITLE Moallem Academy Web Implementation Log - Step 13 Add the localization strings for payment flow - Example keys used...

```json
"Payment": {
  "adminConfig": "إعدادات الدفع",
  "adminSaveConfig": "حفظ الإعدادات",
  "instructionsAr": "التعليمات بالعربية",
  "instructionsEn": "التعليمات بالإنجليزية",
  "shamCashInstructionsAr": "تعليمات شام كاش بالعربية",
  "shamCashInstructionsEn": "Sham Cash instructions in English",
  "qrImageUrl": "رابط صورة QR",
  "whatsappNumber": "رقم واتساب",
  "teacherDetailsAr": "تفاصيل دفع المعلم بالعربية",
  "teacherDetailsEn": "Teacher payment details in English",
  "teacherPaymentList": "طلبات دفع المعلمين",
  "visibleToStudents": "ظاهر للطلاب",
  "myPaymentDetails": "معلومات الدفع الخاصة بي",
  "saveMyDetails": "حفظ معلوماتي",
  "paymentReference": "مرجع الدفع",
  "submitPaymentRequest": "إرسال طلب الدفع",
  "requestSubmitted": "تم إرسال الطلب بنجاح",
  "approve": "قبول",
  "reject": "رفض"
}
```

And in English:

```json
"Payment": {
  "teacherPaymentList": "Teacher Payment Requests",
  "visibleToStudents": "Visible to students",
  "myPaymentDetails": "My payment details",
  "saveMyDetails": "Save my details"
}
```

---

TITLE Moallem Academy Web Implementation Log - Step 14 Handle the Prisma schema/database drift issue discovered during implementation - Problem encountered...

After the payment schema refactor, opening:

- `/ar/admin/payment`

triggered a Prisma runtime error similar to:

```txt
Invalid `prisma.paymentConfig.findUnique()` invocation:
The column `(not available)` does not exist in the current database.
```

TITLE Moallem Academy Web Implementation Log - Step 14 Handle the Prisma schema/database drift issue discovered during implementation - Why this happened...

A payment-related schema change was reflected in code and generated Prisma Client, but the local database state was not fully synced to the final schema shape yet.

TITLE Moallem Academy Web Implementation Log - Step 14 Handle the Prisma schema/database drift issue discovered during implementation - Recovery commands used...

```bash
npx prisma migrate status
npx prisma migrate dev --name sync_payment_schema
npx prisma generate
npx prisma db seed
```

If local development drift still remained, the dev-only reset path was accepted:

```bash
npx prisma migrate reset
npx prisma generate
npx prisma db seed
```

TITLE Moallem Academy Web Implementation Log - Step 14 Handle the Prisma schema/database drift issue discovered during implementation - Why this matters...

Feature 10 changed both schema and runtime reads. Keeping Prisma schema, generated client, and the actual database in sync was necessary before the new payment pages could render reliably.

---

TITLE Moallem Academy Web Implementation Log - Step 15 Local verification used for this feature - Commands...

```bash
npx prisma migrate status
npx prisma generate
npx prisma db seed
npx prisma studio
npx tsc --noEmit
npm run build
npm run dev
```

TITLE Moallem Academy Web Implementation Log - Step 15 Local verification used for this feature - What to verify...

- `payment_configs` exists and contains the singleton global config row
- `teacher_payment_details` exists and supports:
  - `teacherClerkId`
  - `detailsAr`
  - `detailsEn`
  - `whatsappNumber`
  - `qrImageUrl`
  - `isVisibleToStudents`
- `payment_requests` exists and supports:
  - `profileId`
  - `courseId`
  - `requestType`
  - `status`
  - `phoneNumber`
  - `paymentReference`
  - `reviewedAt`
- `/ar/admin/payment` renders and saves global config successfully
- `/ar/teacher/payment` renders and saves teacher-specific payment details successfully
- `/ar/admin/payment/teachers` renders teacher rows and toggles visibility successfully
- `/ar/payment` shows global payment instructions
- teacher-specific payment details are only shown to students when `isVisibleToStudents = true`
- `/ar/payment/request` can create pending payment requests
- `/ar/admin/payment/requests` can approve and reject requests
- approving a course request confirms or creates the matching enrollment
- rejecting a course request preserves a rejected enrollment state
- approving a subscription request updates `Profile.hasActiveSubscription = true`
- payment pages remain localized and RTL-safe
- the feature compiles cleanly with no leftover references to removed payment fields

---

TITLE Moallem Academy Web Implementation Log - Step 16 Commit the manual payment and access confirmation flow - Command...

```bash
git add .
git commit -m "feat10 add manual payment and access confirmation web flows"
git push origin main
```

TITLE Moallem Academy Web Implementation Log - Step 16 Commit the manual payment and access confirmation flow - Why this matters...

This saves the first real monetization-adjacent workflow on the web app without overreaching into full gateway billing or overcomplicated role tooling too early.

---

TITLE Moallem Academy Web Implementation Log - Feature 10 completion checklist...

- [x] Prisma schema extended for manual payment and access-confirmation flows
- [x] Singleton global payment config model added
- [x] Teacher payment detail model added
- [x] Payment request model and enums added
- [x] `Profile.hasActiveSubscription` added as minimal subscription-access field
- [x] Shared payment reads added under `lib/queries/payment.ts`
- [x] Shared payment mutations added under `lib/mutations/payment.ts`
- [x] Thin web-only Server Actions added under `actions/payment.ts`
- [x] Matching payment Route Handler direction added under `app/api/payment/*`
- [x] Admin global payment config page added
- [x] Teacher self-service payment page added
- [x] Admin teacher-payment visibility review page added
- [x] Student payment instructions page added
- [x] Student manual payment-request form added
- [x] Admin request review list added
- [x] Approval/rejection updates real access state instead of only request labels
- [x] Arabic-first localization updated with English parity
- [x] Prisma drift issue resolved during local implementation
- [x] Feature verified locally enough to continue, with full product-grade role tooling intentionally deferred

---

TITLE Moallem Academy Web Implementation Log - Notes for future features...

- Feature 11 should formalize admin/staff role management so local Prisma Studio role edits are no longer needed for verification.
- If subscriptions become more complex later, `Profile.hasActiveSubscription` may need to evolve into a dedicated subscription or entitlement model.
- If teacher monetization becomes course-specific later, `TeacherPaymentDetail` may need optional per-course overrides.
- Feature 12 should keep student-facing lesson playback and media protection rules aligned with the access truth established by approved enrollments and subscription flags.
- Any mobile payment-management path should reuse the same `lib/queries/payment.ts` and `lib/mutations/payment.ts` layers instead of duplicating business logic in separate web/mobile implementations.


---

TITLE Moallem Academy Web Implementation Log - Feature 11 Admin and Staff Management Foundations - Goal...

Establish the missing bridge between Clerk authentication and real app-level authorization for Moallem Academy using:

- Clerk → database profile sync through webhooks
- DB-backed app roles (`student`, `teacher`, `admin`) as the source of truth
- teacher approval state controlled by admin
- reusable backend authorization helpers shared across pages, Server Actions, and Route Handlers
- protected teacher/admin flows that no longer depend on “logged in only”
- the first shared playback/access-control foundation for future protected media delivery
- Arabic-first, localized, RTL-safe admin/staff UI built on the shared shadcn-based design system

This feature is about making auth truthful at the product level. Clerk stays responsible for identity and sessions, while Prisma-backed `profiles` becomes the source of truth for role, approval, and access decisions.

---

TITLE Moallem Academy Web Implementation Log - Decisions used for this feature...

- Clerk remains the authentication provider. It does not become the source of truth for app roles.
- The `profiles` table is the app-level source of truth for:
  - role
  - approval readiness
  - future shared access decisions
- Clerk user records must sync automatically into the database through webhooks rather than manual profile creation.
- Teacher access is not enabled by role alone. Teacher capabilities require explicit admin approval.
- Admin access must be enforced in backend logic, not by hiding links or buttons only.
- New backend authorization work follows the existing shared architecture:
  - `lib/queries/*` for reads
  - `lib/mutations/*` for writes
  - `actions/*` for thin web-only Server Action wrappers
  - `app/api/*` for thin Route Handlers for mobile/external consumers
- Expected authorization failures in pages should be treated as permission denials, not generic unexpected crashes.
- Shared lesson/media access decisions must be centralized now so Feature 12 can build protected playback on top of them cleanly.
- All visible strings introduced in admin/teacher approval UI must go through localization files, not hardcoded component text.

---

TITLE Moallem Academy Web Implementation Log - Step 1 Inspect the current auth and role reality - What was reviewed...

Before changing code, the current project reality was inspected to confirm what already existed and what was still missing:

- Clerk sign-in/sign-up was already wired and working
- Prisma `Profile` already contained a `role` field and `clerkUserId`
- teacher/admin product flows existed from earlier features, but many were still only protected by “signed in” assumptions or partial ownership checks
- no complete Clerk → DB profile sync flow existed yet
- no finished teacher approval state existed yet
- no shared, centralized backend authorization layer existed yet for all page/action/API entry points
- Feature 10 had exposed a temporary limitation: role testing still depended on manual Prisma Studio edits

This inspection confirmed that Feature 11 was not about rebuilding auth from scratch. It was about connecting real auth identity to real app authorization truth.

---

TITLE Moallem Academy Web Implementation Log - Step 2 Extend the profile model for approval readiness - Files updated...

- `prisma/schema.prisma`

TITLE Moallem Academy Web Implementation Log - Step 2 Extend the profile model for approval readiness - What was added...

The `Profile` model was extended so it could represent not just role labels, but also whether a teacher is actually approved to use teacher capabilities.

Added / finalized fields and enums along these lines:

- `AppRole`
  - `student`
  - `teacher`
  - `admin`
- `TeacherApprovalStatus`
  - `not_applicable`
  - `pending`
  - `approved`
  - `rejected`

The profile model was also aligned to hold synced identity-facing fields used by admin/staff tooling such as:

- `email`
- `displayName`
- `avatarUrl`

TITLE Moallem Academy Web Implementation Log - Step 2 Extend the profile model for approval readiness - Why this matters...

A role like `teacher` is not enough on its own for product authorization. The app needs to distinguish:

- a normal student
- a teacher waiting for approval
- an active teacher
- an admin

Without this, any future teacher/admin/payment/media rules stay ambiguous and hard to enforce consistently.

---

TITLE Moallem Academy Web Implementation Log - Step 3 Apply the schema change and regenerate Prisma client - Commands...

```bash
npx prisma migrate dev --name add_teacher_approval_and_profile_sync_fields
npx prisma generate
```

TITLE Moallem Academy Web Implementation Log - Step 3 Apply the schema change and regenerate Prisma client - Why this matters...

This persisted the new approval-capable profile shape to Neon and regenerated the typed Prisma client so the rest of the backend could start using the new fields safely.

---

TITLE Moallem Academy Web Implementation Log - Step 4 Add Clerk webhook-based profile sync - Files created or updated...

- `app/api/webhooks/clerk/route.ts`
- `.env.local`
- `middleware.ts` or `proxy.ts` (to ensure webhook route stays public)
- package dependencies (`svix` if needed by the local setup)

TITLE Moallem Academy Web Implementation Log - Step 4 Add Clerk webhook-based profile sync - What was implemented...

A public Clerk webhook endpoint was added so Clerk can notify the app when users are:

- created
- updated
- deleted

The handler verifies the incoming webhook request, then forwards the event into shared profile mutation logic.

Typical events handled:

- `user.created`
- `user.updated`
- `user.deleted`

The route stays public because Clerk must be able to call it from outside the app.

TITLE Moallem Academy Web Implementation Log - Step 4 Add Clerk webhook-based profile sync - Why this matters...

This removes the long-term dependence on manually creating `profiles` rows in Prisma Studio. After this step, Clerk identity and DB profile state start moving together automatically, which is the foundation for all truthful role-aware product flows.

---

TITLE Moallem Academy Web Implementation Log - Step 5 Create shared profile mutations for webhook sync and admin role changes - Files created...

- `lib/mutations/profile.ts`

TITLE Moallem Academy Web Implementation Log - Step 5 Create shared profile mutations for webhook sync and admin role changes - What was added...

Shared mutation functions were introduced for:

- upserting a profile from Clerk webhook data
- deleting a profile when the Clerk user is deleted
- changing a profile role
- approving a teacher
- rejecting a teacher

These functions intentionally keep role and approval truth app-managed rather than allowing Clerk profile metadata to silently become the main authority.

TITLE Moallem Academy Web Implementation Log - Step 5 Create shared profile mutations for webhook sync and admin role changes - Why this matters...

This keeps webhook behavior and admin-driven role/approval changes inside the agreed shared backend layer instead of putting DB writes directly inside route handlers or page components.

---

TITLE Moallem Academy Web Implementation Log - Step 6 Create shared profile queries for admin/staff reads - Files created...

- `lib/queries/profile.ts`

TITLE Moallem Academy Web Implementation Log - Step 6 Create shared profile queries for admin/staff reads - What was added...

Shared query helpers were added for:

- getting a profile by Clerk user ID
- listing profiles by role
- listing pending teachers
- listing teachers for admin review flows

TITLE Moallem Academy Web Implementation Log - Step 6 Create shared profile queries for admin/staff reads - Why this matters...

Admin/staff review pages and future mobile admin consumers need reusable read functions, not direct Prisma calls scattered across components or API routes.

---

TITLE Moallem Academy Web Implementation Log - Step 7 Create the shared authorization layer - Files created...

- `lib/access/roles.ts`
- `lib/access/guards.ts`
- `lib/access/playback.ts`

TITLE Moallem Academy Web Implementation Log - Step 7 Create the shared authorization layer - What was implemented...

Three access-focused modules were introduced:

1. `lib/access/roles.ts`
   - small pure helpers such as:
     - `isAdmin(...)`
     - `isApprovedTeacher(...)`
     - `isPendingTeacher(...)`
     - `isStudent(...)`

2. `lib/access/guards.ts`
   - server-side helpers that resolve the current Clerk session into the synced DB profile and enforce:
     - authenticated profile required
     - admin required
     - approved teacher required
     - student required

3. `lib/access/playback.ts`
   - shared lesson access logic that answers:
     - may this profile access this lesson right now?

TITLE Moallem Academy Web Implementation Log - Step 7 Create the shared authorization layer - Why this matters...

This is the core of Feature 11. Instead of repeating ad-hoc role checks everywhere, the app now has one shared authorization language usable from pages, Server Actions, and Route Handlers.

---

TITLE Moallem Academy Web Implementation Log - Step 8 Implement the shared lesson access / playback foundation - Files created or updated...

- `lib/access/playback.ts`
- `app/api/lessons/[lessonId]/access/route.ts`
- `app/api/lessons/[lessonId]/playback-access/route.ts`
- `app/api/lessons/[lessonId]/media/route.ts` (or equivalent lesson media route)
- lesson watch/playback page(s)

TITLE Moallem Academy Web Implementation Log - Step 8 Implement the shared lesson access / playback foundation - Rules enforced...

The new shared lesson access logic was designed to check:

- signed-in identity
- synced DB profile
- admin override if applicable
- approved teacher ownership if the teacher owns the course
- preview lesson allowance
- confirmed student enrollment for paid/protected lessons

Only after the access check passes should protected lesson media details be returned.

TITLE Moallem Academy Web Implementation Log - Step 8 Implement the shared lesson access / playback foundation - Why this matters...

This creates the first truthful backend enforcement layer for future protected playback. The player itself is not the source of truth; the backend authorization decision is.

---

TITLE Moallem Academy Web Implementation Log - Step 9 Keep media URL generation separate from authorization - Files reviewed or updated...

- `lib/queries/media.ts`

TITLE Moallem Academy Web Implementation Log - Step 9 Keep media URL generation separate from authorization - What was confirmed...

`lib/queries/media.ts` was kept as a media lookup / URL-generation utility rather than turning it into the place where role checks happen.

The rule used was:

1. authorize the actor first through shared lesson access checks
2. only then generate or return the media response

For Cloudinary-owned media, signed authenticated delivery URLs continue to be generated through the backend after authorization. For external links, the current preview/playback response returns the stored URL as the current fallback path.

TITLE Moallem Academy Web Implementation Log - Step 9 Keep media URL generation separate from authorization - Why this matters...

This keeps authorization logic centralized and avoids mixing media-provider-specific concerns with business access rules.

---

TITLE Moallem Academy Web Implementation Log - Step 10 Add admin-facing teacher approval actions - Files created...

- `actions/profile.ts`

TITLE Moallem Academy Web Implementation Log - Step 10 Add admin-facing teacher approval actions - What was added...

Thin Server Actions were added for admin-driven profile changes such as:

- approve teacher
- reject teacher
- set role

These actions call shared mutation logic and use backend admin guards before doing anything.

TITLE Moallem Academy Web Implementation Log - Step 10 Add admin-facing teacher approval actions - Why this matters...

Admin UI must not write to the database directly from components. It should go through thin actions that enforce admin authorization and then delegate the real write work to `lib/mutations/*`.

---

TITLE Moallem Academy Web Implementation Log - Step 11 Add admin-facing teacher review UI - Files created or updated...

- `app/[locale]/(admin)/admin/teachers/page.tsx`
- admin teacher row/list components under shared project structure
- `messages/ar.json`
- `messages/en.json`

TITLE Moallem Academy Web Implementation Log - Step 11 Add admin-facing teacher review UI - What was implemented...

A teacher-management review surface was added for admin use using the shared shadcn-based UI system.

The UI was built with shared components such as:

- cards
- badges
- buttons
- lists / rows
- localized empty states and status labels

Visible text such as:

- page title
- empty state
- approval status labels
- approve / reject actions

was added to localization files instead of being hardcoded.

TITLE Moallem Academy Web Implementation Log - Step 11 Add admin-facing teacher review UI - Why this matters...

This turns teacher approval into a real product flow, not just a database-editing task in Prisma Studio.

---

TITLE Moallem Academy Web Implementation Log - Step 12 Harden teacher/admin pages with real role-aware access checks - Files reviewed and updated...

Teacher/admin pages were reviewed and guarded systematically, including routes such as:

- `app/[locale]/(teacher)/teacher/page.tsx`
- `app/[locale]/(teacher)/teacher/courses/new/page.tsx`
- lesson management pages under the teacher section
- `app/[locale]/(admin)/admin/teachers/page.tsx`
- other admin payment/staff review pages

TITLE Moallem Academy Web Implementation Log - Step 12 Harden teacher/admin pages with real role-aware access checks - What was discovered...

Testing exposed an important security gap:

- a plain signed-in student could still enter some teacher pages
- a student could even create a course in some earlier teacher flows
- only deeper lesson creation had already started enforcing approved-teacher access

This confirmed that “logged in” was still being treated as enough in some places, which Feature 11 needed to fix.

TITLE Moallem Academy Web Implementation Log - Step 12 Harden teacher/admin pages with real role-aware access checks - Why this matters...

This review proved why Feature 11 was necessary: role-aware product enforcement must be systematic, not partial.

---

TITLE Moallem Academy Web Implementation Log - Step 13 Apply the correct guard pattern to Server Actions - Files reviewed and updated...

- `actions/course.ts`
- `actions/lesson.ts`
- `actions/media.ts`
- `actions/payment.ts`
- `actions/profile.ts`

TITLE Moallem Academy Web Implementation Log - Step 13 Apply the correct guard pattern to Server Actions - Rules used...

Server Actions were reviewed and protected based on the actual actor:

- teacher mutations → approved teacher required
- admin review/config mutations → admin required
- student-owned request creation → student required
- profile/approval actions → admin required

The guiding rule used:

- pages are not enough
- every mutation entry point must enforce backend authorization directly

TITLE Moallem Academy Web Implementation Log - Step 13 Apply the correct guard pattern to Server Actions - Why this matters...

A user may bypass a page and still trigger an action indirectly. Server Actions must not assume the UI already protected them.

---

TITLE Moallem Academy Web Implementation Log - Step 14 Apply the correct guard pattern to Route Handlers - Files reviewed and updated...

All relevant Route Handlers under `app/api/` were classified by who should be allowed to call them.

Examples reviewed:

- public browse routes
- Clerk webhook route
- `app/api/profile/me/route.ts`
- `app/api/payment/config/route.ts`
- `app/api/payment/requests/route.ts`
- `app/api/payment/requests/[requestId]/review/route.ts`
- `app/api/cloudinary/upload-signature/route.ts`
- all `app/api/teacher/*` routes
- lesson access / lesson media routes

TITLE Moallem Academy Web Implementation Log - Step 14 Apply the correct guard pattern to Route Handlers - Guard mapping used...

- public webhook / browse routes
  - no auth guard
- authenticated-any-role routes
  - authenticated profile required
- student routes
  - student required
- teacher routes
  - approved teacher required
- admin routes
  - admin required

A key implementation rule used here:
client-supplied IDs like `teacherId` must not be trusted for protected operations if the server already knows the current actor from Clerk + DB profile.

TITLE Moallem Academy Web Implementation Log - Step 14 Apply the correct guard pattern to Route Handlers - Why this matters...

Mobile and future external consumers use these routes directly. If Route Handlers are not protected, UI protections on the web side mean very little.

---

TITLE Moallem Academy Web Implementation Log - Step 15 Review queries and mutations for ownership and caller safety - Files reviewed...

- `lib/mutations/course.ts`
- `lib/mutations/lesson.ts`
- `lib/mutations/media.ts`
- `lib/mutations/payment.ts`
- `lib/queries/media.ts`
- role-sensitive teacher/admin queries

TITLE Moallem Academy Web Implementation Log - Step 15 Review queries and mutations for ownership and caller safety - What was confirmed...

Not every query or mutation needed to be rewritten.

Instead, the rule applied was:

- role-sensitive callers must be guarded before reaching shared mutations/queries
- shared mutations still keep important ownership checks where relevant
- actor identity must be derived from the authenticated profile server-side, not taken from client form/body/query values

For example, course mutations remained acceptable as long as:

- the caller enforced approved-teacher access
- the `teacherId` passed into the mutation came from `actor.clerkUserId`
- ownership checks still scoped updates to the correct teacher-owned course

TITLE Moallem Academy Web Implementation Log - Step 15 Review queries and mutations for ownership and caller safety - Why this matters...

This kept Feature 11 focused and safe without forcing unnecessary refactors to every shared data function.

---

TITLE Moallem Academy Web Implementation Log - Step 16 Improve page-level permission UX with forbidden handling - Files updated...

- `next.config.ts` or `next.config.js`
- `app/forbidden.tsx`
- protected teacher/admin pages

TITLE Moallem Academy Web Implementation Log - Step 16 Improve page-level permission UX with forbidden handling - What was implemented...

Initially, a student visiting a teacher page caused the app to throw:

- `UNAUTHORIZED: approved teacher role required`

This was secure, but it surfaced through the generic unexpected error boundary, which looked like a crash.

To fix that, page-level authorization denials were shifted toward proper forbidden handling:

- enable the Next.js auth interrupt capability if needed by the project setup
- add `app/forbidden.tsx`
- use `forbidden()` in protected pages for expected authorization denials

Route Handlers still return normal HTTP `401` / `403` JSON responses. This change was specifically for page UX.

TITLE Moallem Academy Web Implementation Log - Step 16 Improve page-level permission UX with forbidden handling - Why this matters...

Permission denial is an expected product state, not an application failure. Teacher/admin routes should render a proper 403-style experience rather than the global crash page.

---

TITLE Moallem Academy Web Implementation Log - Step 17 Local verification used for Clerk sync and role-aware protection - Commands...

```bash
npm run dev
npx prisma studio
ngrok http 3000
npx tsc --noEmit
npm run build
```

TITLE Moallem Academy Web Implementation Log - Step 17 Local verification used for Clerk sync and role-aware protection - What was tested...

- Clerk webhook endpoint successfully received events locally through ngrok
- creating a new Clerk user created a matching `profiles` row automatically
- updating the Clerk user updated synced profile fields
- a plain student profile no longer had truthful teacher/admin rights
- teacher/admin routes, actions, and Route Handlers were reviewed and guarded by role
- pending teachers remained blocked from teacher-only capabilities
- approved teachers could use teacher flows
- admins could reach admin flows
- lesson access endpoints now relied on shared access logic rather than “signed in only”
- TypeScript and production build checks passed

TITLE Moallem Academy Web Implementation Log - Step 17 Local verification used for Clerk sync and role-aware protection - Why this matters...

This verification proved that Feature 11 is not just schema work. It actually connected Clerk identity, DB profile truth, and role-aware backend enforcement into one working path.

---

TITLE Moallem Academy Web Implementation Log - Step 18 Commit the admin/staff foundation - Command...

```bash
git add .
git commit -m "feat11 admin and staff management foundations"
git push origin main
```

TITLE Moallem Academy Web Implementation Log - Step 18 Commit the admin/staff foundation - Why this matters...

This saves the first truthful role-aware authorization foundation for the web app and prepares the codebase for Feature 12 protected media delivery and playback rules.

---

TITLE Moallem Academy Web Implementation Log - Feature 11 completion checklist...

- [x] Clerk users sync into the `profiles` table automatically
- [x] `profiles` now functions as the app-level source of truth for role and approval state
- [x] role-ready profile behavior is established for `student`, `teacher`, and `admin`
- [x] teacher approval is modeled as a real admin-controlled state
- [x] shared backend access helpers now exist for role and approval checks
- [x] teacher/admin-sensitive pages were reviewed and hardened with real authorization
- [x] Server Actions were reviewed and guarded by actor role
- [x] Route Handlers were classified and guarded by actor role
- [x] protected lesson/media access now has a centralized access-check foundation
- [x] expected page-level authorization failures no longer have to fall into generic crash-style UI
- [x] admin/staff UI additions use the shared shadcn-based component system
- [x] new visible strings were added through localization files
- [x] no new feature logic depends on “logged in only” without DB profile truth

---

TITLE Moallem Academy Web Implementation Log - Notes for future features...

- Feature 12 should build on the shared lesson/media access checks introduced here instead of reinventing playback rules per page or per client.
- Cloudinary delivery remains the current owned-media path, but signed delivery alone is not the full protection model; authorization must continue to happen before media details are returned.
- External media links remain a lower-trust fallback path and need final product-policy confirmation during playback work.
- Teacher approval is now a real product concept, but the exact long-term admin/staff permission matrix can still evolve in later shared-operations features.
- Any remaining old Supabase-specific assumptions around auth, roles, or data access should be removed if still found elsewhere in the project or docs. 