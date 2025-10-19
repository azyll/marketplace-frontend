import { Card, Group, Image, Skeleton, Stack, Text } from "@mantine/core";

export default function CartItemSkeleton() {
  return (
    <div className="flex-start">
      <Card
        withBorder
        radius="md"
        padding="md"
      >
        <Group
          align="flex-start"
          gap="md"
        >
          {/* Left side (image) */}
          <Skeleton
            w={80}
            h={80}
            radius="md"
          />

          {/* Right side (text skeletons) */}
          <Stack
            gap={8}
            style={{ flex: 1 }}
          >
            <Skeleton
              height={20}
              radius="sm"
              width="35%"
            />
            <Skeleton
              height={16}
              radius="sm"
              width="30%"
            />
            <Skeleton
              height={8}
              radius="sm"
              width="35%"
            />
            <Skeleton
              height={8}
              radius="sm"
              width="25%"
            />
          </Stack>
        </Group>
      </Card>
    </div>
  );
}
