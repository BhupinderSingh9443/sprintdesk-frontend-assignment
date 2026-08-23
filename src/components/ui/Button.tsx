import {
  forwardRef,
} from 'react';

import type {
  ButtonHTMLAttributes,
} from 'react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost';

type ButtonSize =
  | 'sm'
  | 'md';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<
  ButtonVariant,
  string
> = {
  primary: `
    bg-blue-600
    text-white
    hover:bg-blue-700
    focus:ring-blue-500
  `,

  secondary: `
    border
    border-slate-300
    bg-white
    text-slate-700
    hover:bg-slate-50
    focus:ring-blue-500
    dark:border-slate-700
    dark:bg-slate-900
    dark:text-slate-200
    dark:hover:bg-slate-800
  `,

  danger: `
    bg-red-600
    text-white
    hover:bg-red-700
    focus:ring-red-500
  `,

  ghost: `
    bg-transparent
    text-slate-600
    hover:bg-slate-100
    focus:ring-blue-500
    dark:text-slate-300
    dark:hover:bg-slate-800
  `,
};

const sizeClasses: Record<
  ButtonSize,
  string
> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
};

export const Button =
  forwardRef<
    HTMLButtonElement,
    ButtonProps
  >(
    function Button(
      {
        variant = 'primary',
        size = 'md',
        loading = false,
        fullWidth = false,
        disabled,
        children,
        className = '',
        type = 'button',
        ...props
      },
      ref,
    ) {
      const isDisabled =
        disabled || loading;

      return (
        <button
          ref={ref}
          type={type}
          disabled={isDisabled}
          aria-busy={loading}
          className={`
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            font-medium
            transition
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-50

            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        >
          {loading && (
            <span
              aria-hidden="true"
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-current
                border-r-transparent
              "
            />
          )}

          {children}
        </button>
      );
    },
  );