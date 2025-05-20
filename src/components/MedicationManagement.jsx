import React, { useState, useEffect } from "react";

const medicationReasons = [
  {
    id: 1,
    text: "Due to acceptable ADL, efficacy & tolerance the C.S. dosing was unchanged (or no additional C.S.)."
  },
  {
    id: 2,
    text: "Due to decreased ADL & efficacy and increased tolerance the C.S. dosing was changed accordingly."
  },
  {
    id: 3,
    text: "Due to non-compliance with C.S. or illegal drug use, the patient is now on a NNCP (See U-Tox Log for justification)."
  },
   {
    id: 4,
    text: "______ Page # Point # ______"
  },

];

const defaultMedication = {
  name: "",
  relief: "",
  days: "",
  status: "Continue"
};

const styles = {
  container: {
    padding: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  label: {
    display: "block",
    fontSize: "1.2rem",
    fontWeight: "500",
    marginBottom: "0.25rem"
  },
  select: {
    width: "80%",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem"
  },
  medicationRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    alignItems: "center",
    flexWrap: "wrap"
  },
  statusSelect: {
    width: "7rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem"
  },
  medicationInput: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem"
  },
  reliefInput: {
    width: "5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem"
  },
  daysInput: {
    width: "5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem"
  },
  removeButton: {
    color: "#ef4444",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.875rem"
  },
  resetButton: {
    color: "#dc2626",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "1rem"
  },
  outputContainer: {
    paddingTop: "1rem"
  },
  outputHeading: {
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "0.25rem"
  },
  outputList: {
    marginLeft: "1.25rem",
    listStyleType: "decimal",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: "0.875rem"
  }
};

const MedicationManagement = ({
  medications,
  setMedications,
  setInitialFormData
}) => {
  const [selectedReason, setSelectedReason] = useState(medicationReasons[0].id);
  const [outputState, setOutputState] = useState([]);

  useEffect(() => {
    if (medications.length === 0) {
      setMedications([defaultMedication]);
    }
  }, []);

  const handleReasonChange = (e) => {
    setSelectedReason(parseInt(e.target.value));
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);

    const isLast = index === medications.length - 1;
    const isFilled = Object.values(updated[index]).some(
      (v) => v?.toString().trim() !== ""
    );

    if (isLast && isFilled) {
      setMedications([...updated, defaultMedication]);
    }
  };

  const handleRemoveMedication = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    if (updated.length === 0) {
      setMedications([defaultMedication]);
    } else {
      setMedications(updated);
    }
  };

  const handleResetMedications = () => {
    setMedications([defaultMedication]);
  };

  useEffect(() => {

    const reasonText = medicationReasons.find((r) => r.id === selectedReason)?.text || "";

    // const medLines = medications
    //   .filter(med => med.name.trim())
    //   .map((med) => {
    //     const prefix = med.status ? `${med.status} ` : "";
    //     const relief = med.relief !== "" ? `${med.relief}% pain relief` : "";
    //     const days = med.days !== "" ? `for ${med.days} days` : "";
    //     const detail = [relief, days].filter(Boolean).join(", ");
    //     return `${prefix}${med.name}.${detail ? ` (${detail}).` : ""}`;
    //   });
    // const medLines = medications
    //   .filter((med) => med.name.trim())
    //   .map((med, idx) => {
    //     const prefix = med.status ? `${med.status} ` : "";
    //     const relief =
    //       med.relief !== "" ? `(${med.relief}% pain relief obtained).` : "";
    //     const days = med.days !== "" ? `(#${med.days})` : "";
    //     const detail = [relief, days].filter(Boolean).join(" ");
    //     const heading = "MEDICATION MANAGEMENT:";
    //     return `${idx + 1}. ${prefix}${med.name}.${detail ? ` ${detail}` : ""}`;
    //   });

const medLines = medications
  .filter((med) => med.name.trim())
  .map((med, idx) => {
    const prefix = med.status ? `${med.status} ` : "";
    const relief = med.relief !== "" ? `(${med.relief}% pain relief obtained).` : "";
    const days = med.days !== "" ? `(#${med.days})` : "";
    const detail = [relief, days].filter(Boolean).join(" ");
    return `${idx + 2}. ${prefix}${med.name}.${detail ? ` ${detail}` : ""}`;
  });

const fullList = [
  "MEDICATION MANAGEMENT:",
  `1. ${reasonText}`,
  ...medLines
];


    setOutputState(fullList);

    if (setInitialFormData) {
      setInitialFormData((prev) => ({
        ...prev,
        medicationOutput: fullList.join("\n")
      }));
    }
  }, [selectedReason, medications, setInitialFormData]);

  return (
    <div style={styles.container}>
      <div>
        <label style={styles.label}>Select Reason:</label>
        <select
          value={selectedReason}
          onChange={handleReasonChange}
          style={styles.select}
        >
          {medicationReasons.map((reason) => (
            <option key={reason.id} value={reason.id} disabled={reason.text === ""}>
              {reason.text}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={styles.label}>Medications, % Relief, and #Days:</label>
        {medications.map((med, index) => (
          <div key={index} style={styles.medicationRow}>
            <select
              value={med.status}
              onChange={(e) =>
                handleMedicationChange(index, "status", e.target.value)
              }
              style={styles.statusSelect}
            >
              <option value="Continue">Continue</option>
              <option value="Start">Start</option>
              <option value="Change">Change</option>
              <option value="Later">Later</option>
              <option value="Start next visit">Start next visit</option>
              <option value="hold">hold</option>
            </select>

            <input
              type="text"
              placeholder="Medication name"
              value={med.name}
              onChange={(e) =>
                handleMedicationChange(index, "name", e.target.value)
              }
              style={styles.medicationInput}
            />

            <input
              type="number"
              placeholder="% Relief"
              value={med.relief}
              onChange={(e) =>
                handleMedicationChange(index, "relief", e.target.value)
              }
              style={styles.reliefInput}
            />

            <input
              type="number"
              placeholder="# Days"
              value={med.days}
              onChange={(e) =>
                handleMedicationChange(index, "days", e.target.value)
              }
              style={styles.daysInput}
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
        ))}
      </div>

      <div>
        <button
          type="button"
          onClick={handleResetMedications}
          style={styles.resetButton}
        >
          Reset Medications List
        </button>
      </div>

      <div style={styles.outputContainer}>
        <h3 style={styles.outputHeading}>Formatted Summary:</h3>
        <ol style={styles.outputList}>
          {outputState.map((line, idx) => (
            <li key={idx}>{line}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default MedicationManagement;
