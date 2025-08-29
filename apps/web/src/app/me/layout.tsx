'use client';

import { AppShell, AppShellMain } from '@mantine/core';
import { AppHeader } from '@/shared/components/appShell/AppHeader';
import { AppNavbar } from '@/shared/components/appShell/AppNavbar';
import { APP_SHELL_NAV_BAR_WIDTH, APP_SHELL_HEADER_HEIGHT } from '@tidy/ui';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      padding="xs"
      styles={{ main: { paddingLeft: 0 } }}
      header={{ height: APP_SHELL_HEADER_HEIGHT }}
      navbar={{
        width: APP_SHELL_NAV_BAR_WIDTH,
        breakpoint: 'sm',
        collapsed: {
          desktop: !opened,
          mobile: !opened,
        },
      }}
    >
      <AppHeader onNavbarToggled={setOpened} />

      <AppNavbar />

      <AppShellMain
        style={{
          paddingBottom: 0,
          paddingRight: 0,
          paddingTop: APP_SHELL_HEADER_HEIGHT,
          paddingLeft: opened ? APP_SHELL_NAV_BAR_WIDTH : 0, // Adjust padding based on navbar state
        }}
      >
        {children}
      </AppShellMain>
    </AppShell>
  );
}
