import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Custom fields for admin management
    isBlocked: v.optional(v.boolean()),
    role: v.optional(v.string()), // "user", "admin", "superadmin"
  }).index("email", ["email"])
    .index("phone", ["phone"]),
  products: defineTable({
    name: v.string(),
    brand: v.string(),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    imageId: v.string(),
    additionalImageIds: v.optional(v.array(v.string())),
    category: v.string(),
    subCategory: v.optional(v.string()),
    tag: v.optional(v.string()),
    description: v.optional(v.string()),
    isPromo: v.optional(v.boolean()),
    isTrending: v.optional(v.boolean()),
    stock: v.optional(v.number()),
    // Sale & variants
    isOnSale: v.optional(v.boolean()),
    saleEndsAt: v.optional(v.string()),   // ISO date string
    colors: v.optional(v.array(v.string())),
    colorImages: v.optional(v.array(v.object({
      color: v.string(),
      imageId: v.string(),
    }))),
    sizes: v.optional(v.array(v.string())),
    sizePrices: v.optional(v.array(v.object({
      size: v.string(),
      price: v.number(),
      oldPrice: v.optional(v.number()),
    }))),
  }).searchIndex("search_name", { searchField: "name" }),
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    imageId: v.optional(v.string()),
  }),
  subcategories: defineTable({
    name: v.string(),
    parentCategory: v.string(), // e.g. "Apple", "Samsung"
    description: v.optional(v.string()),
    icon: v.optional(v.string()),  // emoji icon
    imageUrl: v.optional(v.string()), // Added for premium product images
  }).index("by_parent", ["parentCategory"]),
  reviews: defineTable({
    productId: v.id("products"),
    userName: v.string(),
    rating: v.number(),
    comment: v.string(),
    date: v.string(),
  }).index("by_product", ["productId"]),
  // Admin allowlist – emails stored here are granted admin role
  adminAllowlist: defineTable({
    email: v.string(),
    addedAt: v.string(),
  }).index("by_email", ["email"]),

  orders: defineTable({
    userId: v.string(), // can be Clerk/BetterAuth ID or email
    customerName: v.string(),
    customerEmail: v.string(),
    total: v.number(),
    status: v.string(), // "pending", "processing", "shipped", "delivered", "cancelled"
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    createdAt: v.string(),
    payfast_payment_id: v.optional(v.string()),
    payment_status: v.optional(v.string()),
    paymentMethod: v.optional(v.string()), // "card" or "eft"
    eftReference: v.optional(v.string()),  // Customer's EFT/deposit reference
  }).index("by_userId", ["userId"]),
});
