import { Typography } from '@tidy/ui';
import { Container, Center, Stack } from '@mantine/core';

interface AuthPageLayoutProps {
  title?: string;
  children?: React.ReactNode;
}
export const AuthPageLayout = ({ title, children }: AuthPageLayoutProps) => (
  <Container fluid pt={20}>
    <Center>
      {/* TODO ADD logo */}
      <Typography variant="heading" size="xl">
        {title}
      </Typography>
    </Center>

    <Container maw={320} p={0}>
      <Stack mt={10} gap={4}>
        {children}
      </Stack>
    </Container>
  </Container>
);
