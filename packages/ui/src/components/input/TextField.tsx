import { TextInput, TextInputProps } from '@mantine/core';
import { BaseComponentProps } from '../base';

import React from 'react';

interface TextFieldProps extends BaseComponentProps, TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ required, label, helperText, errorText, ...props }, ref) => (
    <TextInput
      required={required}
      label={label}
      description={helperText}
      error={errorText}
      ref={ref}
      {...props}
    />
  )
);
TextField.displayName = 'TextField';
