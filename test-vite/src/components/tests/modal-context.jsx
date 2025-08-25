// components/ModalProvider.jsx
import { createContext, useContext, useState } from "react";
import { BtnModalAsset, BtnModalContact } from "@/components/model/sc-modal";

const ModalContext = createContext();

export function ModalContextProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider value={{ activeModal, setActiveModal, modalData, setModalData  }}>
      {children}

      {/* Only render the modals when active */}
      <BtnModalContact open={activeModal === "contact"} onOpenChange={closeModal} {...modalData} />
      <BtnModalAsset open={activeModal === "asset"} onOpenChange={closeModal} {...modalData}/>
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
