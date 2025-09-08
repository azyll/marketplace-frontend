import { Carousel } from "@mantine/carousel";
import { Button, Card, Group, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { KEY } from "@/constants/key";
import { getProductList } from "@/services/products.service";
import FilterBar from "@/components/FilterBar";
import { useFilters } from "@/hooks/useFilters";
import { IProductListFilters } from "@/types/product.type";
import { PRODUCT_CATEGORY } from "@/constants/product";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { useMemo, useContext } from "react";
import { IconMoodSad } from "@tabler/icons-react";
import ProductCard from "@/components/ProductCard";
import { AuthContext } from "@/contexts/AuthContext";
import "@/styles/carousel.css";

export default function FeaturedProducts() {
  const user = useContext(AuthContext);

  const [filter, setFilterValue] = useFilters<IProductListFilters>({
    category: PRODUCT_CATEGORY.ALL,
    latest: true,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: [
      KEY.PRODUCTS,
      filter,
      user.user?.student?.program?.department?.name,
      user.user?.student?.sex,
    ],
    queryFn: () => {
      const queryParams: any = {
        ...filter,
        category:
          filter.category === PRODUCT_CATEGORY.ALL
            ? undefined
            : filter.category,
      };

      // If user is logged in, add department filter
      if (user.user?.student?.program?.department?.name) {
        queryParams.department = user.user.student.program.department.name;
      }

      if (user.user?.student?.sex) {
        queryParams.sex = user.user.student.sex;
      }

      return getProductList(queryParams);
    },
  });

  const showCarousel = useMemo(() => {
    return isLoading || (products?.data && products.data.length > 0);
  }, [isLoading, products]);

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
        pt={10}
        pb={16}
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
          to={`/products?category=${filter.category}${
            user.user?.student?.program?.department?.name
              ? `&department=${encodeURIComponent(
                  user.user.student.program.department.name
                )}`
              : ""
          }`}
          variant="default"
          radius="xl"
        >
          View All
        </Button>
      </Group>

      {showCarousel ? (
        <Carousel
          px={{ base: 16, xl: 0 }}
          slideSize={{ base: "80%", sm: "50%", md: "33.33%", lg: "25%" }}
          slideGap="md"
          withIndicators={false}
          controlSize={30}
          className="!overflow-visible"
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
                  py={4}
                >
                  <ProductCard product={product} />
                </Carousel.Slide>
              ))}
        </Carousel>
      ) : (
        <Card
          h={240}
          bg="#e9edf3"
          padding="sm"
          radius="lg"
          mx={{ base: 16, xl: 0 }}
        >
          <div className="flex justify-center items-center flex-col h-full">
            <IconMoodSad
              color="gray"
              size={32}
              stroke={1.5}
            />
            <Text
              ta="center"
              c="dimmed"
            >
              No products found.
            </Text>
          </div>
        </Card>
      )}
    </section>
  );
}
