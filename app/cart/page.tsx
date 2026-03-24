"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { toast } from "sonner";
import "./cart.css";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CartPage() {
  const { items, removeFromCart, addToCart, clearCart, totalItems, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  
  const currentUser = useQuery(api.users.current);
  const createOrder = useMutation(api.orders.create);
  const getPayFastData = useAction(api.payfast.getPaymentData);

  const decreaseQty = (item: any) => {
    if (item.quantity === 1) {
      removeFromCart(item._id, item.color, item.size);
      toast.info(`${item.name} removed from cart.`);
    } else {
      // Decrease by removing one and re-adding one? Actually, we should probably have a decrement function in CartContext.
      // But for now, let's just remove and re-add with quantity - 1 logic if that's what was intended.
      // Wait, the current logic is to remove ALL and re-add N-1.
      removeFromCart(item._id, item.color, item.size);
      for (let i = 0; i < item.quantity - 1; i++) {
        addToCart(item, item.color, item.size);
      }
    }
  };

  const increaseQty = (item: any) => {
    addToCart(item, item.color, item.size);
  };

  const handleRemove = (item: any) => {
    removeFromCart(item._id, item.color, item.size);
    toast.info(`${item.name} removed from cart.`);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Please login to proceed with checkout.");
      return;
    }

    setIsCheckingOut(true);
    try {
      // 1. Create order in Convex
      const orderId = await createOrder({
        userId: currentUser._id,
        customerName: currentUser.name || "Customer",
        customerEmail: currentUser.email || "",
        total: totalPrice,
        status: "pending",
        items: items.map(item => ({
          productId: item._id as any,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      // 2. Get PayFast payment data (signature, fields)
      const payfastData = await getPayFastData({
        orderId,
        amount: totalPrice,
        itemName: `iStore Order #${orderId.toString().slice(-6)}`,
        customerEmail: currentUser.email || "",
        customerName: currentUser.name || "Customer",
      });

      // 3. Create a hidden form and submit it to PayFast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payfastData.actionUrl;

      Object.entries(payfastData.fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Something went wrong with the checkout. Please try again.");
      setIsCheckingOut(false);
    }
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
          {items.map((item, index) => (
            <div key={`${item._id}-${item.color}-${item.size}-${index}`} className="cart-item-card">
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
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      {item.color && (
                        <span style={{ fontSize: '12px', color: '#666', background: '#f5f5f7', padding: '2px 8px', borderRadius: '6px', border: '1px solid #eee' }}>
                          Color: {item.color}
                        </span>
                      )}
                      {item.size && (
                        <span style={{ fontSize: '12px', color: '#666', background: '#f5f5f7', padding: '2px 8px', borderRadius: '6px', border: '1px solid #eee' }}>
                          Storage: {item.size}
                        </span>
                      )}
                    </div>
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

          <button 
            className="cart-checkout-btn" 
            onClick={handleCheckout}
            disabled={isCheckingOut}
            style={{ opacity: isCheckingOut ? 0.7 : 1, cursor: isCheckingOut ? 'not-allowed' : 'pointer' }}
          >
            {isCheckingOut ? (
              <span>Processing...</span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Proceed to Checkout
              </>
            )}
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
