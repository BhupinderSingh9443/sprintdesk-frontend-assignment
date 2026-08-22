import {
    useMemo,
    useState,
} from 'react';

import {
    BOARD_COLUMNS,
} from './board.constants';


import {
    TaskDrawer,
} from './TaskDrawer';

import {
    useBoardStore,
} from './board.store';

import {
    BoardColumn,
} from './BoardColumn';

import {
    ConfirmDialog,
} from '../../components/ui/ConfirmDialog';


import {
    closestCorners,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import type {
    DragEndEvent,
} from '@dnd-kit/core';

import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import type {
    TaskStatus,
    User,
} from '../../types/domain';

interface SprintBoardProps {
    users: User[];
}

export function SprintBoard({
    users,
}: SprintBoardProps) {
    const tasks = useBoardStore(
        (state) => state.tasks,
    );

    const [
        pendingDeleteTaskId,
        setPendingDeleteTaskId,
    ] = useState<number | null>(
        null,
    );

    const deleteTask =
        useBoardStore(
            (state) =>
                state.deleteTask,
        );

    const pendingDeleteTask =
        tasks.find(
            (task) =>
                task.id ===
                pendingDeleteTaskId,
        );

    const [
        selectedTaskId,
        setSelectedTaskId,
    ] = useState<number | null>(
        null,
    );

    const moveTask = useBoardStore(
        (state) => state.moveTask,
    );

    const usersById = useMemo(
        () =>
            new Map(
                users.map((user) => [
                    user.id,
                    user,
                ]),
            ),
        [users],
    );

    const sensors = useSensors(
        useSensor(
            PointerSensor,
            {
                activationConstraint: {
                    distance: 6,
                },
            },
        ),

        useSensor(
            KeyboardSensor,
            {
                coordinateGetter:
                    sortableKeyboardCoordinates,
            },
        ),
    );

    function handleDragEnd(
        event: DragEndEvent,
    ) {
        const {
            active,
            over,
        } = event;

        if (!over) {
            return;
        }

        const activeTask = tasks.find(
            (task) =>
                task.id === Number(active.id),
        );

        if (!activeTask) {
            return;
        }

        const overId = String(over.id);

        /*
         * Dropped directly on a column.
         */

        if (
            overId.startsWith(
                'column-',
            )
        ) {
            const targetStatus =
                overId.replace(
                    'column-',
                    '',
                ) as TaskStatus;

            const targetTasks =
                tasks
                    .filter(
                        (task) =>
                            task.status ===
                            targetStatus,
                    )
                    .sort(
                        (a, b) =>
                            a.order - b.order,
                    );

            moveTask(
                activeTask.id,
                targetStatus,
                targetTasks.length,
            );

            return;
        }

        /*
         * Dropped over another task.
         */

        const overTask = tasks.find(
            (task) =>
                task.id === Number(
                    over.id,
                ),
        );

        if (!overTask) {
            return;
        }

        const targetStatus =
            overTask.status;

        const targetTasks = tasks
            .filter(
                (task) =>
                    task.status ===
                    targetStatus,
            )
            .sort(
                (a, b) =>
                    a.order - b.order,
            );

        const targetIndex =
            targetTasks.findIndex(
                (task) =>
                    task.id ===
                    overTask.id,
            );

        moveTask(
            activeTask.id,
            targetStatus,
            targetIndex,
        );
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={
                    closestCorners
                }
                onDragEnd={
                    handleDragEnd
                }
            >
                <div
                    className="
          overflow-x-auto
          pb-4
        "
                >
                    <div
                        className="
            grid
            min-w-[1180px]
            grid-cols-4
            gap-4
          "
                    >
                        {BOARD_COLUMNS.map(
                            (column) => {
                                const columnTasks =
                                    tasks.filter(
                                        (task) =>
                                            task.status ===
                                            column.id,
                                    );

                                return (
                                    <BoardColumn
                                        key={column.id}
                                        title={
                                            column.title
                                        }
                                        status={
                                            column.id
                                        }
                                        tasks={
                                            columnTasks
                                        }
                                        usersById={
                                            usersById
                                        }
                                        onOpenTask={
                                            setSelectedTaskId
                                        }
                                    />
                                );
                            },
                        )}
                    </div>
                </div>
            </DndContext>

            <TaskDrawer
                taskId={selectedTaskId}
                users={users}
                onClose={() =>
                    setSelectedTaskId(null)
                }
                onDelete={(taskId) => {
                    setPendingDeleteTaskId(
                        taskId,
                    );

                    setSelectedTaskId(null);
                }}
            />

            <ConfirmDialog
                open={
                    pendingDeleteTask !==
                    undefined
                }
                title="Delete task?"
                description={
                    pendingDeleteTask
                        ? `"${pendingDeleteTask.title}" will be permanently removed from the sprint board.`
                        : ''
                }
                confirmText="Delete task"
                onCancel={() =>
                    setPendingDeleteTaskId(
                        null,
                    )
                }
                onConfirm={() => {
                    if (
                        pendingDeleteTaskId ===
                        null
                    ) {
                        return;
                    }

                    deleteTask(
                        pendingDeleteTaskId,
                    );

                    setPendingDeleteTaskId(
                        null,
                    );
                }}
            />
        </>
    );
}