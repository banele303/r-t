"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import crypto from "crypto";

const PAYFAST_MODE = (process.env.PAYFAST_MODE || "test").trim().toLowerCase(); 
const IS_LIVE = PAYFAST_MODE === "live";

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID?.trim() || "";
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY?.trim() || "";
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE?.trim() || "";

// Automatically switch URL based on PAYFAST_MODE
const PAYFAST_BASE_URL = process.env.PAYFAST_BASE_URL?.trim() || (IS_LIVE 
  ? "https://www.payfast.co.za/eng/process" 
  : "https://sandbox.payfast.co.za/eng/process");



const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";


// This helper will generate the required signature for PayFast
function generateSignature(data: any, passphrase?: string) {
  let queryString = "";
  Object.keys(data).forEach((key) => {
    if (data[key] !== "" && data[key] !== undefined && data[key] !== null) {
      // PayFast expects values to be trimmed and URL encoded (+ for spaces)
      const value = data[key].toString().trim();
      queryString += `${key}=${encodeURIComponent(value).replace(/%20/g, "+")}&`;
    }
  });

  // Remove trailing &
  queryString = queryString.substring(0, queryString.length - 1);
  
  // Append passphrase if provided and not empty
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
    console.log(`[PayFast] Request for Order: ${args.orderId}`);
    console.log(`[PayFast] Mode: ${PAYFAST_MODE} (IS_LIVE: ${IS_LIVE})`);
    console.log(`[PayFast] Target URL: ${PAYFAST_BASE_URL}`);

    // Construct data with trimmed values

    const data: any = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${NEXT_PUBLIC_SITE_URL}/checkout/success?orderId=${args.orderId}`,
      cancel_url: `${NEXT_PUBLIC_SITE_URL}/checkout/cancel?orderId=${args.orderId}`,
      notify_url: `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/payfast-itn`,
      email_address: args.customerEmail.trim(),
      m_payment_id: args.orderId,
      amount: args.amount.toFixed(2),
      item_name: args.itemName.trim(),
    };

    // Add test_mode for sandbox
    if (!IS_LIVE) {
      data.test_mode = "1";
    }


    // Calculate signature
    data.signature = generateSignature(data, PAYFAST_PASSPHRASE);
    
    return {
      actionUrl: PAYFAST_BASE_URL,
      fields: data
    };
  },
});
