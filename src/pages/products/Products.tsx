import HeroFilterBar from "../../components/FilterBar";
import AllProducts from "./components/AllProducts";

export default function Products() {
  return (
    <main className="max-w-[1200px] mx-auto">
      <HeroFilterBar />
      <AllProducts />
    </main>
  );
}
