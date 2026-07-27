# EduStream Web — Build Plan

Repo: https://github.com/shoaibhajj/EduStream-web.git

## Core Principle

Start this repo only after the mobile repo core is working. Build the web foundation first, then mirror student and teacher flows, then add the admin tools.

---

## Phase 1 — Web Foundation

### 01 Create Next.js Project
- Create a clean Next.js app with App Router, TypeScript, and Tailwind.
- Push first clean commit.

### 02 Install Core Dependencies
- Install Clerk, Supabase, Tailwind/shadcn, validation, and player libraries.
- Check compatibility before installing.

### 03 Setup Clerk and Webhook
- Configure Clerk provider.
- Add middleware.
- Add webhook route for syncing `profiles`.

### 04 Setup Supabase Clients
- Configure browser and server Supabase clients.
- Confirm shared backend access.

---

## Phase 2 — Student and Teacher Flows

### 05 Student Browse Flow
- Years, subjects, courses, course detail, watch page.

### 06 Teacher Dashboard Flow
- Dashboard, course management, lesson management, enrollment handling.

### 07 Video Playback and Protection
- `react-player`
- Signed lesson URL access through shared backend logic.

---

## Phase 3 — Admin Tools

### 08 Years and Subjects Management
- Admin can create, rename, and reorder years and subjects.

### 09 Admin Overview
- Admin can review teachers, courses, and override enrollment statuses.

---

## Phase 4 — Polish

### 10 Empty and Loading States Audit
- Verify empty states and loading states across the app.
