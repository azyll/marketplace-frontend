import { Card, Image, NumberFormatter, Stack, Text } from "@mantine/core"
import { IProduct } from "@/types/product.type"
import { Link } from "react-router"
import { getImage } from "@/services/media.service"

interface ProductCardProps {
  product: IProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <>
      <Card
        className="cursor-pointer transition-all duration-200 ease-in-out hover:scale-105"
        component={Link}
        to={`/products/${product.productSlug}`}
        padding="sm"
        radius="md"
        mih={428}
      >
        <Card.Section className="aspect-square overflow-hidden rounded-t-md">
          <Image
            className="aspect-square"
            src={getImage(product.image)}
            fit="cover"
            alt={product.name}
          />
        </Card.Section>

        <Stack gap={4} mt="xs">
          <Text fw={500} size="sm">
            {product.name}
          </Text>

          <Text fz="xs" c="dimmed" className="line-clamp-2 min-h-[38px]">
            {product.description}
          </Text>

          <NumberFormatter
            prefix="₱"
            decimalScale={2}
            thousandSeparator
            fixedDecimalScale
            value={product.productVariant?.[0].price}
            className="font-semibold"
          />

          <Text size="xs" c="gray.6" mt={-2} tt="capitalize">
            {product.category}
          </Text>
        </Stack>
      </Card>
    </>
  )
}
