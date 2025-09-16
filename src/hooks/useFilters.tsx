import { useState } from "react"

export function useFilters<T>(
  initialData: T,
): [T, (field: keyof T, value: any) => void, (obj: Partial<T>) => void] {
  const [value, _setValue] = useState<T>(initialData)

  const setValue = (field: keyof T, value: any) => {
    _setValue((prevValue) => {
      return {
        ...prevValue,
        [field]: value,
      }
    })
  }

  const setValues = (obj: Partial<T>) => {
    if (typeof obj === "object" && !Array.isArray(obj)) {
      _setValue((prevValue) => {
        return {
          ...prevValue,
          ...obj,
        }
      })
    }
  }

  return [value, setValue, setValues]
}
