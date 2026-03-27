"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Laptop, Smartphone, Watch, Monitor, Tablet } from "lucide-react";

const slides = [
  {
    id: 0,
    backgroundText: "IPHONE",
    themeClass: "iphone-slide",
    title: "iPhone 16 Pro Max",
    icon: <Smartphone size={24} />,
    saveText: "Titanium Powerhouse",
    desc: "Smarter performance. Pro-grade cameras. Built for Apple Intelligence.",
    image: "/iphone_16.png",
    terms: "Starting from R1,299pm"
  },
  {
    id: 1,
    backgroundText: "MACBOOKS",
    themeClass: "macbook-slide",
    title: "MacBook Pro M3",
    icon: <Laptop size={24} />,
    saveText: "Pro Powerhouse",
    desc: "The most advanced Mac laptop for demanding workflows. Thin. Light. Multi-talented.",
    image: "/macbook_m3.png",
    terms: "Supercharged by M3 Pro"
  },
  {
    id: 2,
    backgroundText: "GALAXY",
    themeClass: "samsung-slide",
    title: "Galaxy S24 Ultra",
    icon: <Smartphone size={24} />,
    saveText: "AI Powered Performance",
    desc: "Zoom into the night with Nightography. Circle it. Find it. All with AI.",
    image: "/s24_ultra.png",
    terms: "Free Galaxy Buds with every purchase"
  },
  {
    id: 3,
    backgroundText: "DELL XPS",
    themeClass: "dell-slide",
    title: "Dell XPS 15",
    icon: <Laptop size={24} />,
    saveText: "Masterpiece Redesigned",
    desc: "Beauty meets speed. The ultimate window into your world.",
    image: "/dell_xps.png",
    terms: "Next day on-site support included"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slider-container">
      <div 
        className="slider-track" 
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <section key={slide.id} className={`hero-section ${slide.themeClass}`}>
            <div className="hero-background-text">{slide.backgroundText}</div>
            
            <div className="hero-content">
              <div className="hero-title">
                <span className="hero-icon-box">{slide.icon}</span>
                {slide.title}
              </div>
              <div className="hero-save">{slide.saveText}</div>
              <div className="hero-desc">{slide.desc}</div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button className="btn-primary">Shop Now</button>
                <button className="btn-secondary" style={{ 
                  background: 'transparent', 
                  border: '2px solid rgba(0, 86, 179, 0.4)',
                  padding: '12px 28px',
                  borderRadius: '20px',
                  fontWeight: '600',
                  color: 'var(--blue)',
                  cursor: 'pointer'
                }}>Learn More</button>
              </div>

              <div className="hero-terms">{slide.terms}</div>
            </div>

            <div className="hero-image-container">
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                priority 
                className="hero-main-img"
              />
            </div>
          </section>
        ))}
      </div>
      
      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button 
            key={idx} 
            className={`dot ${current === idx ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .hero-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          margin-right: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          color: #0056b3;
        }

        .btn-secondary:hover {
          background: rgba(0, 86, 179, 0.05) !important;
          border-color: var(--blue) !important;
        }
      `}</style>
    </div>
  );
}
