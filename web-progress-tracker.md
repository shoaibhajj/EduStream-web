# Moallem Academy Web — Progress Tracker

Repo: [https://github.com/shoaibhajj/EduStream-web.git](https://github.com/shoaibhajj/EduStream-web.git)

Update this file after each completed feature.

## Current Status
Phase: Phase 1 — Real Web Foundation
Current Goal: Continue the real web platform by adding the Neon database foundation on top of the completed Next.js, Clerk, localization, and app-shell groundwork
Last completed: 03 — Configure Database Foundation (Neon + Prisma)
Next up: 05 — Student Browse and Course Discovery Flow

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

## Progress

### Phase 1 — Real Web Foundation
- [x] 01 — Establish Real Web Foundation
- [x] 02 — Configure Clerk Authentication Foundation
- [x] 03 — Configure Database Foundation (Neon + Prisma)
- [x] 04 — Establish RTL, Localization, and App Shell Foundation

### Phase 2 — Core Product Flows
- [ ] 05 — Student Browse and Course Discovery Flow
- [ ] 06 — Course Detail, Preview, and Access States
- [ ] 07 — Teacher Dashboard and Course Management Flow
- [ ] 08 — Course Media Source System (Cloudinary Upload + External Links)
- [ ] 09 — Manual Payment and Access Confirmation Web Flows

### Phase 3 — Shared Product Operations
- [ ] 10 — Admin and Staff Management Foundations
- [ ] 11 — Shared Media Delivery, Protection, and Playback Rules
- [ ] 12 — Cross-Platform Data and Role Alignment Review

### Phase 4 — Quality and Release Readiness
- [ ] 13 — Empty, Loading, and Error States
- [ ] 14 — UI Polish and Design-System Consistency
- [ ] 15 — Deployment and Environment Readiness

## In Progress
- 05 — Student Browse and Course Discovery Flow

## Open Questions
- Confirm exact admin/staff permissions for enrollment override, access confirmation, and content moderation.
- Confirm which entities and permissions must be fully shared between web and mobile from the start.
- Confirm the final media-handling rules for uploaded videos vs externally linked videos.
- Confirm whether Cloudinary is the only upload provider for owned video/media assets.
- Confirm how preview/free-lesson media should be modeled across uploaded and linked content.
- Confirm whether Neon + Prisma is the permanent shared backend direction for web only, or whether future mobile/backend alignment will also move away from Supabase.

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