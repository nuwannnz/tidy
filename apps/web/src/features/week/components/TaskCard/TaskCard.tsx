import { Typography } from '@tidy/ui';
import { Card, Stack, Group } from '@mantine/core';
import { Task } from '@tidy/types';

// const PRIORITY_COLORS = {
//   low: 'green',
//   medium: 'yellow',
//   high: 'red',
// } as const;
//
// const CATEGORY_COLORS = [
//   'violet',
//   'blue',
//   'indigo',
//   'pink',
//   'orange',
//   'teal',
//   'cyan',
// ] as const;

interface TaskCardProps {
  task: Task;
}

// const getCategoryColor = (category: string) => {
//   const hash = category.split('').reduce((a, b) => {
//     a = (a << 5) - a + b.charCodeAt(0);
//     return a & a;
//   }, 0);
//   return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
// };

export const TaskCard = ({ task }: TaskCardProps) => (
  <Card
    shadow="xs"
    padding="xs"
    radius="sm"
    withBorder
    style={{ cursor: 'pointer', marginBottom: '12px' }}
    className="hover:shadow-md transition-shadow"
  >
    <Stack gap="sm">
      <Typography size="sm" fw={500} lineClamp={2}>
        {task.title}
      </Typography>

      <Group gap="xs">
        {/*<Label*/}
        {/*  variant="light"*/}
        {/*  color={getCategoryColor(task.category)}*/}
        {/*  size="xs"*/}
        {/*  style={{ textTransform: 'uppercase' }}*/}
        {/*>*/}
        {/*  {task.category}*/}
        {/*</Label>*/}
      </Group>

      <Group justify="space-between" align="center">
        {/*<Group gap="xs">*/}
        {/*  {task.assignee && (*/}
        {/*    <Avatar size="sm" color="orange" radius="xl">*/}
        {/*      {task.assignee}*/}
        {/*    </Avatar>*/}
        {/*  )}*/}
        {/*  {task.estimatedTime && (*/}
        {/*    <Group gap={4}>*/}
        {/*      <IconClock size={12} color="gray" />*/}
        {/*      <Typography size="xs" c="dimmed">*/}
        {/*        {task.estimatedTime}*/}
        {/*      </Typography>*/}
        {/*    </Group>*/}
        {/*  )}*/}
        {/*</Group>*/}

        {/*<Label*/}
        {/*  variant="light"*/}
        {/*  color={PRIORITY_COLORS[task.priority]}*/}
        {/*  size="xs"*/}
        {/*  style={{ textTransform: 'capitalize' }}*/}
        {/*>*/}
        {/*  {task.priority}*/}
        {/*</Label>*/}
      </Group>
    </Stack>
  </Card>
);
