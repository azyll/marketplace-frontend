import {
  ActionIcon,
  Box,
  Card,
  Image,
  Space,
  Badge,
  Text,
  Flex,
  Group,
  Grid,
  Stack,
  Tooltip,
} from "@mantine/core"
import {
  IconEdit,
  IconMoodSad,
  IconChevronRight,
  IconAlertTriangle,
  IconAlertCircle,
  IconNewSection,
  IconPlus,
  IconTruckReturn,
} from "@tabler/icons-react"
import { DataTable, DataTableColumn } from "mantine-datatable"
import dayjs from "dayjs"
import { useState, useMemo } from "react"
import { IProductVariant, IInventoryFilter, IProduct } from "@/types/product.type"
import { useFilters } from "@/hooks/useFilters"
import { useQuery } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import {
  getInventoryAlerts,
  getInventoryProducts,
  getInventoryValue,
} from "@/services/products.service"
import { getImage } from "@/services/media.service"
import { stockConditionColor, stockConditionLabel } from "@/constants/stock"
import { LogsCard } from "../../components/LogsCard"
import { useDisclosure } from "@mantine/hooks"
import { EditStockModal } from "./EditStockModal"
import { PRODUCT_SIZE } from "@/constants/product"
import { AlertsCard } from "./AlertsCard"
import { InventoryFilter } from "./InventoryFilters"
import { MarkAsReturnItemModal } from "./MarkAsReturnItemModal"
import { getLoggedInUser } from "@/services/user.service"
import { ROUTES } from "@/constants/routes"
import { Navigate, useNavigate } from "react-router"

