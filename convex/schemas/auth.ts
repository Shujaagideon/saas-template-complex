import { authTables } from "@convex-dev/auth/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const auth = {
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),

  userRole: defineTable({
    organisationId: v.id('organisations'),
    userId: v.id('users'),
    role: v.string()
  }).index("org_user", ["organisationId", "userId"])
};
