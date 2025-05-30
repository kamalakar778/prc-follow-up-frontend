import React, { useEffect, useState } from "react";
import QualitativePainList from "./QualitativePainList";

const baselineOptions = ["continuous", "no"];
const exacerbationOptions = ["frequent", "no"];
const workingStatusOptions = [
  "no",
  "Full-time",
  "Part-time",
  "Self-employed",
  "Seeking employment",
  "Unemployed",
  "Homemaker",
  "Retired",
  "Disabled",
  "Seeking disability",
  "Going to school"
];

const styles = {
  input: {
    width: "80px",
    padding: "6px",
    margin: "4px 8px",
    border: "0.1px solid #ccc",
    borderRadius: "4px"
  },
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    marginBottom: "8px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexWrap: "wrap"
  },
  fullWidthInput: {
    width: "95%",
    padding: "6px",
    margin: "4px 0",
    border: "0.1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box"
  },
  select: {
    width: "120px",
    padding: "6px",
    margin: "4px 8px",
    border: "0.1px solid #ccc",
    borderRadius: "4px"
  },
  flexWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px"
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px"
  },
  fontCalibri: {
    fontFamily: "Calibri"
  },
  optionButton: (isSelected) => ({
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "gray",
    backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    color: isSelected ? "green" : "gray",
    fontWeight: isSelected ? "bold" : "normal",
    transition: "all 0.3s ease"
  })
};

const CharacteristicsOfPain = ({ formData, onUpdate }) => {
  const [state, setState] = useState({
    baseline: "continuous",
    exacerbation: "frequent",
    average: "",
    best: "",
    withMeds: "",
    withoutMeds: "",
    selectedWorkingStatus: Array.isArray(formData.workingStatus)
      ? formData.workingStatus
      : formData.workingStatus
      ? [formData.workingStatus]
      : [],
    customWorkingStatus: "",
    comments: ""
  });

  useEffect(() => {
    const {
      baseline,
      exacerbation,
      average,
      best,
      withMeds,
      withoutMeds,
      selectedWorkingStatus,
      customWorkingStatus,
      comments
    } = state;

    const workingStatus = [
      ...selectedWorkingStatus,
      ...(customWorkingStatus ? [customWorkingStatus] : [])
    ].join(", ");

    const temporally = `${baseline || "_"} baseline pain with ${exacerbation || "_"} painful exacerbations.`;
    const getVal = (v) => (v === "" ? "_" : v);
    const numericScaleFormatted = `Average: ${getVal(average)}/10. Best: ${getVal(best)}/10. W/meds: ${getVal(withMeds)}/10. W/o meds: ${getVal(withoutMeds)}/10.`;

    onUpdate({
      pain: {
        ...formData.pain,
        temporally,
        numericScaleFormatted,
        workingStatus,
        comments: comments ? `Comments: ${comments}` : ""
      }
    });
  }, [state, onUpdate, formData.pain]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusClick = (option) => {
    setState((prev) => {
      const alreadySelected = prev.selectedWorkingStatus.includes(option);
      const updatedStatus = alreadySelected
        ? prev.selectedWorkingStatus.filter((item) => item !== option)
        : [...prev.selectedWorkingStatus, option];

      return {
        ...prev,
        selectedWorkingStatus: updatedStatus
      };
    });
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.flexWrap}>
          <label>
            <strong>Temporally:</strong>
            <select
              name="baseline"
              style={styles.select}
              value={state.baseline}
              onChange={handleChange}
            >
              {baselineOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            baseline pain with
            <select
              name="exacerbation"
              style={styles.select}
              value={state.exacerbation}
              onChange={handleChange}
            >
              {exacerbationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            painful exacerbations
          </label>
        </div>
      </div>

      <div style={styles.container}>
        <QualitativePainList
          formData={formData.pain}
          updateFormData={(newValues) => {
            onUpdate({ pain: { ...formData.pain, ...newValues } });
          }}
        />
      </div>

      <div style={{ ...styles.container, ...styles.fontCalibri }}>
        <strong>Numeric Scale (each out of 10):</strong>
        <div style={styles.flexWrap}>
          {["average", "best", "withMeds", "withoutMeds"].map((field) => (
            <label key={field} style={styles.label}>
              {field === "withMeds"
                ? "W/meds:"
                : field === "withoutMeds"
                ? "W/o meds:"
                : `${field.charAt(0).toUpperCase() + field.slice(1)}:`}
              <input
                type="text"
                name={field}
                style={styles.input}
                value={state[field]}
                onChange={handleChange}
                placeholder="0-10"
              />
            </label>
          ))}
        </div>
      </div>

      <div style={styles.container}>
        <div style={{ ...styles.label, flexDirection: "column", alignItems: "flex-start" }}>
          <strong>Working status of:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
            {workingStatusOptions.map((option) => {
              const isSelected = state.selectedWorkingStatus.includes(option);
              return (
                <span
                  key={option}
                  onClick={() => handleStatusClick(option)}
                  style={styles.optionButton(isSelected)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleStatusClick(option);
                    }
                  }}
                >
                  {option}
                </span>
              );
            })}
          </div>
          <label style={{ marginTop: "8px", width: "100%" }}>
            <strong>Additional details: </strong>
            <textarea
              name="customWorkingStatus"
              style={styles.fullWidthInput}
              value={state.customWorkingStatus}
              onChange={handleChange}
              placeholder="Enter additional details..."
              rows={2}
            />
          </label>
        </div>
      </div>

      <div style={{ ...styles.container, ...styles.fontCalibri }}>
        <label>Comments: </label>
        <input
          name="comments"
          style={styles.fullWidthInput}
          value={state.comments}
          onChange={handleChange}
          placeholder="Optional comments"
        />
      </div>
    </div>
  );
};

export default CharacteristicsOfPain;
