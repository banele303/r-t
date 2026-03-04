"use client";

import { useState } from "react";
import { Users, Search, MoreHorizontal, Filter } from 'lucide-react';

const mockCustomers = [
  { id: "101", name: "Alex Southflow",  email: "alexsouthflow2@gmail.com", status: "Active",   method: "Google OAuth", spent: "R 23,450", date: "Oct 24, 2025" },
  { id: "102", name: "Sarah Jenkins",   email: "s.jenkins@example.com",    status: "Inactive", method: "Email/Pass",   spent: "R 4,200",  date: "Sep 12, 2025" },
  { id: "103", name: "Mike Ross",       email: "mike.ross@pearson.com",     status: "Active",   method: "Google OAuth", spent: "R 56,800", date: "Nov 02, 2025" },
  { id: "104", name: "Emily Chen",      email: "echen99@mail.com",          status: "Active",   method: "Email/Pass",   spent: "R 1,500",  date: "Oct 28, 2025" },
  { id: "105", name: "David Kim",       email: "david.k@startup.io",        status: "Banned",   method: "Google OAuth", spent: "R 0",      date: "Jul 15, 2025" },
];

const statusColour = (s: string) => ({
  Active:   { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  Inactive: { bg: 'var(--surface2)',       color: 'var(--text-muted)' },
  Banned:   { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' },
}[s] ?? { bg: 'var(--surface2)', color: 'var(--text-muted)' });

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cust-page">
      <div className="cust-header">
        <div>
          <h1 className="cust-title">Customers</h1>
          <p className="cust-sub">Manage users and view their purchase history.</p>
        </div>
        <button className="cust-export-btn">
          <Users size={16} /> Export Customers
        </button>
      </div>

      <div className="cust-table-card">
        {/* Toolbar */}
        <div className="cust-toolbar">
          <div className="cust-search-wrap">
            <Search size={16} className="cust-search-icon" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="cust-search-input"
            />
          </div>
          <button className="cust-filter-btn">
            <Filter size={15} /> Filter
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="cust-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Auth Method</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>More</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No customers match that search.
                  </td>
                </tr>
              ) : filtered.map(u => {
                const { bg, color } = statusColour(u.status);
                const initial = u.name.charAt(0).toUpperCase();
                return (
                  <tr key={u.id} className="cust-row">
                    <td>
                      <div className="cust-user-cell">
                        <div className="cust-avatar" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                          {initial}
                        </div>
                        <div>
                          <div className="cust-name">{u.name}</div>
                          <div className="cust-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cust-badge" style={{ background: bg, color }}>
                        {u.status}
                      </span>
                    </td>
                    <td className="cust-cell">{u.method}</td>
                    <td className="cust-cell" style={{ fontWeight: 600 }}>{u.spent}</td>
                    <td className="cust-cell cust-muted">{u.date}</td>
                    <td style={{ textAlign: 'right', padding: '16px 24px' }}>
                      <button className="cust-more-btn">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="cust-footer">
          <span>Showing {filtered.length} of {mockCustomers.length} customers</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="cust-page-btn">Previous</button>
            <button className="cust-page-btn">Next</button>
          </div>
        </div>
      </div>

      <style>{`
        .cust-page { display:flex; flex-direction:column; gap:24px; }
        .cust-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; }
        .cust-title { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-0.5px; margin:0 0 4px; }
        .cust-sub   { font-size:14px; color:var(--text-muted); margin:0; }
        .cust-export-btn {
          display:flex; align-items:center; gap:8px;
          background:var(--accent); color:#fff; border:none;
          padding:11px 20px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer;
          transition:opacity 0.2s;
        }
        .cust-export-btn:hover { opacity:0.88; }
        .cust-table-card {
          background:var(--surface); border:1px solid var(--border);
          border-radius:18px; overflow:hidden;
        }
        .cust-toolbar {
          display:flex; gap:12px; align-items:center;
          padding:18px 24px; border-bottom:1px solid var(--border);
        }
        .cust-search-wrap {
          flex:1; position:relative;
        }
        .cust-search-icon {
          position:absolute; left:14px; top:50%; transform:translateY(-50%);
          color:var(--text-muted);
        }
        .cust-search-input {
          width:100%; padding:10px 14px 10px 40px;
          background:var(--surface2); border:1px solid var(--border);
          border-radius:10px; font-size:14px; color:var(--text);
          outline:none; transition:border-color 0.2s;
        }
        .cust-search-input:focus { border-color:var(--accent); }
        .cust-search-input::placeholder { color:var(--text-muted); opacity:0.6; }
        .cust-filter-btn {
          display:flex; align-items:center; gap:8px;
          background:var(--surface2); border:1px solid var(--border);
          color:var(--text-muted); padding:10px 16px; border-radius:10px;
          font-size:14px; font-weight:500; cursor:pointer; white-space:nowrap;
          transition:background 0.2s;
        }
        .cust-filter-btn:hover { background:var(--accent-soft); color:var(--text); }
        .cust-table { width:100%; border-collapse:collapse; }
        .cust-table th {
          padding:13px 24px; text-align:left; font-size:11px;
          font-weight:700; text-transform:uppercase; letter-spacing:0.6px;
          color:var(--text-muted); background:var(--surface2);
          border-bottom:1px solid var(--border);
        }
        .cust-row { border-bottom:1px solid var(--border); transition:background 0.15s; }
        .cust-row:last-child { border-bottom:none; }
        .cust-row:hover { background:var(--accent-soft); }
        .cust-user-cell { display:flex; align-items:center; gap:12px; padding:16px 24px; }
        .cust-avatar {
          width:36px; height:36px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:14px; font-weight:800; flex-shrink:0;
        }
        .cust-name  { font-size:14px; font-weight:700; color:var(--text); }
        .cust-email { font-size:12px; color:var(--text-muted); }
        .cust-badge {
          display:inline-block; padding:4px 12px; border-radius:20px;
          font-size:12px; font-weight:700;
        }
        .cust-cell  { padding:16px 24px; font-size:14px; color:var(--text); }
        .cust-muted { color:var(--text-muted); }
        .cust-more-btn {
          background:none; border:none; cursor:pointer; color:var(--text-muted);
          padding:6px; border-radius:6px; display:inline-flex; transition:color 0.15s;
        }
        .cust-more-btn:hover { color:var(--text); }
        .cust-footer {
          display:flex; justify-content:space-between; align-items:center;
          padding:16px 24px; border-top:1px solid var(--border);
          font-size:13px; color:var(--text-muted);
        }
        .cust-page-btn {
          padding:7px 14px; background:var(--surface2);
          border:1px solid var(--border); border-radius:8px;
          font-size:13px; color:var(--text-muted); cursor:pointer;
          transition:background 0.2s;
        }
        .cust-page-btn:hover { background:var(--accent-soft); color:var(--text); }
      `}</style>
    </div>
  );
}
