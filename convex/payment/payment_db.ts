// convex/db.ts

import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createTransaction = mutation({
  args: {
    userId: v.string(),
    type: v.union(v.literal("one-time"), v.literal("subscription")),
    amount: v.number(),
    currency: v.string(),
    email: v.string(),
    productId: v.optional(v.string()),
    planId: v.optional(v.string()),
    paystackReference: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
    metadata: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert("transactions", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return transactionId;
  },
});

export const updateTransactionStatus = mutation({
  args: {
    paystackReference: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    const transaction = await ctx.db
      .query("transactions")
      .withIndex("by_paystackReference", (q) => q.eq("paystackReference", args.paystackReference))
      .first();

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    await ctx.db.patch(transaction._id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const createSubscription = mutation({
  args: {
    userId: v.string(),
    planId: v.string(),
    amount: v.number(),
    currency: v.string(),
    interval: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly"), v.literal("yearly")),
    paystackCustomerCode: v.string(),
    paystackSubscriptionCode: v.string(),
    metadata: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    const subscriptionId = await ctx.db.insert("subscriptions", {
      ...args,
      status: "active",
      startDate: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return subscriptionId;
  },
});

export const updateSubscriptionStatus = mutation({
  args: {
    paystackSubscriptionCode: v.string(),
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("expired")),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_paystackSubscriptionCode", (q) => q.eq("paystackSubscriptionCode", args.paystackSubscriptionCode))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.patch(subscription._id, {
      status: args.status,
      updatedAt: Date.now(),
      ...(args.status === "canceled" ? { canceledAt: Date.now() } : {}),
    });
  },
});