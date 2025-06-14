// context/ShortcutContext.jsx
import React, { createContext, useState } from "react";

export const ShortcutContext = createContext();

export const ShortcutProvider = ({ children }) => {
  const [painSelected, setPainSelected] = useState(new Set());
  const [abbrSelected, setAbbrSelected] = useState(new Set());

  const painLocation = {
    burning: "Burning",
    stabbing: "Stabbing",
    dull: "Dull",
  };

  const abbreviations = {
    PT: "Physical Therapy",
    OT: "Occupational Therapy",
    ROM: "Range of Motion",
  };

  return (
    <ShortcutContext.Provider
      value={{
        painSelected,
        setPainSelected,
        painLocation,
        abbrSelected,
        setAbbrSelected,
        abbreviations,
      }}
    >
      {children}
    </ShortcutContext.Provider>
  );
};
