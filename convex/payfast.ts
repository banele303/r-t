import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { crypto } from "node:crypto";

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE!;
const PAYFAST_BASE_URL = process.env.PAYFAST_BASE_URL!;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

// This helper will generate the required signature for PayFast
function generateSignature(data: any, passphrase?: string) {
  let queryString = "";
  Object.keys(data).forEach((key) => {
    if (data[key] !== "") {
      queryString += `${key}=${encodeURIComponent(data[key].toString()).replace(/%20/g, "+")}&`;
    }
  });

  queryString = queryString.substring(0, queryString.length - 1);
  if (passphrase) {
    queryString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
  }

  return crypto.createHash("md5").update(queryString).digest("hex");
}

export const getPaymentData = action({
  args: {
    orderId: v.id("orders"),
    amount: v.number(),
    itemName: v.string(),
    customerEmail: v.string(),
    customerName: v.string(),
  },
  handler: async (ctx, args) => {
    const data: any = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${args.orderId}`,
      cancel_url: `${NEXT_PUBLIC_SITE_URL}/checkout/cancel?orderId=${args.orderId}`,
      notify_url: `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/payfast-itn`,
      email_address: args.customerEmail,
      m_payment_id: args.orderId,
      amount: args.amount.toFixed(2),
      item_name: args.itemName,
    };

    data.signature = generateSignature(data, PAYFAST_PASSPHRASE);
    
    return {
      actionUrl: PAYFAST_BASE_URL,
      fields: data
    };
  },
});

export const handleITN = mutation({
  args: {
    m_payment_id: v.string(),
    pf_payment_id: v.string(),
    payment_status: v.string(),
    // add other fields if needed for verification
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
