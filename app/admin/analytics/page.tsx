"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  ComposedChart, Bar, Line
} from 'recharts';
import { Calendar, Download } from 'lucide-react';

const organicData = [
  { name: 'Mon', organic: 4000, paid: 2400 }, { name: 'Tue', organic: 3000, paid: 1398 },
  { name: 'Wed', organic: 2000, paid: 9800 }, { name: 'Thu', organic: 2780, paid: 3908 },
  { name: 'Fri', organic: 1890, paid: 4800 }, { name: 'Sat', organic: 2390, paid: 3800 },
  { name: 'Sun', organic: 3490, paid: 4300 },
];

const categoryData = [
  { name: 'Mac', value: 400 }, { name: 'iPhone', value: 300 },
  { name: 'iPad', value: 300 }, { name: 'Accessories', value: 200 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const salesData = [
  { name: 'Week 1', sales: 590, traffic: 800 }, { name: 'Week 2', sales: 868, traffic: 967 },
  { name: 'Week 3', sales: 1397, traffic: 1098 }, { name: 'Week 4', sales: 1480, traffic: 1200 },
  { name: 'Week 5', sales: 1520, traffic: 1108 },
];

const tooltipStyle = {
  borderRadius: 12, border: 'none',
  background: 'var(--surface)', color: 'var(--text)',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");

  return (
    <div className="an-page">
      {/* Header */}
      <div className="an-header">
        <div>
          <h1 className="an-title">Store Analytics</h1>
          <p className="an-sub">Detailed metrics and performance data</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="an-date-picker">
            <Calendar size={15} />
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="an-select">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <button className="an-export-btn">
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Traffic Area Chart */}
      <div className="an-card">
        <h3 className="an-card-title">Store Traffic Source</h3>
        <p className="an-card-sub">Organic search vs paid marketing funnels.</p>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={organicData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} dx={-10} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 13, color: 'var(--text-muted)' }} iconType="circle" />
              <Area type="monotone" dataKey="organic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrganic)" strokeWidth={2} />
              <Area type="monotone" dataKey="paid" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPaid)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid charts */}
      <div className="an-grid">
        <div className="an-card">
          <h3 className="an-card-title">Sales by Category</h3>
          <p className="an-card-sub">Revenue distribution across product lines.</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={5} dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="an-card">
          <h3 className="an-card-title">Sales vs. Traffic</h3>
          <p className="an-card-sub">Do visits convert into purchases?</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={salesData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} dx={10} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--accent-soft)' }} />
                <Legend iconType="circle" wrapperStyle={{ color: 'var(--text-muted)', fontSize: 13 }} />
                <Bar yAxisId="left" dataKey="sales" barSize={18} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="traffic" stroke="#f59e0b" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        .an-page { display:flex; flex-direction:column; gap:24px; }
        .an-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; }
        .an-title { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-0.5px; margin:0 0 4px; }
        .an-sub { font-size:14px; color:var(--text-muted); margin:0; }
        .an-date-picker {
          display:flex; align-items:center; gap:8px;
          background:var(--surface); border:1px solid var(--border);
          padding:9px 16px; border-radius:10px; color:var(--text); font-size:14px;
        }
        .an-select { border:none; outline:none; background:transparent; color:var(--text); cursor:pointer; font-size:14px; font-weight:500; }
        .an-export-btn {
          display:flex; align-items:center; gap:8px;
          background:var(--accent); color:#fff; border:none;
          padding:9px 18px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; transition:opacity 0.2s;
        }
        .an-export-btn:hover { opacity:0.88; }
        .an-card {
          background:var(--surface); border:1px solid var(--border);
          border-radius:18px; padding:28px; overflow:hidden;
        }
        .an-card-title { font-size:16px; font-weight:700; color:var(--text); margin:0 0 6px; }
        .an-card-sub { font-size:13px; color:var(--text-muted); margin:0 0 20px; }
        .an-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media(max-width:800px){ .an-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
