import { Button } from '../components/ui/Button';
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

        <Button
          className="mt-4"
          onClick={() => {
            void refetch();
          }}
        >
          Try again
        </Button>
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