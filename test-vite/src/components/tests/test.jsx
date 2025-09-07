import React, { useState } from "react";

const data = [
    { id: 1, name: "Alice", role: "Manager" },
    { id: 2, name: "Bob", role: "Developer" },
    { id: 3, name: "Carol", role: "Designer" },
];

export default function ToggleViews() {
    const [view, setView] = useState("grid");

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setView("grid")}
                    className={`px-3 py-1 rounded ${view === "grid" ? "bg-blue-500 text-white" : "bg-gray-100"
                        }`}
                >
                    Grid
                </button>
                <button
                    onClick={() => setView("list")}
                    className={`px-3 py-1 rounded ${view === "list" ? "bg-blue-500 text-white" : "bg-gray-100"
                        }`}
                >
                    List
                </button>
            </div>

            {view === "grid" ? (
                <div className="grid grid-cols-3 gap-4">
                    {data.map((user) => (
                        <div key={user.id} className="p-4 bg-white rounded shadow">
                            <p className="font-bold">{user.name}</p>
                            <p className="text-gray-500">{user.role}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {data.map((user) => (
                        <div
                            key={user.id}
                            className="flex justify-between p-3 bg-white rounded shadow"
                        >
                            <span>{user.name}</span>
                            <span className="text-gray-500">{user.role}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
