import { Carousel } from "@mantine/carousel";
import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { KEY } from "../../../constants/key";
import { getProductList } from "../../../services/products.service";
import { getImage } from "../../../services/media.service";
import { FeaturedProductSkeleton } from "./FeaturedProductsSkeleton";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS],
    queryFn: () => getProductList({ department: "Proware", latest: true }),
  });

  return (
    <section className="max-w-[1200px] mx-auto">
      <Group
        pt={16}
        px={{ base: 16, xl: 0 }}
        pb={10}
        justify="space-between"
        wrap="nowrap"
      >
        <Title order={2}>Featured</Title>

        <Button
          component={Link}
          to="/products"
          variant="default"
          radius="xl"
        >
          View All
        </Button>
      </Group>

      <Carousel
        px={{ base: 16, xl: 0 }}
        slideSize={{ base: "80%", sm: "50%", md: "33.33%", lg: "25%" }}
        slideGap="md"
        withIndicators={false}
      >
        {isLoading &&
          [...Array(2)].map((_, index) => (
            <Carousel.Slide
              key={index}
              mt={7}
              mb={7}
            >
              <FeaturedProductSkeleton />
            </Carousel.Slide>
          ))}

        {products?.data?.map((item, index) => (
          <Carousel.Slide
            key={index}
            mt={7}
            mb={7}
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
          </Carousel.Slide>
        ))}
      </Carousel>
    </section>
  );
}
