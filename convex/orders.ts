import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all orders sorted by date
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

// Update order status
export const updateStatus = mutation({
  args: { 
    id: v.id("orders"), 
    status: v.string() 
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return { success: true };
  },
});

// Create simple order (for future use from frontend)
export const create = mutation({
  args: {
    userId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    total: v.number(),
    status: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      ...args,
      createdAt: new Date().toISOString(),
    });
    return orderId;
  },
});
