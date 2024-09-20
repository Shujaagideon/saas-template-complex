import { error } from 'console';
import { ConvexError } from "convex/values";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";

type AuthenticatedContext = QueryCtx | MutationCtx;

export async function authenticatedFunction<T>(
  ctx: AuthenticatedContext,
  businessDomain: string,
  action: (userId: Id<"users">, businessId: Id<"organisations">) => Promise<T>
): Promise<T | {error: string}> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Client is not authenticated!")
  }

  const business = await ctx.db
    .query("organisations")
    .withIndex("by_domain", (q) => q.eq("domain", businessDomain))
    .first();

  if (!business) {
    throw new ConvexError("Business not found");
  }

  const userProfile = await ctx.db.get(userId);

  const user = business.staff?.includes(userProfile!._id)

  if (!user) {
    return { error: "Not a staff member yet please requset access" };
  }

  return action(userProfile!._id, business._id);
}