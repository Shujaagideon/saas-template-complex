import { defineTable } from "convex/server";
import { v } from "convex/values";

export const bizz = {
  businessInvitations: defineTable({
    email: v.string(),
    token: v.string(),
    businessName: v.string(),
    businessDomain: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  businesses: defineTable({
    name: v.string(),
    domain: v.string(),
    authStrategies: v.array(v.string()),
    adminUserId: v.optional(v.id("users")),
    image: v.optional(v.string()),
  }).index("by_domain", ["domain"]),

  businessUserInvitations: defineTable({
    email: v.string(),
    token: v.string(),
    businessId: v.id("businesses"),
    role: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ['token']),
};
