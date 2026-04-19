import { LogIn, LogOut, Download, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

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
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
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
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="hidden sm:flex"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Admin Guide
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onExport}
                  className="hidden sm:flex"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Content
                </Button>
              </>
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

    <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} size="lg">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Admin Guide
          </h2>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Managing Content</h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Click <strong>Add Item</strong> in any section to create a new card</li>
                <li>Hover over a card and click the edit (pencil) or delete (trash) icons</li>
                <li>Drag cards by their grip handle to reorder within a section</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Copying or Moving Cards Between Sections</h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Check the <strong>Select</strong> checkbox on one or more cards in a section</li>
                <li>A toolbar appears showing how many cards are selected</li>
                <li>Click <strong>Select All</strong> to select every card in that section, or check individual cards</li>
                <li>Click <strong>Copy</strong> to copy the selected cards, or <strong>Move</strong> to move them</li>
                <li>The selection clears and a <strong>Paste N items</strong> button appears on all other sections</li>
                <li>Go to the target section and click <strong>Paste N items</strong></li>
                <li>The cards are added to that section with new timestamps. If you chose Move, the originals are removed from the source section</li>
              </ol>
            </div>

            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Bulk Deleting Cards</h3>
              <ol className="list-inside list-decimal space-y-1">
                <li>Select one or more cards using the checkboxes</li>
                <li>Click <strong>Delete</strong> in the toolbar</li>
                <li>Confirm the deletion</li>
              </ol>
            </div>

            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Building Your Own Display App (Vibe Coding)</h3>
              <p className="mb-2">
                You can use the exported content to build your own custom display page with no coding experience. Here's how:
              </p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Click <strong>Export Content</strong> and choose <strong>Export as Markdown</strong></li>
                <li>Open the downloaded <strong>.md</strong> file in any text editor</li>
                <li>Copy the prompt at the top of the file (inside the blockquote)</li>
                <li>Paste it into one of these tools:
                  <ul className="list-inside ml-4 list-disc space-y-0.5 mt-1">
                    <li><strong>Claude</strong> (claude.ai) — start a new chat and paste</li>
                    <li><strong>Gemini</strong> (gemini.google.com) — paste into a new conversation</li>
                    <li><strong>Bolt.new</strong> (bolt.new) — paste into the prompt box</li>
                    <li><strong>VS Code</strong> with Copilot or Claude extension — open a new file and use the inline chat</li>
                    <li><strong>Cursor</strong> (cursor.com) — paste into the composer</li>
                  </ul>
                </li>
                <li>Be sure to include the data marked JSON with your prompt. Depending upon the tool you can either paste it or attach it as a text file. It does not need to be perfect, and if in doubt just ask the AI.</li>
                <li>The tool will generate a complete HTML file with your content — save it and open in any browser</li>
              </ol>
            </div>

            <div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">Saving Your Work</h3>
              <p>
                All changes are saved to your browser automatically. Before logging out, use <strong>Export Content</strong> to download a backup JSON file. Server updates may overwrite your local changes, so export regularly.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={() => setShowHelp(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}