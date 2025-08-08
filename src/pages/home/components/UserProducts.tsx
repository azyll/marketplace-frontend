import { Title } from "@mantine/core";
import { KEY } from "@/constants/key";
import { getProductList } from "@/services/products.service";
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "@mantine/carousel";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductCard from "@/components/ProductCard";

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

      <Carousel
        px={{ base: 16, xl: 0 }}
        slideSize={{ base: "80%", sm: "50%", md: "33.33%", lg: "25%" }}
        slideGap="md"
        withIndicators={false}
      >
        {isLoading
          ? [...Array(4)].map((_, index) => (
              <Carousel.Slide
                key={index}
                mt={7}
                mb={7}
              >
                <ProductCardSkeleton />
              </Carousel.Slide>
            ))
          : products?.data?.map((product, index) => (
              <Carousel.Slide
                key={index}
                mt={7}
                mb={7}
              >
                <ProductCard product={product} />
              </Carousel.Slide>
            ))}
      </Carousel>
    </section>
  );
}
