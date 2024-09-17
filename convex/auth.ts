import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./OTP/ResendOTP";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [ResendOTP],
});
