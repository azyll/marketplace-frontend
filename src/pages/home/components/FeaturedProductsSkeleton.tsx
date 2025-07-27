import { Card, Group, Skeleton, Stack, Text } from "@mantine/core";

export const FeaturedProductSkeleton = () => {
  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
    >
      {/* Image Skeleton */}
      <Card.Section className="rounded-t-md overflow-hidden">
        <Skeleton
          height={265}
          width="100%"
        />
      </Card.Section>

      <Stack
        gap={6}
        mt="xs"
      >
        {/* Product name */}
        <Skeleton
          height={12}
          width="50%"
          p="sm"
        />

        {/* Description lines */}
        <Skeleton
          height={10}
          width="100%"
        />

        {/* Price */}
        <Skeleton
          height={20}
          width="40%"
        />

        {/* Category */}
        <Skeleton
          height={10}
          width="30%"
        />
      </Stack>
    </Card>
  );
};
