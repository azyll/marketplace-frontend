import { useForm, UseFormReturnType } from "@mantine/form"
import { zod4Resolver } from "mantine-form-zod-resolver"
import { Ref, useImperativeHandle, useMemo } from "react"
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Grid,
  Group,
  Image,
  Pagination,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core"

import { IAnnouncement, ICreateAnnouncementInput } from "@/types/announcement.type"
import { ImageUpload } from "@/components/ImageUpload"
import { createAnnouncementSchema, updateAnnouncementSchema } from "@/schema/announcement.schema"
import { getInventoryProducts, getProductList } from "@/services/products.service"
import { KEY } from "@/constants/key"
import { useFilters } from "@/hooks/useFilters"
import { IInventoryFilter, IProduct, IProductListFilters } from "@/types/product.type"
import { useQuery } from "@tanstack/react-query"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { getImage } from "@/services/media.service"
import { IconMoodSad, IconSelect } from "@tabler/icons-react"
import { ProductFilter } from "../../components/ProductFilter"

export interface AnnouncementDetailsFormRef {
  form: UseFormReturnType<Partial<ICreateAnnouncementInput>>
}

interface Props {
  ref: Ref<AnnouncementDetailsFormRef>
  disabled?: boolean
  announcement?: IAnnouncement
  imageDefaultValue?: string
  initialValues?: Partial<IAnnouncement>
}

export const AnnouncementDetailsForm = ({
  ref,
  disabled,
  announcement,
  initialValues,
  imageDefaultValue,
}: Props) => {
  const isUpdate = useMemo(() => !!announcement, [announcement])
  const form = useForm<Partial<ICreateAnnouncementInput>>({
    initialValues: {
      title: initialValues?.title ?? "",
      message: initialValues?.message ?? undefined,
      productId: initialValues?.productId ?? undefined,
    },
    validate: zod4Resolver(isUpdate ? updateAnnouncementSchema : createAnnouncementSchema),
  })

  useImperativeHandle(
    ref,
    () => ({
      form,
    }),
    [form],
  )
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IInventoryFilter>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    all: false,
  })
  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getInventoryProducts(filters),
  })
  const columns: DataTableColumn<IProduct>[] = [
    {
      accessor: "image",
      title: "Image",
      render: ({ image, name }) => <Image src={getImage(image)} alt={name} h={60} w={60} />,
      width: 100,
    },
    {
      accessor: "name",
      title: "Name",
    },

    {
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: (product) => (
        <div className="flex justify-center gap-4">
          <ActionIcon
            size="lg"
            variant="light"
            onClick={() => form.setFieldValue("productId", product.id)}
            disabled={disabled}
          >
            <IconSelect size={14} />
          </ActionIcon>
        </div>
      ),
    },
  ]
  const selectedProductId = useMemo(() => form.getValues().productId, [form.getValues().productId])
  const selectedProduct = useMemo(() => {
    return products?.data.find((product) => product.id === selectedProductId)
  }, [products?.data, selectedProductId])

  return (
    <div>
      <Title order={4} mb={12}>
        Announcement Carousel Details
      </Title>

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

          <Grid.Col span={6} className="space-y-2">
            <ProductFilter filters={filters} onFilter={setFilterValues} disabled={disabled} />
            <Pagination
              total={Math.ceil((products?.meta.totalItems ?? 0) / (filters.limit ?? DEFAULT_LIMIT))}
              value={filters.page ?? DEFAULT_PAGE}
              onChange={(p) => setFilters("page", p)}
              size="sm"
              disabled={disabled}
            />
            <DataTable
              columns={columns}
              records={products?.data ?? []}
              // State
              fetching={isLoading}
              noRecordsIcon={
                <Box p={4} mb={4}>
                  <IconMoodSad size={36} strokeWidth={1.5} />
                </Box>
              }
              noRecordsText="No products found"
              // Styling
              verticalSpacing="md"
              highlightOnHover
              withTableBorder
              striped
              borderRadius={6}
              minHeight={340}
              // Pagination
            />
          </Grid.Col>

          <Grid.Col span={6} className="space-y-4">
            {/*  Title */}
            <TextInput label="Title" {...form.getInputProps("title")} disabled={disabled} />
            {/*  Message */}
            <Textarea label="Message" {...form.getInputProps("message")} disabled={disabled} />
            {selectedProduct ? (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                  <Image
                    src={getImage(selectedProduct.image)}
                    height={30}
                    className="h-[30rem]"
                    alt={getImage("carousel/default-image.png")}
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500}>{selectedProduct.name}</Text>
                  <Badge color="blue">{selectedProduct.category}</Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  {selectedProduct.description}
                </Text>
              </Card>
            ) : null}
          </Grid.Col>
        </Grid>
      </form>
    </div>
  )
}
