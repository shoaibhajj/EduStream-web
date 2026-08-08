## Current Status
Phase: Phase 4 — Finish and Delivery Readiness
Current Goal: Finish the app quickly for delivery by hardening external video playback behavior, upgrading the UI to a real product-ready level, adding clearer role-aware sidebar/navigation structure, verifying mobile/API route parity, and applying the most realistic video-protection measures possible
Last completed: 14 — External Video Playback Hardening
Next up: 15 — Real App UI Overhaul and Sidebar Navigation


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
- [x] 12 — Shared Media Delivery, Protection, and Playback Rules


### Phase 4 — Finish and Delivery Readiness
- [x] 13 — Routing, Navigation, and Payment Route Fixes
- [x] 14 — External Video Playback Hardening
- [ ] 15 — Real App UI Overhaul and Sidebar Navigation
- [ ] 16 — Final Route/API Parity, Delivery Readiness, and Media Protection Hardening


## In Progress
- Feature 15 planning is now the active focus: real app UI overhaul and clearer role-aware sidebar/navigation structure.
- Feature 14 design decision is complete: Dailymotion is the supported protected external-video path.
- Feature 14 supports two Dailymotion ingestion flows:
  - app-managed upload to Dailymotion
  - teacher-pasted Dailymotion link
- External video support is now provider-aware and truthful: Cloudinary stays the reliable owned-media path, Dailymotion is the supported protected external path, and unsupported providers such as Google Drive, MEGA, and TeraBox must be rejected or flagged explicitly.[web:46][web:47]
- Playback resolution for Dailymotion remains authorization-gated and server-resolved through backend logic and thin Next.js Route Handlers where applicable, while the final student playback path uses the stable iframe embed flow.[web:46][web:47]


## Open Questions
- Confirm how to classify any existing legacy external-link records that are not Dailymotion or Cloudinary: block, migrate, or mark unsupported at playback.
- Confirm the final student-facing unsupported-state copy for non-Dailymotion external links.
- Confirm whether teacher-pasted Dailymotion links should accept both `dai.ly/<id>` and `dailymotion.com/video/<id>` plus private share variants.
- Confirm the final sidebar/navigation structure for student, teacher, and admin areas so users can always understand where they are in the app.
- Confirm which web routes must have guaranteed parity through `app/api/*` for mobile before delivery is considered complete.
- Confirm how far to go on anti-download video protection: player restrictions and UI deterrents are realistic; full prevention is not.
- Confirm the long-term policy for user-submitted external payment proof images: keep permissive direct rendering for arbitrary external hosts, or normalize uploads to a controlled storage path later.


## Architecture Decisions
- The remaining plan is now optimized for shipping speed and delivery readiness rather than continuing the original roadmap unchanged.
- Routing correctness, visible navigation, real page reachability, and route parity are now treated as delivery blockers, not polish tasks.
- Locale-aware routing must be treated as backend and app-shell truth, not as an optional UI cleanup, because incorrect redirects after login break core product use.
- Payment functionality is not considered truly delivered unless the related pages are reachable through working localized routes and visible role-appropriate navigation.
- Feature 13 established localized auth-safe routing behavior, corrected route entry points, surfaced payment pages through navigation/flow links, and improved app movement without waiting for the full UI/sidebar overhaul.
- Payment proof images may come from arbitrary third-party hosts, so payment-proof rendering should avoid fragile host-specific optimizer assumptions when the source is user-provided.
- External video playback must now be treated as provider-aware product logic, not just a saved URL field, because raw Google Drive, MEGA, and TeraBox share links are not reliably browser-playable video sources.[web:46][web:47]
- Cloudinary-owned uploaded media remains the most reliable protected playback path for owned video assets.
- Dailymotion is the supported protected external-video provider for Feature 14, with two supported ingestion flows: app-managed upload and teacher-pasted link.[web:46][web:47]
- Dailymotion playback resolution should remain authorization-aware and provider-specific, instead of assuming all external URLs are equivalent playback sources.[web:46][web:47]
- Feature 14 established a delivery-safe Dailymotion playback strategy: stable iframe-based playback with runtime player parameters is preferred over the more fragile SDK integration path under current account constraints.[web:46][web:47]
- Because Dailymotion automatic recommendations are enabled by default on new Players and more advanced Player-level control may depend on Studio/player configuration access, the shipped app workaround uses an app-owned near-end overlay/replay pattern rather than relying on account-level recommendation settings alone.[web:337][web:338][web:349]
- UI work is no longer limited to minor polish; the app now needs a broader product-level UI refinement pass so buttons, layout hierarchy, surfaces, spacing, and navigation feel like a real shipped application.
- Sidebar/navigation work is now a product-structure requirement, because relying mainly on inline links and back links makes the app harder to operate and demo.
- Final delivery readiness must include checking that all meaningful web pages and backend capabilities expected by mobile are represented through `app/api/*` routes where required.
- Video download protection should be improved with realistic layered deterrence and controlled delivery where possible, but the app should not claim impossible absolute anti-download guarantees.


