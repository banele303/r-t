import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import DualPromoGrid from "@/components/DualPromoGrid";
import CategoryNav from "@/components/CategoryNav";
import PartnerBrands from "@/components/PartnerBrands";
import PromoProducts from "@/components/PromoProducts";
import DeliveryOptions from "@/components/DeliveryOptions";
import PromoBanner from "@/components/PromoBanner";
import TrendingProducts from "@/components/TrendingProducts";
import FeaturedServices from "@/components/FeaturedServices";
import FooterMenu from "@/components/FooterMenu";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <CategoryNav />
      
      <PromoProducts />

      <DualPromoGrid />
      
      <PartnerBrands />

      <DeliveryOptions />

      <PromoBanner />

      <TrendingProducts />

      <FeaturedServices />

      <FooterMenu />
    </main>
  );
}
