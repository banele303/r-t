import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Mac", img: "/cat_mac.png", link: "/mac" },
  { name: "iPhone", img: "/cat_iphone.png", link: "/iphone" },
  { name: "Apple Watch", img: "/cat_watch.png", link: "/" },
  { name: "AirPods", img: "/cat_airpods.png", link: "/" },
  { name: "iPad", img: "/cat_ipad.png", link: "/" },
  { name: "DJI", img: "/cat_drone.png", link: "/" },
  { name: "Go Pro", img: "/cat_gopro.png", link: "/" },
  { name: "Apple TV", img: "/cat_tv.png", link: "/" },
  { name: "eufy", img: "/cat_eufy.png", link: "/" },
  { name: "Beats", img: "/cat_beats.png", link: "/" },
];

export default function CategoryNav() {
  return (
    <section className="category-section">
      <div className="category-container">
        {categories.map((cat, idx) => (
          <Link href={cat.link} key={idx} className="category-item">
            <div className="category-img-wrapper">
              <Image 
                src={cat.img} 
                alt={cat.name} 
                fill 
                className="category-image" 
              />
            </div>
            <span className="category-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
