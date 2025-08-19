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
import { useContext, useEffect, useState } from "react";
import { PRODUCT_SIZE } from "@/constants/product";
import { CartContext } from "@/contexts/CartContext";
import { AuthContext } from "@/contexts/AuthContext";

export default function ProductPage() {
  const { slug } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS],
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  });

  const { cart, addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const [gender, setGender] = useState<string | undefined>();

  const [size, setSize] = useState<string | undefined>();

  const [price, setPrice] = useState<number | undefined>();

  const genderOptions = Array.from(
    new Set(
      product?.data?.productVariant
        .map((v) => v.name)
        .filter((g) => g && g !== "N/A")
    )
  ).map((gender) => ({
    label: gender,
    value: gender.toLowerCase(),
  }));

  const sizeOptions = gender
    ? Array.from(
        new Set(
          product?.data?.productVariant
            .filter((v) => v.name.toLowerCase() === gender.toLowerCase())
            .map((v) => v.size)
            .filter((s) => s && s !== "N/A")
        )
      )
    : [];

  const sortedSizeOptions = sizeOptions.sort(
    (a, b) =>
      Object.keys(PRODUCT_SIZE).indexOf(a) -
      Object.keys(PRODUCT_SIZE).indexOf(b)
  );

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

  return (
    <main className="max-w-[1200px] mx-auto">
      <Grid
        gutter={{ base: "xl", sm: "sm", md: "lg", lg: "xl" }}
        mt={{ base: 0, sm: "xl" }}
        px={{ sm: "xl", xl: 0 }}
      >
        {/* Left side (Product image) */}
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

        {/* Right side (product details) */}
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

            {genderOptions.length > 0 && (
              <>
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
              </>
            )}

            {sortedSizeOptions.length > 0 && (
              <>
                <Title order={4}>Size</Title>
                <Group gap={5}>
                  {sortedSizeOptions.map((option) => (
                    <Button
                      key={option}
                      variant={size === option ? "filled" : "light"}
                      onClick={() => setSize(option)}
                      miw={{ base: "60" }}
                      disabled={!gender}
                    >
                      {PRODUCT_SIZE[option as keyof typeof PRODUCT_SIZE] ||
                        option}
                    </Button>
                  ))}
                </Group>
              </>
            )}

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
                disabled={!user || !gender || !size}
                onClick={() => {
                  const variant = product?.data?.productVariant.find(
                    (v) =>
                      v.name.toLowerCase() === gender?.toLowerCase() &&
                      v.size.toLowerCase() === size?.toLowerCase()
                  );
                  if (!variant) return; // no valid selection

                  addToCart(variant.id); // call context
                }}
              >
                Add to cart
              </Button>
              <Button
                radius="xl"
                size="lg"
                disabled={!user || !gender || !size}
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
