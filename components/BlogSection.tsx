"use client";

import Image from "next/image";

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
      <div className="blog-container">
        <div className="blog-header">
          <span className="blog-tag">From Our Blog</span>
          <h2 className="blog-title">Tech Insights & Guides</h2>
          <p className="blog-subtitle">Stay ahead with the latest tech news, reviews, and buying guides.</p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-image" style={{ background: post.gradient }}>
                <Image src={post.image} alt={post.title} fill style={{ objectFit: 'contain', padding: '8px' }} />
                <span className="blog-category-badge">{post.category}</span>
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{post.date}</span>
                  <span className="blog-dot">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-read-more">
                  Read Article
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-section {
          padding: 80px 5% 60px;
          background: #fff;
        }

        .blog-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .blog-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .blog-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--blue);
          background: rgba(0, 86, 179, 0.06);
          padding: 6px 18px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .blog-title {
          font-family: var(--font-playfair), serif;
          font-size: 44px;
          font-weight: 500;
          color: #111;
          letter-spacing: -1px;
          margin-bottom: 12px;
          font-style: italic;
        }

        .blog-subtitle {
          font-size: 17px;
          color: #999;
          font-weight: 400;
          max-width: 500px;
          margin: 0 auto;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .blog-card {
          background: #fff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1);
          border-color: rgba(0, 86, 179, 0.12);
        }

        .blog-card:hover .blog-read-more {
          color: var(--blue);
          gap: 10px;
        }

        .blog-card:hover .blog-card-image img {
          transform: scale(1.05);
        }

        .blog-card-image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .blog-card-image img {
          transition: transform 0.5s ease;
        }

        .blog-category-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          padding: 6px 14px;
          border-radius: 20px;
          z-index: 2;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .blog-card-body {
          padding: 24px 24px 28px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #bbb;
          font-weight: 500;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .blog-dot {
          font-size: 6px;
        }

        .blog-card-title {
          font-size: 19px;
          font-weight: 700;
          color: #111;
          line-height: 1.4;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .blog-card-excerpt {
          font-size: 14px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 20px;
          flex: 1;
        }

        .blog-read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 700;
          color: #555;
          transition: all 0.3s ease;
        }

        @media (max-width: 1024px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }

          .blog-section {
            padding: 50px 5% 40px;
          }

          .blog-title {
            font-size: 32px;
          }

          .blog-card-image {
            height: 190px;
          }
        }
      `}</style>
    </section>
  );
}
