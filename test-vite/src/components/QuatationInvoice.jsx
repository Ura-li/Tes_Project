import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import React from "react";

Font.register({
  family: "Helvetice",
  fonts: [{ src: "https://fonts.gstatic.com/s/helvetica/Helvetica.ttf" }],
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    gap: 3,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxWidth: "600px",
    margin: "auto",
    flexDirection: "column",
  },

  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
  },

  textSmall: {
    fontSize: 9,
  },

  textCenter: {
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1hr)",
  },

  bold: {
    fontWeight: "bold",
  },

  qrCode: {
    width: 45,
    height: 45,
  },

  logo: {
    width: 45,
    height: 45,
  },

  leftSection: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 2,
  },

  righSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  righSection2: {
    flex: 1,
    flexDirection: "center",
    justifyContent: "center",
  },

  label: {
    width: "30%",
    fontSize: 9,
  },

  label2: {
    width: "20%",
    fontSize: 9,
  },

  value: {
    width: "68%",
    fontSize: 3,
  },

  colon: {
    width: "2%",
    fontSize: 2,
  },

  value2: {
    width: "80%",
    fontSize: 9,
  },

  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },

  tableRow: {
    flexDirection: "row",
  },

  tableHeader: {
    backgroundColor: "#e5e7eb",
  },

  TableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderButtomWidth: 1,
    borderColor: "#ccc",
    padding: 2,
    fontSize: 7,
  },

  tableHeaderCell: {
    flex: 1,
    borderRightWidth: 1,
    borderButtomWidth: 1,
    borderColor: "#ccc",
    padding: 2,
    fontSize: 7,
    textAlign: "center",
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },

  sectionContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginVertical: 10,
    paddingTop: 12,
    position: 12,
    position: "relative",
  },

  sectionTitle: {
    position: "absolute",
    top: -8,
    left: 10,
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "white",
    paddingHorizontal: 4,
  },

  sectionContent: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
});

const Section = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export const QuatationInvoice = ({ caseDetails, customerSignature }) => (
  <Document>
    <Page style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          marginBottom: 4,
          padding: 3,
        }}
      >
        <Image src="/hp.png" style={[styles.logo, { padding: 2 }]} />
        <View>
          <Text style={styles.sectionHeader}>PT.JAVA ABADI GEMILANG</Text>
          <Text style={styles.textSmall}>
            Prudential Centre Kota Casablanka Lt. 5 Unit C- E, Jl. Casablanca
          </Text>
          <Text style={styles.textSmall}>Kav.88</Text>
          <Text style={styles.textSmall}>
            Jakarta Selatan, 12870, Indonesia
          </Text>
          <Text style={styles.textSmall}>
            Telp : (+6221) 081318521007 / 081318521006 - HP : 0811970666
          </Text>
        </View>
        <Text style={[styles.sectionHeader]}>QUOTATION / PROFORMA INVOICE</Text>
      </View>

      <Section title="Case Info">
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={styles.leftSection}>
            <Text style={styles.label}>Case Type</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>{caseDetails?.CaseType ?? "N/A"}</Text>

            <Text style={styles.label}>Warranty Status</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.WarrantyOTCCode?.Description ??
                "N/A"}
            </Text>

            <Text style={styles.label}>Received Date</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.CreatedOn
                ? new Date(caseDetails.CreatedOn).toLocaleDateString()
                : "N/A"}
            </Text>

            <Text style={styles.label}>Problem Desc</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.ProblemDescription ?? "N/A"}
            </Text>

            <Text style={styles.label}>Note</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.CaseProductNote ?? "N/A"}
            </Text>
          </View>

          <View style={styles.rightSection}>
            <Text style={[styles.textSmall, styles.bold]}>
              {caseDetails?.CaseID ?? "N/A"}
            </Text>
            <Image src="/random_qr.png" style={styles.qrCode} />
          </View>
        </View>
      </Section>

      <Section title="Customer">
        {/* <Text style={[styles.textSmall, { fontWeight: 'bold', marginTop: 20 }]}>Customer</Text> */}
        <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
          <View style={styles.leftSection}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account?.Company ?? "N/A"}
            </Text>

            <Text style={styles.label}>Name</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.FirstName ||
              caseDetails?.contact_information?.LastName
                ? `${caseDetails?.contact_information?.FirstName || ""} ${
                    caseDetails?.contact_information?.LastName || ""
                  }`.trim()
                : "N/A"}
            </Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.Email ?? "N/A"
                : caseDetails?.contact_information?.Email ?? "N/A"}
            </Text>

            <Text style={styles.label}>PIC name</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.FirstName ||
              caseDetails?.contact_information?.LastName
                ? `${caseDetails?.contact_information?.FirstName || ""} ${
                    caseDetails?.contact_information?.LastName || ""
                  }`.trim()
                : "N/A"}
            </Text>

            <Text style={styles.label}>PIC email</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Email ?? "N/A"}
            </Text>

            <Text style={styles.label}>Address</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.AddressLine1 ?? "N/A"
                : caseDetails?.contact_information?.AddressLine1 ?? "N/A"}
            </Text>
          </View>
          <View style={styles.rightSection2}>
            <Text style={styles.label}>Phone no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.PrimaryPhone ?? "N/A"
                : caseDetails?.contact_information?.Phone ?? "N/A"}
            </Text>

            <Text style={styles.label}>Mobile no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.site_account
                ? caseDetails?.site_account?.WhatsappNo ?? "N/A"
                : caseDetails?.contact_information?.Mobile ?? "N/A"}
            </Text>

            <Text style={styles.label}>Fax no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Fax ?? "N/A"}
            </Text>

            <Text style={styles.label}>PIC phone no.</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Phone ?? "N/A"}
            </Text>

            <Text style={styles.label}>PIC mobile no.</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.Mobile ?? "N/A"}
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Product">
        {/* <Text style={[styles.textSmall, { fontWeight: 'bold', marginTop: 20 }]}>Product</Text> */}
        <View style={{ display: "flex", flexDirection: "row", columnGap: 5 }}>
          <View style={styles.leftSection}>
            <Text style={styles.label}>Serial no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.SerialNumber ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product no</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.ProductNumber ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product name</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information
                ?.ProductName ?? "N/A"}
            </Text>
          </View>

          <View style={styles.rightSection2}>
            <Text style={styles.label}>Product tower</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information?.product_type
                ?.ProductTower ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product group</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information?.product_type
                ?.ProductGroup ?? "N/A"}
            </Text>

            <Text style={styles.label}>Product type</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.asset_information?.product_information?.product_type
                ?.ProductType ?? "N/A"}
            </Text>
          </View>
        </View>
      </Section>
      
    </Page>
  </Document>
);
