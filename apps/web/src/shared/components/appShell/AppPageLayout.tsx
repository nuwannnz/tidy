import { ReactNode } from 'react';
import { Box, Container } from '@mantine/core';
import { APP_SHELL_HEADER_HEIGHT } from '@tidy/ui';

interface AppPageLayoutProps {
  children: ReactNode;
  id?: string;
  p?: string | number;
}

export function AppPageLayout({ children, id, p = 'sm' }: AppPageLayoutProps) {
  return (
    <Box
      style={{
        height: `calc(100vh - ${APP_SHELL_HEADER_HEIGHT}px)`,
        backgroundColor: 'var(--mantine-color-white-1)',
      }}
      p={p}
      id={id}
    >
      <Container fluid h="100%" p={0}>
        {children}
      </Container>
    </Box>
  );
}
