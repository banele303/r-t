"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tag, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const categories = useQuery(api.categories?.get);
  const addCategory = useMutation(api.categories?.add);
  const deleteCategory = useMutation(api.categories?.remove);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCategory) return;
    setIsSubmitting(true);
    try {
      await addCategory({ name: formData.name, description: formData.description || undefined });
      setFormData({ name: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add category.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: any) => {
    if (!deleteCategory) return;
    if (confirm("Permanently delete this category?")) await deleteCategory({ id });
  };

  return (
    <div className="cat-page">
      <div className="cat-header">
        <h1 className="cat-title">Product Categories</h1>
        <p className="cat-sub">Create and manage your product category taxonomy.</p>
      </div>

      <div className="cat-layout">
        {/* Add form */}
        <div className="admin-form-card">
          <h3>Add New Category</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Category Name</label>
              <input required type="text" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Smart Tech" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={3} value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description..." />
            </div>
            <button type="submit" disabled={isSubmitting || !addCategory} className="btn-admin-submit">
              {isSubmitting ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="admin-list-card">
          <h3>Active Categories ({categories?.length ?? 0})</h3>
          {!categories ? (
            <div className="loading-state"><p>Loading...</p></div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <Tag size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p>No categories yet. Add your first one.</p>
            </div>
          ) : (
            <div className="cat-list">
              {categories.map((c: any) => (
                <div key={c._id} className="cat-item">
                  <div className="cat-item-icon">
                    <Tag size={16} />
                  </div>
                  <div className="cat-item-info">
                    <span className="cat-item-name">{c.name}</span>
                    {c.description && <span className="cat-item-desc">{c.description}</span>}
                  </div>
                  <button className="btn-admin-delete" onClick={() => handleDelete(c._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cat-page { display:flex; flex-direction:column; gap:24px; }
        .cat-header h1 { font-size:26px; font-weight:800; color:var(--text); letter-spacing:-0.5px; margin:0 0 4px; }
        .cat-header p  { font-size:14px; color:var(--text-muted); margin:0; }
        .cat-layout { display:grid; grid-template-columns:1fr 1.5fr; gap:24px; align-items:start; }
        @media(max-width:768px){ .cat-layout { grid-template-columns:1fr; } }
        .cat-list { display:flex; flex-direction:column; gap:4px; }
        .cat-item {
          display:flex; align-items:center; gap:14px;
          padding:14px 16px; border-radius:12px;
          border:1px solid var(--border); background:var(--surface2);
          transition:background 0.18s;
        }
        .cat-item:hover { background:var(--accent-soft); }
        .cat-item-icon {
          width:34px; height:34px; border-radius:10px;
          background:var(--accent-soft); color:var(--accent);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .cat-item-info { flex:1; display:flex; flex-direction:column; gap:2px; overflow:hidden; }
        .cat-item-name { font-size:14px; font-weight:700; color:var(--text); }
        .cat-item-desc { font-size:12px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .btn-admin-delete {
          display:flex; align-items:center; justify-content:center;
          width:32px; height:32px; flex-shrink:0;
          background:rgba(239,68,68,0.10); color:var(--danger);
          border:1px solid rgba(239,68,68,0.2); border-radius:8px;
          cursor:pointer; transition:background 0.2s;
        }
        .btn-admin-delete:hover { background:rgba(239,68,68,0.2); }
        .empty-state {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; padding:48px 24px; color:var(--text-muted);
          font-size:14px; text-align:center; gap:4px;
        }
      `}</style>
    </div>
  );
}
