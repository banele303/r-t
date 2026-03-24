"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { toast } from "sonner";
import "./cart.css";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CartPage() {
  const { items, removeFromCart, addToCart, clearCart, totalItems, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "eft" | null>(null);
  const [showEftModal, setShowEftModal] = useState(false);
  const [eftReference, setEftReference] = useState("");
  const [eftSubmitted, setEftSubmitted] = useState(false);
  const [eftOrderId, setEftOrderId] = useState<string | null>(null);

  const currentUser = useQuery(api.users.current);
  const createOrder = useMutation(api.orders.create);
  const getPayFastData = useAction(api.payfast.getPaymentData);

  const decreaseQty = (item: any) => {
    if (item.quantity === 1) {
      removeFromCart(item._id, item.color, item.size);
      toast.info(`${item.name} removed from cart.`);
    } else {
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

  // ── Pay via Card (PayFast) ──
  const handleCardCheckout = async () => {
    if (!currentUser) {
      toast.error("Please login to proceed with checkout.");
      return;
    }

    setIsCheckingOut(true);
    const cardSurcharge = Math.round(totalPrice * 0.03 * 100) / 100;
    const cardTotal = totalPrice + cardSurcharge;
    try {
      const orderId = await createOrder({
        userId: currentUser._id,
        customerName: currentUser.name || "Customer",
        customerEmail: currentUser.email || "",
        total: cardTotal,
        status: "pending",
        paymentMethod: "card",
        items: items.map(item => ({
          productId: item._id as any,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      const payfastData = await getPayFastData({
        orderId,
        amount: cardTotal,
        itemName: `R&T Order #${orderId.toString().slice(-6)}`,
        customerEmail: currentUser.email || "",
        customerName: currentUser.name || "Customer",
      });

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

  // ── Pay via EFT/Bank Deposit ──
  const handleEftCheckout = async () => {
    if (!currentUser) {
      toast.error("Please login to proceed with checkout.");
      return;
    }
    setShowEftModal(true);
  };

  const handleEftSubmit = async () => {
    if (!eftReference.trim()) {
      toast.error("Please enter your payment reference number.");
      return;
    }
    if (!currentUser) return;

    setIsCheckingOut(true);
    try {
      const orderId = await createOrder({
        userId: currentUser._id,
        customerName: currentUser.name || "Customer",
        customerEmail: currentUser.email || "",
        total: totalPrice,
        status: "awaiting_payment",
        paymentMethod: "eft",
        eftReference: eftReference.trim(),
        items: items.map(item => ({
          productId: item._id as any,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      setEftOrderId(orderId);
      setEftSubmitted(true);
      clearCart();
      toast.success("Order placed successfully! We will confirm your payment shortly.");
    } catch (error) {
      console.error("EFT order failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ── EFT Success Screen ──
  if (eftSubmitted && eftOrderId) {
    return (
      <div className="cart-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          padding: '60px 40px',
          background: '#fff',
          borderRadius: '32px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', color: '#fff',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="40" height="40">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', color: '#111' }}>Order Placed!</h1>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '28px', lineHeight: 1.6 }}>
            Your order has been received. We will verify your EFT deposit and process your order within 24 hours.
          </p>

          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px',
            padding: '20px', marginBottom: '24px', textAlign: 'left',
          }}>
            <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Payment Details
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#555', fontSize: '14px' }}>Order ID</span>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>#{eftOrderId.toString().slice(-8)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#555', fontSize: '14px' }}>Reference</span>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>{eftReference}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#555', fontSize: '14px' }}>Status</span>
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#f59e0b' }}>Awaiting Verification</span>
            </div>
          </div>

          <Link href="/" className="btn-primary" style={{
            display: 'inline-block', textDecoration: 'none', padding: '14px 36px',
            borderRadius: '16px', background: 'var(--blue)', color: 'white', fontWeight: 700, fontSize: '15px',
          }}>
            Back to Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty Cart ──
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
            {paymentMethod === 'card' && (
              <div className="cart-summary-row" style={{ color: '#f59e0b' }}>
                <span>Card Processing Fee (3%)</span>
                <span>+ R {(Math.round(totalPrice * 0.03 * 100) / 100).toLocaleString()}</span>
              </div>
            )}
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>R {paymentMethod === 'card' ? (totalPrice + Math.round(totalPrice * 0.03 * 100) / 100).toLocaleString() : totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Card surcharge notice */}
          {paymentMethod === 'card' && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '14px',
              padding: '14px 16px', marginBottom: '16px', fontSize: '13px', color: '#92400e',
              lineHeight: 1.5,
            }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
              <span>
                <strong>Card Payment Notice:</strong> A 3% processing fee is added for card payments. 
                Save by choosing <strong>Bank Deposit / EFT</strong> — no extra fees!
              </span>
            </div>
          )}

          {/* ── Payment Method Selection ── */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '12px' }}>Choose Payment Method</p>

            {/* Card / PayFast Option */}
            <button
              onClick={() => setPaymentMethod("card")}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                borderRadius: '16px',
                border: paymentMethod === 'card' ? '2px solid var(--blue)' : '2px solid #e8e8e8',
                background: paymentMethod === 'card' ? 'rgba(0,86,179,0.04)' : '#fff',
                cursor: 'pointer',
                marginBottom: '10px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                border: paymentMethod === 'card' ? '6px solid var(--blue)' : '2px solid #ccc',
                flexShrink: 0, transition: 'all 0.2s',
              }} />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>
                  💳 Pay with Card
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                  Secure payment via PayFast (Visa, Mastercard, etc.)
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'card' ? 'var(--blue)' : '#ccc'} strokeWidth="2" width="20" height="20">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </button>

            {/* EFT / Bank Deposit Option */}
            <button
              onClick={() => setPaymentMethod("eft")}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                borderRadius: '16px',
                border: paymentMethod === 'eft' ? '2px solid #10b981' : '2px solid #e8e8e8',
                background: paymentMethod === 'eft' ? 'rgba(16,185,129,0.04)' : '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                border: paymentMethod === 'eft' ? '6px solid #10b981' : '2px solid #ccc',
                flexShrink: 0, transition: 'all 0.2s',
              }} />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>
                  🏦 Bank Deposit / EFT
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                  Transfer directly to our FNB account
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke={paymentMethod === 'eft' ? '#10b981' : '#ccc'} strokeWidth="2" width="20" height="20">
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
              </svg>
            </button>
          </div>

          {/* Checkout Button */}
          <button
            className="cart-checkout-btn"
            onClick={paymentMethod === 'card' ? handleCardCheckout : paymentMethod === 'eft' ? handleEftCheckout : () => toast.error("Please select a payment method.")}
            disabled={isCheckingOut || !paymentMethod}
            style={{
              opacity: (isCheckingOut || !paymentMethod) ? 0.5 : 1,
              cursor: (isCheckingOut || !paymentMethod) ? 'not-allowed' : 'pointer',
              background: paymentMethod === 'eft'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, var(--blue), #0073e6)',
              boxShadow: paymentMethod === 'eft'
                ? '0 8px 20px rgba(16,185,129,0.25)'
                : '0 8px 20px rgba(0,86,179,0.25)',
            }}
          >
            {isCheckingOut ? (
              <span>Processing...</span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                {paymentMethod === 'card' ? 'Pay with Card' : paymentMethod === 'eft' ? 'Pay via Bank Deposit' : 'Select Payment Method'}
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

      {/* ── EFT Bank Details Modal ── */}
      {showEftModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '28px', maxWidth: '520px', width: '100%',
            padding: '40px', position: 'relative',
            boxShadow: '0 32px 64px rgba(0,0,0,0.15)',
            animation: 'slideUp 0.3s ease',
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowEftModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#f5f5f7', border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#666', fontSize: '18px', fontWeight: 700,
              }}
            >✕</button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', color: '#fff', fontSize: '28px',
              }}>🏦</div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>Bank Deposit Details</h2>
              <p style={{ fontSize: '14px', color: '#888' }}>
                Transfer <strong style={{ color: '#111' }}>R {totalPrice.toLocaleString()}</strong> to the account below
              </p>
            </div>

            {/* Bank Details Card */}
            <div style={{
              background: 'linear-gradient(135deg, #001529, #002952)',
              borderRadius: '20px', padding: '28px', color: '#fff',
              marginBottom: '24px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: '-20px', right: '-20px',
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
              }} />
              <div style={{
                position: 'absolute', bottom: '-30px', left: '-30px',
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
              }} />

              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.6, marginBottom: '16px', fontWeight: 600 }}>
                Banking Details
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: "Bank", value: "FNB / RMB" },
                  { label: "Account Holder", value: "R And T General Trading And Supply" },
                  { label: "Account Type", value: "Gold Business Account" },
                  { label: "Account Number", value: "63078511631" },
                  { label: "Branch Code", value: "250655" },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', opacity: 0.7 }}>{row.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.3px' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.08)',
                borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '16px' }}>💡</span>
                <span style={{ opacity: 0.9 }}>Use your <strong>name + phone number</strong> as payment reference</span>
              </div>
            </div>

            {/* Reference Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333', marginBottom: '8px' }}>
                Your Payment Reference Number
              </label>
              <input
                type="text"
                value={eftReference}
                onChange={(e) => setEftReference(e.target.value)}
                placeholder="e.g. John Doe 0812345678"
                style={{
                  width: '100%', padding: '14px 18px', borderRadius: '14px',
                  border: '2px solid #e8e8e8', fontSize: '15px',
                  outline: 'none', transition: 'border-color 0.2s',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>
                Enter the exact reference you used when making the bank transfer
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleEftSubmit}
              disabled={isCheckingOut || !eftReference.trim()}
              style={{
                width: '100%', padding: '16px', borderRadius: '16px',
                background: (!eftReference.trim()) ? '#e8e8e8' : 'linear-gradient(135deg, #10b981, #059669)',
                color: (!eftReference.trim()) ? '#999' : '#fff',
                fontSize: '16px', fontWeight: 700, border: 'none',
                cursor: (!eftReference.trim()) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: eftReference.trim() ? '0 8px 20px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              {isCheckingOut ? 'Submitting...' : 'Confirm Payment & Place Order'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
