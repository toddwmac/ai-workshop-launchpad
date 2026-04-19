import { useRef, useState } from 'react';
import { Download, FileJson, FileText, Upload } from 'lucide-react';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportMarkdown: () => void;
  onImport: (data: any) => void;
}

export function ExportModal({ isOpen, onClose, onExportJSON, onExportMarkdown, onImport }: ExportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setImportError('Please select a .json file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data.content && !data.glossaryTerms && !data.aiTools && !data.userPrompts) {
          setImportError('This file does not appear to be a valid workshop export.');
          return;
        }

        const contentCount = data.content?.length || 0;
        const glossaryCount = data.glossaryTerms?.length || 0;
        const toolsCount = data.aiTools?.length || 0;
        const promptsCount = data.userPrompts?.length || 0;
        const total = contentCount + glossaryCount + toolsCount + promptsCount;

        if (confirm(
          `Import ${total} items?\n\n` +
          `${contentCount} content items, ${glossaryCount} glossary terms, ${toolsCount} AI tools, ${promptsCount} prompts.\n\n` +
          `Matching items will be updated. Your local-only items will be kept.`
        )) {
          onImport(data);
          onClose();
        }
      } catch {
        setImportError('Could not read the file. Make sure it is valid JSON.');
      }
    };
    reader.readAsText(file);

    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Export & Import Content
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Export your content for backup, or import content from a previously exported file.
        </p>

        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Export
        </h3>
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => {
              onExportJSON();
              onClose();
            }}
            className="flex w-full items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
          >
            <FileJson className="mt-0.5 h-5 w-5 shrink-0 text-gray-600 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white">Export as JSON</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Structured format for development and re-import
              </div>
            </div>
            <Download className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              onExportMarkdown();
              onClose();
            }}
            className="flex w-full items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
          >
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gray-600 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white">Export as Markdown</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Readable format with vibe coding prompt to build a display app
              </div>
            </div>
            <Download className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          </button>
        </div>

        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Import
        </h3>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-start gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-4 text-left transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-750"
          >
            <Upload className="mt-0.5 h-5 w-5 shrink-0 text-gray-600 dark:text-gray-400" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white">Import from JSON</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Import a previously exported .json file. Matching items are updated; your local-only items are kept.
              </div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          {importError && (
            <p className="text-xs text-red-600 dark:text-red-400">{importError}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
