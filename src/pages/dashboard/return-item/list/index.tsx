import { KEY } from "@/constants/key"
import { useFilters } from "@/hooks/useFilters"
import { deleteReturnItem, getReturnItems } from "@/services/return-item.service"
import { IGetReturnItemFilters, IReturnItem } from "@/types/return-item.type"
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Modal,
  Space,
  Text,
  Title,
  Tooltip,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconArchive, IconEdit, IconMoodSad } from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Axios from "axios"
import dayjs from "dayjs"
import { DataTable, DataTableColumn } from "mantine-datatable"
import { useState } from "react"
import { useNavigate } from "react-router"
import { ReturnItemFilter } from "./ReturnItemFilter"
import { EditReturnItemQuantity } from "./EditReturnItemQuantityModal"

export const ReturnItemList = () => {
  const DEFAULT_PAGE = 1
  const DEFAULT_LIMIT = 10

  const [filters, setFilters, setFilterValues] = useFilters<IGetReturnItemFilters>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  })

  const { data: returnItems, isLoading } = useQuery({
    queryKey: [KEY.RETURN_ITEMS, filters],
    queryFn: async () => await getReturnItems(filters),
  })

  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const [returnItemForDeletion, setReturnItemForDeletion] = useState<IReturnItem>()
  const [selectReturnItem, setSelectReturnItem] = useState<IReturnItem>()
  const queryClient = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: async (returnItemId: string) => {
      await deleteReturnItem(returnItemId)
    },
    onSuccess: async () => {
      notifications.show({
        title: "Archive Success",
        message: "Successfully archive return item",
        color: "green",
      })

      close()

      await queryClient.invalidateQueries({ queryKey: [KEY.RETURN_ITEMS] })
      setReturnItemForDeletion(undefined)
    },
    onError: (error) => {
      if (Axios.isAxiosError(error)) {
        notifications.show({
          title: "Archive Failed",
          message: error.response?.data.error?.[0]?.message ?? error.response?.data.error,
          color: "red",
        })
      }
    },
  })

  const handleOnSelectReturnItem = (returnItemId: string) => {
    const returnItem = returnItems?.data?.find(({ id }) => id === returnItemId)

    if (returnItem) {
      setSelectReturnItem(returnItem)
      open()
    }
  }

  const handleOnCancelSelectReturnItem = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setSelectReturnItem(undefined)
    }, 200)
  }
  const handleOnDeleteReturnItem = (returnItemId: string) => {
    const returnItem = returnItems?.data?.find(({ id }) => id === returnItemId)

    if (returnItem) {
      setReturnItemForDeletion(returnItem)
      open()
    }
  }
  const handleOnCancelDeleteReturnItem = () => {
    if (deleteMutation.isPending) return

    close()
    setTimeout(() => {
      setReturnItemForDeletion(undefined)
    }, 200)
  }

  const columns: DataTableColumn<IReturnItem>[] = [
    {
      accessor: "productVariant.product.name",
      title: "Name",
    },
    {
      accessor: "productVariant",
      title: "Variant",
      render: ({ productVariant }) => `${productVariant.name} ${productVariant.size}`,
    },
    {
      accessor: "quantity",
      title: "Quantity",
      render: ({ quantity }) => `${quantity}`,
    },
    {
      accessor: "reason",
      title: "Reason",
      render: ({ reason }) => reason,
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
    {
      accessor: "actions",
      title: "Actions",
      width: 120,
      textAlign: "center",
      render: ({ id, deletedAt }) => (
        <div className="flex justify-center gap-4">
          {deletedAt ? null : (
            <>
              <Tooltip label="Update Return Item Quantity">
                <ActionIcon size="lg" variant="light" onClick={() => handleOnSelectReturnItem(id)}>
                  <IconEdit size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Archive Return item">
                <ActionIcon
                  size="lg"
                  color="red"
                  variant="light"
                  onClick={() => handleOnDeleteReturnItem(id)}
                >
                  <IconArchive size={14} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ]
  return (
    <Card>
      {returnItemForDeletion && (
        <Modal
          opened={opened}
          onClose={() => handleOnCancelDeleteReturnItem()}
          withCloseButton={false}
          centered
          closeOnClickOutside={!deleteMutation.isPending}
        >
          <Title order={5} mb={4}>
            Archive Return item
          </Title>

          <Text fz={14}>
            Are you sure you want to archive{" "}
            <b>{returnItemForDeletion?.productVariant.product.name}</b>?
          </Text>

          <div className="mt-8 flex justify-end gap-2">
            <Button
              variant="light"
              color="black"
              onClick={() => handleOnCancelDeleteReturnItem()}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              color="red"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(returnItemForDeletion?.id ?? "")}
            >
              Archive
            </Button>
          </div>
        </Modal>
      )}
      {selectReturnItem && (
        <EditReturnItemQuantity
          opened={opened}
          onClose={() => handleOnCancelSelectReturnItem()}
          returnItemId={selectReturnItem.id}
          initialQuantity={selectReturnItem.quantity}
        />
      )}
      <Card.Section px={24} pt={24}>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold">Manage Return Item</h1>
        </div>
        <ReturnItemFilter filters={filters} onFilter={setFilterValues} />
      </Card.Section>
      <Space h={16} />
      <Card.Section px={24} pb={24}>
        <DataTable
          columns={columns}
          records={returnItems?.data ?? []}
          // State
          fetching={isLoading}
          noRecordsIcon={
            <Box p={4} mb={4}>
              <IconMoodSad size={36} strokeWidth={1.5} />
            </Box>
          }
          noRecordsText="No return item found"
          // Styling
          verticalSpacing="md"
          highlightOnHover
          withTableBorder
          striped
          borderRadius={6}
          minHeight={220}
          // Pagination
          totalRecords={returnItems?.meta.totalItems ?? 0}
          recordsPerPage={filters.limit ?? DEFAULT_LIMIT}
          page={filters.page ?? DEFAULT_PAGE}
          onPageChange={(p) => setFilters("page", p)}
        />
      </Card.Section>
    </Card>
  )
}
