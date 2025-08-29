'use client';

import { useState } from 'react';
import { Box, Flex, Group, Stack } from '@mantine/core';
import { DayColumn } from '@/features/week';
import { Typography } from '@tidy/ui';
import { getCurrentWeekRange } from '@tidy/utils/dates';
import { AppPageLayout } from '@/shared/components/appShell/AppPageLayout';
import { Day, Task } from '@tidy/types';

type DayTasks = Record<string, Task[]>;

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function Index() {
  const [tasks] = useState<DayTasks>({
    Monday: [
      {
        id: '1',
        title: 'Weekly Planning | Create tasks',
        day: Day.Monday,
        fullDate: new Date().toISOString(),
        // category: 'WEEKLY PLANNING',
        // priority: 'high',
        // assignee: 'NK',
        // estimatedTime: '2h',
      },
    ],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  return (
    <AppPageLayout>
      <Flex direction="column" gap="xl" h="100%">
        {/* Header */}
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap="xs">
              <Group gap="sm" align="end">
                <Typography variant="heading" order={1} size="h2">
                  Week
                </Typography>
                <Typography c="dimmed" size="md" pb={2}>
                  ({getCurrentWeekRange()})
                </Typography>
              </Group>
            </Stack>
          </Group>
        </Stack>

        {/* Weekly columns */}
        <Box
          style={{
            overflowX: 'auto',
            paddingBottom: '24px',
            flex: 1,
            minHeight: 0, // For Firefox flex overflow
          }}
        >
          <Flex gap="lg" style={{ minWidth: 'fit-content', height: '100%' }}>
            {DAYS_OF_WEEK.map((day) => (
              <DayColumn key={day} day={day} tasks={tasks[day] || []} />
            ))}
          </Flex>
        </Box>
      </Flex>
    </AppPageLayout>
  );
}
