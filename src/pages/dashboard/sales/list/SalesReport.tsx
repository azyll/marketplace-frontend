import { Button, Group, Menu } from "@mantine/core"
import { IconDownload, IconFileTypePdf, IconFileTypeXls } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { notifications } from "@mantine/notifications"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { getSalesReport } from "@/services/report.service"
import { IPaginatedSalesResponse } from "@/types/sales.type"

type SalesResponse = IPaginatedSalesResponse

interface SalesReportRow {
  issuanceCode: string
  orderDate: string
  studentNumber: string
  studentName: string
  product: string
  quantity: number
  srp: number
  total: number
  status: string
  invoiceNumber: string
  issuanceDate: string
}

const HEADERS = [
  "Issuance Code",
  "ORDER DATE",
  "STUDENT NUMBER",
  "ISSUED TO",
  "ITEM DESCRIPTION",
  "QTY",
  "SRP",
  "TOTAL",
  "STATUS",
  "INVOICE NO",
  "ISSUANCE DATE",
]

const transformSalesData = (data: SalesResponse): SalesReportRow[] =>
  data.data.flatMap((sale) => {
    const order = sale.order
    if (!order?.orderItems?.length) return []

    return order.orderItems.map((item) => ({
      issuanceCode: sale.id,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      studentNumber: order.studentId?.toString() ?? "",
      studentName: order.student.user.fullName,
      product: item.productVariant?.product?.name || item.productVariant?.name || "N/A",
      quantity: item.quantity,
      srp: item.productVariant?.price || 0,
      total: item.quantity * (item.productVariant?.price || 0),
      status: "ISSUED",
      invoiceNumber: sale.oracleInvoice || "N/A",
      issuanceDate: new Date(sale.createdAt).toLocaleDateString(),
    }))
  })

const useSalesReport = (fromDate?: string, toDate?: string) =>
  useQuery({
    queryKey: ["sales-report", fromDate, toDate],
    queryFn: () => getSalesReport(fromDate, toDate),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

const createExcelFile = (
  rows: SalesReportRow[],
  meta: any,
  dateRange?: { from: string; to: string },
) => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([])

  // Add header information
  XLSX.utils.sheet_add_aoa(ws, [["STI"]], { origin: "A1" })
  XLSX.utils.sheet_add_aoa(ws, [["Summary of Sales Issuance"]], { origin: "A2" })

  // Add date range if provided
  const dateRangeText = dateRange
    ? `${dateRange.from} to ${dateRange.to}`
    : new Date().toLocaleDateString()
  XLSX.utils.sheet_add_aoa(ws, [["For the month", dateRangeText]], { origin: "A3" })

  // Add empty row
  XLSX.utils.sheet_add_aoa(ws, [[]], { origin: "A4" })

  // Add total sales in the top right
  XLSX.utils.sheet_add_aoa(ws, [["SALES PER OR REGISTER", "", meta?.totalSales || 0]], {
    origin: "F5",
  })
  XLSX.utils.sheet_add_aoa(ws, [["SALES"]], { origin: "F6" })

  // Define merged cells
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // A1:C1 - "STI"
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // A2:E2 - "Summary of Sales Issuance"
    { s: { r: 2, c: 1 }, e: { r: 2, c: 4 } }, // B3:E3 - Date range
    { s: { r: 4, c: 5 }, e: { r: 4, c: 6 } }, // F5:G5 - "SALES PER OR REGISTER"
    { s: { r: 5, c: 5 }, e: { r: 5, c: 7 } }, // F6:H6 - "SALES"
  ]

  // Add column headers starting at row 7
  XLSX.utils.sheet_add_aoa(ws, [HEADERS], { origin: "A7" })

  // Add data rows starting at row 8
  const dataRows = rows.map((r) => [
    r.issuanceCode,
    r.orderDate,
    r.studentNumber,
    r.studentName,
    r.product,
    r.quantity,
    r.srp,
    r.total,
    r.status,
    r.invoiceNumber,
    r.issuanceDate,
  ])
  XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A8" })

  // Apply number formatting to SRP (column G) and Total (column H) columns
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
  for (let row = 7; row <= range.e.r; row++) {
    // Start from row 8 (index 7)
    const srpCell = XLSX.utils.encode_cell({ r: row, c: 6 }) // Column G (index 6)
    const totalCell = XLSX.utils.encode_cell({ r: row, c: 7 }) // Column H (index 7)

    if (ws[srpCell]) {
      ws[srpCell].z = "#,##0.00"
    }
    if (ws[totalCell]) {
      ws[totalCell].z = "#,##0.00"
    }
  }

  // Apply number formatting to total sales cell (H5)
  if (ws["H5"]) {
    ws["H5"].z = "#,##0.00"
  }

  // Set column widths
  ws["!cols"] = [
    { wch: 18 }, // Issuance Code
    { wch: 12 }, // Order Date
    { wch: 15 }, // Student Number
    { wch: 20 }, // Student Name
    { wch: 25 }, // Product
    { wch: 8 }, // Quantity
    { wch: 10 }, // SRP
    { wch: 12 }, // Total
    { wch: 10 }, // Status
    { wch: 15 }, // Invoice No
    { wch: 12 }, // Issuance Date
  ]

  XLSX.utils.book_append_sheet(wb, ws, "Sales Report")
  XLSX.writeFile(wb, `sales-report-${new Date().toISOString().split("T")[0]}.xlsx`)
}

