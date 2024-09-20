"use node"

import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { VerificationCodeEmail } from "../emails/VerificationCodeEmail";
import { sendEmail } from "../helper/sendMail";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 20,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({
    identifier: email,
    token,
    expires,
  }) {
    await sendEmail(
      email,
      `Sign in to Complex-saas-starter`,
      VerificationCodeEmail({ code: token, expires })
    );
  },
});