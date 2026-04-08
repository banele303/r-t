"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  Trash2, 
  Mail, 
  Calendar,
  Loader2,
  MoreVertical,
  Settings,
  ShieldQuestion
} from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const users = useQuery(api.admin.listAllUsers, { searchQuery: searchTerm });
  const isAdmin = useQuery(api.admin.isAdmin);
  const isSuper = false;
  
  const toggleBlock = useMutation(api.admin.toggleUserBlock);
  const updateRole = useMutation(api.admin.updateUserRole);

  const filtered = useMemo(() => {
    if (!users) return [];
    if (filterRole === "all") return users;
    return users.filter(u => {
      if (filterRole === "admin") return u.isAdmin && !u.isSuperAdmin;
      if (filterRole === "superadmin") return u.isSuperAdmin;
      if (filterRole === "blocked") return u.isBlocked;
      return !u.isAdmin;
    });
  }, [users, filterRole]);

  const handleToggleBlock = async (userId: any, currentStatus: boolean | undefined) => {
    try {
      await toggleBlock({ userId, block: !currentStatus });
      toast.success(currentStatus ? "User unblocked" : "User blocked successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle block status");
    }
  };

  const handleChangeRole = async (userId: any, currentRole: string | undefined, targetRole: string) => {
    try {
      const roleToSet = currentRole === targetRole ? "user" : targetRole;
      await updateRole({ userId, role: roleToSet });
      toast.success(`User updated to ${roleToSet}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  };

  if (users === undefined) {
    return (
      <div className="users-loading">
        <Loader2 className="spinner" size={32} />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div className="header-left">
          <div className="header-icon">
            <Users size={24} />
          </div>
          <div>
            <h1 className="header-title">User Management</h1>
            <p className="header-sub">Manage platform access, roles, and security.</p>
          </div>
        </div>
        <div className="header-right">
             <div className="stats-pill">
                <span className="stats-label">Total Users:</span>
                <span className="stats-value">{users.length}</span>
             </div>
        </div>
      </div>

      <div className="users-container">
        {/* Toolbar */}
        <div className="users-toolbar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <div className="filter-group">
                <Filter size={16} className="filter-icon" />
                <select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="superadmin">Super Admins</option>
                    <option value="user">Regular Users</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User Identity</th>
                <th>Privileges</th>
                <th>Status</th>
                <th>Joined On</th>
                <th className="text-right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <div className="empty-content">
                        <Users size={48} className="empty-icon" />
                        <h3>No users found</h3>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((user) => (
                <tr key={user._id} className={user.isBlocked ? "row-blocked" : ""}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ 
                        background: user.isSuperAdmin 
                            ? 'linear-gradient(135deg, #ff9d00, #ff5e00)' 
                            : user.isAdmin 
                                ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                                : 'var(--surface2)'
                      }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : <ShieldQuestion size={16} />}
                      </div>
                      <div className="user-meta">
                        <div className="user-name">
                            {user.name || "Anonymous User"}
                            {user.isSuperAdmin && <span className="super-badge" title="Super Admin">★</span>}
                        </div>
                        <div className="user-email">
                            <Mail size={12} /> {user.email || "No email provided"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="roles-cell">
                        {user.isSuperAdmin && <span className="role-tag super">Overall Admin</span>}
                        {user.isAdmin && !user.isSuperAdmin && <span className="role-tag admin">Staff Admin</span>}
                        {!user.isAdmin && <span className="role-tag user">Standard User</span>}
                    </div>
                  </td>
                  <td>
                    {user.isBlocked ? (
                        <span className="status-tag blocked">
                             <UserX size={12} /> Blocked
                        </span>
                    ) : (
                        <span className="status-tag active">
                             <UserCheck size={12} /> Active
                        </span>
                    )}
                  </td>
                  <td>
                    <div className="date-cell">
                        <Calendar size={12} />
                        {new Date(user._creationTime).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="text-right">
                    {isSuper && !user.isSuperAdmin ? (
                         <div className="actions-group">
                            <button 
                                onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                                title={user.isBlocked ? "Unblock User" : "Block User"}
                            >
                                {user.isBlocked ? <UserCheck size={18} /> : <UserX size={18} />}
                            </button>
                            
                            <button 
                                onClick={() => handleChangeRole(user._id, user.role, "admin")}
                                className={`action-btn ${user.isAdmin ? 'demote' : 'promote'}`}
                                title={user.isAdmin ? "Remove Staff Admin" : "Make Staff Admin"}
                            >
                                {user.isAdmin ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                            </button>
                         </div>
                    ) : (
                        <span className="manage-restricted">
                            {user.isSuperAdmin ? "Root Access" : "Staff Only"}
                        </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .users-page {
          animation: fadeIn 0.4s ease-out;
          color: var(--text);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .users-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          gap: 16px;
          color: var(--text-muted);
        }

        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }

        /* Header */
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 4px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 50px;
          height: 50px;
          background: var(--accent);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(var(--accent-rgb), 0.25);
        }

        .header-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0;
        }

        .header-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin: 0;
        }

        .stats-pill {
           background: var(--surface2);
           padding: 8px 16px;
           border-radius: 8px;
           border: 1px solid var(--border);
           display: flex;
           gap: 8px;
           font-size: 14px;
        }
        .stats-label { color: var(--text-muted); }
        .stats-value { font-weight: 700; color: var(--accent); }

        /* Container */
        .users-container {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.1);
          backdrop-filter: blur(8px);
          overflow: hidden;
        }

        /* Toolbar */
        .users-toolbar {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid var(--border);
          background: rgba(var(--background-rgb), 0.3);
        }

        .search-box {
          flex: 1;
          position: relative;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          background: var(--surface2);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .search-input:focus {
          border-color: var(--accent);
          background: var(--surface);
          box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.1);
        }

        .filter-group {
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--surface2);
            padding: 4px 12px;
            border-radius: 8px;
            border: 1px solid var(--border);
        }

        .filter-icon { color: var(--text-muted); }
        .filter-select {
            background: transparent;
            border: none;
            color: var(--text);
            font-size: 14px;
            font-weight: 500;
            outline: none;
            padding: 8px 0;
            cursor: pointer;
        }

        /* Table */
        .table-wrapper {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th {
          text-align: left;
          padding: 16px 24px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          background: rgba(var(--accent-rgb), 0.03);
          border-bottom: 1px solid var(--border);
        }

        .users-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
        }

        .users-table tr:hover:not(.empty-state) td {
          background: rgba(var(--accent-rgb), 0.02);
        }

        .row-blocked { opacity: 0.7; }
        .row-blocked td { background: rgba(239, 68, 68, 0.02); }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .user-name {
          font-weight: 700;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .super-badge {
            color: #ff9d00;
            font-size: 18px;
            line-height: 1;
        }

        .user-email {
          font-size: 13px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }

        .role-tag {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .role-tag.super { background: rgba(255, 157, 0, 0.15); color: #ff9d00; border: 1px solid rgba(255, 157, 0, 0.2); }
        .role-tag.admin { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
        .role-tag.user  { background: var(--surface2); color: var(--text-muted); border: 1px solid var(--border); }

        .status-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-tag.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-tag.blocked { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .date-cell {
          font-size: 13px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .actions-group {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }

        .action-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface2);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .action-btn.block:hover { background: #ef4444; border-color: #ef4444; }
        .action-btn.unblock:hover { background: #10b981; border-color: #10b981; }
        .action-btn.promote:hover { background: #3b82f6; border-color: #3b82f6; }
        .action-btn.demote:hover { background: #f59e0b; border-color: #f59e0b; }

        .manage-restricted {
            font-size: 12px;
            color: var(--text-muted);
            font-style: italic;
        }

        .text-right { text-align: right; }

        /* Empty State */
        .empty-state { padding: 80px 0 !important; }
        .empty-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: var(--text-muted);
        }
        .empty-icon { opacity: 0.2; margin-bottom: 16px; }
        .empty-content h3 { margin: 0; color: var(--text); }
        .empty-content p { margin: 8px 0 0; }
      `}</style>
    </div>
  );
}
