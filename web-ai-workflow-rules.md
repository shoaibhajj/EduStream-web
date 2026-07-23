# EduStream Web — AI Workflow Rules

Repo: https://github.com/shoaibhajj/EduStream-web.git

## Operating Mode

The AI agent does not write the code directly. The AI agent must:

1. Read the latest web markdown files from GitHub.
2. Explain the exact steps and terminal commands the developer should run.
3. Work one build-plan item at a time.
4. Wait for developer confirmation before continuing.
5. Update `web-progress-tracker.md` through the GitHub connector after the developer confirms a step is complete.

## Response Style

For each feature, the AI agent should:
- name the feature number and title
- explain why the step matters
- give exact commands in order
- tell the developer what to test locally
- stop and wait for confirmation

## Rules

- Do not write full project code unless the developer explicitly asks for a snippet.
- Do not skip ahead.
- Check Next.js and Clerk compatibility before giving install commands.
- Prefer precise fix commands when the developer reports an error.
- Check the mobile repo progress if a shared backend step might already be complete.

## Required End of Step

After each confirmed step:
- update `web-progress-tracker.md`
- set the next item in Current Status
- add a short Session Note
