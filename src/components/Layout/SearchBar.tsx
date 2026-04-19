import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { ContentItem, GlossaryTerm, AITool, UserPrompt } from '../../types';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  sectionId: string;
  sectionLabel: string;
}

interface SearchBarProps {
  content: ContentItem[];
  glossaryTerms: GlossaryTerm[];
  aiTools: AITool[];
  userPrompts: UserPrompt[];
  onNavigate: (id: string) => void;
}

const sectionLabels: Record<string, string> = {
  mindset: 'AI Mindset',
  skillSet: 'AI Skill Set',
  toolSet: 'AI Tool Set',
  learningResources: 'Other Resources',
  'ai-tools': 'Popular AI Tools',
  'prompts-and-tools': 'My Prompts',
  glossary: 'Glossary',
};

const MAX_PER_CATEGORY = 5;
const MAX_TOTAL = 20;
const MIN_QUERY_LENGTH = 2;

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '...';
}

export function SearchBar({ content, glossaryTerms, aiTools, userPrompts, onNavigate }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      inputRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();

  if (q.length >= MIN_QUERY_LENGTH) {
    // Content items
    let count = 0;
    for (const item of content) {
      if (results.length >= MAX_TOTAL) break;
      if (count >= MAX_PER_CATEGORY) break;
      if (item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
        results.push({
          id: item.id,
          title: item.title,
          description: truncate(item.description, 80),
          sectionId: item.section,
          sectionLabel: sectionLabels[item.section] || item.section,
        });
        count++;
      }
    }

    // Glossary terms
    count = 0;
    for (const term of glossaryTerms) {
      if (results.length >= MAX_TOTAL) break;
      if (count >= MAX_PER_CATEGORY) break;
      if (term.term.toLowerCase().includes(q) || term.definition.toLowerCase().includes(q)) {
        results.push({
          id: term.id,
          title: term.term,
          description: truncate(term.definition, 80),
          sectionId: 'glossary',
          sectionLabel: sectionLabels['glossary'],
        });
        count++;
      }
    }

    // AI Tools
    count = 0;
    for (const tool of aiTools) {
      if (results.length >= MAX_TOTAL) break;
      if (count >= MAX_PER_CATEGORY) break;
      if (tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q) || tool.category.toLowerCase().includes(q)) {
        results.push({
          id: tool.id,
          title: tool.name,
          description: truncate(tool.description, 80),
          sectionId: 'ai-tools',
          sectionLabel: sectionLabels['ai-tools'],
        });
        count++;
      }
    }

    // User Prompts
    count = 0;
    for (const prompt of userPrompts) {
      if (results.length >= MAX_TOTAL) break;
      if (count >= MAX_PER_CATEGORY) break;
      if (prompt.title.toLowerCase().includes(q) || prompt.prompt.toLowerCase().includes(q)) {
        results.push({
          id: prompt.id,
          title: prompt.title,
          description: truncate(prompt.prompt, 80),
          sectionId: 'prompts-and-tools',
          sectionLabel: sectionLabels['prompts-and-tools'],
        });
        count++;
      }
    }
  }

  const handleResultClick = (sectionId: string) => {
    setIsOpen(false);
    setQuery('');
    onNavigate(sectionId);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      {isOpen ? (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search content..."
              className="w-48 rounded-md border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-blue-500 focus:outline-none focus:ring-1 focus:ring-brand-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 sm:w-64"
            />
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      )}

      {isOpen && q.length >= MIN_QUERY_LENGTH && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:w-96">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto py-1">
              {results.map(result => (
                <button
                  key={`${result.sectionId}-${result.id}`}
                  onClick={() => handleResultClick(result.sectionId)}
                  className="w-full px-4 py-2.5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {result.title}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {result.description}
                  </div>
                  <div className="mt-1 text-xs text-brand-blue-500 dark:text-brand-blue-400">
                    {result.sectionLabel}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
