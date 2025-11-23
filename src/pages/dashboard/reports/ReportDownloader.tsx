import { Button, Group } from "@mantine/core"
import { IconDownload } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications"
import { DataTableColumn } from "mantine-datatable"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Types
interface ExportColumnConfig {
  exportHeader?: string // Override header for export
  exportWidth?: number // Override width for export
  exportFormat?: (value: any, row: any) => string | number // Custom format for export
  excelFormat?: string // e.g., "#,##0.00" for numbers
  exclude?: boolean // Exclude this column from export
}

type DataTableColumnWithExport<T> = DataTableColumn<T> & ExportColumnConfig

interface HeaderConfig {
  title: string
  subtitle?: string
  dateRangeLabel?: string
  dateRange?: { from: string; to: string }
  additionalInfo?: Array<{ label: string; value: string | number }>
}

interface ReportDownloaderProps<T = any> {
  data: T[]
  columns: DataTableColumnWithExport<T>[]
  header: HeaderConfig
  filename?: string
  loading?: boolean
  error?: boolean
  onRetry?: () => void
  sheetName?: string
  pdfOrientation?: "portrait" | "landscape"
}

// Utility Functions
const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}
const extractValueFromColumn = <T,>(
  row: T,
  column: DataTableColumnWithExport<T>,
): string | number => {
  // If custom export format is provided, use it
  if (column.exportFormat) {
    return column.exportFormat(getNestedValue(row, column.accessor as string), row)
  }

  // If render function exists, use it to get the display value
  if (column.render) {
    const rendered = column.render(row, 0) // Pass row and index (0 as placeholder)

    // Handle React elements or complex objects from render
    if (rendered === null || rendered === undefined) return "N/A"
    if (typeof rendered === "string" || typeof rendered === "number") return rendered
    if (typeof rendered === "boolean") return rendered ? "Yes" : "No"

    // For React elements or complex objects, try to extract text content
    // This is a simplified extraction - you might need more sophisticated logic
    if (typeof rendered === "object" && "props" in rendered) {
      // Try to extract children if it's a React element
      const children = rendered.props?.children
      if (typeof children === "string" || typeof children === "number") return children
      if (children === null || children === undefined) return "N/A"
    }

    // Fallback to string conversion
    return String(rendered)
  }

  // Get the raw value from the accessor as fallback
  const value = getNestedValue(row, column.accessor as string)

  // Handle null/undefined
  if (value === null || value === undefined) return "N/A"

  // Handle different types
  if (typeof value === "number") return value
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (value instanceof Date) return value.toLocaleDateString()

  return String(value)
}

const createExcelFile = <T,>(
  data: T[],
  columns: DataTableColumnWithExport<T>[],
  header: HeaderConfig,
  filename: string,
  sheetName: string,
) => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([])

  // Filter out excluded columns
  const exportColumns = columns.filter((col) => !col.exclude)

  let currentRow = 0

  // Add header information
  XLSX.utils.sheet_add_aoa(ws, [[header.title]], { origin: `A${currentRow + 1}` })
  ws["!merges"] = ws["!merges"] || []
  ws["!merges"].push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 2 } })
  currentRow++

  if (header.subtitle) {
    XLSX.utils.sheet_add_aoa(ws, [[header.subtitle]], { origin: `A${currentRow + 1}` })
    ws["!merges"].push({ s: { r: currentRow, c: 0 }, e: { r: currentRow, c: 4 } })
    currentRow++
  }

  // Add date range
  if (header.dateRange) {
    const dateRangeText = `${header.dateRange.from} to ${header.dateRange.to}`
    const label = header.dateRangeLabel || "Period"
    XLSX.utils.sheet_add_aoa(ws, [[label, dateRangeText]], { origin: `A${currentRow + 1}` })
    ws["!merges"].push({ s: { r: currentRow, c: 1 }, e: { r: currentRow, c: 4 } })
    currentRow++
  }

  // Add additional info in top right
  if (header.additionalInfo && header.additionalInfo.length > 0) {
    currentRow++ // Empty row
    header.additionalInfo.forEach((info) => {
      XLSX.utils.sheet_add_aoa(ws, [[info.label, "", info.value]], {
        origin: `F${currentRow + 1}`,
      })
      ws["!merges"].push({ s: { r: currentRow, c: 5 }, e: { r: currentRow, c: 6 } })
      currentRow++
    })
    currentRow-- // Adjust back
  }

  currentRow += 2 // Empty row before table

  // Add column headers
  const headers = exportColumns.map((col) => col.exportHeader || col.title || col.accessor)
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: `A${currentRow + 1}` })
  currentRow++

  // Add data rows
  const dataRows = data.map((row) => exportColumns.map((col) => extractValueFromColumn(row, col)))
  XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: `A${currentRow + 1}` })

  // Apply number formatting to specified columns
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
  exportColumns.forEach((col, colIndex) => {
    if (col.excelFormat) {
      for (let row = currentRow; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex })
        if (ws[cellAddress]) {
          ws[cellAddress].z = col.excelFormat
        }
      }
    }
  })

  // Set column widths
  ws["!cols"] = exportColumns.map((col) => ({
    wch: col.exportWidth || (col.width ? col.width / 10 : 15),
  }))

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

