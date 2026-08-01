## Current Status
Phase: Phase 3 — Shared Product Operations
Current Goal: Formalize shared app-level identity, role enforcement, teacher approval, and backend access rules so admin/teacher/student behavior is driven by DB truth and reusable across web and future mobile consumers
Last completed: 11 — Admin and Staff Management Foundations
Next up: 12 — Shared Media Delivery, Protection, and Playback Rules



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
- [x] 09 — Course Media Source System (Cloudinary Upload + External Links)
- [x] 10 — Manual Payment and Access Confirmation Web Flows



### Phase 3 — Shared Product Operations
- [x] 11 — Admin and Staff Management Foundations
- [ ] 12 — Shared Media Delivery, Protection, and Playback Rules
- [ ] 13 — Cross-Platform Data and Role Alignment Review



### Phase 4 — Quality and Release Readiness
- [ ] 14 — Empty, Loading, and Error States
- [ ] 15 — UI Polish and Design-System Consistency
- [ ] 16 — Deployment and Environment Readiness



## In Progress
- None

## Open Questions
- Confirm exact admin/staff permissions for enrollment override, access confirmation, and content moderation beyond the current role/approval foundation.
- Confirm which entities and permissions must be fully shared between web and mobile from the start.
- Confirm the final media-handling rules for uploaded videos vs externally linked videos.
- Confirm whether Cloudinary is the only upload provider for owned video/media assets, or whether Backblaze B2 should be added as the next owned-storage provider.
- Confirm how preview/free-lesson media should be modeled across uploaded and linked content now that lesson media is provider-aware.
- Confirm whether student playback should ever expose raw external links directly, or whether externally linked media must always be wrapped in a controlled player surface.
- Confirm final product policy for lesson publishability: whether lessons may exist without media indefinitely, or whether a later rule should block publishing/access until a media source is attached.
- Confirm whether a shared media service abstraction should now be introduced before Feature 12 so future providers and playback rules do not spread Cloudinary-specific logic across multiple files.
- Confirm whether teacher/mobile clients should continue using the existing `/api/cloudinary/upload-signature` route, or whether that should be namespaced to a dedicated teacher/mobile media route for long-term clarity.
- Confirm whether all-platform subscription approval should remain a `Profile.hasActiveSubscription` flag long-term, or later evolve into a dedicated subscription/access model shared across platforms.
- Confirm whether teacher-specific payment details should remain per-teacher only, or later support per-course overrides for teachers who need different payment instructions by course.



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
- Feature 09 replaced the old single-field lesson video placeholder direction with a provider-aware lesson media model centered on a dedicated `LessonMedia` record per lesson, allowing a lesson to reference either an owned Cloudinary upload or an external video link without tying the product to one URL pattern.
- Feature 09 established that lesson content and lesson media are separate concerns: `Lesson` remains the educational/content container, while `LessonMedia` stores media-provider metadata such as provider type, Cloudinary public ID, external URL, readiness state, and duration metadata where available.
- Feature 09 adopted Cloudinary as the first owned-upload provider for web and future mobile flows, using signed direct upload from client to Cloudinary, server-side signature generation, authenticated signed delivery URLs for preview/playback preparation, and server-side asset cleanup through the Cloudinary SDK.
- Feature 09 confirmed the current replacement strategy for uploaded lesson media is application-level replacement, not Cloudinary in-place overwrite: upload a new asset, save its metadata, delete the old owned asset if needed, then update the lesson media record.
- Feature 09 introduced dedicated teacher lesson CRUD flows on top of the existing teacher course-management area:
  - create lesson page under `app/[locale]/(teacher)/teacher/courses/[courseId]/lessons/new`
  - lesson management/details page under `app/[locale]/(teacher)/teacher/courses/[courseId]/lessons/[lessonId]`
  - lesson edit page under `app/[locale]/(teacher)/teacher/courses/[courseId]/lessons/[lessonId]/edit`
- Feature 09 established the teacher UX rule that video management belongs on the dedicated lesson page, not inline on the course details page, while the course page remains a high-level lesson-management overview with actions such as manage video, edit lesson, and delete lesson.
- Feature 09 added real lesson mutations in `lib/mutations/lesson.ts` for teacher-scoped lesson creation, update, and deletion, with ownership validation through the parent course’s `teacherId`.
- Feature 09 added real media mutations in `lib/mutations/media.ts` for:
  - saving Cloudinary media metadata
  - saving external-link media metadata
  - deleting lesson media
  - replacing old Cloudinary assets during provider switches or re-uploads
