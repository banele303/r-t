"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { totalItems } = useCart();
  const user = useQuery(api.users.current);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchResults = useQuery(api.products.search, { searchTerm });

  const userEmail = user?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "";

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { label: "Mac", href: "/products?category=Mac" },
    { label: "iPhone", href: "/products?category=iPhone" },
    { label: "iPad", href: "/products?category=iPad" },
    { label: "Watch", href: "/products?category=Watch" },
    { label: "AirPods", href: "/products?category=AirPods" },
    { label: "Accessories", href: "/products?category=Accessories" },
    { label: "Smart Tech", href: "/products?category=Smart+Tech" },
    { label: "Cellular", href: "/products?category=Cellular" },
    { label: "Trade In", href: "/products?category=Trade+In" },
    { label: "On Promo", href: "/products?isPromo=true" },
    { label: "Services", href: "/products?category=Services" },
  ];

  return (
    <>
      {/* Top bar – hidden on mobile */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a1a1a6', fontSize: '12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            Support: <strong style={{ color: 'white', fontWeight: 500 }}>0800 123 456</strong>
          </span>
        </div>
        <div className="top-bar-right">
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Pick Up from <strong>Select a Store &gt;</strong>
          </span>
          <span>|</span>
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
            Deliver to <strong>Enter Postal Code &gt;</strong>
          </span>
        </div>
      </div>

      <nav className="main-nav">
        {/* Logo */}
        <div className="logo">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src="/r&tlogo.png.webp"
              alt="R&T Logo"
              width={180}
              height={60}
              priority
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Desktop nav links */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
          ))}
        </ul>

        {/* Desktop icons */}
        <div className="nav-icons">
          {/* Search */}
          <div className="search-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: '6px', width: '24px', height: '24px', backgroundColor: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="12" height="12">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search R & T Shop..."
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 16px 6px 38px', fontSize: '13px', width: '180px', outline: 'none', transition: 'all 0.3s cubic-bezier(0.25,1,0.5,1)' }}
              onFocus={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.target.style.borderColor = 'rgba(255,255,255,0.4)'; e.target.style.width = '240px'; }}
              onBlur={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.width = '180px'; setTimeout(() => setSearchTerm(""), 200); }}
            />
            {searchTerm && searchResults && searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '280px', backgroundColor: 'var(--dark-grey)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {searchResults.map((p: any) => (
                  <Link key={p._id} href={`/product/${p._id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none', color: 'white', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '12px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</span>
                      <span style={{ fontSize: '12px', color: '#a1a1a6' }}>R {p.price.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {searchTerm && searchResults && searchResults.length === 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '240px', backgroundColor: 'var(--dark-grey)', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <p style={{ color: '#a1a1a6', fontSize: '13px', margin: 0 }}>No products found.</p>
              </div>
            )}
          </div>

          {/* Auth – desktop hover dropdown */}
          {isAuthenticated ? (
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setUserDropdownOpen(true)}
              onMouseLeave={() => setUserDropdownOpen(false)}
            >
              {/* Avatar trigger */}
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),#0073e6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: userDropdownOpen ? '0 0 0 3px rgba(0,115,230,0.35)' : 'none', transition: 'box-shadow 0.2s' }}>
                {userInitial || 'U'}
              </div>

              {/* Dropdown panel — bridge wrapper eliminates the hover gap */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',     /* starts right at the avatar edge — no gap */
                  right: 0,
                  paddingTop: '10px', /* visual spacing is now inside hover area */
                  zIndex: 150,
                  minWidth: '220px',
                }}>
                  <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '8px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    {/* User info */}
                    <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),#0073e6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>
                        {userInitial || 'U'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#a1a1a6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                    </div>

                    {/* Settings link */}
                    <Link
                      href="/settings"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', color: '#e5e7eb', fontSize: '14px', fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                      </svg>
                      Settings
                    </Link>

                    {/* Sign out */}
                    <button
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', color: '#ff6b6b', fontSize: '14px', fontWeight: 500, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          ) : (
            <Link href="/login" aria-label="Sign In">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" style={{ cursor: 'pointer' }}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--blue)', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--dark-grey)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile right group: cart + hamburger */}
        <div className="mobile-nav-right">
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'white' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-7px', right: '-7px', backgroundColor: 'var(--blue)', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--dark-grey)' }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {menuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>

        {/* ── User profile card at the very top ── */}
        {isAuthenticated ? (
          <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),#0073e6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, flexShrink: 0 }}>
                {userInitial || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: 'white', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{userInitial ? userInitial + '···' : 'User'}</div>
                <div style={{ color: '#a1a1a6', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', color: '#e5e7eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                Settings
              </Link>
              <button
                onClick={handleLogout}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', color: '#ff6b6b', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', background: 'linear-gradient(135deg,var(--blue),#0073e6)', borderRadius: '14px', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none', marginBottom: '24px' }}>
            Sign In
          </Link>
        )}

        {/* Search in drawer */}
        <div style={{ padding: '0 0 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#a1a1a6" strokeWidth="2.5" width="14" height="14">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search R & T Shop..."
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '10px 14px 10px 36px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          {searchTerm && searchResults && searchResults.length > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {searchResults.map((p: any) => (
                <Link key={p._id} href={`/product/${p._id}`} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none', color: 'white', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <img src={p.imageUrl} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '10px' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#a1a1a6' }}>R {p.price.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: pathname === link.href ? 'white' : '#a1a1a6', fontWeight: pathname === link.href ? 700 : 400, fontSize: '17px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'color 0.2s', display: 'block' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="promo-bar">
        Get the Fastest delivery for Free. <Link href="/">Shop online at R & T Shop!</Link>
      </div>
    </>
  );
}

