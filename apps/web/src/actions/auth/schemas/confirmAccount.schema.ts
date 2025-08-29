import z from 'zod';
import { BaseFormState } from '../../types';

export const ConfirmAccountFormSchema = z.object({
  email: z.string().email(),
  confirmationCode: z.string().length(6).trim(),
});

export type FormState = BaseFormState<{
  email?: string[];
  confirmationCode?: string[];
}>;
