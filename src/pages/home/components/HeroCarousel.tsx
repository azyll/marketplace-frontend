import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import { getImage } from "../../../services/media.service";

const images = [
  getImage("carousel-1.png"),
  getImage("carousel-2.png"),
  getImage("carousel-3.png"),
  getImage("carousel-4.png"),
  getImage("carousel-5.png"),
];

export default function HeroCarousel() {
  return (
    <Carousel
      controlsOffset={"md"}
      withIndicators
      slideSize={{ base: "100%", md: "80%" }}
      slideGap="lg"
      emblaOptions={{
        loop: true,
        align: "center",
      }}
    >
      {" "}
      {images.map((src, index) => (
        <Carousel.Slide key={index}>
          {/* Desktop */}
          <Image
            h="550px"
            src={src}
            alt={`Slide ${index + 1}`}
            radius={"xl"}
            visibleFrom="md"
          />

          {/* Mobile */}
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            radius={0}
            hiddenFrom="md"
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
