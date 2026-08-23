import type {
  HTMLAttributes,
} from 'react';

interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {}

export function Skeleton({
  className = '',
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        animate-pulse
        rounded-md
        bg-slate-200
        dark:bg-slate-800

        ${className}
      `}
      {...props}
    />
  );
}