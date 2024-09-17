import { getAuthUserId } from "@convex-dev/auth/server";
import { internalQuery } from "../_generated/server";

export const isSysAdmin = internalQuery({
  handler: async (ctx) => {
    // Check if the current user is a system admin
    const user = await getAuthUserId(ctx);
    if (user === null) {
      throw new Error("Client is not authenticated!");
    }

    const isSystemAdmin = await ctx.db.get(user);

    if (!isSystemAdmin) throw new Error("Unauthorized");
  },
});
