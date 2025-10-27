import { ComboboxItem, Grid, OptionsFilter, Select, Textarea, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form"
import { ICreateProductInput } from "@/types/product.type"
import { ImageUpload } from "@/components/ImageUpload"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getPrograms } from "@/services/program.service"
import { PRODUCT_CATEGORY, PRODUCT_TYPE } from "@/constants/product"
import { Ref, useImperativeHandle } from "react"
import { getProductDepartments } from "@/services/product-department.service"
import { createProductSchema } from "@/schema/product.schema"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { STUDENT_LEVEL, STUDENT_LEVEL_LABEL } from "@/constants/student"

export interface ProductDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateProductInput>>
}

interface Props {
  disabled?: boolean
  ref?: Ref<ProductDetailsFormRef>
  imageDefaultValue?: string
}

export const ProductDetailsForm = ({ disabled, ref, imageDefaultValue }: Props) => {
  const { data: departmentOptions, isLoading: isDepartmentLoading } = useQuery({
    queryKey: [KEY.PRODUCT_DEPARTMENTS],
    queryFn: () => getProductDepartments({ all: false, page: 1, limit: 100 }),
    select: (departments) => departments?.map(({ name, id }) => ({ label: name, value: id })),
  })

  const departmentOptionsFilter: OptionsFilter = ({ search }) => {
    if (!departmentOptions) return []

    const filtered = (departmentOptions as ComboboxItem[]).filter((option) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
    )

    filtered.sort((a, b) => a.label.localeCompare(b.label))
    return filtered
  }

  const categoryOptions: ComboboxItem[] = [
    { label: "Uniform", value: PRODUCT_CATEGORY.UNIFORM },
    { label: "Proware", value: PRODUCT_CATEGORY.PROWARE },
    { label: "Fabric", value: PRODUCT_CATEGORY.FABRIC },
  ]

  const typeOptions: ComboboxItem[] = [
    { label: "Upper Wear", value: PRODUCT_TYPE.UPPER_WEAR },
    { label: "Lower Wear", value: PRODUCT_TYPE.LOWER_WEAR },
    { label: "Non-Wearable", value: PRODUCT_TYPE.NON_WEARABLE },
  ]

  const studentLevelOptions: ComboboxItem[] = [
    { label: "All", value: "all" },
    { label: STUDENT_LEVEL_LABEL[STUDENT_LEVEL.SHS], value: STUDENT_LEVEL.SHS },
    { label: STUDENT_LEVEL_LABEL[STUDENT_LEVEL.TERTIARY], value: STUDENT_LEVEL.TERTIARY },
  ]

  const productSchema = createProductSchema.omit({ variants: true })

  const form = useForm<Partial<ICreateProductInput>>({
    initialValues: {
      name: "",
      description: "",
      departmentId: "",
      category: "",
      type: "",
      level: undefined,
    },
    validate: zod4Resolver(productSchema),
  })

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )

  return (
    <form>
      <Grid>
        <Grid.Col span={12}>
          <ImageUpload
            maxFiles={1}
            multiple={false}
            onDrop={(files) => form.setFieldValue("image", files[0])}
            defaultPreview={imageDefaultValue}
            disabled={disabled}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Name */}
          <TextInput label="Name" {...form.getInputProps("name")} disabled={disabled} />
        </Grid.Col>

        <Grid.Col span={12}>
          {/* Description */}
          <Textarea
            label="Description"
            {...form.getInputProps("description")}
            disabled={disabled}
            resize="vertical"
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Program/Department */}
          <Select
            label="Department"
            placeholder="Select Department"
            data={departmentOptions}
            filter={departmentOptionsFilter}
            nothingFoundMessage="Department Not Found."
            searchable
            disabled={disabled || isDepartmentLoading}
            {...form.getInputProps("departmentId")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Student Level */}
          <Select
            label="Student Level"
            placeholder="Select Student Level"
            data={studentLevelOptions}
            disabled={disabled}
            {...form.getInputProps("level")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Type*/}
          <Select
            label="Type"
            placeholder="Select Type"
            data={typeOptions}
            disabled={disabled}
            {...form.getInputProps("type")}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          {/* Category*/}
          <Select
            label="Category"
            placeholder="Select Category"
            data={categoryOptions}
            disabled={disabled}
            {...form.getInputProps("category")}
          />
        </Grid.Col>
      </Grid>
    </form>
  )
}
