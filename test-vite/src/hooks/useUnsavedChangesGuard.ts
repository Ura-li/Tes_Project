import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import Swal from "sweetalert2";
import { useServiceCaseStore } from "./useServiceCaseStore";

export function useUnsavedChangesGuard() {
  const isDirty = useServiceCaseStore((s) => s.isDirty);

  // 1) Browser refresh / tab close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // 2) In-app route changes (React Router)
  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (!isDirty) return;
    if (!blocker || blocker.state !== "blocked") return;

    let resolved = false;

    (async () => {
      const result = await Swal.fire({
        title: "Perubahan belum disimpan",
        text: "Jika Anda meninggalkan halaman ini, perubahan yang belum disimpan akan hilang. Lanjutkan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Keluar tanpa menyimpan",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        resolved = true;
        blocker.proceed(); // allow navigation
      } else {
        resolved = true;
        blocker.reset(); // stay on current page
      }
    })();

    // safety: if component unmounts mid-dialog
    return () => {
      if (!resolved) {
        blocker.reset();
      }
    };
  }, [blocker, isDirty]);
}


