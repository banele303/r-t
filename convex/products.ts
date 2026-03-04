import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function resolveImageUrl(ctx: any, imageId: string | undefined | null) {
  if (!imageId) return null;
  if (imageId.startsWith("/") || imageId.startsWith("http")) return imageId;
  try {
    return await ctx.storage.getUrl(imageId as any) || imageId;
  } catch (e) {
    return imageId;
  }
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").order("desc").collect();
    
    // Convert storage IDs to fully qualified URLs
    const productsWithUrls = await Promise.all(
      products.map(async (product) => {
        return {
          ...product,
          imageUrl: await resolveImageUrl(ctx, product.imageId),
          additionalImageUrls: product.additionalImageIds 
            ? await Promise.all(product.additionalImageIds.map(id => resolveImageUrl(ctx, id))) 
            : [],
        };
      })
    );
    
    return productsWithUrls;
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    return {
      ...product,
      imageUrl: await resolveImageUrl(ctx, product.imageId),
      additionalImageUrls: product.additionalImageIds 
        ? await Promise.all(product.additionalImageIds.map(id => resolveImageUrl(ctx, id))) 
        : [],
    };
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    brand: v.string(),
    price: v.number(),
    oldPrice: v.optional(v.number()),
    imageId: v.string(),
    additionalImageIds: v.optional(v.array(v.string())),
    category: v.string(),
    tag: v.optional(v.string()),
    description: v.optional(v.string()),
    isPromo: v.optional(v.boolean()),
    isTrending: v.optional(v.boolean()),
    stock: v.optional(v.number()),
    isOnSale: v.optional(v.boolean()),
    saleEndsAt: v.optional(v.string()),
    colors: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    brand: v.optional(v.string()),
    price: v.optional(v.number()),
    oldPrice: v.optional(v.number()),
    imageId: v.optional(v.string()),
    additionalImageIds: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    tag: v.optional(v.string()),
    description: v.optional(v.string()),
    isPromo: v.optional(v.boolean()),
    isTrending: v.optional(v.boolean()),
    stock: v.optional(v.number()),
    isOnSale: v.optional(v.boolean()),
    saleEndsAt: v.optional(v.string()),
    colors: v.optional(v.array(v.string())),
    sizes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { id, ...args }) => {
    await ctx.db.patch(id, args);
    return { success: true };
  },
});

export const updateStock = mutation({
  args: { id: v.id("products"), stock: v.number() },
  handler: async (ctx, { id, stock }) => {
    await ctx.db.patch(id, { stock });
    return { success: true };
  },
});

export const getPromos = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isPromo"), true))
      .order("desc")
      .collect();
    
    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        imageUrl: await resolveImageUrl(ctx, product.imageId),
      }))
    );
  },
});

export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isTrending"), true))
      .order("desc")
      .collect();
    
    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        imageUrl: await resolveImageUrl(ctx, product.imageId),
      }))
    );
  },
});

export const remove = mutation({
  args: { id: v.id("products"), imageId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Also delete the image from storage if it exists
    if (args.imageId) {
      // Small safety check since Convex expects its generic IDs
      try {
        await ctx.storage.delete(args.imageId as any);
      } catch (e) {
        console.warn("Failed to delete associated storage file:", e);
      }
    }
    await ctx.db.delete(args.id);
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm) return [];
    
    const products = await ctx.db
      .query("products")
      .withSearchIndex("search_name", (q) => q.search("name", args.searchTerm))
      .take(5);

    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        imageUrl: await resolveImageUrl(ctx, product.imageId),
      }))
    );
  },
});
export const getRelated = query({
  args: { category: v.string(), currentProductId: v.id("products") },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .filter((q) => 
        q.and(
          q.eq(q.field("category"), args.category),
          q.neq(q.field("_id"), args.currentProductId)
        )
      )
      .take(4);

    // If no related products in the same category, just take the newest products
    if (products.length === 0) {
      products = await ctx.db
        .query("products")
        .filter((q) => q.neq(q.field("_id"), args.currentProductId))
        .order("desc")
        .take(4);
    }

    return await Promise.all(
      products.map(async (product) => ({
        ...product,
        imageUrl: await resolveImageUrl(ctx, product.imageId),
      }))
    );
  },
});

export const getFiltered = query({
  args: {
    category: v.optional(v.string()),
    brand: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    searchTerm: v.optional(v.string()),
    sortBy: v.optional(v.string()),
    isPromo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").order("desc").collect();

    if (args.searchTerm && args.searchTerm.trim() !== "") {
      const term = args.searchTerm.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }
    if (args.category && args.category !== "All") {
      products = products.filter((p) => p.category === args.category);
    }
    if (args.brand && args.brand !== "All") {
      products = products.filter((p) => p.brand === args.brand);
    }
    if (args.minPrice !== undefined) {
      products = products.filter((p) => p.price >= args.minPrice!);
    }
    if (args.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= args.maxPrice!);
    }
    if (args.isPromo) {
      products = products.filter((p) => p.isPromo === true);
    }
    if (args.sortBy === "price_asc") products.sort((a, b) => a.price - b.price);
    else if (args.sortBy === "price_desc") products.sort((a, b) => b.price - a.price);
    else if (args.sortBy === "name_asc") products.sort((a, b) => a.name.localeCompare(b.name));

    return await Promise.all(
      products.map(async (p) => ({
        ...p,
        imageUrl: await resolveImageUrl(ctx, p.imageId),
      }))
    );
  },
});

export const getMeta = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = [...new Set(products.map((p) => p.category))].sort();
    const brands = [...new Set(products.map((p) => p.brand))].sort();
    const maxPrice = Math.max(0, ...products.map((p) => p.price));
    return { categories, brands, maxPrice };
  },
});