## Session Notes
- Feature 13 is complete.
- Localized routing/navigation issues were corrected so users no longer depend on non-localized or broken route paths to move through the app.
- Post-auth route flow was updated toward valid localized destinations instead of dropping users onto `/` or other unusable entry points.
- Payment pages were verified and surfaced through reachable student, teacher, and admin flows instead of relying on hidden deep links alone.
- Course enrollment/payment CTA flow was corrected so users can navigate from course detail into the payment request route.
- Basic shared navigation was improved to make app movement clearer while staying compatible with the larger sidebar/UI work planned in Feature 15.
- Payment-proof image rendering was adjusted away from brittle host-specific assumptions for arbitrary third-party image URLs.
- Feature 14 is complete.
- Dailymotion was finalized as the supported protected external-video provider for delivery readiness.[web:46][web:47]
- The stable student playback path for Dailymotion is iframe-based embed, not the SDK integration, because iframe playback proved reliable in-app while the SDK path repeatedly produced black/empty player states.[web:46]
- Dailymotion iframe playback now uses runtime parameters on the embed URL, which is consistent with Dailymotion’s supported iframe integration model.[web:46][web:47]
- Dailymotion end-of-video recommendation behavior could not be fully relied on through Player-configuration access in the current setup, so the implemented product workaround hides the iframe shortly before the true end and replaces it with an app-owned replay overlay.[web:337][web:338][web:349]
- Unsupported external video providers remain explicitly unsupported instead of being treated as universally playable course media.[web:46][web:47]
- The next implementation pass should focus on Feature 15 — real app UI overhaul and sidebar/navigation refinement.


## Feature 14 — External Video Playback Hardening

### Goal
Harden external video playback so the app behaves truthfully and reliably in production: Cloudinary remains the owned-media path, Dailymotion is the supported external-video path, and unsupported providers are rejected or surfaced clearly instead of pretending any arbitrary share link is playable.[web:46][web:47]

### What was implemented
- Standardized external playback around **provider-aware resolution** instead of treating `external_url` as a directly playable source.[web:46][web:47]
- Confirmed **Dailymotion** as the supported external provider, with support for both:
  - app-managed Dailymotion media records
  - teacher-pasted Dailymotion links saved as Dailymotion video ids.[web:47]
- Updated Dailymotion resolution logic so playback uses the correct stored identifier with this precedence:
  - `dailymotionPrivateId` when present
  - otherwise `dailymotionVideoId`
  This keeps public-link ingestion and private/share-based ingestion compatible with the same playback pipeline.
- Kept playback authorization server-side and lesson-gated before any student player is shown, preserving the existing access-control model.
- Confirmed that the **stable production-safe student path is iframe embed**, not the SDK-based React integration, because the SDK path repeatedly produced black/empty player states in-app while direct iframe playback worked correctly with the same Dailymotion id.[web:46]
- Implemented the student Dailymotion player using the Dailymotion embed endpoint with runtime params on the iframe URL, including `video=...` and end-screen related parameters where helpful.[web:46][web:47]
- Added a practical end-of-video hardening behavior for Dailymotion playback:
  - the app hides the iframe slightly before the true video end using the saved duration
  - then shows the app-owned replay overlay
  This avoids showing unrelated Dailymotion recommendation cards at the end in the current non-Pro/current-access constraints.[web:337][web:349]
- Preserved replay behavior by remounting the iframe with a changing React `key`, rather than relying on fragile SDK lifecycle control.
- Kept realistic deterrence behavior in the lesson player such as blocking right-click and common save/view-source shortcuts, while not claiming impossible absolute anti-download guarantees.
- Preserved clear unsupported/no-access student states:
  - unauthorized users see the locked state
  - lessons with no playable media surface a no-media/unsupported state
  - non-supported providers remain explicitly unsupported instead of silently failing.[web:46][web:47]

### Data / model updates
- The resolved Dailymotion playback shape now carries enough information for the student player to behave correctly, including the resolved Dailymotion id and optional duration when available.
- `duration_seconds` is now meaningful for Dailymotion playback because it is used for the near-end overlay cutoff that suppresses platform recommendations in the iframe-based solution.

### Product behavior now
- **Cloudinary** remains the best path for owned uploaded media.
- **Dailymotion** is the supported external-video provider.
- Raw third-party share links such as Google Drive / MEGA / TeraBox are not treated as reliably playable course media and must be blocked, migrated, or surfaced as unsupported.[web:46][web:47]
- Dailymotion playback is now honest about platform limitations: with current account constraints, the app can reliably play the video and suppress end recommendations through app-side timing/overlay behavior, but it cannot depend on advanced Player-configuration controls reserved behind Dailymotion account capabilities alone.[web:337][web:338]

### Implementation notes
- The SDK/library-script Dailymotion integration was tested but rejected for this delivery pass because it introduced unstable black-player behavior in the app shell even when the same Dailymotion content played correctly through direct embed.
- The final chosen implementation favors **stable playback first** and uses a controlled app overlay near the end to avoid unrelated recommendations, which is a better delivery tradeoff than shipping a brittle SDK-based player.
- Dailymotion documents iframe embed as a supported integration path and separately documents runtime Player parameters on the embed URL, which matches the final chosen implementation.[web:46][web:47]

### Completion status
- Feature 14 is complete enough for delivery readiness on the current stack and account constraints:
  - Dailymotion links/videos play in the student app
  - unsupported providers are no longer treated as if they are valid playback sources
  - end-of-video recommendation behavior is mitigated with an app-owned overlay/replay pattern
  - authorization logic remains unchanged and server-gated