const createPDFFile = (
  rows: SalesReportRow[],
  meta: any,
  dateRange?: { from: string; to: string },
) => {
  const doc = new jsPDF("landscape")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18).text("STI Fairview", 14, 15)
  doc.setFontSize(14).text("Summary of Sales Issuance", 14, 23)

  doc.setFont("helvetica", "normal")
  const dateRangeText = dateRange
    ? `${dateRange.from} to ${dateRange.to}`
    : new Date().toLocaleDateString()
  doc.setFontSize(10).text(`For the month: ${dateRangeText}`, 14, 30)

  // Add total sales in top right
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12).text(`Total Sales: PHP ${meta?.totalSales?.toFixed(2) ?? 0}`, 200, 15)

  autoTable(doc, {
    startY: 38,
    head: [HEADERS],
    body: rows.map((r) => [
      r.issuanceCode,
      r.orderDate,
      r.studentNumber,
      r.studentName,
      r.product,
      r.quantity,
      `PHP ${r.srp.toFixed(2)}`,
      `PHP ${r.total.toFixed(2)}`,
      r.status.toUpperCase(),
      r.invoiceNumber,
      r.issuanceDate,
    ]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [66, 66, 66], textColor: 255, fontStyle: "bold" },
  })

  const y = (doc as any).lastAutoTable.finalY + 10
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Total Items: ${meta?.totalItems ?? 0}`, 14, y)

  doc.save(`sales-report-${new Date().toISOString().split("T")[0]}.pdf`)
}

export const SalesReportDownloader = ({
  fromDate,
  toDate,
}: {
  fromDate?: string
  toDate?: string
}) => {
  const { data, isLoading, isError, refetch } = useSalesReport(fromDate, toDate)

  const downloadReport = async (type: "excel" | "pdf") => {
    if (isError) {
      notifications.show({
        title: "Error",
        message: "Failed to load sales data. Click to retry.",
        color: "red",
        onClick: () => refetch(),
      })
      return
    }

    if (!data) {
      notifications.show({ title: "Error", message: "No data available", color: "red" })
      return
    }

    try {
      const rows = transformSalesData(data)
      const dateRange = fromDate && toDate ? { from: fromDate, to: toDate } : undefined

      type === "excel"
        ? createExcelFile(rows, data.meta, dateRange)
        : createPDFFile(rows, data.meta, dateRange)

      notifications.show({
        title: "Success",
        message: `${type.toUpperCase()} file downloaded successfully`,
        color: "green",
      })
    } catch (err) {
      console.error(err)
      notifications.show({
        title: "Error",
        message: `Failed to download ${type.toUpperCase()} file`,
        color: "red",
      })
    }
  }

  return (
    <Group gap="xs">
      <Button
        leftSection={<IconDownload size={16} />}
        onClick={() => downloadReport("excel")}
        disabled={!data}
        variant="light"
      >
        Download Sales (Excel)
      </Button>

      <Button
        leftSection={<IconDownload size={16} />}
        onClick={() => downloadReport("pdf")}
        disabled={!data}
      >
        Download Report (PDF)
      </Button>
    </Group>
  )
}
