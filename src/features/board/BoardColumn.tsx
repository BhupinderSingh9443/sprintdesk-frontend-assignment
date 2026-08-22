import type {
    Task,
    TaskStatus,
    User,
} from '../../types/domain';

import {
    TaskCard,
} from './TaskCard';

import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
    useDroppable,
} from '@dnd-kit/core';

interface BoardColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    usersById: Map<number, User>;
}

export function BoardColumn({
    title,
    status,
    tasks,
    usersById,
}: BoardColumnProps) {
    const sortedTasks = [...tasks].sort(
        (a, b) => a.order - b.order,
    );

    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: `column-${status}`,
    });

    return (
        <section
            ref={setNodeRef}
            aria-labelledby={`column-${status}`}
            className={`
    min-w-[280px]
    rounded-xl
    p-3
    transition-colors
    dark:bg-slate-900/60

    ${isOver
                    ? 'bg-blue-50 dark:bg-blue-950/40'
                    : 'bg-slate-100'
                }
  `}
        >
            <header
                className="
          mb-3
          flex
          items-center
          justify-between
          px-1
        "
            >
                <h2
                    id={`column-${status}`}
                    className="
            text-sm
            font-semibold
            text-slate-800
            dark:text-slate-200
          "
                >
                    {title}
                </h2>

                <span
                    className="
            rounded-full
            bg-slate-200
            px-2
            py-0.5
            text-xs
            font-medium
            text-slate-700
            dark:bg-slate-800
            dark:text-slate-300
          "
                    aria-label={`${tasks.length} tasks`}
                >
                    {tasks.length}
                </span>
            </header>

            <SortableContext
                items={sortedTasks.map(
                    (task) => task.id,
                )}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-3">
                    {sortedTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            assignee={
                                usersById.get(
                                    task.assigneeId,
                                )
                            }
                        />
                    ))}

                    {sortedTasks.length === 0 && (
                        <p
                            className="
          rounded-lg
          border
          border-dashed
          border-slate-300
          p-4
          text-center
          text-sm
          text-slate-500
          dark:border-slate-700
        "
                        >
                            Drop tasks here
                        </p>
                    )}
                </div>
            </SortableContext>
        </section>
    );
}