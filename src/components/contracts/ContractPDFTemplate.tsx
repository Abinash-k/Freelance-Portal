
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

// Register a standard font that's available in PDF by default
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "Helvetica",
    },
    {
      src: "Helvetica-Bold",
      fontWeight: "bold",
    },
  ]
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
    fontFamily: "Helvetica",
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  businessInfo: {
    alignItems: "flex-end",
  },
  businessName: {
    fontSize: 24,
    fontFamily: "Helvetica",
    marginBottom: 8,
    color: "#2a2a2a",
  },
  businessDetails: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#4A5568",
    textAlign: "right",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
    color: "#4A5568",
    width: 120,
  },
  value: {
    fontSize: 11,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
    fontWeight: "bold",
    marginRight: 20,
    color: "#1a1a1a",
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: "Helvetica",
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

interface ContractPDFTemplateProps {
  contract: {
    project_name: string;
    client_name: string;
    start_date: string;
    end_date: string;
    value: number;
    status: string;
  };
  businessDetails: BusinessDetails;
}

export const ContractPDFTemplate = ({
  contract,
  businessDetails,
}: ContractPDFTemplateProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>CONTRACT</Text>
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
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>{contract.client_name}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{contract.project_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {format(new Date(contract.start_date), "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>
            {format(new Date(contract.end_date), "MMMM dd, yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{contract.status}</Text>
        </View>
      </View>

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Contract Value:</Text>
        <Text style={styles.totalAmount}>${contract.value.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

