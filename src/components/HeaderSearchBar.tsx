import {
  ActionIcon,
  Button,
  CloseButton,
  Drawer,
  Group,
  Input,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useFilters } from "@/hooks/useFilters";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface HeaderSearch {
  name?: string;
}

export default function HeaderSearchBar() {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);

  const [filter, setFilterValue] = useFilters<HeaderSearch>({
    name: undefined,
  });

  const handleSearch = () => {
    if (filter.name && filter.name.trim()) {
      navigate(`/products?name=${encodeURIComponent(filter.name.trim())}`);
      setSearchOpen(false);
    }
  };

  // Auto-search for desktop
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filter.name && filter.name.trim()) {
        navigate(`/products?name=${encodeURIComponent(filter.name.trim())}`);
      } else if (filter.name === "") {
        navigate("/products");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
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
            placeholder="Search products"
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
          <div className="flex items-center justify-center h-full pointer-events-auto">
            {filter.name ? (
              <CloseButton
                radius="xl"
                onClick={() => {
                  setFilterValue("name", "");
                  handleSearch();
                }}
              />
            ) : (
              <ActionIcon
                variant="subtle"
                onClick={() => handleSearch()}
                radius="xl"
              >
                <IconSearch
                  size={20}
                  strokeWidth={2.5}
                />
              </ActionIcon>
            )}
          </div>
        }
        rightSectionWidth={36}
        radius="xl"
        placeholder="Search products"
        value={filter.name || ""}
        onChange={(e) => setFilterValue("name", e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
    </>
  );
}
