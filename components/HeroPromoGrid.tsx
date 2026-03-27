import Image from "next/image";
import Link from "next/link";

export default function HeroPromoGrid() {
  return (
    <section className="products-grid" style={{ paddingTop: '0px' }}>
      <div className="product-card">
        <h3>MacBook Pro</h3>
        <div className="product-links">
          <Link href="/products?category=Laptops">Shop Laptops &gt;</Link>
        </div>
        <div className="product-image-container">
           <Image src="/macbook_m3.png" alt="MacBook Pro" fill style={{ objectFit: 'contain' }} />
        </div>
      </div>
      <div className="product-card dark-card">
        <h3>Galaxy S24 Ultra</h3>
        <div className="product-links">
          <Link href="/products?category=Phones">Shop Phones &gt;</Link>
        </div>
        <div className="product-image-container">
           <Image src="/s24_ultra.png" alt="Galaxy S24" fill style={{ objectFit: 'contain' }} />
        </div>
      </div>
      <div className="product-card">
        <h3>iPhone 16 Pro Max</h3>
        <div className="product-links">
          <Link href="/products?category=Phones">Shop Phones &gt;</Link>
        </div>
        <div className="product-image-container">
           <Image src="/iphone_16.png" alt="iPhone 16" fill style={{ objectFit: 'contain' }} />
        </div>
      </div>
      <div className="product-card dark-card">
        <h3>Dell XPS 15</h3>
        <div className="product-links">
          <Link href="/products?category=Laptops">Shop Laptops &gt;</Link>
        </div>
        <div className="product-image-container">
           <Image src="/dell_xps.png" alt="Dell XPS" fill style={{ objectFit: 'contain' }} />
        </div>
      </div>
    </section>
  );
}
