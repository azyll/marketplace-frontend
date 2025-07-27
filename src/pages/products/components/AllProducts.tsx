import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { KEY } from "../../../constants/key";
import { getProductList } from "../../../services/products.service";
import { Card, Grid, Group, Image, Stack, Text } from "@mantine/core";
import { getImage } from "../../../services/media.service";

export default function AllProducts() {
  const { slug } = useParams();
  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS],
    queryFn: () => getProductList({}),
  });

  return (
    <Grid
      px={{ base: 16, xl: 16 }}
      mt=""
    >
      {slug}
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
  );
}