- Feature 09 kept web-triggered lesson/media form submissions in thin Server Actions (`actions/lesson.ts`, `actions/media.ts`) while adding matching Route Handlers for mobile/external HTTP consumers under `app/api/teacher/...`, preserving the shared cross-platform architecture instead of placing logic only in Server Actions.
- Feature 09 established mobile/API parity for teacher lesson/media operations through Route Handlers covering:
  - create lesson
  - get lesson details
  - update lesson
  - delete lesson
  - save Cloudinary media metadata
  - save external-link media metadata
  - get lesson media/preview
  - delete lesson media
- Feature 09 confirmed that mobile or other external clients should follow the same owned-upload pattern as web: request a server-generated Cloudinary upload signature, upload the file directly to Cloudinary, then call the app API to save the returned Cloudinary metadata against the lesson.
- Feature 09 kept `/api/cloudinary/upload-signature` as the shared signature endpoint for now, while deferring final namespacing/authorization decisions for teacher/mobile media endpoints to later review.
- Feature 09 added provider-aware lesson media preview behavior:
  - for Cloudinary uploads, the backend generates signed authenticated delivery URLs using the Cloudinary SDK
  - for external links, the backend returns the original URL as the current preview target
- Feature 09 confirmed that authenticated Cloudinary preview links should include an explicit video format such as `mp4` when generating signed preview URLs, because raw authenticated asset URLs without a format suffix may download as unnamed files instead of opening cleanly in browser preview flows.
- Feature 09 added teacher-side replacement/delete safeguards and UX improvements:
  - loading state during upload
  - success state plus toast after save
  - persistent preview link for current media
  - destructive delete confirmation modal for lesson media removal
  - explicit teacher warning that replacing an uploaded video permanently deletes the previous uploaded asset to save storage space
- Feature 09 was further refined with large-upload progress tracking inside the teacher `LessonMediaManager` flow:
  - replaced the plain Cloudinary `fetch()` upload request with `XMLHttpRequest` so the browser can receive upload progress events
  - added real progress percentage, uploaded bytes vs total bytes, estimated upload speed, and ETA for long video uploads such as ~200 MB lesson videos
  - added upload cancellation support through `xhr.abort()` during active Cloudinary uploads
  - preserved the existing architecture of direct signed client-to-Cloudinary upload followed by `saveCloudinaryMediaAction(...)`, rather than moving upload bytes through the app server
  - kept the progress UX inside the lesson-level teacher media manager because upload progress must be tracked in the browser client, not in `lib/mutations/*` or Route Handlers
  - replaced temporary spinner-only behavior with a more truthful teacher-facing upload state appropriate for large media files
  - tightened local typing for the direct-upload response by replacing `Promise<any>` with a dedicated typed Cloudinary upload response shape
- Feature 09 confirmed that deleting a lesson must also clean up its attached media state and owned uploaded asset where applicable, preventing orphaned Cloudinary files or lesson-media rows.
- Feature 09 established that lessons may currently exist without attached media, but the missing-media state must be visually obvious in teacher management flows; final publish/access enforcement rules are intentionally deferred to Feature 12.
- Feature 09 extended localization with Arabic-first lesson/media namespaces and maintained RTL-safe teacher flows for lesson create/edit/media management surfaces.
- Feature 09 also introduced real teacher-facing error boundaries using localized `app/[locale]/error.tsx` and root `app/global-error.tsx` as a resilience baseline for teacher/media work, aligning with Next.js App Router error-boundary conventions.
- Feature 10 introduced a real manual payment/access-confirmation foundation centered on three product concerns: singleton global payment configuration, teacher-specific payment details, and student payment requests with admin review.
- Feature 10 extended the Prisma schema with payment-focused models and access fields, including `PaymentConfig`, `TeacherPaymentDetail`, `PaymentRequest`, `PaymentRequestStatus`, `PaymentRequestType`, and `Profile.hasActiveSubscription`, while intentionally avoiding full billing/accounting scope.
- Feature 10 established the product rule that global payment configuration is admin-managed, always available to students, and separate from teacher-specific payment details.
- Feature 10 established the corrected ownership rule for teacher payment details: teachers manage their own payment content from a teacher-facing payment page, while admins can review that content and control whether it is visible to students.
- Feature 10 established that teacher-payment visibility is a backend-truth field on `TeacherPaymentDetail.isVisibleToStudents`, not a UI-only toggle and not a teacher-controlled flag.
- Feature 10 implemented the required manual request flow for both one-course payment requests and all-platform subscription requests, capturing student phone number and payment reference/proof text as first-class fields.
- Feature 10 centralized request creation, approval, and rejection logic inside `lib/mutations/payment.ts`, keeping status transitions and access updates out of page components and thin wrappers.
- Feature 10 connected admin approval outcomes to truthful access-state updates:
  - course request approval confirms or creates the matching `Enrollment`
  - course request rejection preserves a rejected enrollment state
  - subscription approval updates `Profile.hasActiveSubscription`
