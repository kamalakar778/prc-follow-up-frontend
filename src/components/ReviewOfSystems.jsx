import React, { useEffect, useState } from "react";

const options = [
  "No",
  "Yes",
  "Yes, The Problem is being treated",
  "Yes, The Problem is not being treated",
  "No, The problem is not being treated"
];

const allergicSymptoms = [
  "Allergies to new Meds/Foods",
  "Hives and Itchy skin",
  "Sneezing",
  "Hay fever",
  "Red & Itchy eyes"
];

const neurologicalSymptoms = [
  "Worsening Weakness in limbs",
  "Worsening Sensation in limbs",
  "Numbness/tingling sensations",
  "Loss of Bowel or Bladder",
  "New convulsions or seizures"
];

const styles = {
  container: {
    maxWidth: "100%",
    margin: "auto",
    padding: "0px",
    fontFamily: "Arial, sans-serif", 
  },
  heading: {
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333"
  },
  table: {
    width: "100%",

    borderCollapse: "collapse",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden"
  },
  th: {
    textAlign: "left",
    fontWeight: "600",

    fontSize: "18px",
    backgroundColor: "#f0f0f0",
    padding: "10px 16px",
    borderBottom: "1px solid #ddd"
  },
  td: {
    padding: "5px",

    verticalAlign: "top",
    borderBottom: "1px solid #eee"
  },
  inlineField: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap"
  },
  inlineLabel: {
    fontWeight: "500",
    color: "#444",
    minWidth: "180px"
  },
  select: {
    width: "45%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    fontSize: "14px"
  },
  commentSection: {
    marginTop: "24px",
    display: "flex",
    flexDirection: "column"
  },
  commentLabel: { fontWeight: "500", marginBottom: "6px" },
  commentInput: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%"
  }
};

const ReviewOfSystems = ({ formData = {}, setFormData, onReviewChange }) => {
  const defaultNoValue = options.find((opt) => opt === "No") || options[0];

  const [allergicFormatted, setAllergicFormatted] = useState([]);
  const [neurologicalFormatted, setNeurologicalFormatted] = useState([]);

  useEffect(() => {
    if (Object.keys(formData).length === 0) {
      const defaultFormData = {};
      for (let i = 1; i <= 5; i++) {
        defaultFormData[`allergic_symptom_${i}`] = defaultNoValue;
        defaultFormData[`neurological_symptom_${i}`] = defaultNoValue;
      }
      defaultFormData.intervalComments = "";
      setFormData(defaultFormData);
    }
  }, [formData, setFormData, defaultNoValue]);

  useEffect(() => {
    if (Object.keys(formData).length === 0) return;

    const allergicTexts = [];
    const neurologicalTexts = [];
    const updatedFormatted = { ...formData };

    for (let i = 1; i <= 5; i++) {
      const allergicVal = formData[`allergic_symptom_${i}`] || defaultNoValue;
      const formattedAllergic = `${allergicSymptoms[i - 1]}: ${allergicVal}`;
      allergicTexts.push(formattedAllergic);
      updatedFormatted[`formatted_allergic_${i}`] = formattedAllergic;

      const neurologicalVal =
        formData[`neurological_symptom_${i}`] || defaultNoValue;
      const formattedNeuro = `${
        neurologicalSymptoms[i - 1]
      }: ${neurologicalVal}`;
      neurologicalTexts.push(formattedNeuro);
      updatedFormatted[`formatted_neuro_${i}`] = formattedNeuro;
    }

    setAllergicFormatted(allergicTexts);
    setNeurologicalFormatted(neurologicalTexts);

    setFormData(updatedFormatted);
  }, [formData, defaultNoValue]);

  const handleChange = (field, value) => {
    if (formData[field] !== value) {
      const updated = { ...formData, [field]: value };
      setFormData(updated);
      if (onReviewChange) {
        onReviewChange({ [field]: value });
      }
    }
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
                <div style={styles.inlineField}>
                  <label style={styles.inlineLabel}>
                    {allergicSymptoms[idx]}
                  </label>
                  <select
                    value={
                      formData[`allergic_symptom_${idx + 1}`] || defaultNoValue
                    }
                    onChange={(e) =>
                      handleChange(
                        `allergic_symptom_${idx + 1}`,
                        e.target.value
                      )
                    }
                    style={styles.select}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td style={styles.td}>
                <div style={styles.inlineField}>
                  <label style={styles.inlineLabel}>
                    {neurologicalSymptoms[idx]}
                  </label>
                  <select
                    value={
                      formData[`neurological_symptom_${idx + 1}`] ||
                      defaultNoValue
                    }
                    onChange={(e) =>
                      handleChange(
                        `neurological_symptom_${idx + 1}`,
                        e.target.value
                      )
                    }
                    style={styles.select}
                  >
                    {options.map((option, i) => (
                      <option key={i} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div style={{ marginTop: 20 }}>
        <h3>Formatted Allergic Symptoms</h3>
        {allergicFormatted.map((text, i) => (
          <li key={i}>{text}</li>
        ))}

        <h3>Formatted Neurological Symptoms</h3>
        {neurologicalFormatted.map((text, i) => (
          <li key={i}>{text}</li>
        ))}
      </div> */}

      <div style={styles.commentSection}>
        <label style={styles.commentLabel}>
          Interval Comments since last visit:
        </label>
        <input
          type="text"
          value={formData.intervalComments || ""}
          onChange={(e) => handleChange("intervalComments", e.target.value)}
          style={styles.commentInput}
          placeholder="Enter any relevant comments here"
        />
      </div>
    </div>
  );
};

export default ReviewOfSystems;
