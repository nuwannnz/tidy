import { Tooltip as MantineTooltip, TooltipProps as MantineTooltipProps } from '@mantine/core';

export type TooltipProps = MantineTooltipProps;

export function Tooltip(props: TooltipProps) {
  return <MantineTooltip {...props} />;
}
