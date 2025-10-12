import {
  ActionIcon,
  Button,
  Card,
  Grid,
  NumberInput,
  Select,
  Space,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form"
import { Ref, useEffect, useState } from "react"
import { ICreateProductVariantInput, IProductAttribute } from "@/types/product.type"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getProductAttributes } from "@/services/product-attribute.service"
import { IconTrashX } from "@tabler/icons-react"

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
            <TextInput
              label="Name"
              {...form.getInputProps(`variants.${index}.name`)}
              disabled={disabled}
            />
          </Grid.Col>

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
              label="Size"
              {...form.getInputProps(`variants.${index}.size`)}
              disabled={disabled}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            {/* Price */}
            <NumberInput
              label="Price"
              prefix="₱"
              thousandSeparator=","
              disabled={disabled}
              {...form.getInputProps(`variants.${index}.price`)}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            {/* Stock */}
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
