# Moallem Academy Web — Progress Tracker

Repo: [https://github.com/shoaibhajj/EduStream-web.git](https://github.com/shoaibhajj/EduStream-web.git)

Update this file after each completed feature.

## Current Status
Phase: Phase 2 — Core Product Flows
Current Goal: Continue deeper product flows on top of the established shared web design-system foundation so future work stays consistent, RTL-safe, localized, and easier to evolve
Last completed: 08 — Teacher Dashboard and Course Management Flow
Next up: 09 — Course Media Source System (Cloudinary Upload + External Links)

## Required First Read
Before starting any feature, the AI agent must read these 8 files from the repo first:

1. `web-project-overview.md`
2. `web-architecture.md`
3. `web-code-standards.md`
4. `web-ui-context.md`
5. `web-build-plan.md`
6. `web-progress-tracker.md`
7. `web-ai-workflow-rules.md`
8. `mobile-app-change-handoff.md`

Do not start implementation before reading all 8 files.

## Product Notes
- Production-facing product name is now **Moallem Academy**.
- Web is a real implementation phase, not a mock-data-first phase.
- Web should use real Clerk authentication, real Neon database flows via Prisma, and real product data.
- Web architecture must stay compatible with current and future mobile app needs where entities, permissions, and workflows are shared.
- Arabic is the primary/default product language.
- English is secondary.
- RTL must be treated as a first-class requirement from the start.
- Teacher course media may come from multiple sources:
  - direct upload from the website
  - future direct upload from the mobile app
  - external video link entry
- Media architecture must support this from the beginning instead of assuming a single video URL pattern.
- Important backend change: the project database foundation moved away from Supabase and now uses **Neon + Prisma** for database connectivity on the web side.
- Any old markdown/documentation references that still describe Supabase as the active web database foundation should be updated to reflect **Neon + Prisma** if that direction remains official.
- The product is cross-platform by design: web (Next.js) and mobile (React Native/Expo) share the same backend, database, and business logic, but never share source code directly between repos.
- Because of this, every feature that involves student- or teacher-facing data must be built with a shared data-access layer from the start, so both web and mobile can consume the same logic without duplicating it.
- A shared design system should now be established earlier than originally planned so future teacher/admin/media/payment screens do not drift into inconsistent UI patterns that become harder to refactor later.
- If a component foundation is adopted, it should be treated as a customizable system layer, not as a copy-paste UI dump.
- The active UI foundation is now **shadcn/ui plus shared project wrapper components**, customized for Moallem Academy rather than used as an unmodified default kit.
- All future web features must use the established shared design-system layer first, and should not introduce parallel ad-hoc UI patterns.
- Any new visible UI string introduced in future features must continue to go through the localization system with Arabic-first defaults, English parity, and RTL-safe structure.

## Progress

### Phase 1 — Real Web Foundation
- [x] 01 — Establish Real Web Foundation
- [x] 02 — Configure Clerk Authentication Foundation
- [x] 03 — Configure Database Foundation (Neon + Prisma)
- [x] 04 — Establish RTL, Localization, and App Shell Foundation

### Phase 2 — Core Product Flows
- [x] 05 — Student Browse and Course Discovery Flow
- [x] 06 — Course Detail, Preview, and Access States
- [x] 07 — Establish Web Design System and Shared UI Components
- [x] 08 — Teacher Dashboard and Course Management Flow
- [ ] 09 — Course Media Source System (Cloudinary Upload + External Links)
- [ ] 10 — Manual Payment and Access Confirmation Web Flows

### Phase 3 — Shared Product Operations
- [ ] 11 — Admin and Staff Management Foundations
- [ ] 12 — Shared Media Delivery, Protection, and Playback Rules
- [ ] 13 — Cross-Platform Data and Role Alignment Review

### Phase 4 — Quality and Release Readiness
- [ ] 14 — Empty, Loading, and Error States
- [ ] 15 — UI Polish and Design-System Consistency
- [ ] 16 — Deployment and Environment Readiness

## In Progress
- None

## Open Questions
- Confirm exact admin/staff permissions for enrollment override, access confirmation, and content moderation.
- Confirm which entities and permissions must be fully shared between web and mobile from the start.
- Confirm the final media-handling rules for uploaded videos vs externally linked videos.
- Confirm whether Cloudinary is the only upload provider for owned video/media assets.
- Confirm how preview/free-lesson media should be modeled across uploaded and linked content.
- Confirm whether Neon + Prisma is the permanent shared backend direction for web only, or whether future mobile/backend alignment will also move away from Supabase.
- Confirm whether mobile API routes need authentication (Clerk token verification) starting with Feature 09, or whether this remains deferred until Feature 10 (payment/access confirmation).
- Confirm whether `Lesson.videoUrl` stays a plain string placeholder or should be formally replaced/extended by a multi-source media model in Feature 09.
- Confirm whether additional shared media/admin form abstractions should be added on top of the current component layer as Feature 09 expands teacher-facing workflows.

## Architecture Decisions
- Web starts now because the mobile side is stable enough for aligned implementation.
- Web must be built against real auth and real data foundations.
- Shared product decisions should not be made in a web-only way if they affect mobile too.
- `mobile-app-change-handoff.md` is part of required context for all web features.
- Media handling must support both uploaded assets and externally linked content.
- Cloudinary-aware media architecture should be treated as a product-level decision, not just a UI detail.
- Clerk is now wired into the real App Router foundation with localized auth routes and production-minded session awareness.
- Localization is established early with Arabic as the default locale, English as the secondary locale, and RTL preserved as a first-class requirement.
- Auth and localization decisions should remain compatible with future mobile role handling and shared user identity flows.
- Important backend implementation change: Feature 03 was completed using **Neon + Prisma** instead of Supabase.
- Prisma is now the server-side database access layer for the web app.
- Database credentials must remain server-only and must never be exposed through `NEXT_PUBLIC_*` variables.
- Clerk remains the source of truth for authentication identity.
- The `profiles` table remains the app-level source of truth for role-ready user metadata and future app-specific user modeling.
- A `Course` model was added to the Prisma schema, linked to `Subject`, with minimal fields (`nameAr`, `nameEn`, `descriptionAr`, `descriptionEn`, `thumbnailUrl`, `isPublished`, `sortOrder`). Price, teacher ownership, and lesson/media fields are intentionally deferred to later features.
- Established the final cross-platform data-access pattern going forward:
  - `lib/queries/*` — all read-only database access, callable directly from Server Components (web) and from API route handlers (mobile).
  - `lib/mutations/*` — all real create/update/delete database logic, framework-agnostic, never tied to web or mobile directly.
  - `actions/*` — thin Server Action wrappers around `lib/mutations/*`, used only by web Client Components (forms, buttons) via the `"use server"` directive.
  - `app/api/*` — thin Route Handler wrappers around `lib/queries/*` and `lib/mutations/*`, used by the mobile app and any other external consumer over HTTP.
- Server Actions are reserved strictly for web-triggered mutations (e.g. a teacher submitting a "create course" form). They are not usable by the mobile app and must never contain business logic that isn't also exposed through `lib/mutations/*`.
- Route Handlers under `app/api/` are the only way the mobile app can reach backend data or mutations, since React Native cannot import Server Components or Server Actions directly.
- Starting Feature 06, any new backend logic must be written once inside `lib/queries/` or `lib/mutations/`, then exposed through both a web-facing caller (Server Component or Server Action) and, where mobile will need it, a matching `app/api/` Route Handler — to avoid logic duplication between platforms.
- Official Next.js docs used to validate this pattern: App Router data fetching, Server Actions / mutating data, Backend for Frontend guidance, and the Prisma + Next.js guide.
- Feature 06 added `Lesson` and `Enrollment` models to the Prisma schema. `Lesson` includes a minimal `videoUrl` placeholder field intentionally left generic so Feature 09 can extend it into a proper multi-source media system (Cloudinary upload, mobile upload, or external link) without a breaking schema change.
- Feature 06 added `Course.teacherId` (nullable string, Clerk user ID) as a safe-default field now, so Feature 08 does not require a schema migration just to introduce teacher ownership.
- Feature 06 added `EnrollmentStatus` enum (`pending`, `confirmed`, `rejected`) as the minimal truthful access-state model. Full manual payment workflow and status-transition logic remain deferred to Feature 10.
- Feature 06 confirmed the project has fully moved to Prisma 7 with `prisma.config.ts` as the source of connection configuration; `schema.prisma` no longer contains a `url` field in the `datasource` block, consistent with Prisma 7's config-based model.
- Feature 06 established that `lib/queries/course.ts` exposes both public course-detail reads and student-specific enrollment-status reads as separate functions, avoiding over-fetching for unauthenticated visitors while staying reusable from mobile API routes.
- A design-system foundation is now intentionally being inserted before deeper teacher/admin/media work so component choices, form patterns, spacing, states, and RTL behavior are standardized earlier rather than deferred to late-stage cleanup.
- The project now uses **shadcn/ui** as the base component distribution layer, aligned with the official Next.js installation and theming guidance.
- The shared component architecture is now:
  - `components/ui/*` — generated shadcn/ui primitives and base building blocks.
  - `components/shared/*` — project-owned reusable wrappers and product-level UI patterns such as shared cards, states, and status displays.
  - feature-specific folders like `components/student/*` — domain components built on top of `components/ui/*` and `components/shared/*`, not ad-hoc raw markup unless there is a clear reason.
- All future features must prefer extending the shared component system over adding one-off page-level styling patterns.
- Link-style navigation that looks like a button should follow the current shadcn guidance by using `buttonVariants(...)` on links rather than relying on non-guaranteed `asChild` support in local button implementations.
- Tailwind v4 theming and project tokens must remain aligned with the Moallem Academy palette from `web-ui-context.md`, while shadcn semantic variables continue to be mapped into that same product design direction.
- Arabic-first layout, English parity, localization discipline, accessibility, and RTL-safe interaction behavior are all part of the design-system contract and must be preserved in every subsequent feature.
- Feature 08 completed the first real mutation-heavy teacher flow using the agreed shared architecture: teacher-facing reads in `lib/queries/teacher.ts`, business logic in `lib/mutations/course.ts`, thin web-only Server Actions in `actions/course.ts`, and a mobile-consumable Route Handler in `app/api/teacher/courses/route.ts`.
- Feature 08 confirmed ownership enforcement for teacher-managed courses by scoping reads and writes to `Course.teacherId` (Clerk user ID), preventing teachers from reading or mutating other teachers’ course records through the dashboard flow.
- Feature 08 introduced a minimal schema extension for teacher course management by adding `Course.price` plus a teacher query index, while intentionally deferring lesson media/source modeling to Feature 09.
- Feature 08 established the teacher web UX pattern of separate create, read-only details, and edit pages, with redirect-to-dashboard behavior after successful create/update mutations.

## Session Notes
- Mobile side is now stable enough to begin web implementation.
- Mobile branding has been updated to **Moallem Academy**.
- Mobile supports Arabic-first UX with English secondary support.
- Mobile has a working Android APK build confirmed on a real device.
- Mobile Feature 15 remains in progress as a UI-polish/design-system refinement track.
- Web should begin with real infrastructure and shared product alignment, not mock/demo flows.
- Feature 01 established the real Next.js web foundation for Moallem Academy.
- Feature 02 completed Clerk authentication foundations with root integration, localized sign-in/sign-up routing, session-aware UI, and a cleaner role-ready auth base.
- Feature 04 was completed alongside auth work to establish locale routing, Arabic-first structure, English secondary support, and RTL-aware app-shell direction from the start.
- Feature 03 completed the initial real database foundation using **Neon + Prisma**.
- The first database schema direction was established around `profiles`, `academic_years`, and `subjects`.
- Prisma Client generation is working and Neon connectivity was successfully established after resolving environment and connection issues.
- Old Supabase-specific implementation remnants should now be removed or updated where they still exist in the codebase or markdown documentation.
- Feature 05 added the `Course` model to the Prisma schema and shipped a real student browse flow (academic year → subject → course list) using real Neon-backed Prisma queries, with no mock data.
- Feature 05 introduced `lib/queries/browse.ts` as the shared, server-only read layer for browse data, used directly by web Server Components.
- Feature 05 also introduced a mobile-facing API layer under `app/api/browse/` (years, subjects, courses) so the React Native app can consume the exact same query logic over HTTP, avoiding any duplicated Prisma queries between platforms.
- All new browse-related visible strings were added to both `messages/ar.json` and `messages/en.json` under a new `Browse` namespace, covering headings, empty states, error states, and navigation labels, with Arabic-first defaults preserved.
- Resolved a Prisma migration drift issue caused by earlier schema changes being applied via `db push` instead of `migrate dev`; `prisma migrate reset` was used safely since only seed data existed at the time.
- Clarified and formally adopted the cross-platform architecture pattern for all future features: reads in `lib/queries/`, writes in `lib/mutations/`, Server Actions in `actions/` for web-only mutation triggers, and Route Handlers in `app/api/` for mobile and external consumers — this will be the standard going into Feature 06 and beyond.
- Feature 06 completed the real course detail flow: `Lesson` and `Enrollment` models added to Prisma, `lib/queries/course.ts` added for shared course-detail and enrollment-status reads, `app/api/courses/[courseId]/route.ts` added for mobile consumption, and a real course detail page shipped at `app/[locale]/(student)/course/[courseId]/page.tsx`.
- Feature 06 implemented clear, localized preview/locked/accessible lesson badges via a shared `LessonRow` component, using design tokens from `web-ui-context.md` (`success`, `accent`, `locked` colors).
- Feature 06 added a new `CourseDetail` localization namespace to both `messages/ar.json` and `messages/en.json`, covering lesson headings, access badges, enrollment status banners, and error/empty states, with Arabic-first defaults preserved and English parity maintained.
- Feature 06 confirmed enrollment-status UI (pending/confirmed/rejected banners) without building the actual payment or enrollment-trigger mutation, correctly deferring that business logic to Feature 10.
- During Feature 06, the project was confirmed to already be running Prisma 7.9.1 with `prisma.config.ts` handling datasource connection config; `schema.prisma` was cleaned up to remove the legacy `url` field from the `datasource` block, resolving a stale VS Code Prisma extension validation warning unrelated to actual build/runtime behavior.
- Feature 06 is now complete and verified locally: migration applied, Prisma client generated, course detail page renders correctly in Arabic and English with RTL layout, preview/locked lesson states confirmed visually, and the mobile-facing `app/api/courses/[courseId]` route returns valid JSON.
- The plan was updated after Feature 06 to insert an earlier dedicated design-system/shared-components feature before teacher management, because waiting until late polish would make refactoring more expensive.
- Feature 07 is now complete and established the shared web design-system foundation before teacher/admin/media expansion.
- Feature 07 adopted **shadcn/ui** as the base component distribution layer for the web app, following the current official installation and theming guidance for Next.js and aligning it with the existing Moallem Academy Tailwind v4 token system.
- Feature 07 established the long-term UI architecture split between `components/ui/*` for base shadcn primitives, `components/shared/*` for product-level reusable wrappers, and feature-specific domain components layered on top.
- Feature 07 refactored the existing early student-facing surfaces, including auth shell, landing, browse, and course detail screens, to use the new shared component approach instead of continuing with isolated raw page-level patterns.
- Feature 07 confirmed the project should use `buttonVariants(...)` on navigation links styled as buttons, matching current shadcn guidance and avoiding reliance on inconsistent local `asChild` support.
- Feature 07 preserved Arabic-first behavior, English parity, RTL-safe layout patterns, and localization discipline while establishing the reusable UI base.
- Starting with Feature 08, every new screen and refactor should build through the shared shadcn/ui + `components/shared/*` layer first, rather than introducing parallel component conventions.
- Feature 08 is now complete and verified locally.
- Feature 08 shipped a real teacher dashboard backed by Neon through Prisma, with teacher-scoped course reads, real create/update/publish flows, localized Arabic-first teacher pages, and shared UI-based empty/state/form patterns instead of mock data or isolated page markup.
- Feature 08 added shared teacher course management architecture for both web and future mobile consumers: `lib/queries/teacher.ts`, `lib/mutations/course.ts`, `actions/course.ts`, and `app/api/teacher/courses/route.ts`.
- Feature 08 expanded the teacher UX beyond raw form entry by adding dashboard-visible course metadata, a read-only teacher course details page, dashboard return flows after create/edit, and continued use of the shared shadcn-based design system.