import { AppShell } from "@mantine/core";
import Hero from "./components/Hero";
import FeaturedProducts from "./components/FeaturedProducts";
import UserProducts from "./components/UserProducts";

export default function Home() {
  return (
    <main className="md:pt-4">
      <Hero />
      <FeaturedProducts />
      <UserProducts />
    </main>
  );
}
