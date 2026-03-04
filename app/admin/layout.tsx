"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import {
  Package,
  Tags,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ShieldOff,
  Loader2,
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  Menu,
  ClipboardList,
} from "lucide-react";
import "./admin.css";

const navLinks = [
  { name: "Dashboard",       href: "/admin/dashboard",   icon: LayoutDashboard },
  { name: "Analytics",       href: "/admin/analytics",   icon: BarChart3 },
  { name: "Orders",          href: "/admin/orders",      icon: ClipboardList },
  { name: "Products",        href: "/admin",             icon: Package, exact: true },
  { name: "Categories",      href: "/admin/categories",  icon: Tags },
  { name: "Customers",       href: "/admin/customers",   icon: Users },
  { name: "Settings",        href: "/admin/settings",    icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const isAdmin = useQuery(api.admin.isAdmin);
  const currentUser = useQuery(api.users.current);

  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist theme
  useEffect(() => {
    const saved = localStorage.getItem("admin-theme");
    if (saved) setDark(saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("admin-theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  // ── Loading
  if (isAdmin === undefined) {
    return (
      <div className="admin-auth-screen">
        <Loader2 size={40} className="admin-spinner" />
        <p>Verifying access…</p>
      </div>
    );
  }

  // ── Denied
  if (!isAdmin) {
    return (
      <div className="admin-denied-screen">
        <div className="admin-denied-icon">
          <ShieldOff size={40} color="#ff4d4f" />
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access the admin area.</p>
        <Link href="/" className="admin-denied-link">← Back to Store</Link>
      </div>
    );
  }

  const userEmail = currentUser?.email ?? "admin";
  const userInitial = userEmail.charAt(0).toUpperCase();

  const theme = dark ? "dark" : "light";

  return (
    <div className={`admin-shell ${theme}`} data-theme={theme}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ══ Sidebar ══════════════════════════════════════════════ */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>

        {/* Logo / Brand */}
        <div className="admin-sidebar-brand">
          {collapsed ? (
            <ShoppingBag size={22} className="brand-icon" />
          ) : (
            <Image
              src="/istore-logo.webp"
              alt="iStore Logo"
              width={180}
              height={56}
              priority
              style={{ objectFit: 'contain', maxWidth: '100%' }}
            />
          )}
        </div>

        {/* Nav links */}
        <nav className="admin-nav">
          {navLinks.map(({ name, href, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`admin-nav-item ${active ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? name : undefined}
              >
                <Icon size={18} className="nav-icon" />
                {!collapsed && <span>{name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user + controls */}
        <div className="admin-sidebar-bottom">
          {/* Theme toggle */}
          <button className="sidebar-icon-btn" onClick={toggleTheme} title={dark ? "Switch to Light" : "Switch to Dark"}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* Store link */}
          <Link href="/" className="sidebar-icon-btn" title="Back to Store">
            <ChevronLeft size={16} />
            {!collapsed && <span>Back to Store</span>}
          </Link>

          {/* User info */}
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">{userInitial}</div>
            {!collapsed && (
              <div className="admin-user-info">
                <span className="admin-user-email" title={userEmail}>{userEmail}</span>
                <button className="admin-user-logout" onClick={handleLogout}>
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Collapse toggle (desktop) */}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft size={16} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s" }} />
          </button>
        </div>
      </aside>

      {/* ══ Main content ════════════════════════════════════════ */}
      <div
        className="admin-main-wrap"
        style={{ marginLeft: mobileOpen ? undefined : collapsed ? 64 : 240 }}
      >
        {/* Top bar */}
        <header className="admin-topbar">
          {/* Mobile hamburger */}
          <button className="admin-mobile-menu-btn" onClick={() => setMobileOpen(o => !o)}>
            <Menu size={20} />
          </button>

          {/* Page title */}
          <h2 className="admin-page-title">
            {navLinks.find(l => l.exact ? pathname === l.href : pathname.startsWith(l.href))?.name ?? "Admin"}
          </h2>

          <div style={{ flex: 1 }} />

          {/* Theme toggle (topbar, desktop hidden) */}
          <button className="topbar-theme-btn" onClick={toggleTheme} title={dark ? "Light Mode" : "Dark Mode"}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User pill */}
          <div className="topbar-user">
            <div className="admin-user-avatar sm">{userInitial}</div>
            <span>{userEmail}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
