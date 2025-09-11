import { Card, Divider, Flex, Group, Skeleton, Stack } from "@mantine/core"

// Skeleton component for loading state
export function OrderHistorySkeleton() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        {/* Order Header Skeleton */}
        <Flex justify="space-between" align="flex-start">
          <div>
            <Skeleton height={20} width={120} mb="xs" />
            <Skeleton height={14} width={180} />
          </div>
          <Skeleton height={24} width={80} radius="xl" />
        </Flex>

        {/* Order Details Skeleton */}
        <div>
          <Group justify="space-between">
            <div>
              <Skeleton height={12} width={90} mb="xs" />
              <Skeleton height={14} width={200} />
            </div>
            <div>
              <Skeleton height={12} width={70} mb="xs" />
              <Skeleton height={14} width={80} />
            </div>
          </Group>

          <Group justify="space-between" className="mt-2">
            <div>
              <Skeleton height={12} width={80} mb="xs" />
              <Skeleton height={12} width={140} />
            </div>
          </Group>
        </div>

        <Divider />

        {/* Order Footer Skeleton */}
        <Group justify="space-between">
          <div></div>
          <Group gap="xs">
            <Skeleton height={14} width={35} />
            <Skeleton height={20} width={80} />
          </Group>
        </Group>
      </Stack>
    </Card>
  )
}
