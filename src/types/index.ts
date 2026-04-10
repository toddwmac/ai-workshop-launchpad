// Content Item - Represents any addable/editable content
export interface ContentItem {
  id: string;
  type: 'link' | 'text';
  title: string;
  description: string;
  url?: string; // For link items
  section: 'mindset' | 'skillSet' | 'toolSet';
  createdAt: string;
  updatedAt: string;
}

// Glossary Term - For AI Mindset Glossary
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  learnMoreUrl: string;
}

// AI Tool - For Popular AI Tools section
export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
}

// User Prompt - For My Prompts section
export interface UserPrompt {
  id: string;
  title: string;
  prompt: string;
  url?: string;
  notes?: string;
  createdAt: string;
}

// Application State
export interface AppState {
  content: ContentItem[];
  glossaryTerms: GlossaryTerm[];
  aiTools: AITool[];
  userPrompts: UserPrompt[];
  theme: 'light' | 'dark';
  isAdmin: boolean;
  isAuthenticated: boolean;
}

// Export Data Structure
export interface ExportData {
  version: string;
  exportDate: string;
  content: ContentItem[];
  glossaryTerms: GlossaryTerm[];
  aiTools: AITool[];
}

// Section Component Props
export interface SectionProps {
  title: string;
  sectionId: 'mindset' | 'skillSet' | 'toolSet';
  content: ContentItem[];
  onAddItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditItem: (id: string, item: Partial<ContentItem>) => void;
  onDeleteItem: (id: string) => void;
  isAdmin: boolean;
}

// Glossary Component Props
export interface GlossaryProps {
  terms: GlossaryTerm[];
  onEditTerm: (id: string, term: Partial<GlossaryTerm>) => void;
  isAdmin: boolean;
}

// Tools Component Props
export interface ToolsProps {
  tools: AITool[];
  onEditTool: (id: string, tool: Partial<AITool>) => void;
  isAdmin: boolean;
}

// MyPrompts Component Props
export interface MyPromptsProps {
  prompts: UserPrompt[];
  onAddPrompt: (prompt: Omit<UserPrompt, 'id' | 'createdAt'>) => void;
  onEditPrompt: (id: string, prompt: Partial<UserPrompt>) => void;
  onDeletePrompt: (id: string) => void;
  onExportPrompts: () => void;
}

// Auth Component Props
export interface AuthProps {
  onAuthenticate: (password: string) => boolean;
  onLogout: () => void;
  isAuthenticated: boolean;
}