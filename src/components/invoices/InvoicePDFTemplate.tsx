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

Font.register({
  family: "Dancing Script",
  src: "https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFF5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  businessName: {
    fontSize: 24,
    fontFamily: "Dancing Script",
    marginBottom: 8,
  },
  businessDetails: {
    fontSize: 10,
    color: "#4A5568",
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  label: {
    fontSize: 10,
    color: "#4A5568",
    flex: 1,
  },
  value: {
    fontSize: 10,
    flex: 2,
  },
  amount: {
    fontSize: 10,
    textAlign: "right",
    width: 80,
  },
  total: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#000",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 20,
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
    width: 80,
    textAlign: "right",
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
        <View>
          <Text style={styles.title}>INVOICE</Text>
        </View>
        <View>
          <Text style={styles.businessName}>{businessDetails.business_name}</Text>
          <Text style={styles.businessDetails}>{businessDetails.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Business Email:</Text>
          <Text style={styles.value}>{businessDetails.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone number:</Text>
          <Text style={styles.value}>{businessDetails.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Website:</Text>
          <Text style={styles.value}>{businessDetails.website}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Bill to:</Text>
          <Text style={styles.value}>{invoice.client_name}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Invoice Number:</Text>
          <Text style={styles.value}>{invoice.invoice_number}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {format(new Date(invoice.issue_date), "MM/dd/yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Due Date:</Text>
          <Text style={styles.value}>
            {format(new Date(invoice.due_date), "MM/dd/yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{invoice.status}</Text>
        </View>
      </View>

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>${invoice.amount.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);