import { ActionIcon, Box, Card, Image, Space, Badge, Text, Flex } from "@mantine/core"
import { IconEdit, IconMoodSad, IconChevronRight } from "@tabler/icons-react"
import { DataTable, DataTableColumn } from "mantine-datatable"
import dayjs from "dayjs"
import { useState, useMemo } from "react"
import { IProductVariant, IProductListFilters, IProduct } from "@/types/product.type"
import { useFilters } from "@/hooks/useFilters"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import {
  getInventoryAlerts,
  getInventoryProducts,
  getInventoryValue,
} from "@/services/products.service"
import { getImage } from "@/services/media.service"
import { ProductFilter } from "@/pages/dashboard/components/ProductFilter"
import { stockConditionColor } from "@/constants/stock"
import { LogsCard } from "../../components/LogsCard"
import { useDisclosure } from "@mantine/hooks"
import { EditStockModal } from "./EditStockModal"
import { AlertsCard } from "./AlertsCard"

export const InventoryList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IProductListFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedVariantId, setSelectedVariantId] = useState<string>()

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getInventoryProducts(filters),
  })

  const { data: inventoryValues } = useQuery({
    queryKey: [KEY.PRODUCTS, "inventory-values"],
    queryFn: () => getInventoryValue(),
  })

  const { data: alertsData, isLoading: isAlertsLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, "inventory-alerts"],
    queryFn: () => getInventoryAlerts(),
    select: (response) => response.data,
  })

  // Create a lookup map for variant values
  const variantValueMap = useMemo(() => {
    const map = new Map<string, number>()

    if (inventoryValues?.data?.data) {
      inventoryValues.data.data.forEach((product: any) => {
        product.variants?.forEach((variant: any) => {
          // Create a unique key using product name and variant size
          const key = `${product.productName}-${variant.size}`
          // Parse the total value (remove ₱ and commas)
          const totalValue = parseFloat(variant.total.replace(/[₱,]/g, ""))
          map.set(key, totalValue)
        })
      })
    }

    return map
  }, [inventoryValues])

  // Create a lookup map for product total values
  const productValueMap = useMemo(() => {
    const map = new Map<string, number>()

    if (inventoryValues?.data?.data) {
      inventoryValues.data.data.forEach((product: any) => {
        map.set(product.productName, product.totalValue)
      })
    }

    return map
  }, [inventoryValues])

  const handleOnEditProduct = (productVariantId: string) => {
    console.log("Opening modal for variant:", productVariantId)
    setSelectedVariantId(productVariantId)
    open()
  }

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
    // {
    //   accessor: "category",
    //   title: "Category",
    //   render: ({ category }) => <Badge variant="light">{category}</Badge>,
    // },
    // {
    //   accessor: "department.name",
    //   title: "Department",
    //   render: ({ department }) => department?.name || "-",
    // },
    {
      accessor: "productVariant",
      title: "Variants",
      textAlign: "center",
      render: ({ productVariant }) => productVariant?.length || 0,
    },
    {
      accessor: "totalValue",
      title: "≈ Total Value",
      textAlign: "left",
      render: ({ name }) => {
        const totalValue = productValueMap.get(name)
        return totalValue
          ? `₱ ${totalValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "-"
      },
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
      width: 100,
    },
    {
      accessor: "stockValue",
      title: "≈ Stock Value",
      textAlign: "right",
      render: (variant) => {
        // Get the parent product name from the record
        const productName = products?.data?.find((p) =>
          p.productVariant?.some((v) => v.id === variant.id),
        )?.name

        if (!productName) return "-"

        const key = `${productName}-${variant.size}`
        const stockValue = variantValueMap.get(key)

        return stockValue
          ? `₱ ${stockValue.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "-"
      },
    },
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
      render: (variant) => (
        <ActionIcon size="lg" variant="light" onClick={() => handleOnEditProduct(variant.id)}>
          <IconEdit size={14} />
        </ActionIcon>
      ),
    },
  ]

  return (
    <>
      {selectedVariantId && (
        <EditStockModal opened={opened} onClose={close} variantId={selectedVariantId} />
      )}

      {/* Alerts */}
      <Flex gap={16}>
        <AlertsCard
          title="Low Stock"
          data={alertsData?.[1]}
          isLoading={isAlertsLoading}
          description="Items with less than 20 stock"
        />

        <AlertsCard
          title="No Stock"
          data={alertsData?.[0]}
          isLoading={isAlertsLoading}
          description="Items with no stock left"
        />
        <AlertsCard
          title="In Stock"
          data={alertsData?.[2]}
          isLoading={isAlertsLoading}
          description="Items with enough stock"
        />
      </Flex>
      <Space h={16} />

      {/* Activity Logs */}
      <Card style={{ flex: "1 1 calc(50% - 0.75rem)" }}>
        <Card.Section px={24} pt={24} pb={12}>
          <h1 className="text-xl font-bold">Inventory Activity</h1>
        </Card.Section>

        <LogsCard type="inventory" />
      </Card>

      <Space h={16} />

      {/* Table */}
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
            fetching={isLoading}
            noRecordsIcon={
              <Box p={4} mb={4}>
                <IconMoodSad size={36} strokeWidth={1.5} />
              </Box>
            }
            noRecordsText="No products found"
            verticalSpacing="md"
            highlightOnHover
            withTableBorder
            striped
            borderRadius={6}
            minHeight={340}
            totalRecords={products?.meta?.totalItems ?? 0}
            recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
            page={filters.page ?? DEFAULT_PAGE}
            onPageChange={(p) => setFilters("page", p)}
            rowExpansion={{
              allowMultiple: true,
              expanded: {
                recordIds: expandedRecordIds,
                onRecordIdsChange: setExpandedRecordIds,
              },
              content: ({ record }) => (
                <Box className="bg-gray-50">
                  <DataTable
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
