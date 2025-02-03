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
        <View>
          <Text style={styles.title}>CONTRACT</Text>
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
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>{contract.client_name}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{contract.project_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>
            {format(new Date(contract.start_date), "MM/dd/yyyy")}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>
            {format(new Date(contract.end_date), "MM/dd/yyyy")}
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
