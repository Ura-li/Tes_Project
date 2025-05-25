import React, { createContext, useState, useContext } from 'react';

// Create context for drafts
const DraftContext = createContext();

// Custom hook to use the Draft context
export const useDraft = () => useContext(DraftContext);

// Provider to wrap your app and provide the draft context
export const DraftProvider = ({ children }) => {
  const [drafts, setDrafts] = useState({
    caseId: null,
    woid: null,
    moid: null,
    moliId: null,
  });

  // Function to update drafts based on route
  const updateDraft = (key, id) => {
    setDrafts((prevDrafts) => ({
      ...prevDrafts,
      [key]: id,
    }));
  };

  return (
    <DraftContext.Provider value={{ drafts, updateDraft }}>
      {children}
    </DraftContext.Provider>
  );
};
