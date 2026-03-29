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

    return entry !== null || user.role === "superadmin";
  },
});

// ── SuperAdmin query: is the currently-logged-in user the Overall Admin? ──────
export const isSuperAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const user = await ctx.db.get(userId);
    if (!user) return false;

    return user.role === "superadmin" || user.email === "alexsouthflow2@gmail.com"; 
  },
});

// ── Reusable server-side guard for Admin ─────────────────────────────────────
export async function requireAdmin(ctx: MutationCtx | QueryCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Unauthorized: not logged in.");

  const user = await ctx.db.get(userId);
  if (!user?.email) throw new Error("Unauthorized: no email on account.");
  if (user.isBlocked) throw new Error("Unauthorized: your account is blocked.");

  const entry = await ctx.db
    .query("adminAllowlist")
    .withIndex("by_email", (q: any) => q.eq("email", user.email as string))
    .first();

  if (!entry && user.role !== "superadmin") throw new Error("Forbidden: you are not an admin.");
  return user;
}

// ── SuperAdmin guard (call from management mutations) ───────────────────────
export async function requireSuperAdmin(ctx: MutationCtx | QueryCtx) {
  const userId = await auth.getUserId(ctx);
  if (!userId) throw new Error("Unauthorized: not logged in.");

  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Unauthorized: no user record.");
  if (user.isBlocked) throw new Error("Unauthorized: your account is blocked.");

  const isSuper = user.role === "superadmin" || user.email === "alexsouthflow2@gmail.com";
  if (!isSuper) throw new Error("Forbidden: you are not a super admin.");
  return user;
}


// ── List all users (callable from superadmin dashboard) ──────────────────────
export const listAllUsers = query({
  args: { 
    searchQuery: v.optional(v.string()) 
  },
  handler: async (ctx, { searchQuery }) => {
    await requireAdmin(ctx); // Only admins can see user list
    
    let users = await ctx.db.query("users").collect();
    
    // Filter if search query provided
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      users = users.filter(u => 
        (u.name?.toLowerCase().includes(lowerQuery)) || 
        (u.email?.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Fetch admin allowlist to mark who is an admin
    const adminAllowlist = await ctx.db.query("adminAllowlist").collect();
    const adminEmails = new Set(adminAllowlist.map(a => a.email));

    return users.map(user => ({
      ...user,
      isAdmin: adminEmails.has(user.email ?? "") || user.role === "superadmin" || user.role === "admin",
      isSuperAdmin: user.role === "superadmin" || user.email === "alexsouthflow2@gmail.com"
    }));
  },
});

// ── Toggle user block status ───────────────────────────────────────────────
export const toggleUserBlock = mutation({
  args: { userId: v.id("users"), block: v.boolean() },
  handler: async (ctx, { userId, block }) => {
    await requireSuperAdmin(ctx); // Only superadmins can block users

    const userToBlock = await ctx.db.get(userId);
    if (!userToBlock) throw new Error("User not found.");

    // Cannot block yourself
    const currentUserId = await auth.getUserId(ctx);
    if (userId === currentUserId) throw new Error("Cannot block yourself.");

    await ctx.db.patch(userId, { isBlocked: block });
    return { success: true };
  },
});

// ── Promote/Demote User Role ───────────────────────────────────────────────
export const updateUserRole = mutation({
  args: { userId: v.id("users"), role: v.optional(v.string()) },
  handler: async (ctx, { userId, role }) => {
    await requireSuperAdmin(ctx);

    const targetUser = await ctx.db.get(userId);
    if (!targetUser) throw new Error("User not found.");

    // Update role
    await ctx.db.patch(userId, { role });

    // Sync with admin allowlist if making admin
    if (role === "admin" || role === "superadmin") {
      if (targetUser.email) {
        const existing = await ctx.db
          .query("adminAllowlist")
          .withIndex("by_email", (q) => q.eq("email", targetUser.email!))
          .first();
        if (!existing) {
          await ctx.db.insert("adminAllowlist", {
            email: targetUser.email,
            addedAt: new Date().toISOString(),
          });
        }
      }
    } else {
      // Remove from admin allowlist if role is "user" or null
      if (targetUser.email) {
        const existing = await ctx.db
          .query("adminAllowlist")
          .withIndex("by_email", (q) => q.eq("email", targetUser.email!))
          .first();
        if (existing) {
          await ctx.db.delete(existing._id);
        }
      }
    }

    return { success: true };
  },
});

// ── Seed admin allowlist (safe to run multiple times – idempotent) ───────────
export const seedAdmins = mutation({
  args: {},
  handler: async (ctx) => {
    const superAdminEmail = "alexsouthflow2@gmail.com";
    const adminEmails = [
      superAdminEmail,
      "randtstore67@gmail.com",
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
      }
      
      // Also update the user record if it exists
      const user = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", email)).first();
      if (user) {
        await ctx.db.patch(user._id, { 
          role: email === superAdminEmail ? "superadmin" : "admin" 
        });
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

    // If user exists, update their role too
    const user = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", email)).first();
    if (user) {
      await ctx.db.patch(user._id, { role: "admin" });
    }

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

    // Update user role if exists
    const user = await ctx.db.query("users").withIndex("email", (q) => q.eq("email", email)).first();
    if (user && user.role !== "superadmin") {
      await ctx.db.patch(user._id, { role: "user" });
    }

    return { success: true };
  },
});


