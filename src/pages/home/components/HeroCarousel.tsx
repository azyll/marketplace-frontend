import { Carousel } from "@mantine/carousel"
import { Image, Title, Loader, Center, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { getAnnouncements } from "@/services/announcement.service"
import { getImage } from "@/services/media.service"
import "@/styles/carousel.css"

export default function HeroCarousel() {
  const {
    data: announcements,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: () => getAnnouncements({ all: true, status: "active" }),
    select: (response) => response.data,
  })

  if (isLoading)
    return (
      <Center py="xl">
        <Loader />
      </Center>
    )

  if (isError)
    return (
      <Center py="xl">
        <Text c="red">Failed to load announcements.</Text>
      </Center>
    )

  if (!announcements || announcements.length === 0) return null

  return (
    <>
      <section className="mx-auto max-w-[1200px]">
        <Title pt="sm" px={{ base: 16, xl: 0 }} order={2}>
          Announcements
        </Title>
      </section>

      <Carousel
        pt={10}
        pb={16}
        controlsOffset="md"
        withIndicators
        classNames={{
          indicator: "indicator",
          slide: "mx-auto max-w-[1200px]",
        }}
        slideGap="lg"
        emblaOptions={{
          loop: true,
          align: "center",
        }}
      >
        {announcements.map((item) => (
          <Carousel.Slide key={item.id}>
            <Image
              src={getImage(item.image)}
              alt={`Announcement ${item.id}`}
              className="md:!rounded-xl"
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </>
  )
}
