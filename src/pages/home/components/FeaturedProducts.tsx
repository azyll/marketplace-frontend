import { Carousel } from "@mantine/carousel";
import { Button, Group, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { KEY } from "../../../constants/key";
import { getProductList } from "../../../services/products.service";
import { ProductsCarouselSkeleton } from "./ProductsCarouselSkeleton";
import FilterBar from "../../../components/FilterBar";
import { useFilters } from "../../../hooks/useFilters";
import { IProductListFilters } from "../../../types/product.type";
import { PRODUCT_CATEGORY } from "../../../constants/product-category";
import ProductCard from "../../products/components/ProductCard";

export default function FeaturedProducts() {
  const [filter, setFilterValue] = useFilters<IProductListFilters>({
    category: PRODUCT_CATEGORY.ALL,
    latest: true,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filter],
    queryFn: () =>
      getProductList({
        ...filter,
        category:
          filter.category === PRODUCT_CATEGORY.ALL
            ? undefined
            : filter.category,
      }),
  });

  return (
    <section className="max-w-[1200px] mx-auto">
      <Title
        pt={16}
        px={{ base: 16, xl: 0 }}
        order={2}
      >
        Featured
      </Title>

      {/*Filter & View All Section */}
      <Group
        px={{ base: 16, xl: 0 }}
        py={10}
        justify="space-between"
        wrap="nowrap"
      >
        <FilterBar
          value={filter.category}
          onSelect={(category) => setFilterValue("category", category)}
        />

        <Button
          className="shrink-0"
          component={Link}
          to={`/products?category=${filter.category}`}
          variant="default"
          radius="xl"
        >
          View All
        </Button>
      </Group>
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
