import { toast } from "sonner";

function ToastTester() {
    const showToast = () => {
        toast.custom((id) => (
            <div className="flex flex-col rounded-md border bg-white p-4 shadow-md w-[320px]">
                <div className="flex justify-between items-center mb-2">
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-600">
                        created
                    </span>
                    <span className="text-xs text-gray-500">
                        {new Date().toLocaleString()}
                    </span>
                </div>
                <div className="font-semibold text-gray-900">Case C-1023</div>
                <div className="text-sm text-gray-600">New case created by John Doe</div>
            </div>
        ));
    };

    return (
        <button
            onClick={showToast}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
            Test Toast
        </button>
    );
}

export default ToastTester;
