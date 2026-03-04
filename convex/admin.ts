import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// ── Public query: is the currently-logged-in user an admin? ──────────────────
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const user = await ctx.db.get(userId);
    if (!user?.email) return false;

    const entry = await ctx.db
      .query("adminAllowlist")
      .withIndex("by_email", (q: any) => q.eq("email", user.email as string))
      .first();

    return entry !== null;
  },
});

// ── Reusable server-side guard (call from other mutations) ───────────────────
export async function requireAdmin(ctx: MutationCtx | QueryCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Unauthorized: not logged in.");

  const user = await ctx.db.get(userId);
  if (!user?.email) throw new Error("Unauthorized: no email on account.");

  const entry = await ctx.db
    .query("adminAllowlist")
    .withIndex("by_email", (q: any) => q.eq("email", user.email as string))
    .first();

  if (!entry) throw new Error("Forbidden: you are not an admin.");
  return user;
}

// ── Seed admin allowlist (safe to run multiple times – idempotent) ───────────
export const seedAdmins = mutation({
  args: {},
  handler: async (ctx) => {
    const adminEmails = [
      "alexsouthflow2@gmail.com",
      // Add more admin emails here if needed
    ];

    for (const email of adminEmails) {
      const existing = await ctx.db
        .query("adminAllowlist")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (!existing) {
        await ctx.db.insert("adminAllowlist", {
          email,
          addedAt: new Date().toISOString(),
        });
        console.log(`✅ Seeded admin: ${email}`);
      } else {
        console.log(`⏭  Already admin: ${email}`);
      }
    }

    return { success: true, seeded: adminEmails };
  },
});

// ── List all admins (callable from admin dashboard) ──────────────────────────
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("adminAllowlist").collect();
  },
});

// ── Add a new admin (only existing admins can call this) ─────────────────────
export const addAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    await requireAdmin(ctx);

    const existing = await ctx.db
      .query("adminAllowlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) return { alreadyExists: true };

    await ctx.db.insert("adminAllowlist", {
      email: email.toLowerCase().trim(),
      addedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

// ── Remove an admin (only existing admins can call this) ─────────────────────
export const removeAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    await requireAdmin(ctx);

    const entry = await ctx.db
      .query("adminAllowlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!entry) return { notFound: true };
    await ctx.db.delete(entry._id);
    return { success: true };
  },
});
