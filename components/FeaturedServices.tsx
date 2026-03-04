import React from "react";
import Image from "next/image";

export default function FeaturedServices() {
  return (
    <section className="featured-services">
      <div className="service-card dark">
        <h4>iCare Plus</h4>
        <p>Expert protection for your Apple devices.</p>
        <a href="#" className="service-link">Learn more &gt;</a>
      </div>
      <div className="service-card light">
        <h4>Trade In</h4>
        <p>Get credit toward a new Apple device.</p>
        <a href="#" className="service-link">Find your trade-in value &gt;</a>
      </div>
    </section>
  );
}
