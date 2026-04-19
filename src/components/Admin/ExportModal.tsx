import { Download, FileJson, FileText } from 'lucide-react';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJSON: () => void;
  onExportMarkdown: () => void;
}

export function ExportModal({ isOpen, onClose, onExportJSON, onExportMarkdown }: ExportModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Export Content
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Choose a format to export all workshop content. Exported files can be used for backup or imported into development tools.
        </p>

        <div className="space-y-3">
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
                Structured format for development
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
                Readable format for documentation. Includes a vibe coding prompt to build a simple display app from this content.
              </div>
            </div>
            <Download className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          </button>
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
