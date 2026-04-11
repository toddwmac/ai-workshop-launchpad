import { useState } from 'react';
import { BookOpen, ExternalLink, Edit, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import type { GlossaryTerm, GlossaryProps } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import clsx from 'clsx';

interface GlossaryPropsWithCollapse extends GlossaryProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Glossary({ terms, onEditTerm, onReorder, isAdmin, isOpen, onToggle }: GlossaryPropsWithCollapse) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | undefined>();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const filteredTerms = terms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateTerm = () => {
    if (editingTerm && editingTerm.term && editingTerm.definition && editingTerm.learnMoreUrl) {
      onEditTerm(editingTerm.id, editingTerm);
      setEditingTerm(undefined);
    }
  };

  const handleDragStart = (id: string) => { setDraggedId(id); };
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (id !== draggedId) setDragOverId(id); };
  const handleDragLeave = () => { setDragOverId(null); };
  const handleDragEnd = () => { setDraggedId(null); setDragOverId(null); };
  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) { setDraggedId(null); setDragOverId(null); return; }
    const newOrder = filteredTerms.map(t => t.id);
    const fromIdx = newOrder.indexOf(draggedId);
    const toIdx = newOrder.indexOf(targetId);
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, draggedId);
    onReorder(newOrder);
    setDraggedId(null);
    setDragOverId(null);
  };

  const showReorder = isAdmin && !searchTerm;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          {isOpen ? (
            <ChevronDown className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronRight className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          )}
          <BookOpen className="h-6 w-6 text-brand-blue-500 dark:text-brand-blue-400" />
          AI Mindset Glossary
        </button>
      </div>

      {isOpen && (
      <>
      <Input
        type="text"
        placeholder="Search terms..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 max-w-md"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTerms.map(term => (
          <div
            key={term.id}
            draggable={showReorder}
            onDragStart={() => handleDragStart(term.id)}
            onDragOver={(e) => handleDragOver(e, term.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(term.id)}
            onDragEnd={handleDragEnd}
            className={clsx(
              showReorder && 'cursor-grab active:cursor-grabbing',
              draggedId === term.id && 'opacity-40',
              dragOverId === term.id && 'ring-2 ring-brand-blue-400 rounded-lg',
            )}
          >
            {showReorder && (
              <div className="mb-1 flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <GripVertical className="h-4 w-4" />
                <span className="text-xs">Drag to reorder</span>
              </div>
            )}
          <Card hoverable={isAdmin} onClick={() => isAdmin && setEditingTerm(term)}>
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {term.term}
                </h3>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTerm(term);
                    }}
                    className="ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                {term.definition}
              </p>

              <a
                href={term.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue-500 hover:text-brand-blue-600 dark:text-brand-blue-400 dark:hover:text-brand-blue-300"
              >
                <span>Learn More</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </Card>
          </div>
        ))}
      </div>

      {editingTerm && (
        <Modal isOpen={!!editingTerm} onClose={() => setEditingTerm(undefined)} size="md">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Edit Glossary Term
            </h3>
            <div className="space-y-4">
              <Input
                label="Term"
                value={editingTerm.term}
                onChange={(e) => setEditingTerm({ ...editingTerm, term: e.target.value })}
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Definition
                </label>
                <textarea
                  value={editingTerm.definition}
                  onChange={(e) => setEditingTerm({ ...editingTerm, definition: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <Input
                label="Learn More URL"
                type="url"
                value={editingTerm.learnMoreUrl}
                onChange={(e) => setEditingTerm({ ...editingTerm, learnMoreUrl: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditingTerm(undefined)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateTerm}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      </>
      )}
    </div>
  );
}