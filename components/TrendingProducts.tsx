"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const placeholderProducts = [
  { _id: "1", name: "DJI Mini 4 Pro Drone", brand: "DJI", price: 23999, imageUrl: "/cat_drone.png", tag: "Hot" },
  { _id: "2", name: "GoPro HERO12 Black", brand: "GoPro", price: 8999, imageUrl: "/cat_gopro.png", tag: "Sale" },
  { _id: "3", name: "Beats Studio Pro Wireless", brand: "Beats", price: 6999, imageUrl: "/cat_beats.png" },
  { _id: "4", name: "Eufy Indoor Cam 2K", brand: "eufy Security", price: 1499, imageUrl: "/cat_eufy.png", tag: "New" },
];

export default function TrendingProducts() {
  const trending = useQuery(api.products?.getTrending);
  const displayItems = trending && trending.length > 0 ? trending : placeholderProducts;

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>Trending Electronics</h2>
        <a href="#" className="view-all">View All Brands &gt;</a>
      </div>
      <div className="modern-product-grid">
        {displayItems.map((p: any) => (
          <Link key={p._id} href={`/product/${p._id}`} className="modern-card">
            {p.tag && <span className={`card-badge ${p.tag.toLowerCase()}`}>{p.tag}</span>}
            <div className="card-image">
              <Image src={p.imageUrl || ""} alt={p.name} fill />
            </div>
            <div className="card-info">
              <span className="card-brand">{p.brand}</span>
              <h3>{p.name}</h3>
              <p className="card-price">R {p.price.toLocaleString()}</p>
            </div>
            <div className="modern-actions">
              <button className="modern-shop-button">Add to Cart</button>
              <button className="modern-cart-button" title="Quick Add">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
