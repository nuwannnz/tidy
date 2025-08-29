import z from 'zod';
import { BaseFormState } from '../../types';

export const ResendCodeFormSchema = z.object({
  email: z.email(),
});

export type FormState = BaseFormState<{
  email?: string[];
}>;
