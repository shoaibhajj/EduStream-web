# EduStream Web — UI Context

Repo: https://github.com/shoaibhajj/EduStream-web.git

## Design Tokens

Use Tailwind v4 tokens through `@theme` in `globals.css`.

```css
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

## Layout Rules

- Student and teacher pages use a clean top-navbar layout.
- Admin pages may use a left sidebar layout.
- Main content should stay readable and clean, not crowded.

## Typography

- Section title: 16px / 600 / primary text.
- Body text: 14px / 500 / primary text.
- Secondary text: 12px / 400 / muted text.
- Price: 18px / 700 / accent.

## Component Rules

### Cards
- `bg-surface border border-border rounded-xl p-6`

### Primary Button
- `bg-accent text-white rounded-md px-4 py-2 font-medium`

### Secondary Button
- `bg-surface border border-border text-text-primary rounded-md px-4 py-2`

### Badges
- Preview, confirmed, pending, and locked states should match the product meaning clearly.

## Video Player Rules

- Use `react-player`.
- Keep the player in a 16:9 container.
- Add basic protection like disabling obvious download affordances where possible.

## Empty States

Every empty table, list, or page should have:
- short descriptive text
- optional icon
- CTA if there is a next action

## Do Nots

- Do not use raw Tailwind default colors.
- Do not hardcode random hex values in components.
- Do not make admin UI visually inconsistent with the student/teacher product.
