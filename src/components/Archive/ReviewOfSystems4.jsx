import React, { useEffect, useState } from "react";

const options = [
  "No",
  "Yes",
  "Yes, The Problem is being treated",
  "Yes, The Problem is not being treated",
  "No, The problem is not being treated",
];

const allergicSymptoms = [
  "Allergies to new Meds/Foods",
  "Hives and Itchy skin",
  "Sneezing",
  "Hay fever",
  "Red & Itchy eyes",
];

const neurologicalSymptoms = [
  "Worsening Weakness in limbs",
  "Worsening Sensation in limbs",
  "Numbness/tingling sensations",
  "Loss of Bowel or Bladder",
  "New convulsions or seizures",
];

/* ─────────────────────────  NEW, unified style object  ───────────────────────── */
const styles = {
  container: {
    marginTop: "1rem",
    padding: "0.5rem",
    border: "1px solid black",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontFamily: "Arial, sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid black",
    padding: "0.25rem",
    textAlign: "center",
    fontWeight: "600",
  },
  td: {
    border: "1px solid black",
    padding: "0.25rem",
    verticalAlign: "top",
  },
  label: {
    fontWeight: "500",
    color: "#333",
  },
  select: {
    marginTop: "0.25rem",
    width: "100%",
    padding: "0.125rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#fff",
    fontSize: "0.875rem",
  },
};

const ReviewOfSystems = ({ onReviewChange }) => {
  const [allergicData, setAllergicData] = useState(Array(5).fill("No"));
  const [neuroData, setNeuroData] = useState(Array(5).fill("No"));

  /* keep the side‑effect logic unchanged */
  useEffect(() => {
    const allergic = allergicData.map(
      (val, i) => `${allergicSymptoms[i]}: ${val}`
    );
    const neuro = neuroData.map(
      (val, i) => `${neurologicalSymptoms[i]}: ${val}`
    );
    onReviewChange({ allergic, neuro });
  }, [allergicData, neuroData, onReviewChange]);

  const handleAllergicChange = (idx, value) => {
    const updated = [...allergicData];
    updated[idx] = value;
    setAllergicData(updated);
  };

  const handleNeuroChange = (idx, value) => {
    const updated = [...neuroData];
    updated[idx] = value;
    setNeuroData(updated);
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ALLERGIC SYMPTOMS</th>
            <th style={styles.th}>NEUROLOGICAL SYMPTOMS</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <tr key={idx}>
              <td style={styles.td}>
                <label style={styles.label}>{allergicSymptoms[idx]}</label>
                <select
                  value={allergicData[idx]}
                  onChange={(e) => handleAllergicChange(idx, e.target.value)}
                  style={styles.select}
                >
                  {options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td style={styles.td}>
                <label style={styles.label}>{neurologicalSymptoms[idx]}</label>
                <select
                  value={neuroData[idx]}
                  onChange={(e) => handleNeuroChange(idx, e.target.value)}
                  style={styles.select}
                >
                  {options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewOfSystems;
