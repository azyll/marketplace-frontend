import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import UserProducts from "./components/UserProducts";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="md:pt-4">
      <Hero />
      <FeaturedProducts />
      {/* <UserProducts /> */}
    </main>
  );
}
