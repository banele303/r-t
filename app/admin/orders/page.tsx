"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  MoreVertical 
} from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  processing: ShoppingBag,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

export default function AdminOrders() {
  const orders = useQuery(api.orders.get);
  const updateStatus = useMutation(api.orders.updateStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusUpdate = async (id: any, status: string) => {
    try {
      await updateStatus({ id, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1 className="orders-title">Order Management</h1>
          <p className="orders-sub">Track and manage customer orders across all channels.</p>
        </div>
      </div>

      <div className="orders-controls">
        <div className="orders-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by customer name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="orders-filter">
          <Filter size={18} className="filter-icon" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="admin-list-card">
        <h3>Recent Orders ({filteredOrders?.length ?? 0})</h3>
        {!orders ? (
          <div className="loading-state"><p>Fetching orders...</p></div>
        ) : filteredOrders?.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={48} />
            <p>No orders found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                   const StatusIcon = statusIcons[order.status] || Clock;
                   return (
                    <tr key={order._id}>
                      <td>
                        <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <span className="customer-name">{order.customerName}</span>
                          <span className="customer-email">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="order-total">R {order.total.toLocaleString()}</span>
                      </td>
                      <td>
                        <div className="status-badge" style={{ 
                          backgroundColor: `${statusColors[order.status]}15`,
                          color: statusColors[order.status],
                          border: `1px solid ${statusColors[order.status]}30`
                        }}>
                          <StatusIcon size={14} />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="order-actions">
                          <select 
                            className="status-selector"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button className="view-btn" title="View Details">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .orders-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: fadeIn 0.4s ease;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .orders-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text);
          letter-spacing: -1px;
          margin-bottom: 6px;
        }

        .orders-sub {
          font-size: 15px;
          color: var(--text-muted);
        }

        .orders-controls {
          display: flex;
          gap: 16px;
          align-items: center;
          background: var(--surface);
          padding: 20px;
          border-radius: 18px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .orders-search {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .orders-search input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: var(--surface2);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .orders-search input:focus {
          border-color: var(--accent);
        }

        .orders-filter {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 200px;
        }

        .filter-icon {
          color: var(--text-muted);
        }

        .orders-filter select {
          width: 100%;
          padding: 12px 16px;
          background: var(--surface2);
          border: 1.5px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }

        .customer-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .customer-name {
          font-weight: 700;
          color: var(--text);
          font-size: 14px;
        }

        .customer-email {
          font-size: 12px;
          color: var(--text-muted);
        }

        .order-id {
          font-family: monospace;
          background: var(--surface2);
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 700;
          color: var(--accent);
          font-size: 12px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .order-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .status-selector {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .view-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn:hover {
          color: var(--accent);
          background: var(--accent-soft);
          border-color: var(--accent);
        }

        .empty-state {
          padding: 80px 20px;
          text-align: center;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
