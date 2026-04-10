import { ExternalLink, FileText, Edit, Trash2 } from 'lucide-react';
import type { ContentItem } from '../../types';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Tag } from '../UI/Tag';
import clsx from 'clsx';

interface ContentItemProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  colorVariant?: 'blue' | 'green' | 'purple';
}

export function ContentItemComponent({ item, onEdit, onDelete, isAdmin, colorVariant }: ContentItemProps) {
  return (
    <Card className="relative group" colorVariant={colorVariant}>
      {isAdmin && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            aria-label="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            aria-label="Delete"
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={clsx(
          'mt-1 rounded-lg p-2',
          item.type === 'link' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'
        )}>
          {item.type === 'link' ? (
            <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Tag variant={item.type === 'link' ? 'primary' : 'default'} size="sm">
              {item.type}
            </Tag>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {item.title}
          </h3>

          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            {item.description}
          </p>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>Visit Link</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}