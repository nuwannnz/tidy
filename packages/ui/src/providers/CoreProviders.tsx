import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';

export const HTML_BASE_PROPS = {
  ...mantineHtmlProps,
};

export function ColorMode() {
  return <ColorSchemeScript />;
}

export function CoreProviders({ children }: { children: React.ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}
