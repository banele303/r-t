"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import {
  Plus, X, Upload, Trash2, Package,
  Tag, DollarSign, Search, Percent, Calendar,
  Palette, Ruler, Edit, MoreVertical, ExternalLink
} from "lucide-react";
import Link from "next/link";



// Auto-detect hex from common color names
const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a", white: "#f5f5f7", silver: "#c0c0c0", gold: "#d4af37",
  blue: "#2563eb", red: "#dc2626", green: "#16a34a", purple: "#7c3aed",
  pink: "#ec4899", midnight: "#1c1c1e", starlight: "#f2e8db", yellow: "#eab308",
  orange: "#f97316", brown: "#92400e", navy: "#1e3a5f", teal: "#14b8a6",
  cyan: "#06b6d4", rose: "#f43f5e", indigo: "#6366f1", gray: "#6b7280",
  grey: "#6b7280", beige: "#d4c5a9", cream: "#fffdd0", maroon: "#800000",
  coral: "#ff7f50", lavender: "#b4a7d6", magenta: "#ff00ff", lime: "#84cc16",
  olive: "#808000", peach: "#ffcba4", turquoise: "#40e0d0", violet: "#8b5cf6",
  charcoal: "#36454f", burgundy: "#800020", khaki: "#c3b091", mint: "#98ff98",
  "space gray": "#535150", "space grey": "#535150", "sky blue": "#87ceeb",
  "deep purple": "#4a148c", "dark blue": "#00008b", "light blue": "#a8d8ea",
  "rose gold": "#b76e79", "jet black": "#0a0a0a", "desert titanium": "#a0926b",
  "natural titanium": "#9a9590", "white titanium": "#d6d2cd", "black titanium": "#3b3b3d",
  "blue titanium": "#394d6d",
};
const getColorHex = (name: string): string | null => COLOR_MAP[name.toLowerCase()] ?? null;

const emptyForm = {
  name: "", brand: "", price: "", oldPrice: "",
  category: "", subCategory: "", tag: "", description: "",
  stock: "",
  isPromo: false, isTrending: false,
  isOnSale: false, saleEndsAt: "",
  colors: [] as string[],
  sizes:  [] as string[],
  sizePrices: [] as { size: string, price: string, oldPrice: string }[],
};

// Per-color image data types
type ColorImageEntry = {
  color: string;
  imageId: string;   // existing storage ID (when editing)
  previewUrl: string; // object URL or existing URL
  newFile?: File;     // newly selected file
};

