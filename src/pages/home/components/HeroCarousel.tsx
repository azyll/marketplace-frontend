import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";

const images = [
  "https://scontent.fmnl17-6.fna.fbcdn.net/v/t39.30808-6/455110486_906797941471130_6958720075491337208_n.png?stp=dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=Gc4QL9LwedgQ7kNvwHg8-XH&_nc_oc=AdkbRtMaxuzWL8o3rI3iFsnGb_i8oC3HctNrrWcugeh4Tvp0nWSbwXnhCYCEGopYthU&_nc_zt=23&_nc_ht=scontent.fmnl17-6.fna&_nc_gid=i2sXbwKz7qHdzsI-sUkaqA&oh=00_AfTSYEeiDictrl4NkLEWP6zDVfGnNEAh-ZTQNOrNx9B14w&oe=688E7EA6https://scontent.fmnl17-6.fna.fbcdn.net/v/t39.30808-6/455110486_906797941471130_6958720075491337208_n.png?stp=dst-jpg_tt6&_nc_cat=109&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=Gc4QL9LwedgQ7kNvwHg8-XH&_nc_oc=AdkbRtMaxuzWL8o3rI3iFsnGb_i8oC3HctNrrWcugeh4Tvp0nWSbwXnhCYCEGopYthU&_nc_zt=23&_nc_ht=scontent.fmnl17-6.fna&_nc_gid=i2sXbwKz7qHdzsI-sUkaqA&oh=00_AfTSYEeiDictrl4NkLEWP6zDVfGnNEAh-ZTQNOrNx9B14w&oe=688E7EA6",
  "https://pageone.ph/wp-content/uploads/2023/07/20230713-PAGEONE-STI-1068x601.jpg",
  "https://pageone.ph/wp-content/uploads/2023/07/20230713-PAGEONE-STI-1068x601.jpg",
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
