import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="promo-banner-section">
      <div className="promo-banner-content">
        <span className="promo-tag">Featured Brand</span>
        <h2>Capture Your World.</h2>
        <p>Explore the latest DJI drones and action cameras designed for next-level content creators.</p>
        <Link href="/dji">
            <button className="btn-primary" style={{ marginTop: '30px' }}>Shop DJI Now</button>
        </Link>
      </div>
      <div className="promo-banner-image">
        <Image src="/cat_drone.png" alt="DJI Drone Promo" fill />
      </div>
    </section>
  );
}
