import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import type {
    FormEvent,
    MouseEvent,
} from 'react';

import type {
    TaskPriority,
    TaskStatus,
    User,
} from '../../types/domain';

import {
    useAuthStore,
} from '../../stores/auth.store';

import {
    useBoardStore,
} from './board.store';
import { Button } from '../../components/ui/Button';

interface TaskDrawerProps {
    taskId: number | null;
    users: User[];
    onClose: () => void;
    onDelete: (
        taskId: number,
    ) => void;
}

const STATUS_OPTIONS: {
    value: TaskStatus;
    label: string;
}[] = [
        {
            value: 'backlog',
            label: 'Backlog',
        },
        {
            value: 'in-progress',
            label: 'In Progress',
        },
        {
            value: 'review',
            label: 'Review',
        },
        {
            value: 'done',
            label: 'Done',
        },
    ];

const PRIORITY_OPTIONS: {
    value: TaskPriority;
    label: string;
}[] = [
        {
            value: 'low',
            label: 'Low',
        },
        {
            value: 'medium',
            label: 'Medium',
        },
        {
            value: 'high',
            label: 'High',
        },
    ];

export function TaskDrawer({
    taskId,
    users,
    onClose,
    onDelete,
}: TaskDrawerProps) {
    const dialogRef =
        useRef<HTMLDialogElement>(null);

    const tasks = useBoardStore(
        (state) => state.tasks,
    );

    const comments = useBoardStore(
        (state) => state.comments,
    );

    const updateTask =
        useBoardStore(
            (state) => state.updateTask,
        );

    const moveTask =
        useBoardStore(
            (state) => state.moveTask,
        );

    const addComment =
        useBoardStore(
            (state) => state.addComment,
        );

    const authUser =
        useAuthStore(
            (state) => state.user,
        );

    const task = tasks.find(
        (item) => item.id === taskId,
    );

    const taskComments =
        useMemo(
            () =>
                comments
                    .filter(
                        (comment) =>
                            comment.taskId === taskId,
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.createdAt)
                                .getTime() -
                            new Date(b.createdAt)
                                .getTime(),
                    ),
            [
                comments,
                taskId,
            ],
        );

    const [
        title,
        setTitle,
    ] = useState('');

    const [
        description,
        setDescription,
    ] = useState('');

    const [
        priority,
        setPriority,
    ] =
        useState<TaskPriority>('medium');

    const [
        status,
        setStatus,
    ] =
        useState<TaskStatus>('backlog');

    const [
        assigneeId,
        setAssigneeId,
    ] =
        useState<number>(users[0]?.id ?? 1);

    const [
        dueDate,
        setDueDate,
    ] = useState('');

    const [
        newComment,
        setNewComment,
    ] = useState('');

    useEffect(() => {
        if (!task) {
            return;
        }

        setTitle(task.title);

        setDescription(
            task.description,
        );

        setPriority(
            task.priority,
        );

        setStatus(
            task.status,
        );

        setAssigneeId(
            task.assigneeId,
        );

        setDueDate(
            task.dueDate,
        );
    }, [task]);

    useEffect(() => {
        const dialog =
            dialogRef.current;

        if (
            task &&
            dialog &&
            !dialog.open
        ) {
            dialog.showModal();
        }
    }, [task]);

    if (!task) {
        return null;
    }

    function closeDrawer() {
        dialogRef.current?.close();
    }

    function handleSave(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!task) {
            return;
        }

        const cleanTitle =
            title.trim();

        if (!cleanTitle) {
            return;
        }

        /*
         * If status changes,
         * move the task to the end
         * of the new column.
         */

        if (
            status !== task.status
        ) {
            const targetIndex =
                tasks.filter(
                    (item) =>
                        item.status === status &&
                        item.id !== task.id,
                ).length;

            moveTask(
                task.id,
                status,
                targetIndex,
            );
        }

        updateTask(
            task.id,
            {
                title: cleanTitle,
                description:
                    description.trim(),
                priority,
                assigneeId,
                dueDate,
                updatedAt:
                    new Date().toISOString(),
            },
        );

        closeDrawer();
    }

    function handleCommentSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        if (!task) {
            return;
        }

        const message =
            newComment.trim();

        if (!message) {
            return;
        }

        const authorId =
            authUser?.id ??
            users[0]?.id ??
            1;

        addComment(
            task.id,
            authorId,
            message,
        );

        setNewComment('');
    }

    function handleBackdropClick(
        event: MouseEvent<HTMLDialogElement>,
    ) {
        if (
            event.target ===
            event.currentTarget
        ) {
            closeDrawer();
        }
    }

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={
                handleBackdropClick
            }
            className="
        m-0
        ml-auto
        h-dvh
        w-full
        max-w-xl
        border-0
        bg-transparent
        p-0
        backdrop:bg-slate-950/50
      "
        >
            <div
                className="
          flex
          h-full
          flex-col
          bg-white
          shadow-2xl
          dark:bg-slate-900
        "
            >
                {/* Header */}

                <header
                    className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            py-4
            dark:border-slate-800
          "
                >
                    <div>
                        <p
                            className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-slate-500
              "
                        >
                            Task #{task.id}
                        </p>

                        <h2
                            className="
                mt-1
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
                        >
                            Task details
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={
                            closeDrawer
                        }
                        aria-label="Close task details"
                        className="
              rounded-lg
              px-3
              py-2
              text-slate-500
              hover:bg-slate-100
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              dark:hover:bg-slate-800
            "
                    >
                        ✕
                    </button>
                </header>

                <div
                    className="
            flex-1
            overflow-y-auto
            p-6
          "
                >
                    <form
                        id="task-details-form"
                        onSubmit={
                            handleSave
                        }
                        className="space-y-5"
                    >
                        {/* Title */}

                        <div>
                            <label
                                htmlFor="task-title"
                                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
                            >
                                Title
                            </label>

                            <input
                                id="task-title"
                                required
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value,
                                    )
                                }
                                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2
                  text-slate-900
                  focus:border-blue-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-100
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                            />
                        </div>

                        {/* Description */}

                        <div>
                            <label
                                htmlFor="task-description"
                                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
                            >
                                Description
                            </label>

                            <textarea
                                id="task-description"
                                rows={5}
                                value={
                                    description
                                }
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value,
                                    )
                                }
                                className="
                  mt-2
                  w-full
                  resize-y
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2
                  text-slate-900
                  focus:border-blue-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-100
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                            />
                        </div>

                        {/* Status + priority */}

                        <div
                            className="
                grid
                gap-4
                sm:grid-cols-2
              "
                        >
                            <div>
                                <label
                                    htmlFor="task-status"
                                    className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                                >
                                    Status
                                </label>

                                <select
                                    id="task-status"
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(
                                            event.target
                                                .value as TaskStatus,
                                        )
                                    }
                                    className="
                    mt-2
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                                >
                                    {STATUS_OPTIONS.map(
                                        (option) => (
                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="task-priority"
                                    className="
                    block
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-300
                  "
                                >
                                    Priority
                                </label>

                                <select
                                    id="task-priority"
                                    value={priority}
                                    onChange={(event) =>
                                        setPriority(
                                            event.target
                                                .value as TaskPriority,
                                        )
                                    }
                                    className="
                    mt-2
                    w-full
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2
                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                                >
                                    {PRIORITY_OPTIONS.map(
                                        (option) => (
                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {
                                                    option.label
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </div>

                        {/* Assignee */}

                        <div>
                            <label
                                htmlFor="task-assignee"
                                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
                            >
                                Assignee
                            </label>

                            <select
                                id="task-assignee"
                                value={
                                    assigneeId
                                }
                                onChange={(event) =>
                                    setAssigneeId(
                                        Number(
                                            event.target
                                                .value,
                                        ),
                                    )
                                }
                                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                            >
                                {users.map(
                                    (user) => (
                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.name}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Due date */}

                        <div>
                            <label
                                htmlFor="task-due-date"
                                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
                            >
                                Due date
                            </label>

                            <input
                                id="task-due-date"
                                type="date"
                                required
                                value={dueDate}
                                onChange={(event) =>
                                    setDueDate(
                                        event.target.value,
                                    )
                                }
                                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                            />
                        </div>
                    </form>

                    {/* Comments */}

                    <section
                        aria-labelledby="comments-heading"
                        className="
              mt-8
              border-t
              border-slate-200
              pt-6
              dark:border-slate-800
            "
                    >
                        <h3
                            id="comments-heading"
                            className="
                text-base
                font-semibold
                text-slate-900
                dark:text-white
              "
                        >
                            Comments
                        </h3>

                        <div
                            className="
                mt-4
                space-y-4
              "
                        >
                            {taskComments.map(
                                (comment) => {
                                    const mockAuthor =
                                        users.find(
                                            (user) =>
                                                user.id ===
                                                comment.authorId,
                                        );

                                    const isCurrentUser =
                                        authUser?.id ===
                                        comment.authorId;

                                    const authorName =
                                        mockAuthor?.name ??
                                        (
                                            isCurrentUser &&
                                                authUser
                                                ? `${authUser.firstName} ${authUser.lastName}`
                                                : 'SprintDesk user'
                                        );

                                    const avatar =
                                        mockAuthor?.avatar ??
                                        (
                                            isCurrentUser
                                                ? authUser?.image
                                                : undefined
                                        );

                                    return (
                                        <article
                                            key={
                                                comment.id
                                            }
                                            className="
                        rounded-lg
                        bg-slate-50
                        p-4
                        dark:bg-slate-950
                      "
                                        >
                                            <div
                                                className="
                          flex
                          items-center
                          gap-3
                        "
                                            >
                                                {avatar && (
                                                    <img
                                                        src={
                                                            avatar
                                                        }
                                                        alt=""
                                                        className="
                              h-8
                              w-8
                              rounded-full
                              object-cover
                            "
                                                    />
                                                )}

                                                <div>
                                                    <p
                                                        className="
                              text-sm
                              font-medium
                              text-slate-900
                              dark:text-white
                            "
                                                    >
                                                        {
                                                            authorName
                                                        }
                                                    </p>

                                                    <time
                                                        dateTime={
                                                            comment.createdAt
                                                        }
                                                        className="
                              text-xs
                              text-slate-500
                            "
                                                    >
                                                        {new Intl.DateTimeFormat(
                                                            'en-AU',
                                                            {
                                                                dateStyle:
                                                                    'medium',
                                                                timeStyle:
                                                                    'short',
                                                            },
                                                        ).format(
                                                            new Date(
                                                                comment.createdAt,
                                                            ),
                                                        )}
                                                    </time>
                                                </div>
                                            </div>

                                            <p
                                                className="
                          mt-3
                          text-sm
                          text-slate-700
                          dark:text-slate-300
                        "
                                            >
                                                {
                                                    comment.message
                                                }
                                            </p>
                                        </article>
                                    );
                                },
                            )}

                            {taskComments.length ===
                                0 && (
                                    <p
                                        className="
                    text-sm
                    text-slate-500
                  "
                                    >
                                        No comments yet.
                                    </p>
                                )}
                        </div>

                        <form
                            onSubmit={
                                handleCommentSubmit
                            }
                            className="mt-5"
                        >
                            <label
                                htmlFor="new-comment"
                                className="
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
                            >
                                Add comment
                            </label>

                            <textarea
                                id="new-comment"
                                rows={3}
                                value={
                                    newComment
                                }
                                onChange={(event) =>
                                    setNewComment(
                                        event.target.value,
                                    )
                                }
                                className="
                  mt-2
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-3
                  py-2
                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                            />

                            <button
                                type="submit"
                                disabled={
                                    !newComment.trim()
                                }
                                className="
                  mt-3
                  rounded-lg
                  bg-slate-900
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:bg-slate-100
                  dark:text-slate-900
                "
                            >
                                Add comment
                            </button>
                        </form>
                    </section>
                </div>

                {/* Footer */}

                <footer
                    className="
    flex
    items-center
    justify-between
    gap-3
    border-t
    border-slate-200
    px-6
    py-4
    dark:border-slate-800
  "
                >
                    <button
                        type="button"
                        onClick={() =>
                            onDelete(task.id)
                        }
                        className="
                        rounded-lg
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-red-600
                        hover:bg-red-50
                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-500
                        dark:text-red-400
                        dark:hover:bg-red-950
    "
                    >
                        Delete task
                    </button>

                    <div
                        className="
                        flex
                        items-center
                        gap-3
                            "
                    >


                        <Button
                            variant="secondary"
                            onClick={closeDrawer}
                        >
                            Cancel
                        </Button>



                        <button
                            type="submit"
                            form="task-details-form"
                            className="
                            rounded-lg
                            bg-blue-600
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            hover:bg-blue-700
                                "
                        >
                            Save changes
                        </button>
                    </div>
                </footer>
            </div>
        </dialog>
    );
}