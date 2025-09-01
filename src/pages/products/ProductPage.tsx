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
import { notifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router";
import { KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services/products.service";
import { getImage } from "@/services/media.service";
import { useContext, useEffect, useMemo, useState } from "react";
import { PRODUCT_SIZE } from "@/constants/product";
import { CartContext } from "@/contexts/CartContext";
import { AuthContext } from "@/contexts/AuthContext";
import { IconCheck, IconX } from "@tabler/icons-react";
const FALLBACK_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&s";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: product } = useQuery({
    queryKey: [KEY.PRODUCTS, slug],
    queryFn: () => getProductBySlug(slug as string),
    enabled: !!slug,
  });

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [gender, setGender] = useState<string>();
  const [size, setSize] = useState<string>();
  const [price, setPrice] = useState<number>();
  const [loading, setLoading] = useState(false);

  //TODO: replace cart context with tanstack query
  const handleAddToCart = () => {
    const variant = variants.find((v) => v.name === gender && v.size === size);
    if (!variant) return;

    setLoading(true);
    addToCart(variant.id)
      .then((res) => {
        notifications.show({
          title: res.type === "success" ? "Success" : "Error",
          message: res.message,
          color: res.type === "success" ? "green" : "red",
          icon:
            res.type === "success" ? (
              <IconCheck size={16} />
            ) : (
              <IconX size={16} />
            ),
          autoClose: 3000,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleBuyNow = () => {
    navigate("/order/checkout");

    //TODO: if buy now from product page vs if from cart
  };

  const variants = product?.data?.productVariant ?? [];

  const genderOptions = useMemo(
    () =>
      Array.from(
        new Set(variants.map((v) => v.name).filter((g) => g && g !== "N/A"))
      ).map((g) => ({ label: g, value: g })),
    [variants]
  );

  const sortedSizeOptions = useMemo(() => {
    if (!gender) return [];
    const sizes = variants
      .filter((v) => v.name === gender)
      .map((v) => v.size)
      .filter((s) => s && s !== "N/A");

    return sizes.sort(
      (a, b) =>
        Object.keys(PRODUCT_SIZE).indexOf(a) -
        Object.keys(PRODUCT_SIZE).indexOf(b)
    );
  }, [gender, variants]);

  useEffect(() => {
    if (gender && size) {
      const variant = variants.find(
        (v) => v.name === gender && v.size === size
      );
      setPrice(variant?.price);
    }
  }, [gender, size, variants]);

  return (
    <main className="max-w-[1200px] mx-auto relative">
      <Grid
        gutter={{ base: "xl", sm: "sm", md: "lg", lg: "xl" }}
        mt={{ base: 0, sm: "xl" }}
        px={{ sm: "xl", xl: 0 }}
      >
        {/* Product image */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Image
            src={getImage(product?.data?.image ?? FALLBACK_IMAGE)}
            alt={product?.data?.name}
            w="100%"
            className="sm:!rounded-xl"
            loading="lazy"
            fallbackSrc={FALLBACK_IMAGE}
          />
        </Grid.Col>

        {/* Product details */}
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Stack
            w="100%"
            bg="#f2f5f9"
            px={{ base: 16, md: 0 }}
          >
            <Title order={3}>{product?.data?.name}</Title>
            <Text c="dimmed">{product?.data?.description}</Text>

            <Text
              size="xl"
              fw={700}
            >
              <NumberFormatter
                prefix="₱"
                value={price ?? variants[0]?.price}
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
                        setSize(undefined);
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
                      miw={{ base: 60 }}
                      disabled={!gender}
                    >
                      {PRODUCT_SIZE[option as keyof typeof PRODUCT_SIZE] ||
                        option}
                    </Button>
                  ))}
                </Group>
              </>
            )}

            {/* Actions */}
            <Group
              className="sticky bottom-0 left-0 w-full py-2 md:static md:p-0 md:bg-transparent"
              mt="sm"
              grow
              justify="center"
            >
              <Button
                radius="xl"
                color="yellow"
                size="lg"
                disabled={!user || !gender || !size || loading}
                onClick={handleAddToCart}
                loading={loading}
              >
                Add to cart
              </Button>

              <Button
                radius="xl"
                size="lg"
                disabled={!user || !gender || !size}
                onClick={() => {
                  /* TODO: implement Buy Now */
                }}
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
