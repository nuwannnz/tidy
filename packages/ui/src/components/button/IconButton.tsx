import { ActionIcon, ActionIconProps } from '@mantine/core';
import React from 'react';

export type IconButtonProps = React.PropsWithChildren<
  ActionIconProps & React.ComponentPropsWithoutRef<'button'>
>;

export function IconButton({
  children,
  variant = 'white',
  ...props
}: IconButtonProps) {
  return (
    <ActionIcon variant={variant} {...props}>
      {children}
    </ActionIcon>
  );
}
