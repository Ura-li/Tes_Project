// import React from 'react'
// import { ServiceMaterial } from './services/service-material'
// import { ServiceMoDetail } from './services/service-mo_detail'
// import { ServiceMaterialApo } from './services/service-materialApo'
// import { ServiceMoDetailApo } from './services/service-mo_detailApo'

// export const MaterialOrder = () => {
//  return (
//    <div>
       {/* <ServiceMaterial></ServiceMaterial> */}
//        <ServiceMaterialApo/>
//    </div>
//  )
// }

// export const MoDetail = () => {
//  return (
//    <div>
//        {/* <ServiceMoDetail></ServiceMoDetail> */}
//        <ServiceMoDetailApo/>
//    </div>
//  )
// }
// pages/MaterialOrder.tsx (or wherever this lives)
import React, { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

// import { ServiceMaterialApo } from "./services/service-materialApo";
import { ServiceMoDetailApo } from "./services/service-mo_detailApo";
import { useMaterialOrderStore } from "@/hooks/useMaterialOrderStore";
import { useDraft } from "@/components/DraftContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceMaterialApo } from "./services/ServiceMoDetailReimagined";
export const MaterialOrder = () => {
  const { moid } = useParams();
  const { updateDraft } = useDraft();

  const loading = useMaterialOrderStore((s) => s.loading);
  const error = useMaterialOrderStore((s) => s.error);
  const materialOrder = useMaterialOrderStore((s) => s.materialOrder);
  const fetchMaterialOrderBundle = useMaterialOrderStore(
    (s) => s.fetchMaterialOrderBundle
  );
  // const lastFetchedMoidRef = useRef(null);
  useEffect(() => {
    if (!moid) return;

    // if (lastFetchedMoidRef.current === moid) return;
    // lastFetchedMoidRef.current = moid;
    
    updateDraft("moid", moid);
    let cancelled = false;

    const run = async () => {
      // Swal.fire({
      //   title: "Memuat Data...",
      //   text: "Mohon tunggu sebentar...",
      //   allowOutsideClick: false,
      //   didOpen: () => Swal.showLoading(),
      // });

      try {
        await fetchMaterialOrderBundle(moid);
      } finally {
        if (!cancelled) console.log("Fetch material order bundle completed.");
      }
    };

    run();

    return () => {
      cancelled = true;
      console.log("Fetch material order bundle completed.");
    };
  }, [moid]);

  // ---- status gates ----
  if (!moid) {
    return <div className="p-4">MOID is missing in the URL.</div>;
  }

  if (loading && !materialOrder) {
    return (
      <div className="p-2 h-full space-y-6 dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-b-slate-600">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to load Material Order: {error}
      </div>
    );
  }

  if (!materialOrder) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Material Order not found.
      </div>
    );
  }

  return (
    <div>
      <ServiceMaterialApo />
    </div>
  );
};

// keep this for other route if you need
export const MoDetail = () => {
  return (
    <div>
      <ServiceMoDetailApo />
    </div>
  );
};

