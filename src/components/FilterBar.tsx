import { Button, Group } from "@mantine/core";
import { PRODUCT_CATEGORY } from "@/constants/product";
import { useEffect, useState } from "react";

interface CategoryOption {
  label: string;
  value: string;
}

interface Props {
  value?: string;
  onSelect: (category: string) => void;
}

export default function FilterBar({ onSelect, value }: Props) {
  const [category, setCategory] = useState<string | undefined>(
    PRODUCT_CATEGORY.ALL
  );

  const categoryOptions: CategoryOption[] = [
    { label: "All", value: PRODUCT_CATEGORY.ALL },
    { label: "Uniform", value: PRODUCT_CATEGORY.UNIFORM },
    { label: "Proware", value: PRODUCT_CATEGORY.PROWARE },
    { label: "Accessory", value: PRODUCT_CATEGORY.ACCESSORY },
    { label: "Stationery", value: PRODUCT_CATEGORY.STATIONERY },
  ];

  const handleOnClick = (category: string) => {
    setCategory(category);

    onSelect(category);
  };

  useEffect(() => {
    if (category !== value) {
      setCategory(value);
    }
  }, [value]);

  return (
    <Group
      gap="sm"
      wrap="nowrap"
      className="overflow-x-auto hide-scrollbar"
      p={{ base: 4 }}
    >
      {categoryOptions.map(({ label, value }) => (
        <Button
          key={value}
          className="shrink-0"
          variant={category === value ? "filled" : "outline"}
          radius="xl"
          onClick={() => handleOnClick(value)}
        >
          {label}
        </Button>
      ))}
    </Group>
  );
}
