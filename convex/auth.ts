import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./OTP/ResendOTP";
import Google from '@auth/core/providers/google'

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [ResendOTP, Google],
});
