import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a short-lived upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
