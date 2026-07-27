# EduStream Web — Project Overview

Repo: https://github.com/shoaibhajj/EduStream-web.git

## Overview

EduStream Web is the companion website for the EduStream platform. It is built with Next.js and comes after the mobile app core is stable. The website mirrors the main student and teacher flows from mobile, and it also contains the admin-only tools that do not belong in the mobile app.

This web app is a standalone project in its own repository. It does not share code with the mobile repo. Both repos connect to the same Supabase backend and the same Clerk project.

## Goals

1. Build the website after the mobile core flow is working.
2. Mirror the main student and teacher features from mobile.
3. Add admin management screens for years, subjects, teachers, and enrollment overrides.
4. Avoid dependency conflicts by keeping the web repo fully independent from the mobile repo.

## Core User Flow

### Student
1. Student signs in with Clerk.
2. Student browses Academic Years, Subjects, and Courses.
3. Student opens a course and can view preview lessons.
4. Student requests enrollment and waits for teacher confirmation.
5. Student watches unlocked lessons after confirmation.

### Teacher
1. Teacher signs in with Clerk.
2. Teacher opens dashboard.
3. Teacher creates or edits courses and lessons.
4. Teacher manages pending student enrollments.
5. Teacher publishes course content.

### Admin
1. Admin signs in.
2. Admin manages Academic Years and Subjects.
3. Admin reviews teachers and courses.
4. Admin can override enrollment statuses when needed.

## Features

### Authentication
- Clerk sign-in and sign-up.
- Role-based access.
- Clerk webhook for syncing new users to the `profiles` table.

### Student Features
- Browse years, subjects, and courses.
- Course detail page with lesson list.
- Video playback.
- Manual payment request flow.

### Teacher Features
- Dashboard.
- Course and lesson management.
- Payment confirmation.

### Admin Features
- Year management.
- Subject management.
- Overview of teachers and courses.
- Enrollment override tools.

## Scope

### In Scope
- Next.js web app.
- Clerk auth.
- Supabase database and storage.
- Shared backend with mobile.
- Admin-only screens.

### Out of Scope
- Mobile APK work.
- Payment gateway integration.
- Monorepo or shared npm workspace with mobile.

## Success Criteria

1. A mobile-created user can sign in on web and access the same backend data.
2. Web student and teacher flows reflect the same content model as mobile.
3. Admin can manage years and subjects from web.
4. `npm run build` passes without dependency conflicts.
