import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Image,
  NumberFormatter,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services/products.service";
import { getImage } from "@/services/media.service";
import { IconChevronLeft } from "@tabler/icons-react";

export default function ProductPage() {
  const { slug } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS],
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  });

  const navigate = useNavigate();

  return (
    <main>
      <ActionIcon
        variant="light"
        radius="xl"
        onClick={() => navigate(-1)}
      >
        <IconChevronLeft />
      </ActionIcon>
      <Stack>
        <Image
          src={getImage(product?.data?.image ?? "")}
          alt={product?.data.name}
        />

        <Card>
          <Title order={3}>{product?.data.name}</Title>

          <Group>
            <Text
              size="xl"
              fw={700}
            >
              <NumberFormatter
                prefix="₱"
                value={product?.data.productVariant[0].price}
                decimalSeparator=""
              />
            </Text>
          </Group>

          <Title order={4}>Description</Title>
          <Text>{product?.data.description}</Text>

          <Divider />
          {product?.data.productVariant[0].size == "N/A" ? (
            <>
              {" "}
              <Title order={4}>Select Size</Title>
              <Text>{product?.data.productVariant[0].size}</Text>
            </>
          ) : (
            ""
          )}
        </Card>

        <Group
          justify="center"
          grow
        >
          <Button
            radius="xl"
            color="yellow"
          >
            Add to cart
          </Button>
          <Button radius="xl">Buy now</Button>
        </Group>
      </Stack>
    </main>
  );
}
