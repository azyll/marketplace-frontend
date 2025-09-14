import { ActionIcon, Box, Button, Card, Image, Space } from "@mantine/core"
import { IconEdit, IconMoodSad, IconPlus, IconTrashX } from "@tabler/icons-react"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { DataTable, DataTableColumn } from "mantine-datatable"
import dayjs from "dayjs"
import { IProduct, IProductListFilters } from "@/types/product.type"
import { useFilters } from "@/hooks/useFilters"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import { getProductList } from "@/services/products.service"
import { getImage } from "@/services/media.service"
import FilterBar from "@/components/FilterBar"
import { ProductFilter } from "@/pages/dashboard/products/list/ProductFilter"

export const ProductList = () => {
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

  const navigate = useNavigate()

  const handleOnCreateProduct = () => {
    navigate(ROUTES.DASHBOARD.PRODUCTS.ID.replace(":productId", "create"))
  }

  const handleOnEditProduct = (productId: string) => {
    navigate(ROUTES.DASHBOARD.PRODUCTS.ID.replace(":productId", productId))
  }

  const handleOnDeleteProduct = (userId: string) => {}

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
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM DD, YYYY") : "-"),
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM DD, YYYY") : "-"),
    },
    {
      // Required yung 'accessor' kaya nilagyan ko nalang ng value kahit wala sa IProduct na type
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: ({ id }) => (
        <div className="flex justify-center gap-4">
          <ActionIcon size="lg" variant="light" onClick={() => handleOnEditProduct(id)}>
            <IconEdit size={14} />
          </ActionIcon>

          <ActionIcon
            size="lg"
            color="red"
            variant="light"
            onClick={() => handleOnDeleteProduct(id)}
          >
            <IconTrashX size={14} />
          </ActionIcon>
        </div>
      ),
    },
  ]

  return (
    <Card>
      <Card.Section px={16} pt={16}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Products</h1>

          <Button onClick={() => handleOnCreateProduct()}>
            <IconPlus size={14} /> <Space w={6} /> Add Product
          </Button>
        </div>

        <ProductFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>

      <Card.Section p={16}>
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
          minHeight={220}
          // Pagination
          totalRecords={products?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
