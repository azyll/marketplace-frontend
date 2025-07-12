import { useState } from "react";

export function useFilters<T>(
  intialData: T
): [T, (field: keyof T, value: any) => void] {
  const [value, _setValue] = useState<T>(intialData);

  const setValue = (field: keyof T, value: any) => {
    _setValue((prevValue) => {
      return {
        ...prevValue,
        [field]: value,
      };
    });
  };

  return [value, setValue];
}
