import { useState } from 'react';
import { MessageSquare, Plus, Copy, Edit, Trash2, Download, ExternalLink, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import type { UserPrompt, MyPromptsProps } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Tag } from '../UI/Tag';
import clsx from 'clsx';

interface MyPromptsPropsWithCollapse extends MyPromptsProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MyPrompts({ prompts, onAddPrompt, onEditPrompt, onDeletePrompt, onReorder, onExportPrompts, isOpen, onToggle }: MyPromptsPropsWithCollapse) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<UserPrompt | undefined>();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPrompt = (prompt: UserPrompt) => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      onDeletePrompt(id);
    }
  };

  const handleDragStart = (id: string) => { setDraggedId(id); };
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (id !== draggedId) setDragOverId(id); };
  const handleDragLeave = () => { setDragOverId(null); };
  const handleDragEnd = () => { setDraggedId(null); setDragOverId(null); };
  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) { setDraggedId(null); setDragOverId(null); return; }
    const newOrder = filteredPrompts.map(p => p.id);
    const fromIdx = newOrder.indexOf(draggedId);
    const toIdx = newOrder.indexOf(targetId);
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, draggedId);
    onReorder(newOrder);
    setDraggedId(null);
    setDragOverId(null);
  };

  const showReorder = !searchTerm;

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
          <MessageSquare className="h-6 w-6 text-brand-yellow-500 dark:text-brand-yellow-400" />
          My Prompts and Tools
        </button>
        {isOpen && (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportPrompts}
              disabled={prompts.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Prompt
            </Button>
          </div>
        )}
      </div>

      {isOpen && (
      <>

      <Input
        type="text"
        placeholder="Search prompts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 max-w-md"
      />

      {filteredPrompts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
          <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No prompts match your search.' : 'No prompts yet. Create your first prompt!'}
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Prompt
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              draggable={showReorder}
              onDragStart={() => handleDragStart(prompt.id)}
              onDragOver={(e) => handleDragOver(e, prompt.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(prompt.id)}
              onDragEnd={handleDragEnd}
              className={clsx(
                showReorder && 'cursor-grab active:cursor-grabbing',
                draggedId === prompt.id && 'opacity-40',
                dragOverId === prompt.id && 'ring-2 ring-brand-blue-400 rounded-lg',
              )}
            >
            {showReorder && (
              <div className="mb-1 flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <GripVertical className="h-4 w-4" />
                <span className="text-xs">Drag to reorder</span>
              </div>
            )}
            <Card className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {prompt.title}
                    </h3>
                    <Tag variant="success" size="sm">
                      {prompt.url ? 'Link' : 'Text Only'}
                    </Tag>
                  </div>

                  <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                    <p className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                      {prompt.prompt}
                    </p>
                  </div>

                  {prompt.notes && (
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400 italic">
                      Notes: {prompt.notes}
                    </p>
                  )}

                  {prompt.url && (
                    <a
                      href={prompt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue-500 hover:text-brand-blue-600 dark:text-brand-blue-400 dark:hover:text-brand-blue-300"
                    >
                      <span>Related Link</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyPrompt(prompt)}
                    title="Copy prompt"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPrompt(prompt)}
                    title="Edit prompt"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePrompt(prompt.id)}
                    title="Delete prompt"
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {copiedId === prompt.id && (
                <div className="absolute bottom-2 right-2">
                  <Tag variant="success" size="sm">
                    Copied!
                  </Tag>
                </div>
              )}
            </Card>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} size="lg">
        <PromptForm
          onSubmit={(data) => {
            onAddPrompt(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {editingPrompt && (
        <Modal isOpen={!!editingPrompt} onClose={() => setEditingPrompt(undefined)} size="lg">
          <PromptForm
            prompt={editingPrompt}
            onSubmit={(data) => {
              onEditPrompt(editingPrompt.id, data);
              setEditingPrompt(undefined);
            }}
            onCancel={() => setEditingPrompt(undefined)}
          />
        </Modal>
      )}
      </>
      )}
    </div>
  );
}

function PromptForm({ prompt, onSubmit, onCancel }: { prompt?: UserPrompt; onSubmit: (data: Omit<UserPrompt, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [promptText, setPromptText] = useState(prompt?.prompt || '');
  const [url, setUrl] = useState(prompt?.url || '');
  const [notes, setNotes] = useState(prompt?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && promptText) {
      onSubmit({ title, prompt: promptText, url: url || undefined, notes: notes || undefined });
    }
  };

  return (
    <div className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {prompt ? 'Edit Prompt' : 'Add New Prompt'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter prompt title"
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Prompt
          </label>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Enter your prompt..."
            rows={6}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <Input
          label="Related URL (optional)"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {prompt ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </div>
  );
}