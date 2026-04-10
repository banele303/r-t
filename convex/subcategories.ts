import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/** Get all subcategories */
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subcategories").order("asc").collect();
  },
});

/** Get subcategories for a specific parent category */
export const getByParent = query({
  args: { parentCategory: v.string() },
  handler: async (ctx, { parentCategory }) => {
    return await ctx.db
      .query("subcategories")
      .withIndex("by_parent", (q) => q.eq("parentCategory", parentCategory))
      .collect();
  },
});

/**
 * Returns a map of { parentCategory -> subcategories[] }
 */
export const getTree = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("subcategories").order("asc").collect();
    const tree: Record<string, typeof all> = {};
    for (const sub of all) {
      if (!tree[sub.parentCategory]) tree[sub.parentCategory] = [];
      tree[sub.parentCategory].push(sub);
    }
    return tree;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    parentCategory: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subcategories", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("subcategories"),
    name: v.optional(v.string()),
    parentCategory: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, args);
    return { success: true };
  },
});

export const remove = mutation({
  args: { id: v.id("subcategories") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

/** Seed all subcategories — Clean/Minimalist version (No photographic images) */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("subcategories").collect();
    for (const sub of existing) {
      await ctx.db.delete(sub._id);
    }

    const data: { name: string; parentCategory: string; icon: string; description: string }[] = [
      // ── Apple ──────────────────────────────────────────────
      { parentCategory: "Apple", name: "iPhone",        icon: "📱", description: "Smartphones" },
      { parentCategory: "Apple", name: "Mac",           icon: "💻", description: "Laptops" },
      { parentCategory: "Apple", name: "iPad",          icon: "📲", description: "Tablets" },
      { parentCategory: "Apple", name: "Watch",         icon: "⌚", description: "Wearables" },
      { parentCategory: "Apple", name: "AirPods",       icon: "🎧", description: "Audio" },
      
      // ── Samsung ─────────────────────────────────────────────
      { parentCategory: "Samsung", name: "Galaxy S",     icon: "📱", description: "Flagships" },
      { parentCategory: "Samsung", name: "Galaxy Fold",  icon: "📂", description: "Foldables" },
      { parentCategory: "Samsung", name: "Galaxy Tab",   icon: "📲", description: "Tablets" },
      { parentCategory: "Samsung", name: "Galaxy Buds",  icon: "🎧", description: "Audio" },
    ];

    let count = 0;
    for (const item of data) {
      await ctx.db.insert("subcategories", item);
      count++;
    }
    return { seeded: true, count };
  },
});
