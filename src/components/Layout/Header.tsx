import { LogIn, LogOut, Download } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../UI/Button';

const navLinks = [
  { href: '#mindset', label: 'Mindset' },
  { href: '#skillSet', label: 'Skill Set' },
  { href: '#toolSet', label: 'Tool Set' },
  { href: '#learningResources', label: 'Other Resources' },
  { href: '#ai-tools', label: 'AI Tools' },
  { href: '#prompts-and-tools', label: 'My Prompts and Tools' },
  { href: '#glossary', label: 'Glossary' },
];

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onExport: () => void;
  onNavigate: (id: string) => void;
}

export function Header({ isAuthenticated, onLogin, onLogout, onExport, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/ai-workshop-launchpad/NewcomerPCLogo.jpeg"
              alt="Newcomers Club of Park City"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Newcomers AI Workshop Hub
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                by Applied AI Labs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onExport}
                className="hidden sm:flex"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Content
              </Button>
            )}

            {isAuthenticated ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>

      <nav className="border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="-mb-px flex gap-1 overflow-x-auto py-2">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => onNavigate(link.href.slice(1))}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}