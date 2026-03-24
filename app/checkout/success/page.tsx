"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Clear the cart on successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="checkout-status-page" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '70vh', 
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ color: '#10b981', marginBottom: '24px' }}>
        <CheckCircle size={80} />
      </div>
      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Payment Successful!</h1>
      <p style={{ fontSize: '18px', color: '#666', maxWidth: '500px', marginBottom: '32px' }}>
        Thank you for your purchase. Your order has been placed successfully and will be processed shortly.
      </p>
      
      {orderId && (
        <div style={{ background: '#f5f5f7', padding: '12px 24px', borderRadius: '12px', marginBottom: '32px' }}>
          <span style={{ fontSize: '14px', color: '#888' }}>Order ID: </span>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>#{orderId.toString().slice(-8)}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px' }}>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 32px', borderRadius: '12px', background: 'var(--blue)', color: 'white', fontWeight: 600 }}>
          Back to Shopping
        </Link>
      </div>
    </div>
  );
}
