import { useForm, UseFormReturnType } from "@mantine/form"
import { Ref, useEffect, useImperativeHandle } from "react"
import { StudentDetailsFormRef } from "@/pages/dashboard/user/page/StudentDetailsForm"
import { ICreateStudentInput } from "@/types/student.type"
import { Card, Grid, NumberInput, Text, TextInput, Title } from "@mantine/core"
import { ICreateProductVariantInput, IProductAttribute } from "@/types/product.type"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getProductAttributes } from "@/services/product-attribute.service"
import { createProductSchema } from "@/schema/product.schema"
import { zod4Resolver } from "mantine-form-zod-resolver"

export interface SingleVariantFormRef {
  form: UseFormReturnType<{ variants: ICreateProductVariantInput[] }>
}

interface Props {
  ref: Ref<SingleVariantFormRef>
  disabled?: boolean
}

export const SingleVariantForm = ({ ref, disabled }: Props) => {
  const { data: naAttribute, isLoading: isAttributesLoading } = useQuery({
    queryKey: [KEY.PRODUCT_ATTRIBUTES],
    queryFn: () => getProductAttributes(),
    select: (attributes: IProductAttribute[]) => attributes.find(({ name }) => name === "N/A"),
  })

  const variantsSchema = createProductSchema.pick({ variants: true })

  const form = useForm<{ variants: ICreateProductVariantInput[] }>({
    initialValues: {
      variants: [
        {
          name: "N/A",
          price: 0,
          size: "N/A",
          productAttributeId: naAttribute?.id ?? "N/A",
          stockAvailable: 0,
        },
      ],
    },
    validate: zod4Resolver(variantsSchema),
  })

  useEffect(() => {
    if (naAttribute?.id) {
      form.setFieldValue(`variants.0.productAttributeId`, naAttribute?.id)
    }
  }, [naAttribute])

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
        <div className="flex items-center justify-between gap-4">
          <div>
            <Title order={3}>Simple Product</Title>
            <Text c="dimmed">One product with a fixed price and stock.</Text>
          </div>

          <div className="flex gap-2"></div>
        </div>
      </Card.Section>

      <Card.Section px={24} pb={24}>
        <form>
          <Grid>
            <Grid.Col span={6}>
              {/* Price */}
              <NumberInput
                label="Price"
                prefix="₱"
                thousandSeparator=","
                disabled={disabled}
                {...form.getInputProps(`variants.0.price`)}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              {/* Stock */}
              <NumberInput
                label="Stock"
                disabled={disabled}
                {...form.getInputProps("variants.0.stockAvailable")}
              />
            </Grid.Col>
          </Grid>
        </form>
      </Card.Section>
    </Card>
  )
}
