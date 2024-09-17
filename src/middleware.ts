import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from 'next/server';

const isSignInPage = createRouteMatcher(["/sign_in"]);
const isProtectedRoute = createRouteMatcher([
  '/sysAdmin(.*)',
  '/Business/:Business(.*)'
]);

// export default convexAuthNextjsMiddleware((request) => {

//   // const hostname = request.headers.get('host') || '';
//   // const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  
//   // let subdomain: string | null = null;

//   // if (isLocalhost) {
//   //   // For localhost, use the first path segment as the subdomain
//   //   subdomain = request.nextUrl.pathname.split('/')[1];
//   //   // Remove the subdomain from the pathname for further processing
//   //   request.nextUrl.pathname = '/' + request.nextUrl.pathname.split('/').slice(2).join('/');
//   // } else {
//   //   // For production, extract subdomain from hostname
//   //   const domainParts = hostname.split('.');
//   //   if (domainParts.length > 2) {
//   //     subdomain = domainParts[0];
//   //   }
//   // }

//   // // Handle subdomain routing
//   // if (subdomain && subdomain !== 'www') {
//   //   return NextResponse.rewrite(new URL(`/${subdomain}${request.nextUrl.pathname}`, request.url));
//   // }

//   if (isSignInPage(request) && isAuthenticatedNextjs()) {
//     return nextjsMiddlewareRedirect(request, "/");
//   }
//   if (isProtectedRoute(request) && !isAuthenticatedNextjs()) {
//     return nextjsMiddlewareRedirect(request, "/sign_in");
//   }
// });

export default convexAuthNextjsMiddleware((request) => {
  if (isSignInPage(request) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/");
  }
  if (isProtectedRoute(request) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/sign_in");
  }
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};