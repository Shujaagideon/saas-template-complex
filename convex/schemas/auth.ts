import { authTables } from "@convex-dev/auth/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const auth = {
  ...authTables,

  sessions: defineTable({
    userId: v.id("users"),
    expires: v.number(),
    businessId: v.id("businesses"),
  }).index("by_userId_and_business", ["userId", "businessId"]),

  accounts: defineTable({
    userId: v.id("users"),
    businessId: v.id("businesses"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
  }).index("by_provider_account_id_and_business", [
    "provider",
    "providerAccountId",
    "businessId",
  ]),

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    businessId: v.optional(v.id("businesses")),
    role: v.optional(v.string()), // e.g., "admin", "user", etc.
  })
    .index("by_email_and_business", ["email", "businessId"])
    .index("email", ["email"]),
};
