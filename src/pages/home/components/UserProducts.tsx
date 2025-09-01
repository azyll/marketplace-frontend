import { Title } from "@mantine/core";
import { KEY } from "@/constants/key";
import { getProductList } from "@/services/products.service";
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "@mantine/carousel";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import ProductCard from "@/components/ProductCard";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function UserProducts() {
  const user = useContext(AuthContext);

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS],
    queryFn: () =>
      getProductList({
        department: "Information and Communication Technology",
        latest: true,
      }),
    enabled: !!user,
  });

  if (!user.user?.student.program.name) return null;

  return (
    <section className="max-w-[1200px] mx-auto">
      <Title
        pt={16}
        px={{ base: 16, xl: 0 }}
        pb={10}
        order={2}
      >
        {user.user?.student.program.name}
      </Title>

      <Carousel
        px={{ base: 16, xl: 0 }}
        slideSize={{ base: "80%", sm: "50%", md: "33.33%", lg: "25%" }}
        slideGap="md"
        withIndicators={false}
        classNames={{ control: "control" }}
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
