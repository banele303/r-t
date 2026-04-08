import Image from "next/image";
import Link from "next/link";

export default function HeroPromoGrid() {
  return (
    <section className="products-grid" style={{ paddingTop: '0px' }}>
      <div className="product-card">
        <h3>iPad Pro</h3>
        <div className="product-links">
          <Link href="#">Learn more &gt;</Link>
          <Link href="#">Buy &gt;</Link>
        </div>
        <div className="product-image-container rounded-[2rem] overflow-hidden">
           <Image src="/promo_ipad.png" alt="iPad Pro" fill className="rounded-[2rem] object-contain p-4" />
        </div>
      </div>
      <div className="product-card dark-card">
        <h3>AirPods Pro</h3>
        <div className="product-links">
          <Link href="#">Learn more &gt;</Link>
          <Link href="#">Buy &gt;</Link>
        </div>
        <div className="product-image-container rounded-[2rem] overflow-hidden">
           <Image src="/promo_airpods.png" alt="AirPods Pro" fill className="rounded-[2rem] object-contain p-4" />
        </div>
      </div>
      <div className="product-card">
        <h3>Watch Ultra 2</h3>
        <div className="product-links">
          <Link href="#">Learn more &gt;</Link>
          <Link href="#">Buy &gt;</Link>
        </div>
        <div className="product-image-container rounded-[2rem] overflow-hidden">
           <Image src="/promo_watch_ultra.png" alt="Watch Ultra" fill className="rounded-[2rem] object-contain p-4" />
        </div>
      </div>
      <div className="product-card dark-card">
        <h3>MacBook Air</h3>
        <div className="product-links">
          <Link href="/mac">Learn more &gt;</Link>
          <Link href="/mac">Buy &gt;</Link>
        </div>
        <div className="product-image-container rounded-[2rem] overflow-hidden">
           <Image src="/macbook_hero.png" alt="MacBook Air" fill className="rounded-[2rem] object-contain p-4" />
        </div>
      </div>
    </section>
  );
}
