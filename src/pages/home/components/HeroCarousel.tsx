import { Carousel } from "@mantine/carousel";
import { Image, Title } from "@mantine/core";
import { getImage } from "@/services/media.service";
import "@/styles/carousel.css";

const images = [
  getImage("carousel-1.png"),
  getImage("carousel-2.png"),
  getImage("carousel-3.png"),
  getImage("carousel-4.png"),
  getImage("carousel-5.png"),
];

export default function HeroCarousel() {
  return (
    <>
      <section className="max-w-[1200px] mx-auto">
        <Title
          px={{ base: 16, xl: 0 }}
          order={2}
        >
          Announcements
        </Title>
      </section>
      <Carousel
        pt={10}
        pb={16}
        controlsOffset={"md"}
        withIndicators
        classNames={{ indicator: "indicator" }}
        slideSize={{ base: "100%", md: "80%" }}
        slideGap="lg"
        emblaOptions={{
          loop: true,
          align: "center",
        }}
      >
        {images.map((src, index) => (
          <Carousel.Slide key={index}>
            <Image
              h={{ base: "250px", md: "550px" }}
              src={src}
              alt={`Slide ${index + 1}`}
              className="md:!rounded-xl"
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    </>
  );
}
