import { useState, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Section } from './components/Sections/Section';
import { Glossary } from './components/Sections/Glossary';
import { Tools } from './components/Sections/Tools';
import { MyPrompts } from './components/Sections/MyPrompts';
import { ExportModal } from './components/Admin/ExportModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { exportAsJSON, exportAsMarkdown } from './utils/exportUtils';
import { preloadedGlossaryTerms, preloadedAITools, preloadedContent } from './data/preloadedData';
import type { ContentItem, GlossaryTerm, AITool, UserPrompt } from './types';

function App() {
  useTheme();
  
  const [showExport, setShowExport] = useState(false);
  
  const { isAuthenticated, login, logout } = useAuth();
  
  // Initialize content from local storage or preloaded data
  const [content, setContent] = useLocalStorage<ContentItem[]>('workshop-content-v3', preloadedContent);
  const [glossaryTerms, setGlossaryTerms] = useLocalStorage<GlossaryTerm[]>('glossary-terms-v2', preloadedGlossaryTerms);
  const [aiTools, setAITools] = useLocalStorage<AITool[]>('ai-tools-v2', preloadedAITools);
  const [userPrompts, setUserPrompts] = useLocalStorage<UserPrompt[]>('user-prompts', []);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<{ items: ContentItem[]; mode: 'copy' | 'move'; sourceSectionId: string } | null>(null);

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

  const handleLoginClick = () => login('');

  const handleLogout = () => {
    const hasNewContent = content.length > 0 || glossaryTerms.length > 0 || aiTools.length > 0 || userPrompts.length > 0;
    if (hasNewContent) {
      const confirmed = confirm('Remember to export your content before leaving! Server-side changes could overwrite your personal additions.\n\nClick Cancel to go back and export, or OK to logout.');
      if (!confirmed) return;
    }
    logout();
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
  const handleAddGlossaryTerm = (term: Omit<GlossaryTerm, 'id'>) => {
    const newTerm: GlossaryTerm = {
      ...term,
      id: Date.now().toString(),
    };
    setGlossaryTerms([...glossaryTerms, newTerm]);
  };

  const handleEditGlossaryTerm = (id: string, term: Partial<GlossaryTerm>) => {
    setGlossaryTerms(glossaryTerms.map(existingTerm =>
      existingTerm.id === id ? { ...existingTerm, ...term } : existingTerm
    ));
  };

  const handleReorderGlossaryTerms = (reorderedIds: string[]) => {
    const termMap = new Map(glossaryTerms.map(t => [t.id, t]));
    setGlossaryTerms(reorderedIds.map(id => termMap.get(id)!));
  };

  const handleDeleteGlossaryTerm = (id: string) => {
    setGlossaryTerms(glossaryTerms.filter(term => term.id !== id));
  };

  // AI Tools CRUD operations
  const handleAddAITool = (tool: Omit<AITool, 'id'>) => {
    const newTool: AITool = {
      ...tool,
      id: Date.now().toString(),
    };
    setAITools([...aiTools, newTool]);
  };

  const handleEditAITool = (id: string, tool: Partial<AITool>) => {
    setAITools(aiTools.map(existingTool =>
      existingTool.id === id ? { ...existingTool, ...tool } : existingTool
    ));
  };

  const handleReorderAITools = (reorderedIds: string[]) => {
    const toolMap = new Map(aiTools.map(t => [t.id, t]));
    setAITools(reorderedIds.map(id => toolMap.get(id)!));
  };

  const handleDeleteAITool = (id: string) => {
    setAITools(aiTools.filter(tool => tool.id !== id));
  };

  // Selection and clipboard operations
  const handleToggleSelect = (id: string) => {
    const item = content.find(c => c.id === id);
    if (!item) return;
    setSelectedIds(prev => {
      const next = new Set<string>();
      const currentSection = content.find(c => prev.has(c.id))?.section;
      if (currentSection && currentSection !== item.section) {
        // Switching sections — start fresh with just this item
        next.add(id);
      } else {
        prev.forEach(i => next.add(i));
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  };

  const handleSelectAll = (sectionId: string) => {
    const sectionItemIds = content.filter(c => c.section === sectionId).map(c => c.id);
    setSelectedIds(new Set(sectionItemIds));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleCopySelected = (_sectionId: string) => {
    const items = content.filter(c => selectedIds.has(c.id));
    const sourceSection = items[0]?.section || _sectionId;
    setClipboard({ items, mode: 'copy', sourceSectionId: sourceSection });
    setSelectedIds(new Set());
  };

  const handleMoveSelected = (_sectionId: string) => {
    const items = content.filter(c => selectedIds.has(c.id));
    const sourceSection = items[0]?.section || _sectionId;
    setClipboard({ items, mode: 'move', sourceSectionId: sourceSection });
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = (_sectionId: string) => {
    if (confirm(`Delete ${selectedIds.size} selected item${selectedIds.size > 1 ? 's' : ''}?`)) {
      setContent(content.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    }
  };

  const handlePasteItems = (targetSectionId: 'mindset' | 'skillSet' | 'toolSet' | 'learningResources') => {
    if (!clipboard) return;
    const newItems: ContentItem[] = clipboard.items.map((item, i) => ({
      ...item,
      id: (Date.now() + i).toString(),
      section: targetSectionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    let updated = [...content, ...newItems];
    if (clipboard.mode === 'move') {
      const movedIds = new Set(clipboard.items.map(i => i.id));
      updated = updated.filter(c => !movedIds.has(c.id));
    }
    setContent(updated);
    setClipboard(null);
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

  const handleImportContent = (data: { content?: ContentItem[]; glossaryTerms?: GlossaryTerm[]; aiTools?: AITool[]; userPrompts?: UserPrompt[] }) => {
    // Merge content: update matching IDs, add new, keep local-only
    if (data.content) {
      const importedIds = new Set(data.content.map(c => c.id));
      const localOnly = content.filter(c => !importedIds.has(c.id));
      const merged = [...localOnly, ...data.content];
      setContent(merged);
    }
    if (data.glossaryTerms) {
      const importedIds = new Set(data.glossaryTerms.map(t => t.id));
      const localOnly = glossaryTerms.filter(t => !importedIds.has(t.id));
      setGlossaryTerms([...localOnly, ...data.glossaryTerms]);
    }
    if (data.aiTools) {
      const importedIds = new Set(data.aiTools.map(t => t.id));
      const localOnly = aiTools.filter(t => !importedIds.has(t.id));
      setAITools([...localOnly, ...data.aiTools]);
    }
    if (data.userPrompts) {
      const importedIds = new Set(data.userPrompts.map(p => p.id));
      const localOnly = userPrompts.filter(p => !importedIds.has(p.id));
      setUserPrompts([...localOnly, ...data.userPrompts]);
    }
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
        onLogout={handleLogout}
        onExport={() => setShowExport(true)}
        onNavigate={navigateToSection}
        content={content}
        glossaryTerms={glossaryTerms}
        aiTools={aiTools}
        userPrompts={userPrompts}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 rounded-lg bg-gradient-to-r from-brand-blue-500 to-brand-orange-400 p-8 text-white">
          <h1 className="mb-2 text-3xl font-bold">
            Welcome to the Workshop Hub
          </h1>
          <p className="text-black">
            Your interactive learning space for exploring AI concepts, tools, and building your AI skills.
          </p>
          <p className="mt-0.5 text-black">
            All of the content is free and nothing loads on your machine.
          </p>
        </div>

        <div id="mindset">
          <Section
            title="AI Mindset" subtitle="How we think about AI" subtitleTag="durable and grounding"
            sectionId="mindset"
            content={content}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorderItems}
            isAdmin={isAuthenticated}
            selectedIds={selectedIds}
            clipboard={clipboard}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onCopySelected={handleCopySelected}
            onMoveSelected={handleMoveSelected}
            onDeleteSelected={handleDeleteSelected}
            onPasteItems={handlePasteItems}
            isOpen={openSections.has('mindset')}
            onToggle={() => toggleSection('mindset')}
          />
        </div>

        <div id="skillSet">
          <Section
            title="AI Skill Set" subtitle="What we can do with AI" subtitleTag="dynamic and transferable"
            sectionId="skillSet"
            content={content}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorderItems}
            isAdmin={isAuthenticated}
            selectedIds={selectedIds}
            clipboard={clipboard}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onCopySelected={handleCopySelected}
            onMoveSelected={handleMoveSelected}
            onDeleteSelected={handleDeleteSelected}
            onPasteItems={handlePasteItems}
            isOpen={openSections.has('skillSet')}
            onToggle={() => toggleSection('skillSet')}
          />
        </div>

        <div id="toolSet">
          <Section
            title="AI Tool Set" subtitle="What tools we use" subtitleTag="fluid and responsive"
            sectionId="toolSet"
            content={content}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorderItems}
            isAdmin={isAuthenticated}
            selectedIds={selectedIds}
            clipboard={clipboard}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onCopySelected={handleCopySelected}
            onMoveSelected={handleMoveSelected}
            onDeleteSelected={handleDeleteSelected}
            onPasteItems={handlePasteItems}
            isOpen={openSections.has('toolSet')}
            onToggle={() => toggleSection('toolSet')}
          />
        </div>

        <div id="learningResources">
          <Section
            title="Other Resources"
            sectionId="learningResources"
            content={content}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onReorder={handleReorderItems}
            isAdmin={isAuthenticated}
            selectedIds={selectedIds}
            clipboard={clipboard}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onCopySelected={handleCopySelected}
            onMoveSelected={handleMoveSelected}
            onDeleteSelected={handleDeleteSelected}
            onPasteItems={handlePasteItems}
            isOpen={openSections.has('learningResources')}
            onToggle={() => toggleSection('learningResources')}
          />
        </div>

        <div id="ai-tools">
          <Tools
            tools={aiTools}
            onAddTool={handleAddAITool}
            onEditTool={handleEditAITool}
            onDeleteTool={handleDeleteAITool}
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
            onAddTerm={handleAddGlossaryTerm}
            onEditTerm={handleEditGlossaryTerm}
            onDeleteTerm={handleDeleteGlossaryTerm}
            onReorder={handleReorderGlossaryTerms}
            isAdmin={isAuthenticated}
            isOpen={openSections.has('glossary')}
            onToggle={() => toggleSection('glossary')}
          />
        </div>
      </main>

      <Footer />

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        onExportJSON={handleExportJSON}
        onExportMarkdown={handleExportMarkdown}
        onImport={handleImportContent}
      />
    </div>
  );
}

export default App;