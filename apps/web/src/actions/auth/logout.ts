'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutUser(): Promise<void> {
  // Clear cookies by setting them to empty values
  const cookieStore = await cookies();
  cookieStore.delete('idToken');
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  redirect('/auth/login');
}
