"use client";

import Image from "next/image";
import Link from "next/link";

export default function DualPromoGrid() {
  return (
    <section className="dual-promo-grid">
      <div className="promo-stack">
        
        {/* Card 1: iPhone & More */}
        <div className="premium-promo-card card-black-gradient">
          <div className="premium-promo-content">
            <div className="promo-header-group">
              <span className="promo-label">Limited Time Offer</span>
              <h2 className="premium-promo-title">
                Get iPhone and <br />
                <span className="accent-blue">so much more</span> at R & T Store
              </h2>
            </div>
            <div className="premium-promo-actions">
              <Link href="/products?category=Phones" className="promo-btn-primary">Shop Phones</Link>
              <Link href="#" className="promo-link-secondary">Learn about benefits &gt;</Link>
            </div>
          </div>
          <div className="premium-promo-image-side">
            <div className="image-container-full">
              <Image 
                src="/iphone_promo_list.png" 
                alt="iPhones" 
                fill
                style={{ objectFit: 'contain', borderRadius: '32px' }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Card 2: Trade-in */}
        <div className="premium-promo-card card-white-glare">
          <div className="premium-promo-content">
            <div className="promo-header-group">
              <span className="promo-label blue">Upgrade Program</span>
              <h2 className="premium-promo-title dark">
                Get up to <span className="highlight-text">R25 000</span> cash back
              </h2>
            </div>
            <div className="premium-promo-actions">
              <Link href="#" className="promo-btn-blue">Value my Trade-in</Link>
              <Link href="#" className="promo-link-secondary dark">How it works &gt;</Link>
            </div>
          </div>
          <div className="premium-promo-image-side">
            <div className="image-container-full">
              <Image 
                src="/trade_in_banner.png" 
                alt="Trade in" 
                fill
                style={{ objectFit: 'cover', borderRadius: '32px' }}
              />
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .dual-promo-grid {
          padding: 40px 5%;
        }

        .promo-stack {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .premium-promo-card {
          position: relative;
          display: flex;
          min-height: 480px;
          border-radius: 40px;
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .premium-promo-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        }

        .card-black-gradient {
          background: linear-gradient(135deg, #111 0%, #000 100%);
          color: white;
        }

        .card-white-glare {
          background: #fbfbfd;
          border: 1px solid rgba(0,0,0,0.03);
        }

        .premium-promo-content {
          flex: 1.2;
          padding: 60px 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
        }

        .promo-header-group {
          margin-bottom: 40px;
        }

        .promo-label {
          display: inline-block;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 20px;
          color: #888;
        }

        .promo-label.blue {
          color: #0066cc;
        }

        .premium-promo-title {
          font-size: 52px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 24px;
        }

        .premium-promo-title.dark {
          color: #1d1d1f;
        }

        .accent-blue {
          color: #2997ff;
          display: block;
          margin-top: 4px;
        }

        .highlight-text {
          color: #0066cc;
        }

        .premium-promo-description {
          font-size: 20px;
          color: #a1a1a6;
          max-width: 440px;
          line-height: 1.5;
        }

        .premium-promo-description.dark {
          color: #6e6e73;
        }

        .premium-promo-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .promo-btn-primary {
          background: #fff;
          color: #000;
          padding: 14px 32px;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .promo-btn-primary:hover {
          background: #f0f0f0;
          transform: scale(1.05);
        }

        .promo-btn-blue {
          background: #0066cc;
          color: #fff;
          padding: 14px 32px;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .promo-btn-blue:hover {
          background: #0077ed;
          transform: scale(1.05);
        }

        .promo-link-secondary {
          color: #2997ff;
          text-decoration: none;
          font-weight: 500;
          font-size: 18px;
        }

        .promo-link-secondary:hover {
          text-decoration: underline;
        }

        .promo-link-secondary.dark {
          color: #0066cc;
        }

        .premium-promo-image-side {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .image-container-full {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 32px;
          overflow: hidden;
        }

        .premium-promo-card:hover .image-container-full {
          transform: scale(1.08);
        }

        @media (max-width: 1024px) {
          .premium-promo-content {
            padding: 40px 40px;
          }
          .premium-promo-title {
            font-size: 42px;
          }
        }

        @media (max-width: 768px) {
          .premium-promo-card {
            flex-direction: column;
            min-height: auto;
            text-align: center;
          }
          .premium-promo-content {
            align-items: center;
            padding: 50px 30px 20px;
          }
          .premium-promo-image-side {
            height: 300px;
            padding: 20px 40px 40px;
          }
          .premium-promo-description {
            margin: 0 auto 20px;
          }
          .premium-promo-actions {
            flex-direction: column;
            gap: 16px;
          }
          .premium-promo-title {
            font-size: 36px;
          }
        }
      `}</style>
    </section>
  );
}
