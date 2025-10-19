import React from "react"
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer"
import { IOrderItems } from "@/types/order.type"

const programTitles = {
  "Bachelor of Science in Information Technology": "BSIT / BSCS / BSCPE",
  "Bachelor of Science in Computer Science": "BSIT / BSCS / BSCPE",
  "Bachelor of Science in Computer Engineering": "BSIT / BSCS / BSCPE",
  "BS IN TOURISM MANAGEMENT": "BS IN TOURISM MANAGEMENT",
  "BS IN BUSINESS ADMINISTRATION MAJOR IN OPERATIONS MANAGEMENT":
    "BS IN BUSINESS ADMINISTRATION MAJOR IN OPERATIONS MANAGEMENT",
  "BA IN COMMUNICATION": "BA IN COMMUNICATION",
  "BS IN HOSPITALITY MANAGEMENT": "BS IN HOSPITALITY MANAGEMENT",
  "SENIOR HIGH SCHOOL": "SENIOR HIGH SCHOOL",
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  mainBorder: {
    border: "2px solid #000",
    padding: 15,
  },
  header: {
    textAlign: "center",
    marginBottom: 10,
    borderBottom: "2px solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 3,
  },
  address: {
    fontSize: 9,
    marginBottom: 8,
  },
  programBox: {
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
    paddingVertical: 8,
    marginBottom: 5,
  },
  program: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  orderSlipTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: "1px solid #000",
    paddingVertical: 8,
    marginBottom: 15,
  },
  studentInfo: {
    marginBottom: 15,
  },
  studentInfoRow: {
    flexDirection: "row",
    marginBottom: 8,
    borderBottom: "1px solid #000",
    paddingBottom: 5,
  },
  studentLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 120,
  },
  studentValue: {
    fontSize: 10,
    flex: 1,
  },
  table: {
    border: "2px solid #000",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "2px solid #000",
    backgroundColor: "#FFFFFF",
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 8,
    borderRight: "1px solid #000",
  },
  genderRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
  },
  genderCell: {
    fontSize: 10,
    fontWeight: "bold",
    paddingLeft: 5,
    textTransform: "uppercase",
  },
  itemRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    minHeight: 25,
  },
  itemCell: {
    fontSize: 9,
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 3,
    borderRight: "1px solid #000",
    justifyContent: "center",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    border: "2px solid #000",
  },
  footerSection: {
    width: "50%",
    padding: 10,
    borderRight: "1px solid #000",
  },
  footerSectionLast: {
    width: "50%",
    padding: 10,
  },
  footerLabel: {
    fontSize: 9,
    marginBottom: 25,
  },
  footerSignature: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 5,
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
  const programTitle = programTitles[program as keyof typeof programTitles] || program

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mainBorder}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>STI COLLEGE FAIRVIEW</Text>
            <Text style={styles.address}>#70 Regalado Avenue North Fairview, Quezon City</Text>
          </View>

          <View style={styles.programBox}>
            <Text style={styles.program}>{programTitle}</Text>
          </View>

          <View style={styles.orderSlipTitle}>
            <Text>UNIFORM ORDER and CLAIM SLIP</Text>
          </View>

          {/* Student Information */}
          <View style={styles.studentInfo}>
            <View style={styles.studentInfoRow}>
              <Text style={styles.studentLabel}>STUDENT NAME:</Text>
              <Text style={styles.studentValue}>{studentName}</Text>
            </View>
            <View style={styles.studentInfoRow}>
              <Text style={styles.studentLabel}>STUDENT NO:</Text>
              <Text style={styles.studentValue}>{`0${studentId}` || ""}</Text>
            </View>
          </View>

          {/* Table */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "30%" }]}>ITEM</Text>
              <Text style={[styles.tableHeaderCell, { width: "30%" }]}>PRICE</Text>
              <Text style={[styles.tableHeaderCell, { width: "15%" }]}>SIZE</Text>
              <Text style={[styles.tableHeaderCell, { width: "10%" }]}>QTY</Text>
              <Text style={[styles.tableHeaderCell, { width: "15%", borderRight: 0 }]}>AMOUNT</Text>
            </View>

            {/* Gender Row */}
            <View style={styles.genderRow}>
              <Text style={styles.genderCell}>{sex}</Text>
            </View>

            {/* Ordered Items */}
            {orderItems.map((item, index) => (
              <View key={item.id || index} style={styles.itemRow}>
                <Text style={[styles.itemCell, { width: "30%", textAlign: "left" }]}>
                  {item.productVariant.product.name}
                </Text>
                <Text style={[styles.itemCell, { width: "30%" }]}>
                  {item.productVariant.price.toFixed(2)}
                </Text>
                <Text style={[styles.itemCell, { width: "15%" }]}>
                  {item.productVariant.size || "N/A"}
                </Text>
                <Text style={[styles.itemCell, { width: "10%" }]}>{item.quantity || 1}</Text>
                <Text style={[styles.itemCell, { width: "15%", borderRight: 0 }]}>
                  {(item.productVariant.price * (item.quantity || 1)).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerSection}>
              <Text style={styles.footerLabel}>O.R. Number and Sales Amount:</Text>
              <Text style={styles.footerSignature}>CASHIER</Text>
            </View>
            <View style={styles.footerSectionLast}>
              <Text style={styles.footerLabel}>Released Items:</Text>
              <Text style={styles.footerSignature}>Proware Specialist</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Function to generate and download PDF
const downloadOrderSlip = async (orderData: OrderSlipPDFProps) => {
  const blob = await pdf(<OrderSlipPDF {...orderData} />).toBlob()
  const url = URL.createObjectURL(blob)

  window.open(url, "_blank")

  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: `order-slip-${orderData.orderId}.pdf`,
  })
  link.click()
  URL.revokeObjectURL(url)
}

export { OrderSlipPDF, downloadOrderSlip }
