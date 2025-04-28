import React, { useEffect, useState } from 'react'
import { 
  ServiceCase,
  TabsService
 } from './components/service-case'
import { useParams } from 'react-router'
import ApiCustomer from './api'
import Swal from 'sweetalert2';


export const Case = () => {
  const { caseId } = useParams(); // 🔥 Ambil ID dari URL
  const [caseDetails, setCaseDetails] = useState(null);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      // Tampilkan loading SweetAlert2
      Swal.fire({
        title: 'Memuat Case Detail...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await ApiCustomer.get(`/api/case-information/${caseId}`);
        setCaseDetails(response.data.data);

        // Tutup loading saat selesai
        Swal.close();
      } catch (error) {
        console.error("Error fetching case details:", error);

        // Tampilkan error alert
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data',
          text: 'Terjadi kesalahan saat mengambil data kasus.',
        });
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  // Tidak perlu return <p>Loading...</p> karena loading pakai Swal
  if (!caseDetails) return null;

  return (
    <div className="">
      <TabsService caseDetails={caseDetails} />
      {/* <ServiceCase caseDetails={caseDetails} /> */}
    </div>
  );
};
