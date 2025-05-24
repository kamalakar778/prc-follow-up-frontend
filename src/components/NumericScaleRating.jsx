import React, { useEffect, useState } from "react";
import QualitativePainList from "./QualitativePainList";

const baselineOptions = ["continuous", "no"];
const exacerbationOptions = ["frequent", "no"];

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
  }
};

const CharacteristicsOfPain = ({ formData, onUpdate }) => {
  const [state, setState] = useState({
    baseline: "no",
    exacerbation: "no",
    average: "",
    best: "",
    withMeds: "",
    withoutMeds: "",
    workingStatus: formData.workingStatus || "no",
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
      workingStatus,
      comments
    } = state;

    const temporally = `${baseline || "_"} baseline pain with ${
      exacerbation || "_"
    } painful exacerbations.`;
    const getVal = (v) => (v === "" ? "_" : v);
    const numericScaleFormatted = `Average: ${getVal(
      average
    )}/10. Best: ${getVal(best)}/10. W/meds: ${getVal(
      withMeds
    )}/10. W/o meds: ${getVal(withoutMeds)}/10.`;

    // onUpdate({
    //   temporally,
    //   numericScaleFormatted,
    //   workingStatus,
    //   comments: comments ? `Comments: ${comments}` : ""
    // });
    onUpdate({
      pain: {
        ...formData.pain, // ensure you retain qualitativePain and others
        temporally,
        numericScaleFormatted,
        workingStatus,
        comments: comments ? `Comments: ${comments}` : ""
      }
    });
  }, [state, onUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value
    }));
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
        {/* <QualitativePainList
          formData={formData}
          updateFormData={(newValues) => {
            onUpdate({ ...newValues }); // relay up to Form.jsx
          }}
        /> */}
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
        <label style={styles.label}>
          Working status of:
          <select
            name="workingStatus"
            style={styles.select}
            value={state.workingStatus}
            onChange={handleChange}
          >
            {[
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
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
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
