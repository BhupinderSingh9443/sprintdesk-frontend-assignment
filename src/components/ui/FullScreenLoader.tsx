export function FullScreenLoader() {
  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
        dark:bg-slate-950
      "
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div
          className="
            mx-auto
            h-8
            w-8
            animate-spin
            rounded-full
            border-4
            border-slate-200
            border-t-blue-600
            dark:border-slate-800
            dark:border-t-blue-400
          "
        />

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Loading SprintDesk...
        </p>
      </div>
    </div>
  );
}