import HeroCarousel from "./HeroCarousel";
import HeroFilterBar from "./HeroFilterBar";

export default function Hero() {
  return (
    <section>
      <HeroFilterBar />
      <HeroCarousel />
    </section>
  );
}
