import { useWorkOrderStore } from "@/hooks/useWorkOrderStore";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SelectBarRelated } from "../../components/sc-select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeftFromLine,
  SquareArrowOutUpRight,
  Save,
  FileSymlink,
  RotateCw,
  StepBack,
  CalendarDays,
  Lock,
  UserPen,
  ArrowUp,
  ChevronDown,
  Smile,
  User,
  Calculator,
  CreditCard,
  Settings,
  CopyX,
  CopyXIcon,
} from "lucide-react";

import { SelectYN } from "../../components/sc-select";
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ApiCustomer from "@/api";
import { getUserFromToken } from "@/lib/utils/auth";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import Swal from "sweetalert2";

import { BtnModalsServiceCatalog } from '../../components/model/sc-modal'
import DatePicker from '../../components/date-picker'


import { SearchCommandBlock } from "../../components/sc-select";

import { pdf } from '@react-pdf/renderer';
import ServiceRequestPDF from '../../components/service-request-form'; // adjust path if needed
import { useAuth } from "@/context/auth-context";

import RepairActionDialog from "@/components/model/RepairActionModal";

export const TabsServiceWO = () => {
  const navigate = useNavigate();
  const workOrders = useWorkOrderStore((s) => s.workOrder);
  const saveWorkOrder = useWorkOrderStore((s) => s.saveWorkOrder);

  const [openRepairDialog, setOpenRepairDialog] = useState(false);
  const [onCancelWo, setOnCancelWo] = useState(false);

  if (!workOrders) {
    return null;
  }

  const WOID = workOrders.WOID;

  const handleSave = async () => {
    try {
      Swal.fire({
        title: "Updating WORK ORDER...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await saveWorkOrder();

      Swal.close();

      if (!result.success) {
        return Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Unknown error",
        });
      }

      return Swal.fire({
        icon: "success",
        title: "Success",
        text: "Work Order updated successfully!",
      });
    } catch (error) {
      Swal.close();
      return Swal.fire({
        icon: "error",
        title: "Request Error",
        text: error.message || "Something went wrong!",
      });
    }
  };

  const buttons = [
    {
      icon: ArrowLeftFromLine,
      label: "",
      onClick: () => navigate(`/app/case/${workOrders.CaseID}`),
    },
    { icon: SquareArrowOutUpRight, label: "", onClick: () => alert("not now") },
    { icon: Save, label: "Save", onClick: () => handleSave() },
    {
      icon: FileSymlink,
      label: "Save & Close",
      onClick: () =>
        handleSave().then(() =>
          navigate(`/app/case/${workOrders.CaseID}`)
        ),
    },
    {
      icon: CopyX,
      label: "Close WO",
      onClick: async () => {
        const isValid = await validate();
        if (isValid !== false) {
          setOnCancelWo(false);
          setOpenRepairDialog(true);
        }
      },
    },
    {
      icon: CopyX,
      label: "Cancel WO",
      onClick: async () => {
        const isValid = await validate();
        if (isValid !== false) {
          setOnCancelWo(true);
          setOpenRepairDialog(true);
        }
      },
    },
    { icon: RotateCw, label: "Book", onClick: () => alert("not now"), hidden: true },
    { icon: StepBack, label: "Audit", onClick: () => alert("not now"), hidden: true },
    { icon: StepBack, label: "Pick", onClick: () => alert("not now"), hidden: true },
    { icon: StepBack, label: "Geo Code", onClick: () => alert("not now"), hidden: true },
    { icon: RotateCw, label: "Refresh", onClick: () => window.location.reload() },
    { icon: StepBack, label: "Process", onClick: () => alert("not now"), hidden: true },
    { icon: StepBack, label: "Reset RDT", onClick: () => alert("not now"), hidden: true },
    { icon: StepBack, label: "Add To Queue", onClick: () => alert("not now"), hidden: true },
    {
      icon: UserPen,
      label: "Create Material Order",
      onClick: () => alert("not now"),
      hidden: true,
    },
    { icon: StepBack, label: "Show Alerts", onClick: () => alert("not now"), hidden: true },
  ];

  const validate = async () => {
    // Validation: all MO under WO must be Closed
    try {
      const moRes = await ApiCustomer.get(`/api/material-order?WOID=${workOrders.WOID}`);
      const mos = Array.isArray(moRes.data?.data) ? moRes.data.data : [];
      const mosNotClosed = mos.filter(
        (mo) =>
          String(mo.OrderStatus).toLowerCase() !== "closed" &&
          String(mo.OrderStatus).toLowerCase() !== "cancelled"
      );
      if (mosNotClosed.length > 0) {
        Swal.close();
        Swal.fire({
          icon: "warning",
          title: "Material Orders Still Open",
          text: "Close all Material Orders before closing the Work Order.",
        });
        return false;
      }
    } catch (e) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Unable to verify Material Orders for this Work Order.",
      });
      return false;
    }

    // Validation: bookings must be Completed
    try {
      const bRes = await ApiCustomer.get(`/api/bookings?WOID=${workOrders.WOID}`);
      const bookings = Array.isArray(bRes.data?.data) ? bRes.data.data : [];
      const notCompleted = bookings.filter((b) => {
        const statusText = (b.BookingStatus || b.Status || "")
          .toString()
          .toLowerCase();
        if (statusText === "completed") return false;
        const bd =
          Array.isArray(b.bookingDetails) && b.bookingDetails[0]
            ? b.bookingDetails[0]
            : {};
        const end = bd?.EndTimeCustomerTime;
        const eta = bd?.EstimatedArrivalTimeCustomerTime;
        const aat = bd?.ActualArrivalTimeCustomerTime;
        return !(end && eta && aat);
      });
      if (notCompleted.length > 0) {
        Swal.close();
        Swal.fire({
          icon: "warning",
          title: "Booking Not Completed",
          text: "Ensure all bookings have End Time, Estimated Arrival, and Actual Arrival (Customer Time) before closing the Work Order.",
        });
        return false;
      }
    } catch (e) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Unable to verify bookings for this Work Order.",
      });
      return false;
    }
    return true;
  };

  const saveAndCloseWorkOrder = async (repairFormData) => {
    try {
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we update the Work Order.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const tokenUser = getUserFromToken();
      if (
        !tokenUser ||
        (String(tokenUser.role).toLowerCase() !== "ce" &&
          String(tokenUser.role).toLowerCase() !== "celead")
      ) {
        Swal.close();
        return Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Only CE can close a Work Order.",
        });
      }

      const statusTarget = onCancelWo ? "CLOSED_CANCELLED" : "CLOSED_POSTED";
      const res = await ApiCustomer.patch(
        `/api/work-order/${workOrders.WOID}`,
        {
          DelayCode: repairFormData.delayCode,
          NMUId: repairFormData.nmu,
          VersionNMU: repairFormData?.Version,
          NMUItemId: repairFormData?.nmuItem,
          CEAnalysis: repairFormData.ceAnalysis,
          DefectDesc: repairFormData.defectDesc,
          RepairAction: repairFormData.repairAction,
          ServiceTypeId: repairFormData.serviceType,
          CancelReason: repairFormData.cancelReason,
          SystemStatus: statusTarget,
          IsCancel: onCancelWo,
        }
      );

      if (res.data.success) {
        const token = { user: getUserFromToken() };

        await ApiCustomer.post("/api/actionlog", {
          CaseId: `${workOrders.CaseID}`,
          ReferenceId: `${workOrders.WOID}`,
          model: "Work Orders",
          dataOld: workOrders.SystemStatus,
          dataNew: res.data.data.SystemStatus,
          changedBy: token.user.id,
          logDescription: `Edit : Changed Work Order ${workOrders.WOID} from ${workOrders.SystemStatus} to ${res.data.data.SystemStatus}`,
        });

        const statusCaseTarget = onCancelWo ? "CancelRepair" : "FinishRepair";

        await ApiCustomer.post("/api/actionlog", {
          CaseId: `${workOrders.CaseID}`,
          ReferenceId: `${workOrders.CaseID}`,
          model: "Case",
          dataOld: workOrders?.caseinformation?.CaseStatus,
          dataNew: statusCaseTarget,
          changedBy: token.user.id,
          logDescription: `Edit : Changed Case Status ${workOrders.CaseID} from ${workOrders?.caseinformation?.CaseStatus} to ${statusCaseTarget}`,
        });

        const caseChangeStatus = await ApiCustomer.patch(
          `/api/case-information/${workOrders.CaseID}`,
          {
            Owner: workOrders?.caseinformation?.CreatedBy,
            CaseStatus: statusCaseTarget,
          }
        );

        const previousOwnerId = workOrders?.caseinformation?.Owner;
        const newOwnerId = workOrders?.caseinformation?.CreatedBy;

        if (
          caseChangeStatus.data?.success &&
          previousOwnerId &&
          newOwnerId &&
          String(previousOwnerId) !== String(newOwnerId)
        ) {
          await ApiCustomer.post("/api/actionlog", {
            CaseId: `${workOrders.CaseID}`,
            ReferenceId: `${workOrders.CaseID}`,
            model: "CaseOwner",
            dataOld: String(previousOwnerId ?? ""),
            dataNew: String(newOwnerId ?? ""),
            changedBy: token.user.id,
            logDescription: `Edit : Change Case ${workOrders.CaseID} Owner from ${previousOwnerId} to ${newOwnerId}`,
          });
        }

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: res.data.message,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate(`/app/case/${workOrders.CaseID}`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update!",
        text: error.message || "Something went wrong.",
      });
    }
  };

  const handleRepairSubmit = async (repairFormData) => {
    setOpenRepairDialog(false);
    await saveAndCloseWorkOrder(repairFormData);
  };

  return (
    <>
      <div className="flex items-center border-1 sticky top-13 bg-white z-10 ">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            hidden={btn.hidden}
            variant="link"
            className="rounded-none px-0 py-0 flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5"
          >
            <btn.icon className="w-4 h-4" />
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))}
      </div>

      <RepairActionDialog
        open={openRepairDialog}
        onOpenChange={setOpenRepairDialog}
        onSubmit={handleRepairSubmit}
        canEdit={true}
        onCancelWo={onCancelWo}
        workOrders={workOrders}
      />
    </>
  );
};



