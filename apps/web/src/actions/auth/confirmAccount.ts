'use server';

import { AppEnv } from '@tidy/ui/utils';
import { EnvKeys } from '@tidy/ui';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ExpiredCodeException,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  FormState,
  ConfirmAccountFormSchema,
} from './schemas/confirmAccount.schema';
import { redirect } from 'next/navigation';
import Logger, { LogContext, LogLevel } from '@tidy/utils/logger';

export async function confirmAccount(
  _formState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ConfirmAccountFormSchema.safeParse({
    email: formData.get('email'),
    confirmationCode: formData.get('confirmationCode'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      formData,
    };
  }

  const client = new CognitoIdentityProviderClient({});

  const command = new ConfirmSignUpCommand({
    ClientId: AppEnv.getValue(EnvKeys.AwsCognitoClientAppId),
    Username: validatedFields.data.email,
    ConfirmationCode: validatedFields.data.confirmationCode,
  });

  try {
    await client.send(command);
  } catch (e: unknown) {
    Logger.log(
      LogLevel.Error,
      'Error during user account confirmation:',
      e,
      LogContext.Auth
    );

    if (e instanceof ExpiredCodeException) {
      return {
        errors: { confirmationCode: ['The confirmation code has expired.'] },
        success: false,
        formData,
      };
    }
    return {
      message: 'An error occurred during account confirmation.',
      success: false,
      formData,
    };
  }
  return redirect('/auth/login');
}
