import HeroFilterBar from "../home/components/HeroFilterBar";
import AllProducts from "./components/AllProducts";

export default function Products() {
  return (
    <section className="max-w-[1200px] mx-auto">
      <HeroFilterBar />
      <AllProducts />
    </section>
  );
}
