'use client';

import { confirmAccount } from '@/actions/auth/confirmAccount';
import { AuthPageLayout } from '@/features/auth';
import { Button, TextField, Typography } from '@tidy/ui';
import { Alert, Center, Stack } from '@mantine/core';
import Link from 'next/link';
import { Suspense, useActionState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { resendCode } from '@/actions/auth/resendCode';

function VerifyAccountForm() {
  const searchParams = useSearchParams();
  const encodedEmail = searchParams.get('n');
  const decodedEmail = encodedEmail
    ? decodeURIComponent(atob(encodedEmail))
    : undefined;

  const [state, action, isPending] = useActionState(confirmAccount, undefined);
  const [resendCodeState, resendCodeAction, isResendCodePending] =
    useActionState(resendCode, undefined);

  const hiddenEmailField = (
    <input
      type="hidden"
      id="email"
      name="email"
      value={state?.formData?.get('email')?.toString() ?? decodedEmail}
    />
  );

  if (!decodedEmail) {
    return redirect('/auth/register');
  }

  return (
    <>
      <form action={action}>
        {hiddenEmailField}
        <Stack gap={12}>
          <TextField
            type="text"
            name="confirmationCode"
            label="Confirmation Code"
            id="confirmationCode"
            required
            disabled={isPending}
            errorText={state?.errors?.confirmationCode?.join(',')}
            defaultValue={
              state?.formData?.get('confirmationCode')?.toString() ?? ''
            }
          />

          <Button
            mt={10}
            type="submit"
            disabled={isPending}
            loading={isPending}
          >
            Verify
          </Button>
        </Stack>
      </form>
      <form action={resendCodeAction}>
        {hiddenEmailField}
        <Stack>
          <Button
            type="submit"
            variant="outline"
            mt={5}
            loading={isResendCodePending}
            disabled={isResendCodePending}
          >
            Resend code
          </Button>
          {resendCodeState?.success === false &&
            resendCodeState.message &&
            !isResendCodePending && (
              <Alert color="red">{resendCodeState.message}</Alert>
            )}
        </Stack>
      </form>
    </>
  );
}

export default function Index() {
  return (
    <AuthPageLayout title="Verify your account">
      <>
        <Suspense>
          <VerifyAccountForm />
        </Suspense>
        <Center mt={10}>
          <Typography>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold ">
              log in here
            </Link>
          </Typography>
        </Center>
      </>
    </AuthPageLayout>
  );
}
