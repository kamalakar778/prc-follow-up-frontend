import React, { useState, useEffect, useContext } from "react";
import ShortcutMedicationSection from "../components/ShortcutMedicationSection";
import { MedicationContext } from "../components/context/MedicationContext";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 1500,
    margin: "0 auto",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#444",
    display: "block",
    marginBottom: 6
  },
  select: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    minWidth: 300,
    cursor: "pointer"
  },
  medicationRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: "0.75rem"
  },
  input: {
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14
  },
  inputSmall: {
    width: 70
  },
  inputLarge: {
    width: 200
  },
  removeButton: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 13
  },
  dosageButtons: {
    display: "flex",
    backgroundColor: "#F5F5F5",
    gap: 8,
    flexWrap: "wrap",
    margin: "4px 0 12px 0"
  },
  dosageButton: {
    padding: "4px 10px",
    borderRadius: 1,
    border: "1px solid #888",
    backgroundColor: "#808080",
    cursor: "pointer",
    fontSize: 13,
    color: "#fff"
  }
};

const medicationReasons = [
  { id: 1, text: "Due to acceptable ADL, efficacy & tolerance the C.S. dosing was unchanged (or no additional C.S.)." },
  { id: 2, text: "Due to decreased ADL & efficacy and increased tolerance the C.S. dosing was changed accordingly." },
  { id: 3, text: "Due to non-compliance with C.S. or illegal drug use, the patient is now on a NNCP (See U-Tox Log for justification)." },
  { id: 4, text: "No medications" },
  { id: 5, text: "______ Page # Point # ______" }
];

const defaultMedication = {
  name: "",
  relief: "",
  days: "",
  status: "Continue",
  frequency: ""
};

const MedicationManagement = ({ setMedicationListData = () => {} }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [medications, setMedications] = useState([defaultMedication]);
  const [activeDosageIndex, setActiveDosageIndex] = useState(null);

  const {
    medicationSelected,
    flatMedications,
    setMedicationSelected,
    predefinedDosages,
    setAddMedication
  } = useContext(MedicationContext);

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);

    const isLast = index === medications.length - 1;
    const isFilled = Object.values(updated[index]).some((v) => v?.toString().trim() !== "");
    if (isLast && isFilled) {
      setMedications([...updated, defaultMedication]);
    }
  };

  const handleRemoveMedication = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated.length > 0 ? updated : [defaultMedication]);
  };

  const handleDosageClick = (index, dosage) => {
    const updated = [...medications];
    const baseName = updated[index].name.split(" ")[0];
    updated[index].name = `${baseName} ${dosage}`;
    setMedications(updated);
  };

  useEffect(() => {
    if (medicationSelected.size > 0) {
      const newMeds = Array.from(medicationSelected).map((key) => ({
        ...defaultMedication,
        name: flatMedications[key] || key
      }));
      setMedications((prev) => {
        const filtered = prev.filter((med) => med.name.trim() !== "");
        return [...filtered, ...newMeds, defaultMedication];
      });
      setMedicationSelected(new Set());
    }
  }, [medicationSelected, flatMedications, setMedicationSelected]);

  useEffect(() => {
    const reasonText = medicationReasons.find((r) => r.id === selectedReason)?.text || "";

    const medicationLines = medications
      .filter((med) => med.name.trim())
      .map((med, idx) => {
        const prefix = med.status ? `${med.status} ` : "";
        const relief = med.relief ? `(${med.relief}% pain relief obtained)` : "";
        const days = med.days ? `#${med.days}` : "";
        const extra = [days, relief].filter(Boolean).join(" ");
        return `${idx + 2}. ${prefix}${med.name}${extra ? `. ${extra}` : "."}`; // <-- Start numbering from 2
      });

    const hasInput = reasonText || medicationLines.length > 0;

    const formattedText = hasInput
      ? ["MEDICATION MANAGEMENT:", `1. ${reasonText}`, ...medicationLines].join("\n")
      : "";

    setMedicationListData(formattedText);
  }, [selectedReason, medications, setMedicationListData]);

  useEffect(() => {
    setAddMedication(() => (value) => {
      setMedications((prev) => {
        const filtered = prev.filter((med) => med.name.trim() !== "");
        return [...filtered, { ...defaultMedication, name: value }, defaultMedication];
      });
    });
  }, [setAddMedication]);

  return (
    <div style={styles.container}>
      <div style={{ marginTop: 16 }}>
        <label style={styles.label}>Medications:</label>

        {/* Reason Select */}
        <div style={styles.medicationRow}>
          <label style={styles.label}>Select Reason:</label>
          <select
            value={selectedReason || ""}
            onChange={(e) => setSelectedReason(e.target.value ? parseInt(e.target.value) : null)}
            style={styles.select}
          >
            <option value="">-- Select a reason --</option>
            {medicationReasons.map((reason) => (
              <option key={reason.id} value={reason.id}>
                {reason.text}
              </option>
            ))}
          </select>
        </div>

        {/* Medication Inputs */}
        {medications.map((med, index) => {
          const medKey = med.name.split(" ")[0]?.toLowerCase();
          const dosages = predefinedDosages[medKey] || [];

          return (
            <div key={index}>
              <div style={styles.medicationRow}>
                <select
                  value={med.status}
                  onChange={(e) => handleMedicationChange(index, "status", e.target.value)}
                  style={{ ...styles.select, minWidth: 10 }}
                >
                  <option value="">-- Select --</option>
                  <option value="Continue">Continue</option>
                  <option value="Start">Start</option>
                  <option value="Change">Change</option>
                  <option value="Later">Later</option>
                  <option value="Start next visit">Start next visit</option>
                  <option value="D/C">D/C</option>
                  <option value="hold">hold</option>
                </select>

                <input
                  type="text"
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                  onFocus={() => setActiveDosageIndex(index)}
                  style={{ ...styles.input, ...styles.inputLarge }}
                />

                <input
                  type="text"
                  placeholder="# Days"
                  value={med.days}
                  onChange={(e) => handleMedicationChange(index, "days", e.target.value)}
                  style={{ ...styles.input, ...styles.inputSmall }}
                />

                <input
                  type="text"
                  placeholder="% Relief"
                  value={med.relief}
                  onChange={(e) => handleMedicationChange(index, "relief", e.target.value)}
                  style={{ ...styles.input, ...styles.inputSmall }}
                />

                {medications.length > 1 && index !== medications.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>

              {activeDosageIndex === index && dosages.length > 0 && med.name.trim() && (
                <div style={styles.dosageButtons}>
                  {dosages.map((dose, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleDosageClick(index, dose)}
                      style={styles.dosageButton}
                    >
                      {dose}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginTop: "20px"
        }}
      >
        <h2>Medication Management</h2>
        <ShortcutMedicationSection />
      </div>
    </div>
  );
};

export default MedicationManagement;
