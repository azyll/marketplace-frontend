import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Image,
  Modal,
  Space,
  Text,
  Title,
} from "@mantine/core"
import {
  IconArchive,
  IconEdit,
  IconMoodSad,
  IconPlus,
  IconRestore,
  IconTrashX,
} from "@tabler/icons-react"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { DataTable, DataTableColumn } from "mantine-datatable"
import dayjs from "dayjs"
import {
  IInventoryFilter,
  IInventoryFilterReport,
  IProduct,
  IProductListFilters,
} from "@/types/product.type"
import { useFilters } from "@/hooks/useFilters"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { KEY } from "@/constants/key"
import {
  deleteProduct,
  getInventoryProducts,
  getProductList,
  restoreProduct,
} from "@/services/products.service"
import { getImage } from "@/services/media.service"
import FilterBar from "@/components/FilterBar"
import { ProductFilter } from "@/pages/dashboard/components/ProductFilter"
import { notifications } from "@mantine/notifications"
import { AxiosError } from "axios"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { IUser } from "@/types/user.type"
import { notifyResponseError } from "@/helper/errorNotification"
import { getLoggedInUser } from "@/services/user.service"
import { getProductReport } from "@/services/report.service"
import { ReportDownloader } from "../ReportDownloader"
export default function ProductsTab() {
  const [filters, setFilters, setFilterValues] = useFilters<IInventoryFilterReport>({
    all: true,
  })

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getProductReport(filters),
  })

  const { data: user, isLoading: iseGettingUser } = useQuery({
    queryKey: [KEY.ME],
    queryFn: () => getLoggedInUser(),
    select: (response) => response.data,
  })
  const modulePermission = user?.role.modulePermission.find(
    (modulePermission) => modulePermission.module == "products",
  )
  const havePermissionToEdit =
    user?.role.systemTag === "admin" || modulePermission?.permission === "edit"

  const navigate = useNavigate()

  const handleOnCreateProduct = () => {
    navigate(ROUTES.DASHBOARD.PRODUCTS.ID.replace(":productId", "create"))
  }

  const handleOnEditProduct = (productId: string) => {
    navigate(ROUTES.DASHBOARD.PRODUCTS.ID.replace(":productId", productId))
  }

  const queryClient = useQueryClient()

  const [opened, { open, close }] = useDisclosure(false)

  const [selectedProduct, setSelectedProduct] = useState<{
    product: IProduct
    type: "restore" | "archived"
  }>()

  const handleOnDeleteProduct = (product: IProduct) => {
    if (product) {
      setSelectedProduct({ product: product, type: "archived" })
      open()
    }
  }
  const handleOnRestoreProduct = (product: IProduct) => {
    if (product) {
      setSelectedProduct({ product: product, type: "restore" })
      open()
    }
  }
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCTS] })

      notifications.show({
        title: "Archive Success",
        message: "Successfully Archived Product",
        color: "green",
      })

      close()
      setSelectedProduct(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string | any[] }>) => {
      notifyResponseError(error, "Product", "delete")
    },
  })

  const restoreMutation = useMutation({
    mutationFn: (productId: string) => restoreProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY.PRODUCTS] })

      notifications.show({
        title: "Restore Success",
        message: "Successfully Restore Product",
        color: "green",
      })

      close()
      setSelectedProduct(undefined)
    },
    onError: (error: AxiosError<{ message: string; error: string }>) => {
      notifications.show({
        title: "Restore Failed",
        message: error?.response?.data?.error ?? "Can't Restore Product",
        color: "red",
      })
    },
  })
  const handleOnCancelDeleteProduct = () => {
    if (deleteMutation.isPending || restoreMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectedProduct(undefined)
    }, 200)
  }
  const handleOnCancelRestoreProduct = () => {
    if (deleteMutation.isPending || restoreMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectedProduct(undefined)
    }, 200)
  }
  const columns: DataTableColumn<IProduct>[] = [
    {
      accessor: "name",
      title: "Name",
    },
    {
      accessor: "updatedAt",
      title: "Updated At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM D, YYYY h:mm A") : "-"),
    },
    {
      accessor: "createdAt",
      title: "Created At",
      render: ({ createdAt }) => (createdAt ? dayjs(createdAt).format("MMM D, YYYY h:mm A") : "-"),
    },
    {
      accessor: "deletedAt",
      title: "Status",
      textAlign: "center",
      render: ({ deletedAt }) => (
        <Badge color={deletedAt ? "gray" : "green"} variant="light">
          {deletedAt ? "Archived" : "Active"}
        </Badge>
      ),
    },
  ]

  return (
    <Card>
      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">View Products</h1>
          <ReportDownloader
            data={products?.data ?? []}
            columns={columns}

            filters={filters}
            header={{
              title: "Products Report",
              subtitle: "Products Report",
            }}
            filename="Products Report-report"
            sheetName="Products Report"
            pdfOrientation="portrait"
          />
        </div>

        <ProductFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>

      <Space h={16} />

      <Card.Section px={24} pb={24}>
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
        />
      </Card.Section>
    </Card>
  )
}
