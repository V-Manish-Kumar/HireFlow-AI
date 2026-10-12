import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex items-start space-x-3 mb-6">
        {isDestructive && (
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        )}
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm transition-colors ${
            isDestructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand-600 hover:bg-brand-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
