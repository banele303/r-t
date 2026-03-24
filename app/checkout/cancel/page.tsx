"use client";

import React from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
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
      <div style={{ color: '#ef4444', marginBottom: '24px' }}>
        <XCircle size={80} />
      </div>
      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Checkout Cancelled</h1>
      <p style={{ fontSize: '18px', color: '#666', maxWidth: '500px', marginBottom: '32px' }}>
        The payment process was cancelled. No charges were made.
      </p>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Link href="/cart" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 32px', borderRadius: '12px', background: '#f5f5f7', color: 'var(--black)', fontWeight: 600 }}>
          Return to Cart
        </Link>
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 32px', borderRadius: '12px', background: 'var(--blue)', color: 'white', fontWeight: 600 }}>
          Home Page
        </Link>
      </div>
    </div>
  );
}
