
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Register font with a more reliable Google Fonts URL
Font.register({
  family: "Dancing Script",
  src: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap",
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  businessInfo: {
    alignItems: "flex-end",
  },
  businessName: {
    fontSize: 24,
    fontFamily: "Dancing Script",
    marginBottom: 8,
    color: "#2a2a2a",
  },
  businessDetails: {
    fontSize: 10,
    color: "#4A5568",
    textAlign: "right",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2a2a2a",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: "#4A5568",
    width: 120,
  },
  value: {
    fontSize: 11,
    flex: 1,
    color: "#2a2a2a",
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: "#2a2a2a",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
    color: "#1a1a1a",
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "bold",
    width: 120,
    textAlign: "right",
    color: "#1a1a1a",
  },
});

interface BusinessDetails {
  business_name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
}

interface InvoicePDFTemplateProps {
  invoice: {
    invoice_number: string;
    client_name: string;
    issue_date: string;
    due_date: string;
    amount: number;
    status: string;
  };
  businessDetails: BusinessDetails;
}

export const InvoicePDFTemplate = ({
  invoice,
  businessDetails,
}: InvoicePDFTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>INVOICE</Text>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{businessDetails.business_name}</Text>
            <Text style={styles.businessDetails}>{businessDetails.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{businessDetails.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{businessDetails.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Website:</Text>
          <Text style={styles.value}>{businessDetails.website}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Bill to:</Text>
          <Text style={styles.value}>{invoice.client_name}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice Number:</Text>
          <Text style={styles.value}>{invoice.invoice_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Issue Date:</Text>
          <Text style={styles.value}>
            {format(new Date(invoice.issue_date), "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.value}>
            {format(new Date(invoice.due_date), "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{invoice.status}</Text>
        </View>
      </View>

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>${invoice.amount.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

