import type {
  Task,
  User,
} from '../../types/domain';

interface TaskCardProps {
  task: Task;
  assignee?: User;
}

function formatDueDate(
  date: string,
): string {
  return new Intl.DateTimeFormat(
    'en-AU',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(new Date(date));
}

function getPriorityClasses(
  priority: Task['priority'],
): string {
  switch (priority) {
    case 'high':
      return `
        bg-red-50
        text-red-700
        dark:bg-red-950
        dark:text-red-300
      `;

    case 'medium':
      return `
        bg-amber-50
        text-amber-700
        dark:bg-amber-950
        dark:text-amber-300
      `;

    case 'low':
      return `
        bg-emerald-50
        text-emerald-700
        dark:bg-emerald-950
        dark:text-emerald-300
      `;
  }
}

export function TaskCard({
  task,
  assignee,
}: TaskCardProps) {
  return (
    <article
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <h3
          className="
            text-sm
            font-semibold
            leading-5
            text-slate-900
            dark:text-white
          "
        >
          {task.title}
        </h3>

        <span
          className={`
            shrink-0
            rounded-full
            px-2
            py-1
            text-xs
            font-medium
            capitalize
            ${getPriorityClasses(task.priority)}
          `}
        >
          {task.priority}
        </span>
      </div>

      <p
        className="
          mt-3
          line-clamp-2
          text-sm
          text-slate-600
          dark:text-slate-400
        "
      >
        {task.description}
      </p>

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          {assignee && (
            <>
              <img
                src={assignee.avatar}
                alt=""
                className="
                  h-7
                  w-7
                  shrink-0
                  rounded-full
                  object-cover
                "
              />

              <span
                className="
                  truncate
                  text-xs
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {assignee.name}
              </span>
            </>
          )}
        </div>

        <time
          dateTime={task.dueDate}
          className="
            shrink-0
            text-xs
            text-slate-500
            dark:text-slate-500
          "
        >
          {formatDueDate(
            task.dueDate,
          )}
        </time>
      </div>
    </article>
  );
}