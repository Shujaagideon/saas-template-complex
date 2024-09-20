import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organisation = {
  organisationInvitations: defineTable({
    email: v.string(),
    token: v.string(),
    organisationName: v.string(),
    organisationDomain: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  organisations: defineTable({
    name: v.string(),
    domain: v.string(),
    authStrategies: v.optional(v.array(v.string())),
    adminUserId: v.optional(v.id("users")),
    image: v.optional(v.string()),
    staff: v.optional(v.array(v.id("users")))
  }).index("by_domain", ["domain"])
  .index("by_staff", ["staff"]),

  organisationUserInvitations: defineTable({
    email: v.string(),
    token: v.string(),
    organisationId: v.id("organisations"),
    role: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ['token']),
};
