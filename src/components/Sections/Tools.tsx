import { useState } from 'react';
import { Wrench, ExternalLink, Edit, Tag as TagIcon, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import type { AITool, ToolsProps } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Tag } from '../UI/Tag';
import clsx from 'clsx';

interface ToolsPropsWithCollapse extends ToolsProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Tools({ tools, onEditTool, onReorder, isAdmin, isOpen, onToggle }: ToolsPropsWithCollapse) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTool, setEditingTool] = useState<AITool | undefined>();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateTool = () => {
    if (editingTool && editingTool.name && editingTool.description && editingTool.url && editingTool.category) {
      onEditTool(editingTool.id, editingTool);
      setEditingTool(undefined);
    }
  };

  const handleDragStart = (id: string) => { setDraggedId(id); };
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (id !== draggedId) setDragOverId(id); };
  const handleDragLeave = () => { setDragOverId(null); };
  const handleDragEnd = () => { setDraggedId(null); setDragOverId(null); };
  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) { setDraggedId(null); setDragOverId(null); return; }
    const newOrder = filteredTools.map(t => t.id);
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
          <Wrench className="h-6 w-6 text-brand-orange-500 dark:text-brand-orange-400" />
          Popular AI Tools
        </button>
      </div>

      {isOpen && (
      <>
      <Input
        type="text"
        placeholder="Search tools..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 max-w-md"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            draggable={showReorder}
            onDragStart={() => handleDragStart(tool.id)}
            onDragOver={(e) => handleDragOver(e, tool.id)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(tool.id)}
            onDragEnd={handleDragEnd}
            className={clsx(
              showReorder && 'cursor-grab active:cursor-grabbing',
              draggedId === tool.id && 'opacity-40',
              dragOverId === tool.id && 'ring-2 ring-brand-blue-400 rounded-lg',
            )}
          >
            {showReorder && (
              <div className="mb-1 flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <GripVertical className="h-4 w-4" />
                <span className="text-xs">Drag to reorder</span>
              </div>
            )}
          <Card hoverable={isAdmin} onClick={() => isAdmin && setEditingTool(tool)}>
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-start justify-between">
                <h3 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTool(tool);
                    }}
                    className="ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mb-3">
                <Tag variant="secondary" size="sm" className="mb-2">
                  <TagIcon className="mr-1 h-3 w-3" />
                  {tool.category}
                </Tag>
              </div>

              <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>

              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue-500 hover:text-brand-blue-600 dark:text-brand-blue-400 dark:hover:text-brand-blue-300"
              >
                <span>Visit Tool</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </Card>
          </div>
        ))}
      </div>

      {editingTool && (
        <Modal isOpen={!!editingTool} onClose={() => setEditingTool(undefined)} size="md">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Edit AI Tool
            </h3>
            <div className="space-y-4">
              <Input
                label="Tool Name"
                value={editingTool.name}
                onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
              />
              <Input
                label="Category"
                value={editingTool.category}
                onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={editingTool.description}
                  onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <Input
                label="Tool URL"
                type="url"
                value={editingTool.url}
                onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditingTool(undefined)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateTool}>
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
