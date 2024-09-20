"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { OrganisationInvitationEmail } from "../emails/Organisationinvitation";
import { internal } from "../_generated/api";
import { sendEmail } from "../helper/sendMail";

export const createOrgInvitation = action({
  args: {
    email: v.string(),
    organisationName: v.string(),
    organisationDomain: v.string(),
  },
  handler: async (ctx, { organisationName, organisationDomain, email }) => {
    await ctx.runQuery(internal.helper.index.isSysAdmin);

    const organisation = await ctx.runMutation(
      internal.Organisation.organisationInvitation.createInvitation,
      {
        organisationDomain,
        organisationName,
        email,
      }
    );

    const invitationLink =
      process.env.NODE_ENV === "production"
        ? `https://${organisationDomain}.${process.env.SITE_URL}/accept-organisation-invitation?token=${organisation.token}`
        : `http://${organisationDomain}.localhost:3000/accept-organisation-invitation?token=${organisation.token}`;

    await sendEmail(
      email,
      `Invitation to create ${organisationName} on our platform`,
      OrganisationInvitationEmail({
        invitationLink,
        organisationName: organisationName,
      })
    );

    return {
      message: "success",
    };
  },
});
