# AI Workshop Demo Lab

A comprehensive, interactive web application for the Newcomers Club of Park City's AI Workshop. This demo lab provides a learning space for exploring AI concepts, tools, and building AI skills.

## Features

### Learning Sections
- **AI Mindset**: Resources and articles on developing the right mindset for AI adoption
- **AI Skill Set**: Tutorials and guides on essential AI skills like prompt engineering
- **AI Tool Set**: Information about popular AI tools and how to use them
- **My Prompts and Tools**: Personal prompt library with local storage persistence
- **Popular AI Tools**: Pre-loaded with 6 popular AI tools, categorized by type
- **AI Mindset Glossary**: Pre-loaded with 20 essential AI terminology definitions

### Section Navigation
- Sticky header with section nav bar for quick access to any section
- Collapsible sections — all default to closed; click a section title or nav link to expand
- Nav links scroll to and open the target section automatically

### Admin Features
- Password-protected admin access
- Add, edit, and delete content in all sections
- Export all workshop content (JSON or Markdown)
- Admin password: `appliedai` (for demo purposes)

### User Experience
- Light/dark theme toggle with proper icon visibility in both modes
- Fully responsive design
- Distinct section card colors (Mindset = blue, Skill Set = green, Tool Set = purple)
- Smooth scrolling with offset for sticky header

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

## Technology Stack

- **React 19** with TypeScript
- **Vite 8** for fast development builds
- **Tailwind CSS 4** for utility-first styling
- **Lucide React** for icons
- **clsx** for conditional classnames
- **State Management**: React hooks with localStorage persistence
- **Deployment**: GitHub Actions to GitHub Pages

## Project Structure

```
ai-workshop-launchpad/
├── .github/workflows/deploy.yml   # GitHub Actions deployment
├── src/
│   ├── components/
│   │   ├── Admin/                  # AuthModal, ExportModal
│   │   ├── Layout/                 # Header (with nav), Footer, ThemeToggle
│   │   ├── Sections/               # Section, ContentItem, Glossary, Tools, MyPrompts
│   │   └── UI/                     # Button, Input, Modal, Card, Tag
│   ├── data/                       # Preloaded glossary terms and AI tools
│   ├── hooks/                      # useLocalStorage, useTheme, useAuth
│   ├── types/                      # TypeScript type definitions
│   └── utils/                      # Validators, export utilities
├── index.html
├── package.json
├── vite.config.ts
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
