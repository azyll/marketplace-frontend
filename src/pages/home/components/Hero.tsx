import HeroCarousel from "./HeroCarousel";
import HeroFilterBar from "../../../components/FilterBar";
import FeaturedProducts from "./FeaturedProducts";
import UserProducts from "./UserProducts";

export default function Hero() {
  return (
    <section>
      <HeroFilterBar />
      <HeroCarousel />
      <FeaturedProducts />
      <UserProducts />
    </section>
  );
}
