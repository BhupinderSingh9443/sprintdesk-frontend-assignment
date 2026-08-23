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
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

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

                    <Input
                        label="Title"
                        required
                        value={title}
                        onChange={(event) =>
                            setTitle(
                                event.target.value,
                            )
                        }
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

                        <Select
                            label="Priority"
                            value={priority}
                            options={[
                                {
                                    label: 'Low',
                                    value: 'low',
                                },
                                {
                                    label: 'Medium',
                                    value:
                                        'medium',
                                },
                                {
                                    label: 'High',
                                    value: 'high',
                                },
                            ]}
                            onChange={(event) =>
                                setPriority(
                                    event.target
                                        .value as TaskPriority,
                                )
                            }
                        />
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

                        <Input
                            label="Due date"
                            type="date"
                            required
                            value={dueDate}
                            onChange={(event) =>
                                setDueDate(
                                    event.target.value,
                                )
                            }
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

                    <Select
                        label="Assignee"
                        value={assigneeId}
                        options={
                            users.map(
                                (user) => ({
                                    label:
                                        user.name,
                                    value:
                                        user.id,
                                }),
                            )
                        }
                        onChange={(event) =>
                            setAssigneeId(
                                Number(
                                    event.target.value,
                                ),
                            )
                        }
                    />
                </div>

                <div
                    className="
            mt-6
            flex
            justify-end
            gap-3
          "
                >
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                    >
                        Create task
                    </Button>
                </div>
            </form>
        </Modal>
    );
}