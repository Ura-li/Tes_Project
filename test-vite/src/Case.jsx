import React, { useEffect, useState } from 'react'
import { 
  ServiceCase,
  TabsService
 } from './components/service-case'
import { useParams } from 'react-router'
import ApiCustomer from './api'
import Swal from 'sweetalert2';



export const Case = () => {
  const { caseId } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);
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
        didOpen: () => Swal.showLoading()
      });

      try {
        const response = await ApiCustomer.get(`/api/case-information/${caseId}`);
        setCaseDetails(response.data.data);
        console.log("Case Details:", response.data.data);
        // Tutup loading saat selesai
        Swal.close();
      } catch (error) {
        console.error("Error fetching case details:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data',
          text: 'Terjadi kesalahan saat mengambil data kasus.'
        });
      }

      try {
        const res = await ApiCustomer.get(`/api/case-information/case-notes`);
        const notes = res.data.data;
        const existingNote = notes.find(note => note.CaseID === caseId);

        let noteID;
        if (existingNote) {
          noteID = existingNote.NoteID;
        } else {
          const createResponse = await ApiCustomer.post(`/api/case-information/case-notes`, {
            LogType: "NotesLog",
            ActionType: "Initial",
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

      } catch (err) {
        console.error("Error in fetchCaseNotes:", err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat catatan',
          text: 'Terjadi kesalahan saat mengambil/membuat catatan kasus.'
        });
      } finally {
        Swal.close();
      }
    };

    loadCaseData();
  }, [caseId]);

  if (!caseDetails) return null;

  return (
    <TabsService 
      caseDetails={caseDetails} 
      caseNote={caseNote}
      caseNoteFormData={caseNoteFormData}
      setCaseNoteFormData={setCaseNoteFormData}
    />
  );
};
