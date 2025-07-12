import { Button, Combobox, Group, Input, Select } from "@mantine/core";
import { useState } from "react";
import { useFilters } from "../../../hooks/useFilters";
import { IconSearch } from "@tabler/icons-react";

interface HeroFilterForm {
  category?: string;
}

interface CategoryOption {
  label: string;
  value: string;
}

export default function FilterBar() {
  const [filter, setFilterValue] = useFilters<HeroFilterForm>({
    category: "all",
  });

  const categoryOptions: CategoryOption[] = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Uniform",
      value: "uniform",
    },
    {
      label: "Proware",
      value: "proware",
    },
    {
      label: "Accessories",
      value: "accessories",
    },
    {
      label: "Stationery",
      value: "stationery",
    },
  ];

  return (
    <Group
      className="overflow-hidden"
      wrap="wrap"
      justify="space-between"
    >
      <Group
        gap="sm"
        wrap="nowrap"
        className="overflow-auto hide-scrollbar"
        p="sm"
      >
        {categoryOptions.map(({ label, value }) => (
          <Button
            className="shrink-0"
            variant={filter.category === value ? "filled" : "outline"}
            radius="xl"
            onClick={() => setFilterValue("category", value)}
          >
            {label}
          </Button>
        ))}
      </Group>
    </Group>
  );
}
