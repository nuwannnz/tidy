'use client';

import { Button, TextField, Typography } from '@tidy/ui';
import { Alert, Center, Stack } from '@mantine/core';
import Link from 'next/link';
import { useActionState } from 'react';
import { loginUser } from '@/actions/auth/login';
import { AuthPageLayout } from '@/features/auth';

export default function Index() {
  const [state, action, isPending] = useActionState(loginUser, undefined);

  return (
    <AuthPageLayout title="Login to your account">
      <>
        <form action={action}>
          <Stack gap={12}>
            <TextField
              type="email"
              name="email"
              label="Email address"
              id="email"
              autoComplete="email"
              required
              disabled={isPending}
              errorText={state?.errors?.email?.join(',')}
              defaultValue={state?.formData?.get('email')?.toString() ?? ''}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              id="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              errorText={state?.errors?.password?.join(',')}
              defaultValue={state?.formData?.get('password')?.toString() ?? ''}
            />
            <Button
              mt={10}
              type="submit"
              disabled={isPending}
              loading={isPending}
            >
              Login
            </Button>
            {!isPending && state?.success === false && state.message && (
              <Alert color="red">{state.message}</Alert>
            )}
          </Stack>
        </form>
        <Center mt={10}>
          <Typography>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold ">
              register here
            </Link>
          </Typography>
        </Center>
      </>
    </AuthPageLayout>
  );
}
