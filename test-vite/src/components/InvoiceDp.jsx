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
import { formatAccountingRupiah } from "../lib/utils";

Font.register({
  family: "Helvetice",
  fonts: [{ src: "https://fonts.gstatic.com/s/helvetica/Helvetica.ttf" }],
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 32,
    gap: 3,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxWidth: '600px',
    margin: 'auto',
    flexDirection: 'column',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 8,
  },
  textCenter: {
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  bold: {
    fontWeight: 'bold',
  },
  qrCode: {
    width: 45,
    height: 45,
  },
  logo: {
    width: 60,
    height: 60,
  },
  
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection2: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 2,
  },
  label: {
    width: '30%', 
    fontSize: 8,
  },
  label2: {
    width: '20%', 
    fontSize: 8,
  },
  value: {
    width: '68%',
    fontSize: 8,
  },
  value1: {
    width: '68%',
    fontSize: 8,
    textAlign: 'justify',
    textIndent: -5,
  },
  colon: {
    width: '2%',
    fontSize: 8,
  },
  value2: {
    width: '80%',
    fontSize: 8,
  },
table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,                     // default equal width (good for 3-col table)
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 2,
    fontSize: 7,
  },
  tableHeaderCell: {
    flex: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 2,
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6', 

  },
  alignRight: { textAlign: 'right' },
  

  /* ===== extra styles ONLY for the 7-column “parts” table ===== */
  partsColNo: { flex: 0.7 },
  partsColVendor: { flex: 1.5 },
  partsColHp: { flex: 1.6 },
  partsColPartName: { flex: 3 },
  partsColQty: { flex: 0.8 },
  partsColUnitPrice: { flex: 1.2 },
  partsColTotalPrice: { flex: 1.2 },

  // flex sums (0.7+1.5+1.6+3+0.8 = 7.6, all cols = 10)
  partsColSpan5: { flex: 8 },  // No + Vendor + HP + Part Name + QTY
  partsColSpan6: { flex: 9.3 },  // above + Unit Price

  alignCenter: {
    textAlign: 'center',
  },
  
  sectionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
    paddingTop: 12, // extra space so the title doesn't overlap content
    position: 'relative',
  },

  sectionTitle: {
    position: 'absolute',
    top: -6, // moves the heading above the border
    left: 10,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'white', // covers the border behind text
    paddingHorizontal: 4,
  },

  sectionContent: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },


});

