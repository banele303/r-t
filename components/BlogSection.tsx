"use client";

import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    category: "Tech Tips",
    title: "iPhone 16 Pro vs Samsung Galaxy S25 Ultra: Which Flagship Wins?",
    excerpt: "We compare cameras, performance, battery life and more to help you pick the perfect flagship phone for 2026.",
    date: "March 20, 2026",
    readTime: "5 min read",
    image: "/iphone-hero-new.png",
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e)",
  },
  {
    id: 2,
    category: "Buying Guide",
    title: "How to Choose the Perfect MacBook for Your Needs",
    excerpt: "From Air to Pro, M3 to M4 — here's everything you need to know before buying your next Mac.",
    date: "March 18, 2026",
    readTime: "4 min read",
    image: "/Hero-image.png",
    gradient: "linear-gradient(135deg, #0f0c29, #302b63)",
  },
  {
    id: 3,
    category: "News",
    title: "PlayStation 5 Pro: Everything We Know So Far",
    excerpt: "Sony's next powerhouse console is on the horizon. Here's what to expect and when you can pre-order.",
    date: "March 15, 2026",
    readTime: "3 min read",
    image: "/cat_tv.png",
    gradient: "linear-gradient(135deg, #0c0c1d, #1a1a3e)",
  },
];

export default function BlogSection() {
  return (
    <section className="blog-section">
      <div className="blog-header">
        <div>
          <span className="blog-tag">From Our Blog</span>
          <h2 className="blog-title">Tech Insights & Guides</h2>
          <p className="blog-subtitle">Stay ahead with the latest tech news, reviews, and buying guides.</p>
        </div>
      </div>

      <div className="blog-grid">
        {/* Featured Post (Large) */}
        <div className="blog-card blog-card-featured">
          <div className="blog-card-image" style={{ background: blogPosts[0].gradient }}>
            <Image src={blogPosts[0].image} alt={blogPosts[0].title} fill style={{ objectFit: 'contain', padding: '30px' }} />
            <span className="blog-category-badge">{blogPosts[0].category}</span>
          </div>
          <div className="blog-card-content">
            <h3>{blogPosts[0].title}</h3>
            <p>{blogPosts[0].excerpt}</p>
            <div className="blog-card-meta">
              <span>{blogPosts[0].date}</span>
              <span className="blog-dot">·</span>
              <span>{blogPosts[0].readTime}</span>
            </div>
          </div>
        </div>

        {/* Smaller Posts */}
        <div className="blog-side-posts">
          {blogPosts.slice(1).map((post) => (
            <div key={post.id} className="blog-card blog-card-small">
              <div className="blog-card-image-small" style={{ background: post.gradient }}>
                <Image src={post.image} alt={post.title} fill style={{ objectFit: 'contain', padding: '15px' }} />
                <span className="blog-category-badge">{post.category}</span>
              </div>
              <div className="blog-card-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span>{post.date}</span>
                  <span className="blog-dot">·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-section {
          padding: 80px 5% 60px;
          background: #fafafa;
        }

        .blog-header {
          margin-bottom: 48px;
        }

        .blog-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--blue);
          background: rgba(0, 86, 179, 0.08);
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .blog-title {
          font-family: var(--font-playfair), serif;
          font-size: 48px;
          font-weight: 500;
          color: #111;
          letter-spacing: -1px;
          margin-bottom: 12px;
          font-style: italic;
        }

        .blog-subtitle {
          font-size: 18px;
          color: #888;
          font-weight: 400;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        .blog-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 86, 179, 0.1);
        }

        .blog-card-featured {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .blog-card-image {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .blog-card-image-small {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .blog-category-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          padding: 6px 14px;
          border-radius: 20px;
          z-index: 2;
        }

        .blog-card-content {
          padding: 28px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blog-card-content h3 {
          font-size: 20px;
          font-weight: 700;
          color: #111;
          line-height: 1.35;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .blog-card-featured .blog-card-content h3 {
          font-size: 24px;
        }

        .blog-card-content p {
          font-size: 14px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 16px;
          flex: 1;
        }

        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #aaa;
          font-weight: 500;
        }

        .blog-dot {
          font-size: 8px;
        }

        .blog-side-posts {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .blog-card-small {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 900px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }

          .blog-title {
            font-size: 36px;
          }

          .blog-card-image {
            height: 220px;
          }
        }

        @media (max-width: 600px) {
          .blog-section {
            padding: 50px 5% 40px;
          }

          .blog-title {
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}
