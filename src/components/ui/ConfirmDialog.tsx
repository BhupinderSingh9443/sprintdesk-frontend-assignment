import {
  Modal,
} from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
    >
      <div
        className="
          flex
          justify-end
          gap-3
          p-6
        "
      >
        <button
          type="button"
          onClick={onCancel}
          className="
            rounded-lg
            border
            border-slate-300
            px-4
            py-2
            text-sm
            font-medium
            dark:border-slate-700
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="
            rounded-lg
            bg-red-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            hover:bg-red-700
            focus:outline-none
            focus:ring-2
            focus:ring-red-500
          "
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}