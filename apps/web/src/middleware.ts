import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CookieKeys } from '@tidy/ui';
import Logger, { LogLevel } from '@tidy/utils/logger';

const AUTHORIZED_ROUTE_ROOT = '/me';

export default async function middleware(req: NextRequest) {
  Logger.log(
    LogLevel.Info,
    `middleware running for ${req.nextUrl.pathname} route`
  );
  // Decrypt the session from the cookie
  const isAuth = (await cookies()).has(CookieKeys.IdToken);

  // Redirect to /login if the user is not authenticated
  if (!isAuth && req.nextUrl.pathname.startsWith(AUTHORIZED_ROUTE_ROOT)) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  // Redirect to dashboard if authenticated and visiting a non-protected page
  if (isAuth && !req.nextUrl.pathname.startsWith(AUTHORIZED_ROUTE_ROOT)) {
    return NextResponse.redirect(new URL(AUTHORIZED_ROUTE_ROOT, req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$).*)'],
};
