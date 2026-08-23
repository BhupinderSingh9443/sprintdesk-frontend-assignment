import {
  forwardRef,
  useId,
} from 'react';

import type {
  SelectHTMLAttributes,
} from 'react';

export interface SelectOption {
  label: string;
  value:
    | string
    | number;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export const Select =
  forwardRef<
    HTMLSelectElement,
    SelectProps
  >(
    function Select(
      {
        id,
        label,
        options,
        error,
        className = '',
        ...props
      },
      ref,
    ) {
      const generatedId =
        useId();

      const selectId =
        id ?? generatedId;

      const errorId =
        `${selectId}-error`;

      return (
        <div>
          <label
            htmlFor={selectId}
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

          <select
            ref={ref}
            id={selectId}
            aria-invalid={
              error
                ? true
                : undefined
            }
            aria-describedby={
              error
                ? errorId
                : undefined
            }
            className={`
              mt-2
              w-full
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-slate-900
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-100
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white

              ${className}
            `}
            {...props}
          >
            {options.map(
              (option) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {option.label}
                </option>
              ),
            )}
          </select>

          {error && (
            <p
              id={errorId}
              className="
                mt-1.5
                text-xs
                text-red-600
                dark:text-red-400
              "
            >
              {error}
            </p>
          )}
        </div>
      );
    },
  );