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
    siteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Use the siteUrl passed from the frontend (where NEXT_PUBLIC_SITE_URL is available at build time)
    // Fall back to env var if available, then to empty string
    const siteUrl = args.siteUrl || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "";
    
    console.log(`[PayFast] Request for Order: ${args.orderId}`);
    console.log(`[PayFast] Mode: ${PAYFAST_MODE} (IS_LIVE: ${IS_LIVE})`);
    console.log(`[PayFast] Target URL: ${PAYFAST_BASE_URL}`);
    console.log(`[PayFast] Site URL for redirects: ${siteUrl}`);

    // Construct data with trimmed values

    const data: any = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${siteUrl}/checkout/success?orderId=${args.orderId}`,
      cancel_url: `${siteUrl}/checkout/cancel?orderId=${args.orderId}`,
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