import { useMaterialOrderStore } from "@/hooks/useMaterialOrderStore";
// ...other imports...

export const TabsServiceMO = ({

}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentRole = (getUserFromToken()?.role || "").toLowerCase();
  const materialOrder = useMaterialOrderStore((s) => s.materialOrder);
  const updatedLineItems = useMaterialOrderStore((s) => s.updatedLineItems);
  const materialInfo = useMaterialOrderStore((s) => s.materialInfo);
  const lineItems = useMaterialOrderStore((s) => s.lineItems);
  const saveMaterialOrderStore = useMaterialOrderStore(
    (s) => s.saveMaterialOrder
  );

  const handleSave = async () => {
    try {
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we save the Material Order.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await saveMaterialOrderStore(user.id);

      if (!result.success) {
        if (result.reason === "missingSalesRma") {
          Swal.close();
          return Swal.fire({
            icon: "warning",
            title: "Missing Sales/RMA Number",
            text:
              result.message ||
              "Before setting a line item to Shipped, fill Sales Order Number and RMA Number.",
          });
        }

        Swal.close();
        return Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: result.message || "Unable to save Material Order",
        });
      }

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: result.message || "Material Order updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Request Error",
        text: error.message || "Something went wrong!",
      });
    }
  };

  // close logic stays as your original saveAndCloseMaterialOrder for now
  const saveAndCloseMaterialOrder = async () => {
    // unchanged logic from your code: role guard, validate all line items closed,
    // patch OrderStatus: "Closed", log action, navigate back to WO
    // ...\

        try {
          Swal.fire({
            title: "Saving...",
            text: "Please wait while we update the Material Order.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          // Role guard: only CE can close MO
          const tokenUser = getUserFromToken();
          if (
            !tokenUser ||
            (String(tokenUser.role).toLowerCase() !== "ce" &&
              String(tokenUser.role).toLowerCase() !== "celead")
          ) {
            Swal.close();
            return Swal.fire({
              icon: "error",
              title: "Unauthorized",
              text: "Only CE can close a Material Order.",
            });
          }

          // Validation: all MO line items must be Closed
          try {
            const listRes = await ApiCustomer.get(
              `/api/material-order/material-order-line-items?MOID=${lineItems.MOID}`
            );
            const items = Array.isArray(listRes.data?.data)
              ? listRes.data.data
              : [];
            const notClosed = items.filter(
              (it) => String(it.Status).toLowerCase() !== "closed"
            );
            if (notClosed.length > 0) {
              Swal.close();
              return Swal.fire({
                icon: "warning",
                title: "Line Items Still Open",
                text: "Please close all Material Order Line Items before closing the Material Order.",
              });
            }
          } catch (e) {
            Swal.close();
            console.error("Error validating line items:", e);
            return Swal.fire({
              icon: "error",
              title: "Validation Failed",
              text: "Unable to verify line items status. Try again.",
            });
          }
          const res = await ApiCustomer.patch(
            `/api/material-order/${materialOrder.MOID}`,
            {
              OrderStatus: "Closed",
            }
          );
          if (res.data.success) {
            const token = {
              user: getUserFromToken(),
            };
            const updateLog = await ApiCustomer.post("/api/actionlog", {
              CaseId: `${materialOrder.workorder?.CaseID}`,
              ReferenceId: `${materialOrder.MOID}`,
              model: "Material Orders",
              dataOld: materialOrder.OrderStatus,
              dataNew: res.data.data.OrderStatus,
              changedBy: token.user.id,
              logDescription: `Edit : Changed Material Order ${materialOrder.MOID} from ${materialOrder.OrderStatus} to ${res.data.data.OrderStatus}`,
            });
            Swal.fire({
              icon: "success",
              title: "Updated!",
              text: res.data.message,
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              navigate(`/app/work/${materialOrder.WOID}`);
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: res.data.message,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Failed to update!",
            text: error.message || "Something went wrong.",
          });
        }
  };

  const buttons = [
    {
      icon: ArrowLeftFromLine,
      label: "",
      onClick: () => navigate(`/app/work/${materialOrder.WOID}`),
    },
    { icon: SquareArrowOutUpRight, label: "" },
    {
      icon: Save,
      label: "Save",
      onClick: () => handleSave(),
    },
    {
      icon: FileSymlink,
      label: "Save & Close",
      onClick: () =>
        handleSave().then(() => navigate(`/app/work/${materialOrder.WOID}`)),
    },
    {
      icon: CopyXIcon,
      label: "Close MO",
      onClick: () => saveAndCloseMaterialOrder(),
      hidden:
        currentRole !== "ce" &&
        currentRole !== "celead" &&
        currentRole !== "admin",
    },
    { icon: RotateCw, label: "Refresh", onClick: () => window.location.reload() },
    { icon: StepBack, label: "Cancel Order", hidden: true },
    { icon: StepBack, label: "Add To Queue", hidden: true },
    { icon: StepBack, label: "Add Parts", hidden: true },
    { icon: StepBack, label: "Pick", hidden: true },
    { icon: StepBack, label: "Place Order", hidden: true },
    { icon: StepBack, label: "Tax", hidden: true },
    { icon: StepBack, label: "CustID Search", hidden: true },
    { icon: UserPen, label: "PUDO Search", hidden: true },
    { icon: StepBack, label: "Audit", hidden: true },
  ];

  return (
    <>
      <div className="flex items-center border-1 ">
        {buttons.map((btn, index) => (
          <Button
            key={index}
            onClick={btn.onClick}
            variant="link"
            hidden={btn.hidden}
            className="rounded-none px-0 py-0 flex items-center gap-0.5 transition-all duration-300 has-[>svg]:px-1.5"
          >
            <btn.icon className="w-4 h-4" />
            {btn.label && <span className="text-md">{btn.label}</span>}
          </Button>
        ))}
      </div>
    </>
  );
};

