import {
  forwardRef,
  useId,
} from 'react';

import type {
  InputHTMLAttributes,
} from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input =
  forwardRef<
    HTMLInputElement,
    InputProps
  >(
    function Input(
      {
        id,
        label,
        error,
        helperText,
        className = '',
        ...props
      },
      ref,
    ) {
      const generatedId =
        useId();

      const inputId =
        id ?? generatedId;

      const messageId =
        `${inputId}-message`;

      const hasMessage =
        Boolean(
          error ||
          helperText,
        );

      return (
        <div>
          <label
            htmlFor={inputId}
            className="
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
          >
            {label}
          </label>

          <input
            ref={ref}
            id={inputId}
            aria-invalid={
              error
                ? true
                : undefined
            }
            aria-describedby={
              hasMessage
                ? messageId
                : undefined
            }
            className={`
              mt-2
              w-full
              rounded-lg
              border
              bg-white
              px-3
              py-2
              text-slate-900
              outline-none
              transition
              focus:ring-2
              dark:bg-slate-950
              dark:text-white

              ${
                error
                  ? `
                    border-red-500
                    focus:border-red-500
                    focus:ring-red-100
                  `
                  : `
                    border-slate-300
                    focus:border-blue-500
                    focus:ring-blue-100
                    dark:border-slate-700
                  `
              }

              ${className}
            `}
            {...props}
          />

          {hasMessage && (
            <p
              id={messageId}
              className={`
                mt-1.5
                text-xs

                ${
                  error
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-500 dark:text-slate-400'
                }
              `}
            >
              {error ??
                helperText}
            </p>
          )}
        </div>
      );
    },
  );