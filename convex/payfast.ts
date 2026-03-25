"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import crypto from "crypto";

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID!;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY!;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE!;
const PAYFAST_BASE_URL = process.env.PAYFAST_BASE_URL!;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

// This helper will generate the required signature for PayFast
function generateSignature(data: any, passphrase?: string) {
  let queryString = "";
  Object.keys(data).forEach((key) => {
    if (data[key] !== "" && data[key] !== undefined && data[key] !== null) {
      queryString += `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, "+")}&`;
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
