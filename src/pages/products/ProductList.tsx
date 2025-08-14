import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { KEY } from "@/constants/key";
import { getProductList } from "@/services/products.service";
import { Card, Grid, Pagination, Space, Text } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useFilters } from "@/hooks/useFilters";
import FilterBar from "@/components/FilterBar";
import { PRODUCT_CATEGORY } from "@/constants/product";
import { IProductListFilters } from "@/types/product.type";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { IconMoodSad } from "@tabler/icons-react";
import ProductCard from "@/components/ProductCard";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilterValue] = useFilters<IProductListFilters>({
    category: searchParams.get("category") ?? PRODUCT_CATEGORY.ALL,
    latest: true,
    limit: 8,
  });

  const handleOnCategorySelect = (category: string) => {
    setSearchParams({ category });
    setFilterValue("category", category);
  };

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

  const totalPages = useMemo(() => {
    const totalItems = products?.meta.totalItems ?? 0;
    const itemsPerPage = products?.meta.itemsPerPage ?? 8;

    return Math.ceil(totalItems / itemsPerPage);
  }, [products]);

  const showCarousel = useMemo(() => {
    return isLoading || (products?.data && products.data.length > 0);
  }, [isLoading, products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="max-w-[1200px] mx-auto">
      <Space h="sm" />
      <section className="px-4 xl:px-0">
        <FilterBar
          value={filter.category}
          onSelect={(category) => handleOnCategorySelect(category)}
        />
      </section>

      <Space h="sm" />

      <section>
        {showCarousel ? (
          <Grid
            px={{ base: 16, xl: 0 }}
            mt=""
          >
            {isLoading
              ? [...Array(8)].map((_, index) => (
                  <Grid.Col
                    key={index}
                    span={{ base: 12, sm: 6, md: 3 }}
                  >
                    <ProductCardSkeleton />
                  </Grid.Col>
                ))
              : products?.data?.map((product, index) => (
                  <Grid.Col
                    key={index}
                    span={{ base: 12, sm: 6, md: 3 }}
                  >
                    <ProductCard product={product} />
                  </Grid.Col>
                ))}
          </Grid>
        ) : (
          <Card
            h={340}
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

        <Pagination
          my={"sm"}
          value={filter.page}
          onChange={(page) => setFilterValue("page", page)}
          total={totalPages}
        />
      </section>
    </main>
  );
}
