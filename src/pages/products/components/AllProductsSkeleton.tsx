import { Grid } from "@mantine/core";
import CardSkeleton from "../../../components/ProductCardSkeleton";

export default function AllProductsSkeleton() {
  return (
    <>
      <Grid>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid.Col
            key={index}
            span={{ base: 12, sm: 6, md: 3 }}
          >
            <CardSkeleton />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}
