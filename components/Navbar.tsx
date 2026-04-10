"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
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
    megaMenuTimer.current = setTimeout(() => setActiveMegaMenu(null), 300);
  };

  const keepMega = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current);
  };

  const runSeedSubcats = useMutation(api.subcategories.seedAll);
  const runSeedCats = useMutation(api.categories.seedAll);

  useEffect(() => {
    if (categories && categories.length === 0) {
      runSeedCats({}).catch(console.error);
    }
  }, [categories, runSeedCats]);

  useEffect(() => {
    if (subcategoryTree && Object.keys(subcategoryTree).length === 0) {
      runSeedSubcats({}).catch(console.error);
    }
  }, [subcategoryTree, runSeedSubcats]);

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
      <nav className="main-nav" style={{ position: 'relative', zIndex: 200, overflow: 'visible' }}>
        {/* Logo */}
        <div className="logo">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <Image src="/r&tlogo.png.webp" alt="R&T Logo" width={180} height={60} priority style={{ objectFit: 'contain' }} />
          </Link>
        </div>

        {/* Desktop nav — categories with mega-menu */}
        <ul className="nav-links">
          {catList.map((cat: string) => {
            const subs = (subcategoryTree ?? {})[cat] ?? [];
            return (
              <li
                key={cat}
                onMouseEnter={() => openMega(cat)}
                onMouseLeave={closeMega}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {cat}
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/products?isPromo=true" style={{ color: '#ff6b00', fontWeight: 700 }}>🔥 On Promo</Link>
          </li>
        </ul>

        {/* Icons */}
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
              placeholder="Search..."
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 12px 6px 36px', fontSize: '13px', width: '140px', outline: 'none', transition: 'all 0.3s' }}
              onFocus={(e) => { e.target.style.width = '200px'; }}
              onBlur={(e) => { e.target.style.width = '140px'; setTimeout(() => setSearchTerm(""), 200); }}
            />
            {searchTerm && liveSearchResults && liveSearchResults.length > 0 && (
              <div style={{ position: 'absolute', top: 'calc(100% + 10px)', left: 0, width: '300px', backgroundColor: '#111827', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {liveSearchResults.map((p: any) => (
                  <Link key={p._id} href={`/product/${p._id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', textDecoration: 'none', color: 'white' }}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: 'white', borderRadius: '12px' }} />}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.name}</span>
                      <span style={{ fontSize: '12px', color: '#a1a1a6' }}>R {p.price.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
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
                      Settings
                    </Link>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', color: '#ff6b6b', fontSize: '14px', fontWeight: 500, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.08)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
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

          <Link href="/cart" style={{ position: 'relative' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="12" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--blue)', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', textAlign: 'center' }}>{totalItems}</span>}
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="mobile-nav-right">
          <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ══════════════════════════════════════
            MEGA-MENU (Desktop) — PREMIUM WHITE STYLE
        ══════════════════════════════════════ */}
        {activeMegaMenu && (() => {
          const subs = (subcategoryTree ?? {})[activeMegaMenu] ?? [];
          if (!subs.length) return null;
          return (
            <div
              onMouseEnter={keepMega}
              onMouseLeave={closeMega}
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '900px',
                maxWidth: '95vw',
                zIndex: 400,
                background: '#ffffff',
                borderRadius: '0 0 24px 24px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                padding: '40px',
                animation: 'megaIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ color: '#000', fontSize: '24px', fontWeight: 800, margin: 0 }}>{activeMegaMenu}</h3>
                  <div style={{ width: '40px', height: '4px', background: 'var(--blue)', marginTop: '8px', borderRadius: '2px' }}></div>
                </div>
                <Link href={`/products?category=${encodeURIComponent(activeMegaMenu)}`} style={{ color: 'var(--blue)', fontSize: '14px', fontWeight: 600 }}>
                  Browse All {activeMegaMenu} →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {subs.map((sub: any) => (
                  <Link
                    key={sub._id}
                    href={`/products?category=${encodeURIComponent(activeMegaMenu)}&subCategory=${encodeURIComponent(sub.name)}`}
                    className="mega-sub-link"
                    onClick={() => setActiveMegaMenu(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      padding: '24px',
                      borderRadius: '20px',
                      background: '#f8fafc',
                      border: '1px solid transparent',
                      transition: '0.25s',
                      textDecoration: 'none'
                    }}
                  >
                    {sub.imageUrl ? (
                      <div style={{ width: '100%', height: '140px', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                        <img src={sub.imageUrl} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} className="sub-img" />
                      </div>
                    ) : (
                      <div style={{ height: '140px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '24px' }}>{sub.icon}</span>
                      </div>
                    )}
                    <div>
                      <div style={{ color: '#000', fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{sub.name}</div>
                      <div style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.4' }}>{sub.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </nav>

      {/* Mobile Backdrop */}
      {menuOpen && <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {catList.map((cat: string) => {
            const subs = (subcategoryTree ?? {})[cat] ?? [];
            const isExpanded = mobileExpandedCat === cat;
            return (
              <div key={cat} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link href={`/products?category=${encodeURIComponent(cat)}`} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '16px 0', color: 'white', fontWeight: 600 }}>{cat}</Link>
                  {subs.length > 0 && (
                    <button onClick={() => setMobileExpandedCat(isExpanded ? null : cat)} style={{ color: '#a1a1a6', padding: '10px' }}>
                      {isExpanded ? "−" : "+"}
                    </button>
                  )}
                </div>
                {isExpanded && (
                  <div style={{ padding: '0 0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {subs.map((sub: any) => (
                      <Link key={sub._id} href={`/products?category=${encodeURIComponent(cat)}&subCategory=${encodeURIComponent(sub.name)}`} onClick={() => setMenuOpen(false)} style={{ color: '#a1a1a6', fontSize: '14px' }}>{sub.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link href="/products?isPromo=true" onClick={() => setMenuOpen(false)} style={{ padding: '16px 0', color: '#ff6b00', fontWeight: 700 }}>🔥 On Promo</Link>
        </div>
      </div>

      <div className="promo-bar">
        Get the Fastest delivery for Free. <Link href="/">Shop online at R & T Store!</Link>
      </div>

      <style>{`
        @keyframes megaIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .nav-links li:hover a { color: var(--blue) !important; opacity: 1; }
        .mega-sub-link:hover {
          background: #ffffff !important;
          border-color: rgba(0,0,0,0.06) !important;
          box-shadow: 0 12px 24px rgba(0,0,0,0.05) !important;
          transform: translateY(-4px);
        }
        .mega-sub-link:hover .sub-img {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}
