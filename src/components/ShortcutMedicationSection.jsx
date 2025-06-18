import React, { useContext, useState } from "react";
import { MedicationContext } from "../components/context/MedicationContext";

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: "12px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    marginBottom: "6px",
    gap: "12px",
    alignItems: "flex-start",
    overflow: "visible",
  },
  groupContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0px",
    flex: 1,
    alignItems: "flex-start",
  },
  group: {
    minWidth: "6rem",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flexShrink: 0,
  },
  groupLabel: {
    fontWeight: "bold",
    fontSize: "13px",
    marginBottom: "4px",
    color: "#34495e",
    borderBottom: "1px solid #ccc",
    paddingBottom: "2px",
    textTransform: "uppercase",
  },
  medRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4px",
    marginBottom: "2px",
  },
  medButton: {
    background: "#ecf0f1",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "2px 4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    transition: "all 0.2s ease-in-out",
    margin: "0px -10px",
    color: "#2c3e50",
  },
  medButtonActive: {
    background: "#2980b9",
    color: "#ffffff",
    fontWeight: "600",
    border: "1px solid #1c5980",
  },
  dosageContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2px",
    marginTop: "2px",
    maxWidth: "100%",
  },
  dosageButton: {
    padding: "2px 4px",
    fontSize: "13px",
    borderRadius: "4px",
    background: "#f0f0f0",
    border: "1px solid #ccc",
    cursor: "pointer",
    whiteSpace: "nowrap",
    boxShadow: "0 1px 1px rgba(0,0,0,0.03)",
    margin: "0",
    transition: "background 0.2s ease",
    color: "#2c3e50",
  },
  dosageButtonActive: {
    background: "#27ae60",
    color: "#ffffff",
    border: "1px solid #1f8a4d",
  },
  actionPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: "70px",
    marginLeft: "8px",
  },
  actionButton: {
    padding: "10px 10px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  copy: {
    background: "#d1f7c4",
    color: "#2d6a4f",
  },
  add: {
    background: "#ffeaa7",
    color: "#6c5b07",
  },
  reset: {
    background: "#f8d7da",
    color: "#721c24",
  },
};

const ShortcutMedicationSection = () => {
  const {
    groupedMedications,
    flatMedications,
    predefinedDosages,
    addMedication,
    medicationList,
  } = useContext(MedicationContext);

  const [selectedMeds, setSelectedMeds] = useState(new Set());
  const [selectedDosages, setSelectedDosages] = useState({});
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  const toggleMed = (abbr) => {
    setSelectedMeds((prev) => {
      const next = new Set(prev);
      next.has(abbr) ? next.delete(abbr) : next.add(abbr);
      return next;
    });
  };

  const toggleDosage = (abbr, dose) => {
    setSelectedDosages((prev) => ({
      ...prev,
      [abbr]: prev[abbr] === dose ? null : dose,
    }));
  };

  const handleCopy = () => {
    const text = [...selectedMeds]
      .map((abbr) => {
        const label = flatMedications[abbr];
        const dose = selectedDosages[abbr];
        return dose ? `${label} ${dose}` : label;
      })
      .join(", ");

    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setSelectedMeds(new Set());
      setSelectedDosages({});
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAdd = () => {
    const entry = [...selectedMeds]
      .map((abbr) => {
        const label = flatMedications[abbr];
        const dose = selectedDosages[abbr];
        return dose ? `${label} ${dose}` : label;
      })
      .join(", ");

    if (!entry) return;

    const alreadyExists =
      Array.isArray(medicationList) &&
      medicationList.some(
        (med) => med.trim().toLowerCase() === entry.trim().toLowerCase()
      );

    if (!alreadyExists && typeof addMedication === "function") {
      addMedication(entry.trim());
    }

    setAdded(true);
    setSelectedMeds(new Set());
    setSelectedDosages({});
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReset = () => {
    setSelectedMeds(new Set());
    setSelectedDosages({});
    setCopied(false);
    setAdded(false);
  };

  // Detect if any selected medication has visible dosage options
  const dosageVisible = [...selectedMeds].some(
    (abbr) => predefinedDosages?.[abbr]?.length > 0
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.groupContainer}>
        {Object.entries(groupedMedications ?? {}).map(([group, items]) => (
          <div key={group} style={styles.group}>
            <div style={styles.groupLabel}>{group}</div>
            {Object.entries(items).map(([abbr, label]) => (
              <div key={abbr} style={styles.medRow}>
                <button
                  style={{
                    ...styles.medButton,
                    ...(selectedMeds.has(abbr) ? styles.medButtonActive : {}),
                  }}
                  onClick={() => toggleMed(abbr)}
                  title={label}
                >
                  {abbr}
                </button>
                {selectedMeds.has(abbr) &&
                  predefinedDosages?.[abbr]?.length > 0 && (
                    <div style={styles.dosageContainer}>
                      {predefinedDosages[abbr].map((dose) => (
                        <button
                          key={dose}
                          style={{
                            ...styles.dosageButton,
                            ...(selectedDosages[abbr] === dose
                              ? styles.dosageButtonActive
                              : {}),
                          }}
                          onClick={() => toggleDosage(abbr, dose)}
                        >
                          {dose}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          ...styles.actionPanel,
          marginLeft: dosageVisible ? "24px" : styles.actionPanel.marginLeft,
        }}
      >
        <button
          style={{ ...styles.actionButton, ...styles.copy }}
          onClick={handleCopy}
        >
          📋 {copied ? "Copied!" : "Copy"}
        </button>
        <button
          style={{ ...styles.actionButton, ...styles.add }}
          onClick={handleAdd}
        >
          ➕ {added ? "Added!" : "Add"}
        </button>
        <button
          style={{ ...styles.actionButton, ...styles.reset }}
          onClick={handleReset}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default ShortcutMedicationSection;
