'use server';

import { AppEnv } from '@tidy/ui/utils';
import { EnvKeys } from '@tidy/ui';
import {
  CognitoIdentityProviderClient,
  ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { FormState, ResendCodeFormSchema } from './schemas/resendCode.schema';
import Logger, { LogContext, LogLevel } from '@tidy/utils/logger';

export async function resendCode(
  _formState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ResendCodeFormSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      formData,
    };
  }

  const client = new CognitoIdentityProviderClient({});

  const command = new ResendConfirmationCodeCommand({
    ClientId: AppEnv.getValue(EnvKeys.AwsCognitoClientAppId),
    Username: validatedFields.data.email,
  });

  try {
    await client.send(command);
    return {
      message: 'A new confirmation code has been sent to your email.',
      success: true,
      formData,
    };
  } catch (e: unknown) {
    Logger.log(
      LogLevel.Error,
      'Error during resend confirmation code:',
      e,
      LogContext.Auth
    );
    return {
      message: 'An error occurred during account confirmation.',
      success: false,
      formData,
    };
  }
}
