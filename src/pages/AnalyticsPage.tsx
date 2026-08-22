import {
  PageLoader,
} from '../components/ui/PageLoader';

import {
  AnalyticsDashboard,
} from '../features/analytics/AnalyticsDashboard';

import {
  useBoardData,
} from '../features/board/useBoardData';

export default function AnalyticsPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useBoardData();

  if (isLoading) {
    return <PageLoader />;
  }

  if (
    isError ||
    !data
  ) {
    return (
      <section>
        <h2
          className="
            text-xl
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Unable to load analytics
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          SprintDesk could not load
          the analytics data.
        </p>

        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          className="
            mt-4
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
          "
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <section className="min-w-0">
      <header className="mb-6">
        <h2
          className="
            text-2xl
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          Analytics
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-600
            dark:text-slate-400
          "
        >
          Sprint performance and task insights.
        </p>
      </header>

      <AnalyticsDashboard
        sprints={data.sprints}
      />
    </section>
  );
}