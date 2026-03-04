import CategoryNav from "@/components/CategoryNav";
import FooterMenu from "@/components/FooterMenu";
import Image from "next/image";

export default function IPhonePage() {
  return (
    <main>
      <CategoryNav />
      
      {/* Primary iPhone Hero */}
      <section className="hero-section" style={{ background: '#000', color: '#fff', paddingBottom: '60px' }}>
        <div className="hero-content">
          <h1 style={{ color: '#fff' }}>iPhone 16 Pro</h1>
          <p>Hello, Apple Intelligence.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Buy</button>
            <a href="#" className="hero-link" style={{ color: '#2997ff' }}>Learn more &gt;</a>
          </div>
          <p className="hero-terms" style={{ color: '#aaa', marginTop: '30px' }}>Built for Apple Intelligence.</p>
        </div>
        <div className="hero-image-container">
          <Image src="/iphone_promo.png" alt="iPhone 16 Pro" fill />
        </div>
      </section>

      {/* Secondary iPhone Product */}
      <section className="hero-section" style={{ background: '#fff', paddingBottom: '60px' }}>
        <div className="hero-content">
          <h1 style={{ fontSize: '48px', color: '#111' }}>iPhone 15</h1>
          <p>Newphoria.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Buy</button>
            <a href="#" className="hero-link">Learn more &gt;</a>
          </div>
        </div>
        <div className="hero-image-container">
          <Image src="/cat_iphone.png" alt="iPhone 15" fill />
        </div>
      </section>
      
      <FooterMenu />
    </main>
  );
}
