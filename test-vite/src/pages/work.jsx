import React, { useEffect } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";

import { useWorkOrderStore } from "@/hooks/useWorkOrderStore";
import { getUserFromToken } from "@/lib/utils/auth";
import { useDraft } from "@/components/DraftContext";

//? OLD Service WORK
// import { ServiceWork } from "./services/service-work";
// export const Work = () => {
//   return (
//     <div>
//       <ServiceWork></ServiceWork>
//     </div>
//   )
// }



import { ServiceWork } from "./services/ServiceWorkReimagined";
import { Skeleton } from "../components/ui/skeleton";
export const Work = () => {
  const { woid } = useParams();
  const user = getUserFromToken();
  const { updateDraft } = useDraft();

  const loading = useWorkOrderStore((s) => s.loading);
  const error = useWorkOrderStore((s) => s.error);
  const workOrder = useWorkOrderStore((s) => s.workOrder);
  const caseInformation = useWorkOrderStore((s) => s.caseInformation);
  const fetchWorkOrderBundle = useWorkOrderStore(
    (s) => s.fetchWorkOrderBundle
  );

  useEffect(() => {
    if (!woid) return;

    // this is fine to call once when WOID changes
    updateDraft("woid", woid);

    const run = async () => {
      // Swal.fire({
      //   title: "Please wait...",
      //   text: "Loading Work Order Details...",
      //   allowOutsideClick: false,
      //   didOpen: () => Swal.showLoading(),
      // });

  try {
    await fetchWorkOrderBundle(woid);
  } finally {
    // Swal.close();\
    console.log("Fetch work order bundle completed.");
  }
    };

    run();
  }, [woid]); 

  // ---- status gates ----
  if (!woid) {
    return <div className="p-4">WOID is missing in the URL.</div>;
  }

  if (loading && !workOrder) {
    return (
      <div className="p-2 space-y-6 dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-b-slate-600">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="w-full h-30" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-116 w-full rounded-lg" />
	    <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-95 w-full rounded-lg" />
      </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to load Work Order: {error}
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Work Order not found.
      </div>
    );
  }

  return <ServiceWork />;
};

