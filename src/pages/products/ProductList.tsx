import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { KEY } from "../../constants/key";
import { getProductList } from "../../services/products.service";
import { Grid, Pagination, Space } from "@mantine/core";
import { useMemo } from "react";
import { useFilters } from "../../hooks/useFilters";
import ProductsSkeleton from "./components/ProductsSkeleton";
import FilterBar from "../../components/FilterBar";
import { PRODUCT_CATEGORY } from "../../constants/product-category";
import { IProductListFilters } from "../../types/product.type";
import ProductCard from "./components/ProductCard";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilterValue] = useFilters<IProductListFilters>({
    category: searchParams.get("category") ?? PRODUCT_CATEGORY.ALL,
    latest: true,
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
        {isLoading ? (
          <ProductsSkeleton />
        ) : (
          <Grid
            px={{ base: 16, xl: 0 }}
            mt=""
          >
            {products?.data?.map((product, index) => (
              <Grid.Col
                key={index}
                span={{ base: 12, sm: 6, md: 3 }}
              >
                <ProductCard product={product} />
              </Grid.Col>
            ))}
          </Grid>
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
