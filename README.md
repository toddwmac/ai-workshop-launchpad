# AI Workshop Demo Lab

A comprehensive, interactive web application for the Newcomers Club of Park City's AI Workshop. This demo lab provides a learning space for exploring AI concepts, tools, and building AI skills.

## Features

### 🎓 Learning Sections
- **AI Mindset**: Resources and articles on developing the right mindset for AI adoption
- **AI Skill Set**: Tutorials and guides on essential AI skills like prompt engineering
- **AI Tool Set**: Information about popular AI tools and how to use them

### 📚 Glossary
- Pre-loaded with 20 essential AI terminology definitions
- Each term includes definitions and links to learn more
- Searchable interface for quick reference

### 🛠️ Popular AI Tools
- Pre-loaded with 6 popular AI tools
- Categorized by type (Chatbot, Image Generation, Code Assistance, Research)
- Direct links to each tool

### 💬 My Prompts
- Personal prompt library with local storage persistence
- Create, edit, and delete your own prompts
- Copy prompts to clipboard with one click
- Export prompts to JSON or Markdown formats

### 🔐 Admin Features
- Password-protected admin access
- Add, edit, and delete content in all sections
- Export all workshop content (JSON or Markdown)
- Admin password: `appliedai` (for demo purposes)

### 🎨 User Experience
- Light/dark theme toggle
- Fully responsive design
- Modern, accessible UI components
- Smooth animations and transitions

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

## Project Structure

```
ai-workshop-launchpad/
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AuthModal.tsx
│   │   │   └── ExportModal.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── Sections/
│   │   │   ├── Section.tsx
│   │   │   ├── ContentItem.tsx
│   │   │   ├── ContentForm.tsx
│   │   │   ├── Glossary.tsx
│   │   │   ├── Tools.tsx
│   │   │   └── MyPrompts.tsx
│   │   └── UI/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Card.tsx
│   │       └── Tag.tsx
│   ├── data/
│   │   └── preloadedData.ts
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useTheme.ts
│   │   └── useAuth.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   └── exportUtils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Persistence**: Local Storage API
- **Deployment**: Static site (suitable for GitHub Pages, Netlify, etc.)

## Key Components

### Custom Hooks

- `useLocalStorage`: Generic hook for persisting state in localStorage
- `useTheme`: Manages light/dark theme with system preference detection
- `useAuth`: Handles admin authentication and session management

### UI Components

All UI components follow a consistent design system with:
- TypeScript prop interfaces
- Accessible attributes (ARIA labels, keyboard navigation)
- Responsive design with mobile-first approach
- Dark mode support
- Tailwind CSS for styling

## Content Management

### Admin Access
1. Click "Admin Login" in the header
2. Enter password: `appliedai`
3. You'll see edit/delete buttons appear throughout the app

### Adding Content
1. Log in as admin
2. Navigate to any section
3. Click "Add Item" or "Add Prompt" button
4. Fill in the form and submit

### Editing Content
1. Log in as admin
2. Hover over any item to see edit/delete buttons
3. Click the edit icon to modify content
4. Save changes

### Exporting Content
1. Log in as admin
2. Click "Export Content" in the header
3. Choose JSON or Markdown format
4. File will download automatically

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Notes

### Type Safety
The project uses TypeScript with strict type checking. All components have defined prop interfaces and the type definitions are centralized in `src/types/index.ts`.

### Styling Approach
- Tailwind CSS for utility-first styling
- Consistent design tokens (colors, spacing, typography)
- Dark mode implemented using CSS classes and Tailwind's dark mode support

### State Management
- React's built-in hooks for component state
- Local storage for persistence across sessions
- Context API for global state (theme, auth)

### Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance

## Deployment

### GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist` directory to GitHub
3. Configure GitHub Pages to serve from the `dist` directory

### Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your Git repository for automatic deployments

### Vercel
1. Build the project: `npm run build`
2. Connect your Git repository
3. Vercel will automatically deploy when you push changes

## Contributing

This is a demonstration project for the Newcomers Club of Park City. For questions or suggestions, please contact Applied AI Labs.

## License

© 2024 Newcomers Club of Park City. All rights reserved.

## Credits

- Built by Applied AI Labs
- Powered by modern web technologies
- Designed for learning and community engagement

## Support

For technical support or questions about the AI Workshop Demo Lab, please visit [Applied AI Labs](https://www.centerforappliedai.com).