// src/context/ShortcutContext.jsx
import React, { createContext, useState, useMemo } from "react";

export const ShortcutContext = createContext();

export const ShortcutProvider = ({ children }) => {
  const [painSelected, setPainSelected] = useState(new Set());
  const [abbrSelected, setAbbrSelected] = useState(new Set());

  // Grouped structure for frontend use
  const groupedPainLocation = {
    direction: {
      left: "left",
      right: "right",
      bilateral: "bilateral",
    },
    "frequent pain":{
        "low back": "low back",
        neck: "neck",
        leg: "leg",
        hip: "hip",
        
      },
      spine: {
        lumbar: "lumbar",
        cervical: "cervical",
        thoracic: "thoracic ",
        shoulder: "shoulder",
      },
      joints: {
        arm:"arm",
        hand: "hand",
        elbow:"elbow",
        wrist: "wrist",
      },
      other: {
      knee: "knee",
      foot:"foot",
      ankle:"ankle",
      Abdomen:"Abdomen",
    },
    "Abbrev-1": {
   "MBB":"Medial Branch Blocks",
    "RFA":"Radio Frequency ablation",
    "ESI":"Epidural Steroid Injection",
    "f/u": "Follow-up",
  },
  "Abbrev-2": {
    "variable":"variable",
    "caudal":"caudal",
      },
    };

  // Optional flattened version (if needed elsewhere)
  const painLocation = useMemo(() => {
    const flat = {};
    Object.values(groupedPainLocation).forEach((group) => {
      Object.entries(group).forEach(([key, val]) => {
        flat[key] = val;
      });
    });
    return flat;
  }, []);

  const abbreviations = {
    "MBB":"Medial Branch Blocks",
    "RFA":"Radio Frequency ablation",
    "ESI":"Epidural Steroid Injection",
    "C/O": "Complains of",
    "f/u": "Follow-up",
  };

  return (
    <ShortcutContext.Provider
      value={{
        groupedPainLocation,
        painLocation,
        painSelected,
        setPainSelected,
        abbrSelected,
        setAbbrSelected,
        abbreviations,
      }}
    >
      {children}
    </ShortcutContext.Provider>
  );
};
