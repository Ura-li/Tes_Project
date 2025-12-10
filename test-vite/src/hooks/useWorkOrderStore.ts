// useWorkOrderStore.ts
import { create } from "zustand";
import ApiCustomer from "../api";
	
type SLAState = {
	slaJeopardy: string;
	dueDateCustomer: string;
	coverageWindow: string;
	response: string;
	otcCode: string;
	requestedDateTimeCustomer: string;
	guaranteedFixTimeCustomer: string;
	earlyStartDateTimeCustomer: string;
	latestStartDateTimeCustomer: string;
	slaReschedule: string;
	activeScheduleDate: string;
	slaErrorDescription: string;
	casePriorityIndex: string;
};

type WOGeneralState = {
	IncomingChannel: string;
	WorkOrderNumber: string;
	WorkOrderType: string;
	WorkOrderDescription: string;
	Priority: string;
	SystemStatus: string;
	SubStatus: string;
	BookableResourceBooking: string;
	ServiceOfferID: string;
	ServiceDescription: string;
	PatnerCaseID: string;
	PatnerStatus: string;
	RecommendedResource: string;
	ShipmentCountry: string;
	ShipmentState: string;
};

type CustomerDataState = { MainAccount: any | null; SiteAccount: any | null; Type: string | null };

type WorkOrderStore = {
	loading: boolean;
	error: string | null;
	workOrder: any | null;
	materialOrders: any[];
	caseInformation: any | null;
	bookings: any[];
	ownerWorkOrder: any | null;
	customerData: CustomerDataState;
	SLA: SLAState;
	WOGeneral: WOGeneralState;

	setSLA: (updater: SLAState | ((prev: SLAState) => SLAState)) => void;
	setWOGeneral: (updater: WOGeneralState | ((prev: WOGeneralState) => WOGeneralState)) => void;
	setSLAField: (field: keyof SLAState, value: any) => void;
	setWOGeneralField: (field: keyof WOGeneralState, value: any) => void;

	fetchWorkOrderBundle: (woid: string) => Promise<void>;
	saveWorkOrder: () => Promise<{ success: boolean; message?: string }>;
};

const initialSLA: SLAState = {
	slaJeopardy: "",
	dueDateCustomer: "",
	coverageWindow: "",
	response: "",
	otcCode: "",
	requestedDateTimeCustomer: "",
	guaranteedFixTimeCustomer: "",
	earlyStartDateTimeCustomer: "",
	latestStartDateTimeCustomer: "",
	slaReschedule: "",
	activeScheduleDate: "",
	slaErrorDescription: "",
	casePriorityIndex: "",
};

const initialWOGeneral: WOGeneralState = {
	IncomingChannel: "",
	WorkOrderNumber: "",
	WorkOrderType: "",
	WorkOrderDescription: "",
	Priority: "",
	SystemStatus: "",
	SubStatus: "",
	BookableResourceBooking: "",
	ServiceOfferID: "",
	ServiceDescription: "",
	PatnerCaseID: "",
	PatnerStatus: "",
	RecommendedResource: "",
	ShipmentCountry: "",
	ShipmentState: "",
};