export default function AdminProducts() {
  const products         = useQuery(api.products?.get);
  const dbCategories     = useQuery(api.categories?.get);
  const dbSubcategories  = useQuery(api.subcategories?.get);
  const seedSubcats      = useMutation(api.subcategories?.seedAll);
  const addProduct       = useMutation(api.products?.add);
  const updateProduct    = useMutation(api.products?.update);
  const deleteProduct    = useMutation(api.products?.remove);
  const genUploadUrl     = useMutation(api.storage?.generateUploadUrl);

  // Dynamic categories from the database
  const categoryNames = (dbCategories ?? []).map((c: any) => c.name);
  const allSubcategories = dbSubcategories ?? [];

  // Auto-seed subcategories once on mount if none exist
  useEffect(() => {
    if (dbSubcategories !== undefined && dbSubcategories.length === 0) {
      seedSubcats({}).catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbSubcategories]);

  const imageRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedExtraImages, setSelectedExtraImages] = useState<File[]>([]);
  const [previewUrl,    setPreviewUrl]    = useState<string | null>(null);
  const [extraPreviewUrls, setExtraPreviewUrls] = useState<string[]>([]);
  const [existingExtraIds, setExistingExtraIds] = useState<string[]>([]);
  const [existingExtraUrls, setExistingExtraUrls] = useState<string[]>([]);
  const [formData,      setFormData]      = useState({ ...emptyForm });
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editingId,     setEditingId]     = useState<string | null>(null);
  const [search,        setSearch]        = useState("");
  const [colorInput,    setColorInput]    = useState("");
  const [sizeInput,     setSizeInput]     = useState("");
  const [activeMenu,    setActiveMenu]    = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean, id: any, imageId: any }>({ open: false, id: null, imageId: null });
  const [currentPage,   setCurrentPage]   = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Per-color image state
  const [colorImages, setColorImages] = useState<ColorImageEntry[]>([]);
  const colorImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const set = (k: string, v: any) => setFormData(p => ({ ...p, [k]: v }));

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() ?? "",
      category: product.category,
      subCategory: product.subCategory ?? "",
      tag: product.tag ?? "",
      description: product.description ?? "",
      stock: product.stock?.toString() ?? "",
      isPromo: product.isPromo ?? false,
      isTrending: product.isTrending ?? false,
      isOnSale: product.isOnSale ?? false,
      saleEndsAt: product.saleEndsAt ?? "",
      colors: product.colors ?? [],
      sizes: product.sizes ?? [],
      sizePrices: product.sizePrices?.map((sp: any) => ({
        size: sp.size,
        price: sp.price.toString(),
        oldPrice: sp.oldPrice?.toString() ?? "",
      })) ?? [],
    });
    setPreviewUrl(product.imageUrl);
    setExistingExtraUrls(product.additionalImageUrls ?? []);
    setExistingExtraIds(product.additionalImageIds ?? []);
    setExtraPreviewUrls([]);
    setSelectedExtraImages([]);
    // Restore existing color images
    const existingColorImages: ColorImageEntry[] = (product.colorImageUrls ?? []).map((ci: any) => ({
      color: ci.color,
      imageId: ci.imageId,
      previewUrl: ci.imageUrl,
    }));
    setColorImages(existingColorImages);
    setModalOpen(true);
    setActiveMenu(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ ...emptyForm });
    setSelectedImage(null);
    setSelectedExtraImages([]);
    setPreviewUrl(null);
    setExtraPreviewUrls([]);
    setExistingExtraUrls([]);
    setExistingExtraIds([]);
    setEditingId(null);
    setColorInput("");
    setSizeInput("");
    setColorImages([]);
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setSelectedExtraImages(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setExtraPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeExtraImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingExtraUrls(prev => prev.filter((_, i) => i !== index));
      setExistingExtraIds(prev => prev.filter((_, i) => i !== index));
    } else {
      setSelectedExtraImages(prev => prev.filter((_, i) => i !== index));
      setExtraPreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addColor = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !formData.colors.includes(trimmed)) {
      set("colors", [...formData.colors, trimmed]);
      // Add a placeholder slot for this color's image if not present
      setColorImages(prev => {
        if (prev.some(ci => ci.color === trimmed)) return prev;
        return [...prev, { color: trimmed, imageId: "", previewUrl: "" }];
      });
    }
    setColorInput("");
  };
  const removeColor = (c: string) => {
    set("colors", formData.colors.filter(x => x !== c));
    setColorImages(prev => prev.filter(ci => ci.color !== c));
  };

  const handleColorImageChange = (color: string, file: File) => {
    const url = URL.createObjectURL(file);
    setColorImages(prev =>
      prev.map(ci => ci.color === color
        ? { ...ci, previewUrl: url, newFile: file }
        : ci
      )
    );
  };

  const addSize = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !formData.sizes.includes(trimmed)) {
      set("sizes", [...formData.sizes, trimmed]);
      // If adding a size, also add a default entry in sizePrices if not exists
      if (!formData.sizePrices.some(sp => sp.size === trimmed)) {
        set("sizePrices", [...formData.sizePrices, { size: trimmed, price: formData.price, oldPrice: formData.oldPrice }]);
      }
    }
    setSizeInput("");
  };
  const removeSize = (s: string) => {
    set("sizes", formData.sizes.filter(x => x !== s));
    set("sizePrices", formData.sizePrices.filter(sp => sp.size !== s));
  };

  const updateSizePrice = (size: string, field: "price" | "oldPrice", value: string) => {
    set("sizePrices", formData.sizePrices.map(sp => 
      sp.size === size ? { ...sp, [field]: value } : sp
    ));
  };

  const handleTagKeydown = (
    e: KeyboardEvent<HTMLInputElement>,
    add: (v: string) => void,
    val: string
  ) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(val); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let storageId = undefined;
      if (selectedImage && genUploadUrl) {
        const postUrl = await genUploadUrl();
        const res = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        const json = await res.json();
        storageId = json.storageId;
      }

      const extraStorageIds: string[] = [];
      for (const file of selectedExtraImages) {
        if (!genUploadUrl) continue;
        const postUrl = await genUploadUrl();
        const res = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const json = await res.json();
        extraStorageIds.push(json.storageId);
      }

      const finalExtraImages = [...existingExtraIds, ...extraStorageIds];

      // Upload per-color images
      const uploadedColorImages: { color: string; imageId: string }[] = [];
      for (const ci of colorImages) {
        if (ci.newFile && genUploadUrl) {
          const postUrl = await genUploadUrl();
          const res = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": ci.newFile.type },
            body: ci.newFile,
          });
          const json = await res.json();
          uploadedColorImages.push({ color: ci.color, imageId: json.storageId });
        } else if (ci.imageId) {
          // Keep existing
          uploadedColorImages.push({ color: ci.color, imageId: ci.imageId });
        }
      }

      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        category: formData.category,
        subCategory: formData.subCategory || undefined,
        tag: formData.tag || undefined,
        description: formData.description || undefined,
        stock: formData.stock ? Number(formData.stock) : undefined,
        isPromo: formData.isPromo,
        isTrending: formData.isTrending,
        isOnSale: formData.isOnSale,
        saleEndsAt: formData.isOnSale && formData.saleEndsAt ? formData.saleEndsAt : undefined,
        colors: formData.colors.length ? formData.colors : undefined,
        colorImages: uploadedColorImages.length ? uploadedColorImages : undefined,
        sizes: formData.sizes.length  ? formData.sizes  : undefined,
        sizePrices: formData.sizePrices.length ? formData.sizePrices.map(sp => ({
          size: sp.size,
          price: Number(sp.price),
          oldPrice: sp.oldPrice ? Number(sp.oldPrice) : undefined,
        })) : undefined,
        additionalImageIds: finalExtraImages.length ? finalExtraImages : undefined,
      };

      if (editingId) {
        await updateProduct({ 
          id: editingId as any, 
          ...payload,
          imageId: storageId || undefined
        });
      } else {
        if (!storageId) throw new Error("Image required for new product");
        await addProduct({ ...payload, imageId: storageId });
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Operation failed.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = (id: any, imageId: any) => {
    setDeleteConfirm({ open: true, id, imageId });
    setActiveMenu(null);
  };

  const confirmDeleteAction = async () => {
    if (deleteConfirm.id) {
      await deleteProduct({ id: deleteConfirm.id, imageId: deleteConfirm.imageId });
      setDeleteConfirm({ open: false, id: null, imageId: null });
    }
  };

  const filtered = (products ?? []).filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="pm-page">
      <div className="pm-header">
        <div>
          <h1 className="pm-title">Products Master</h1>
          <p className="pm-sub">{products?.length ?? 0} total products listed</p>
        </div>
        <button className="pm-add-btn" onClick={openAddModal}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="pm-search-wrap">
        <Search size={16} className="pm-search-icon" />
        <input className="pm-search-input" placeholder="Search by name or brand…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-list-card">
        <h3>Inventory List</h3>
        {!products ? (
          <div className="loading-state"><p>Syncing inventory...</p></div>
        ) : filtered.length === 0 ? (
          <div className="pm-empty">
            <Package size={40} style={{ opacity: 0.25 }} />
            <p>No products found matching &quot;{search}&quot;</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Info</th>
                <th>Category</th>
                <th>Price / Sale</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p: any) => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-tb-img" style={{ width: 40, height: 40, borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                      {p.imageUrl
                        ? <Image src={p.imageUrl} alt={p.name} width={40} height={40} style={{ objectFit: "cover", width: '100%', height: '100%' }} />
                        : <Package size={20} style={{ opacity: 0.3 }} />}
                    </div>
                  </td>
                  <td>
                    <div className="prod-info-cell">
                      <span className="prod-name">{p.name}</span>
                      <div className="prod-meta">
                        <span className="prod-brand">{p.brand}</span>
                        {p.tag && <span className="admin-tb-badge">{p.tag}</span>}
                      </div>
                    </div>
                  </td>
                  <td><span className="cat-chip">{p.category}</span></td>
                  <td>
                    <div className="price-cell">
                      <span className="current-price">R {p.price?.toLocaleString()}</span>
                      {p.isOnSale && <span className="sale-tag">SALE</span>}
                    </div>
                  </td>
                  <td>
                    <div className="stock-cell">
                      <span className={`stock-status ${(!p.stock || p.stock === 0) ? 'out' : p.stock < 10 ? 'low' : 'ok'}`}>
                        {p.stock === 0 ? "Out of Stock" : p.stock < 10 ? `Low: ${p.stock}` : `In Stock: ${p.stock}`}
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="actions-wrapper">
                      <button 
                        className="menu-trigger" 
                        onClick={() => setActiveMenu(activeMenu === p._id ? null : p._id)}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {activeMenu === p._id && (
                        <>
                          <div className="menu-overlay" onClick={() => setActiveMenu(null)} />
                          <div className="actions-menu">
                            <button onClick={() => openEditModal(p)}>
                              <Edit size={14} /> Edit Product
                            </button>
                            <Link href={`/product/${p._id}`} target="_blank">
                              <ExternalLink size={14} /> View Live
                            </Link>
                            <div className="menu-divider" />
                            <button className="del-action" onClick={() => handleDelete(p._id, p.imageId)}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="pm-pagination">
            <span className="pm-page-info">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
            </span>
            <div className="pm-pagination-controls">
              <button 
                className="pm-page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <div className="pm-page-numbers">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    return (
                      <button 
                        key={pageNum} 
                        className={`pm-page-num ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="pm-page-dots">...</span>;
                  }
                  return null;
                })}
              </div>
              <button 
                className="pm-page-btn"
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="pm-backdrop" onClick={closeModal}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>
            <div className="pm-modal-header">
              <div>
                <h2 className="pm-modal-title">{editingId ? "Update Product" : "Add New Product"}</h2>
                <p className="pm-modal-sub">{editingId ? "Modify product details and save changes." : "Enter product specifications below."}</p>
              </div>
              <button className="pm-close-btn" onClick={closeModal}><X size={20} /></button>
            </div>

            <div className="pm-modal-body">
              <form onSubmit={handleSubmit} className="pm-form">
                <div className="pm-upload-zone" onClick={() => imageRef.current?.click()}>
                  {previewUrl ? (
                    <Image src={previewUrl} alt="preview" width={120} height={120} style={{ objectFit: "contain", borderRadius: 8 }} />
                  ) : (
                    <>
                      <Upload size={28} style={{ opacity: 0.4 }} />
                      <span>Upload Primary Image</span>
                    </>
                  )}
                  <input ref={imageRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} required={!editingId} />
                </div>

                <div className="pm-section-label">General Information</div>
                <div className="pm-row">
                  <Field label="Product Name" required>
                    <input required value={formData.name} onChange={e => set("name", e.target.value)} placeholder="e.g. iPhone 16 Pro Max" />
                  </Field>
                  <Field label="Brand" required>
                    <select required value={formData.brand} onChange={e => set("brand", e.target.value)}>
                      <option value="" disabled>Select a brand</option>
                      <option value="Honor">Honor</option>
                      <option value="Huawei">Huawei</option>
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Oppo">Oppo</option>
                      <option value="Vivo">Vivo</option>
                      <option value="Realme">Realme</option>
                      <option value="Sony">Sony</option>
                      <option value="Nokia">Nokia</option>
                      <option value="Motorola">Motorola</option>
                      <option value="Google">Google</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="Asus">Asus</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>
                </div>
                {/* Sub-Category selector — auto-fills parent category */}
                <div className="pm-row">
                  <Field label="Sub-Category" required>
                    <select
                      required
                      value={formData.subCategory}
                      onChange={e => {
                        const selectedSub = e.target.value;
                        const match = allSubcategories.find((s: any) => s.name === selectedSub);
                        set("subCategory", selectedSub);
                        if (match) set("category", match.parentCategory);
                      }}
                    >
                      <option value="" disabled>Select a sub-category</option>
                      {categoryNames.map((cat: string) => {
                        const subs = allSubcategories.filter((s: any) => s.parentCategory === cat);
                        if (!subs.length) return null;
                        return (
                          <optgroup key={cat} label={`── ${cat} ──`}>
                            {subs.map((s: any) => (
                              <option key={s._id} value={s.name}>{s.icon ? `${s.icon} ` : ''}{s.name}</option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  </Field>
                  <Field label="Brand (Category)">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      {formData.category ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
                          color: 'white', padding: '10px 16px', borderRadius: '12px',
                          fontSize: '13px', fontWeight: 700
                        }}>
                          ✓ {formData.category}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Auto-filled from sub-category</span>
                      )}
                    </div>
                  </Field>
                </div>
                <div className="pm-row">
                  <Field label="Display Tag">
                    <input value={formData.tag} onChange={e => set("tag", e.target.value)} placeholder="e.g. Best Seller" />
                  </Field>
                  <Field label="Stock Count">
                    <input type="number" value={formData.stock} onChange={e => set("stock", e.target.value)} placeholder="0" />
                  </Field>
                </div>
                <Field label="Full Description (Rich Text Toolbar)" full>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px', background: '#f5f5f7', padding: '10px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                    <button type="button" onClick={() => set("description", (formData.description || "") + "\n<h1>Main Title</h1>\n")} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 800 }}>H1</button>
                    <button type="button" onClick={() => set("description", (formData.description || "") + "\n<h2>Sub Heading</h2>\n")} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 700 }}>H2</button>
                    <button type="button" onClick={() => set("description", (formData.description || "") + "\n<h3>Minor Title</h3>\n")} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 600 }}>H3</button>
                    <button type="button" onClick={() => set("description", (formData.description || "") + "<b>Bold Text</b>")} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 700 }}><b>B</b></button>
                    <button type="button" onClick={() => set("description", (formData.description || "") + "\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n")} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer' }}>• List</button>
                    <button type="button" onClick={() => set("description", (formData.description || "") + "<br/>\n")} style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer' }}>New Line</button>
                  </div>
                  <textarea rows={12} value={formData.description} onChange={e => set("description", e.target.value)} placeholder="Use the buttons above to format your description..." style={{ minHeight: '240px', lineHeight: '1.6' }} />
                </Field>

                <div className="pm-section-label">Additional Product Photos</div>
                <div className="pm-gallery-grid">
                  {/* Existing Images */}
                  {existingExtraUrls.map((url, i) => (
                    <div key={`existing-${i}`} className="pm-gallery-item">
                      <Image src={url} alt="extra" fill style={{ objectFit: "cover" }} />
                      <button type="button" className="pm-gallery-remove" onClick={() => removeExtraImage(i, true)}><X size={12} /></button>
                    </div>
                  ))}
                  
                  {/* New Upload Previews */}
                  {extraPreviewUrls.map((url, i) => (
                    <div key={`new-${i}`} className="pm-gallery-item new">
                      <Image src={url} alt="extra-new" fill style={{ objectFit: "cover" }} />
                      <button type="button" className="pm-gallery-remove" onClick={() => removeExtraImage(i, false)}><X size={12} /></button>
                    </div>
                  ))}
                  
                  {/* Upload Trigger */}
                  <label className="pm-gallery-add">
                    <Plus size={20} />
                    <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleExtraImagesChange} />
                  </label>
                </div>

                <div className="pm-section-label">Pricing & Discounts</div>
                <div className="pm-row">
                  <Field label="Selling Price (R)" required>
                    <input required type="number" value={formData.price} onChange={e => set("price", e.target.value)} placeholder="00.00" />
                  </Field>
                  <Field label="Compare At Price (R)">
                    <input type="number" value={formData.oldPrice} onChange={e => set("oldPrice", e.target.value)} placeholder="00.00" />
                  </Field>
                </div>

                <div className="pm-sale-box">
                  <label className="pm-toggle-label">
                    <span className="pm-toggle-switch">
                      <input type="checkbox" checked={formData.isOnSale} onChange={e => set("isOnSale", e.target.checked)} style={{ display: "none" }} />
                      <span className={`pm-toggle-track ${formData.isOnSale ? "on" : ""}`}><span className="pm-toggle-knob" /></span>
                    </span>
                    <span className="pm-toggle-text">Mark item as On Sale</span>
                  </label>
                  {formData.isOnSale && (
                    <Field label="Sale Expiry Date">
                      <div className="pm-date-wrap">
                        <Calendar size={16} className="pm-date-icon" />
                        <input type="date" value={formData.saleEndsAt} min={new Date().toISOString().split("T")[0]} onChange={e => set("saleEndsAt", e.target.value)} className="pm-date-input" />
                      </div>
                    </Field>
                  )}
                </div>

                <div className="pm-section-label">Variant Customization</div>
                <div className="pm-tag-input-group">
                   <label><Palette size={13} /> Available Colors</label>
                   <div className="pm-typed-input-wrap">
                     <input
                       value={colorInput}
                       onChange={e => setColorInput(e.target.value)}
                       onKeyDown={e => handleTagKeydown(e, addColor, colorInput)}
                       placeholder="Type a color name and press Enter (e.g. Red, Gold, Space Gray)"
                       className="pm-typed-input"
                     />
                     <button type="button" className="pm-typed-add-btn" onClick={() => addColor(colorInput)} disabled={!colorInput.trim()}>Add</button>
                   </div>
                   {formData.colors.length > 0 && (
                     <div className="pm-tags-list">
                       {formData.colors.map(c => {
                          const ciEntry = colorImages.find(ci => ci.color === c);
                          const inputId = `color-img-${c.replace(/\s+/g, '-').toLowerCase()}`;
                          return (
                            <span key={c} className="pm-color-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 14px' }}>
                              <span className="pm-color-dot" style={{ background: getColorHex(c) || 'linear-gradient(135deg, #eee, #ccc)', flexShrink: 0 }} />
                              <span style={{ fontWeight: 600, fontSize: '13px' }}>{c}</span>
                              
                              <div 
                                onClick={() => document.getElementById(inputId)?.click()}
                                style={{
                                  width: '36px', height: '36px', borderRadius: '10px', 
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  border: ciEntry?.previewUrl ? '2px solid #3b82f6' : '1px dashed #cbd5e1',
                                  background: ciEntry?.previewUrl ? '#fff' : '#f8fafc',
                                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', 
                                  position: 'relative', overflow: 'hidden', flexShrink: 0,
                                  boxShadow: ciEntry?.previewUrl ? '0 4px 12px rgba(59,130,246,0.15)' : 'none'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                  e.currentTarget.style.borderColor = '#3b82f6';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.borderColor = ciEntry?.previewUrl ? '#3b82f6' : '#cbd5e1';
                                }}
                              >
                                {ciEntry?.previewUrl ? (
                                  <img src={ciEntry.previewUrl} alt={c} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }} />
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Plus size={12} style={{ color: '#3b82f6', marginBottom: '-2px' }} />
                                    <Palette size={10} style={{ color: '#3b82f6', opacity: 0.6 }} />
                                  </div>
                                )}
                                <input
                                  id={inputId}
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleColorImageChange(c, file);
                                      e.target.value = ''; // Reset to allow re-selection
                                    }
                                  }}
                                />
                              </div>
                              <button type="button" onClick={() => removeColor(c)} className="pm-tag-x"><X size={12} /></button>
                            </span>
                          );
                        })}
                     </div>
                   )}
                   {formData.colors.length > 0 && (
                     <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                       Click the camera icon on each color to assign a product image for that color variant.
                     </p>
                   )}
                </div>

                <div className="pm-tag-input-group">
                   <label><Ruler size={13} /> Available Sizes & Storage</label>
                   <div className="pm-typed-input-wrap">
                     <input
                       value={sizeInput}
                       onChange={e => setSizeInput(e.target.value)}
                       onKeyDown={e => handleTagKeydown(e, addSize, sizeInput)}
                       placeholder="Type a size and press Enter (e.g. 256GB, XL, 45mm)"
                       className="pm-typed-input"
                     />
                     <button type="button" className="pm-typed-add-btn" onClick={() => addSize(sizeInput)} disabled={!sizeInput.trim()}>Add</button>
                   </div>
                   {formData.sizes.length > 0 && (
                     <div className="pm-tags-list">
                       {formData.sizes.map(s => (
                         <span key={s} className="pm-size-tag">
                           {s}
                           <button type="button" onClick={() => removeSize(s)} className="pm-tag-x"><X size={12} /></button>
                         </span>
                       ))}
                     </div>
                   )}
                </div>

                {formData.sizes.length > 0 && (
                  <div className="pm-variant-pricing">
                    <div className="pm-section-label">Variant Pricing (Overrides)</div>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {formData.sizePrices.map((sp, idx) => (
                        <div key={idx} className="variant-price-row">
                          <span className="variant-size-label">{sp.size}</span>
                          <div className="variant-price-inputs">
                            <input 
                              type="number" 
                              placeholder="Price (R)" 
                              value={sp.price} 
                              onChange={e => updateSizePrice(sp.size, "price", e.target.value)} 
                            />
                            <input 
                              type="number" 
                              placeholder="Old Price (Optional)" 
                              value={sp.oldPrice} 
                              onChange={e => updateSizePrice(sp.size, "oldPrice", e.target.value)} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pm-section-label">Placement</div>
                <div className="pm-toggles-grid">
                  <label className="pm-toggle-label">
                    <span className="pm-toggle-switch">
                      <input type="checkbox" checked={formData.isPromo} onChange={e => set("isPromo", e.target.checked)} style={{ display: "none" }} />
                      <span className={`pm-toggle-track ${formData.isPromo ? "on" : ""}`}><span className="pm-toggle-knob" /></span>
                    </span>
                    <span className="pm-toggle-text">Promotional Section</span>
                  </label>
                  <label className="pm-toggle-label">
                    <span className="pm-toggle-switch">
                      <input type="checkbox" checked={formData.isTrending} onChange={e => set("isTrending", e.target.checked)} style={{ display: "none" }} />
                      <span className={`pm-toggle-track ${formData.isTrending ? "on" : ""}`}><span className="pm-toggle-knob" /></span>
                    </span>
                    <span className="pm-toggle-text">Trending Section</span>
                  </label>
                </div>

                <div className="pm-modal-footer">
                  <button type="button" className="pm-cancel-btn" onClick={closeModal}>Discard</button>
                  <button type="submit" className="pm-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm.open && (
        <div className="pm-backdrop" onClick={() => setDeleteConfirm({ open: false, id: null, imageId: null })}>
          <div className="pm-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-icon-wrap">
              <Trash2 size={32} color="#ef4444" />
            </div>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone. Are you sure you want to permanently delete this product from your inventory?</p>
            <div className="delete-actions">
              <button className="cancel-delete" onClick={() => setDeleteConfirm({ open: false, id: null, imageId: null })}>Cancel</button>
              <button className="confirm-delete" onClick={confirmDeleteAction}>Yes, delete it</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pm-page { display:flex; flex-direction:column; gap:24px; animation: fadeIn 0.3s ease; }
        .pm-header { display:flex; justify-content:space-between; align-items:center; }
        .pm-title { font-size:28px; font-weight:800; color:var(--text); letter-spacing:-1px; }
        .pm-sub { color:var(--text-muted); font-size:14px; }
        
        .pm-add-btn {
          display:flex; align-items:center; gap:8px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: white; border: none; padding: 12px 24px;
          border-radius: 14px; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 14px rgba(29, 78, 216, 0.3);
        }

        .pm-search-wrap { position:relative; }
        .pm-search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--text-muted); }
        .pm-search-input {
          width:100%; padding:14px 14px 14px 48px; box-sizing:border-box;
          background:var(--surface); border:1.5px solid var(--border);
          border-radius:14px; color:var(--text); outline:none; font-size:15px;
        }

        .prod-info-cell { display:flex; flex-direction:column; gap:4px; }
        .prod-name { font-weight:700; color:var(--text); font-size:14px; }
        .prod-meta { display:flex; align-items:center; gap:8px; }
        .prod-brand { font-size:12px; color:var(--text-muted); font-weight:500; }

        .cat-chip { background:var(--surface2); padding:4px 10px; border-radius:8px; font-size:12px; font-weight:600; color:var(--text); }
        .price-cell { display:flex; align-items:center; gap:8px; }
        .current-price { font-weight:700; color:var(--text); }
        .sale-tag { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 6px; border-radius:4px; font-size:10px; font-weight:800; }

        .stock-status { font-size:12px; font-weight:700; }
        .stock-status.ok { color: #10b981; }
        .stock-status.low { color: #f59e0b; }
        .stock-status.out { color: #ef4444; }

        .actions-wrapper { position:relative; }
        .menu-trigger { background:none; border:none; color:var(--text-muted); cursor:pointer; padding:6px; border-radius:8px; transition:all 0.2s; }
        .menu-trigger:hover { background:var(--surface2); color:var(--text); }

        .actions-menu {
          position:absolute; right:0; top:100%; width:180px;
          background:var(--surface); border:1px solid var(--border);
          border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.15);
          z-index:100; overflow:hidden; display:flex; flex-direction:column;
          padding:6px; margin-top:4px; animation: slideDown 0.2s ease;
        }

        .actions-menu button, .actions-menu a {
          display:flex; align-items:center; gap:10px; padding:10px 12px;
          color:var(--text); font-size:13px; font-weight:500; text-decoration:none;
          border:none; background:none; width:100%; text-align:left; cursor:pointer;
          border-radius:8px; transition:all 0.2s;
        }

        .actions-menu button:hover, .actions-menu a:hover { background:var(--surface2); }
        .del-action { color: #ef4444 !important; }
        .del-action:hover { background: rgba(239, 68, 68, 0.08) !important; }
        .menu-divider { border-top:1px solid var(--border); margin:4px 0; }
        .menu-overlay { position:fixed; inset:0; z-index:90; }

        /* Modal styling remains mostly same but refined */
        .pm-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .pm-modal { background:var(--surface); border-radius:24px; width:100%; max-width:750px; max-height:92vh; display:flex; flex-direction:column; box-shadow:0 30px 60px rgba(0,0,0,0.5); }
        .pm-modal-header { padding:24px 30px 0; display:flex; justify-content:space-between; align-items:flex-start; }
        .pm-modal-title { font-size:22px; font-weight:800; color:var(--text); }
        .pm-modal-body { overflow-y:auto; padding:20px 30px 30px; }
        
        .pm-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; margin-bottom: 24px; }
        .pm-gallery-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); background: var(--surface2); }
        .pm-gallery-item.new { border-color: #3b82f6; }
        .pm-gallery-remove { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; transition: 0.2s; }
        .pm-gallery-remove:hover { background: #ff4d4f; transform: scale(1.1); }
        .pm-gallery-add { border: 2px dashed var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; aspect-ratio: 1; cursor: pointer; color: var(--text-muted); transition: 0.2s; }
        .pm-gallery-add:hover { border-color: #3b82f6; color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
        .pm-close-btn { background:var(--surface2); border:none; padding:8px; border-radius:12px; color:var(--text-muted); cursor:pointer; }
        
        .pm-section-label { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:var(--accent); border-bottom:1px solid var(--border); padding-bottom:6px; margin-top:20px; margin-bottom:12px; }
        .pm-upload-zone { border:2px dashed var(--border); border-radius: 8px; padding:30px; display:flex; flex-direction:column; align-items:center; gap:10px; cursor:pointer; transition:all 0.2s; }
        .pm-upload-zone:hover { border-color:var(--accent); background:var(--accent-soft); }

        .pm-row { display:flex; gap:16px; margin-bottom:16px; }
        .pm-field { flex:1; display:flex; flex-direction:column; gap:8px; }
        .pm-field.full { width:100%; }
        .pm-field label { font-size:12px; font-weight:700; color:var(--text-muted); }
        .pm-field input, .pm-field select, .pm-field textarea { background:var(--surface2); border:1.5px solid var(--border); border-radius:12px; padding:12px; color:var(--text); outline:none; font-family:inherit; }
        .pm-field input:focus { border-color:var(--accent); }

        .pm-sale-box { background:var(--surface2); padding:18px; border-radius: 8px; border:1px solid var(--border); margin:12px 0; display:flex; flex-direction:column; gap:16px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05); }
        .pm-toggle-label { display:flex; align-items:center; gap:12px; font-size:14px; font-weight:600; cursor:pointer; color: var(--text); user-select: none; }
        .pm-toggle-text { flex: 1; }
        .pm-toggle-switch { display: flex; align-items: center; }
        .pm-toggle-track { width:46px; height:24px; background:var(--border); border-radius:12px; position:relative; transition:0.3s cubic-bezier(0.4, 0, 0.2, 1); flex-shrink: 0; }
        .pm-toggle-track.on { background:var(--accent); box-shadow: 0 0 12px var(--accent-soft); }
        .pm-toggle-knob { position:absolute; top:3px; left:3px; width:18px; height:18px; background:white; border-radius:50%; transition:0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .pm-toggle-track.on .pm-toggle-knob { transform:translateX(22px); }

        .pm-date-wrap { position: relative; width: 100%; display: flex; align-items: center; }
        .pm-date-icon { position: absolute; left: 14px; color: var(--text-muted); pointer-events: none; z-index: 5; }
        .pm-date-input { width: 100%; height: 46px; padding: 0 14px 0 44px !important; background: var(--surface) !important; border: 1.5px solid var(--border) !important; border-radius: 12px !important; color: var(--text); font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .pm-date-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-soft) !important; }

        .pm-toggles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: var(--surface2); padding: 18px; border-radius: 8px; border: 1px solid var(--border); }

        .pm-tag-input-group { margin-bottom: 16px; }
        .pm-tag-input-group > label { display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:var(--text-muted); margin-bottom:8px; }

        .pm-typed-input-wrap { display:flex; gap:8px; }
        .pm-typed-input {
          flex:1; background:var(--surface2); border:1.5px solid var(--border);
          border-radius:12px; padding:11px 14px; color:var(--text);
          outline:none; font-family:inherit; font-size:14px;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .pm-typed-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
        .pm-typed-input::placeholder { color:var(--text-muted); opacity:0.5; }
        .pm-typed-add-btn {
          background:var(--accent); color:white; border:none;
          padding:0 20px; border-radius:12px; font-weight:700; font-size:13px;
          cursor:pointer; transition:0.2s; white-space:nowrap;
        }
        .pm-typed-add-btn:hover { opacity:0.85; }
        .pm-typed-add-btn:disabled { opacity:0.3; cursor:not-allowed; }

        .pm-tags-list { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
        .pm-color-tag, .pm-size-tag {
          display:flex; align-items:center; gap:7px;
          background:var(--surface2); border:1.5px solid var(--border);
          padding:6px 10px 6px 10px; border-radius:20px;
          font-size:13px; font-weight:600; color:var(--text);
          animation: tagPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes tagPop { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        .pm-color-dot { width:14px; height:14px; border-radius:50%; border:1.5px solid rgba(0,0,0,0.12); flex-shrink:0; }
        .pm-tag-x {
          display:flex; align-items:center; justify-content:center;
          width:18px; height:18px; border-radius:50%;
          background:rgba(239,68,68,0.1); color:#ef4444;
          border:none; cursor:pointer; transition:0.2s; margin-left:2px;
        }
        .pm-tag-x:hover { background:rgba(239,68,68,0.25); transform:scale(1.15); }
        
        .pm-modal-footer { display:flex; justify-content:flex-end; gap:12px; margin-top:24px; padding-top:20px; border-top:1px solid var(--border); }
        .pm-cancel-btn { background:var(--surface2); border:none; padding:12px 24px; border-radius:12px; font-weight:700; cursor:pointer; color:var(--text-muted); }
        .pm-submit-btn { background:linear-gradient(135deg, #1d4ed8, #3b82f6); color:white; border:none; padding:12px 30px; border-radius:12px; font-weight:700; cursor:pointer; }

        .pm-variant-pricing { background:var(--surface2); padding:18px; border-radius: 8px; border:1px solid var(--border); margin-top: 12px; }
        .variant-price-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 8px 0; border-bottom: 1px solid var(--border); }
        .variant-price-row:last-child { border-bottom: none; }
        .variant-size-label { font-weight: 700; font-size: 13px; min-width: 60px; color: var(--text); }
        .variant-price-inputs { display: flex; gap: 8px; flex: 1; }
        .variant-price-inputs input { width: 100%; font-size: 13px; padding: 8px 12px !important; }

        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .pm-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border); }
        .pm-page-info { font-size: 13px; color: var(--text-muted); }
        .pm-pagination-controls { display: flex; align-items: center; gap: 8px; }
        .pm-page-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; }
        .pm-page-btn:hover:not(:disabled) { background: var(--border); }
        .pm-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pm-page-numbers { display: flex; align-items: center; gap: 4px; }
        .pm-page-num { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid transparent; background: transparent; color: var(--text); font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; }
        .pm-page-num:hover:not(.active) { background: var(--surface2); border-color: var(--border); }
        .pm-page-num.active { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3); }
        .pm-page-dots { color: var(--text-muted); margin: 0 4px; }

        .pm-delete-modal {
          background: var(--surface); border-radius: 24px; padding: 32px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          max-width: 360px; width: 100%; box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          animation: tagPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .delete-icon-wrap {
          width: 64px; height: 64px; border-radius: 50%; background: rgba(239,68,68,0.1);
          display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
        }
        .pm-delete-modal h3 { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 8px; margin-top: 0; }
        .pm-delete-modal p { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 30px; margin-top: 0; }
        .delete-actions { display: flex; gap: 12px; width: 100%; }
        .delete-actions button { flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.2s; border: none; }
        .cancel-delete { background: var(--surface2); color: var(--text); }
        .cancel-delete:hover { background: var(--border); }
        .confirm-delete { background: #ef4444; color: white; }
        .confirm-delete:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239,68,68,0.3); }
      `}</style>
    </div>
  );
}

function Field({ label, required, full, children }: any) {
  return (
    <div className={`pm-field ${full ? "full" : ""}`}>
      <label>{label} {required && <span style={{color:'#ef4444'}}>*</span>}</label>
      {children}
    </div>
  );
}
