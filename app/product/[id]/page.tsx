"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/components/CartContext";
import { toast } from 'sonner';
import "../product.css";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as any;
  const product = useQuery(api.products.getById, { id: productId });
  const relatedProducts = useQuery(api.products.getRelated, product ? { category: product.category, currentProductId: product._id } : "skip" as any);
  const reviews = useQuery(api.reviews.getByProduct, { productId });
  const currentUser = useQuery(api.users.current);
  const addReview = useMutation(api.reviews.add);
  const { addToCart } = useCart();

  const [newReview, setNewReview] = React.useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [timeLeft, setTimeLeft] = React.useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  React.useEffect(() => {
    if (product && !selectedImage && product.imageUrl) {
      setSelectedImage(product.imageUrl);
    }
    if (product && product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
    if (product && product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product, selectedColor, selectedSize]);

  React.useEffect(() => {
    if (!product || !product.isOnSale || !product.saleEndsAt) return;
    
    const calculateTimeLeft = () => {
      const difference = new Date(product.saleEndsAt!).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null);
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [product]);

  const currentPrice = React.useMemo(() => {
    if (product && product.sizePrices && selectedSize) {
      const variant = (product as any).sizePrices.find((sp: any) => sp.size === selectedSize);
      if (variant) return variant.price;
    }
    return product?.price || 0;
  }, [product, selectedSize]);

  const currentOldPrice = React.useMemo(() => {
    if (product && product.sizePrices && selectedSize) {
      const variant = (product as any).sizePrices.find((sp: any) => sp.size === selectedSize);
      if (variant) return variant.oldPrice || (product as any).oldPrice;
    }
    return product?.oldPrice;
  }, [product, selectedSize]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newReview.comment) return;

    setIsSubmitting(true);
    try {
      await addReview({
        productId,
        userName: currentUser.name || currentUser.email || "Verified Buyer",
        rating: newReview.rating,
        comment: newReview.comment,
        date: "Just now"
      });
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      toast.success("Thank you! Your review has been posted.");
    } catch (error) {
      console.error("Failed to add review:", error);
      toast.error("Failed to post review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (product === undefined) {
    return (
      <div className="product-page-container">
        {/* Skeleton Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {[60, 20, 120].map((w, i) => (
            <div key={i} className="skeleton-shimmer" style={{ height: '14px', width: `${w}px`, borderRadius: '6px' }} />
          ))}
        </div>

        {/* Skeleton Main Grid */}
        <div className="product-main-grid">
          {/* Left – image panel */}
          <div className="skeleton-shimmer" style={{ borderRadius: '40px', height: '480px', width: '100%' }} />

          {/* Right – info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* brand */}
            <div className="skeleton-shimmer" style={{ height: '12px', width: '80px', borderRadius: '6px' }} />
            {/* title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="skeleton-shimmer" style={{ height: '48px', width: '90%', borderRadius: '10px' }} />
              <div className="skeleton-shimmer" style={{ height: '48px', width: '70%', borderRadius: '10px' }} />
            </div>
            {/* price */}
            <div className="skeleton-shimmer" style={{ height: '36px', width: '140px', borderRadius: '8px' }} />
            {/* description lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[100, 90, 75].map((w, i) => (
                <div key={i} className="skeleton-shimmer" style={{ height: '16px', width: `${w}%`, borderRadius: '6px' }} />
              ))}
            </div>
            {/* colour swatches */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              ))}
            </div>
            {/* action buttons */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
              <div className="skeleton-shimmer" style={{ flex: 1, height: '56px', borderRadius: '18px' }} />
              <div className="skeleton-shimmer" style={{ flex: 1, height: '56px', borderRadius: '18px' }} />
            </div>
            {/* feature rows */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div className="skeleton-shimmer" style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div className="skeleton-shimmer" style={{ height: '14px', width: '50%', borderRadius: '6px' }} />
                    <div className="skeleton-shimmer" style={{ height: '12px', width: '75%', borderRadius: '6px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .skeleton-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
          }
          @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="product-page-container">
        <div style={{ textAlign: "center", padding: "100px" }}>
          <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>Product Not Found</h2>
          <Link href="/" className="btn-primary">Back to Shopping</Link>
        </div>
      </div>
    );
  }

  // Placeholder reviews for aesthetic purposes if none exist
  const displayReviews = reviews && reviews.length > 0 ? reviews : [
    { _id: "r1", userName: "John Doe", rating: 5, comment: "Absolutely stunning quality. The performance is beyond what I expected!", date: "2 days ago" },
    { _id: "r2", userName: "Sarah Jenkins", rating: 4, comment: "Beautiful design, though the delivery took a bit longer than expected. Highly recommend!", date: "1 week ago" }
  ];

  return (
    <div className="product-page-container">
      <div className="product-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span style={{ color: "var(--black)", fontWeight: 500 }}>{product.name}</span>
      </div>

      <div className="product-main-grid">
        {/* Left Side: Product Image */}
        <div className="product-image-section">
          {product.tag && <div className="product-badge">{product.tag}</div>}
          <div className="product-image-wrapper">
            <Image
              src={selectedImage || product.imageUrl || "/placeholder.png"}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
              className="product-main-image"
              priority
            />
          </div>
          
          {/* Gallery Thumbnails */}
          {product.additionalImageUrls && product.additionalImageUrls.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Main Image Thumbnail */}
              <div 
                onClick={() => setSelectedImage(product.imageUrl)}
                style={{
                  width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer',
                  border: selectedImage === product.imageUrl ? '2px solid var(--blue)' : '2px solid transparent',
                  background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                }}
              >
                <Image src={product.imageUrl} alt="Thumbnail main" fill style={{ objectFit: 'contain', padding: '4px' }} />
              </div>

              {/* Additional Thumbnails */}
              {product.additionalImageUrls.map((url: string, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImage(url)}
                  style={{
                    width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer',
                    border: selectedImage === url ? '2px solid var(--blue)' : '2px solid transparent',
                    background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s'
                  }}
                >
                  <Image src={url} alt={`Thumbnail ${idx + 1}`} fill style={{ objectFit: 'contain', padding: '4px' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="product-info-section">
          <span className="product-brand">{product.brand}</span>
          <h1 className="product-name">{product.name}</h1>

          {/* Star Rating + Review Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map((star) => {
                const avgRating = reviews && reviews.length > 0
                  ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
                  : 4.5;
                return (
                  <svg key={star} viewBox="0 0 24 24" fill={star <= Math.round(avgRating) ? '#ff9500' : 'none'} stroke="#ff9500" strokeWidth="1.5" width="18" height="18">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                );
              })}
            </div>
            <span style={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>
              {reviews && reviews.length > 0
                ? `${(reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)} · ${reviews.length} review${reviews.length !== 1 ? 's' : ''}`
                : '4.5 · 2 reviews'}
            </span>
          </div>

          {/* Stock Badge */}
          {(() => {
            const stock = product.stock;
            if (stock === undefined || stock === null) {
              // No stock info recorded yet – show generic badge
              return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0faf0', border: '1px solid #b7ebc0', borderRadius: '10px', padding: '6px 14px', marginBottom: '20px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52c41a', boxShadow: '0 0 0 3px rgba(82,196,26,0.2)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#389e0d' }}>In Stock — Ready to Ship</span>
                </div>
              );
            }
            if (stock === 0) {
              return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff1f0', border: '1px solid #ffccc7', borderRadius: '10px', padding: '6px 14px', marginBottom: '20px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff4d4f', boxShadow: '0 0 0 3px rgba(255,77,79,0.2)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#cf1322' }}>Out of Stock</span>
                </div>
              );
            }
            if (stock <= 5) {
              return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '10px', padding: '6px 14px', marginBottom: '20px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#faad14', boxShadow: '0 0 0 3px rgba(250,173,20,0.2)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ad6800' }}>Only {stock} left in stock — Order soon!</span>
                </div>
              );
            }
            return (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0faf0', border: '1px solid #b7ebc0', borderRadius: '10px', padding: '6px 14px', marginBottom: '20px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#52c41a', boxShadow: '0 0 0 3px rgba(82,196,26,0.2)' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#389e0d' }}>In Stock — {stock} units available</span>
              </div>
            );
          })()}

          <div className="product-price-container">
            <span className="product-current-price">R {currentPrice.toLocaleString()}</span>
            {currentOldPrice && (
              <span className="product-old-price">R {currentOldPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="product-description">
            <p>{product.description || "Designed with powerful technology and premium materials, this product delivers an exceptional experience that pushes boundaries."}</p>
          </div>

          {/* COMPACT Countdown Timer */}
          {product.isOnSale && product.saleEndsAt && timeLeft && (
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '12px', 
              background: '#fff1f0', 
              border: '1px solid #ffccc7', 
              borderRadius: '12px', 
              padding: '8px 16px', 
              marginBottom: '20px',
              width: 'fit-content'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#cf1322', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Ends In:
              </span>
              <div style={{ display: 'flex', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#cf1322' }}>
                <span>{timeLeft.days}d</span>
                <span>{timeLeft.hours}h</span>
                <span>{timeLeft.minutes}m</span>
                <span style={{ opacity: 0.6, fontVariantNumeric: 'tabular-nums' }}>{timeLeft.seconds}s</span>
              </div>
            </div>
          )}

          <div className="product-options">
            {product.colors && product.colors.length > 0 && (
              <div className="option-group" style={{ marginBottom: '24px' }}>
                <span className="option-label" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '12px' }}>
                  Select Color: <span style={{ fontWeight: 400, color: '#666' }}>{selectedColor}</span>
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {product.colors.map((color: string, idx: number) => {
                    const isActive = selectedColor === color;
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        style={{ 
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: color, // Direct background color
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: isActive ? '3px solid var(--blue)' : '1px solid rgba(0,0,0,0.1)',
                          boxShadow: isActive ? '0 0 0 2px white, 0 4px 12px rgba(0,0,0,0.1)' : 'none',
                          transform: isActive ? 'scale(1.1)' : 'scale(1)'
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="option-group">
                <span className="option-label" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#111', marginBottom: '12px' }}>
                  {product.category.toLowerCase().includes('iphone') || product.category.toLowerCase().includes('phone') ? 'Select Storage' : 'Select Size'}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {product.sizes.map((size: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: selectedSize === size ? '2px solid var(--blue)' : '1px solid #eee',
                        background: selectedSize === size ? 'var(--light-grey)' : 'white',
                        color: selectedSize === size ? 'var(--blue)' : '#444',
                        fontWeight: 600,
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div style={{ marginBottom: '24px' }}>
            <span className="option-label">Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', background: '#f7f7f8', borderRadius: '14px', border: '1px solid #e8e8e8', overflow: 'hidden', width: 'fit-content', marginTop: '10px' }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: '10px 18px', fontSize: '20px', fontWeight: 300, cursor: 'pointer', background: 'none', border: 'none', color: quantity === 1 ? '#ccc' : 'var(--black)', transition: '0.2s', lineHeight: 1 }}
                disabled={quantity === 1}
              >−</button>
              <span style={{ padding: '10px 18px', fontSize: '16px', fontWeight: 700, color: 'var(--black)', borderLeft: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', minWidth: '56px', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                style={{ padding: '10px 18px', fontSize: '20px', fontWeight: 300, cursor: 'pointer', background: 'none', border: 'none', color: quantity === 10 ? '#ccc' : 'var(--black)', transition: '0.2s', lineHeight: 1 }}
                disabled={quantity === 10}
              >+</button>
            </div>
          </div>

          <div className="product-actions">
            <button className="btn-add-cart" onClick={() => {
              for (let i = 0; i < quantity; i++) {
                addToCart({ ...product, price: currentPrice }, selectedColor || undefined, selectedSize || undefined);
              }
              toast.success(`${quantity}× ${product.name} added to cart!`);
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              Add {quantity > 1 ? `${quantity} ` : ''}to Cart
            </button>
            <button className="btn-buy-now">Buy Now</button>
          </div>

          <div className="product-extra-info">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="feature-text">
                <p><strong>Free Delivery</strong></p>
                <p style={{ color: "#888" }}>Receive your order in 3-5 business days</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="feature-text">
                <p><strong>2-Year Warranty</strong></p>
                <p style={{ color: "#888" }}>Full coverage for standard usage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section Header */}
      <div className="product-section-header">
        <h2 className="product-section-title">Customer Reviews</h2>
        {currentUser ? (
          <button 
            className="btn-open-review" 
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </button>
        ) : (
          <Link href="/login" className="btn-open-review" style={{ textDecoration: 'none' }}>
            Sign in to Review
          </Link>
        )}
      </div>

      {/* Write a Review Section (Toggleable) */}
      {showReviewForm && currentUser && (
        <div className="add-review-section">
          <form className="review-form" onSubmit={handleSubmitReview}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', color: '#888' }}>Reviewing as </span>
              <strong style={{ fontSize: '14px', color: 'var(--black)' }}>{currentUser.name || currentUser.email}</strong>
            </div>
            <div className="rating-select">
              <span className="option-label" style={{ marginBottom: 0 }}>Your Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${newReview.rating >= star ? 'active' : ''}`}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience with this product..."
              className="review-textarea"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
            ></textarea>
            <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Post Review"}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-container">
        {displayReviews.map((review: any) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <div className="review-user-info">
                <div className="user-avatar">{review.userName.charAt(0)}</div>
                <div>
                  <div className="user-name">{review.userName}</div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" width="14" height="14">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <span className="review-date">{review.date}</span>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Related Products Section */}
      <h2 className="product-section-title">Related Products</h2>
      <div className="related-modern-grid" style={{ minHeight: '100px' }}>
        {relatedProducts && relatedProducts.length > 0 ? (
          relatedProducts.map((p: any) => (
            <Link key={p._id} href={`/product/${p._id}`} className="related-card">
              <div className="related-card-image">
                <Image src={p.imageUrl} alt={p.name} fill style={{ objectFit: 'contain' }} />
              </div>
              <div className="related-card-info">
                <span className="related-card-brand">{p.brand}</span>
                <h4 className="related-card-name">{p.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '15px' }}>
                    <p className="related-card-price" style={{ margin: 0 }}>R {p.price.toLocaleString()}</p>
                    <button 
                      className="related-cart-btn" 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(p);
                        toast.success(`${p.name} added to cart!`);
                      }}
                      style={{
                        backgroundColor: 'var(--blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
                      </svg>
                    </button>
                </div>
                <button 
                  className="related-shop-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(p);
                    toast.success(`${p.name} added to cart!`);
                  }}
                  style={{
                    backgroundColor: '#f5f5f7',
                    color: 'var(--blue)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                >
                  Shop Offer
                </button>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
            Fetching more premium products for you...
          </p>
        )}
      </div>
    </div>
  );
}
