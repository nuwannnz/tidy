'use server';

import { AppEnv } from '@tidy/ui/utils';
import { EnvKeys } from '@tidy/ui';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  NotAuthorizedException,
  UserNotConfirmedException,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { FormState, LoginFormSchema } from './schemas/login.schema';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { CookieKeys } from '@tidy/ui';
import Logger, { LogContext, LogLevel } from '@tidy/utils/logger';

export async function loginUser(
  _formState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = LoginFormSchema.safeParse({
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

  const command = new InitiateAuthCommand({
    ClientId: AppEnv.getValue(EnvKeys.AwsCognitoClientAppId),
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: validatedFields.data.email,
      PASSWORD: validatedFields.data.password,
    },
  });

  let result: InitiateAuthCommandOutput;

  try {
    result = await client.send(command);

    const idToken = result.AuthenticationResult?.IdToken;
    const accessToken = result.AuthenticationResult?.AccessToken;
    const refreshToken = result.AuthenticationResult?.RefreshToken;

    if (idToken && accessToken && refreshToken) {
      const cookieStore = await cookies();
      const options = {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: true,
      };

      cookieStore.set(CookieKeys.IdToken, idToken, options);
      cookieStore.set(CookieKeys.AccessToken, accessToken, options);
      cookieStore.set(CookieKeys.RefreshToken, refreshToken, options);
    } else {
      throw new Error();
    }
  } catch (e: unknown) {
    Logger.log(LogLevel.Error, 'Error during user login:', e, LogContext.Auth);
    if (e instanceof UserNotConfirmedException) {
      return redirect(
        `/auth/verify?n=${btoa(encodeURIComponent(validatedFields.data.email))}`
      );
    }

    let message = 'An error occurred during login.';

    if (e instanceof UserNotFoundException) {
      message = 'User not found. Please check your email and password.';
    }

    if (e instanceof NotAuthorizedException) {
      message = 'Incorrect email or password. Please try again.';
    }

    return {
      message,
      success: false,
      formData,
    };
  }

  return redirect('/me');
}
