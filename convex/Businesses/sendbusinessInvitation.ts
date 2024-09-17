"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { BusinessInvitationEmail } from "../emails/Businessinvitation";
import { Resend } from "resend";
import { internal } from "../_generated/api";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const createBusinessInvitation = action({
  args: {
    email: v.string(),
    businessName: v.string(),
    businessDomain: v.string(),
  },
  handler: async (ctx, { businessName, businessDomain, email }) => {
    await ctx.runQuery(internal.helper.index.isSysAdmin);

    const token = await ctx.runMutation(
      internal.Businesses.businessInvitation.createInvitation,
      {
        businessDomain,
        businessName,
        email,
      }
    );

    const invitationLink = process.env.ENVIRONMENT === 'development' ? `${process.env.SITE_URL}/${businessDomain}/accept-business-invitation?token=${token}`: `${businessDomain}.${process.env.SITE_URL}/accept-business-invitation?token=${token}`;
    // await sendbusinessEmail
    let res = await resend.emails.send({
      from:  process.env.AUTH_EMAIL ?? "My App <onboarding@resend.dev>",
      to: "shujaagideon@gmail.com",
      // to: args.email,
      subject: `Invitation to create ${businessName} on our platform`,
      react: BusinessInvitationEmail({
        invitationLink,
        businessName: businessName,
      }),
    });

    console.log(res)

    return {
      message: "success"
    };
  },
});
