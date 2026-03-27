import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ─── Products ────────────────────────────────────────────────────────────────

const seedProducts = [
  // ── Mac ──────────────────────────────────────────────────────────────────────
  {
    name: "MacBook Air 15\" M3",
    brand: "Apple",
    price: 24999,
    imageId: "/cat_mac.png",
    category: "Mac",
    tag: "New",
    description: "Strikingly thin and fast. The 15-inch MacBook Air with M3 chip delivers incredible performance in a portable design. Features a stunning Liquid Retina display, up to 18 hours of battery life, and a silent fanless design.",
    isTrending: true,
    isPromo: false,
    stock: 25,
    colors: ["Midnight", "Starlight", "Space Grey", "Silver"],
  },
  {
    name: "MacBook Pro 14\" M3 Pro",
    brand: "Apple",
    price: 39999,
    oldPrice: 42999,
    imageId: "/cat_mac.png",
    category: "Mac",
    tag: "Save R 3,000",
    description: "The most advanced Mac laptop for demanding workflows. M3 Pro chip with up to 18-core GPU, Liquid Retina XDR display, and up to 22 hours of battery life.",
    isTrending: true,
    isPromo: true,
    isOnSale: true,
    stock: 15,
    colors: ["Space Black", "Silver"],
  },
  {
    name: "iMac 24\" M4",
    brand: "Apple",
    price: 27999,
    imageId: "/cat_mac.png",
    category: "Mac",
    description: "A colourful all-in-one desktop with the M4 chip. Features a gorgeous 24-inch 4.5K Retina display, a 12MP Center Stage camera, and Thunderbolt ports.",
    isTrending: false,
    isPromo: false,
    stock: 12,
    colors: ["Blue", "Green", "Pink", "Silver", "Yellow", "Orange", "Purple"],
  },

  // ── iPhone ───────────────────────────────────────────────────────────────────
  {
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    price: 32999,
    imageId: "/cat_iphone.png",
    category: "iPhone",
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
    imageId: "/cat_iphone.png",
    category: "iPhone",
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
    name: "iPhone 15",
    brand: "Apple",
    price: 15999,
    oldPrice: 18999,
    imageId: "/cat_iphone.png",
    category: "iPhone",
    tag: "Sale",
    description: "Dynamic Island. 48MP Main camera. USB-C. A16 Bionic chip delivers exceptional performance and efficiency.",
    isTrending: false,
    isPromo: true,
    isOnSale: true,
    stock: 30,
    colors: ["Blue", "Pink", "Yellow", "Green", "Black"],
    sizes: ["128GB", "256GB"],
    sizePrices: [
      { size: "128GB", price: 15999 },
      { size: "256GB", price: 18499 },
    ],
  },

  // ── Apple Watch ──────────────────────────────────────────────────────────────
  {
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    price: 17999,
    oldPrice: 19999,
    imageId: "/cat_watch.png",
    category: "Apple Watch",
    tag: "Save R 2,000",
    description: "The most rugged and capable Apple Watch. S9 SIP chip, precision dual-frequency GPS, 36-hour battery life, and a titanium case built for extreme adventures.",
    isTrending: true,
    isPromo: true,
    stock: 20,
    colors: ["Natural Titanium", "Black Titanium"],
  },
  {
    name: "Apple Watch Series 10",
    brand: "Apple",
    price: 8999,
    imageId: "/cat_watch.png",
    category: "Apple Watch",
    tag: "New",
    description: "The thinnest Apple Watch ever. Features a larger wide-angle OLED display, sleep apnea detection, water temperature sensing, and all-day battery life.",
    isTrending: true,
    isPromo: false,
    stock: 35,
    colors: ["Jet Black", "Rose Gold", "Silver"],
    sizes: ["42mm", "46mm"],
    sizePrices: [
      { size: "42mm", price: 8999 },
      { size: "46mm", price: 9999 },
    ],
  },
  {
    name: "Apple Watch SE (2nd Gen)",
    brand: "Apple",
    price: 5499,
    imageId: "/cat_watch.png",
    category: "Apple Watch",
    description: "Essential features at an incredible value. S8 SIP chip, crash detection, fall detection, and Family Setup so kids can have their own Apple Watch.",
    isTrending: false,
    isPromo: false,
    stock: 40,
    colors: ["Midnight", "Starlight", "Silver"],
  },

  // ── AirPods ──────────────────────────────────────────────────────────────────
  {
    name: "AirPods Pro 2 (USB-C)",
    brand: "Apple",
    price: 5499,
    oldPrice: 6999,
    imageId: "/cat_airpods.png",
    category: "AirPods",
    tag: "Save R 1,500",
    description: "Adaptive Audio. Active Noise Cancellation. Personalised Spatial Audio. Now with USB-C, a hearing health feature, and up to 2x more ANC than the previous generation.",
    isTrending: true,
    isPromo: true,
    stock: 60,
  },
  {
    name: "AirPods Max (USB-C)",
    brand: "Apple",
    price: 12999,
    imageId: "/cat_airpods.png",
    category: "AirPods",
    tag: "Premium",
    description: "High-fidelity over-ear headphones with Active Noise Cancellation, Adaptive Audio, and Personalised Spatial Audio. Anodised aluminium cups and stainless steel frame.",
    isTrending: false,
    isPromo: false,
    stock: 15,
    colors: ["Midnight", "Starlight", "Blue", "Orange", "Purple"],
  },
  {
    name: "AirPods 4",
    brand: "Apple",
    price: 3499,
    imageId: "/cat_airpods.png",
    category: "AirPods",
    tag: "New",
    description: "Redesigned for comfort. Powered by the H2 chip with personalised spatial audio, voice isolation, and an all-new open-ear design shaped by thousands of ear scans.",
    isTrending: false,
    isPromo: false,
    stock: 45,
  },

  // ── iPad ─────────────────────────────────────────────────────────────────────
  {
    name: "iPad Pro 13\" M4",
    brand: "Apple",
    price: 28999,
    oldPrice: 31999,
    imageId: "/cat_ipad.png",
    category: "iPad",
    tag: "10% Off",
    description: "Unbelievably thin. Incredibly powerful. The M4 chip and stunning Ultra Retina XDR display with tandem OLED make this the most advanced iPad ever.",
    isTrending: true,
    isPromo: true,
    isOnSale: true,
    stock: 18,
    colors: ["Space Black", "Silver"],
    sizes: ["256GB", "512GB", "1TB"],
    sizePrices: [
      { size: "256GB", price: 28999 },
      { size: "512GB", price: 33999 },
      { size: "1TB", price: 40999 },
    ],
  },
  {
    name: "iPad Air M3",
    brand: "Apple",
    price: 14999,
    imageId: "/cat_ipad.png",
    category: "iPad",
    description: "Power. Performance. Versatility. The M3 chip in an impossibly thin and light design. Available in 11-inch and 13-inch sizes.",
    isTrending: false,
    isPromo: false,
    stock: 25,
    colors: ["Blue", "Purple", "Starlight", "Space Grey"],
    sizes: ["11-inch", "13-inch"],
    sizePrices: [
      { size: "11-inch", price: 14999 },
      { size: "13-inch", price: 18999 },
    ],
  },
  {
    name: "iPad (10th Gen)",
    brand: "Apple",
    price: 8499,
    imageId: "/cat_ipad.png",
    category: "iPad",
    description: "Colourful. Powerful. Delightful. A14 Bionic chip, 10.9-inch Liquid Retina display, 12MP front and back cameras, and USB-C connectivity.",
    isTrending: false,
    isPromo: false,
    stock: 35,
    colors: ["Blue", "Pink", "Yellow", "Silver"],
  },

  // ── DJI (Drones) ────────────────────────────────────────────────────────────
  {
    name: "DJI Mini 4 Pro",
    brand: "DJI",
    price: 18999,
    imageId: "/cat_drone.png",
    category: "DJI",
    tag: "Hot",
    description: "Mini drone. Mega performance. Under-250g with omnidirectional obstacle sensing, 4K/60fps HDR video, and up to 34 minutes of flight time. Perfect for aerial photography.",
    isTrending: true,
    isPromo: false,
    stock: 20,
  },
  {
    name: "DJI Air 3",
    brand: "DJI",
    price: 24999,
    imageId: "/cat_drone.png",
    category: "DJI",
    description: "Dual-camera aerial imaging system. Wide-angle and 3x medium telephoto cameras capture stunning 48MP photos and 4K/60fps HDR video with up to 46 minutes of flight time.",
    isTrending: false,
    isPromo: false,
    stock: 10,
  },
  {
    name: "DJI Osmo Pocket 3",
    brand: "DJI",
    price: 9999,
    imageId: "/cat_drone.png",
    category: "DJI",
    tag: "New",
    description: "A pocket-sized 3-axis stabilised camera with a 1-inch CMOS sensor, 2-inch rotatable touchscreen, and 4K/120fps slow motion. Your go-to vlogging companion.",
    isTrending: false,
    isPromo: false,
    stock: 22,
  },

  // ── Go Pro ───────────────────────────────────────────────────────────────────
  {
    name: "GoPro HERO13 Black",
    brand: "GoPro",
    price: 9999,
    imageId: "/cat_gopro.png",
    category: "Go Pro",
    tag: "New",
    description: "The most powerful GoPro ever. 1/1.9-inch sensor, 5.3K video, HyperSmooth 6.0 stabilisation, and interchangeable lens mods for ultimate creative flexibility.",
    isTrending: true,
    isPromo: false,
    stock: 30,
  },
  {
    name: "GoPro HERO12 Black",
    brand: "GoPro",
    price: 7499,
    oldPrice: 8999,
    imageId: "/cat_gopro.png",
    category: "Go Pro",
    tag: "Sale",
    description: "Capture life in stunning 5.3K and 27MP photos. HyperSmooth 6.0 stabilisation, HDR video, and a rugged waterproof design rated to 10m.",
    isTrending: false,
    isPromo: true,
    isOnSale: true,
    stock: 18,
  },

  // ── Apple TV ─────────────────────────────────────────────────────────────────
  {
    name: "Apple TV 4K (2024)",
    brand: "Apple",
    price: 3499,
    imageId: "/cat_tv.png",
    category: "Apple TV",
    description: "Cinematic in every sense. A15 Bionic chip, 4K Dolby Vision, Dolby Atmos, HDR10+, and seamless integration with all your Apple devices. The ultimate streaming device.",
    isTrending: false,
    isPromo: false,
    stock: 50,
    sizes: ["64GB", "128GB"],
    sizePrices: [
      { size: "64GB", price: 3499 },
      { size: "128GB", price: 3999 },
    ],
  },

  // ── eufy (Smart Home) ───────────────────────────────────────────────────────
  {
    name: "eufy Indoor Cam S350",
    brand: "eufy Security",
    price: 2499,
    imageId: "/cat_eufy.png",
    category: "eufy",
    tag: "New",
    description: "Dual-camera indoor security with 4K wide-angle and 2K telephoto. AI-powered human, pet, and sound detection. 360° pan and tilt with 8x zoom.",
    isTrending: true,
    isPromo: false,
    stock: 40,
  },
  {
    name: "eufy RoboVac G40+",
    brand: "eufy",
    price: 8999,
    oldPrice: 10999,
    imageId: "/cat_eufy.png",
    category: "eufy",
    tag: "Save R 2,000",
    description: "Self-emptying robot vacuum with 2,500Pa suction, smart dynamic navigation, and a 2.5L dust bag that holds up to 60 days of dust. Ultra-slim design fits under furniture.",
    isTrending: false,
    isPromo: true,
    isOnSale: true,
    stock: 15,
  },
  {
    name: "eufy SoloCam S340",
    brand: "eufy Security",
    price: 3999,
    imageId: "/cat_eufy.png",
    category: "eufy",
    description: "Solar-powered outdoor security camera with 360° surveillance, 3K resolution, and 8x zoom. No wires, no monthly fees, AI-powered detection.",
    isTrending: false,
    isPromo: false,
    stock: 25,
  },

  // ── Beats (Audio) ───────────────────────────────────────────────────────────
  {
    name: "Beats Studio Pro",
    brand: "Beats",
    price: 6999,
    imageId: "/cat_beats.png",
    category: "Beats",
    tag: "Hot",
    description: "Premium wireless noise-cancelling headphones with personalised spatial audio, lossless USB-C audio, and up to 40 hours of battery life. Works seamlessly with Apple and Android.",
    isTrending: true,
    isPromo: false,
    stock: 30,
    colors: ["Black", "Navy", "Sandstone", "Deep Brown"],
  },
  {
    name: "Beats Solo 4",
    brand: "Beats",
    price: 4499,
    imageId: "/cat_beats.png",
    category: "Beats",
    description: "Wireless on-ear headphones that deliver an iconic sound experience. Custom acoustic architecture, up to 50 hours of battery life, and a lightweight, foldable design.",
    isTrending: false,
    isPromo: false,
    stock: 35,
    colors: ["Matte Black", "Slate Blue", "Cloud Pink"],
  },
  {
    name: "Beats Fit Pro",
    brand: "Beats",
    price: 4999,
    oldPrice: 5499,
    imageId: "/cat_beats.png",
    category: "Beats",
    tag: "Sale",
    description: "True wireless earbuds with secure-fit wingtips for all-day comfort. Active Noise Cancelling, Transparency mode, Spatial Audio, and up to 6 hours listening time.",
    isTrending: false,
    isPromo: true,
    isOnSale: true,
    stock: 28,
    colors: ["Beats Black", "Beats White", "Stone Purple", "Sage Grey"],
  },

  // ── Huawei ───────────────────────────────────────────────────────────────────
  {
    name: "Huawei Pura 70 Ultra",
    brand: "Huawei",
    price: 24999,
    imageId: "/cat_huawei.png",
    category: "Huawei",
    tag: "Pro Camera",
    description: "Ultra Speed Snapshot. XMAGE Image. Pop-out Camera. 5200mAh Battery with 100W SuperCharge.",
    isTrending: true,
    isPromo: false,
    stock: 20,
    colors: ["Black", "Green", "Brown"],
  },
  {
    name: "Huawei Mate 60 Pro",
    brand: "Huawei",
    price: 19999,
    imageId: "/cat_huawei.png",
    category: "Huawei",
    description: "Satellite communication support. Kunlun Glass. Triple rear camera system. HarmonyOS 4.0.",
    isTrending: false,
    isPromo: false,
    stock: 15,
    colors: ["Green", "Silver", "Purple", "Black"],
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

const seedCategories = [
  { name: "Mac", description: "MacBook Air, MacBook Pro, iMac & more", imageId: "/cat_mac.png" },
  { name: "iPhone", description: "iPhone 16 Pro Max, iPhone 16 & iPhone 15", imageId: "/cat_iphone.png" },
  { name: "Apple Watch", description: "Apple Watch Ultra, Series 10 & SE", imageId: "/cat_watch.png" },
  { name: "AirPods", description: "AirPods Pro, AirPods Max & AirPods 4", imageId: "/cat_airpods.png" },
  { name: "iPad", description: "iPad Pro, iPad Air & iPad 10th Gen", imageId: "/cat_ipad.png" },
  { name: "DJI", description: "DJI Mini 4 Pro, Air 3 & Osmo Pocket 3", imageId: "/cat_drone.png" },
  { name: "Go Pro", description: "GoPro HERO13 & HERO12 Black", imageId: "/cat_gopro.png" },
  { name: "Apple TV", description: "Apple TV 4K streaming device", imageId: "/cat_tv.png" },
  { name: "eufy", description: "Smart home cameras, robot vacuums & more", imageId: "/cat_eufy.png" },
  { name: "Beats", description: "Beats Studio Pro, Solo 4 & Fit Pro", imageId: "/cat_beats.png" },
  { name: "Huawei", description: "Pura, Mate & Nova series smartphones", imageId: "/cat_huawei.png" },
];

// ─── Reviews (will be linked to product IDs after insertion) ─────────────────

const seedReviewTemplates = [
  // Index maps to seeded product index
  { productIndex: 0, userName: "Thabo M.", rating: 5, comment: "Absolutely love the MacBook Air M3! Lightning fast and the battery lasts all day. Best laptop I've ever owned.", date: "2026-03-15" },
  { productIndex: 0, userName: "Sarah K.", rating: 4, comment: "Great performance for the price. The display is gorgeous and it's incredibly light. Only wish it had more ports.", date: "2026-03-10" },
  { productIndex: 3, userName: "Sipho N.", rating: 5, comment: "The iPhone 16 Pro Max camera is insane! The 5x telephoto lens takes photos that rival a DSLR. Very happy with my purchase.", date: "2026-03-20" },
  { productIndex: 3, userName: "Lerato J.", rating: 5, comment: "Upgraded from iPhone 13 Pro and the difference is night and day. Camera Control button is a game changer.", date: "2026-03-18" },
  { productIndex: 7, userName: "David R.", rating: 5, comment: "The Apple Watch Series 10 is so thin and comfortable. Sleep tracking has genuinely improved my health habits.", date: "2026-03-12" },
  { productIndex: 9, userName: "Naledi P.", rating: 5, comment: "AirPods Pro 2 are worth every cent. The noise cancellation is incredible — can't hear anything on my commute!", date: "2026-03-22" },
  { productIndex: 9, userName: "Michael B.", rating: 4, comment: "Sound quality is amazing and Adaptive Audio works really well. Only downside is the case scratches quite easily.", date: "2026-03-08" },
  { productIndex: 12, userName: "Zanele D.", rating: 5, comment: "iPad Pro M4 replaced my laptop entirely. The OLED display is stunning for photo and video editing.", date: "2026-03-16" },
  { productIndex: 15, userName: "Chris V.", rating: 5, comment: "DJI Mini 4 Pro is the best drone I've used. Obstacle avoidance works perfectly and the footage is cinema-quality.", date: "2026-03-14" },
  { productIndex: 18, userName: "Amanda L.", rating: 4, comment: "GoPro HERO13 is a tank! Survived a 2m drop and still works perfectly. Video stabilisation is buttery smooth.", date: "2026-03-05" },
  { productIndex: 21, userName: "Bongani S.", rating: 5, comment: "eufy Indoor Cam S350 gives me peace of mind. The AI detection is accurate and I love that there's no subscription fee.", date: "2026-03-19" },
  { productIndex: 24, userName: "Nomvula T.", rating: 5, comment: "Beats Studio Pro sound incredible. The noise cancellation rivals the AirPods Max at half the price.", date: "2026-03-11" },
  { productIndex: 24, userName: "James W.", rating: 4, comment: "Great sound and comfortable for long listening sessions. Battery life is excellent — easily lasts a full work week.", date: "2026-03-07" },
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
      { productIndex: 9, name: "AirPods Pro 2 (USB-C)", price: 5499, quantity: 1 },
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
      { productIndex: 0, name: "MacBook Air 15\" M3", price: 24999, quantity: 1 },
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
      { productIndex: 7, name: "Apple Watch Series 10", price: 8999, quantity: 1 },
      { productIndex: 24, name: "Beats Studio Pro", price: 6999, quantity: 1 },
      { productIndex: 14, name: "iPad (10th Gen)", price: 8499, quantity: 1 },
    ],
  },
  {
    userId: "demo_customer_4",
    customerName: "Lerato Johnson",
    customerEmail: "lerato.j@example.com",
    status: "pending",
    createdAt: "2026-03-25T16:00:00Z",
    paymentMethod: "card",
    items: [
      { productIndex: 15, name: "DJI Mini 4 Pro", price: 18999, quantity: 1 },
      { productIndex: 18, name: "GoPro HERO13 Black", price: 9999, quantity: 2 },
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

    // ── 1. Seed products ─────────────────────────────────────────────────────
    const productIds: Id<"products">[] = [];
    for (const product of seedProducts) {
      const id = await ctx.db.insert("products", product);
      productIds.push(id);
    }
    console.log(`✅ Seeded ${productIds.length} products`);

    // ── 2. Seed categories ───────────────────────────────────────────────────
    const existingCategory = await ctx.db.query("categories").first();
    if (!existingCategory) {
      for (const category of seedCategories) {
        await ctx.db.insert("categories", category);
      }
      console.log(`✅ Seeded ${seedCategories.length} categories`);
    }

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
