import {
  Button as MantineButton,
  ButtonProps as MantineButtonProps,
} from '@mantine/core';
import { BLACK } from '../../branding/colors';

type ButtonProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<'button'> &
    MantineButtonProps & { type: 'button' | 'submit' | 'reset' }
>;

export const Button = (props: ButtonProps) => {
  return (
    <MantineButton {...props} color={BLACK}>
      {props.children}
    </MantineButton>
  );
};
