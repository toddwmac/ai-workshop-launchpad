import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, GripVertical, Clipboard, ClipboardPaste, Trash2 } from 'lucide-react';
import type { ContentItem, SectionProps } from '../../types';
import { ContentItemComponent } from './ContentItem';
import { ContentForm } from './ContentForm';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import clsx from 'clsx';

interface SectionPropsWithCollapse extends SectionProps {
  isOpen: boolean;
  onToggle: () => void;
  onReorder: (sectionId: string, reorderedIds: string[]) => void;
  subtitle?: string;
  subtitleTag?: string;
}

export function Section({
  title, sectionId, content, onAddItem, onEditItem, onDeleteItem, onReorder, isAdmin,
  isOpen, onToggle, subtitle, subtitleTag,
  selectedIds, clipboard, onToggleSelect, onSelectAll, onClearSelection,
  onCopySelected, onMoveSelected, onDeleteSelected, onPasteItems
}: SectionPropsWithCollapse) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | undefined>();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const sectionColors: Record<string, 'blue' | 'green' | 'purple' | 'teal'> = {
    mindset: 'blue',
    skillSet: 'green',
    toolSet: 'purple',
    learningResources: 'teal',
  };
  const colorVariant = sectionColors[sectionId];

  const sectionContent = content.filter(item => item.section === sectionId);
  const sectionSelectedCount = sectionContent.filter(item => selectedIds.has(item.id)).length;
  const hasSelection = sectionSelectedCount > 0;
  const canPaste = clipboard !== null && clipboard.sourceSectionId !== sectionId;

  const handleAddItem = (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddItem(item);
    setShowForm(false);
  };

  const handleEditItem = (item: ContentItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (updates: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingItem) {
      onEditItem(editingItem.id, updates);
      setEditingItem(undefined);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDeleteItem(id);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== draggedId) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    const newOrder = sectionContent.map(item => item.id);
    const fromIdx = newOrder.indexOf(draggedId);
    const toIdx = newOrder.indexOf(targetId);
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, draggedId);

    onReorder(sectionId, newOrder);
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

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
          {title}
          {subtitle && (
            <span className="text-lg font-normal text-gray-700 dark:text-gray-300">
              — {subtitle} <span className="italic">({subtitleTag})</span>
            </span>
          )}
        </button>
        {isAdmin && isOpen && (
          <div className="flex gap-2">
            {canPaste && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onPasteItems(sectionId)}
              >
                <ClipboardPaste className="mr-2 h-4 w-4" />
                Paste {clipboard.items.length} item{clipboard.items.length > 1 ? 's' : ''}
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        )}
      </div>

      {isOpen && (sectionContent.length === 0 && !canPaste ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No items in this section yet.
          </p>
          {isAdmin && (
            <div className="mt-4 flex justify-center gap-2">
              {canPaste && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onPasteItems(sectionId)}
                >
                  <ClipboardPaste className="mr-2 h-4 w-4" />
                  Paste {clipboard!.items.length} item{clipboard!.items.length > 1 ? 's' : ''}
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowForm(true)}
              >
                Add First Item
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          {isAdmin && hasSelection && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-brand-blue-50 px-4 py-2 dark:bg-brand-blue-950">
              <span className="text-sm font-medium text-brand-blue-700 dark:text-brand-blue-300">
                {sectionSelectedCount} selected
              </span>
              <Button size="sm" variant="ghost" onClick={() => onSelectAll(sectionId)}>
                Select All
              </Button>
              <Button size="sm" variant="primary" onClick={() => onCopySelected(sectionId)}>
                <Clipboard className="mr-1 h-3.5 w-3.5" />
                Copy
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onMoveSelected(sectionId)}>
                Move
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDeleteSelected(sectionId)}>
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={onClearSelection}>
                Cancel
              </Button>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sectionContent.map(item => (
              <div
                key={item.id}
                draggable={isAdmin && !hasSelection}
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(item.id)}
                onDragEnd={handleDragEnd}
                className={clsx(
                  isAdmin && !hasSelection && 'cursor-grab active:cursor-grabbing',
                  draggedId === item.id && 'opacity-40',
                  dragOverId === item.id && 'ring-2 ring-brand-blue-400 rounded-lg',
                )}
              >
                {isAdmin && !hasSelection && (
                  <div className="mb-1 flex items-center gap-1 text-gray-400 dark:text-gray-500">
                    <GripVertical className="h-4 w-4" />
                    <span className="text-xs">Drag to reorder</span>
                  </div>
                )}
                <ContentItemComponent
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  isAdmin={isAdmin}
                  colorVariant={colorVariant}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={onToggleSelect}
                />
              </div>
            ))}
          </div>
        </>
      ))}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} size="lg">
        <ContentForm
          sectionId={sectionId}
          onSubmit={handleAddItem}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {editingItem && (
        <Modal isOpen={!!editingItem} onClose={() => setEditingItem(undefined)} size="lg">
          <ContentForm
            item={editingItem}
            sectionId={sectionId}
            onSubmit={handleUpdateItem}
            onCancel={() => setEditingItem(undefined)}
          />
        </Modal>
      )}
    </div>
  );
}
