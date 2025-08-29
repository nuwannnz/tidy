import { Stack } from '@mantine/core';
import { TaskCard } from '@/features/week/components/TaskCard/TaskCard';
import { KanbanColumn } from '@tidy/ui';
import { Task } from '@tidy/types';

interface DayColumnProps {
  day: string;
  tasks: Task[];
}

export function DayColumn({ day, tasks }: DayColumnProps) {
  return (
    <KanbanColumn title={day}>
      <Stack gap="xs">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Stack>
    </KanbanColumn>
  );
}
