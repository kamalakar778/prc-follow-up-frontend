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

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontWeight: "bold",
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    textAlign: "left",
    fontWeight: "600",
    fontSize: "18px",
    backgroundColor: "#f0f0f0",
    padding: "12px 16px",
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "16px",
    verticalAlign: "top",
    borderBottom: "1px solid #eee",
  },
  select: {
    marginTop: "8px",
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    fontSize: "14px",
  },
  label: {
    fontWeight: "500",
    color: "#444",
  },
  row: {
    display: "flex",
    gap: "32px",
    flexWrap: "wrap",
  },
  column: {
    flex: "1 1 45%",
  },
};

const ReviewOfSystems = ({ onReviewChange }) => {
  const [allergicData, setAllergicData] = useState(Array(5).fill("No"));
  const [neuroData, setNeuroData] = useState(Array(5).fill("No"));

  useEffect(() => {
    const allergic = allergicData.map(
      (val, i) => `${allergicSymptoms[i]}: ${val}`
    );
    const neuro = neuroData.map(
      (val, i) => `${neurologicalSymptoms[i]}: ${val}`
    );
    onReviewChange({ allergic, neuro });
  }, [allergicData, neuroData]);

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
      {/* <h2 style={styles.heading}>REVIEW OF SYSTEMS</h2> */}
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
