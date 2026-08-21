export function FullScreenLoader() {
  return (
    <div
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
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
          "
        />

        <p className="mt-4 text-sm text-slate-600">
          Loading SprintDesk...
        </p>
      </div>
    </div>
  );
}