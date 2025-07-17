import { Carousel } from "@mantine/carousel";
import { Badge, Button, Card, Group, Image, Stack, Text } from "@mantine/core";
import { Link } from "react-router";

export default function HeroFeatured() {
  const uniforms = [
    {
      title: "ICT Polo",
      desc: "Information and Communication Technology Daily Polo...",
      price: "₱350.00 - ₱500.00",
      category: "Upperwear",
      image:
        "https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/485347630_28946239918323750_2000395837053000671_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=tDrXwP2__okQ7kNvwFIs8ro&_nc_oc=AdkA6NJTA8LI_5eKfzzv4IThqMIrsH91X3kUPy0qeoSKn_espsiXXFpOMlAAaFyhePQ&_nc_zt=23&_nc_ht=scontent.fmnl17-2.fna&_nc_gid=i3WDSeH7tqNUwMOuHeRU1w&oh=00_AfS4gKk7u84LGpEW6NFal6HqNWx42K3v71_6C3deGFW3Vg&oe=687982F8",
    },
    {
      title: "ICT Pants",
      desc: "Information and Communication Technology Daily Pants...",
      price: "₱350.00 - ₱500.00",
      category: "Lowerwear",
      image:
        "https://scontent.fmnl17-2.fna.fbcdn.net/v/t39.30808-6/485347630_28946239918323750_2000395837053000671_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=tDrXwP2__okQ7kNvwFIs8ro&_nc_oc=AdkA6NJTA8LI_5eKfzzv4IThqMIrsH91X3kUPy0qeoSKn_espsiXXFpOMlAAaFyhePQ&_nc_zt=23&_nc_ht=scontent.fmnl17-2.fna&_nc_gid=i3WDSeH7tqNUwMOuHeRU1w&oh=00_AfS4gKk7u84LGpEW6NFal6HqNWx42K3v71_6C3deGFW3Vg&oe=687982F8",
    },
  ];
  return (
    <section>
      <Group
        pt={16}
        px={16}
        pb={10}
        justify="space-between"
        wrap="nowrap"
      >
        <Text>Featured</Text>

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
        px={16}
        slideSize={{ base: "12rem", sm: "14rem" }}
        slideGap="md"
        withIndicators={false}
      >
        {uniforms.map((item, index) => (
          <Carousel.Slide
            key={index}
            mt={7}
            mb={7}
          >
            <Card
              className="transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer"
              component={Link}
              to={`/products/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              shadow="sm"
              padding="sm"
              radius="md"
              withBorder
            >
              <Card.Section className="rounded-t-md overflow-hidden">
                <Image
                  src={item.image}
                  height={180}
                  fit="contain"
                  alt={item.title}
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
                  {item.title}
                </Text>

                <Text
                  fz="xs"
                  c="dimmed"
                  className="line-clamp-2"
                >
                  {item.desc}
                </Text>

                <Text fw={600}>{item.price}</Text>

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
