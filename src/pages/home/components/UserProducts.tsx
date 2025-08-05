import { Card, Group, Image, Stack, Text, Title } from "@mantine/core";
import { KEY } from "../../../constants/key";
import { getProductList } from "../../../services/products.service";
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "@mantine/carousel";
import { getImage } from "../../../services/media.service";
import { Link } from "react-router";
import { ProductsCarouselSkeleton } from "./ProductsCarouselSkeleton";
import ProductCard from "../../products/components/ProductCard";

export default function UserProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS],
    queryFn: () => getProductList({ department: "Proware", latest: true }),
  });

  return (
    <section className="max-w-[1200px] mx-auto">
      <Title
        pt={16}
        px={{ base: 16, xl: 0 }}
        pb={10}
        order={2}
      >
        Program
      </Title>

      {isLoading ? (
        <ProductsCarouselSkeleton />
      ) : (
        <Carousel
          px={{ base: 16, xl: 0 }}
          slideSize={{ base: "80%", sm: "50%", md: "33.33%", lg: "25%" }}
          slideGap="md"
          withIndicators={false}
        >
          {products?.data?.map((product, index) => (
            <Carousel.Slide
              key={index}
              mt={7}
              mb={7}
            >
              <ProductCard product={product} />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </section>
  );
}
