// components/ModalProvider.jsx
import { createContext, useContext, useState } from "react";
import { BtnModalAsset, BtnModalContact } from "@/components/sc-modal";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, setActiveModal }}>
      {children}

      {/* Only render the modals when active */}
      <BtnModalContact open={activeModal === "contact"} onOpenChange={closeModal} />
      <BtnModalAsset open={activeModal === "asset"} onOpenChange={closeModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
