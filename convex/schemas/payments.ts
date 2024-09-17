import { defineTable } from "convex/server";
import { v } from "convex/values";

export const payments = {
  transactions: defineTable({
    userId: v.string(),
    type: v.union(v.literal("one-time"), v.literal("subscription")),
    amount: v.number(),
    currency: v.string(),
    email: v.string(),
    productId: v.optional(v.string()),
    planId: v.optional(v.string()),
    paystackReference: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_paystackReference", ["paystackReference"]),

  subscriptions: defineTable({
    userId: v.string(),
    planId: v.string(),
    amount: v.number(),
    currency: v.string(),
    interval: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("expired")
    ),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    paystackCustomerCode: v.string(),
    paystackSubscriptionCode: v.string(),
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_paystackSubscriptionCode", ["paystackSubscriptionCode"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    active: v.boolean(),
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  plans: defineTable({
    name: v.string(),
    description: v.string(),
    amount: v.number(),
    currency: v.string(),
    interval: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    ),
    active: v.boolean(),
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  customer: defineTable({
    code: v.string(),
    email: v.string(),
  }),
};
