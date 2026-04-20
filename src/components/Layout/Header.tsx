import { LogIn, LogOut, Download, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import type { ContentItem, GlossaryTerm, AITool, UserPrompt } from '../../types';

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
  onResetToDefaults: () => void;
  content: ContentItem[];
  glossaryTerms: GlossaryTerm[];
  aiTools: AITool[];
  userPrompts: UserPrompt[];
  hasEdits: boolean;
}

export function Header({ isAuthenticated, onLogin, onLogout, onExport, onNavigate, onResetToDefaults, content, glossaryTerms, aiTools, userPrompts, hasEdits }: HeaderProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [helpTab, setHelpTab] = useState<'manage' | 'move' | 'backup' | 'vibe'>('manage');

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
                by Applied AI Labs{hasEdits && <> <span className="text-xs text-amber-500 dark:text-amber-400">· edited</span> <button onClick={onResetToDefaults} className="text-xs text-gray-400 underline hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">revert</button></>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SearchBar
              content={content}
              glossaryTerms={glossaryTerms}
              aiTools={aiTools}
              userPrompts={userPrompts}
              onNavigate={onNavigate}
            />

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
                  Content Import Export
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
                Exit Admin Mode
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={onLogin}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Local Admin Login
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

          <div className="mb-4 flex border-b border-gray-200 dark:border-gray-700">
            {([
              { key: 'manage' as const, label: 'Manage Content' },
              { key: 'move' as const, label: 'Copy & Move' },
              { key: 'backup' as const, label: 'Backup & Data' },
              { key: 'vibe' as const, label: 'Vibe Coding' },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setHelpTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  helpTab === tab.key
                    ? 'border-b-2 border-brand-blue-500 text-brand-blue-600 dark:text-brand-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            {helpTab === 'manage' && (
              <>
                <p className="rounded-md bg-brand-blue-50 p-3 text-xs text-brand-blue-800 dark:bg-brand-blue-950 dark:text-brand-blue-300">
                  All changes you make in Admin Mode affect <strong>only your browser</strong>. You cannot break or change the server — experiment freely!
                </p>
                <h3 className="font-semibold text-gray-900 dark:text-white">Managing Content</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Click <strong>Add Item</strong> in any section to create a new card</li>
                  <li>Hover over a card and click the edit (pencil) or delete (trash) icons</li>
                  <li>Drag cards by their grip handle to reorder within a section</li>
                </ul>
              </>
            )}

            {helpTab === 'move' && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-white">Copying or Moving Cards Between Sections</h3>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Check the <strong>Select</strong> checkbox on one or more cards in a section</li>
                  <li>A toolbar appears showing how many cards are selected</li>
                  <li>Click <strong>Select All</strong> to select every card in that section, or check individual cards</li>
                  <li>Click <strong>Copy</strong> to copy the selected cards, or <strong>Move</strong> to move them</li>
                  <li>The selection clears and a <strong>Paste N items</strong> button appears on all other sections</li>
                  <li>Go to the target section and click <strong>Paste N items</strong></li>
                  <li>The cards are added to that section with new timestamps. If you chose Move, the originals are removed from the source section</li>
                </ol>

                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Bulk Deleting Cards</h3>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Select one or more cards using the checkboxes</li>
                  <li>Click <strong>Delete</strong> in the toolbar</li>
                  <li>Confirm the deletion</li>
                </ol>
              </>
            )}

            {helpTab === 'backup' && (
              <>
                <p className="rounded-md bg-brand-blue-50 p-3 text-xs text-brand-blue-800 dark:bg-brand-blue-950 dark:text-brand-blue-300">
                  Everything you do here stays in <strong>your browser only</strong>. You cannot damage the server or affect other users — feel free to experiment!
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-white">Exporting a Backup</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Click <strong>Content Import Export</strong> in the header</li>
                  <li>Choose <strong>Export as JSON</strong> to download a backup file</li>
                  <li>Keep this file safe — you can re-import it anytime to restore your content</li>
                </ul>

                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Importing Content</h3>
                <ul className="list-inside list-disc space-y-1">
                  <li>Click <strong>Content Import Export</strong> and choose <strong>Import from JSON</strong></li>
                  <li>Select a previously exported <strong>.json</strong> file</li>
                  <li>The import <strong>merges</strong> with your existing data: matching items are updated and any items you created locally are kept</li>
                </ul>

                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">How Server Updates Work</h3>
                <p className="mb-2">This site stores your personal additions in your browser. Here is what happens in different scenarios:</p>
                <ul className="list-inside list-disc space-y-1">
                  <li><strong>You add content locally:</strong> Your new cards are saved in your browser and persist across sessions — other users are not affected</li>
                  <li><strong>A server update is published:</strong> New or updated content from the server will replace matching items in your browser. Any cards you created that are not part of the server update are kept</li>
                  <li><strong>You export and re-import:</strong> The import merges data — your local-only items stay, and items from the file are added or updated</li>
                  <li><strong>You clear browser data:</strong> All local changes are lost. This is why regular exports are recommended</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Tip: Export a JSON backup before and after making significant changes.
                </p>
              </>
            )}

            {helpTab === 'vibe' && (
              <>
                <h3 className="font-semibold text-gray-900 dark:text-white">Building Your Own Display App</h3>
                <p className="mb-2">
                  You can use the exported content to build a custom display page with no coding experience:
                </p>
                <ol className="list-inside list-decimal space-y-1">
                  <li>Click <strong>Content Import Export</strong> and choose <strong>Export as Markdown</strong></li>
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
              </>
            )}
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
