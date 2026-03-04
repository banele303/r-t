import CategoryNav from "@/components/CategoryNav";
import FooterMenu from "@/components/FooterMenu";
import TrendingProducts from "@/components/TrendingProducts";
import Image from "next/image";

export default function DJIPage() {
  return (
    <main>
      <CategoryNav />
      
      {/* DJI Hero Banner */}
      <section className="hero-section" style={{ background: 'linear-gradient(135deg, #1f1f1f, #333)', color: '#fff', paddingBottom: '60px' }}>
        <div className="hero-content">
          <h1 style={{ color: '#fff' }}>DJI Mini 4 Pro</h1>
          <p>Mini to the Max.</p>
          <div className="hero-buttons">
            <button className="btn-primary" style={{ backgroundColor: '#fff', color: '#000' }}>Buy</button>
            <a href="#" className="hero-link" style={{ color: '#aaa' }}>Learn more &gt;</a>
          </div>
          <p className="hero-terms" style={{ color: '#888', marginTop: '30px' }}>Under 249g. True Vertical Shooting.</p>
        </div>
        <div className="hero-image-container">
          <Image src="/cat_drone.png" alt="DJI Mini 4 Pro" fill style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }} />
        </div>
      </section>

      <TrendingProducts />
      
      <FooterMenu />
    </main>
  );
}
