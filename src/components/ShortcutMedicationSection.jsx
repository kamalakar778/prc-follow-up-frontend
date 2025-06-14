// src/components/ShortcutMedicationSection.jsx
import React, { useContext, useState } from "react";
import { MedicationContext } from "../components/context/MedicationContext";

const styles = {
  section: {
    marginBottom: "12px",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f9f9f9",
  },
  horizontalLayout: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "nowrap",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    maxHeight: "400px",
    overflowY: "auto",
    overflowX: "hidden",
    flexShrink: 0,
    maxWidth: "70%",
    alignItems: "flex-start",
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
    fontSize: "14px",
    border: "1px solid #888",
    borderRadius: "4px",
    backgroundColor: "#F5F5F5",
    color: "#333",
    cursor: "pointer",
    margin: "1px",
  },
  selectedButton: {
    backgroundColor: "#E0F0FF",
    fontSize: "14px",
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
    padding: "8px",
    border: "1px dashed #aaa",
    borderRadius: "6px",
    backgroundColor: "#fcfcfc",
    color: "#333",
    fontSize: "13px",
    minWidth: "250px",
    maxWidth: "300px",
    flexShrink: 0,
    height: "fit-content",
  },
  previewLabel: {
    fontWeight: "bold",
    marginBottom: "6px",
  },
  previewItem: {
    display: "inline-block",
    padding: "4px 8px",
    margin: "4px",
    border: "1px solid #aaa",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#f0f0f0",
    color: "#333",
  },
  previewDisabled: {
    textDecoration: "line-through",
    opacity: 0.6,
    backgroundColor: "#e2e2e2",
    color: "#999",
    borderColor: "#ccc",
    cursor: "pointer",
  },
};

const directionWords = ["left", "right", "upper", "lower", "bilateral", "medial", "lateral"];

const formatWithOptionalComma = (text) => {
  return directionWords.includes(text.toLowerCase()) ? text : `${text},`;
};

const ShortcutMedicationSection = () => {
  const {
    groupedMedications,
    flatMedications,
    medicationSelected,
    setMedicationSelected,
  } = useContext(MedicationContext);

  const [multiCopyBuffer, setMultiCopyBuffer] = useState([]);

  const handleCopySelected = () => {
    const copied = [...medicationSelected]
      .map((k) => flatMedications[k])
      .map(formatWithOptionalComma)
      .join(" ")
      .trim();

    if (copied) {
      navigator.clipboard.writeText(copied);
      setMedicationSelected(new Set());
    }
  };

  const handleAddToBuffer = () => {
    const selectedValues = [...medicationSelected]
      .map((k) => flatMedications[k])
      .map(formatWithOptionalComma);

    if (selectedValues.length) {
      const newGroup = selectedValues.map((text) => ({ text, enabled: true }));
      setMultiCopyBuffer((prev) => [...prev, newGroup]);
      setMedicationSelected(new Set());
    }
  };

  const handleCopyMultiple = () => {
    const enabledGroups = multiCopyBuffer
      .map((group) => group.filter((item) => item.enabled).map((item) => item.text).join(" "))
      .filter((text) => text !== "");

    if (enabledGroups.length) {
      navigator.clipboard.writeText(enabledGroups.join(" | "));
      setMultiCopyBuffer([]);
    }
  };

  const handleReset = () => {
    setMedicationSelected(new Set());
    setMultiCopyBuffer([]);
  };

  const togglePreviewItem = (groupIndex, itemIndex) => {
    setMultiCopyBuffer((prev) =>
      prev.map((group, gIdx) =>
        gIdx === groupIndex
          ? group.map((item, iIdx) =>
              iIdx === itemIndex ? { ...item, enabled: !item.enabled } : item
            )
          : group
      )
    );
  };

  return (
    <div style={styles.section}>
      <div style={styles.horizontalLayout}>
        <div style={styles.leftPanel}>
          {Object.entries(groupedMedications ?? {}).map(([groupLabel, group]) => (
            <div key={groupLabel} style={styles.column}>
              <div style={styles.groupLabel}>{groupLabel}</div>
              {Object.entries(group).map(([abbr, fullLabel]) => {
                const isSelected = medicationSelected.has(abbr);
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
                      setMedicationSelected((prev) => {
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
          ))}
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

        <div style={styles.previewBox}>
          {multiCopyBuffer.length > 0 && (
            <>
              <div style={styles.previewLabel}>📝 Preview Added:</div>
              <div>
                {multiCopyBuffer.map((group, groupIndex) => (
                  <div key={groupIndex} style={{ marginBottom: "8px" }}>
                    {group.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        style={{
                          ...styles.previewItem,
                          ...(item.enabled ? {} : styles.previewDisabled),
                        }}
                        title={item.enabled ? "Click to disable" : "Click to enable"}
                        onClick={() => togglePreviewItem(groupIndex, itemIndex)}
                      >
                        {item.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <button
                type="button"
                style={{ ...styles.button, ...styles.copyAllButton }}
                onClick={handleCopyMultiple}
              >
                📁 Copy All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortcutMedicationSection;
