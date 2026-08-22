import {
    useState,
} from 'react';

import type {
    FormEvent,
} from 'react';

import {
    Modal,
} from '../../components/ui/Modal';

import {
    useBoardStore,
} from './board.store';

import type {
    Task,
    TaskPriority,
    User,
} from '../../types/domain';

interface TaskCreateModalProps {
    open: boolean;
    users: User[];
    sprintId: number;
    onClose: () => void;
}

export function TaskCreateModal({
    open,
    users,
    sprintId,
    onClose,
}: TaskCreateModalProps) {
    const tasks =
        useBoardStore(
            (state) => state.tasks,
        );

    const addTask =
        useBoardStore(
            (state) => state.addTask,
        );

    const [
        title,
        setTitle,
    ] = useState('');

    const [
        priority,
        setPriority,
    ] =
        useState<TaskPriority>(
            'medium',
        );

    const [
        assigneeId,
        setAssigneeId,
    ] = useState(
        users[0]?.id ?? 1,
    );

    const [
        dueDate,
        setDueDate,
    ] = useState('');

    function resetForm() {
        setTitle('');
        setPriority('medium');
        setAssigneeId(
            users[0]?.id ?? 1,
        );
        setDueDate('');
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const cleanTitle =
            title.trim();

        if (
            !cleanTitle ||
            !dueDate
        ) {
            return;
        }

        const nextId =
            tasks.length > 0
                ? Math.max(
                    ...tasks.map(
                        (task) => task.id,
                    ),
                ) + 1
                : 1;

        const backlogCount =
            tasks.filter(
                (task) =>
                    task.status === 'backlog',
            ).length;

        const now =
            new Date().toISOString();

        const newTask: Task = {
            id: nextId,

            title: cleanTitle,

            description: '',

            status: 'backlog',

            priority,

            assigneeId,

            dueDate,

            sprintId,

            order:
                backlogCount + 1,

            createdAt: now,

            completedAt: null,

            updatedAt: now,
        };

        addTask(newTask);

        resetForm();

        onClose();
    }

    return (
        <Modal
            open={open}
            title="Create new task"
            description="Add a task to the current sprint."
            onClose={() => {
                resetForm();
                onClose();
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="p-6"
            >
                <div>
                    <label
                        htmlFor="new-task-title"
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
                        id="new-task-title"
                        required
                        autoFocus
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

                <div
                    className="
            mt-5
            grid
            gap-4
            sm:grid-cols-2
          "
                >
                    <div>
                        <label
                            htmlFor="new-task-priority"
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
                            id="new-task-priority"
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
                            <option value="low">
                                Low
                            </option>

                            <option value="medium">
                                Medium
                            </option>

                            <option value="high">
                                High
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="new-task-due-date"
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
                            id="new-task-due-date"
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
                </div>

                <div className="mt-5">
                    <label
                        htmlFor="new-task-assignee"
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
                        id="new-task-assignee"
                        value={assigneeId}
                        onChange={(event) =>
                            setAssigneeId(
                                Number(
                                    event.target.value,
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

                <div
                    className="
            mt-6
            flex
            justify-end
            gap-3
          "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="
              rounded-lg
              border
              border-slate-300
              px-4
              py-2
              text-sm
              font-medium
              dark:border-slate-700
            "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-sm
              font-medium
              text-white
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
                    >
                        Create task
                    </button>
                </div>
            </form>
        </Modal>
    );
}