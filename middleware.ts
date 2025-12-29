import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/accounts(.*)',
  '/transactions(.*)' 
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(
        new URL('/sign-in', req.url)
      );
    }
  }
  return NextResponse.next(); // middleware should return response in all the cases!
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|woff2?|ico)).*)',
    '/(api|trpc)(.*)',
  ],
};