export const InventoryList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 20

  const [filters, setFilters, setFilterValues] = useFilters<IInventoryFilter>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    all: false,
  })

  const sizeOrder = Object.keys(PRODUCT_SIZE)

  const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([])
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string
    type: "stock-update" | "mark-item-as-return"
    stockQuantity?: number
    name?: string
  }>()

  const { data: user, isLoading: iseGettingUser } = useQuery({
    queryKey: [KEY.ME],
    queryFn: () => getLoggedInUser(),
    select: (response) => response.data,
  })
  const modulePermission = user?.role.modulePermission.find(
    (modulePermission) => modulePermission.module == "inventory",
  )
  const haveInventoryModuleEditPermission =
    user?.role.systemTag === "admin" || modulePermission?.permission === "edit"

  const moduleReturnItem = user?.role.modulePermission.find(
    (modulePermission) => modulePermission.module == "return-items",
  )
  const haveReturnItemModuleEditPermission =
    user?.role.systemTag === "admin" || moduleReturnItem?.permission === "edit"
  const navigate = useNavigate()
  if (!modulePermission && user?.role.systemTag === "employee") {
    navigate(ROUTES.DASHBOARD.PRODUCTS.BASE, {
      replace: true,
    })
  }

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getInventoryProducts(filters),
  })

  const { data: inventoryValues } = useQuery({
    queryKey: [KEY.PRODUCTS, "inventory-values"],
    queryFn: () => getInventoryValue(),
  })

  const { data: inventoryAlertData, isLoading: isAlertsLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, "inventory-alerts"],
    queryFn: () => getInventoryAlerts(),
  })

  // Helper function to get stock status for a product
  const getProductStockStatus = (product: IProduct) => {
    if (!product.productVariant || product.productVariant.length === 0) {
      return { hasNoStock: false, hasLowStock: false }
    }

    const hasNoStock = product.productVariant.some(
      (variant) => variant.stockCondition === "out-of-stock",
    )
    const hasLowStock = product.productVariant.some(
      (variant) => variant.stockCondition === "low-stock",
    )

    return { hasNoStock, hasLowStock }
  }

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

  const handleOnEditProduct = (
    productVariantId: string,
    type: "stock-update" | "mark-item-as-return",
    stockQuantity?: number,
    variantName?: string,
  ) => {
    console.log("Opening modal for variant:", productVariantId)
    setSelectedVariant({
      id: productVariantId,
      type,
      stockQuantity,
      name: variantName,
    })
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
      render: (product) => {
        const { hasNoStock, hasLowStock } = getProductStockStatus(product)

        return (
          <Group gap="xs">
            <Text>{product.name}</Text>
            {hasNoStock && (
              <Badge color="red" variant="filled" size="sm">
                <IconAlertCircle size={12} />
              </Badge>
            )}
            {hasLowStock && (
              <Badge color="orange" variant="filled" size="sm">
                <IconAlertTriangle size={12} />
              </Badge>
            )}
          </Group>
        )
      },
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
      render: ({ updatedAt }) => (updatedAt ? dayjs(updatedAt).format("MMM D, YYYY h:mm A") : "-"),
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
      title: "Stock",
      textAlign: "center",
      width: 100,
    },
    {
      accessor: "stockAvailable",
      title: "Available",
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
        <Badge color={stockConditionColor[stockCondition]}>
          {stockConditionLabel[stockCondition]}
        </Badge>
      ),
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 100,
      textAlign: "center",
      render: (variant) => (
        <div className="space-x-2">
          {haveInventoryModuleEditPermission ? (
            <Tooltip label="Update Stock Quantity">
              <ActionIcon
                size="lg"
                variant="light"
                onClick={() =>
                  handleOnEditProduct(
                    variant.id,
                    "stock-update",
                    variant.stockQuantity,
                    `${variant.name} - ${variant.size}`,
                  )
                }
              >
                <IconEdit size={14} />
              </ActionIcon>
            </Tooltip>
          ) : null}
          {haveReturnItemModuleEditPermission ? (
            <Tooltip label="Mark item as return item">
              <ActionIcon
                size="lg"
                variant="light"
                onClick={() => handleOnEditProduct(variant.id, "mark-item-as-return")}
              >
                <IconTruckReturn size={14} />
              </ActionIcon>
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <>
      {selectedVariant && selectedVariant.type === "stock-update" && (
        <EditStockModal
          opened={opened}
          onClose={close}
          variantId={selectedVariant.id}
          currentStock={selectedVariant.stockQuantity}
          variantName={selectedVariant.name}
        />
      )}
      {selectedVariant && selectedVariant.type === "mark-item-as-return" && (
        <MarkAsReturnItemModal opened={opened} onClose={close} variantId={selectedVariant.id} />
      )}

      <Grid grow gutter="lg" align="stretch">
        <Grid.Col span={5}>
          {/* Alerts */}
          <Stack gap="lg" style={{ height: "100%" }}>
            <AlertsCard
              title="No Stock"
              data={inventoryAlertData?.data?.[0]}
              isLoading={isAlertsLoading || iseGettingUser}
              description="Item needs to be restocked"
            />

            <AlertsCard
              title="Low Stock"
              data={inventoryAlertData?.data?.[1]}
              isLoading={isAlertsLoading || iseGettingUser}
              description="Item has less than 20 stock"
            />

            <AlertsCard
              title="In Stock"
              data={inventoryAlertData?.data?.[2]}
              isLoading={isAlertsLoading || iseGettingUser}
              description="Items have enough stock"
            />
          </Stack>
        </Grid.Col>

        <Grid.Col span={7}>
          {/* Activity Logs */}
          <Card withBorder>
            <Card.Section px={24} pt={24} pb={12}>
              <h1 className="text-xl font-bold">Inventory Activity</h1>
            </Card.Section>

            <LogsCard type="inventory" />
          </Card>
        </Grid.Col>
      </Grid>

      <Space h="lg" />

      {/* Table */}
      <Card>
        <Card.Section px={24} pt={24}>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-bold">Manage Inventory</h1>
          </div>

          <InventoryFilter filters={filters} onFilter={setFilterValues} />
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
                    records={[...(record.productVariant ?? [])].sort((a, b) => {
                      // sort by variant name
                      const nameCompare = a.name.localeCompare(b.name)
                      if (nameCompare !== 0) return nameCompare

                      // sort by size
                      return sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size)
                    })}
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
