import { ConvexError } from "convex/values";
import { QueryCtx, MutationCtx } from "../_generated/server";

type AuthenticatedContext = QueryCtx | MutationCtx;

export async function authenticatedFunction<T>(
  ctx: AuthenticatedContext,
  businessDomain: string,
  action: (userId: string, businessId: string) => Promise<T>
): Promise<T> {
  const session = await ctx.auth.getUserIdentity();
  if (!session) {
    throw new ConvexError("Not authenticated");
  }

  const business = await ctx.db
    .query("businesses")
    .withIndex("by_domain", (q) => q.eq("domain", businessDomain))
    .first();

  if (!business) {
    throw new ConvexError("Business not found");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_email_and_business", (q) => 
      q.eq("email", session.email).eq("businessId", business._id)
    )
    .first();

  if (!user) {
    throw new ConvexError("User not found for this business");
  }

  return action(user._id, business._id);
}