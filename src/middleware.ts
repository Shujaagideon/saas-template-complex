import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const isSignInPage = createRouteMatcher(["/sign_in"]);
const isProtectedRoute = createRouteMatcher(["/sysAdmin(.*)", "/(.*)"]);

const isProtectedRouteSubdomain = createRouteMatcher(["/(.*)"]);
const isNotProtectedRoute = createRouteMatcher([
  "/about(.*)",
  "/price(.*)",
  "/",
]);

export default convexAuthNextjsMiddleware(async (request) => {
  const hostname = request.headers.get("host") || "";

  let currentHost;

  if (process.env.NODE_ENV === "production") {
    // In production, use the custom base domain from environment variables
    const baseDomain = process.env.SITE_URL;
    currentHost = hostname?.replace(`.${baseDomain}`, "");
  } else {
    // In development, handle localhost case
    currentHost = hostname?.replace(".localhost:3000", "");
  }

  const searchParams = request.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${request.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // If there's no currentHost, likely accessing the root domain, handle accordingly
  if (
    !currentHost ||
    currentHost === "localhost:3000" ||
    process.env.SITE_URL
  ) {
    // console.log("No subdomain, serving root domain content");
    // Continue to the next middleware or serve the root content
    if (isSignInPage(request) && isAuthenticatedNextjs()) {
      return nextjsMiddlewareRedirect(request, "/");
    } else if (
      isProtectedRoute(request) &&
      !isNotProtectedRoute(request) &&
      !isSignInPage(request) &&
      !isAuthenticatedNextjs()
    ) {
      return nextjsMiddlewareRedirect(request, "/sign_in");
    }
    return NextResponse.next();
  }

  let bizz = await fetch(
    `https://tame-hummingbird-105.convex.site/checkbizzsubdomain`,
    {
      method: "POST",
      body: JSON.stringify({ bizzSubdomain: currentHost }),
    }
  );

  if (!bizz) {
    console.log("Subdomain not found, serving root domain content");
    // Continue to the next middleware or serve the root content
    return NextResponse.next();
  }

  const body = await bizz.json();
  const { message } = body;
  // console.log(message.domain)

  if (message.domain) {
    if (isSignInPage(request) && isAuthenticatedNextjs()) {
      return NextResponse.rewrite(new URL(`/${message.domain}`, request.url));
    } else if (
      isProtectedRouteSubdomain(request) &&
      !isSignInPage(request) &&
      !isAuthenticatedNextjs()
    ) {
      return NextResponse.rewrite(
        new URL(`/${message.domain}/sign_in`, request.url)
      );
    }

    // http://test.localhost:3000/accept-organisation-invitation?token=2bifankyxq
    return NextResponse.rewrite(new URL(`/${message.domain}${path}`, request.url));
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
