export type BaseFormState<T extends object> =
  | {
      errors?: T;
      message?: string;
      success: boolean;
      formData: FormData;
    }
  | undefined;
