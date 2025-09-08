import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { KEY } from "@/constants/key";
import { getProductList } from "@/services/products.service";
import { Card, Grid, Pagination, Space, Text } from "@mantine/core";
import { useEffect, useMemo, useContext } from "react";
import { useFilters } from "@/hooks/useFilters";
import FilterBar from "@/components/FilterBar";
import { PRODUCT_CATEGORY } from "@/constants/product";
import { IProductListFilters } from "@/types/product.type";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { IconMoodSad } from "@tabler/icons-react";
import ProductCard from "@/components/ProductCard";
import { AuthContext } from "@/contexts/AuthContext";

export default function Products() {
  const user = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const department = user.user?.student?.program?.department?.name;
  const sex = user.user?.student?.sex;

  const [filter, setFilterValue] = useFilters<IProductListFilters>({
    category: searchParams.get("category") ?? PRODUCT_CATEGORY.ALL,
    latest: true,
    limit: 8,
    name: searchParams.get("name") ?? undefined,
  });

  const handleOnCategorySelect = (category: string) => {
    // Keep existing search when changing category
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", category);
    setSearchParams(newParams);
    setFilterValue("category", category);
  };

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filter, department, sex],
    queryFn: () => {
      const queryParams: any = {
        ...filter,
        category:
          filter.category === PRODUCT_CATEGORY.ALL
            ? undefined
            : filter.category,
      };

      // If user is logged in, add department filter
      // Also check if department is already in URL params (from FeaturedProducts "View All" button)
      const departmentFromUrl = searchParams.get("department");
      if (department || departmentFromUrl) {
        queryParams.department =
          departmentFromUrl || user.user?.student.program.department.name;
      }

      // Add sex-based filtering if user is logged in and has a sex value
      if (sex) {
        queryParams.sex = sex;
      }

      return getProductList(queryParams);
    },
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

  // Update filters when URL changes
  useEffect(() => {
    const nameParam = searchParams.get("name");
    if (nameParam !== filter.name) {
      setFilterValue("name", nameParam || undefined);
    }
  }, [searchParams]);

  // Get the department name for display (from URL param or user context)
  const currentDepartment = useMemo(() => {
    const departmentFromUrl = searchParams.get("department");
    return departmentFromUrl || department;
  }, [searchParams, department]);

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

      {/* Show current department filter if applied */}
      {currentDepartment && (
        <section className="px-4 xl:px-0">
          <Text
            size="sm"
            c="dimmed"
          >
            Showing products for: {currentDepartment}
          </Text>
          <Space h="xs" />
        </section>
      )}

      {/* Show current search term */}
      {filter.name && (
        <section className="px-4 xl:px-0">
          <Text
            size="sm"
            c="dimmed"
          >
            Search results for: "{filter.name}"
          </Text>
          <Space h="xs" />
        </section>
      )}

      {/* Show sex filter indicator */}
      {sex && (
        <section className="px-4 xl:px-0">
          <Text
            size="sm"
            c="dimmed"
          >
            Showing {sex} products
          </Text>
          <Space h="xs" />
        </section>
      )}

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
                {filter.name
                  ? `No products found for "${filter.name}"`
                  : "No products found."}
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
