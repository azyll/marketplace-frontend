import { Group, Button, ActionIcon, Input } from "@mantine/core";
import {
  IconShoppingBag,
  IconBell,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { useFilters } from "../hooks/useFilters";
import { useMediaQuery } from "@mantine/hooks";

interface HeaderSearch {
  search?: string;
}

export default function AppHeader() {
  const [filter, setFilterValue] = useFilters<HeaderSearch>({
    search: undefined,
  });

  const isDesktop = useMediaQuery("(min-width: 30rem)");

  return (
    <nav className="">
      <Group
        justify="space-between"
        className="px-4 md:px-6"
      >
        <img
          src="src\assets\logo.png"
          alt=""
          width={56}
        />

        <b className="hidden md:block">STI Marketplace</b>

        <Group gap="sm">
          {/* <ActionIcon
            variant="subtle"
            hiddenFrom="sm"
          >
            <IconSearch />
          </ActionIcon> */}

          <Input
            // w={{ xs: 200, sm: 2 }}
            className="w-22 sm:w-50"
            rightSection={<IconSearch size={14} />}
            // mr="sm"
            radius="xl"
            placeholder="Search Products"
            value={filter.search}
            onChange={(value) => setFilterValue("search", value.target.value)}
          />

          <ActionIcon variant="subtle">
            <IconShoppingBag />
          </ActionIcon>

          <ActionIcon variant="subtle">
            <IconBell />
          </ActionIcon>

          {/* pano ioorganize to? */}
          <Button
            variant="light"
            visibleFrom="md"
          >
            Sign in
          </Button>
          <ActionIcon
            variant="subtle"
            hiddenFrom="md"
          >
            <IconUser />
          </ActionIcon>
        </Group>
      </Group>
    </nav>
  );
}
