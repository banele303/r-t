"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/components/CartContext";
import { toast } from "sonner";
import "./products.css";

const PRODUCTS_PER_PAGE = 9;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // ── Filter state (driven from URL query params)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [brand, setBrand] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [promoOnly, setPromoOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Re-sync when URL changes (e.g. clicking a nav link)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "All";
    const promo = searchParams.get("isPromo") === "true";
    setSearchTerm(q);
    setCategory(cat);
    setPromoOnly(promo);
    setPage(1);
  }, [searchParams]);

  // ── Convex queries
  const meta = useQuery(api.products.getMeta);
  const allProducts = useQuery(api.products.getFiltered, {
    category: category === "All" ? undefined : category,
    brand: brand === "All" ? undefined : brand,
    searchTerm: searchTerm || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 999999 ? priceRange[1] : undefined,
    sortBy,
    isPromo: promoOnly || undefined,
  });

  const maxPriceAvail = meta?.maxPrice ?? 50000;

  // ── Pagination
  const totalProducts = allProducts?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const paginated = allProducts?.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE) ?? [];

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setBrand("All");
    setSortBy("newest");
    setPriceRange([0, 999999]);
    setPromoOnly(false);
    setPage(1);
    router.push("/products");
  };

  const hasActiveFilters =
    searchTerm || category !== "All" || brand !== "All" ||
    priceRange[0] > 0 || priceRange[1] < 999999 || promoOnly;

  return (
    <div className="products-page">

      {/* ── Page header */}
      <div className="products-header">
        <div className="products-header-left">
          <h1>All Products</h1>
          <p className="products-subtitle">
            {allProducts === undefined
              ? "Loading…"
              : `${totalProducts} product${totalProducts !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Search bar */}
        <div className="products-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="products-search-icon">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products, brands…"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="products-search-input"
          />
          {searchTerm && (
            <button className="products-search-clear" onClick={() => { setSearchTerm(""); setPage(1); }}>✕</button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button className="filter-toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="10" y2="18" />
          </svg>
          Filters {hasActiveFilters && <span className="filter-active-dot" />}
        </button>
      </div>

      <div className="products-body">

        {/* ── Sidebar */}
        {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
        <aside className={`products-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Filters</span>
            {hasActiveFilters && (
              <button className="sidebar-clear-btn" onClick={resetFilters}>Clear all</button>
            )}
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select className="filter-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name A–Z</option>
            </select>
          </div>

          {/* Category */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-chips">
              {["All", ...(meta?.categories ?? [])].map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${category === cat ? "active" : ""}`}
                  onClick={() => { setCategory(cat); setPage(1); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <label className="filter-label">Brand</label>
            <select className="filter-select" value={brand} onChange={e => { setBrand(e.target.value); setPage(1); }}>
              <option value="All">All Brands</option>
              {meta?.brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Price range */}
          <div className="filter-group">
            <label className="filter-label">
              Price Range
              <span className="filter-price-display">
                R {priceRange[0].toLocaleString()} — {priceRange[1] >= 999999 ? "Any" : `R ${priceRange[1].toLocaleString()}`}
              </span>
            </label>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] || ""}
                onChange={e => { setPriceRange([Number(e.target.value) || 0, priceRange[1]]); setPage(1); }}
                className="price-input"
                min={0}
              />
              <span style={{ color: '#aaa', fontSize: '12px' }}>to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1] >= 999999 ? "" : priceRange[1]}
                onChange={e => { setPriceRange([priceRange[0], Number(e.target.value) || 999999]); setPage(1); }}
                className="price-input"
                min={0}
              />
            </div>
          </div>

          {/* Promo toggle */}
          <div className="filter-group">
            <label className="filter-toggle-row">
              <span className="filter-label" style={{ marginBottom: 0 }}>On Promo Only</span>
              <div
                className={`toggle-switch ${promoOnly ? "on" : ""}`}
                onClick={() => { setPromoOnly(p => !p); setPage(1); }}
              >
                <div className="toggle-knob" />
              </div>
            </label>
          </div>
        </aside>

        {/* ── Main grid */}
        <main className="products-main">
          {/* Toolbar row */}
          <div className="products-toolbar">
            <span className="products-count">
              Showing {Math.min((page - 1) * PRODUCTS_PER_PAGE + 1, totalProducts)}–{Math.min(page * PRODUCTS_PER_PAGE, totalProducts)} of {totalProducts}
            </span>
            <select className="toolbar-sort-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
              <option value="name_asc">A–Z</option>
            </select>
          </div>

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="active-filters">
              {category !== "All" && <span className="active-filter-pill">{category} <button onClick={() => { setCategory("All"); setPage(1); }}>✕</button></span>}
              {brand !== "All" && <span className="active-filter-pill">{brand} <button onClick={() => { setBrand("All"); setPage(1); }}>✕</button></span>}
              {promoOnly && <span className="active-filter-pill">On Promo <button onClick={() => { setPromoOnly(false); setPage(1); }}>✕</button></span>}
              {searchTerm && <span className="active-filter-pill">"{searchTerm}" <button onClick={() => { setSearchTerm(""); setPage(1); }}>✕</button></span>}
              {(priceRange[0] > 0 || priceRange[1] < 999999) && (
                <span className="active-filter-pill">
                  R {priceRange[0].toLocaleString()}–{priceRange[1] >= 999999 ? "Any" : `R${priceRange[1].toLocaleString()}`}
                  <button onClick={() => { setPriceRange([0, 999999]); setPage(1); }}>✕</button>
                </span>
              )}
            </div>
          )}

          {/* Grid */}
          {allProducts === undefined ? (
            <div className="products-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton-img" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line medium" />
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="products-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="56" height="56" style={{ color: '#ccc', marginBottom: '16px' }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p>No products match your filters.</p>
              <button className="reset-btn" onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {paginated.map((product: any) => (
                <div key={product._id} className="pcard">
                  {product.tag && <span className="pcard-tag">{product.tag}</span>}
                  <Link href={`/product/${product._id}`} className="pcard-img-wrap">
                    <Image
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="pcard-img"
                    />
                  </Link>
                  <div className="pcard-body">
                    <span className="pcard-brand">{product.brand}</span>
                    <Link href={`/product/${product._id}`} className="pcard-name">{product.name}</Link>
                    <div className="pcard-price-row">
                      <span className="pcard-price">R {product.price.toLocaleString()}</span>
                      {product.oldPrice && <span className="pcard-old-price">R {product.oldPrice.toLocaleString()}</span>}
                    </div>
                    {product.stock !== undefined && (
                      <span className={`pcard-stock ${product.stock === 0 ? "out" : product.stock <= 5 ? "low" : "in"}`}>
                        {product.stock === 0 ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
                      </span>
                    )}
                    <div className="pcard-actions">
                      <button
                        className="pcard-cart-btn"
                        disabled={product.stock === 0}
                        onClick={() => {
                          addToCart(product);
                          toast.success(`${product.name} added to cart!`);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                        </svg>
                        Add to Cart
                      </button>
                      <Link href={`/product/${product._id}`} className="pcard-view-btn">View</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
                  return (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                }
                if (Math.abs(p - page) === 2) return <span key={p} className="page-ellipsis">…</span>;
                return null;
              })}

              <button
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "60px", textAlign: "center", color: "#888" }}>Loading products…</div>}>
      <ProductsContent />
    </Suspense>
  );
}
