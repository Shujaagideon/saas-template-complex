import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "../_generated/api";
import { httpAction, internalMutation, internalQuery, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const createSystemAdmin = internalMutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const adminId = await ctx.db.insert("systemAdmins", {
      email: args.email,
      name: args.name,
    });
    return adminId;
  },
});

export const getSystemAdminByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("systemAdmins")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const createBusinessWithAdmin = mutation({
  args: {
    businessName: v.string(),
    businessDomain: v.string(),
    authStrategies: v.array(v.string()),
    adminName: v.string(),
    adminEmail: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the current user is a system admin
    const user = await getAuthUserId(ctx);
    if (user === null) {
      throw new Error("Client is not authenticated!")
    }

    const isSystemAdmin = await ctx.db.get(user)

    if (!isSystemAdmin) throw new Error("Unauthorized");

    // Create the business
    const businessId = await ctx.db.insert("businesses", {
      name: args.businessName,
      domain: args.businessDomain,
      authStrategies: args.authStrategies,
    });

    // Create the admin user
    const userId = await ctx.db.insert("users", {
      name: args.adminName,
      email: args.adminEmail,
      businessId,
      role: "admin",
    });

    // Update the business with the admin user reference
    await ctx.db.patch(businessId, { adminUserId: userId });

    return { businessId, userId };
  },
});

export const listBusinesses = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!")
    }

    const isSystemAdmin = await ctx.db.get(userId)

    if (!isSystemAdmin) throw new Error("Unauthorized");

    let bizzlist = await ctx.db.query("businesses").collect();
    const bizzOwners: { mail: string | undefined; url: string | null; }[] = [];
    bizzlist.map(async bizz => {
      let url = bizz.image ? await ctx.storage.getUrl(bizz.image) : null,
      bizzOwner = await ctx.db.get(bizz.adminUserId as unknown as Id<"users">);

      bizzOwners.push({ mail: bizzOwner?.email, url});
    })

    return {
      bizzlist,
      bizzOwners
    };
  },
});

export const createInitialSysAdmin = httpAction(async(ctx, req)=>{
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await req.json();

  const { email, name, token } = body;

  // Check if the provided token matches the secret token
  if (token !== process.env.INITIAL_ADMIN_SECRET_TOKEN) {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check if a system admin already exists
    const existingAdmin = await ctx.runQuery(internal.systemAdmin.sysAdmin.getSystemAdminByEmail, { email });

    if (existingAdmin) {
      return new Response(JSON.stringify({ message: "System admin already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create the system admin
    await ctx.runMutation(internal.systemAdmin.sysAdmin.createSystemAdmin, { email, name });
    
    return new Response(JSON.stringify({ message: "System admin created successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error creating system admin:', error);
    return new Response(JSON.stringify({ message: "Error creating system admin" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
})
