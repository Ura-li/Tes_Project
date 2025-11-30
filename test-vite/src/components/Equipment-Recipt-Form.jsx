// ServiceRequestPDF.js
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
} from '@react-pdf/renderer';

// Example custom font (optional)
Font.register({
  family: 'Helvetica',
  fonts: [{ src: 'https://fonts.gstatic.com/s/helvetica/Helvetica.ttf' }],
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
    width: 50,
    height: 50,
  },
  logo: {
    width: 60,
    height: 60,
  },
  link: {
    fontSize: 7,
    color: 'blue',
  },
  disclaimerText: {
    fontSize: 7,
    marginBottom: 5,
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
  colon: {
    width: '2%',
    fontSize: 8,
  },
  value2: {
    width: '80%',
    fontSize: 8,
  },
   table: {
    width: "100%",
    marginBottom: 8,
    fontSize: 7,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    padding: 4,
    borderColor: "#ccc",
  },
  tableHeaderCell: {
    backgroundColor: "#DEDED1",
    fontWeight: "bold",
    textAlign: "center",
    borderColor: "#ccc",
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
  <View minPresenceAhead={120} style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const Table = ({ data }) => (
  <View style={styles.table}>
    {data.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
        {row.map((cell, cellIndex) => (
          <Text
            key={cellIndex}
            style={[styles.tableCell, rowIndex === 0 && styles.tableHeaderCell]}
          >
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const EquipmentReciptForm = ({ nama, caseDetails, customerSignature }) =>

(
  <Document>
    <Page size="A4" style={styles.container}>
      <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginBottom: 4, padding: 3, borderBottom: 1,  }}>
        <Image src="/hp.png" style={[styles.logo,{padding: 2  }]} />
        <View>
          <Text style={styles.sectionHeader}>PT.JAVA ABADI GEMILANG</Text>
          <Text style={styles.textSmall}>Prudential Centre Kota Casablanka Lt. 5 Unit C- E, Jl. Casablanca</Text>
          <Text style={styles.textSmall}>Kav.88</Text>
          <Text style={styles.textSmall}>Jakarta Selatan, 12870, Indonesia</Text>
          <Text style={styles.textSmall}>Telp : (+6221) 081318521007 / 081318521006 - HP : 0811970666</Text>
        </View>
        <Text style={[styles.sectionHeader]}>EQUIPMENT RECIPT FORM</Text>
      </View>

      <Section title="Case Info">
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>Case Type</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.CaseType ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Warranty Status</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.asset_information?.WarrantyOTCCode?.Description ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Received Date</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.CreatedOn ? new Date(caseDetails.CreatedOn).toLocaleDateString() : 'N/A'}
          </Text>

          <Text style={styles.label}>Problem Desc</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.ProblemDescription ?? 'N/A'}
          </Text>
         </View>

          <View style={styles.rightSection}>
            <Text style={[styles.textSmall, styles.bold]}>{caseDetails?.CaseID ?? 'N/A'}</Text>
            <Image src="/random_qr.png" style={styles.qrCode} />
          </View>
        </View>

          <View style={{display: 'flex', flexDirection: "row",}}>
                   <View style={styles.leftSection}>
                     <Text style={{width: '15%', fontSize: 8}}>Note</Text>
                     <Text style={{width: '1%', fontSize: 8}}>:</Text>
                     <Text style={{width: '84%', fontSize: 8, textAlign: 'justify'}}>
                       {caseDetails?.CaseProductNote ?? "N/A"}
                     </Text>
                   </View>
                 </View>

      </Section>

      {/* Customer Section */}
      {/* <Text style={[styles.textSmall, { fontWeight: 'bold', marginTop: 20 }]}>Customer</Text> */}
      <Section title="Customer">
        <View style={{ display: 'flex', flexDirection: 'row', columnGap: 5 }}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>Company</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.site_account?.Company ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Name</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.contact_information?.FirstName || caseDetails?.contact_information?.LastName
              ? `${caseDetails?.contact_information?.FirstName || ''} ${caseDetails?.contact_information?.LastName || ''}`.trim()
              : 'N/A'}
          </Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.site_account ? caseDetails?.site_account?.Email ?? 'N/A' : caseDetails?.contact_information?.Email ?? 'N/A'}
          </Text>

          <Text style={styles.label}>PIC name</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.contact_information?.FirstName || caseDetails?.contact_information?.LastName
              ? `${caseDetails?.contact_information?.FirstName || ''} ${caseDetails?.contact_information?.LastName || ''}`.trim()
              : 'N/A'}
          </Text>

          <Text style={styles.label}>PIC email</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.contact_information?.Email ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Address</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.site_account ? caseDetails?.site_account?.AddressLine1 ?? 'N/A' : caseDetails?.contact_information?.AddressLine1 ?? 'N/A'}
          </Text>
        </View>
        <View style={styles.rightSection2}>
          <Text style={styles.label}>Phone no</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.site_account ? caseDetails?.site_account?.PrimaryPhone  ?? 'N/A' : caseDetails?.contact_information?.Phone  ?? 'N/A' }
          </Text>

          <Text style={styles.label}>Mobile no</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.site_account ? caseDetails?.site_account?.WhatsappNo  ?? 'N/A' : caseDetails?.contact_information?.Mobile  ?? 'N/A' }
          </Text>

          <Text style={styles.label}>Fax no</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.contact_information?.Fax ?? 'N/A'}
          </Text>

          <Text style={styles.label}>PIC phone no.</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.contact_information?.Phone ?? 'N/A'}
          </Text>

          <Text style={styles.label}>PIC mobile no.</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.contact_information?.Mobile ?? 'N/A'}
          </Text>

        </View>
        </View>
      </Section>

      {/* Product Section */}
      {/* <Text style={[styles.textSmall, { fontWeight: 'bold', marginTop: 20 }]}>Product</Text> */}
      <Section title="Product">
      <View style={{ display: 'flex', flexDirection: 'row', columnGap: 5 }}>
        <View style={styles.leftSection}>
          <Text style={styles.label}>Serial no</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.asset_information?.SerialNumber ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product no</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.asset_information?.ProductNumber ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product name</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.asset_information?.product_information?.ProductName ?? 'N/A'}
          </Text>
        </View>

        <View style={styles.rightSection2}>
          <Text style={styles.label}>Product tower</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.asset_information?.product_information?.product_type?.ProductTower ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product group</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.asset_information?.product_information?.product_type?.ProductGroup ?? 'N/A'}
          </Text>

          <Text style={styles.label}>Product type</Text>
          <Text style={styles.colon}>:</Text>
          <Text style={[styles.value]}>
            {caseDetails?.asset_information?.product_information?.product_type?.ProductType ?? 'N/A'}
          </Text>
        </View>
      </View>
      </Section>

      {/* Accessories Table */}
      <Table data={[
        ["Accessories", "Note", "CT / SN Code"],
        ...(caseDetails?.accessory?.length > 0
          ? caseDetails.accessory.map((item) => [
              item.Accessories ?? "N/A",
              item.Note ?? "N/A",
              item.CT_SNCode ?? "N/A",
            ])
          : [["No Data", "-", "-"]]),
      ]} />

      <Table data={[
        ["NO", "Vendor part NO", "HP Part NO", "Part Name", "NEW CT Code", "QTY"],
        ...(caseDetails?.workorder?.length > 0 ? caseDetails.workorder.map((item, index ) => [
          index + 1,
          'N/A',
          item.materialorder[0].materialorderlineitems[0].PartNumber ?? 'N/A',
          item.materialorder[0].materialorderlineitems[0].Description ?? 'N/A',
          item.materialorder[0].materialorderlineitems[0].RemovedSerialNumber ?? 'N/A',
          item.materialorder[0].materialorderlineitems[0].Quantity ?? 'N/A',
        ]) : [["No Data", "-", "-", "-","-", "-"]]),
      ]}/>

    
      <Text style={[styles.textSmall, { fontWeight: 'bold', color: 'black' }]}>Repair Action : </Text>
      {/* <View style={{ display: 'flex', flexDirection: 'row' }}>

        <View style={styles.leftSection}>
          <Text style={styles.label2}>Unit Garansi</Text>
          <Text style={[styles.value2]}>:Lamanya pengerjaan perbaikan sekitar 3 hari kerja (tergantung tersedianya suku cadang)</Text>
          <Text style={styles.label2}>Unit Tidak Garansi</Text>
          <Text style={[styles.value2]}>: • Biaya pengecekan dibayar di muka dan tidak dapat dikembalikan. </Text>
          <Text style={styles.label2}></Text>
          <Text style={[styles.value2]}>• Surat Penawaran Perbaikan akan dikirim sekitar 3 hari kerja setelah peralatan diterima. Lamanya pengerjaan perbaikan sekitar 3
            hari kerja setelah persetujuan atas Surat Penawaran Perbaikan (tergantung tersedianya suku cadang)</Text>
        </View>
      </View> */}
      {/* <Text style={[styles.sectionHeader, styles.textCenter]}>Disclaimer Statement</Text>

      <View style={{}}>
        <Text style={[styles.bold, styles.textSmall]}>Informasi Untuk Pelanggan :</Text>
        <Text style={[styles.bold, styles.textSmall]}>Saya {caseDetails?.contact_information?.FirstName || caseDetails?.contact_information?.LastName
          ? `${caseDetails?.contact_information?.FirstName || ''} ${caseDetails?.contact_information?.LastName || ''}`.trim()
          : 'Customer'} yang bertanda tangan di bawah ini menyetujui bahwa:</Text>
        <Text style={[styles.bold, styles.textSmall]}>
          Data yang tersimpan dalam peralatan dapat terhapus selama proses perbaikan peralatan berlangsung. Pada saat dilakukan system atau
          operating system recovery, setting peralatan akan berubah mengikuti setting awal dari pabrik.
        </Text>
        <Text style={styles.textSmall}>
          Walaupun HP selalu melakukan pencegahan terhadap kerusakan pada Data atau terhapusnya Data, kami sangat menyarankan Pelanggan untuk melakukan
          Backup Data sendiri sebelum peralatan disampaikan kepada kami. Dengan demikian pelanggan mempunyai Backup Data untuk melakukan Data Recovery jika
          selama proses perbaikan peralatan berlangsung Data pelanggan terhapus oleh System atau Operating System.
        </Text>
        <Text style={styles.textSmall}>
          HP tidak memberikan jaminan proteksi Data pelanggan dan HP tidak bertanggungjawab jika terjadi kerusakan pada Data atau terhapusnya Data dari peralatan
          pelanggan.
        </Text>
      </View> */}


      {/* Signature section */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={[styles.textSmall, { marginBottom: 10 }]}>Received By</Text>
          <Image src={caseDetails?.createdByUser?.Signature} style={{ width: 120, height: 60 }} />
          <Text style={styles.textSmall}>--------------------------------------------</Text>
          <Text style={styles.textSmall}>{caseDetails?.createdByUser?.Name}</Text>
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={[styles.textSmall, { marginBottom: 10 }]}>Received By</Text>
          <Image src={customerSignature} style={{ width: 120, height: 60 }} />
          <Text style={styles.textSmall}>--------------------------------------------</Text>
          <Text style={styles.textSmall}>{caseDetails?.contact_information?.FirstName || caseDetails?.contact_information?.LastName
              ? `${caseDetails?.contact_information?.FirstName || ''} ${caseDetails?.contact_information?.LastName || ''}`.trim()
              : 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.textSmall}>
        • Check status service silahkan klik{' '}
        <Link style={styles.link} src="https://hp.care/digital-ID">https://hp.care/digital-ID</Link> or scan the QR code above.
      </Text>

      <Text style={styles.textSmall}>• Apabila pelayanan kami kurang memuaskan untuk case {caseDetails?.CaseID ?? 'N/A'}, silahkan sampaikan melalui email ke <Link style={styles.link} src="mailto:escalation.id@hp.com">escalation.id@hp.com</Link></Text>

      <Text style={[styles.textSmall, { marginBottom: 20 }]}>• Apabila dikemudian hari membutuhkan bantuan teknis, silahkan klik{' '}
        <Link style={styles.link} src="https://hp.care/digital-ID">https://hp.care/digital-ID</Link>
      </Text>
      <Text style={{ borderBottom: '1px solid #ccc' }}></Text>
      <Text style={styles.textSmall}>Tanda tangan Anda merupakan persetujuan terhadap syarat-syarat perbaikan di balik halaman ini</Text>
    </Page>
  </Document>
);



export default EquipmentReciptForm;
