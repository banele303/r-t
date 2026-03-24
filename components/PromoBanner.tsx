import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="promo-banner-grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '20px', 
      padding: '20px 5%',
      background: '#fff'
    }}>
      <div className="promo-card" style={{ 
        borderRadius: '32px', 
        overflow: 'hidden', 
        position: 'relative', 
        height: '400px', 
        cursor: 'pointer',
        boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
      }}>
        <Image 
          src="/wild-offers-banner.jpg" 
          alt="Wild Offers" 
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="promo-card" style={{ 
        borderRadius: '32px', 
        overflow: 'hidden', 
        position: 'relative', 
        height: '400px', 
        cursor: 'pointer',
        boxShadow: '0 12px 24px rgba(0,0,0,0.08)'
      }}>
        <Image 
          src="/trade_in_banner.png" 
          alt="Trade In Offers" 
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </section>
  );
}
