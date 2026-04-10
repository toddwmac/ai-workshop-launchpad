# Content Update Instructions

## Overview

The hub's seed data lives in `src/data/preloadedData.ts`. This file exports three arrays that populate the app on first load (or when localStorage is cleared):

- `preloadedContent` — Content items for the Mindset, Skill Set, and Tool Set sections
- `preloadedGlossaryTerms` — Glossary terms displayed in the Glossary section
- `preloadedAITools` — AI tools displayed in the Popular AI Tools section

## Update Process

When a content update JSON file is provided (e.g., `ai-workshop-content-update.json`), follow these steps:

### 1. Compare the update JSON against `src/data/preloadedData.ts`

The JSON has this structure:
```json
{
  "content": [...],
  "glossaryTerms": [...],
  "aiTools": [...],
  "userPrompts": [...]
}
```

Compare each section field-by-field against the current preloaded data. Report all differences to the user for approval before making changes.

### 2. Apply approved changes to `src/data/preloadedData.ts`

Update the matching arrays in the file. Key rules:
- String values in TypeScript require proper escaping (e.g., single quotes in text need `\'`)
- `preloadedContent` items use `new Date().toISOString()` for `createdAt` and `updatedAt` — preserve this pattern
- `preloadedGlossaryTerms` and `preloadedAITools` use static string timestamps — copy them from the JSON as-is
- The `userPrompts` array in the JSON is user-specific data stored in localStorage — **do not** add it to preloaded data

### 3. Important note about existing users

`preloadedData.ts` only seeds data on **first visit**. Users who have already visited the site have data stored in localStorage, which takes priority. To force all users to see updated content, one of these approaches is needed:
- Change the localStorage keys in `App.tsx` (e.g., `'workshop-content'` → `'workshop-content-v2'`)
- Ask users to clear their browser's localStorage for the site
- Add a migration/version check mechanism

### 4. Verify

Run `npm run build` to confirm no TypeScript errors after the update.
