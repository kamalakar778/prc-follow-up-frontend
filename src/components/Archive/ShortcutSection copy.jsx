// components/ShortcutSection.jsx
import React, { useContext } from "react";
import { ShortcutContext } from "../components/context/ShortcutContext";

const ShortcutSection = ({ type }) => {
  const {
    painSelected,
    setPainSelected,
    painLocation,
    abbrSelected,
    setAbbrSelected,
    abbreviations,
  } = useContext(ShortcutContext);

  const isPain = type === "pain";

  const entries = isPain ? painLocation : abbreviations;
  const selectedSet = isPain ? painSelected : abbrSelected;
  const setSelected = isPain ? setPainSelected : setAbbrSelected;

  return (
    <div className="form-section compact">
      <h2 className="section-title">
        {isPain ? "Quick‑Select Pain Locations" : "Quick‑Select Abbreviations"}
      </h2>
      <div className="shortcut-row compact">
        {Object.entries(entries).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`shortcut-btn ${selectedSet.has(key) ? "selected" : ""}`}
            onClick={() => {
              setSelected((prev) => {
                const clone = new Set(prev);
                clone.has(key) ? clone.delete(key) : clone.add(key);
                return clone;
              });
            }}
          >
            {isPain ? label : key}
          </button>
        ))}
        <button
          type="button"
          className="shortcut-btn reset"
          onClick={() => setSelected(new Set())}
        >
          Reset
        </button>
        <button
          type="button"
          className="shortcut-btn copy"
          onClick={() => {
            const copied = [...selectedSet].map((k) => entries[k]).join(", ");
            if (copied) {
              navigator.clipboard.writeText(copied);
              setSelected(new Set());
              alert("Copied and reset!");
            }
          }}
        >
          📋 Copy
        </button>
      </div>
    </div>
  );
};

export default ShortcutSection;
