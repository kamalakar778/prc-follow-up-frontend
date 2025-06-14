import React, { useContext, useState } from "react";
import { ShortcutContext } from "../components/context/ShortcutContext";

const styles = {
  section: {
    marginBottom: "12px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
  },
  groupContainer: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  groupLabel: {
    fontWeight: "500",
    fontSize: "14px",
    marginBottom: "4px",
    color: "#333",
    textTransform: "capitalize",
  },
  button: {
    padding: "4px 8px",
    fontSize: "13px",
    border: "1px solid #888",
    borderRadius: "4px",
    backgroundColor: "#F5F5F5",
    color: "#333",
    cursor: "pointer",
    margin: "1px",
  },
  selectedButton: {
    backgroundColor: "#E0F0FF",
    color: "#0066cc",
    borderColor: "#0066cc",
  },
  copyButton: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    color: "#155724",
    marginTop: "22px",
    minWidth: "70px",
  },
  addButton: {
    backgroundColor: "#ffeeba",
    borderColor: "#ffeeba",
    color: "#856404",
    marginTop: "6px",
    minWidth: "70px",
  },
  resetButton: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    color: "#721c24",
    marginTop: "6px",
    minWidth: "70px",
  },
  copyAllButton: {
    backgroundColor: "#cce5ff",
    borderColor: "#b8daff",
    color: "#004085",
    marginTop: "8px",
    minWidth: "160px",
    alignSelf: "flex-start",
  },
  previewBox: {
    marginTop: "12px",
    padding: "8px",
    border: "1px dashed #aaa",
    borderRadius: "6px",
    backgroundColor: "#fcfcfc",
    color: "#333",
    fontSize: "13px",
  },
  previewLabel: {
    fontWeight: "bold",
    marginBottom: "6px",
  },
};

const ShortcutSection = ({ type }) => {
  const {
    groupedPainLocation,
    painSelected,
    setPainSelected,
    abbrSelected,
    setAbbrSelected,
    abbreviations,
  } = useContext(ShortcutContext);

  const isPain = type === "pain";

  const entries = isPain ? groupedPainLocation : { Abbreviations: abbreviations };
  const selectedSet = isPain ? painSelected : abbrSelected;
  const setSelected = isPain ? setPainSelected : setAbbrSelected;

  const [multiCopyBuffer, setMultiCopyBuffer] = useState([]);

  const allEntries = isPain
    ? Object.assign({}, ...Object.values(groupedPainLocation))
    : abbreviations;

  const handleCopySelected = () => {
    const copied = [...selectedSet].map((k) => allEntries[k]).join(", ");
    if (copied) {
      navigator.clipboard.writeText(copied);
      setSelected(new Set());
    }
  };

  const handleAddToBuffer = () => {
    const selectedValues = [...selectedSet].map((k) => allEntries[k]);
    if (selectedValues.length) {
      setMultiCopyBuffer((prev) => [...prev, selectedValues.join(", ")]);
      setSelected(new Set());
    }
  };

  const handleCopyMultipleComplaints = () => {
    if (multiCopyBuffer.length) {
      navigator.clipboard.writeText(multiCopyBuffer.join(" | "));
      setMultiCopyBuffer([]);
    }
  };

  const handleReset = () => {
    setSelected(new Set());
    setMultiCopyBuffer([]);
  };

  return (
    <div style={styles.section}>
      <div style={{ ...styles.groupContainer, overflowX: isPain ? "visible" : "auto" }}>
        {Object.entries(entries).map(([groupKey, group]) =>
          isPain ? (
            <div key={groupKey} style={styles.column}>
              <div style={styles.groupLabel}>{groupKey}</div>
              {Object.entries(group).map(([abbr, fullLabel]) => {
                const isSelected = selectedSet.has(abbr);
                return (
                  <button
                    key={abbr}
                    type="button"
                    style={{
                      ...styles.button,
                      ...(isSelected ? styles.selectedButton : {}),
                    }}
                    title={fullLabel}
                    onClick={() => {
                      setSelected((prev) => {
                        const updated = new Set(prev);
                        updated.has(abbr) ? updated.delete(abbr) : updated.add(abbr);
                        return updated;
                      });
                    }}
                  >
                    {abbr}
                  </button>
                );
              })}
            </div>
          ) : (
            Object.entries(group).map(([abbr, fullLabel]) => {
              const isSelected = selectedSet.has(abbr);
              return (
                <button
                  key={abbr}
                  type="button"
                  style={{
                    ...styles.button,
                    ...(isSelected ? styles.selectedButton : {}),
                  }}
                  title={fullLabel}
                  onClick={() => {
                    setSelected((prev) => {
                      const updated = new Set(prev);
                      updated.has(abbr) ? updated.delete(abbr) : updated.add(abbr);
                      return updated;
                    });
                  }}
                >
                  {abbr}
                </button>
              );
            })
          )
        )}

        {/* Action Buttons */}
        <div style={styles.column}>
          <button
            type="button"
            style={{ ...styles.button, ...styles.copyButton }}
            onClick={handleCopySelected}
          >
            📋 Copy
          </button>

          <button
            type="button"
            style={{ ...styles.button, ...styles.addButton }}
            onClick={handleAddToBuffer}
          >
            ➕ Add
          </button>

          <button
            type="button"
            style={{ ...styles.button, ...styles.resetButton }}
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {multiCopyBuffer.length > 0 && (
        <div style={styles.previewBox}>
          <div style={styles.previewLabel}>📝 Preview Added Complaints:</div>
          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            {multiCopyBuffer.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <button
            type="button"
            style={{ ...styles.button, ...styles.copyAllButton }}
            onClick={handleCopyMultipleComplaints}
          >
            📑 Copy All Complaints
          </button>
        </div>
      )}
    </div>
  );
};

export default ShortcutSection;
