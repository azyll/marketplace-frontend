import { ActionIcon, Button, Drawer, Group, Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useFilters } from "@/hooks/useFilters";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface HeaderSearch {
  name?: string;
}

export default function HeaderSearchBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [filter, setFilterValue] = useFilters<HeaderSearch>({
    name: undefined,
  });

  // Handle search action (for mobile)
  const handleSearch = () => {
    if (filter.name && filter.name.trim()) {
      navigate(`/products?name=${encodeURIComponent(filter.name.trim())}`);
      setSearchOpen(false);
    }
  };

  // Auto-search for desktop
  useEffect(() => {
    if (filter.name) {
      const timeoutId = setTimeout(() => {
        navigate(`/products?name=${encodeURIComponent(filter.name!)}`);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [filter.name, navigate]);

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
          gap="xs"
        >
          <Input
            placeholder="Search Products"
            value={filter.name || ""}
            onChange={(value) => setFilterValue("name", value.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            radius="xl"
            flex={1}
          />

          <ActionIcon
            variant="light"
            radius="xl"
            size="lg"
            onClick={handleSearch}
          >
            <IconSearch size={16} />
          </ActionIcon>

          <Button
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => setSearchOpen(false)}
          >
            Cancel
          </Button>
        </Group>
      </Drawer>

      {/* Search Bar for desktop */}
      <Input
        w={{ base: 160, xs: 100, sm: 200 }}
        flex={1}
        visibleFrom="sm"
        rightSection={
          <ActionIcon
            variant="subtle"
            onClick={handleSearch}
          >
            <IconSearch size={14} />
          </ActionIcon>
        }
        radius="xl"
        placeholder="Search Products"
        value={filter.name || ""}
        onChange={(value) => setFilterValue("name", value.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
    </>
  );
}
