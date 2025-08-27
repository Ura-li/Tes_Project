// context/SheetContext.jsx
import { createContext, useContext, useState } from "react";

const SheetContext = createContext();

export function SheetProvider({ children }) {
    const [sheetopen, setSheetOpen] = useState(false);

    return (
        <SheetContext.Provider value={{ sheetopen, setSheetOpen }}>
            {children}
        </SheetContext.Provider>
    );
}

export function useSheet() {
    return useContext(SheetContext);
}
