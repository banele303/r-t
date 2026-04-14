"use client";

import Link from "next/link";
import Image from "next/image";
import "./promo-products.css";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "./CartContext";
import { toast } from 'sonner';

const placeholderItems = [
  {
    _id: "1",
    name: "AirPods Pro",
    desc: "Adaptive Audio. Now playing.",
    price: 5499,
    oldPrice: 6999,
    imageUrl: "/promo_airpods.png",
    tag: "Save R 1,500",
  },
  {
    _id: "2",
    name: "Apple Watch Ultra 2",
    desc: "Next level adventure.",
    price: 17999,
    oldPrice: 19999,
    imageUrl: "/promo_watch_ultra.png",
    tag: "Save R 2,000",
  },
  {
    _id: "3",
    name: "iPad Pro",
    desc: "Unbelievably thin. Incredibly powerful.",
    price: 18999,
    oldPrice: 20999,
    imageUrl: "/promo_ipad.png",
    tag: "10% Off",
  },
];

export default function PromoProducts() {
  const promos = useQuery(api.products?.getPromos);
  const { addToCart } = useCart();
  
  // Use actual database promos if available and not empty, otherwise fallback for the aesthetic
  const displayItems = promos && promos.length > 0 ? promos : placeholderItems;
  const slicedItems = displayItems.slice(0, 12);

  return (
    <section className="promo-products-section">
      <div className="promo-products-header">
        <h2>On Promo</h2>
        <Link href="/products?isPromo=true" className="view-all-promos">View All Offers &gt;</Link>
      </div>
      <div className="promo-products-grid">
        {slicedItems.map((item: any) => (
          <Link key={item._id} href={`/product/${item._id}`} className="promo-card">
            {item.tag && <div className="promo-card-badge">{item.tag}</div>}
            <div className="promo-card-image rounded-md overflow-hidden">
              <Image src={item.imageUrl || ""} alt={item.name} fill className="rounded-md object-contain p-6" />
            </div>
            <div className="promo-card-content">
              <h3>{item.name}</h3>
              <div className="promo-pricing">
                <span className="promo-price">R {item.price.toLocaleString()}</span>
                {item.oldPrice && <span className="promo-old-price">R {item.oldPrice.toLocaleString()}</span>}
              </div>
              <div className="promo-actions">
                <button className="promo-shop-button" onClick={(e) => {
                  e.preventDefault();
                  addToCart(item);
                  toast.success(`${item.name} added to cart!`);
                }}>Shop Offer</button>
                <button className="cart-icon" onClick={(e) => {
                  e.preventDefault();
                  addToCart(item);
                  toast.success(`${item.name} added to cart!`);
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
                  </svg>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {displayItems.length > 12 && (
        <div className="promo-view-all-bottom">
          <Link href="/products?isPromo=true" className="promo-view-all-btn">
            View All Promos
          </Link>
        </div>
      )}
    </section>
  );
}
