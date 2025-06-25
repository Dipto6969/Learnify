import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Add '/api/webhook' to the list of public routes
const isPublicRoute = createRouteMatcher([
  // '/',
  '/search',
  '/courses(.*)',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/uploadthing(.*)', 
  '/api/webhook(.*)', // Add this line to make the webhook route public
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
