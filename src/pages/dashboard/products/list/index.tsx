import { ActionIcon, Box, Button, Card, Image, Modal, Space, Text, Title } from "@mantine/core"
import { IconEdit, IconMoodSad, IconPlus, IconRestore, IconTrashX } from "@tabler/icons-react"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"
import { DataTable, DataTableColumn } from "mantine-datatable"
import dayjs from "dayjs"
import { IInventoryFilter, IProduct, IProductListFilters } from "@/types/product.type"
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

export const ProductList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IInventoryFilter>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    all: true,
  })

  const { data: products, isLoading } = useQuery({
    queryKey: [KEY.PRODUCTS, filters],
    queryFn: () => getInventoryProducts(filters),
  })

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
      render: ({ deletedAt }) => (deletedAt ? "Archived" : "Active"),
    },
    {
      // Required yung 'accessor' kaya nilagyan ko nalang ng value kahit wala sa IProduct na type
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: (product) => (
        <div className="flex justify-center gap-4">
          {product.deletedAt ? (
            <ActionIcon
              size="lg"
              color="green"
              variant="light"
              onClick={() => handleOnRestoreProduct(product)}
            >
              <IconRestore size={14} />
            </ActionIcon>
          ) : (
            <>
              <ActionIcon
                size="lg"
                variant="light"
                onClick={() => handleOnEditProduct(product.productSlug)}
              >
                <IconEdit size={14} />
              </ActionIcon>
              <ActionIcon
                size="lg"
                color="red"
                variant="light"
                onClick={() => handleOnDeleteProduct(product)}
              >
                <IconTrashX size={14} />
              </ActionIcon>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <Card>
      {selectedProduct?.type == "archived" ? (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelDeleteProduct()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!deleteMutation.isPending}
        >
          <Title order={5} mb={4}>
            Archive Product
          </Title>

          <Text fz={14}>
            Are you sure you want to delete <b>{selectedProduct?.product?.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelDeleteProduct()}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(selectedProduct?.product?.id ?? "")}
            >
              Archive
            </Button>
          </div>
        </Modal>
      ) : (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelRestoreProduct()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!restoreMutation.isPending}
        >
          <Title order={5} mb={4}>
            Restore Product
          </Title>

          <Text fz={14}>
            Are you sure you want to restore <b>{selectedProduct?.product?.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelRestoreProduct()}
              disabled={restoreMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="green"
              loading={restoreMutation.isPending}
              onClick={() => restoreMutation.mutate(selectedProduct?.product.id ?? "")}
            >
              Restore
            </Button>
          </div>
        </Modal>
      )}

      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Products</h1>

          <Button onClick={() => handleOnCreateProduct()}>
            <IconPlus size={14} /> <Space w={6} /> Add Product
          </Button>
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