const createPDFFile = <T,>(
  data: T[],
  columns: DataTableColumnWithExport<T>[],
  header: HeaderConfig,
  filename: string,
  orientation: "portrait" | "landscape",
) => {
  const doc = new jsPDF(orientation)

  // Filter out excluded columns
  const exportColumns = columns.filter((col) => !col.exclude)

  let yPos = 15

  // Add header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18).text(header.title, 14, yPos)
  yPos += 8

  if (header.subtitle) {
    doc.setFontSize(14).text(header.subtitle, 14, yPos)
    yPos += 7
  }

  // Add date range
  doc.setFont("helvetica", "normal")
  if (header.dateRange) {
    const dateRangeText = `${header.dateRangeLabel || "Period"}: ${header.dateRange.from} to ${header.dateRange.to}`
    doc.setFontSize(10).text(dateRangeText, 14, yPos)
    yPos += 7
  }

  // Add additional info in top right
  if (header.additionalInfo && header.additionalInfo.length > 0) {
    const rightX = orientation === "landscape" ? 200 : 140
    let rightY = 15
    doc.setFont("helvetica", "bold")
    header.additionalInfo.forEach((info) => {
      doc.setFontSize(12).text(`${info.label}: ${info.value}`, rightX, rightY)
      rightY += 7
    })
  }

  yPos += 5

  // Create table
  const headers = exportColumns.map((col) => col.exportHeader || col.title || col.accessor)
  const body = data.map((row) =>
    exportColumns.map((col) => String(extractValueFromColumn(row, col))),
  )

  // Calculate column widths dynamically based on orientation
  const pageWidth = orientation === "landscape" ? 280 : 190
  const margin = 14
  const availableWidth = pageWidth - margin * 2

  // Calculate proportional widths
  const totalExportWidth = exportColumns.reduce((sum, col) => {
    return sum + (col.exportWidth || (col.width ? col.width / 10 : 15))
  }, 0)

  const columnStyles = exportColumns.reduce(
    (acc, col, idx) => {
      const exportWidth = col.exportWidth || (col.width ? col.width / 10 : 15)
      // Calculate proportional width based on available space
      const proportionalWidth = (exportWidth / totalExportWidth) * availableWidth
      acc[idx] = {
        cellWidth: proportionalWidth,
        halign:
          col.textAlign === "center" ? "center" : col.textAlign === "right" ? "right" : "left",
      }
      return acc
    },
    {} as Record<number, any>,
  )

  autoTable(doc, {
    startY: yPos,
    head: [headers],
    body,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
      valign: "middle",
    },
    bodyStyles: {
      valign: "top",
    },
    columnStyles,
    tableWidth: availableWidth,
    margin: { left: margin, right: margin },
  })

  doc.save(`${filename}.pdf`)
}

// Main Component
export function ReportDownloader<T = any>({
  data,
  columns,
  header,
  filename = `report-${new Date().toISOString().split("T")[0]}`,
  loading = false,
  error = false,
  onRetry,
  sheetName = "Report",
  pdfOrientation = "landscape",
}: ReportDownloaderProps<T>) {
  const downloadReport = async (type: "excel" | "pdf") => {
    if (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load data. Click to retry.",
        color: "red",
        onClick: onRetry,
      })
      return
    }

    if (!data || data.length === 0) {
      notifications.show({
        title: "Error",
        message: "No data available to download",
        color: "red",
      })
      return
    }

    try {
      if (type === "excel") {
        createExcelFile(data, columns, header, filename, sheetName)
      } else {
        createPDFFile(data, columns, header, filename, pdfOrientation)
      }

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
        disabled={loading || !data || data.length === 0}
        variant="light"
      >
        Download Excel
      </Button>

      <Button
        leftSection={<IconDownload size={16} />}
        onClick={() => downloadReport("pdf")}
        disabled={loading || !data || data.length === 0}
      >
        Download PDF
      </Button>
    </Group>
  )
}