- Feature 10 added payment-focused read/query helpers in `lib/queries/payment.ts`, thin web-triggered Server Actions in `actions/payment.ts`, and mobile/future-consumer Route Handlers under `app/api/payment/*`, preserving the established cross-platform architecture instead of burying logic in web-only code.
- Feature 10 added localized Arabic-first student/admin/teacher payment surfaces using the shared shadcn-based design system, including a global admin payment config page, teacher self-service payment page, admin teacher-payment visibility review page, student payment instructions page, student request form, and admin request review list.
- Feature 10 also surfaced a temporary implementation reality: until Feature 11 formalizes role assignment/admin controls, local verification may still rely on direct `Profile.role` edits in Prisma Studio for admin/teacher testing.

- Feature 11 formalized the app-level identity bridge: Clerk remains the authentication provider, while the `profiles` table in Neon/Prisma is now the source of truth for app-level role, approval, and shared authorization decisions.
- Feature 11 adopted Clerk webhooks as the long-term profile-sync mechanism, replacing any manual-profile-creation assumption with idempotent Clerk-to-database synchronization for user create/update/delete events.
- Feature 11 confirmed that app authorization must not depend on Clerk auth presence alone; all meaningful role checks must resolve the synced DB profile first.
- Feature 11 established the shared role model now active in backend logic: `student`, `teacher`, and `admin`, with teacher capability gated by explicit admin approval state rather than role label alone.
- Feature 11 introduced teacher approval as a first-class product rule: teacher accounts may exist in a pending/rejected state, and teacher capabilities must remain disabled until approved by an admin.
- Feature 11 established reusable access-control helpers in `lib/access/*` as the shared authorization layer for pages, Server Actions, queries/mutations callers, and Route Handlers, rather than scattering ad-hoc role checks across UI components.
- Feature 11 clarified the protection strategy by surface:
  - pages should handle expected authorization failures with a controlled UX (`forbidden()` / 403 behavior) rather than falling into generic unexpected-error boundaries
  - Server Actions and Route Handlers must still enforce backend authorization directly
  - middleware/proxy remains useful for broad route protection but is not the source of truth for role authorization
- Feature 11 extended the established architecture pattern so protected capabilities are enforced consistently across:
  - `lib/queries/*` and `lib/mutations/*` as the shared business/data layer
  - `actions/*` as thin web-only wrappers with role-aware guards
  - `app/api/*` as thin HTTP wrappers for mobile/external consumers using the same shared backend rules
