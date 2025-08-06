import { Card, Image, Stack, Text } from "@mantine/core";
import { IProduct } from "../../../types/product.type";
import { Link } from "react-router";
import { getImage } from "../../../services/media.service";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <>
      <Card
        className="transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
        component={Link}
        to={`/products/slug/${product.productSlug}`}
        padding="sm"
        radius="md"
        mih={428}
      >
        <Card.Section className="rounded-t-md aspect-square overflow-hidden">
          <Image
            className="aspect-square"
            src={getImage(product.image)}
            fit="cover"
            alt={product.name}
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
            {product.name}
          </Text>

          <Text
            fz="xs"
            c="dimmed"
            className="line-clamp-2 min-h-[38px]"
          >
            {product.description}
          </Text>

          <Text fw={600}>{"₱" + product.productVariant?.[0].price}</Text>

          <Text
            size="xs"
            c="gray.6"
            mt={-2}
          >
            {product.category}
          </Text>
        </Stack>
      </Card>
    </>
  );
}
