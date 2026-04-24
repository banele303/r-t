"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Laptop, Smartphone, Watch, Monitor, Tablet } from "lucide-react";

const slides = [
  {
    id: 0,
    backgroundText: "IPHONE 16",
    themeClass: "luxury-slide",
    title: "iPhone 16 Pro",
    icon: <Smartphone size={24} />,
    saveText: "Titanium. Powerhouse.",
    desc: "Experience the pinnacle of mobile technology with Apple Intelligence and pro-grade cameras.",
    image: "/new-slide.png",
    terms: "Exclusive Launch Offer"
  },
  {
    id: 1,
    backgroundText: "MACBOOK",
    themeClass: "macbook-slide",
    title: "MacBook Pro",
    icon: <Laptop size={24} />,
    saveText: "Mind-blowing. Head-turning.",
    desc: "Now with the M3 family of chips, the most advanced chips ever built for a personal computer.",
    image: "/new-slider2.png",
    terms: "Starting from R2,499pm"
  },
  {
    id: 2,
    backgroundText: "WATCH",
    themeClass: "watch-slide",
    title: "Apple Watch Series 10",
    icon: <Watch size={24} />,
    saveText: "Thinner. Faster. Smarter.",
    desc: "The thinnest Apple Watch ever. With the largest, most advanced display yet.",
    image: "/new-slider3.png",
    terms: "Available in Jet Black and Rose Gold"
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

            <div className="hero-image-container rounded-md overflow-hidden">
              <Image 
                src={slide.image} 
                alt={slide.title} 
                fill 
                priority 
                className="hero-main-img rounded-md"
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
