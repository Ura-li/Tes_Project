import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";

export function GlobalLogListener() {
  useSocket("log:created", (log) => {
    // Example log object: { id: "C-1023", user: "John Doe", createdAt: "..." }

    toast.custom(() => (
      <div className="flex flex-col rounded-md border bg-white p-4 shadow-md w-[320px]">
        <div className="flex justify-between items-center mb-2">
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-600">
            created
          </span>
          <span className="text-xs text-gray-500">
            {new Date(log.ChangeAt).toLocaleString()}
          </span>
        </div>
        <div className="font-semibold text-gray-900">Case {log.CaseId}</div>
        <div className="text-sm text-gray-600">
          New case created by {log.logDescription}
        </div>
      </div>
    ));
  });

  return null; // nothing to render
}
