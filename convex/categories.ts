import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query("categories").collect();
    // Sort by order ascending, fallback to name or creation date
    return cats.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageId: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let order = args.order;
    if (order === undefined) {
      const existing = await ctx.db.query("categories").collect();
      order = existing.length > 0 ? Math.max(...existing.map(c => c.order ?? 0)) + 1 : 0;
    }
    return await ctx.db.insert("categories", { ...args, order });
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageId: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, args);
    return { success: true };
  },
});

export const updateOrder = mutation({
  args: {
    orders: v.array(v.object({
      id: v.id("categories"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { order: item.order });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").collect();
    // Clear existing to match the "clean" request
    for (const cat of existing) {
      await ctx.db.delete(cat._id);
    }
    
    const brands = ["Apple", "Samsung", "Drones", "Gaming", "Audio", "Accessories"];
    for (let i = 0; i < brands.length; i++) {
      await ctx.db.insert("categories", { name: brands[i], order: i });
    }
    return { seeded: true, count: brands.length };
  },
});
