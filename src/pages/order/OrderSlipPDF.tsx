// First, install the required dependencies:
// npm install @react-pdf/renderer

import React from "react"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"
import { IOrderItems } from "@/types/order.type"

// Program title mapping
const programTitles = {
  BSIT: "BSIT / BSCS / BSCPE",
  BSCS: "BSIT / BSCS / BSCPE",
  BSCPE: "BSIT / BSCS / BSCPE",
  "BS IN TOURISM MANAGEMENT": "BS IN TOURISM MANAGEMENT",
  "BS IN BUSINESS ADMINISTRATION MAJOR IN OPERATIONS MANAGEMENT":
    "BS IN BUSINESS ADMINISTRATION MAJOR IN OPERATIONS MANAGEMENT",
  "BA IN COMMUNICATION": "BA IN COMMUNICATION",
  "BS IN HOSPITALITY MANAGEMENT": "BS IN HOSPITALITY MANAGEMENT",
  "SENIOR HIGH SCHOOL": "SENIOR HIGH SCHOOL",
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  address: {
    fontSize: 10,
    marginBottom: 10,
  },
  program: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  orderSlipTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 20,
  },
  studentInfo: {
    marginBottom: 20,
  },
  studentInfoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  studentLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 100,
  },
  studentValue: {
    fontSize: 10,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  itemCell: {
    fontSize: 9,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
    width: "70%",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    width: "30%",
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerSection: {
    width: "45%",
  },
  footerLabel: {
    fontSize: 9,
    marginBottom: 5,
  },
  footerLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 20,
  },
})

interface OrderSlipPDFProps {
  studentName: string
  studentId: number | undefined
  sex: string | undefined
  program: string
  orderItems: IOrderItems[]
  total: number
  orderId: string
  createdAt: string
}

// Main PDF Document Component
const OrderSlipPDF: React.FC<OrderSlipPDFProps> = ({
  studentName,
  studentId,
  sex,
  program,
  orderItems,
  total,
  orderId,
  createdAt,
}) => {
  // Get program title, fallback to the program name itself
  const programTitle = programTitles[program as keyof typeof programTitles] || program

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>STI COLLEGE FAIRVIEW</Text>
          <Text style={styles.address}>#70 Regalado Avenue North Fairview, Quezon City</Text>
          <Text style={styles.program}>{programTitle}</Text>
          <Text style={styles.orderSlipTitle}>UNIFORM ORDER and CLAIM SLIP</Text>
        </View>

        {/* Student Information */}
        <View style={styles.studentInfo}>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentLabel}>STUDENT NAME:</Text>
            <Text style={styles.studentValue}>{studentName}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentLabel}>STUDENT NO:</Text>
            <Text style={styles.studentValue}>{studentId}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentLabel}>Order ID:</Text>
            <Text style={styles.studentValue}>{orderId}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentLabel}>Order Date:</Text>
            <Text style={styles.studentValue}>{createdAt}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: "40%" }]}>ITEM</Text>
          <Text style={[styles.tableHeaderCell, { width: "20%" }]}>PRICE</Text>
          <Text style={[styles.tableHeaderCell, { width: "15%" }]}>SIZE</Text>
          <Text style={[styles.tableHeaderCell, { width: "10%" }]}>QTY</Text>
          <Text style={[styles.tableHeaderCell, { width: "15%" }]}>AMOUNT</Text>
        </View>

        <View style={[styles.itemRow, { backgroundColor: "#f8f8f8", fontWeight: "bold" }]}>
          <Text
            style={[
              styles.itemCell,
              {
                width: "100%",
                textAlign: "left",
                fontWeight: "bold",
                textTransform: "uppercase",
              },
            ]}
          >
            {sex}
          </Text>
        </View>

        {/* Ordered Items */}
        {orderItems.map((item, index) => (
          <View key={item.id || index} style={styles.itemRow}>
            <Text style={[styles.itemCell, { width: "40%", textAlign: "left", paddingLeft: 5 }]}>
              {item.productVariant.product.name}
            </Text>
            <Text style={[styles.itemCell, { width: "20%" }]}>{item.productVariant.price}</Text>
            <Text style={[styles.itemCell, { width: "15%" }]}>
              {item.productVariant.size || "N/A"}
            </Text>
            <Text style={[styles.itemCell, { width: "10%" }]}>{item.quantity || 1}</Text>
            <Text style={[styles.itemCell, { width: "15%" }]}>
              {(item.productVariant.price * (item.quantity || 1)).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL:</Text>
          <Text style={styles.totalValue}>{total}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerSection}>
            <Text style={styles.footerLabel}>O.R. Number and Sales Amount:</Text>
            <Text style={styles.footerLabel}>CASHIER</Text>
          </View>
          <View style={styles.footerSection}>
            <Text style={styles.footerLabel}>Released Items:</Text>
            <Text style={styles.footerLabel}>Proware Specialist</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Function to generate and download PDF
const downloadOrderSlip = async (orderData: OrderSlipPDFProps) => {
  const doc = <OrderSlipPDF {...orderData} />
  const blob = await pdf(doc).toBlob()

  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `uniform-order-and-claim-slip.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export { OrderSlipPDF, downloadOrderSlip }
