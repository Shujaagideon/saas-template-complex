import { Resend } from "resend";
import {
  httpAction,
  internalQuery,
  mutation,
  query,
} from "../_generated/server";
import { v } from "convex/values";
import { OrgsUserInvitationEmail } from "../emails/OrgsUserInvitation";
import { Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const createOrgs = mutation({
  args: {
    name: v.string(),
    domain: v.string(),
    authStrategies: v.array(v.string()),
    customConfig: v.any(),
  },
  handler: async (ctx, args) => {
    const businessId = await ctx.db.insert("organisations", args);
    return businessId;
  },
});

export const getOrganisationByDomain = internalQuery({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organisations")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .unique();
  },
});

export const createOrgsUserInvitation = mutation({
  args: {
    email: v.string(),
    role: v.string(),
    organisationDomain: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not Authenticated!");
    }

    const organisation = await ctx.db
      .query("organisations")
      .withIndex("by_domain", (q) => q.eq("domain", args.organisationDomain))
      .unique();

    if (!organisation) throw new Error("Organisation not found");

    let userRole = await ctx.db
      .query("userRole")
      .withIndex("org_user", (q) =>
        q.eq("organisationId", organisation._id).eq("userId", userId)
      )
      .first();

    if (!userRole || userRole.role !== "Admin") {
      throw new Error("Not Authorized!");
    }

    const token = Math.random().toString(36).substr(2, 10);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    const invitationId = await ctx.db.insert("organisationUserInvitations", {
      email: args.email,
      token,
      organisationId: organisation._id,
      role: args.role,
      expiresAt,
    });

    const invitationLink =
      process.env.NODE_ENV === "production"
        ? `https://${args.organisationDomain}.${process.env.SITE_URL}/accept-organisation-invitation?token=${token}`
        : `http://${args.organisationDomain}.localhost:3000/accept-organisation-invitation?token=${token}`;

    // Send invitation email
    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: args.email,
      subject: `Invitation to join ${organisation.name}`,
      react: OrgsUserInvitationEmail({
        invitationLink,
        orgName: organisation.name,
      }),
    });

    return invitationId;
  },
});

export const getOrgsUserInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("organisationUserInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      return null;
    }

    return invitation;
  },
});

export const acceptOrganisationUserInvitation = mutation({
  args: {
    token: v.string(),
    name: v.string(),
    organisationDomain: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not Authenticated!");
    }

    const user = await ctx.db.get(userId);

    await ctx.db.patch(userId, {
      name: args.name,
    });

    const invitation = await ctx.db
      .query("organisationUserInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      throw new Error("Invalid or expired invitation");
    }
    if (invitation.email !== user?.email) {
      throw new Error("Email mismatch");
    }

    const organisation = await ctx.db
      .query("organisations")
      .withIndex("by_domain", (q) => q.eq("domain", args.organisationDomain))
      .unique();

    if (!organisation) throw new Error("Organisation not found");

    await ctx.db.patch(organisation._id, {
      staff: [...(organisation.staff as unknown as Id<"users">[]), userId],
    });

    // Delete the invitation
    await ctx.db.delete(invitation._id);

    return userId;
  },
});

export const checkOrganinsationSubdomain = httpAction(async (ctx, req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();

  const { bizzSubdomain } = body;

  // Check if the provided token matches the secret token
  if (!bizzSubdomain) {
    return new Response(JSON.stringify({ message: "no subdomain" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check if a businessDomain already exists
    const existingBizzSubdomain = await ctx.runQuery(
      internal.Organisation.organisations.getOrganisationByDomain,
      { domain: bizzSubdomain }
    );

    if (existingBizzSubdomain) {
      return new Response(JSON.stringify({ message: existingBizzSubdomain }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ message: "Does not exist" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error getting subdomain:", error);
    return new Response(
      JSON.stringify({ message: "Error getting subdomain" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
