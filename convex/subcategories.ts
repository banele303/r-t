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
 * Used by the Navbar mega-menu so it only makes one query.
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

/** Seed all subcategories — idempotent: skips if already exist */
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("subcategories").collect();
    if (existing.length > 0) return { skipped: true, count: existing.length };

    const data: { name: string; parentCategory: string; icon: string; description: string }[] = [
      // ── Apple ──────────────────────────────────────────────
      { parentCategory: "Apple", name: "iPhone",        icon: "📱", description: "All iPhone models from SE to Pro Max" },
      { parentCategory: "Apple", name: "Mac",           icon: "💻", description: "MacBook Air, MacBook Pro, Mac Mini, iMac & Mac Studio" },
      { parentCategory: "Apple", name: "iPad",          icon: "📲", description: "iPad, iPad Air, iPad Pro & iPad mini" },
      { parentCategory: "Apple", name: "Apple Watch",   icon: "⌚", description: "Apple Watch Series, SE & Ultra" },
      { parentCategory: "Apple", name: "AirPods",       icon: "🎧", description: "AirPods, AirPods Pro & AirPods Max" },
      { parentCategory: "Apple", name: "Apple TV",      icon: "📺", description: "Apple TV 4K streaming devices" },
      { parentCategory: "Apple", name: "HomePod",       icon: "🔊", description: "HomePod mini & full-size smart speakers" },
      { parentCategory: "Apple", name: "Accessories",   icon: "🔌", description: "Apple-branded cables, cases & chargers" },

      // ── Samsung ─────────────────────────────────────────────
      { parentCategory: "Samsung", name: "Galaxy S Series",   icon: "📱", description: "Galaxy S flagship smartphones" },
      { parentCategory: "Samsung", name: "Galaxy A Series",   icon: "📱", description: "Galaxy A mid-range smartphones" },
      { parentCategory: "Samsung", name: "Galaxy Z Fold",     icon: "📱", description: "Foldable flagship smartphones" },
      { parentCategory: "Samsung", name: "Galaxy Z Flip",     icon: "📱", description: "Compact flip foldable phones" },
      { parentCategory: "Samsung", name: "Galaxy Tab",        icon: "📲", description: "Samsung tablets & S-Pen devices" },
      { parentCategory: "Samsung", name: "Galaxy Watch",      icon: "⌚", description: "Galaxy Watch series & Galaxy Fit" },
      { parentCategory: "Samsung", name: "Galaxy Buds",       icon: "🎧", description: "Galaxy Buds true-wireless earbuds" },
      { parentCategory: "Samsung", name: "Samsung TV",        icon: "📺", description: "QLED, Neo QLED & The Frame TVs" },
      { parentCategory: "Samsung", name: "Accessories",       icon: "🔌", description: "Samsung cases, chargers & covers" },

      // ── Huawei ──────────────────────────────────────────────
      { parentCategory: "Huawei", name: "P Series",          icon: "📱", description: "Huawei P flagship smartphones" },
      { parentCategory: "Huawei", name: "Mate Series",       icon: "📱", description: "Huawei Mate premium smartphones" },
      { parentCategory: "Huawei", name: "Nova Series",       icon: "📱", description: "Huawei Nova mid-range phones" },
      { parentCategory: "Huawei", name: "MatePad",           icon: "📲", description: "Huawei MatePad tablets" },
      { parentCategory: "Huawei", name: "Watch GT",          icon: "⌚", description: "Huawei Watch GT series" },
      { parentCategory: "Huawei", name: "FreeBuds",          icon: "🎧", description: "Huawei FreeBuds earbuds & headphones" },
      { parentCategory: "Huawei", name: "MateBook",          icon: "💻", description: "Huawei MateBook laptops" },
      { parentCategory: "Huawei", name: "Accessories",       icon: "🔌", description: "Huawei cases, bands & chargers" },

      // ── Honor ────────────────────────────────────────────────
      { parentCategory: "Honor", name: "Honor X Series",    icon: "📱", description: "Honor X mid-range smartphones" },
      { parentCategory: "Honor", name: "Honor Magic Series", icon: "📱", description: "Honor Magic flagship phones" },
      { parentCategory: "Honor", name: "Honor Pad",         icon: "📲", description: "Honor tablets" },
      { parentCategory: "Honor", name: "Honor Watch",       icon: "⌚", description: "Honor smartwatches" },
      { parentCategory: "Honor", name: "Honor Earbuds",     icon: "🎧", description: "Honor wireless earbuds" },
      { parentCategory: "Honor", name: "Accessories",       icon: "🔌", description: "Honor cases & accessories" },

      // ── Xiaomi ───────────────────────────────────────────────
      { parentCategory: "Xiaomi", name: "Xiaomi 14 Series",  icon: "📱", description: "Xiaomi 14 flagship phones" },
      { parentCategory: "Xiaomi", name: "Redmi Note Series", icon: "📱", description: "Redmi Note mid-range phones" },
      { parentCategory: "Xiaomi", name: "Redmi Series",      icon: "📱", description: "Redmi budget smartphones" },
      { parentCategory: "Xiaomi", name: "POCO Series",       icon: "📱", description: "POCO performance phones" },
      { parentCategory: "Xiaomi", name: "Mi Pad",            icon: "📲", description: "Xiaomi Pad tablets" },
      { parentCategory: "Xiaomi", name: "Mi Watch",          icon: "⌚", description: "Xiaomi & Redmi smartwatches" },
      { parentCategory: "Xiaomi", name: "Mi Buds",           icon: "🎧", description: "Xiaomi Buds & Redmi earbuds" },
      { parentCategory: "Xiaomi", name: "Accessories",       icon: "🔌", description: "Xiaomi cases & power banks" },

      // ── Oppo ─────────────────────────────────────────────────
      { parentCategory: "Oppo", name: "Find Series",        icon: "📱", description: "Oppo Find flagship phones" },
      { parentCategory: "Oppo", name: "Reno Series",        icon: "📱", description: "Oppo Reno mid-range phones" },
      { parentCategory: "Oppo", name: "A Series",           icon: "📱", description: "Oppo A budget smartphones" },
      { parentCategory: "Oppo", name: "Oppo Watch",         icon: "⌚", description: "Oppo smartwatches" },
      { parentCategory: "Oppo", name: "Oppo Pad",           icon: "📲", description: "Oppo tablets" },
      { parentCategory: "Oppo", name: "Accessories",        icon: "🔌", description: "Oppo VOOC chargers & cases" },

      // ── Vivo ──────────────────────────────────────────────────
      { parentCategory: "Vivo", name: "V Series",           icon: "📱", description: "Vivo V mid-range smartphones" },
      { parentCategory: "Vivo", name: "X Series",           icon: "📱", description: "Vivo X flagship phones" },
      { parentCategory: "Vivo", name: "Y Series",           icon: "📱", description: "Vivo Y budget phones" },
      { parentCategory: "Vivo", name: "Vivo Watch",         icon: "⌚", description: "Vivo smartwatches" },
      { parentCategory: "Vivo", name: "Accessories",        icon: "🔌", description: "Vivo cases & chargers" },

      // ── Realme ───────────────────────────────────────────────
      { parentCategory: "Realme", name: "Realme GT Series", icon: "📱", description: "Realme GT flagship phones" },
      { parentCategory: "Realme", name: "Realme C Series",  icon: "📱", description: "Realme C budget phones" },
      { parentCategory: "Realme", name: "Realme Number Serie", icon: "📱", description: "Realme mid-range numbered series" },
      { parentCategory: "Realme", name: "Realme Watch",     icon: "⌚", description: "Realme smartwatches" },
      { parentCategory: "Realme", name: "Realme Buds",      icon: "🎧", description: "Realme Buds earphones" },
      { parentCategory: "Realme", name: "Accessories",      icon: "🔌", description: "Realme accessories & power banks" },

      // ── Sony ──────────────────────────────────────────────────
      { parentCategory: "Sony", name: "Xperia 1 Series",   icon: "📱", description: "Sony Xperia 1 flagship phones" },
      { parentCategory: "Sony", name: "Xperia 5 Series",   icon: "📱", description: "Sony Xperia 5 compact flagships" },
      { parentCategory: "Sony", name: "Xperia 10 Series",  icon: "📱", description: "Sony Xperia 10 mid-range phones" },
      { parentCategory: "Sony", name: "WH Headphones",     icon: "🎧", description: "Sony WH over-ear noise-cancelling headphones" },
      { parentCategory: "Sony", name: "WF Earbuds",        icon: "🎧", description: "Sony WF true-wireless earbuds" },
      { parentCategory: "Sony", name: "Accessories",        icon: "🔌", description: "Sony cases & chargers" },

      // ── Nokia ────────────────────────────────────────────────
      { parentCategory: "Nokia", name: "Nokia G Series",   icon: "📱", description: "Nokia G mid-range smartphones" },
      { parentCategory: "Nokia", name: "Nokia C Series",   icon: "📱", description: "Nokia C budget smartphones" },
      { parentCategory: "Nokia", name: "Nokia X Series",   icon: "📱", description: "Nokia X series phones" },
      { parentCategory: "Nokia", name: "Accessories",       icon: "🔌", description: "Nokia cases & accessories" },

      // ── Motorola ─────────────────────────────────────────────
      { parentCategory: "Motorola", name: "Moto G Series",   icon: "📱", description: "Moto G mid-range smartphones" },
      { parentCategory: "Motorola", name: "Moto E Series",   icon: "📱", description: "Moto E budget phones" },
      { parentCategory: "Motorola", name: "Edge Series",     icon: "📱", description: "Motorola Edge flagship phones" },
      { parentCategory: "Motorola", name: "Razr Series",     icon: "📱", description: "Motorola Razr foldable phones" },
      { parentCategory: "Motorola", name: "Accessories",     icon: "🔌", description: "Motorola cases & chargers" },

      // ── Google ───────────────────────────────────────────────
      { parentCategory: "Google", name: "Pixel 9 Series",   icon: "📱", description: "Google Pixel 9 flagship phones" },
      { parentCategory: "Google", name: "Pixel 8 Series",   icon: "📱", description: "Google Pixel 8 phones" },
      { parentCategory: "Google", name: "Pixel Fold",       icon: "📱", description: "Google Pixel Fold foldables" },
      { parentCategory: "Google", name: "Pixel Tablet",     icon: "📲", description: "Google Pixel Tablet" },
      { parentCategory: "Google", name: "Pixel Watch",      icon: "⌚", description: "Google Pixel Watch" },
      { parentCategory: "Google", name: "Pixel Buds",       icon: "🎧", description: "Google Pixel Buds earbuds" },
      { parentCategory: "Google", name: "Accessories",      icon: "🔌", description: "Google Pixel cases & accessories" },

      // ── OnePlus ──────────────────────────────────────────────
      { parentCategory: "OnePlus", name: "OnePlus 12 Series", icon: "📱", description: "OnePlus 12 flagship phones" },
      { parentCategory: "OnePlus", name: "OnePlus Nord",      icon: "📱", description: "OnePlus Nord mid-range phones" },
      { parentCategory: "OnePlus", name: "OnePlus Watch",     icon: "⌚", description: "OnePlus smartwatches" },
      { parentCategory: "OnePlus", name: "OnePlus Buds",      icon: "🎧", description: "OnePlus Buds earphones" },
      { parentCategory: "OnePlus", name: "Accessories",       icon: "🔌", description: "OnePlus accessories & cables" },

      // ── Asus ─────────────────────────────────────────────────
      { parentCategory: "Asus", name: "ROG Phone",          icon: "🎮", description: "Asus ROG gaming smartphones" },
      { parentCategory: "Asus", name: "Zenfone Series",     icon: "📱", description: "Asus Zenfone compact flagships" },
      { parentCategory: "Asus", name: "Accessories",         icon: "🔌", description: "Asus phone cases & gaming accessories" },
    ];

    let count = 0;
    for (const item of data) {
      await ctx.db.insert("subcategories", item);
      count++;
    }
    return { seeded: true, count };
  },
});
