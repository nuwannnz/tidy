'use client';

import { registerUser } from '@/actions/auth/register';
import { AuthPageLayout } from '@/features/auth';
import { TextField, Typography, Button } from '@tidy/ui';
import { Center, Stack } from '@mantine/core';
import Link from 'next/link';
import { useActionState } from 'react';

export default function Index() {
  const [state, action, isPending] = useActionState(registerUser, undefined);

  return (
    <AuthPageLayout title="Create an account">
      <>
        <form action={action}>
          <Stack gap={12}>
            <TextField
              type="text"
              name="name"
              label="Your name"
              id="name"
              autoComplete="name"
              required
              disabled={isPending}
              errorText={state?.errors?.name?.join(',')}
              defaultValue={state?.formData?.get('name')?.toString() ?? ''}
            />

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
              Sign up
            </Button>
          </Stack>
        </form>
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
