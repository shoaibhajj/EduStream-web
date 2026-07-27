# Mobile App Change Handoff for Web Repo

This file summarizes the current state of the mobile app so the web repo AI agent can stay aligned with the mobile product direction.

## Current Mobile Status

The mobile project has completed Features 01–14 and 16, while Feature 15 remains in progress as a deferred UI-polish pass. The first installable Android APK has already been built successfully and confirmed working on a real Android device.

## Product Naming

The production-facing app name has been updated from **EduStream** to **Moallem Academy**.

When writing web-repo content, app-facing labels, metadata, onboarding text, and branding references, prefer **Moallem Academy** unless a legacy/internal architecture note still needs the older EduStream project name for technical continuity.

## Language and Localization

The mobile app now supports two languages:

- Arabic as the primary/default language
- English as the secondary language

Important implementation details already established on mobile:

- Arabic is currently hardcoded as the default locale.
- Device locale detection is intentionally deferred for now.
- All visible UI strings are expected to come from translation files.
- RTL is enabled globally and must be treated as a first-class requirement.
- Arabic-first QA is the expected default workflow, followed by English verification.

## Navigation and User Flows

The mobile app already includes working navigation for both student and teacher flows.

### Student side

Implemented student flow includes:

- Student home
- Browse flow
- Academic year selection
- Subject selection
- Course list / course browsing
- Course detail
- Lesson watch placeholder
- Profile access

### Teacher side

Implemented teacher flow includes:

- Teacher home
- Teacher course management area
- Create/edit course flows
- Lesson management flows
- Profile access
- Payment info access

Important navigation decisions already established:

- Top-level tab destinations are kept separate from pushed detail/edit routes.
- Course detail and watch routes are outside the student tab tree.
- Teacher management detail routes are outside the teacher tab tree.
- Profile-tab navigation was cleaned up by replacing broken redirect-style behavior with direct re-export rendering.

## Content and Data State

The app is still in a mock-data-first phase.

This means:

- No real backend is connected yet.
- Supabase is intentionally deferred to Feature 17.
- Clerk is intentionally deferred.
- Mock data is organized by concern under `lib/mock-data/`.
- Current behavior should be treated as UI-ready and flow-ready, but not backend-complete.

## Implemented Mobile Foundations

The mobile app already has these foundations in place:

- Expo Router navigation structure
- NativeWind styling setup
- Shared UI primitives under `components/ui/`
- Shared design tokens and color tokens
- Translation files for Arabic and English
- Types aligned with the future backend shape
- Mock student, teacher, shared, and profile data modules
- Android/EAS build readiness for APK output

Shared UI primitives already introduced on mobile include:

- `ScreenContainer`
- `AppText`
- `PrimaryButton`
- `SecondaryButton`
- `Card`
- `StatusBadge`
- `EmptyState`
- `LoadingScreen`

## Onboarding and UI Polish Status

There is already a mobile onboarding flow, but the broader visual redesign/polish work is not final yet.

Important status note for the web repo AI agent:

- Feature 15 is still in progress.
- The current mobile UI should be treated as functional but not the final design target.
- A broader design-system-first polish pass is still planned across onboarding, shared primitives, loading states, empty states, error states, student screens, teacher screens, and profile/payment surfaces.

So if the web repo needs to stay aligned with current product behavior, it should reflect the implemented flows and branding changes, but it should not assume the current mobile visual style is the final long-term design system.

## Build and Release State

Mobile Feature 16 is complete.

This means the following are already done on mobile:

- Expo/EAS Android build config is in place.
- Branding metadata has been updated for **Moallem Academy**.
- Required Android metadata such as package identifier and versionCode has been prepared.
- App icon / splash / adaptive icon assets were updated.
- A real installable Android APK was built successfully.
- The APK was tested on a real Android device and confirmed launching correctly.

## Guidance for the Web Repo AI Agent

When updating the web repo, assume the following product truths from mobile:

1. The product brand name is now **Moallem Academy**.
2. Arabic-first support is required, with English as secondary.
3. RTL must be considered a core product requirement.
4. Student and teacher experiences both exist in the product scope.
5. Manual payment / access-confirmation workflow still exists at the product level.
6. The backend is not complete yet, so any claimed live sync/auth/data behavior should be described carefully.
7. The mobile app already has a real APK build working, so web-side docs should not describe the mobile app as merely conceptual.

## Suggested Web Repo Alignment Areas

The web repo may need updates in areas like:

- project overview / product description
- brand naming references
- localization notes
- RTL expectations
- shared product terminology
- teacher/student flow descriptions
- mobile companion app references
- release/readiness notes

## Short Summary

The mobile app is now a working mock-data-first product under the **Moallem Academy** brand, with Arabic-first localization, English secondary support, cleaned navigation flows, shared UI foundations, onboarding present, and a confirmed working Android APK build. The main unfinished area is Feature 15, which is the broader production-grade UI polish pass.
