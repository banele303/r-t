import Image from "next/image";

export default function HeroPromoGrid() {
  return (
    <section className="products-grid" style={{ paddingTop: '0px' }}>
      <div className="product-card">
        <h3>iPad Pro</h3>
        <div className="product-links">
          <a href="#">Learn more &gt;</a>
          <a href="#">Buy &gt;</a>
        </div>
        <div className="product-image-container">
           <Image src="/promo_ipad.png" alt="iPad Pro" fill />
        </div>
      </div>
      <div className="product-card dark-card">
        <h3>AirPods Pro</h3>
        <div className="product-links">
          <a href="#">Learn more &gt;</a>
          <a href="#">Buy &gt;</a>
        </div>
        <div className="product-image-container">
           <Image src="/promo_airpods.png" alt="AirPods Pro" fill />
        </div>
      </div>
      <div className="product-card">
        <h3>Watch Ultra 2</h3>
        <div className="product-links">
          <a href="#">Learn more &gt;</a>
          <a href="#">Buy &gt;</a>
        </div>
        <div className="product-image-container">
           <Image src="/promo_watch_ultra.png" alt="Watch Ultra" fill />
        </div>
      </div>
      <div className="product-card dark-card">
        <h3>MacBook Air</h3>
        <div className="product-links">
          <a href="/mac">Learn more &gt;</a>
          <a href="/mac">Buy &gt;</a>
        </div>
        <div className="product-image-container">
           <Image src="/macbook_hero.png" alt="MacBook Air" fill />
        </div>
      </div>
    </section>
  );
}
