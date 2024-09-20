import { convexAuth } from "@convex-dev/auth/server";
// import { ResendOTP } from "./OTP/ResendOTP";
import Google from '@auth/core/providers/google'

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google],
  callbacks: {
    async redirect({ redirectTo }) {
      // Get the SITE_URL from environment variables
      const SITE_URL = process.env.SITE_URL;

      if (!SITE_URL) {
        throw new Error("SITE_URL environment variable is not set");
      }

      // Parse the SITE_URL to get the base domain
      const siteUrl = new URL(SITE_URL);
      const baseDomain = siteUrl.hostname.split('.').slice(-2).join('.');

      // Parse the redirectTo URL
      let redirectUrl;
      try {
        redirectUrl = new URL(redirectTo, SITE_URL);
      } catch (error) {
        // If redirectTo is not a valid URL, assume it's a relative path
        return `${SITE_URL}${redirectTo.startsWith('/') ? '' : '/'}${redirectTo}`;
      }

      // Check if redirectTo is already using SITE_URL
      if (redirectUrl.origin === siteUrl.origin) {
        return redirectTo;
      }

      // Check if redirectTo is using a subdomain of the base domain
      if (redirectUrl.hostname.endsWith(`.${baseDomain}`)) {
        return redirectUrl.toString();
      }

      // If redirectTo is not allowed, fallback to SITE_URL
      return SITE_URL;
    },
  },
});
