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
import { useState } from "react";

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

  const genderOptions = [
    { label: "Female", value: "female" },
    { label: "Male", value: "male" },
  ];

  const sizeOptions = [
    { label: "XS", value: "extra-small" },
    { label: "S", value: "small" },
    { label: "M", value: "medium" },
    { label: "L", value: "large" },
    { label: "XL", value: "extra-large" },
    { label: "2XL", value: "double-extra-large" },
    { label: "3XL", value: "triple-extra-large" },
  ];

  const sizeLabel = {
    "Extra Small": "XS",
    Small: "S",
    "Extra Large": "XL",
  };

  const sizeOptionsV2 = ["Extra Small", "Small", "Extra Large"];

  const FALLBACK_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbrHWzlFK_PWuIk1Jglo7Avt97howljIWwAA&s";

  return (
    <main className="max-w-[1200px] mx-auto">
      <Grid
        gutter={{ base: "xl", sm: "sm", md: "lg", lg: "xl" }}
        mt={{ base: 0, sm: "xl" }}
        px={{ sm: "xl", xl: 0 }}
      >
        <Grid.Col span={{ base: 12, sm: 6 }}>
          {/* PC */}
          <Image
            src={getImage(product?.data?.image ?? FALLBACK_IMAGE)}
            alt={product?.data.name}
            w="100%"
            className="sm:!rounded-xl"
            loading="lazy"
            fallbackSrc={FALLBACK_IMAGE}
          />
        </Grid.Col>

        {/* Mobile */}
        {/* <Image
          src={getImage(product?.data?.image ?? FALLBACK_IMAGE)}
          alt={product?.data.name}
          w={{ base: "100%", md: "50%" }}
          radius={0}
          hiddenFrom="md"
          loading="lazy"
          fallbackSrc={FALLBACK_IMAGE}
        /> */}

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
                value={product?.data.productVariant[0].price}
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
                  onClick={() => setGender(value)}
                >
                  {label}
                </Button>
              ))}
            </Group>

            <Title order={4}>Size</Title>

            <Group gap={5}>
              {sizeOptionsV2.map((option) => (
                <Button
                  key={option}
                  variant={size === option ? "filled" : "light"}
                  onClick={() => setSize(option)}
                  miw={{ base: "60" }}
                >
                  {sizeLabel[option]}
                </Button>
              ))}
            </Group>

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
              >
                Add to cart
              </Button>
              <Button
                radius="xl"
                size="lg"
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
