import { Carousel } from "@mantine/carousel";
import ProductCardSkeleton from "../../../components/ProductCardSkeleton";

export const ProductsCarouselSkeleton = () => {
  return (
    <Carousel
      px={{ base: 16, xl: 0 }}
      slideSize={{ base: "80%", sm: "50%", md: "33.33%", lg: "25%" }}
      slideGap="md"
      withIndicators={false}
    >
      {[...Array(4)].map((_, index) => (
        <Carousel.Slide
          key={index}
          mt={7}
          mb={7}
        >
          <ProductCardSkeleton />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
