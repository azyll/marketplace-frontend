import { ActionIcon, Box, Card, Image, Space, Badge } from "@mantine/core"
import { IconEdit, IconMoodSad, IconChevronDown, IconChevronRight } from "@tabler/icons-react"
import { DataTable, DataTableColumn } from "mantine-datatable"
import dayjs from "dayjs"
import { useState } from "react"
import { IProductVariant, IProductListFilters, IProduct } from "@/types/product.type"
import { useFilters } from "@/hooks/useFilters"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getInventoryProducts } from "@/services/products.service"
import { getImage } from "@/services/media.service"
import { ProductFilter } from "@/pages/dashboard/components/ProductFilter"
import { stockConditionColor } from "@/constants/stock"
import { LogsCard } from "../../components/LogsCard"

export const InventoryList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IProductListFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getInventoryProducts(filters),
  })

  const handleOnEditProduct = (productId: string) => {}

  const isRowExpanded = (productId: string) => expandedRecordIds.includes(productId)

  const productColumns: DataTableColumn<IProduct>[] = [
    {
      accessor: "expand",
      title: "",
      width: 50,
      render: ({ id }) => (
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box
            style={{
              transform: isRowExpanded(id) ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconChevronRight size={16} />
          </Box>
        </Box>
      ),
    },
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
      accessor: "category",
      title: "Category",
      render: ({ category }) => <Badge variant="light">{category}</Badge>,
    },
    {
      accessor: "department.name",
      title: "Department",
      render: ({ department }) => department?.name || "-",
    },
    {
      accessor: "productVariant",
      title: "Variants",
      textAlign: "center",
      render: ({ productVariant }) => productVariant?.length || 0,
    },
    {
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ updatedAt }) => (updatedAt ? dayjs(updatedAt).format("MMM DD, YYYY") : "-"),
    },
  ]

  const variantColumns: DataTableColumn<IProductVariant>[] = [
    {
      accessor: "name",
      title: "Variant",
    },
    {
      accessor: "size",
      title: "Size",
    },
    {
      accessor: "price",
      title: "Price",
      render: ({ price }) => `₱${price?.toFixed(2) || "0.00"}`,
    },
    {
      accessor: "stockQuantity",
      title: "Total Stock",
      textAlign: "center",
    },
    // {
    //   accessor: "stockAvailable",
    //   title: "Available",
    //   textAlign: "center",
    // },
    // {
    //   accessor: "stockReserved",
    //   title: "Reserved",
    //   textAlign: "center",
    // },
    {
      accessor: "stockCondition",
      title: "Status",
      textAlign: "center",
      render: ({ stockCondition }) => (
        <Badge color={stockConditionColor[stockCondition]}>{stockCondition}</Badge>
      ),
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 100,
      textAlign: "center",
      render: (product) => (
        <ActionIcon
          size="lg"
          variant="light"
          onClick={() => {
            handleOnEditProduct(product.productId)
          }}
        >
          <IconEdit size={14} />
        </ActionIcon>
      ),
    },
  ]

  return (
    <>
      <Card style={{ flex: "1 1 calc(50% - 0.75rem)" }} withBorder>
        <Card.Section px={24} pt={24} pb={12}>
          <h1 className="text-xl font-bold">Inventory Activity</h1>
        </Card.Section>

        <LogsCard type="inventory" />
      </Card>

      <Space h={16} />
      <Card>
        <Card.Section px={24} pt={24}>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Manage Inventory</h1>
          </div>

          <ProductFilter filters={filters} onFilter={setFilterValues} />
        </Card.Section>

        <Space h={16} />

        <Card.Section px={24} pb={24}>
          <DataTable
            columns={productColumns}
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
            totalRecords={products?.meta?.totalItems ?? 0}
            recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
            page={filters.page ?? DEFAULT_PAGE}
            onPageChange={(p) => setFilters("page", p)}
            // Controlled row expansion
            rowExpansion={{
              allowMultiple: true,
              expanded: {
                recordIds: expandedRecordIds,
                onRecordIdsChange: setExpandedRecordIds,
              },
              content: ({ record }) => (
                <Box p="sm" className="bg-gray-50">
                  <DataTable
                    mx={45}
                    columns={variantColumns}
                    records={record.productVariant ?? []}
                    noRecordsText="No variants available"
                    withTableBorder={false}
                    withColumnBorders
                    striped
                    highlightOnHover
                  />
                </Box>
              ),
            }}
          />
        </Card.Section>
      </Card>
    </>
  )
}
