import { mutation } from "./_generated/server";

const placeholderTrending = [
  { name: "DJI Mini 4 Pro Drone", brand: "DJI", price: 23999, imageId: "/cat_drone.png", category: "Drones", tag: "Hot", isTrending: true, isPromo: false },
  { name: "GoPro HERO12 Black", brand: "GoPro", price: 8999, imageId: "/cat_gopro.png", category: "Cameras", tag: "Sale", isTrending: true, isPromo: false },
  { name: "Beats Studio Pro Wireless", brand: "Beats", price: 6999, imageId: "/cat_beats.png", category: "Audio", isTrending: true, isPromo: false },
  { name: "Eufy Indoor Cam 2K", brand: "eufy Security", price: 1499, imageId: "/cat_eufy.png", category: "Smart Home", tag: "New", isTrending: true, isPromo: false },
];

const placeholderPromos = [
  { name: "AirPods Pro", description: "Adaptive Audio. Now playing.", brand: "Apple", price: 5499, oldPrice: 6999, imageId: "/promo_airpods.png", category: "Audio", tag: "Save R 1,500", isPromo: true, isTrending: false },
  { name: "Apple Watch Ultra 2", description: "Next level adventure.", brand: "Apple", price: 17999, oldPrice: 19999, imageId: "/promo_watch_ultra.png", category: "Wearables", tag: "Save R 2,000", isPromo: true, isTrending: false },
  { name: "iPad Pro", description: "Unbelievably thin. Incredibly powerful.", brand: "Apple", price: 18999, oldPrice: 20999, imageId: "/promo_ipad.png", category: "Tablets", tag: "10% Off", isPromo: true, isTrending: false },
];

export const init = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if we already have items to prevent double seeding
    const existing = await ctx.db.query("products").first();
    if (existing) {
      console.log("Database already seeded");
      return;
    }

    // Insert trending items
    for (const item of placeholderTrending) {
      await ctx.db.insert("products", item);
    }

    // Insert promo items
    for (const item of placeholderPromos) {
      await ctx.db.insert("products", item);
    }
  },
});
