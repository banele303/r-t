"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { toast } from "sonner";
import "./cart.css";

export default function CartPage() {
  const { items, removeFromCart, addToCart, clearCart, totalItems, totalPrice } = useCart();

  const decreaseQty = (item: any) => {
    if (item.quantity === 1) {
      removeFromCart(item._id);
      toast.info(`${item.name} removed from cart.`);
    } else {
      // Decrease by removing and re-adding with quantity - 1
      removeFromCart(item._id);
      for (let i = 0; i < item.quantity - 1; i++) {
        addToCart(item);
      }
    }
  };

  const increaseQty = (item: any) => {
    addToCart(item);
  };

  const handleRemove = (item: any) => {
    removeFromCart(item._id);
    toast.info(`${item.name} removed from cart.`);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page-container">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="80" height="80">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </div>
          <h2 className="cart-empty-title">Your cart is empty</h2>
          <p className="cart-empty-subtitle">Looks like you haven't added anything yet. Let's fix that!</p>
          <Link href="/" className="cart-start-shopping">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="cart-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Shopping Cart</span>
      </div>

      <h1 className="cart-page-title">Shopping Cart <span className="cart-count-badge">{totalItems} items</span></h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-list">
          {items.map((item) => (
            <div key={item._id} className="cart-item-card">
              <div className="cart-item-image">
                <Image
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div className="cart-item-details">
                <div className="cart-item-header">
                  <div>
                    <span className="cart-item-brand">{item.brand}</span>
                    <h3 className="cart-item-name">{item.name}</h3>
                  </div>
                  <button className="cart-item-remove" onClick={() => handleRemove(item)} title="Remove item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>

                <div className="cart-item-footer">
                  <div className="cart-qty-control">
                    <button className="qty-btn" onClick={() => decreaseQty(item)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQty(item)}>+</button>
                  </div>
                  <div className="cart-item-price">
                    <span className="cart-item-unit-price">R {item.price.toLocaleString()} each</span>
                    <span className="cart-item-subtotal">R {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button className="cart-clear-btn" onClick={() => { clearCart(); toast.info("Cart cleared."); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="cart-summary-panel">
          <h2 className="cart-summary-title">Order Summary</h2>

          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>R {totalPrice.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span className="cart-free-tag">FREE</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>R {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button className="cart-checkout-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Proceed to Checkout
          </button>

          <Link href="/" className="cart-continue-link">
            ← Continue Shopping
          </Link>

          <div className="cart-trust-badges">
            <div className="trust-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Secure Checkout</span>
            </div>
            <div className="trust-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Safe Payment</span>
            </div>
            <div className="trust-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="1" />
                <path d="M12 17v-2m0 0V13m0 2h2m-2 0h-2" />
              </svg>
              <span>Free Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
