import { v } from "convex/values";
import { query } from "../_generated/server";
import { authenticatedFunction } from "../helper/helper";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { error: "Not authenticated" };
    }

    return userId;
  },
});

export const getUserRole = query({
  args: {
    subDomain: v.string(),
  },
  handler: async (ctx, { subDomain }) => {
    return await authenticatedFunction(
      ctx,
      subDomain,
      async (userId, businessId) => {
        let role = await ctx.db
          .query("userRole")
          .withIndex("org_user", (q) =>
            q.eq("organisationId", businessId).eq("userId", userId)
          )
          .collect();
        if (!role) {
          return { error: "Not a staff member yet please requset access" };
        }

        return role;
      }
    );
  },
});
