import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const createInvitation = internalMutation({
  args: {
    email: v.string(),
    organisationName: v.string(),
    organisationDomain: v.string(),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db
      .query("organisations")
      .withIndex("by_domain", (q) => q.eq("domain", args.organisationDomain))
      .unique();

    if (organisation) {
      throw new ConvexError("Organisation Exists!");
    }

    const token = Math.random().toString(36).substr(2, 10);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    await ctx.db.insert("organisationInvitations", {
      email: args.email,
      token,
      organisationName: args.organisationName,
      organisationDomain: args.organisationDomain,
      expiresAt,
    });

    // Create the organisation
    await ctx.db.insert("organisations", {
      name: args.organisationName,
      domain: args.organisationDomain,
    });

    return { token };
  },
});

export const getInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Not Authenticated!");
    }

    const user = await ctx.db.get(userId);

    const invitation = await ctx.db
      .query("organisationInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      return {error : "No invitation present"};
    }

    console.log(user?.email, invitation.email)

    if(user?.email !== invitation.email){
      return {error : "Please use same email you got the token from to log in"};
    }

    return invitation;
  },
});

export const acceptInvitation = mutation({
  args: {
    token: v.string(),
    adminName: v.string(),
    organisationDomain: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return {error : "Not Authenticated!"};
    }

    const user = await ctx.db.get(userId);

    const invitation = await ctx.db
      .query("organisationInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      return {error : "Invalid or expired invitation"};
    }

    if (invitation.email !== user?.email) {
      return {error : "Email mismatch"};
    }

    const organisation = await ctx.db
      .query("organisations")
      .withIndex("by_domain", (q) => q.eq("domain", args.organisationDomain))
      .unique();

    if (!organisation) {
      return {error:"No organisation found"}
    }

    await ctx.db.insert("userRole", {
      organisationId: organisation._id,
      userId: userId,
      role: "Admin",
    });

    // Update the organisation with the admin user reference
    await ctx.db.patch(organisation._id, {
      adminUserId: userId,
      staff: [userId],
      image: args.image,
    });

    // Delete the invitation
    await ctx.db.delete(invitation._id);

    return { organisationId: organisation._id, userId };
  },
});

export const generateOrganisationUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
