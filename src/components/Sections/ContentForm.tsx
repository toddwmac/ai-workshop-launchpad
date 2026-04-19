import { useState } from 'react';
import { X } from 'lucide-react';
import type { ContentItem } from '../../types';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';

interface ContentFormProps {
  item?: ContentItem;
  sectionId: 'mindset' | 'skillSet' | 'toolSet' | 'learningResources';
  onSubmit: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ContentForm({ item, sectionId, onSubmit, onCancel }: ContentFormProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [url, setUrl] = useState(item?.url || '');
  const [type, setType] = useState<'link' | 'text'>(item?.type || 'link');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    if (type === 'link' && !url.trim()) {
      setError('URL is required for link items');
      return;
    }

    onSubmit({
      type,
      title: title.trim(),
      description: description.trim(),
      url: type === 'link' ? url.trim() : undefined,
      section: sectionId,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item ? 'Edit Content' : 'Add New Content'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          aria-label="Cancel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === 'link' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setType('link')}
          >
            Link
          </Button>
          <Button
            type="button"
            variant={type === 'text' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setType('text')}
          >
            Text
          </Button>
        </div>

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          error={error && !title.trim() ? error : undefined}
        />

        {type === 'link' && (
          <Input
            label="URL"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            error={error && type === 'link' && !url.trim() ? error : undefined}
          />
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={4}
            className={clsx(
              'flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
              'placeholder:text-gray-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-500 focus-visible:ring-offset-2',
              'dark:border-gray-600 dark:bg-gray-800 dark:text-white',
              error && !description.trim() && 'border-red-500 focus-visible:ring-red-500'
            )}
          />
          {error && !description.trim() && (
            <span className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</span>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {item ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function clsx(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}