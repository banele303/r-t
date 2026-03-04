import Image from "next/image";
import Link from "next/link";
import '@/app/featured.css';

const featuredItems = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    subtitle: "Titanium. So strong. So light. So Pro.",
    link: "/iphone",
    image: "/iphone_promo.png",
    isDark: true,
  },
  {
    id: 2,
    title: "MacBook Air M3",
    subtitle: "Lean. Mean. M3 machine.",
    link: "/mac",
    image: "/macbook_hero.png",
    isDark: false,
  },
  {
    id: 3,
    title: "Apple Watch Ultra 2",
    subtitle: "Next level adventure.",
    link: "/",
    image: "/promo_watch_ultra.png",
    isDark: false,
  },
];

export default function FeaturedSection() {
  return (
    <section className="featured-section">
      <div className="featured-header">
        <h2>Featured Highlights</h2>
        <p>The best of Apple. Now in one place.</p>
      </div>

      <div className="featured-carousel">
        {featuredItems.map((item) => (
          <Link href={item.link} key={item.id} className={`featured-item ${item.isDark ? 'dark' : 'light'}`}>
            <div className="featured-content">
              <h3>{item.title}</h3>
              <div className="featured-action">
                <span>Discover</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
            <div className="featured-image-wrapper">
              <Image src={item.image} alt={item.title} fill className="featured-image" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