const Section = ({ title, children }) => (
  <View minPresenceAhead={100} style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const List = ({ items }) => (
  <View>
    {items.map((item, index) => (
      <Text key={index} style={styles.value1}>
        • {item}
      </Text>
    ))}
  </View>
)

export const InvoiceDp = ({
  caseDetails,
  customerSignature,
  materialItems = {},
  initialData = {},
}) => (
  <Document>
    <Page size="A4" style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
          marginBottom: 4,
          padding: 3,
          borderBottom: 1,
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
        {/* <Text style={[styles.sectionHeader]}>INVOICE DP</Text> */}
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 4,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
            borderBottom: 1,
            padding: 2,
            paddingHorizontal: "10%",
            alignItems: "center",
          }}
        >
          <View
            style={[
              styles.leftSection,
              { flexDirection: "column", alignItems: "center" },
            ]}
          >
            <Text style={[styles.textSmall, styles.bold]}>INVOICE</Text>
             <View style={{borderWidth: 2, padding: 2}}>
                <Image src="/random_qr.png" style={styles.qrCode} />
             </View>
          </View>
          <View style={[styles.rightSection2, { alignItems: "center" }]}>
            <Text style={styles.label}>Case ID</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>{caseDetails?.CaseID ?? "N/A"}</Text>

            <Text style={styles.label}>Invoice no.</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value, { fontWeight: "bold", fontSize: 10 }]}>
              {"N55450"}
            </Text>

            <Text style={styles.label}>Date</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.CreatedOn
                ? new Date(caseDetails.CreatedOn).toLocaleString()
                : "N/A"}
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: 5,
            paddingHorizontal: "10%",
            paddingVertical: "2%",
          }}
        >
          <View style={styles.leftSection}>
            <Text style={styles.label}>Received from</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {caseDetails?.contact_information?.FirstName ||
              caseDetails?.contact_information?.LastName
                ? `${caseDetails?.contact_information?.FirstName || ""} ${
                    caseDetails?.contact_information?.LastName || ""
                  }`.trim()
                : "N/A"}{" "}
            </Text>
            <Text style={styles.label}>For the amount of</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>IDR .00</Text>
            <Text style={styles.label}>In settlement of</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              DP for services Notebook/Laptop{" "}
              {caseDetails?.asset_information?.product_information
                ?.ProductName ?? "N/A"}{" "}
              S/N: {caseDetails?.asset_information?.SerialNumber ?? "N/A"}
            </Text>
            <Text style={styles.label}>Payment type</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>
              {/* need variable for payment type */}
              transfer
            </Text>
            <Text style={styles.label}>Dp amount</Text>
            <Text style={styles.colon}>:</Text>
            <Text style={[styles.value]}>Rp. 666.000, from .00</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", paddingHorizontal: "10%" }}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={[styles.textSmall, { marginBottom: 10 }]}>
              DATE HERE
            </Text>
            <Image
              src={caseDetails?.createdByUser?.Signature}
              style={{ width: 120, height: 60 }}
            />
            <Text style={styles.textSmall}>
              --------------------------------------------
            </Text>
            <Text style={styles.textSmall}>
              {caseDetails?.createdByUser?.Name}
            </Text>
          </View>
        </View>
      </View>

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

      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableHeaderCell}>Accessories</Text>
        <Text style={styles.tableHeaderCell}>Note</Text>
        <Text style={styles.tableHeaderCell}>CT/ SN Code</Text>
      </View>
      {caseDetails?.accessory?.length > 0 ? (
        caseDetails.accessory.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{item.Accessories ?? "N/A"}</Text>
            <Text style={styles.tableCell}>{item.Note ?? "N/A"}</Text>
            <Text style={styles.tableCell}>{item.CT_SNCode ?? "N/A"}</Text>
          </View>
        ))
      ) : (
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>-</Text>
          <Text style={styles.tableCell}>-</Text>
          <Text style={styles.tableCell}>-</Text>
        </View>
      )}

      {/* PARTS TABLE */}
      <View style={[styles.table, { marginTop: 10 }]}>
        {/* Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeaderCell, styles.partsColNo]}>No</Text>
          <Text style={[styles.tableHeaderCell, styles.partsColVendor]}>
            Vendor Part No
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColHp]}>
            HP Part No
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColPartName]}>
            Part Name
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColQty]}>QTY</Text>
          <Text style={[styles.tableHeaderCell, styles.partsColUnitPrice]}>
            Unit Price
          </Text>
          <Text style={[styles.tableHeaderCell, styles.partsColTotalPrice]}>
            Total Price
          </Text>
        </View>

        {/* Body */}
        {caseDetails?.workorder?.length > 0 ? (
          caseDetails.workorder.flatMap((wo) =>
            wo.materialorder.flatMap((mo) =>
              mo.materialorderlineitems.map((line, index) => (
                <View style={styles.tableRow} key={line.LineItemID}>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.partsColNo,
                      styles.alignCenter,
                    ]}
                  >
                    {index + 1}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColVendor]}>
                    {line.servicecatalog_parts?.VendorPartNumber ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColHp]}>
                    {line.PartNumber ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColPartName]}>
                    {line.Description ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColQty]}>
                    {line.Quantity ?? "N/A"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColUnitPrice]}>
                    {formatAccountingRupiah(line.Price) ?? "0"}
                  </Text>

                  <Text style={[styles.tableCell, styles.partsColTotalPrice]}>
                    {formatAccountingRupiah(
                      Number(line.Price) * Number(line.Quantity)
                    ) || 0}
                  </Text>
                </View>
              ))
            )
          )
        ) : (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.partsColNo]} />
            <Text style={[styles.tableCell, styles.partsColVendor]} />
            <Text style={[styles.tableCell, styles.partsColHp]} />
            <Text style={[styles.tableCell, styles.partsColPartName]} />
            <Text style={[styles.tableCell, styles.partsColQty]} />
            <Text style={[styles.tableCell, styles.partsColUnitPrice]} />
            <Text style={[styles.tableCell, styles.partsColTotalPrice]} />
          </View>
        )}

        {/* Footer rows  perfectly aligned with header columns */}

        {/* Labor Fee: colspan=5 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan5, styles.alignRight]}
          >
            Labor Fee :
          </Text>
          <Text style={[styles.tableCell, styles.partsColUnitPrice]}>
            {formatAccountingRupiah(
              caseDetails?.workorder[0]?.materialorder[0]
                ?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation
                ?.LaborFee
            )}
          </Text>
          <Text style={[styles.tableCell, styles.partsColTotalPrice]}>
            {formatAccountingRupiah(
              caseDetails?.workorder[0]?.materialorder[0]
                ?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation
                ?.LaborFee
            )}
          </Text>
        </View>

        {/* Sub Total: colspan=6 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            Sub Total :
          </Text>
          <Text style={[styles.tableCell, styles.partsColTotalPrice]}>
            {formatAccountingRupiah(
              caseDetails?.workorder[0]?.materialorder[0]
                ?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation
                ?.Subtotal
            )}
          </Text>
        </View>

        {/* Total: colspan=6 */}
        <View style={styles.tableRow}>
          <Text
            style={[styles.tableCell, styles.partsColSpan6, styles.alignRight]}
          >
            Total :
          </Text>
          <Text style={[styles.tableCell, styles.partsColTotalPrice]}>
            {formatAccountingRupiah(
              caseDetails?.workorder[0]?.materialorder[0]
                ?.materialorderlineitems[0]?.quotation_lineitem[0]?.quotation
                ?.GrandTotal
            )}
          </Text>
        </View>
      </View>

      <Text style={styles.textSmall}>
        * This PDF DP auto generated by system.
      </Text>
    </Page>
  </Document>
);