export const useWorkOrderStore = create<WorkOrderStore>((set, get) => ({
	loading: false,
	error: null,

	workOrder: null,
	materialOrders: [],
	caseInformation: null,
	bookings: [],
	ownerWorkOrder: null,
	customerData: {
		MainAccount: null,
		SiteAccount: null,
		Type: null,
	},
	SLA: initialSLA,
	WOGeneral: initialWOGeneral,

	setSLA: (updater) =>
		set((state) => ({
			SLA: typeof updater === "function" ? (updater as any)(state.SLA) : updater,
		})),

	setWOGeneral: (updater) =>
		set((state) => ({
			WOGeneral:
				typeof updater === "function"
					? (updater as any)(state.WOGeneral)
					: updater,
		})),

	setSLAField: (field, value) =>
		set((state) => ({ SLA: { ...state.SLA, [field]: value } })),

	setWOGeneralField: (field, value) =>
		set((state) => ({ WOGeneral: { ...state.WOGeneral, [field]: value } })),

	saveWorkOrder: async () => {
		const { workOrder, SLA, WOGeneral } = get();

		if (!workOrder?.WOID) {
			throw new Error("No Work Order loaded");
		}

		const WOID = workOrder.WOID;

		const payload = {
			// WO GENERAL
			ShipmentCountry: WOGeneral.ShipmentCountry || undefined,
			IncomingChannel: WOGeneral.IncomingChannel || undefined,
			Priority: WOGeneral.Priority || undefined,
			SubStatus: WOGeneral.SubStatus || undefined,
			RecommendedResource: WOGeneral.RecommendedResource || undefined,
			WorkOrderDescription: WOGeneral.WorkOrderDescription || undefined,
			ShipmentState: WOGeneral.ShipmentState || undefined,
			SystemStatus: WOGeneral.SystemStatus || undefined,
			// SLA
			SLAJeopardy: SLA.slaJeopardy || undefined,
			DueDateCustomer: SLA.dueDateCustomer || undefined,
			CoverageWindow: SLA.coverageWindow || undefined,
			Response: SLA.response || undefined,
			OTCCode: SLA.otcCode || undefined,
			RequestedDateTimeCustomer: SLA.requestedDateTimeCustomer || undefined,
			GuaranteedFixTimeCustomer: SLA.guaranteedFixTimeCustomer || undefined,
			EarlyStartDateTimeCustomer: SLA.earlyStartDateTimeCustomer || undefined,
			LatestStartDateTimeCustomer: SLA.latestStartDateTimeCustomer || undefined,
			SLAReschedule: SLA.slaReschedule || undefined,
			ActiveScheduleDate: SLA.activeScheduleDate || undefined,
			SLAErrorDescription: SLA.slaErrorDescription || undefined,
			CasePriorityIndex:
				SLA.casePriorityIndex !== ""
					? parseInt(SLA.casePriorityIndex, 10)
					: undefined,
		};

		const response = await ApiCustomer.patch(`/api/work-order/${WOID}`, payload);
		const result = response.data;

		// Optionally refresh store with returned WO if backend sends it
		if (result?.data) {
			set((state) => ({
				workOrder: {
					...state.workOrder,
					...result.data,
				},
			}));
		}

		return {
			success: Boolean(result?.success),
			message: result?.message,
		};
	},

	fetchWorkOrderBundle: async (woid: string) => {
		set({ loading: true, error: null });

		try {
			const resWO = await ApiCustomer.get(`/api/work-order/${woid}`);
			const workOrderData = resWO.data.data;

			const resMO = await ApiCustomer.get(`/api/material-order?WOID=${woid}`);
			const materialOrders = resMO.data.data || [];

			let caseInformation: any = null;
			let bookings: any[] = [];
			let ownerWorkOrder: any = null;
			let customerData: CustomerDataState = {
				MainAccount: null,
				SiteAccount: null,
				Type: null,
			};

			let newSLA: SLAState = initialSLA;
			let newWOGeneral: WOGeneralState = {
				...initialWOGeneral,
				WorkOrderNumber: woid || "",
			};

			if (workOrderData?.CaseID) {
				const resCI = await ApiCustomer.get(
					`/api/case-information/${workOrderData.CaseID}`
				);
				caseInformation = resCI.data.data;

				const resBooking = await ApiCustomer.get(`/api/bookings?WOID=${woid}`);
				bookings = resBooking.data.data || [];

				const resOwner = await ApiCustomer.get(
					`/api/user/${workOrderData.OwnerID}`
				);
				ownerWorkOrder = resOwner.data.data;

				const mainAccount = caseInformation.contact_information;

				customerData = {
					MainAccount: mainAccount,
					SiteAccount: caseInformation.site_account ?? null,
					Type: caseInformation.site_account ? "SiteAccount" : "Individual",
				};

				const svc = workOrderData.serviceCatalog;

				newWOGeneral = {
					IncomingChannel: workOrderData.IncomingChannel || "",
					WorkOrderNumber: woid || "",
					WorkOrderType: workOrderData.WorkOrderType || "",
					WorkOrderDescription: workOrderData.WorkOrderDescription || "",
					Priority: workOrderData.Priority || "",
					SystemStatus: workOrderData.SystemStatus || "",
					SubStatus: workOrderData.SubStatus || "",
					BookableResourceBooking:
						bookings?.[0]?.BookingDetails?.ResourceId || "",
					ServiceOfferID:
						svc?.warranty_services?.Service_offerID ||
						caseInformation.servicecatalog?.warranty_services?.Service_offerID ||
						"",
					ServiceDescription:
						svc?.warranty_services?.Service_description ||
						caseInformation.servicecatalog?.warranty_services?.Service_description ||
						"",
					PatnerCaseID: "",
					PatnerStatus: "",
					RecommendedResource: workOrderData.RecommendedResource || "",
					ShipmentCountry: workOrderData.ShipmentCountry || "",
					ShipmentState: workOrderData.ShipmentState || "",
				};

				newSLA = {
					...initialSLA,
					requestedDateTimeCustomer:
						workOrderData.RequestedDateTimeCustomer || "",
					slaJeopardy: workOrderData.SLAJeopardy || "",
					dueDateCustomer: workOrderData.DueDateCustomer || "",
					coverageWindow: workOrderData.CoverageWindow || "",
					response: workOrderData.Response || "",
					otcCode: workOrderData.OTCCode || "",
					guaranteedFixTimeCustomer:
						workOrderData.GuaranteedFixTimeCustomer || "",
					earlyStartDateTimeCustomer:
						workOrderData.EarlyStartDateTimeCustomer || "",
					latestStartDateTimeCustomer:
						workOrderData.LatestStartDateTimeCustomer || "",
					slaReschedule: workOrderData.SLAReschedule || "",
					activeScheduleDate: workOrderData.ActiveScheduleDate || "",
					slaErrorDescription: workOrderData.SLAErrorDescription || "",
					casePriorityIndex:
						workOrderData.CasePriorityIndex == null
							? ""
							: String(workOrderData.CasePriorityIndex),
				};
			}

			set({
				workOrder: workOrderData,
				materialOrders,
				caseInformation,
				bookings,
				ownerWorkOrder,
				customerData,
				SLA: newSLA,
				WOGeneral: newWOGeneral,
				loading: false,
				error: null,
			});
		} catch (err: any) {
			console.error("Failed to fetch work order bundle:", err);
			set({
				loading: false,
				error:
					err?.response?.data?.message ||
					"Failed to fetch work order bundle",
			});
		}
	},
}));
