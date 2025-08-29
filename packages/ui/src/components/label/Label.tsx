import { Badge, BadgeProps } from '@mantine/core';

type LabelProps = BadgeProps;

export function Label({ children, radius = 'xs', ...props }: LabelProps) {
  return (
    <Badge radius={radius} {...props}>
      {children}
    </Badge>
  );
}
