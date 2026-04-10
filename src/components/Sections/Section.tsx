import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import type { ContentItem, SectionProps } from '../../types';
import { ContentItemComponent } from './ContentItem';
import { ContentForm } from './ContentForm';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';

interface SectionPropsWithCollapse extends SectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Section({ title, sectionId, content, onAddItem, onEditItem, onDeleteItem, isAdmin, isOpen, onToggle }: SectionPropsWithCollapse) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | undefined>();

  const sectionColors: Record<string, 'blue' | 'green' | 'purple'> = {
    mindset: 'blue',
    skillSet: 'green',
    toolSet: 'purple',
  };
  const colorVariant = sectionColors[sectionId];

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

  const sectionContent = content.filter(item => item.section === sectionId);

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
        </button>
        {isAdmin && isOpen && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {isOpen && (sectionContent.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No items in this section yet.
          </p>
          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowForm(true)}
              className="mt-4"
            >
              Add First Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sectionContent.map(item => (
            <ContentItemComponent
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              isAdmin={isAdmin}
              colorVariant={colorVariant}
            />
          ))}
        </div>
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