import { Title, Text, TitleProps, TextProps } from '@mantine/core';
import { BaseComponentProps } from '../base';

type TypographyProps = BaseComponentProps &
  TitleProps &
  TextProps & {
    variant?: 'body' | 'heading' | 'subheading';
    children?: React.ReactNode;
  };

export function Typography({
  variant = 'body',
  children,
  ...props
}: TypographyProps) {
  if (variant === 'heading') {
    return (
      <Title order={1} {...props}>
        {children}
      </Title>
    );
  }

  if (variant === 'subheading') {
    return (
      <Title order={2} {...props}>
        {children}
      </Title>
    );
  }

  return <Text {...props}>{children}</Text>;
}
