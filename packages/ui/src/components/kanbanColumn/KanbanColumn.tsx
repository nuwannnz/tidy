import { Box, Group, Paper, Stack } from '@mantine/core';
import { AddColumnItem } from './AddColumnItem';
import { Typography } from '../typography/Typography';
import { ReactNode } from 'react';

interface KanbanColumnProps {
  title: ReactNode;
  children: ReactNode;
  headerRight?: ReactNode;
  minWidth?: string;
  maxWidth?: string;
  canAddItems?: boolean;
}

export const KanbanColumn = ({
  title,
  children,
  headerRight,
  minWidth = '280px',
  maxWidth = '320px',
  canAddItems = true,
}: KanbanColumnProps) => {
  return (
    <Paper
      shadow="xs"
      radius="xs"
      p="xs"
      style={{
        minWidth,
        maxWidth,
        flex: 1,
        backgroundColor: 'var(--mantine-color-gray-0)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="center">
          {typeof title === 'string' ? (
            <Typography
              size="sm"
              fw={600}
              tt="uppercase"
              c="dimmed"
              style={{ letterSpacing: '0.5px' }}
            >
              {title}
            </Typography>
          ) : (
            title
          )}
          {headerRight}
        </Group>
        <Box style={{ flex: 1, overflowY: 'auto' }}>{children}</Box>
        {canAddItems && (
          <AddColumnItem
            onSubmit={(value) => {
              // TODO: handle add item logic here
              console.log('Add item:', value);
            }}
          />
        )}
      </Stack>
    </Paper>
  );
};
