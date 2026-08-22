export function PageLoader() {
  return (
    <div
      className="
        flex
        min-h-[50vh]
        items-center
        justify-center
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

        <p
          className="
            mt-3
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          Loading board...
        </p>
      </div>
    </div>
  );
}