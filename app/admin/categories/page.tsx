"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tag, Trash2, Edit3, Plus, X, AlertTriangle, GripVertical } from "lucide-react";

export default function AdminCategories() {
  const categories = useQuery(api.categories?.get);
  const addCategory = useMutation(api.categories?.add);
  const updateCategory = useMutation(api.categories?.update);
  const deleteCategory = useMutation(api.categories?.remove);
  const updateOrder = useMutation(api.categories?.updateOrder);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCategory) return;
    setIsSubmitting(true);
    try {
      await addCategory({ name: formData.name, description: formData.description || undefined });
      setFormData({ name: "", description: "" });
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const openEdit = (cat: any) => {
    setEditingId(cat._id);
    setEditForm({ name: cat.name, description: cat.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  const saveEdit = async () => {
    if (!editingId || !updateCategory) return;
    setIsEditing(true);
    try {
      await updateCategory({
        id: editingId as any,
        name: editForm.name,
        description: editForm.description || undefined,
      });
      setEditingId(null);
      setEditForm({ name: "", description: "" });
    } catch (err) {
      console.error(err);
    }
    setIsEditing(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !deleteCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory({ id: deleteTarget.id as any });
    } catch (err) {
      console.error(err);
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  // ── Drag and Drop Logic ──
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const onDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newItems = [...(categories || [])];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    // Note: This is local state update if we had local state, but categories is from useQuery.
    // To make it feel smooth, we might need a local copy, but for now we'll update DB on drop.
  };

  const onDragEnd = async () => {
    setDraggedIndex(null);
  };

  const handleDrop = async (index: number) => {
    if (draggedIndex === null || draggedIndex === index || !categories || !updateOrder) return;
    
    const newItems = [...categories];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    const orders = newItems.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));
    
    try {
      await updateOrder({ orders });
    } catch (err) {
      console.error("Failed to update order:", err);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="cat-page">
      <div className="cat-header">
        <h1 className="cat-title">Product Categories</h1>
        <p className="cat-sub">Create and manage your product category taxonomy.</p>
      </div>

      <div className="cat-layout">
        {/* Add form */}
        <div className="cat-form-card">
          <div className="cat-form-icon">
            <Plus size={20} />
          </div>
          <h3>Add New Category</h3>
          <form onSubmit={handleSubmit} className="cat-form">
            <div className="cat-field">
              <label>Category Name <span className="req">*</span></label>
              <input required type="text" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Smart Tech" />
            </div>
            <div className="cat-field">
              <label>Description</label>
              <textarea rows={3} value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description (optional)..." />
            </div>
            <button type="submit" disabled={isSubmitting || !addCategory} className="cat-submit-btn">
              <Plus size={16} />
              {isSubmitting ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="cat-list-card">
          <div className="cat-list-header">
            <h3>Active Categories</h3>
            <span className="cat-count">{categories?.length ?? 0}</span>
          </div>
          {!categories ? (
            <div className="cat-empty">
              <div className="cat-empty-spinner" />
              <p>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="cat-empty">
              <Tag size={36} style={{ opacity: 0.2 }} />
              <p>No categories yet</p>
              <span>Add your first category using the form.</span>
            </div>
          ) : (
            <div className="cat-list">
              {categories.map((c: any, index: number) => (
                <div 
                  key={c._id} 
                  className={`cat-item ${editingId === c._id ? "editing" : ""} ${draggedIndex === index ? "dragging" : ""}`}
                  draggable={editingId !== c._id}
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={onDragEnd}
                >
                  {editingId === c._id ? (
                    /* ── Edit Mode ── */
                    <div className="cat-edit-form">
                      <div className="cat-edit-fields">
                        <input
                          autoFocus
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Category name"
                          className="cat-edit-input"
                        />
                        <input
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Description (optional)"
                          className="cat-edit-input small"
                        />
                      </div>
                      <div className="cat-edit-actions">
                        <button className="cat-save-btn" onClick={saveEdit} disabled={isEditing || !editForm.name.trim()}>
                          {isEditing ? "Saving..." : "Save"}
                        </button>
                        <button className="cat-cancel-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Display Mode ── */
                    <>
                      <div className="cat-drag-handle">
                        <GripVertical size={16} />
                      </div>
                      <div className="cat-item-icon">
                        <Tag size={16} />
                      </div>
                      <div className="cat-item-info">
                        <span className="cat-item-name">{c.name}</span>
                        {c.description && <span className="cat-item-desc">{c.description}</span>}
                      </div>
                      <div className="cat-item-actions">
                        <button className="cat-action-btn edit" onClick={() => openEdit(c)} title="Edit category">
                          <Edit3 size={14} />
                        </button>
                        <button className="cat-action-btn delete" onClick={() => setDeleteTarget({ id: c._id, name: c.name })} title="Delete category">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="del-backdrop" onClick={() => !isDeleting && setDeleteTarget(null)}>
          <div className="del-modal" onClick={e => e.stopPropagation()}>
            <div className="del-icon-wrap">
              <AlertTriangle size={32} />
            </div>
            <h3 className="del-title">Delete Category</h3>
            <p className="del-desc">
              Are you sure you want to permanently delete <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? 
              This action cannot be undone and may affect products using this category.
            </p>
            <div className="del-actions">
              <button className="del-cancel" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className="del-confirm" onClick={confirmDelete} disabled={isDeleting}>
                <Trash2 size={14} />
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .cat-page { display:flex; flex-direction:column; gap:28px; animation: catFadeIn 0.4s ease; }
        @keyframes catFadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

        .cat-title { font-size:28px; font-weight:800; color:var(--text); letter-spacing:-1px; margin:0 0 4px; }
        .cat-sub { font-size:14px; color:var(--text-muted); margin:0; }

        .cat-layout { display:grid; grid-template-columns:1fr 1.6fr; gap:24px; align-items:start; }
        @media(max-width:768px){ .cat-layout { grid-template-columns:1fr; } }

        /* ── Form Card ── */
        .cat-form-card {
          background:var(--surface); border-radius:20px; padding:28px;
          border:1px solid var(--border); position:relative; overflow:hidden;
        }
        .cat-form-card h3 { font-size:17px; font-weight:700; color:var(--text); margin:0 0 20px; }
        .cat-form-icon {
          width:40px; height:40px; border-radius:12px;
          background:linear-gradient(135deg, #1d4ed8, #3b82f6);
          color:white; display:flex; align-items:center; justify-content:center;
          margin-bottom:16px;
        }
        .cat-form { display:flex; flex-direction:column; gap:16px; }
        .cat-field { display:flex; flex-direction:column; gap:6px; }
        .cat-field label { font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; }
        .req { color:#ef4444; }
        .cat-field input, .cat-field textarea {
          background:var(--surface2); border:1.5px solid var(--border);
          border-radius:12px; padding:12px 14px; color:var(--text);
          outline:none; font-family:inherit; font-size:14px;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .cat-field input:focus, .cat-field textarea:focus {
          border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft);
        }
        .cat-submit-btn {
          display:flex; align-items:center; justify-content:center; gap:8px;
          background:linear-gradient(135deg, #1d4ed8, #3b82f6);
          color:white; border:none; padding:14px 24px; border-radius:14px;
          font-weight:700; font-size:14px; cursor:pointer;
          box-shadow:0 4px 14px rgba(29,78,216,0.3);
          transition:all 0.2s;
        }
        .cat-submit-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(29,78,216,0.4); }
        .cat-submit-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

        /* ── List Card ── */
        .cat-list-card {
          background:var(--surface); border-radius:20px; padding:24px;
          border:1px solid var(--border);
        }
        .cat-list-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .cat-list-header h3 { font-size:17px; font-weight:700; color:var(--text); margin:0; }
        .cat-count {
          background:var(--accent-soft); color:var(--accent);
          font-size:12px; font-weight:800; padding:4px 12px;
          border-radius:20px; min-width:28px; text-align:center;
        }

        .cat-list { display:flex; flex-direction:column; gap:6px; }
        .cat-item {
          display:flex; align-items:center; gap:14px;
          padding:14px 16px; border-radius:14px;
          border:1px solid var(--border); background:var(--surface2);
          transition:all 0.2s;
        }
        .cat-item:hover { background:var(--accent-soft); border-color:rgba(59,130,246,0.15); }
        .cat-item.editing { background:var(--accent-soft); border-color:var(--accent); padding:16px; }
        .cat-item.dragging { opacity: 0.5; background: var(--accent-soft); border-style: dashed; border-color: var(--accent); }

        .cat-drag-handle {
          cursor: grab;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .cat-drag-handle:hover { background: rgba(0,0,0,0.05); color: var(--text); }
        .cat-drag-handle:active { cursor: grabbing; }

        .cat-item-icon {
          width:36px; height:36px; border-radius:10px;
          background:var(--accent-soft); color:var(--accent);
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .cat-item-info { flex:1; display:flex; flex-direction:column; gap:2px; overflow:hidden; }
        .cat-item-name { font-size:14px; font-weight:700; color:var(--text); }
        .cat-item-desc { font-size:12px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        /* Action buttons */
        .cat-item-actions { display:flex; gap:6px; flex-shrink:0; }
        .cat-action-btn {
          display:flex; align-items:center; justify-content:center;
          width:34px; height:34px; border-radius:10px;
          border:none; cursor:pointer; transition:all 0.2s;
        }
        .cat-action-btn.edit {
          background:rgba(59,130,246,0.08); color:#3b82f6;
        }
        .cat-action-btn.edit:hover { background:rgba(59,130,246,0.18); transform:scale(1.08); }
        .cat-action-btn.delete {
          background:rgba(239,68,68,0.08); color:#ef4444;
        }
        .cat-action-btn.delete:hover { background:rgba(239,68,68,0.18); transform:scale(1.08); }

        /* Edit inline form */
        .cat-edit-form { display:flex; flex-direction:column; gap:12px; width:100%; }
        .cat-edit-fields { display:flex; flex-direction:column; gap:8px; }
        .cat-edit-input {
          width:100%; box-sizing:border-box;
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:10px; padding:10px 14px; color:var(--text);
          outline:none; font-family:inherit; font-size:14px; font-weight:600;
          transition:border-color 0.2s;
        }
        .cat-edit-input.small { font-size:13px; font-weight:400; }
        .cat-edit-input:focus { border-color:var(--accent); }
        .cat-edit-actions { display:flex; gap:8px; justify-content:flex-end; }
        .cat-save-btn {
          background:linear-gradient(135deg, #1d4ed8, #3b82f6);
          color:white; border:none; padding:8px 20px; border-radius:10px;
          font-weight:700; font-size:13px; cursor:pointer; transition:0.2s;
        }
        .cat-save-btn:hover { opacity:0.9; }
        .cat-save-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .cat-cancel-btn {
          background:var(--surface); border:1px solid var(--border);
          padding:8px 16px; border-radius:10px; color:var(--text-muted);
          font-weight:600; font-size:13px; cursor:pointer; transition:0.2s;
        }
        .cat-cancel-btn:hover { background:var(--surface2); }

        /* Empty state */
        .cat-empty {
          display:flex; flex-direction:column; align-items:center;
          justify-content:center; padding:48px 24px; color:var(--text-muted);
          text-align:center; gap:8px;
        }
        .cat-empty p { font-size:15px; font-weight:600; margin:0; color:var(--text); opacity:0.5; }
        .cat-empty span { font-size:13px; opacity:0.6; }
        .cat-empty-spinner {
          width:28px; height:28px; border:3px solid var(--border);
          border-top-color:var(--accent); border-radius:50%;
          animation:spin 0.8s linear infinite; margin-bottom:8px;
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* ── Delete Modal ── */
        .del-backdrop {
          position:fixed; inset:0; z-index:9999;
          background:rgba(0,0,0,0.65); backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center;
          padding:20px; animation:delFadeIn 0.2s ease;
        }
        @keyframes delFadeIn { from { opacity:0; } to { opacity:1; } }
        .del-modal {
          background:var(--surface); border-radius:24px; padding:36px;
          width:100%; max-width:420px; text-align:center;
          box-shadow:0 30px 60px rgba(0,0,0,0.4);
          border:1px solid var(--border);
          animation:delSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes delSlideUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .del-icon-wrap {
          width:64px; height:64px; border-radius:50%;
          background:rgba(239,68,68,0.1); color:#ef4444;
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 20px;
        }
        .del-title { font-size:20px; font-weight:800; color:var(--text); margin:0 0 12px; }
        .del-desc { font-size:14px; color:var(--text-muted); line-height:1.6; margin:0 0 28px; }
        .del-desc strong { color:var(--text); font-weight:700; }
        .del-actions { display:flex; gap:12px; justify-content:center; }
        .del-cancel {
          flex:1; padding:14px 20px; border-radius:14px;
          background:var(--surface2); border:1px solid var(--border);
          color:var(--text); font-weight:700; font-size:14px;
          cursor:pointer; transition:0.2s;
        }
        .del-cancel:hover { background:var(--border); }
        .del-cancel:disabled { opacity:0.5; cursor:not-allowed; }
        .del-confirm {
          flex:1; display:flex; align-items:center; justify-content:center; gap:8px;
          padding:14px 20px; border-radius:14px;
          background:linear-gradient(135deg, #dc2626, #ef4444);
          border:none; color:white; font-weight:700; font-size:14px;
          cursor:pointer; transition:0.2s;
          box-shadow:0 4px 14px rgba(239,68,68,0.3);
        }
        .del-confirm:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(239,68,68,0.4); }
        .del-confirm:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
      `}</style>
    </div>
  );
}
