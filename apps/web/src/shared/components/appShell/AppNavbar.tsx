import { IconButton, Tooltip, APP_SHELL_NAV_BAR_WIDTH, WHITE } from '@tidy/ui';
import { AppShellNavbar, Stack } from '@mantine/core';
import {
  IconLayoutDashboard,
  IconCalendarWeek,
  IconLibrary,
  IconNotebook,
} from '@tabler/icons-react';
import Link from 'next/link';

const menuItems = [
  {
    label: 'Dashboard',
    icon: <IconLayoutDashboard />,
    href: '/me',
  },
  {
    label: 'Week',
    icon: <IconCalendarWeek />,
    href: '/me/week',
  },
  {
    label: 'Projects',
    icon: <IconLibrary />,
    href: '/me/projects',
  },
  {
    label: 'Notes',
    icon: <IconNotebook />,
    href: '/me/notes',
  },
];

export function AppNavbar() {
  return (
    <AppShellNavbar
      p={0}
      style={{
        width: APP_SHELL_NAV_BAR_WIDTH,
        background: WHITE,
        borderRight: '1px solid #e5e7eb',
      }}
    >
      <Stack
        justify="center"
        align="center"
        gap="md"
        style={{ height: '100vh', paddingTop: 16 }}
      >
        {menuItems.map((item) => (
          <Tooltip label={item.label} position="right" key={item.label}>
            <Link href={item.href}>
              <IconButton
                variant="subtle"
                size={48}
                radius={8}
                style={{ marginBottom: 8 }}
                aria-label={item.label}
              >
                {item.icon}
              </IconButton>
            </Link>
          </Tooltip>
        ))}
      </Stack>
    </AppShellNavbar>
  );
}
