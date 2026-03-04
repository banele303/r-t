"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { TrendingUp, Users, CreditCard, DollarSign } from 'lucide-react';

const revenueData = [
  { name: 'Jan', total: 3200 }, { name: 'Feb', total: 4100 },
  { name: 'Mar', total: 2800 }, { name: 'Apr', total: 5600 },
  { name: 'May', total: 4700 }, { name: 'Jun', total: 6100 },
  { name: 'Jul', total: 5300 },
];

const conversionData = [
  { name: 'Mon', rate: 2.4 }, { name: 'Tue', rate: 3.1 },
  { name: 'Wed', rate: 2.8 }, { name: 'Thu', rate: 4.2 },
  { name: 'Fri', rate: 5.0 }, { name: 'Sat', rate: 6.1 },
  { name: 'Sun', rate: 5.8 },
];

const stats = [
  { title: "Total Revenue",  value: "R 245,892", icon: DollarSign, change: "+20.1% from last month",  color: "#3b82f6" },
  { title: "Customers",      value: "+2,350",    icon: Users,       change: "+180.1% from last month", color: "#10b981" },
  { title: "Sales",          value: "+12,234",   icon: CreditCard,  change: "+19% from last month",    color: "#f59e0b" },
  { title: "Active Now",     value: "+573",      icon: TrendingUp,  change: "+201 since last hour",    color: "#8b5cf6" },
];

export default function DashboardPage() {
  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-header">
        <h1 className="dash-title">Dashboard Overview</h1>
        <button className="dash-btn">
          <TrendingUp size={16} /> Download Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="dash-stats">
        {stats.map(({ title, value, icon: Icon, change, color }) => (
          <div key={title} className="dash-stat-card">
            <div className="stat-top">
              <span className="stat-title">{title}</span>
              <span className="stat-icon" style={{ background: `${color}18`, color }}>
                <Icon size={18} />
              </span>
            </div>
            <div className="stat-value">{value}</div>
            <p className="stat-change">{change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="dash-charts">
        <div className="dash-chart-card wide">
          <h3 className="chart-title">Monthly Revenue</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 13 }}
                  tickFormatter={v => `R${v}`} dx={-10} />
                <Tooltip
                  cursor={{ fill: 'var(--accent-soft)' }}
                  contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  formatter={((v: number) => [`R${v}`, 'Revenue']) as any}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-chart-card">
          <h3 className="chart-title">Conversion Rate</h3>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 13 }} dy={10} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', background: 'var(--surface)', color: 'var(--text)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  formatter={((v: number) => [`${v}%`, 'Rate']) as any}
                />
                <Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: 'var(--surface)' }}
                  activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        .dash-page { display:flex; flex-direction:column; gap:28px; }
        .dash-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
        .dash-title { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-0.5px; margin:0; }
        .dash-btn {
          display:flex; align-items:center; gap:8px;
          background:var(--accent); color:#fff; border:none;
          padding:11px 20px; border-radius:12px; font-size:14px; font-weight:700;
          cursor:pointer; transition:opacity 0.2s;
        }
        .dash-btn:hover { opacity:0.88; }
        .dash-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px; }
        .dash-stat-card {
          background:var(--surface); border:1px solid var(--border);
          border-radius:18px; padding:24px; display:flex; flex-direction:column; gap:8px;
        }
        .stat-top { display:flex; justify-content:space-between; align-items:center; }
        .stat-title { font-size:13px; font-weight:600; color:var(--text-muted); }
        .stat-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
        .stat-value { font-size:30px; font-weight:800; color:var(--text); }
        .stat-change { font-size:12px; color:var(--text-muted); margin:0; }
        .dash-charts { display:grid; grid-template-columns:2fr 1fr; gap:18px; }
        @media(max-width:900px){ .dash-charts { grid-template-columns:1fr; } }
        .dash-chart-card {
          background:var(--surface); border:1px solid var(--border);
          border-radius:18px; padding:28px; overflow:hidden;
        }
        .chart-title { font-size:16px; font-weight:700; color:var(--text); margin:0 0 24px; }
      `}</style>
    </div>
  );
}
