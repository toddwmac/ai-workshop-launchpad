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
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Export Content
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Choose a format to export all workshop content. Exported files can be used for backup or imported into development tools.
        </p>

        <div className="space-y-3">
          <Button
            variant="secondary"
            onClick={() => {
              onExportJSON();
              onClose();
            }}
            className="w-full justify-start"
          >
            <FileJson className="mr-3 h-5 w-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">Export as JSON</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Structured format for development
              </div>
            </div>
            <Download className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              onExportMarkdown();
              onClose();
            }}
            className="w-full justify-start"
          >
            <FileText className="mr-3 h-5 w-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">Export as Markdown</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Readable format for documentation
              </div>
            </div>
            <Download className="ml-2 h-4 w-4" />
          </Button>
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