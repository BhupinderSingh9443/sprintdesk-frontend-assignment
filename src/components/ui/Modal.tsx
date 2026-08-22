import {
    useEffect,
    useRef,
} from 'react';

import type {
    MouseEvent,
    ReactNode,
} from 'react';

interface ModalProps {
    open: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    onClose: () => void;
}

export function Modal({
    open,
    title,
    description,
    children,
    onClose,
}: ModalProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog =
            dialogRef.current;

        if (!dialog) {
            return;
        }

        if (
            open &&
            !dialog.open
        ) {
            dialog.showModal();
        }

        if (
            !open &&
            dialog.open
        ) {
            dialog.close();
        }
    }, [open]);

    function handleBackdropClick(
        event: MouseEvent<HTMLDialogElement>,
    ) {
        if (
            event.target ===
            event.currentTarget
        ) {
            dialogRef.current?.close();
        }
    }

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={handleBackdropClick}
            aria-labelledby="modal-title"
            className="
        w-[calc(100%-2rem)]
        max-w-lg
        rounded-xl
        border-0
        bg-transparent
        p-0
        backdrop:bg-slate-950/50
      "
        >
            <div
                className="
          rounded-xl
          bg-white
          shadow-2xl
          dark:bg-slate-900
        "
            >
                <header
                    className="
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-slate-200
            px-6
            py-5
            dark:border-slate-800
          "
                >
                    <div>
                        <h2
                            id="modal-title"
                            className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
                        >
                            {title}
                        </h2>

                        {description && (
                            <p
                                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Close modal"
                        onClick={() =>
                            dialogRef.current?.close()
                        }
                        className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-slate-100
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              dark:hover:bg-slate-800
            "
                    >
                        ✕
                    </button>
                </header>

                {children}
            </div>
        </dialog>
    );
}