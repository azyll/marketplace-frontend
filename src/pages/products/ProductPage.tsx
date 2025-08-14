import {
  Button,
  Divider,
  Grid,
  Group,
  Image,
  NumberFormatter,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services/products.service";
import { getImage } from "@/services/media.service";
import { useEffect, useState } from "react";
import { PRODUCT_SIZE } from "@/constants/product";

export default function ProductPage() {
  const { slug } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS],
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  });

  const navigate = useNavigate();

  const [gender, setGender] = useState<string | undefined>();

  const [size, setSize] = useState<string | undefined>();

  const [price, setPrice] = useState<number | undefined>();

  const genderOptions = Array.from(
    new Set(product?.data?.productVariant.map((v) => v.name))
  ).map((gender) => ({
    label: gender,
    value: gender.toLowerCase(),
  }));

  // Get sizes based on selected gender
  const sizeOptions = gender
    ? Array.from(
        new Set(
          product?.data?.productVariant
            .filter((v) => v.name.toLowerCase() === gender.toLowerCase())
            .map((v) => v.size)
        )
      )
    : [];

  useEffect(() => {
    if (gender && size) {
      const variant = product?.data?.productVariant.find(
        (v) =>
          v.name.toLowerCase() === gender.toLowerCase() &&
          v.size.toLowerCase() === size.toLowerCase()
      );
      setPrice(variant?.price);
    }
  }, [gender, size, product]);

  const FALLBACK_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&s";

  const handleAddToCart = {};

  const handleBuyNow = {};

  return (
    <main className="max-w-[1200px] mx-auto">
      <Grid
        gutter={{ base: "xl", sm: "sm", md: "lg", lg: "xl" }}
        mt={{ base: 0, sm: "xl" }}
        px={{ sm: "xl", xl: 0 }}
      >
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Image
            src={getImage(product?.data?.image ?? FALLBACK_IMAGE)}
            alt={product?.data.name}
            w="100%"
            className="sm:!rounded-xl"
            loading="lazy"
            fallbackSrc={FALLBACK_IMAGE}
          />
        </Grid.Col>

        {/* Right side / product details */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack
            w="100%"
            bg="#f2f5f9"
            px={{ base: 16, md: 0 }}
          >
            <Title order={3}>{product?.data.name}</Title>
            <Text c="dimmed">{product?.data.description}</Text>

            <Text
              size="xl"
              fw={700}
            >
              <NumberFormatter
                prefix="₱"
                value={price ?? product?.data?.productVariant[0]?.price}
                decimalSeparator=""
              />
            </Text>

            <Divider />

            {/* {
          Size options
          - disabled when size == N/A
          - 
          } */}

            <Title order={4}>Gender</Title>
            <Group gap={5}>
              {genderOptions.map(({ label, value }) => (
                <Button
                  key={value}
                  variant={gender === value ? "filled" : "light"}
                  onClick={() => {
                    setGender(value);
                    setSize(undefined); // reset size when gender changes
                  }}
                >
                  {label}
                </Button>
              ))}
            </Group>

            <Title order={4}>Size</Title>
            <Group gap={5}>
              {sizeOptions.map((option) => (
                <Button
                  key={option}
                  variant={size === option ? "filled" : "light"}
                  onClick={() => setSize(option)}
                  miw={{ base: "60" }}
                  disabled={!gender}
                >
                  {PRODUCT_SIZE[option] || option}
                </Button>
              ))}
            </Group>

            {/* Cart Button*/}
            <Group
              className="
            sticky bottom-0 left-0 w-full py-2
            md:static md:p-0 md:bg-transparent
            "
              mt="sm"
              grow
              justify="center"
            >
              <Button
                radius="xl"
                color="yellow"
                size="lg"
                onClick={() => handleAddToCart}
              >
                Add to cart
              </Button>
              <Button
                radius="xl"
                size="lg"
                onClick={() => {}}
              >
                Buy now
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </main>
  );
}
