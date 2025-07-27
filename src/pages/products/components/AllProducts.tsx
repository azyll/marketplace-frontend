import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { KEY } from "../../../constants/key";
import { getProductList } from "../../../services/products.service";
import { Card, Grid, Image, Pagination, Stack, Text } from "@mantine/core";
import { getImage } from "../../../services/media.service";
import { useMemo } from "react";
import { useFilters } from "../../../hooks/useFilters";
import AllProductsSkeleton from "./AllProductsSkeleton";

export default function AllProducts() {
  const [filters, setFilters] = useFilters({ page: 1, limit: 8 });

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getProductList(filters),
  });

  const totalPages = useMemo(() => {
    const totalItems = products?.meta.totalItems ?? 0;
    const itemsPerPage = products?.meta.itemsPerPage ?? 8;

    return Math.ceil(totalItems / itemsPerPage);
  }, [products]);

  return (
    <>
      {isLoading ? (
        <AllProductsSkeleton />
      ) : (
        <Grid
          px={{ base: 16, xl: 0 }}
          mt=""
        >
          {products?.data?.map((item, index) => (
            <Grid.Col
              key={index}
              span={{ base: 12, sm: 6, md: 3 }}
            >
              <Card
                className="transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
                component={Link}
                to={`/products/${item.productSlug}`}
                shadow="sm"
                padding="sm"
                radius="md"
                withBorder
              >
                <Card.Section className="rounded-t-md overflow-hidden">
                  <Image
                    src={getImage(item.image)}
                    fit="contain"
                    alt={item.name}
                  />
                </Card.Section>

                <Stack
                  gap={4}
                  mt="xs"
                >
                  <Text
                    fw={500}
                    size="sm"
                  >
                    {item.name}
                  </Text>

                  <Text
                    fz="xs"
                    c="dimmed"
                    className="line-clamp-2"
                  >
                    {item.description}
                  </Text>

                  <Text fw={600}>{"₱" + item.productVariant?.[0].price}</Text>

                  <Text
                    size="xs"
                    c="gray.6"
                    mt={-2}
                  >
                    {item.category}
                  </Text>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}

      <Pagination
        my={"sm"}
        value={filters.page}
        onChange={(page) => setFilters("page", page)}
        total={totalPages}
      />
    </>
  );
}
