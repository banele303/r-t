import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    productId: v.id("products"),
    userName: v.string(),
    rating: v.number(),
    comment: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});
