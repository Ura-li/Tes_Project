import { useAuth } from "@/context/auth-context";
import { lazy, Suspense } from "react";

const AdminLanding = lazy(() => import("../layout/SupervisorLanding"));
const WorkerLanding = lazy(() => import("../layout/FrontDesk_Page"));
const ApoLanding = lazy(() => import("../layout/Apo_Page"));
const CeLanding = lazy(() => import("../layout/Ce_Page"))
// const UserLanding = lazy(() => import("../pages/user/Dashboard"));

export default function Landing() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      {user?.role === "admin" && <AdminLanding />}
      {/* {user?.role === "manager" && <ManagerLanding />} */}
      {user?.role === "user" && <WorkerLanding />}
      {user?.role === "fd" && <WorkerLanding />}
      {user?.role === "ce" && <CeLanding/>}
      {user?.role === "apo" && <ApoLanding/>}
    </Suspense>
  );
}
