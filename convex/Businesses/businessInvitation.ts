import { internalMutation, mutation, query } from "../_generated/server";
import { v } from "convex/values";


export const createInvitation = internalMutation({
  args: {
    email: v.string(),
    businessName: v.string(),
    businessDomain: v.string(),
  },
  handler: async (ctx, args) => {

    const token = Math.random().toString(36).substr(2, 10);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now


    const invitationId = await ctx.db.insert("businessInvitations", {
      email: args.email,
      // email: "shujaagideon@gmail.com",
      token,
      businessName: args.businessName,
      businessDomain: args.businessDomain,
      expiresAt,
    });

    return token;
  },
});

export const getInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("businessInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      return null;
    }

    return invitation;
  },
});

export const acceptInvitation = mutation({
  args: { 
    token: v.string(),
    adminName: v.string(),
    image: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("businessInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      throw new Error("Invalid or expired invitation");
    }

    // Create the business
    const businessId = await ctx.db.insert("businesses", {
        name: invitation.businessName,
        domain: invitation.businessDomain,
        authStrategies: ["OTP"],
        image: args.image
    });

    // Create the admin user
    const userId = await ctx.db.insert("users", {
      name: args.adminName,
      email: invitation.email,
      businessId,
      role: "admin",
      emailVerificationTime: Date.now()
    });

    // Update the business with the admin user reference
    await ctx.db.patch(businessId, { adminUserId: userId });

    // Delete the invitation
    await ctx.db.delete(invitation._id);

    return { businessId, userId };
  },
});

export const generateBusinessUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});