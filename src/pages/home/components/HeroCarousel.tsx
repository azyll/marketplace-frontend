import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";

const images = [
  "https://pageone.ph/wp-content/uploads/2023/07/20230713-PAGEONE-STI-1068x601.jpg",
  "https://pageone.ph/wp-content/uploads/2023/07/20230713-PAGEONE-STI-1068x601.jpg",
  "https://pageone.ph/wp-content/uploads/2023/07/20230713-PAGEONE-STI-1068x601.jpg",
];

export default function HeroCarousel() {
  return (
    <Carousel
      controlsOffset={25}
      withIndicators
      slideSize={{ base: "93%", md: "80%" }}
      slideGap="lg"
      emblaOptions={{
        loop: true,
        align: "center",
      }}
    >
      {" "}
      {images.map((src, index) => (
        <Carousel.Slide key={index}>
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            radius="xl"
          />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
