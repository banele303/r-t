import CategoryNav from "@/components/CategoryNav";
import FooterMenu from "@/components/FooterMenu";
import Image from "next/image";

export default function MacPage() {
  return (
    <main>
      <CategoryNav />
      
      {/* Primary Mac Hero */}
      <section className="hero-section" style={{ background: '#000', color: '#fff', paddingBottom: '60px' }}>
        <div className="hero-content">
          <h1 style={{ color: '#fff' }}>MacBook Pro</h1>
          <p>Mind-blowing. Head-turning.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Buy</button>
            <a href="#" className="hero-link" style={{ color: '#2997ff' }}>Learn more &gt;</a>
          </div>
          <p className="hero-terms" style={{ color: '#aaa', marginTop: '30px' }}>Supercharged by M3, M3 Pro, and M3 Max.</p>
        </div>
        <div className="hero-image-container">
          <Image src="/macbook_hero.png" alt="MacBook Pro" fill />
        </div>
      </section>

      {/* Secondary Mac Product */}
      <section className="hero-section" style={{ background: '#f5f5f7', paddingBottom: '60px' }}>
        <div className="hero-content">
          <h1 style={{ fontSize: '48px', color: '#111' }}>MacBook Air</h1>
          <p>Lean. Mean. M3 machine.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Buy</button>
            <a href="#" className="hero-link">Learn more &gt;</a>
          </div>
        </div>
        <div className="hero-image-container">
          <Image src="/cat_mac.png" alt="MacBook Air" fill />
        </div>
      </section>
      
      <FooterMenu />
    </main>
  );
}
