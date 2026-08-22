import type {
  ReactNode,
} from 'react';

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  description,
  children,
}: ChartCardProps) {
  return (
    <section
      className="
        min-w-0
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <header>
        <h2
          className="
            text-base
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          {title}
        </h2>

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
      </header>

      <div className="mt-6 h-72">
        {children}
      </div>
    </section>
  );
}