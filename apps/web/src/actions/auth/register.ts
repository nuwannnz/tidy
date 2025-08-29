'use server';

import { AppEnv } from '@tidy/ui/utils';
import { EnvKeys } from '@tidy/ui';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { FormState, SignupFormSchema } from './schemas/register.schema';
import Logger, { LogContext, LogLevel } from '@tidy/utils/logger';

export async function registerUser(
  _formState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      formData,
    };
  }

  const client = new CognitoIdentityProviderClient({});

  const command = new SignUpCommand({
    ClientId: AppEnv.getValue(EnvKeys.AwsCognitoClientAppId),
    Username: validatedFields.data.email,
    Password: validatedFields.data.password,
    UserAttributes: [{ Name: 'name', Value: validatedFields.data.name }],
  });

  try {
    await client.send(command);
    return {
      message: 'User registered successfully',
      success: true,
      formData,
    };
  } catch (e: unknown) {
    Logger.log(
      LogLevel.Error,
      'Error during user registration:',
      e,
      LogContext.Auth
    );
    if (e instanceof UsernameExistsException) {
      return {
        errors: { email: ['This email is already registered.'] },
        success: false,
        formData,
      };
    }
    return {
      message: 'An error occurred during registration.',
      success: false,
      formData,
    };
  }
}
