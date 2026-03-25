"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    id: 0,
    image: "/new-slider.png",
  },
  {
    id: 1,
    image: "/new-slider2.png",
  },
  {
    id: 2,
    image: "/new-slider3.png",
  },
  {
    id: 3,
    image: "/new-slide4.png",
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
        {slides.map((slide, idx) => (
          <section key={slide.id} className={`hero-section ${current === idx ? "active" : ""}`}>
            <div className="hero-image-wrapper">
              <Image 
                src={slide.image} 
                alt="Slider Image" 
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
        .slider-container {
          position: relative;
          width: 100%;
          height: 60vh;
          min-height: 400px;
          overflow: hidden;
          padding: 10px 1.5%; /* Left/Right padding as requested */
          background-color: var(--white);
        }

        .slider-track {
          display: flex;
          height: 100%;
          width: 100%;
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .hero-section {
          flex: 0 0 100%;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 4px; /* Tiny gap between slides overflow */
        }

        .hero-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 28px; /* Rounded corners as requested */
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
          transform: scale(0.99); /* Extra premium "inset" feel */
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .hero-section.active .hero-image-wrapper {
          transform: scale(1);
        }

        .hero-main-img {
          object-fit: cover; /* Fill the rounded container */
        }

        .slider-dots {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          padding: 8px 14px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dot.active {
          background-color: var(--black);
          transform: scale(1.4);
          width: 24px;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .slider-container {
            height: 45vh;
            padding: 10px 3%;
          }
          .hero-image-wrapper {
            border-radius: 20px;
          }
        }
      `}</style>
    </div>
  );
}
