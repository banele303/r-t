import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ─── Products ────────────────────────────────────────────────────────────────

const seedProducts = [
  // ── Laptops ──────────────────────────────────────────────────────────────────
  {
    name: "MacBook Pro 14\" M3 Pro",
    brand: "Apple",
    price: 39999,
    oldPrice: 42999,
    imageId: "/macbook_m3.png",
    category: "Laptops",
    tag: "Pro",
    description: "The most advanced Mac laptop for demanding workflows. M3 Pro chip with up to 18-core GPU, Liquid Retina XDR display, and up to 22 hours of battery life.",
    isTrending: true,
    isPromo: true,
    isOnSale: true,
    stock: 15,
    colors: ["Space Black", "Silver"],
  },
  {
    name: "MacBook Air 15\" M3",
    brand: "Apple",
    price: 24999,
    imageId: "/macbook_m3.png",
    category: "Laptops",
    tag: "New",
    description: "Strikingly thin and fast. The 15-inch MacBook Air with M3 chip delivers incredible performance in a portable design. Features a stunning Liquid Retina display and up to 18 hours of battery life.",
    isTrending: true,
    isPromo: false,
    stock: 25,
    colors: ["Midnight", "Starlight", "Space Grey", "Silver"],
  },
  {
    name: "Dell XPS 15",
    brand: "Dell",
    price: 34999,
    imageId: "/dell_xps.png",
    category: "Laptops",
    tag: "Premium",
    description: "The pinnacle of Windows laptops. InfinityEdge display with OLED option and powerful H-series processors. Crafted with premium materials for a sophisticated look.",
    isTrending: false,
    isPromo: false,
    stock: 12,
    colors: ["Platinum Silver", "Frost White"],
  },

  // ── Phones ───────────────────────────────────────────────────────────────────
  {
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    price: 32999,
    imageId: "/iphone_16.png",
    category: "Phones",
    tag: "Hot",
    description: "The ultimate iPhone experience. A18 Pro chip, 48MP Fusion camera with 5x Tetraprism telephoto, titanium design, and a massive 6.9-inch Super Retina XDR display.",
    isTrending: true,
    isPromo: false,
    stock: 40,
    colors: ["Desert Titanium", "Natural Titanium", "Black Titanium", "White Titanium"],
    sizes: ["256GB", "512GB", "1TB"],
    sizePrices: [
      { size: "256GB", price: 32999 },
      { size: "512GB", price: 37999 },
      { size: "1TB", price: 42999 },
    ],
  },
  {
    name: "iPhone 16",
    brand: "Apple",
    price: 18999,
    imageId: "/iphone_16.png",
    category: "Phones",
    description: "Built for Apple Intelligence. Features an advanced dual-camera system with 48MP Fusion camera, A18 chip, and the new Camera Control button.",
    isTrending: false,
    isPromo: false,
    stock: 50,
    colors: ["Black", "White", "Pink", "Teal", "Ultramarine"],
    sizes: ["128GB", "256GB", "512GB"],
    sizePrices: [
      { size: "128GB", price: 18999 },
      { size: "256GB", price: 21999 },
      { size: "512GB", price: 26999 },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 29999,
    imageId: "/s24_ultra.png",
    category: "Phones",
    tag: "AI Powered",
    description: "Experience the next level of mobile technology with Galaxy AI. 200MP camera, integrated S Pen, and a stunning 6.8-inch display.",
    isTrending: true,
    isPromo: true,
    stock: 20,
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

const seedCategories = [
  { name: "Laptops", description: "High-performance laptops for every need", imageId: "/cat_laptops.png" },
  { name: "Phones", description: "Cutting-edge smartphones and accessories", imageId: "/cat_phones.png" },
];

// ─── Reviews (will be linked to product IDs after insertion) ─────────────────

const seedReviewTemplates = [
  { productIndex: 0, userName: "Sarah K.", rating: 5, comment: "The MacBook Pro 14 is a beast! The M3 Pro chip handles all my video edits with ease. Best purchase of the year.", date: "2026-03-15" },
  { productIndex: 1, userName: "Thabo M.", rating: 4, comment: "Love the portability of the Air. The M3 chip is plenty fast for my daily tasks. Display is absolutely gorgeous.", date: "2026-03-10" },
  { productIndex: 2, userName: "David R.", rating: 5, comment: "The XPS 15 is the best Windows laptop I've ever used. The OLED screen is just stunning.", date: "2026-03-12" },
  { productIndex: 3, userName: "Sipho N.", rating: 5, comment: "The iPhone 16 Pro Max camera is insane! The 5x telephoto lens is a game changer.", date: "2026-03-20" },
  { productIndex: 4, userName: "Lerato J.", rating: 5, comment: "Upgraded to the iPhone 16 and I'm loving the new colors and the camera control button.", date: "2026-03-18" },
  { productIndex: 5, userName: "Michael B.", rating: 5, comment: "The Galaxy S24 Ultra is a power user's dream. The AI features are actually useful!", date: "2026-03-22" },
];

// ─── Sample Orders (will reference product IDs after insertion) ───────────────

const seedOrderTemplates = [
  {
    userId: "demo_customer_1",
    customerName: "Thabo Mokoena",
    customerEmail: "thabo.m@example.com",
    status: "delivered",
    createdAt: "2026-03-10T09:30:00Z",
    paymentMethod: "card",
    items: [
      { productIndex: 3, name: "iPhone 16 Pro Max", price: 32999, quantity: 1 },
      { productIndex: 4, name: "iPhone 16", price: 18999, quantity: 1 },
    ],
  },
  {
    userId: "demo_customer_2",
    customerName: "Naledi Piliso",
    customerEmail: "naledi.p@example.com",
    status: "shipped",
    createdAt: "2026-03-18T14:15:00Z",
    paymentMethod: "card",
    items: [
      { productIndex: 1, name: "MacBook Air 15\" M3", price: 24999, quantity: 1 },
    ],
  },
  {
    userId: "demo_customer_3",
    customerName: "Sipho Ndlovu",
    customerEmail: "sipho.n@example.com",
    status: "processing",
    createdAt: "2026-03-22T11:45:00Z",
    paymentMethod: "eft",
    eftReference: "REF-20260322-SN",
    items: [
      { productIndex: 0, name: "MacBook Pro 14\" M3 Pro", price: 39999, quantity: 1 },
      { productIndex: 5, name: "Samsung Galaxy S24 Ultra", price: 29999, quantity: 1 },
    ],
  },
];

// ─── Main seed mutation ──────────────────────────────────────────────────────

export const init = mutation({
  args: {},
  handler: async (ctx) => {
    // ── Idempotency check ────────────────────────────────────────────────────
    const existingProduct = await ctx.db.query("products").first();
    if (existingProduct) {
      console.log("⏭  Database already seeded — skipping.");
      return { alreadySeeded: true };
    }

    console.log("🌱 Seeding database...");

    // ── 1. Seed categories ───────────────────────────────────────────────────
    const categoryMap = new Map<string, Id<"categories">>();
    for (const category of seedCategories) {
      const id = await ctx.db.insert("categories", category);
      categoryMap.set(category.name, id);
    }
    console.log(`✅ Seeded ${seedCategories.length} categories`);

    // ── 2. Seed products ─────────────────────────────────────────────────────
    const productIds: Id<"products">[] = [];
    for (const product of seedProducts) {
      const id = await ctx.db.insert("products", product);
      productIds.push(id);
    }
    console.log(`✅ Seeded ${productIds.length} products`);

    // ── 3. Seed reviews (linked to actual product IDs) ───────────────────────
    for (const review of seedReviewTemplates) {
      const productId = productIds[review.productIndex];
      if (productId) {
        await ctx.db.insert("reviews", {
          productId,
          userName: review.userName,
          rating: review.rating,
          comment: review.comment,
          date: review.date,
        });
      }
    }
    console.log(`✅ Seeded ${seedReviewTemplates.length} reviews`);

    // ── 4. Seed sample orders (linked to actual product IDs) ─────────────────
    for (const order of seedOrderTemplates) {
      const items = order.items
        .map((item) => {
          const productId = productIds[item.productIndex];
          if (!productId) return null;
          return {
            productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      await ctx.db.insert("orders", {
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total,
        status: order.status,
        items,
        createdAt: order.createdAt,
        paymentMethod: order.paymentMethod,
        ...(order.eftReference ? { eftReference: order.eftReference } : {}),
      });
    }
    console.log(`✅ Seeded ${seedOrderTemplates.length} orders`);

    // ── 5. Seed admin allowlist ──────────────────────────────────────────────
    const existingAdmin = await ctx.db.query("adminAllowlist").first();
    if (!existingAdmin) {
      await ctx.db.insert("adminAllowlist", {
        email: "alexsouthflow2@gmail.com",
        addedAt: new Date().toISOString(),
      });
      console.log("✅ Seeded admin allowlist");
    }

    console.log("🎉 Database seeding complete!");
    return {
      products: productIds.length,
      categories: seedCategories.length,
      reviews: seedReviewTemplates.length,
      orders: seedOrderTemplates.length,
    };
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["products", "categories", "reviews", "orders", "adminAllowlist"] as const;
    let deletedCount = 0;

    for (const table of tables) {
      const items = await ctx.db.query(table).collect();
      for (const item of items) {
        await ctx.db.delete(item._id);
        deletedCount++;
      }
    }

    return { success: true, deletedCount };
  },
});
