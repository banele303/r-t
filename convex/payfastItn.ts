import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const handleITN = mutation({
  args: {
    m_payment_id: v.string(),
    pf_payment_id: v.string(),
    payment_status: v.string(),
  },
  handler: async (ctx, args) => {
    const orderId = args.m_payment_id as any;
    const order = await ctx.db.get(orderId);
    if (!order) return { success: false, message: "Order not found" };

    if (args.payment_status === "COMPLETE") {
      await ctx.db.patch(orderId, {
        status: "paid",
        payfast_payment_id: args.pf_payment_id,
        payment_status: args.payment_status,
      });
    } else {
      await ctx.db.patch(orderId, {
        payment_status: args.payment_status,
      });
    }
    return { success: true };
  },
});
