"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Store,
  CheckCircle2,
} from "lucide-react";
import "./settings.css";

const tabs = [
  { id: "store",       label: "Store Info",      icon: Store },
  { id: "account",     label: "Account",          icon: User },
  { id: "appearance",  label: "Appearance",       icon: Palette },
  { id: "notifications", label: "Notifications",  icon: Bell },
  { id: "security",    label: "Security",         icon: Shield },
  { id: "locale",      label: "Region & Language",icon: Globe },
];

function SaveToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="settings-toast">
      <CheckCircle2 size={16} />
      Settings saved successfully
    </div>
  );
}

export default function AdminSettings() {
  const user = useQuery(api.users.current);
  const [activeTab, setActiveTab] = useState("store");
  const [saved, setSaved] = useState(false);

  // Store info
  const [storeName, setStoreName] = useState("R & T Store");
  const [storeEmail, setStoreEmail] = useState("info@randtstore.co.za");
  const [storePhone, setStorePhone] = useState("+27 11 000 0000");
  const [storeAddress, setStoreAddress] = useState("123 Main Street, Johannesburg, 2000");
  const [storeCurrency, setStoreCurrency] = useState("ZAR");
  const [storeTagline, setStoreTagline] = useState("Get the Fastest delivery for Free.");

  // Notifications
  const [emailOrders, setEmailOrders] = useState(true);
  const [emailLowStock, setEmailLowStock] = useState(true);
  const [emailNewUser, setEmailNewUser] = useState(false);
  const [pushOrders, setPushOrders] = useState(true);
  const [pushMarketing, setPushMarketing] = useState(false);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Locale
  const [timezone, setTimezone] = useState("Africa/Johannesburg");
  const [language, setLanguage] = useState("en-ZA");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const userEmail = user?.email ?? "—";
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="settings-page">
      <SaveToast show={saved} />

      {/* Page title */}
      <div className="settings-headline">
        <h1>Settings</h1>
        <p>Manage your store preferences, account and security.</p>
      </div>

      <div className="settings-layout">
        {/* ── Tabs sidebar */}
        <nav className="settings-tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`settings-tab ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* ── Panel */}
        <div className="settings-panel">

          {/* ── Store Info */}
          {activeTab === "store" && (
            <section className="settings-section">
              <h2>Store Information</h2>
              <p className="section-desc">This information appears on receipts, invoices, and customer emails.</p>
              <div className="settings-grid">
                <div className="form-field">
                  <label>Store Name</label>
                  <input value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="R & T Store" />
                </div>
                <div className="form-field">
                  <label>Tagline</label>
                  <input value={storeTagline} onChange={e => setStoreTagline(e.target.value)} placeholder="Your store tagline" />
                </div>
                <div className="form-field">
                  <label>Contact Email</label>
                  <input type="email" value={storeEmail} onChange={e => setStoreEmail(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input type="tel" value={storePhone} onChange={e => setStorePhone(e.target.value)} />
                </div>
                <div className="form-field full">
                  <label>Store Address</label>
                  <input value={storeAddress} onChange={e => setStoreAddress(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Currency</label>
                  <select value={storeCurrency} onChange={e => setStoreCurrency(e.target.value)}>
                    <option value="ZAR">ZAR — South African Rand</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="NAD">NAD — Namibian Dollar</option>
                    <option value="BWP">BWP — Botswana Pula</option>
                    <option value="ZMW">ZMW — Zambian Kwacha</option>
                  </select>
                </div>
              </div>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </section>
          )}

          {/* ── Account */}
          {activeTab === "account" && (
            <section className="settings-section">
              <h2>Account Details</h2>
              <p className="section-desc">Your admin account information.</p>

              <div className="account-card">
                <div className="account-avatar">{userInitial}</div>
                <div>
                  <p className="account-email">{userEmail}</p>
                  <span className="account-badge">Administrator</span>
                </div>
              </div>

              <div className="settings-grid" style={{ marginTop: 28 }}>
                <div className="form-field full">
                  <label>Display Name</label>
                  <input placeholder="Your name" defaultValue={userEmail.split("@")[0]} />
                </div>
                <div className="form-field full">
                  <label>Email Address</label>
                  <input type="email" value={userEmail} readOnly className="readonly" />
                  <span className="field-hint">Email is managed through your auth provider.</span>
                </div>
              </div>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </section>
          )}

          {/* ── Appearance */}
          {activeTab === "appearance" && (
            <section className="settings-section">
              <h2>Appearance</h2>
              <p className="section-desc">Customise how the admin panel looks.</p>

              <div className="appearance-grid">
                <div className="appearance-card selected">
                  <div className="theme-preview dark-preview">
                    <div className="preview-sidebar" />
                    <div className="preview-content">
                      <div className="preview-bar" />
                      <div className="preview-bar short" />
                    </div>
                  </div>
                  <div className="appearance-label">
                    <span>Dark Mode</span>
                    <CheckCircle2 size={16} color="#3b82f6" />
                  </div>
                </div>
                <div className="appearance-card">
                  <div className="theme-preview light-preview">
                    <div className="preview-sidebar light" />
                    <div className="preview-content light">
                      <div className="preview-bar light-bar" />
                      <div className="preview-bar short light-bar" />
                    </div>
                  </div>
                  <div className="appearance-label">
                    <span>Light Mode</span>
                  </div>
                </div>
              </div>
              <p className="field-hint" style={{ marginTop: 12 }}>Use the ☀️ / 🌙 toggle in the sidebar to switch themes.</p>
            </section>
          )}

          {/* ── Notifications */}
          {activeTab === "notifications" && (
            <section className="settings-section">
              <h2>Notifications</h2>
              <p className="section-desc">Control which events trigger email and push notifications.</p>

              <div className="notif-group">
                <h3>Email Notifications</h3>
                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">New Orders</p>
                    <p className="toggle-desc">Get an email whenever a new order is placed.</p>
                  </div>
                  <ToggleSwitch on={emailOrders} onChange={setEmailOrders} />
                </div>
                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">Low Stock Alerts</p>
                    <p className="toggle-desc">Notify when a product has 5 or fewer units left.</p>
                  </div>
                  <ToggleSwitch on={emailLowStock} onChange={setEmailLowStock} />
                </div>
                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">New User Registrations</p>
                    <p className="toggle-desc">Email when a new customer signs up.</p>
                  </div>
                  <ToggleSwitch on={emailNewUser} onChange={setEmailNewUser} />
                </div>
              </div>

              <div className="notif-group">
                <h3>Push Notifications</h3>
                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">Order Updates</p>
                    <p className="toggle-desc">Real-time push for new and updated orders.</p>
                  </div>
                  <ToggleSwitch on={pushOrders} onChange={setPushOrders} />
                </div>
                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">Marketing & Tips</p>
                    <p className="toggle-desc">Product tips, updates and feature announcements.</p>
                  </div>
                  <ToggleSwitch on={pushMarketing} onChange={setPushMarketing} />
                </div>
              </div>
              <button className="save-btn" onClick={handleSave}>Save Preferences</button>
            </section>
          )}

          {/* ── Security */}
          {activeTab === "security" && (
            <section className="settings-section">
              <h2>Security</h2>
              <p className="section-desc">Manage your account security settings.</p>

              <div className="notif-group">
                <h3>Two-Factor Authentication</h3>
                <div className="toggle-row">
                  <div>
                    <p className="toggle-label">Enable 2FA</p>
                    <p className="toggle-desc">Require a second verification step on login.</p>
                  </div>
                  <ToggleSwitch on={twoFactor} onChange={setTwoFactor} />
                </div>
              </div>

              <div className="notif-group">
                <h3>Session</h3>
                <div className="form-field" style={{ maxWidth: 280 }}>
                  <label>Auto Logout After (minutes)</label>
                  <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
              </div>

              <div className="notif-group">
                <h3>Danger Zone</h3>
                <div className="danger-box">
                  <div>
                    <p className="toggle-label" style={{ color: 'var(--danger)' }}>Delete Admin Account</p>
                    <p className="toggle-desc">This will permanently remove your admin access. This cannot be undone.</p>
                  </div>
                  <button className="danger-btn">Delete Account</button>
                </div>
              </div>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </section>
          )}

          {/* ── Locale */}
          {activeTab === "locale" && (
            <section className="settings-section">
              <h2>Region & Language</h2>
              <p className="section-desc">Configure timezone, language and date display.</p>
              <div className="settings-grid">
                <div className="form-field">
                  <label>Timezone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}>
                    <option value="Africa/Johannesburg">Africa/Johannesburg (UTC+2)</option>
                    <option value="UTC">UTC (UTC+0)</option>
                    <option value="Europe/London">Europe/London (UTC+0/+1)</option>
                    <option value="America/New_York">America/New_York (UTC-5/-4)</option>
                    <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="en-ZA">English (South Africa)</option>
                    <option value="en-US">English (United States)</option>
                    <option value="en-GB">English (United Kingdom)</option>
                    <option value="af">Afrikaans</option>
                    <option value="zu">Zulu</option>
                    <option value="xh">Xhosa</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Date Format</label>
                  <select value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      className={`s-toggle ${on ? "on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <span className="s-knob" />
    </button>
  );
}
