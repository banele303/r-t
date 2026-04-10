"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
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
  const categories = useQuery(api.categories.get);
  const subcategoryTree = useQuery(api.subcategories.getTree);
  const searchResults = useQuery(api.products.search, { searchTerm: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const megaMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const liveSearchResults = useQuery(api.products.search, { searchTerm: searchTerm.trim() });

  const userEmail = user?.email;
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "";

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    router.push("/");
  };

  const catList = (categories ?? []).map((c: any) => c.name);

  const openMega = (cat: string) => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
    setActiveMegaMenu(cat);
  };

  const closeMega = () => {
    megaMenuTimer.current = setTimeout(() => setActiveMegaMenu(null), 120);
  };

  const keepMega = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
  };

  useEffect(() => () => { if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current); }, []);

  return (
    <>
      {/* ── Top Bar ── */}
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

      {/* ── Main Nav ── */}
      <nav className="main-nav" style={{ position: 'relative', zIndex: 200 }}>
        {/* Logo */}
        <div className="logo">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image src="/r&tlogo.png.webp" alt="R&T Logo" width={180} height={60} priority style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        {/* Desktop nav — categories with mega-menu */}
        <ul className="nav-links" style={{ position: 'static' }}>
          {catList.map((cat: string) => {
            const subs = (subcategoryTree ?? {})[cat] ?? [];
            return (
              <li
                key={cat}
                style={{ position: 'static' }}
                onMouseEnter={() => openMega(cat)}
                onMouseLeave={closeMega}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {cat}
                  {subs.length > 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11" style={{ opacity: 0.6, marginTop: '1px' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/products?isPromo=true" style={{ color: '#ff6b00', fontWeight: 700 }}>🔥 On Promo</Link>
          </li>
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
              placeholder="Search R & T Store..."
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 16px 6px 38px', fontSize: '13px', width: '180px', outline: 'none', transition: 'all 0.3s' }}
              onFocus={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.target.style.width = '240px'; }}
              onBlur={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.target.style.width = '180px'; setTimeout(() => setSearchTerm(""), 200); }}
            />
            {searchTerm && liveSearchResults && liveSearchResults.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '300px', backgroundColor: 'var(--dark-grey)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {liveSearchResults.map((p: any) => (
                  <Link key={p._id} href={`/product/${p._id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none', color: 'white', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '12px' }} />}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</span>
                      <span style={{ fontSize: '12px', color: '#a1a1a6' }}>R {p.price.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {searchTerm && liveSearchResults && liveSearchResults.length === 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '240px', backgroundColor: 'var(--dark-grey)', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 300, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <p style={{ color: '#a1a1a6', fontSize: '13px', margin: 0 }}>No products found.</p>
              </div>
            )}
          </div>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} onMouseEnter={() => setUserDropdownOpen(true)} onMouseLeave={() => setUserDropdownOpen(false)}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),#0073e6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {userInitial || 'U'}
              </div>
              {userDropdownOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '10px', zIndex: 300, minWidth: '220px' }}>
                  <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '8px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ padding: '12px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),#0073e6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{userInitial || 'U'}</div>
                      <div style={{ fontSize: '12px', color: '#a1a1a6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                    </div>
                    <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', color: '#e5e7eb', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
                      Settings
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', color: '#ff6b6b', fontSize: '14px', fontWeight: 500, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" aria-label="Sign In">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" style={{ cursor: 'pointer' }}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--blue)', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--dark-grey)' }}>
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile icons */}
        <div className="mobile-nav-right">
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'white' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-7px', right: '-7px', backgroundColor: 'var(--blue)', color: 'white', fontSize: '10px', fontWeight: 'bold', width: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--dark-grey)' }}>
                {totalItems}
              </span>
            )}
          </Link>
          <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MEGA-MENU (Desktop)
      ══════════════════════════════════════ */}
      {activeMegaMenu && (() => {
        const subs = (subcategoryTree ?? {})[activeMegaMenu] ?? [];
        if (!subs.length) return null;
        return (
          <div
            onMouseEnter={keepMega}
            onMouseLeave={closeMega}
            style={{
              position: 'fixed',
              top: '88px', // below nav
              left: 0,
              right: 0,
              zIndex: 190,
              background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'megaSlide 0.22s cubic-bezier(0.25,1,0.5,1)',
            }}
          >
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 40px 40px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                  <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
                    {activeMegaMenu}
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
                    {subs.length} categories available
                  </p>
                </div>
                <Link
                  href={`/products?category=${encodeURIComponent(activeMegaMenu)}`}
                  onClick={() => setActiveMegaMenu(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '13px', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(59,130,246,0.3)', padding: '8px 18px', borderRadius: '20px', transition: '0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  View all {activeMegaMenu}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>

              {/* Sub-category grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px',
              }}>
                {subs.map((sub: any) => (
                  <Link
                    key={sub._id}
                    href={`/products?category=${encodeURIComponent(activeMegaMenu)}&subCategory=${encodeURIComponent(sub.name)}`}
                    onClick={() => setActiveMegaMenu(null)}
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 16px', borderRadius: '14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.18s cubic-bezier(0.25,1,0.5,1)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(59,130,246,0.12)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(59,130,246,0.35)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    }}
                    >
                      {sub.icon && (
                        <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>{sub.icon}</span>
                      )}
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.name}
                        </div>
                        {sub.description && (
                          <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {sub.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mobile Drawer Backdrop */}
      {menuOpen && <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />}

      {/* ══════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════ */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        {/* User card */}
        {isAuthenticated ? (
          <div style={{ marginBottom: '20px', padding: '18px', background: 'rgba(255,255,255,0.04)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,var(--blue),#0073e6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>{userInitial || 'U'}</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{userInitial ? userInitial + '···' : 'User'}</div>
                <div style={{ color: '#a1a1a6', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{userEmail}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/settings" onClick={() => setMenuOpen(false)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', color: '#e5e7eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Settings
              </Link>
              <button onClick={handleLogout} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', color: '#ff6b6b', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', background: 'linear-gradient(135deg,var(--blue),#0073e6)', borderRadius: '14px', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none', marginBottom: '20px' }}>
            Sign In
          </Link>
        )}

        {/* Mobile Search */}
        <div style={{ padding: '0 0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: '12px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#a1a1a6" strokeWidth="2.5" width="14" height="14"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search R & T Store..."
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '10px 14px 10px 36px', fontSize: '14px', outline: 'none' }}
            />
          </div>
          {searchTerm && liveSearchResults && liveSearchResults.length > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {liveSearchResults.map((p: any) => (
                <Link key={p._id} href={`/product/${p._id}`} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none', color: 'white', backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '10px' }} />}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#a1a1a6' }}>R {p.price.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Nav — categories with expand */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {catList.map((cat: string) => {
            const subs = (subcategoryTree ?? {})[cat] ?? [];
            const isExpanded = mobileExpandedCat === cat;
            return (
              <div key={cat}>
                {/* Category row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    onClick={() => setMenuOpen(false)}
                    style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '16px', padding: '13px 0', flex: 1, textDecoration: 'none', transition: 'color 0.2s' }}
                  >
                    {cat}
                  </Link>
                  {subs.length > 0 && (
                    <button
                      onClick={() => setMobileExpandedCat(isExpanded ? null : cat)}
                      style={{ background: 'none', border: 'none', color: '#a1a1a6', cursor: 'pointer', padding: '12px 4px', display: 'flex', alignItems: 'center' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" style={{ transition: 'transform 0.25s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Sub-categories panel */}
                {isExpanded && subs.length > 0 && (
                  <div style={{ padding: '10px 0 10px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', margin: '4px 0 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {subs.map((sub: any) => (
                      <Link
                        key={sub._id}
                        href={`/products?category=${encodeURIComponent(cat)}&subCategory=${encodeURIComponent(sub.name)}`}
                        onClick={() => setMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', color: '#a1a1a6', fontSize: '14px', textDecoration: 'none', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#a1a1a6'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        {sub.icon && <span style={{ fontSize: '16px' }}>{sub.icon}</span>}
                        <span style={{ fontWeight: 500 }}>{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* On Promo link */}
          <Link href="/products?isPromo=true" onClick={() => setMenuOpen(false)} style={{ color: '#ff9500', fontWeight: 700, fontSize: '16px', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', textDecoration: 'none' }}>
            🔥 On Promo
          </Link>
        </nav>
      </div>

      <div className="promo-bar">
        Get the Fastest delivery for Free. <Link href="/">Shop online at R & T Store!</Link>
      </div>

      <style>{`
        @keyframes megaSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
