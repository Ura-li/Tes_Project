// src/stores/caseNotes.store.ts
import ApiCustomer from "@/api";
import { toast } from "sonner";
import { create } from "zustand";

export type CaseNote = {
  NoteID: string | number;
  CaseID: string;
  CreatedOn?: string;
  CreatedBy?: string;
  LogType?: string;
  ActionType?: string;
  Note?: string;
  createdByUser?: { Name?: string; Role?: string };
};

export type CaseNoteDraft = {
  LogType: string;
  ActionType: string;
  Note: string;
};

export const EMPTY_DRAFT = Object.freeze({
  LogType: "Notes Log",
  ActionType: "Inbound Customer call",
  Note: "",
});

export const EMPTY_NOTES = Object.freeze([]);

type CaseNotesState = {
  notesByCaseId: Record<string, CaseNote[]>;
  loadingByCaseId: Record<string, boolean>;
  errorByCaseId: Record<string, string | null>;

  draftByCaseId: Record<string, CaseNoteDraft>;

  setDraftField: (
    caseId: string,
    field: keyof CaseNoteDraft,
    value: string
  ) => void;

  fetchNotes: (caseId: string) => Promise<boolean>;

  saveNoteOnly: (args: {
    caseId: string;
    createdBy?: string | number;
    confirm?: boolean;
  }) => Promise<boolean>;
};

function normalizeNotes(input: any): CaseNote[] {
  if (!Array.isArray(input)) return [];
  // newest first
  return [...input].sort((a, b) => {
    const da = a?.CreatedOn ? new Date(a.CreatedOn).getTime() : 0;
    const db = b?.CreatedOn ? new Date(b.CreatedOn).getTime() : 0;
    return db - da;
  });
}

export const useCaseNotesStore = create<CaseNotesState>((set, get) => ({
  notesByCaseId: {},
  loadingByCaseId: {},
  errorByCaseId: {},
  draftByCaseId: {},

  setDraftField: (caseId, field, value) => {
    if (!caseId) return;
    set((s) => ({
      draftByCaseId: {
        ...s.draftByCaseId,
        [caseId]: {
          ...(s.draftByCaseId[caseId] ?? EMPTY_DRAFT),
          [field]: value,
        },
      },
    }));
  },

  fetchNotes: async (caseId) => {
    if (!caseId) return false;

    // prevent useless refetch loops if already loading
    if (get().loadingByCaseId[caseId]) return true;

    set((s) => ({
      loadingByCaseId: { ...s.loadingByCaseId, [caseId]: true },
      errorByCaseId: { ...s.errorByCaseId, [caseId]: null },
    }));

    try {
      const res = await ApiCustomer.get(`/api/case-information/case-notes?caseId=${caseId}`);
      const notes = normalizeNotes(res?.data?.data ?? res?.data ?? []);

      set((s) => ({
        notesByCaseId: { ...s.notesByCaseId, [caseId]: notes },
      }));

      return true;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Failed to fetch notes";
      set((s) => ({
        errorByCaseId: { ...s.errorByCaseId, [caseId]: msg },
      }));
      return false;
    } finally {
      set((s) => ({
        loadingByCaseId: { ...s.loadingByCaseId, [caseId]: false },
      }));
    }
  },

  saveNoteOnly: async ({ caseId, createdBy }) => {
    if (!caseId) return false;

    const draft = get().draftByCaseId[caseId] ?? EMPTY_DRAFT;
    const noteText = (draft.Note ?? "").toString().trim();

    if (!noteText) {
      toast.info("Isi Note terlebih dahulu ya", { position: "top-center" });
      return false;
    }

    try {
      const payload = {
        CaseID: caseId,
        LogType: draft.LogType,
        ActionType: draft.ActionType,
        Note: draft.Note,
        CreatedBy: createdBy,
      };

      await ApiCustomer.post(`/api/case-information/case-notes`, payload);

      await get().fetchNotes(caseId);

      // clear draft
      set((s) => ({
        draftByCaseId: {
          ...s.draftByCaseId,
          [caseId]: { ...EMPTY_DRAFT },
        },
      }));

    toast.success("Note tersimpan");
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Save note failed");
      return false;
    }
  },
}));

