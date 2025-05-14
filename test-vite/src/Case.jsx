import React, { useEffect, useState } from 'react'
import { 
  ServiceCase,
  TabsService
 } from './components/service-case'
import { useParams } from 'react-router'
import ApiCustomer from './api'
import Swal from 'sweetalert2';
import { Skeleton } from './components/ui/skeleton';



export const Case = () => {
  const { caseId } = useParams();
  const [caseDetails, setCaseDetails] = useState (null);
  const [caseNote, setCaseNote] = useState(null);
  const [caseNoteFormData, setCaseNoteFormData] = useState({
    LogType: '',
    ActionType: '',
    Template: '',
    VisibleExternally: null,
    MinutesSpent: 0,
    Note: ''
  });

  useEffect(() => {
    const loadCaseData = async () => {
      Swal.fire({
        title: 'Memuat Case Detail...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
        customClass: {
          popup: 'z-[9999]',
        }
      });

      try {
        const response = await ApiCustomer.get(`/api/case-information/${caseId}`);
        setCaseDetails(response.data.data);
        console.log("Case Details:", response.data.data);

        const res = await ApiCustomer.get(`/api/case-information/case-notes`);
        const notes = res.data.data;
        const existingNote = notes.find(note => note.CaseID === caseId);

        let noteID;
        if (existingNote) {
          noteID = existingNote.NoteID;
        } else {
          const createResponse = await ApiCustomer.post(`/api/case-information/case-notes`, {
            LogType: "",
            ActionType: "",
            Template: "",
            VisibleExternally: false,
            MinutesSpent: 0,
            Note: "",
            CaseID: caseId
          });
          noteID = createResponse.data.data.NoteID;
        }

        const detailRes = await ApiCustomer.get(`/api/case-information/case-notes/${noteID}`);
        setCaseNote(detailRes.data.data);

        // ✅ Delay sedikit agar UI sempat render dulu
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error("Gagal memuat data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data',
          text: 'Terjadi kesalahan saat mengambil data kasus atau catatan.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } finally {
        Swal.close();
      }
    };

    loadCaseData();
  }, [caseId]);

  // ✅ Skeleton Loader dari shadcn/ui
  if (!caseDetails) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <TabsService 
      caseDetails={caseDetails} 
      setCaseDetails={setCaseDetails}
      caseNote={caseNote}
      caseNoteFormData={caseNoteFormData}
      setCaseNoteFormData={setCaseNoteFormData}
    />
  );
};
