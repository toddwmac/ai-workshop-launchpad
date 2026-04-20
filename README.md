# AI Workshop Hub

An interactive content management SPA for the Newcomers Club of Park City's AI Workshop, built by Applied AI Labs. Users browse AI learning content (mindset, skills, tools), a glossary, and popular AI tools. Admins can CRUD all content. Users have a personal prompt library persisted in localStorage.

## Features

### Learning Sections
- **AI Mindset — How we think about AI** (durable and grounding): Resources on developing the right mindset for AI adoption
- **AI Skill Set — What we can do with AI** (dynamic and transferable): Tutorials and guides on essential AI skills like prompt engineering
- **AI Tool Set — What tools we use** (fluid and responsive): Tools and presentations for hands-on AI exploration
- **Other Resources**: Additional learning materials and references
- **Popular AI Tools**: Curated collection of AI chatbots, research tools, and learning platforms (preloaded, admin-editable)
- **My Prompts and Tools**: Personal prompt library with localStorage persistence
- **AI Mindset Glossary**: Essential AI terminology definitions (sorted A–Z, admin-editable)

### Section Navigation
- Sticky header with section nav bar for quick access to any section
- Collapsible sections — all default to closed; click a section title or nav link to expand
- Nav links scroll to and open the target section automatically

### Admin Features
- No-password admin access — click "Local Admin Login" to enter admin mode
- All admin changes are local-only — cannot affect the server or other users
- Add, edit, and delete content in all sections (Mindset, Skill Set, Tool Set, Other Resources, Glossary, AI Tools)
- Drag-and-drop reordering of cards within any section (admin only)
- Multi-select copy/move/delete — select multiple cards, copy or move them to a different section, or bulk delete
- Paste copied/moved items into any other content section
- Export all workshop content as JSON or Markdown
- Markdown export includes a vibe coding prompt for building a standalone display app
- Tabbed Admin Guide (Manage Content, Copy & Move, Backup & Data, Vibe Coding) with import instructions and server update scenarios
- Content import from JSON — merges with existing local data, keeping local-only items
- Export reminder on exit

### User Experience
- Site-wide search — search across all sections, glossary, AI tools, and user prompts; click a result to navigate to it
- "Edited" badge in header when local content differs from server defaults, with a "revert" link to restore defaults
- Light/dark theme toggle with proper icon visibility in both modes
- Fully responsive design
- Distinct section card colors matching the Newcomers Club logo palette:
  - Mindset = brand blue (#3498db)
  - Skill Set = brand yellow (#f1c40f)
  - Tool Set = brand orange (#ff9f40)
  - Other Resources = teal (#c6eaf1)
- Smooth scrolling with offset for sticky header
- Content data persisted in localStorage across sessions

## Getting Started

### Prerequisites
- Node.js (v20 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/toddwmac/ai-workshop-launchpad.git
cd ai-workshop-launchpad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

The site deploys to GitHub Pages via GitHub Actions. The workflow (`.github/workflows/deploy.yml`) builds and deploys automatically on pushes to `main`.

**Setup:**
1. Go to **Settings > Pages > Build and deployment > Source** and select **GitHub Actions**
2. Push to `main` — the workflow runs automatically
3. The site is served from the build artifact (no `gh-pages` branch needed)

The Vite `base` path is configured for `/ai-workshop-launchpad/` to match the GitHub Pages URL.

## Content Update Process

Content is seeded from `src/data/preloadedData.ts` on first visit. Updates follow a JSON-based workflow:

1. Export current content via the admin Export button
2. Edit the exported JSON with updated content
3. Compare the updated JSON against `preloadedData.ts` and apply changes
4. Bump the localStorage key in `App.tsx` (e.g., `workshop-content-v3` → `v4`) so existing users see the new content
5. Run `npm run build` to verify

See `content_update_instructions.md` for detailed steps.

## Technology Stack

- **React 19** with TypeScript (strict mode, ES2023 target)
- **Vite 8** with @vitejs/plugin-react
- **Tailwind CSS 4** via @tailwindcss/postcss (CSS-based config, no config file)
- **Lucide React** for icons
- **clsx** for conditional classnames
- **State Management**: React hooks with localStorage persistence
- **Deployment**: GitHub Actions to GitHub Pages

## Architecture

### State Management

All application state lives in `App.tsx` and flows down via props. Four `useLocalStorage` hooks persist data across sessions:

- `workshop-content-v3` → `ContentItem[]` (sections: mindset, skillSet, toolSet, learningResources)
- `glossary-terms-v2` → `GlossaryTerm[]` (preloaded, A–Z sorted, admin-editable)
- `ai-tools-v2` → `AITool[]` (preloaded, admin-editable)
- `user-prompts` → `UserPrompt[]` (user-created)

Selection and clipboard state for multi-select copy/move is also managed in `App.tsx` using `Set<string>` for selected IDs and a clipboard object for copied/moved items.

### Component Organization

```
src/components/
  Layout/    — Header (with nav + admin guide), Footer, ThemeToggle
  Sections/  — Section, ContentItem, ContentForm, Glossary, Tools, MyPrompts
  Admin/     — ExportModal (AuthModal removed — no password required)
  UI/        — Button, Input, Modal, Card, Tag (reusable primitives)
```

### Data Flow Pattern

- `App.tsx` holds all CRUD handlers and passes them as callbacks to child sections
- IDs are generated via `Date.now().toString()`
- Timestamps are ISO strings (`new Date().toISOString()`)
- `src/types/index.ts` defines all interfaces — no inline types
- Content section types: `'mindset' | 'skillSet' | 'toolSet' | 'learningResources'`

### Brand Color Palette

Defined in `src/index.css` using Tailwind v4 `@theme` with shade scales (50–950):

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Blue | #3498db | Primary buttons, links, Mindset cards, focus rings |
| Brand Orange | #ff9f40 | Tool Set cards, AI Tools icon, hero gradient end |
| Brand Yellow | #f1c40f | Skill Set cards, My Prompts icon, tags |
| Brand Teal | #c6eaf1 | Other Resources cards |

### Key Hooks

- `useAuth` — no-password admin toggle (session-only)
- `useTheme` — dark/light toggle, reads system preference on mount, persists choice in localStorage
- `useLocalStorage` — generic persistence wrapper used for all data collections

## Project Structure

```
ai-workshop-launchpad/
├── .github/workflows/deploy.yml   # GitHub Actions deployment
├── public/NewcomerPCLogo.jpeg     # Club logo
├── src/
│   ├── components/
│   │   ├── Admin/                  # ExportModal
│   │   ├── Layout/                 # Header (with nav + admin guide modal), Footer, ThemeToggle
│   │   ├── Sections/               # Section, ContentItem, ContentForm, Glossary, Tools, MyPrompts
│   │   └── UI/                     # Button, Input, Modal, Card, Tag
│   ├── data/                       # preloadedData.ts (seed data)
│   ├── hooks/                      # useLocalStorage, useTheme, useAuth
│   ├── types/                      # TypeScript type definitions
│   └── utils/                      # exportUtils.ts (JSON/Markdown with vibe coding prompt)
├── content_update_instructions.md  # Content update process documentation
├── index.html
├── package.json
├── vite.config.ts                  # base path for GitHub Pages
└── postcss.config.js
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

- Built by Applied AI Labs
- Newcomers Club of Park City
