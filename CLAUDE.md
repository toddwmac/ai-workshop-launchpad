# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Workshop Demo Lab — an interactive content management SPA for the Newcomers Club of Park City's AI Workshop, built by Applied AI Labs. Users browse AI learning content (mindset, skills, tools), a glossary, and popular AI tools. Admins can CRUD all content. Users have a personal prompt library persisted in localStorage.

## Commands

```bash
npm run dev       # Start dev server on localhost:5173
npm run build     # TypeScript check (tsc) then Vite build to dist/
npm run preview   # Preview production build
```

No test runner is configured.

## Tech Stack

- React 19 + TypeScript 6 (strict mode, ES2023 target)
- Vite 8 with @vitejs/plugin-react
- Tailwind CSS 4 via @tailwindcss/postcss (no config file — uses CSS-based config)
- Lucide React for icons, clsx for conditional classes
- No router — single-page app with all sections rendered on one page

## Architecture

### State Management

All application state lives in `App.tsx` and flows down via props (no Context API despite what README says). Four `useLocalStorage` hooks persist data across sessions:

- `workshop-content` → `ContentItem[]` (sections: mindset, skillSet, toolSet)
- `glossary-terms` → `GlossaryTerm[]` (preloaded with 20 AI terms)
- `ai-tools` → `AITool[]` (preloaded with 6 tools)
- `user-prompts` → `UserPrompt[]` (user-created)

The `useLocalStorage` hook (`src/hooks/useLocalStorage.ts`) is a generic wrapper that reads from localStorage on init and writes on every state update.

### Component Organization

```
src/components/
  Layout/    — Header, Footer, ThemeToggle
  Sections/  — Section, ContentItem, ContentForm, Glossary, GlossaryItem, Tools, ToolCard, MyPrompts, PromptForm
  Admin/     — AuthModal, ExportModal
  UI/        — Button, Input, Modal, Card, Tag (reusable primitives)
```

### Data Flow Pattern

- `App.tsx` holds all CRUD handlers and passes them as callbacks to child sections
- IDs are generated via `Date.now().toString()`
- Timestamps are ISO strings (`new Date().toISOString()`)
- `src/types/index.ts` defines all interfaces — no inline types

### Key Hooks

- `useAuth` — simple password check (admin password: `appliedai`), session-only (no persistence)
- `useTheme` — dark/light toggle, reads system preference on mount, persists choice in localStorage
- `useLocalStorage` — generic persistence wrapper used for all data collections

### Data Seeding

`src/data/preloadedData.ts` exports `preloadedGlossaryTerms`, `preloadedAITools`, and `preloadedContent`. These are used as default values in `useLocalStorage` — they only seed on first load (when localStorage is empty).

### Export System

`src/utils/exportUtils.ts` provides `exportAsJSON` and `exportAsMarkdown` for downloading workshop content. Triggered via ExportModal from admin header.

## Styling

- Tailwind utility classes throughout — no custom CSS modules or styled-components
- Dark mode via CSS class toggling (`dark:` prefix), not media query
- Source maps enabled in production build (`vite.config.ts`)

## Deployment

Static site — the `dist/` directory contains a self-contained build deployable to any static host (GitHub Pages, Netlify, Vercel). No server-side requirements.
