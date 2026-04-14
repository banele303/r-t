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

// Create simple order
export const create = mutation({
  args: {
    userId: v.any(), // Use v.any() to avoid ID vs string issues
    customerName: v.string(),
    customerEmail: v.string(),
    total: v.number(),
    status: v.string(),
    items: v.array(v.object({
      productId: v.any(), // Use v.any() to handle potential ID format issues
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    paymentMethod: v.optional(v.string()),
    eftReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("Creating order for:", args.customerEmail);
    try {
      // Ensure IDs are strings for the schema if needed, or let v.id handle it if cast correctly
      const orderId = await ctx.db.insert("orders", {
        userId: args.userId.toString(),
        customerName: args.customerName,
        customerEmail: args.customerEmail,
        total: args.total,
        status: args.status,
        items: args.items.map((item: any) => ({
          productId: item.productId as any,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        createdAt: new Date().toISOString(),
        paymentMethod: args.paymentMethod,
        eftReference: args.eftReference,
      });
      console.log("Order created successfully:", orderId);
      return orderId;
    } catch (error) {
      console.error("Error inserting order into database:", error);
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  },
});
