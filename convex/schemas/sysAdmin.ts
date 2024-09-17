import { defineTable } from "convex/server";
import { v } from "convex/values";


export const sysAdmin = {
    systemAdmins: defineTable({
        email: v.string(),
        name: v.string(),
    }).index("by_email", ["email"])
}