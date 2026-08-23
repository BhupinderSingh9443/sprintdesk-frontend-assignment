import type {
    Task,
    User,
} from '../../types/domain';
import {
    useSortable,
} from '@dnd-kit/sortable';

import {
    CSS,
} from '@dnd-kit/utilities';
import { memo } from 'react';

interface TaskCardProps {
    task: Task;
    assignee?: User;
    onOpen: (
        taskId: number,
    ) => void;
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

function TaskCardComponent({
    task,
    assignee,
    onOpen,
}: TaskCardProps) {


    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(
            transform,
        ),
        transition,
    };


    return (
        <article
            ref={setNodeRef}
            style={style}
            className={`
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
            shadow-sm
            transition-shadow
            hover:shadow-md
            dark:border-slate-800
            dark:bg-slate-900
            ${isDragging
                    ? 'opacity-50'
                    : ''
                }
  `}
        >
            <div
                className="
          flex
          items-start
          justify-between
          gap-3
        "
            >

                <button
                    type="button"
                    onClick={() => onOpen(task.id)}
                    {...attributes}
                    {...listeners}
                    aria-label={`Drag ${task.title}`}
                    className="
                    cursor-grab
                    rounded
                    px-2
                    py-1
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    active:cursor-grabbing
                    dark:hover:bg-slate-800"
                >
                    ⋮⋮
                </button>
                <h3
                    className="
                    flex-1
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

export const TaskCard =
  memo(TaskCardComponent);