- Feature 11 reviewed and hardened teacher/admin/student-sensitive pages, Server Actions, and Route Handlers so signed-in users cannot rely on “logged in only” behavior to reach protected product flows.
- Feature 11 established that actor identity for protected backend operations must be derived from Clerk session + synced DB profile on the server side, not trusted from client-supplied IDs such as `teacherId` in request input.
- Feature 11 added shared lesson-access foundations through centralized playback/access checks so future media delivery for web and mobile can depend on the same backend authorization rules before returning protected media details.
- Feature 11 preserved Cloudinary as the current owned-media provider while explicitly separating media authorization from media URL generation: backend access checks happen first, then protected/signed media delivery details may be returned.
- Feature 11 added a real admin-facing teacher management foundation using the shared shadcn-based UI layer and localization discipline, rather than temporary role truth living only in Prisma Studio edits.
- Feature 11 keeps localization discipline intact for newly introduced role/approval/admin-management UI, with Arabic-first defaults, English parity, and RTL-safe layouts preserved.



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
- Feature 09 is now complete and verified locally.
- Feature 09 introduced real teacher lesson management on top of teacher-owned courses: add lesson, edit lesson, delete lesson, dedicated lesson management pages, and lesson-focused media management rather than inline course-page upload controls.
- Feature 09 replaced the old lesson `videoUrl` placeholder direction with a provider-aware lesson media system centered on Cloudinary uploads and external links, backed by dedicated media mutations and preview-aware query logic.
- Feature 09 implemented signed direct Cloudinary upload for owned video files: the app generates upload signatures server-side, the client uploads directly to Cloudinary, then the app stores only the returned provider metadata in the database.
- Feature 09 implemented teacher-side media replacement and deletion with backend cleanup of old Cloudinary assets, preventing orphaned owned uploads during re-upload, provider switching, media deletion, and full lesson deletion.
- Feature 09 introduced signed authenticated Cloudinary preview URLs for teacher verification, plus persistent preview links in the teacher media UI and external-link parity for teacher-side source checking.
- Feature 09 added lesson/media Route Handlers under `app/api/teacher/...` so the mobile app can perform the same lesson CRUD and media-management operations over HTTP without duplicating business logic.
- Feature 09 added a Postman-ready testing flow for mobile/API parity, including lesson creation, Cloudinary signature retrieval, direct Cloudinary upload, media save, media retrieval, replacement, external-link save, media deletion, and lesson deletion.
- Feature 09 added teacher-facing upload polish and safety improvements, including loading state, success feedback, delete confirmation, replacement warning, and dedicated lesson-level video management UX.
- Feature 09 was further refined after completion with real large-file upload progress UX inside `LessonMediaManager`: percent complete, uploaded size, speed, ETA, cancellation support, and removal of the old spinner-only upload experience.
- Feature 09 also established localized error-boundary coverage for teacher/media flows using App Router error conventions, reducing the chance of raw crash screens during mutation-heavy teacher operations.
- Feature 10 is now complete.
- Feature 10 added the real manual payment and access-confirmation flow with admin-managed global payment configuration, teacher-managed payment details, admin-controlled teacher-detail visibility, student payment request submission, and admin review actions.
- Feature 10 extended the Prisma schema with payment-related models and enums, plus a minimal subscription-access field on `Profile`, while intentionally keeping payment gateway/accounting scope out of this feature.
- Feature 10 preserved the agreed cross-platform architecture through `lib/queries/payment.ts`, `lib/mutations/payment.ts`, `actions/payment.ts`, and `app/api/payment/*` instead of placing business logic inside page components.
- Feature 10 established the corrected ownership model for teacher payment data: teachers manage their own payment content, admins review it and control student visibility, and students only see teacher-specific payment details when explicitly enabled.
- Feature 10 connected manual admin review outcomes to truthful access state updates for both course-specific enrollments and all-platform subscription approval.
- Feature 10 added localized Arabic-first payment/admin/teacher/student UI surfaces on top of the shared shadcn-based design system, while keeping RTL-safe layout and no-hardcoded-visible-string discipline.
- Feature 10 local verification also highlighted that full product-grade role assignment is still deferred to Feature 11, so temporary Prisma Studio role edits may still be used during development until formal admin/staff role tooling lands.
- Next implementation focus should now shift to Feature 11 (admin and staff management foundations), while Feature 12 remains important for final media delivery, protection, and playback-policy enforcement.
- Feature 11 is now complete.
- Feature 11 closed the major gap between Clerk authentication and real app authorization by syncing Clerk users into the `profiles` table automatically through webhooks instead of depending on manual DB profile creation.
- Feature 11 established the DB-backed role/approval model required for truthful product behavior: `student`, `teacher`, and `admin`, with teacher capability gated by explicit admin approval state.
- Feature 11 added shared backend access guards so teacher/admin/student-sensitive flows are protected in pages, Server Actions, and Route Handlers rather than relying on UI hiding or signed-in state alone.
- Feature 11 also surfaced and fixed an important product-security gap during verification: some teacher pages and mutations were still reachable by plain signed-in students until role-aware guards were systematically applied.
- Feature 11 improved the UX of expected authorization failures by moving protected teacher/admin page denials away from generic crash-style error boundaries toward proper forbidden/access-denied handling.
- Feature 11 established the first shared playback/access-control foundation by centralizing lesson-access checks that future protected media delivery and playback routes can reuse across web and mobile consumers.
- Local verification for Feature 11 confirmed Clerk webhook sync works with ngrok during development, profile records are created/updated correctly, and role-aware protection is now active across the protected teacher/admin surfaces that were reviewed.
- Next implementation focus should now shift to Feature 12 (shared media delivery, protection, and playback rules), building on the role-aware identity and access-control foundation completed in Feature 11.