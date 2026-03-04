"use client";

import React from "react";

const deliveryOptions = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="2.5" />
        <circle cx="18.5" cy="17.5" r="2.5" />
        <path d="M15 6h5v4l-3 4H5v-4z" />
        <path d="M12 6V4H7" />
        <path d="M7 10h4" />
      </svg>
    ),
    title: "Free RightNow Delivery",
    desc: "Delivered within 1 hour.",
    subtext: "*Available in selected regions.",
    gradient: "linear-gradient(135deg, #f3e5fa, #d198f1, #c87cf0)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
    title: "Free Pick Up in under 1hr",
    desc: "Collect from any of our stores located nationwide.",
    gradient: "linear-gradient(135deg, #fdf4f6, #fca9b9, #f78c9d)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
        <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
        <circle cx="7" cy="18" r="2" />
        <path d="M15 18H9" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
    title: "Free Same Day Delivery",
    desc: "Now available in more regions.",
    gradient: "linear-gradient(135deg, #fef7ec, #fbce9d, #f6b67e)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M12 9v1l.5.5" />
      </svg>
    ),
    title: "Free next day delivery",
    desc: "Delivered before the end of tomorrow in all major regions.",
    gradient: "linear-gradient(135deg, #fefeed, #f9ea8d, #f8df65)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Free scheduled delivery",
    desc: "Scheduled at a time that works for you.",
    gradient: "linear-gradient(135deg, #f2f7fc, #aaceda, #81bad4)",
  },
];

export default function DeliveryOptions() {
  // Duplicate so the track loops seamlessly
  const doubled = [...deliveryOptions, ...deliveryOptions];

  return (
    <section className="delivery-section">
      <div className="delivery-header">
        <h2>Free delivery no matter where you are</h2>
      </div>

      {/* Marquee: clips overflow, then the track animates */}
      <div className="delivery-marquee-wrapper">
        <div className="delivery-marquee-track">
          {doubled.map((option, idx) => (
            <div
              key={idx}
              className="delivery-card"
              style={{ background: option.gradient }}
            >
              <div className="delivery-icon">{option.icon}</div>
              <h3>{option.title}</h3>
              <p>{option.desc}</p>
              {option.subtext && (
                <span className="delivery-subtext">{option.subtext}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
