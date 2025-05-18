import React, { useState, useEffect } from "react";

const medicationReasons = [
  {
    id: 1,
    text: "Due to acceptable ADL, efficacy & tolerance the C.S. dosing was unchanged (or no additional C.S.).",
  },
  {
    id: 2,
    text: "Due to decreased ADL & efficacy and increased tolerance the C.S. dosing was changed accordingly.",
  },
  {
    id: 3,
    text: "Due to non-compliance with C.S. or illegal drug use, the patient is now on a NNCP (See U-Tox Log for justification).",
  },
];

const styles = {
  container: {
    padding: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    display: "block",
    fontSize: "1.2rem",
    fontWeight: "500",
    marginBottom: "0.25rem",
  },
  select: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem",
  },
  medicationRow: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    alignItems: "center",
  },
  statusSelect: {
    width: "7rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem",
  },
  medicationInput: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem",
  },
  reliefInput: {
    width: "4.7rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    fontSize: "1rem",
  },
  removeButton: {
    marginLeft: "0.5rem",
    color: "#ef4444",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "0.875rem",
  },
  addButton: {
    marginTop: "0.5rem",
    color: "#2563eb",
    background: "none",
    border: "none",
    textDecoration: "underline",
    fontSize: "1rem",
  },
  resetButton: {
    color: "#dc2626",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "1rem",
  },
  outputContainer: {
    paddingTop: "1rem",
  },
  outputHeading: {
    fontSize: "0.875rem",
    fontWeight: "600",
    marginBottom: "0.25rem",
  },
  outputList: {
    marginLeft: "1.25rem",
    listStyleType: "decimal",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: "0.875rem",
  },
};

const MedicationManagement = ({ setInitialFormData }) => {
  // Add status field to each medication
  const [selectedReason, setSelectedReason] = useState(medicationReasons[0].id);
  const [medications, setMedications] = useState([{ name: "", relief: "", status: "" }]);
  const [outputState, setOutputState] = useState([]);

  const handleReasonChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedReason(id);
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addMedicationRow = () => {
    setMedications([...medications, { name: "", relief: "", status: "" }]);
  };

  const handleRemoveMedication = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleResetMedications = () => {
    setMedications([]);
  };

  useEffect(() => {
    const formattedList = [
      selectedReason
        ? medicationReasons.find((r) => r.id === selectedReason)?.text || ""
        : "",
      ...medications.map((med) => {
        const prefix = med.status ? `${med.status} ` : "";
        return `${prefix}${med.name}. (${med.relief || 0}% pain relief obtained).`;
      }),
    ];

    setOutputState(formattedList);

    if (setInitialFormData) {
      setInitialFormData((prev) => ({
        ...prev,
        medicationOutput: formattedList,
      }));
    }
  }, [selectedReason, medications, setInitialFormData]);

  return (
    <div style={styles.container}>
      <div>
        <label style={styles.label}>Select Reason:</label>
        <select value={selectedReason} onChange={handleReasonChange} style={styles.select}>
          <option value="">-- Select a reason --</option>
          {medicationReasons.map((reason) => (
            <option key={reason.id} value={reason.id}>
              {reason.text}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={styles.label}>Medications and Relief %:</label>
        {medications.map((med, index) => (
          <div key={index} style={styles.medicationRow}>
            {/* New dropdown for status */}
            <select
              value={med.status}
              onChange={(e) => handleMedicationChange(index, "status", e.target.value)}
              style={styles.statusSelect}
            >
              <option value="">No selection</option>
              <option value="Continue">Continue</option>
              <option value="Start">Start</option>
              <option value="Change">Change</option>
              <option value="Later">Later</option>
              <option value="Start next visit">Start next visit</option>
              <option value="hold">hold</option>
              <option value="Later">Later</option>
            </select>

            <input
              type="text"
              placeholder="Medication name"
              value={med.name}
              onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
              style={styles.medicationInput}
            />
            <input
              type="number"
              placeholder="% Relief"
              value={med.relief}
              onChange={(e) => handleMedicationChange(index, "relief", e.target.value)}
              style={styles.reliefInput}
            />
            <button
              type="button"
              onClick={() => handleRemoveMedication(index)}
              style={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addMedicationRow} style={styles.addButton}>
          + Add another medication
        </button>
      </div>

      <div>
        <button type="button" onClick={handleResetMedications} style={styles.resetButton}>
          Reset Medications List
        </button>
      </div>

      <div style={styles.outputContainer}>
        <h3 style={styles.outputHeading}>Formatted Summary:</h3>
        <ol style={styles.outputList}>
          {outputState.map((line, idx) => (line ? <li key={idx}>{line}</li> : null))}
        </ol>
      </div>
    </div>
  );
};

export default MedicationManagement;
