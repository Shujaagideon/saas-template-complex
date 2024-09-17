import { Resend } from "resend";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { BusinessUserInvitationEmail } from "../emails/BusinessUserInvitation";
import { Id } from "../_generated/dataModel";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const createBusiness = mutation({
  args: {
    name: v.string(),
    domain: v.string(),
    authStrategies: v.array(v.string()),
    customConfig: v.any()
  },
  handler: async (ctx, args) => {
    const businessId = await ctx.db.insert("businesses", args);
    return businessId;
  },
});

export const getBusinessByDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();
  },
});

export const createBusinessUserInvitation = mutation({
  args: {
    email: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email))
      .unique();

    if (!user || user.role !== "admin") throw new Error("Unauthorized");

    const business = await ctx.db.get(user.businessId as unknown as Id<"businesses">);
    if (!business) throw new Error("Business not found");

    const token = Math.random().toString(36).substr(2, 10);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now

    const invitationId = await ctx.db.insert("businessUserInvitations", {
      email: args.email,
      token,
      businessId: business._id,
      role: args.role,
      expiresAt,
    });

    const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept-business-invitation?token=${token}`;

    // Send invitation email
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: args.email,
      subject: `Invitation to join ${business.name}`,
      react: BusinessUserInvitationEmail({ invitationLink, businessName: business.name }),
    });

    return invitationId;
  },
});

export const getBusinessUserInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("businessUserInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      return null;
    }

    return invitation;
  },
});

export const acceptBusinessUserInvitation = mutation({
  args: { 
    token: v.string(),
    name: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("businessUserInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invitation || invitation.expiresAt < Date.now()) {
      throw new Error("Invalid or expired invitation");
    }

    // Create the user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: invitation.email,
      businessId: invitation.businessId,
      role: invitation.role,
    });

    // Delete the invitation
    await ctx.db.delete(invitation._id);

    return userId;
  },
});