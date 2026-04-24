"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

interface Review {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  rating: number;
  text: string;
  time: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Alex Johnson",
    initials: "AJ",
    avatarColor: "#4285F4",
    rating: 5,
    text: "Absolutely fantastic service. My MacBook arrived within 24 hours as promised. The trade-in process was smooth and the value offered was fair. Highly recommend iStore!",
    time: "2 days ago"
  },
  {
    id: 2,
    name: "Sarah Meyer",
    initials: "SM",
    avatarColor: "#DB4437",
    rating: 5,
    text: "The Apple Watch Series 10 is incredible! iStore staff was super helpful in setting it up for me. Fast shipping and the packaging was premium too.",
    time: "1 week ago"
  },
  {
    id: 3,
    name: "David Smith",
    initials: "DS",
    avatarColor: "#F4B400",
    rating: 5,
    text: "Best place to buy Apple products in SA. Friendly staff and competitive prices. Will definitely be coming back for my next iPhone.",
    time: "3 weeks ago"
  },
  {
    id: 4,
    name: "Lisa van Wyk",
    initials: "LV",
    avatarColor: "#0F9D58",
    rating: 5,
    text: "Great experience buying the Galaxy S24 Ultra. The free Galaxy Buds offer was what sealed the deal. Excellent customer support!",
    time: "1 month ago"
  },
  {
    id: 5,
    name: "James Khumalo",
    initials: "JK",
    avatarColor: "#673AB7",
    rating: 4,
    text: "Love my new iPad Air! Fast delivery and great condition. Only giving 4 stars because the courier was a bit late, but the store was excellent.",
    time: "1 month ago"
  },
  {
    id: 6,
    name: "Emma de Beer",
    initials: "EB",
    avatarColor: "#FF5722",
    rating: 5,
    text: "Incredible selection of premium products. I was looking for a specific Dell XPS model and they had it in stock when nobody else did. Premium service!",
    time: "2 months ago"
  }
];

export default function GoogleReviews() {
  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <div className="reviews-header">
          <div className="reviews-header-left">
            <div className="google-badge">
              <span className="google-g">G</span>
              <span className="google-label">Google Reviews</span>
            </div>
            <h2>What our customers say</h2>
          </div>
          <div className="reviews-header-right">
            <div className="overall-rating">
              <span className="rating-number">4.9</span>
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#F4B400" color="#F4B400" />
                ))}
              </div>
              <span className="total-reviews">Based on 1,245 reviews</span>
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <div 
                  className="reviewer-avatar" 
                  style={{ backgroundColor: review.avatarColor }}
                >
                  {review.initials}
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-name">
                    {review.name}
                    <CheckCircle2 size={12} className="verified-icon" />
                  </div>
                  <div className="review-time">{review.time}</div>
                </div>
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#F4B400" color="#F4B400" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i} size={14} color="#e0e0e0" />
                  ))}
                </div>
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-card-footer">
                <span className="verified-text">Verified Customer</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .reviews-section {
          padding: 80px 5%;
          background-color: #fafbfc;
          border-top: 1px solid #f0f0f5;
        }

        .reviews-container {
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 50px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .google-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          background: white;
          padding: 6px 14px;
          border-radius: 30px;
          width: fit-content;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border: 1px solid #eee;
        }

        .google-g {
          font-weight: 900;
          font-size: 18px;
          color: #4285F4;
          font-family: 'Inter', sans-serif;
        }

        .google-label {
          font-size: 12px;
          font-weight: 600;
          color: #5f6368;
          letter-spacing: 0.2px;
        }

        .reviews-header h2 {
          font-size: 42px;
          font-weight: 700;
          color: #1a1a1c;
          letter-spacing: -1px;
        }

        .overall-rating {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
        }

        .rating-number {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1c;
          margin-bottom: 4px;
        }

        .stars-row {
          display: flex;
          gap: 4px;
          margin-bottom: 8px;
        }

        .total-reviews {
          font-size: 13px;
          color: #5f6368;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 24px;
        }

        .review-card {
          background: white;
          padding: 30px;
          border-radius: 24px;
          border: 1px solid rgba(0, 0, 0, 0.03);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.02);
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          display: flex;
          flex-direction: column;
        }

        .review-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
          border-color: rgba(0, 86, 179, 0.1);
        }

        .review-card-header {
          display: grid;
          grid-template-columns: 48px 1fr auto;
          gap: 14px;
          align-items: center;
          margin-bottom: 20px;
        }

        .reviewer-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .reviewer-name {
          font-weight: 600;
          color: #1a1a1c;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .verified-icon {
          color: #4CAF50;
        }

        .review-time {
          font-size: 12px;
          color: #5f6368;
          margin-top: 2px;
        }

        .review-stars {
          display: flex;
          gap: 2px;
        }

        .review-text {
          font-size: 15px;
          line-height: 1.6;
          color: #4b5563;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .review-card-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          padding-top: 15px;
          border-top: 1px solid #f5f5f7;
        }

        .verified-text {
          font-size: 11px;
          font-weight: 600;
          color: #4CAF50;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 900px) {
          .reviews-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .reviews-header-right {
            align-items: center;
          }
          .overall-rating {
            align-items: center;
            text-align: center;
          }
          .reviews-header h2 {
            font-size: 32px;
          }
          .reviews-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
