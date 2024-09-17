import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const like = mutation({
    args:{
        likes: v.number()
    },
    handler: async(ctx, args)=> {
        // await ctx.db.insert("likes",{
        //     likes: args.likes
        // })
    },
})