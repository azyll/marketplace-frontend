import HeroCarousel from "./HeroCarousel";
import HeroFilterBar from "./HeroFilterBar";
import FeaturedProducts from "./FeaturedProducts";

export default function Hero() {
  return (
    <section className="pt-15">
      <HeroFilterBar />
      <HeroCarousel />
      <FeaturedProducts />
    </section>
  );
}
