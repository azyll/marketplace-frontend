import { Button, Card, Divider, Space, Text, Title } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form"
import { MultipleVariantFormItem } from "@/pages/dashboard/products/page/MultipleVariantFormItem"
import { ICreateProductVariantInput } from "@/types/product.type"
import { IconPlus } from "@tabler/icons-react"
import { Ref, useImperativeHandle } from "react"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { createProductSchema } from "@/schema/product.schema"

export interface MultipleVariantFormRef {
  form: UseFormReturnType<{ variants: ICreateProductVariantInput[] }>
}

interface Props {
  disabled?: boolean
  ref: Ref<MultipleVariantFormRef>
}

export const MultipleVariantForm = ({ disabled, ref }: Props) => {
  const variantsSchema = createProductSchema.pick({ variants: true })

  const form = useForm<{ variants: ICreateProductVariantInput[] }>({
    initialValues: {
      variants: [
        {
          id: undefined,
          name: "",
          price: 0,
          size: "",
          productAttributeId: "",
          stockQuantity: 0,
        },
      ],
    },
    validate: zod4Resolver(variantsSchema),
  })

  const handleOnAddVariant = () => {
    form.insertListItem("variants", {
      id: undefined,
      name: "",
      price: 0,
      size: "",
      productAttributeId: "",
      stockQuantity: 0,
    })
  }

  const handleOnRemoveVariant = (index: number) => {
    form.removeListItem("variants", index)
  }

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )

  return (
    <Card>
      <Card.Section p={24}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Title order={3}>Multi-Variant Product</Title>
            <Text c="dimmed"> Create multiple variants with their own price and stock.</Text>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleOnAddVariant()} disabled={disabled}>
              <IconPlus size={14} />
              <Space w={4} />
              Add Variant
            </Button>
          </div>
        </div>
      </Card.Section>

      <Card.Section p={0}>
        <Divider />
      </Card.Section>

      <Card.Section>
        <div className="flex flex-col">
          {form.values.variants.map((variant, index) => (
            <div key={index}>
              <MultipleVariantFormItem
                key={index}
                form={form}
                index={index}
                title={`Variant ${index + 1}`}
                onDelete={() => handleOnRemoveVariant(index)}
                disabled={disabled}
              />
              {form.values.variants.length > index + 1 && <Divider />}
            </div>
          ))}
        </div>
      </Card.Section>
    </Card>
  )
}
