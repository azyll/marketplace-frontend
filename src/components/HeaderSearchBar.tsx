import { ActionIcon, Button, Drawer, Group, Input } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useFilters } from "../hooks/useFilters";
import { useState } from "react";

interface HeaderSearch {
  search?: string;
}
export default function HeaderSearchBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilterValue] = useFilters<HeaderSearch>({
    search: undefined,
  });

  return (
    <>
      {/* Search for mobile only */}
      <ActionIcon
        variant="subtle"
        hiddenFrom="sm"
        onClick={() => {
          setSearchOpen(true);
        }}
      >
        <IconSearch />
      </ActionIcon>

      <Drawer
        opened={searchOpen}
        onClose={() => setSearchOpen(false)}
        position="top"
        size="100%"
        padding="md"
        withCloseButton={false}
      >
        <Group
          justify="space-between"
          mb="md"
          wrap="nowrap"
        >
          <Input
            placeholder="Search Products"
            value={filter.search}
            onChange={(value) => setFilterValue("search", value.target.value)}
            radius="xl"
            flex={1}
            rightSection={
              <ActionIcon
                variant="light"
                radius={"xl"}
                onClick={() => console.log("Search for:", filter)}
              >
                <IconSearch size={14} />
              </ActionIcon>
            }
          />

          <Button
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => setSearchOpen(false)}
          >
            Cancel
          </Button>
        </Group>
        <b>{filter.search}</b>
      </Drawer>

      {/* Search Bar for desktop */}
      <Input
        w={{ base: 160, xs: 100, sm: 200 }}
        flex={1}
        visibleFrom="sm"
        rightSection={<IconSearch size={14} />}
        // mr="sm"
        radius="xl"
        placeholder="Search Products"
        value={filter.search}
        onChange={(value) => setFilterValue("search", value.target.value)}
      />
    </>
  );
}
