import HeroCarousel from "./HeroCarousel";
import HeroFilterBar from "./HeroFilterBar";
import HeroFeatured from "./HeroFeatured";

export default function Hero() {
  return (
    <section>
      <HeroFilterBar />
      <HeroCarousel />
      <HeroFeatured />
    </section>
  );
}
