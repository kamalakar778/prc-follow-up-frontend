// src/components/context/MedicationContext.jsx
import React, { createContext, useState } from "react";

export const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const groupedMedications = {
    analgesics: {
      PCM: "Paracetamol",
      IBU: "Ibuprofen",
    },
    antibiotics: {
      AMX: "Amoxicillin",
      AZI: "Azithromycin",
    },
    antiinflammatory: {
      DIC: "Diclofenac",
      NAP: "Naproxen",
    },
  };

  const flatMedications = Object.fromEntries(
    Object.entries(groupedMedications).flatMap(([_, group]) =>
      Object.entries(group)
    )
  );

  const [medicationSelected, setMedicationSelected] = useState(new Set());

  return (
    <MedicationContext.Provider
      value={{
        groupedMedications,
        flatMedications,
        medicationSelected,
        setMedicationSelected,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};
