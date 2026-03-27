import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Laptops", img: "/cat_laptops.png", link: "/products?category=Laptops" },
  { name: "Phones", img: "/cat_phones.png", link: "/products?category=Phones" },
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
