# Moallem Academy Web — Progress Tracker

Repo: [https://github.com/shoaibhajj/EduStream-web.git](https://github.com/shoaibhajj/EduStream-web.git)

Update this file after each completed feature.

## Current Status
Phase: Ready to start
Current Goal: Begin the real web app foundation with Next.js, Clerk, Supabase, Cloudinary-aware media planning, and shared mobile/web product alignment
Last completed: None yet
Next up: 01 — Establish Real Web Foundation

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
- Web should use real Clerk authentication, real Supabase database flows, and real product data.
- Web architecture must stay compatible with current and future mobile app needs where entities, permissions, and workflows are shared.
- Arabic is the primary/default product language.
- English is secondary.
- RTL must be treated as a first-class requirement from the start.
- Teacher course media may come from multiple sources:
  - direct upload from the website
  - future direct upload from the mobile app
  - external video link entry
- Media architecture must support this from the beginning instead of assuming a single video URL pattern.

## Progress

### Phase 1 — Real Web Foundation
- [ ] 01 — Establish Real Web Foundation
- [ ] 02 — Configure Clerk Authentication Foundation
- [ ] 03 — Configure Supabase Database Foundation
- [ ] 04 — Establish RTL, Localization, and App Shell Foundation

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
- None yet.

## Open Questions
- Confirm exact admin/staff permissions for enrollment override, access confirmation, and content moderation.
- Confirm which entities and permissions must be fully shared between web and mobile from the start.
- Confirm the final media-handling rules for uploaded videos vs externally linked videos.
- Confirm whether Cloudinary is the only upload provider for owned video/media assets.
- Confirm how preview/free-lesson media should be modeled across uploaded and linked content.

## Architecture Decisions
- Web starts now because the mobile side is stable enough for aligned implementation.
- Web must be built against real auth and real data foundations.
- Shared product decisions should not be made in a web-only way if they affect mobile too.
- `mobile-app-change-handoff.md` is part of required context for all web features.
- Media handling must support both uploaded assets and externally linked content.
- Cloudinary-aware media architecture should be treated as a product-level decision, not just a UI detail.

## Session Notes
- Mobile side is now stable enough to begin web implementation.
- Mobile branding has been updated to **Moallem Academy**.
- Mobile supports Arabic-first UX with English secondary support.
- Mobile has a working Android APK build confirmed on a real device.
- Mobile Feature 15 remains in progress as a UI-polish/design-system refinement track.
- Web should begin with real infrastructure and shared product alignment, not mock/demo flows.
