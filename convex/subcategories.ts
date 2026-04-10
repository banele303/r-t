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

/** Seed all subcategories — idempotent: clears and restarts to match user preference */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("subcategories").collect();
    // We clear to ensure we only have the "cool" image-based ones the user wants
    for (const sub of existing) {
      await ctx.db.delete(sub._id);
    }

    const data: { name: string; parentCategory: string; description: string; imageUrl: string }[] = [
      // ── Apple ──────────────────────────────────────────────
      { parentCategory: "Apple", name: "iPhone",        description: "Explore the latest iPhone 15 & 14 models", imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=400" },
      { parentCategory: "Apple", name: "MacBook",       description: "Powerful laptops with Apple Silicon", imageUrl: "https://images.unsplash.com/photo-1517336714460-4c504265538e?auto=format&fit=crop&q=80&w=400" },
      { parentCategory: "Apple", name: "iPad",          description: "Versatile tablets for work and play", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400" },
      { parentCategory: "Apple", name: "Apple Watch",   description: "The ultimate device for a healthy life", imageUrl: "https://images.unsplash.com/photo-1434493907317-a46b53b81832?auto=format&fit=crop&q=80&w=400" },
      { parentCategory: "Apple", name: "AirPods",       description: "Immersive sound and seamless connection", imageUrl: "https://images.unsplash.com/photo-1588423770670-4592871b9cf2?auto=format&fit=crop&q=80&w=400" },
      
      // ── Samsung ─────────────────────────────────────────────
      { parentCategory: "Samsung", name: "Galaxy S",     description: "Experience incredible camera power", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400" },
      { parentCategory: "Samsung", name: "Galaxy Fold",  description: "Unfold your world with massive screens", imageUrl: "https://images.unsplash.com/photo-1678263539744-90be5624773c?auto=format&fit=crop&q=80&w=400" },
      { parentCategory: "Samsung", name: "Galaxy Tab",   description: "Tablets designed for productivity", imageUrl: "https://images.unsplash.com/photo-1589739900243-4b123b729472?auto=format&fit=crop&q=80&w=400" },
    ];

    let count = 0;
    for (const item of data) {
      await ctx.db.insert("subcategories", item);
      count++;
    }
    return { seeded: true, count };
  },
});
