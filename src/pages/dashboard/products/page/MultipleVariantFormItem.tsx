import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Menu,
  NumberInput,
  Select,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form"
import { useEffect, useState } from "react"
import { ICreateProductVariantInput, IProductAttribute } from "@/types/product.type"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getProductAttributes } from "@/services/product-attribute.service"
import { IconCheck, IconSelector, IconTrashX } from "@tabler/icons-react"

// your constant
export const PRODUCT_SIZE = {
  "Extra Small": "XS",
  Small: "S",
  Medium: "M",
  Large: "L",
  "Extra Large": "XL",
  "2 Extra Large": "2XL",
  "3 Extra Large": "3XL",
  "4 Extra Large": "4XL",
  "5 Extra Large": "5XL",
}

interface Props {
  disabled?: boolean
  title?: string
  form: UseFormReturnType<{ variants: ICreateProductVariantInput[] }>
  index: number
  onDelete: () => void
}

export const MultipleVariantFormItem = ({ title, disabled, form, index, onDelete }: Props) => {
  const { data: attributeOptions, isLoading: isAttributesLoading } = useQuery({
    queryKey: [KEY.PRODUCT_ATTRIBUTES],
    queryFn: () => getProductAttributes(),
    select: (attributes: IProductAttribute[]) =>
      attributes
        .filter(({ name }) => name !== "N/A")
        .map(({ id, name }) => ({ label: name, value: id })),
  })

  const [productName, setProductName] = useState<string>()

  useEffect(() => {
    if (!productName) {
      setProductName(form.values.variants[index].name)
    }
  }, [form.values.variants[index].name])

  form.watch(`variants.${index}.name`, (name) => {
    setProductName(name.value === "" ? undefined : name.value)
  })

  return (
    <Card className={` ${index % 2 && "!bg-[#f2f5f9]/50"}`} pb={46} pt={28} px={24}>
      <div className="mb-2 flex items-center justify-between gap-4">
        <Title order={4}>
          {title} {productName ? `(${productName})` : ""}
        </Title>

        {index !== 0 && (
          <Button variant="outline" color="red" onClick={() => onDelete()}>
            <IconTrashX size={16} /> <Space w={4} /> Remove
          </Button>
        )}
      </div>

      <form>
        <Grid>
          <Grid.Col span={4}>
            <Select
              label="Attribute"
              {...form.getInputProps(`variants.${index}.productAttributeId`)}
              disabled={disabled || isAttributesLoading}
              data={attributeOptions}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <TextInput
              label="Name"
              {...form.getInputProps(`variants.${index}.name`)}
              disabled={disabled}
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <Menu trapFocus={false} position="bottom-start" withinPortal width="target">
              <Menu.Target>
                <div className="w-full">
                  <TextInput
                    autoComplete="off"
                    label="Size"
                    disabled={disabled}
                    {...form.getInputProps(`variants.${index}.size`)}
                    rightSection={<IconSelector size={16} stroke={1.5} />}
                  />
                </div>
              </Menu.Target>

              <Menu.Dropdown className="w-[var(--menu-target-width)]">
                {Object.keys(PRODUCT_SIZE).map((label) => {
                  const isSelected = form.values.variants[index].size === label

                  return (
                    <Menu.Item
                      key={label}
                      onClick={() => form.setFieldValue(`variants.${index}.size`, label)}
                      leftSection={
                        isSelected ? <IconCheck size={14} stroke={4} color="gray" /> : null
                      }
                    >
                      {label}
                    </Menu.Item>
                  )
                })}
              </Menu.Dropdown>
            </Menu>
          </Grid.Col>

          <Grid.Col span={6}>
            <NumberInput
              label="Price"
              prefix="₱"
              thousandSeparator=","
              disabled={disabled}
              {...form.getInputProps(`variants.${index}.price`)}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <NumberInput
              label="Stock"
              disabled={disabled}
              {...form.getInputProps(`variants.${index}.stockQuantity`)}
            />
          </Grid.Col>
        </Grid>
      </form>
    </Card>
  )
}
