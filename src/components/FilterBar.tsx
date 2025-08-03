import { Button, Group } from "@mantine/core";
import { useFilters } from "../hooks/useFilters";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { KEY } from "../constants/key";
import { getProductList } from "../services/products.service";

interface HeroFilterForm {
  category?: string;
}

interface CategoryOption {
  label: string;
  value: string;
}

export default function HeroFilterBar() {
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

  const navigate = useNavigate();

  return (
    <Group
      className="overflow-hidden max-w-[1200px] mx-auto pt-15"
      wrap="wrap"
      justify="space-between"
    >
      <Group
        gap="sm"
        wrap="nowrap"
        className="overflow-auto hide-scrollbar"
        py="sm"
        px={{ base: "sm", xl: "0" }}
      >
        {categoryOptions.map(({ label, value }) => (
          <Button
            key={value}
            className="shrink-0"
            variant={filter.category === value ? "filled" : "outline"}
            radius="xl"
            onClick={() => {
              setFilterValue("category", value);
              navigate(`/products/${value}`);
            }}
          >
            {label}
          </Button>
        ))}
      </Group>
    </Group>
  );
}
