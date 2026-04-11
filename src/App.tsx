import { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Section } from './components/Sections/Section';
import { Glossary } from './components/Sections/Glossary';
import { Tools } from './components/Sections/Tools';
import { MyPrompts } from './components/Sections/MyPrompts';
import { AuthModal } from './components/Admin/AuthModal';
import { ExportModal } from './components/Admin/ExportModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { exportAsJSON, exportAsMarkdown } from './utils/exportUtils';
import { preloadedGlossaryTerms, preloadedAITools, preloadedContent } from './data/preloadedData';
import type { ContentItem, GlossaryTerm, AITool, UserPrompt } from './types';

function App() {
  useTheme();
  
  const [showLogin, setShowLogin] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  const { isAuthenticated, login, logout } = useAuth();
  
  // Initialize content from local storage or preloaded data
  const [content, setContent] = useLocalStorage<ContentItem[]>('workshop-content', preloadedContent);
  const [glossaryTerms, setGlossaryTerms] = useLocalStorage<GlossaryTerm[]>('glossary-terms', preloadedGlossaryTerms);
  const [aiTools, setAITools] = useLocalStorage<AITool[]>('ai-tools', preloadedAITools);
  const [userPrompts, setUserPrompts] = useLocalStorage<UserPrompt[]>('user-prompts', []);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = useCallback((id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const navigateToSection = useCallback((id: string) => {
    setOpenSections(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Delay scroll slightly so the section content renders before scrolling
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  const handleLoginClick = () => setShowLogin(true);
  
  const handleAuthenticate = (password: string) => {
    const success = login(password);
    if (success) {
      setShowLogin(false);
    }
    return success;
  };

  // Content CRUD operations
  const handleAddItem = (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: ContentItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setContent([...content, newItem]);
  };

  const handleEditItem = (id: string, item: Partial<ContentItem>) => {
    setContent(content.map(existingItem => 
      existingItem.id === id 
        ? { ...existingItem, ...item, updatedAt: new Date().toISOString() }
        : existingItem
    ));
  };

  const handleDeleteItem = (id: string) => {
    setContent(content.filter(item => item.id !== id));
  };

  const handleReorderItems = (sectionId: string, reorderedIds: string[]) => {
    const sectionItems = content.filter(item => item.section === sectionId);
    const itemMap = new Map(sectionItems.map(item => [item.id, item]));
    const reordered = reorderedIds.map(id => itemMap.get(id)!);
    const otherItems = content.filter(item => item.section !== sectionId);
    // Merge: other items first, then reordered section items at their original position range
    const result: ContentItem[] = [];
    let otherIdx = 0;
    let reorderedIdx = 0;
    for (const item of content) {
      if (item.section !== sectionId) {
        result.push(otherItems[otherIdx++]);
      } else if (reorderedIdx < reordered.length) {
        result.push(reordered[reorderedIdx++]);
      }
    }
    setContent(result);
  };

  // Glossary CRUD operations
  const handleEditGlossaryTerm = (id: string, term: Partial<GlossaryTerm>) => {
    setGlossaryTerms(glossaryTerms.map(existingTerm =>
      existingTerm.id === id ? { ...existingTerm, ...term } : existingTerm
    ));
  };

  const handleReorderGlossaryTerms = (reorderedIds: string[]) => {
    const termMap = new Map(glossaryTerms.map(t => [t.id, t]));
    setGlossaryTerms(reorderedIds.map(id => termMap.get(id)!));
  };

  // AI Tools CRUD operations
  const handleEditAITool = (id: string, tool: Partial<AITool>) => {
    setAITools(aiTools.map(existingTool =>
      existingTool.id === id ? { ...existingTool, ...tool } : existingTool
    ));
  };

  const handleReorderAITools = (reorderedIds: string[]) => {
    const toolMap = new Map(aiTools.map(t => [t.id, t]));
    setAITools(reorderedIds.map(id => toolMap.get(id)!));
  };

  // User Prompts CRUD operations
  const handleAddPrompt = (prompt: Omit<UserPrompt, 'id' | 'createdAt'>) => {
    const newPrompt: UserPrompt = {
      ...prompt,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUserPrompts([...userPrompts, newPrompt]);
  };

  const handleEditPrompt = (id: string, prompt: Partial<UserPrompt>) => {
    setUserPrompts(userPrompts.map(existingPrompt =>
      existingPrompt.id === id ? { ...existingPrompt, ...prompt } : existingPrompt
    ));
  };

  const handleDeletePrompt = (id: string) => {
    setUserPrompts(userPrompts.filter(prompt => prompt.id !== id));
  };

  const handleReorderPrompts = (reorderedIds: string[]) => {
    const promptMap = new Map(userPrompts.map(p => [p.id, p]));
    setUserPrompts(reorderedIds.map(id => promptMap.get(id)!));
  };

  const handleExportPrompts = () => {
    setShowExport(true);
  };

  const handleExportJSON = () => {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      content,
      glossaryTerms,
      aiTools,
      userPrompts,
    };
    exportAsJSON(data, 'workshop-content.json');
  };

  const handleExportMarkdown = () => {
    const data = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      content,
      glossaryTerms,
      aiTools,
    };
    exportAsMarkdown(data, 'workshop-content.md');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={handleLoginClick}
        onLogout={logout}
        onExport={() => setShowExport(true)}
        onNavigate={navigateToSection}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 rounded-lg bg-gradient-to-r from-brand-blue-500 to-brand-orange-400 p-8 text-white">
          <h1 className="mb-2 text-3xl font-bold">
            Welcome to the Workshop Hub
          </h1>
          <p className="text-brand-blue-100">
            Your interactive learning space for exploring AI concepts, tools, and building your AI skills.
          </p>
        </div>

        <div id="mindset">
          <Section
            title="AI Mindset"
            sectionId="mindset"
            content={content}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorderItems}
            isAdmin={isAuthenticated}
            isOpen={openSections.has('mindset')}
            onToggle={() => toggleSection('mindset')}
          />
        </div>

        <div id="skillSet">
          <Section
            title="AI Skill Set"
            sectionId="skillSet"
            content={content}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorderItems}
            isAdmin={isAuthenticated}
            isOpen={openSections.has('skillSet')}
            onToggle={() => toggleSection('skillSet')}
          />
        </div>

        <div id="toolSet">
          <Section
            title="AI Tool Set"
            sectionId="toolSet"
            content={content}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorderItems}
            isAdmin={isAuthenticated}
            isOpen={openSections.has('toolSet')}
            onToggle={() => toggleSection('toolSet')}
          />
        </div>

        <div id="ai-tools">
          <Tools
            tools={aiTools}
            onEditTool={handleEditAITool}
            onReorder={handleReorderAITools}
            isAdmin={isAuthenticated}
            isOpen={openSections.has('ai-tools')}
            onToggle={() => toggleSection('ai-tools')}
          />
        </div>

        <div id="prompts-and-tools">
          <MyPrompts
            prompts={userPrompts}
            onAddPrompt={handleAddPrompt}
            onEditPrompt={handleEditPrompt}
            onDeletePrompt={handleDeletePrompt}
            onReorder={handleReorderPrompts}
            onExportPrompts={handleExportPrompts}
            isOpen={openSections.has('prompts-and-tools')}
            onToggle={() => toggleSection('prompts-and-tools')}
          />
        </div>

        <div id="glossary">
          <Glossary
            terms={glossaryTerms}
            onEditTerm={handleEditGlossaryTerm}
            onReorder={handleReorderGlossaryTerms}
            isAdmin={isAuthenticated}
            isOpen={openSections.has('glossary')}
            onToggle={() => toggleSection('glossary')}
          />
        </div>
      </main>

      <Footer />

      {showLogin && (
        <AuthModal
          onAuthenticate={handleAuthenticate}
          onLogout={() => setShowLogin(false)}
          isAuthenticated={false}
        />
      )}

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        onExportJSON={handleExportJSON}
        onExportMarkdown={handleExportMarkdown}
      />
    </div>
  );
}

export default App;