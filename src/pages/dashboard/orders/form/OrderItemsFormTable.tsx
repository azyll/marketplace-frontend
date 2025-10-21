import { ActionIcon, Box, Button, Card, Image, Pagination, Space, Title } from "@mantine/core"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { IconEdit, IconMoodSad, IconPlus } from "@tabler/icons-react"
import { IProduct, IProductListFilters, IProductVariant } from "@/types/product.type"
import { getImage } from "@/services/media.service"
import { ProductFilter } from "@/pages/dashboard/components/ProductFilter"
import { useFilters } from "@/hooks/useFilters"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getProductList } from "@/services/products.service"

interface Props {
  onProductSelect: (product: IProduct) => void
  disabled?: boolean
}

export const OrderItemsFormTable = ({ onProductSelect, disabled }: Props) => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IProductListFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getProductList(filters),
  })

  const handleOnAddToCard = (product: IProduct) => {
    onProductSelect(product)
  }

  const displayPriceRange = (variants: IProductVariant[]) => {
    if (!variants?.length) return "N/A"

    const prices = variants.map((v) => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)

    return min === max ? `₱${min}` : `₱${min} - ₱${max}`
  }

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
      accessor: "price",
      title: "Price",
      render: (product) => displayPriceRange(product?.productVariant ?? []),
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
            onClick={() => handleOnAddToCard(product)}
            disabled={disabled}
          >
            <IconPlus size={14} />
          </ActionIcon>
        </div>
      ),
    },
  ]

  return (
    <Card radius="md">
      <Card.Section px={24} pt={10}>
        <ProductFilter filters={filters} onFilter={setFilterValues} disabled={disabled} />
      </Card.Section>

      <Space h={16} />

      <Card.Section px={24} pb={24}>
        <div className="mb-2 flex items-end justify-between">
          <p className="text-sm text-neutral-500">
            {/*{products?.meta.totalItems ?? 0} Total Products*/}
          </p>

          <Pagination
            total={Math.ceil((products?.meta.totalItems ?? 0) / (filters.limit ?? DEFAULT_LIMIT))}
            value={filters.page ?? DEFAULT_PAGE}
            onChange={(p) => setFilters("page", p)}
            size="sm"
            disabled={disabled}
          />
        </div>
        <div>
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
            // totalRecords={products?.meta.totalItems ?? 0}
            // recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
            // page={filters.page ?? DEFAULT_PAGE}
            // onPageChange={(p) => setFilters("page", p)}
          />
        </div>
        <div className="mt-2 flex justify-end">
          <Pagination
            total={Math.ceil((products?.meta.totalItems ?? 0) / (filters.limit ?? DEFAULT_LIMIT))}
            value={filters.page ?? DEFAULT_PAGE}
            onChange={(p) => setFilters("page", p)}
            size="sm"
            disabled={disabled}
          />
        </div>
      </Card.Section>
    </Card>
  )
}
