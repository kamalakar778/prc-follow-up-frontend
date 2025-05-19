import React, { useState, useEffect, useCallback } from "react";
import QualitativePainList from "./QualitativePainList";

const inputStyle = {
  width: "100px",
  padding: "6px",
  margin: "4px 8px",
  border: "0.1px solid #ccc",
  borderRadius: "4px",
};

const labelStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};

const sectionStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "20px",
  backgroundColor: "#f9f9f9",
};

const headingStyle = {
  fontSize: "1.25rem",
  fontWeight: "bold",
  marginBottom: "12px",
};

const NumericScaleInput = ({ formData, onUpdate }) => {
  const parseNumericScale = (scale = "") => {
    const regex =
      /Average:\s*(\d*)\/10\.\s*Best:\s*(\d*)\/10\.\s*W\/meds:\s*(\d*)\/10\.\s*W\/o meds:\s*(\d*)\/10/;
    const match = scale.match(regex);
    return match
      ? {
          average: match[1] || "",
          best: match[2] || "",
          withMeds: match[3] || "",
          withoutMeds: match[4] || "",
        }
      : {
          average: "",
          best: "",
          withMeds: "",
          withoutMeds: "",
        };
  };

  const [values, setValues] = useState(parseNumericScale(formData.numericScale));

  useEffect(() => {
    const formatted = `Average: ${values.average || "__"}/10. Best: ${
      values.best || "__"
    }/10. W/meds: ${values.withMeds || "__"}/10. W/o meds: ${
      values.withoutMeds || "__"
    }/10.`;
    onUpdate({ numericScale: formatted });
  }, [values, onUpdate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value) && Number(value) <= 10) {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {["average", "best", "withMeds", "withoutMeds"].map((field) => (
        <label key={field} style={labelStyle}>
          {field === "withMeds"
            ? "W/meds (/10):"
            : field === "withoutMeds"
            ? "W/o meds (/10):"
            : `${field.charAt(0).toUpperCase() + field.slice(1)} (/10):`}
          <input
            type="text"
            name={field}
            style={inputStyle}
            value={values[field]}
            onChange={handleInputChange}
            maxLength={2}
            placeholder="0-10"
          />
        </label>
      ))}
    </div>
  );
};

const CharacteristicsOfPain = ({ formData, onUpdate }) => {
  const [qualitative, setQualitative] = useState(formData.qualitatively || "");

  // Update local qualitative if formData changes externally
  useEffect(() => {
    if (formData.qualitatively !== qualitative) {
      setQualitative(formData.qualitatively || "");
    }
  }, [formData.qualitatively, qualitative]);

  // Callback to update qualitative both locally and upstream
  const updateQualitativeData = useCallback(
    (qualitativeData) => {
      setQualitative(qualitativeData);
      onUpdate({ qualitatively: qualitativeData });
    },
    [onUpdate]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  return (
    <div>
      {/* <h3 style={headingStyle}>CHARACTERISTICS OF PAIN INCLUDE:</h3> */}

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Temporally it is:
          <input
            type="text"
            name="temporally"
            style={{...inputStyle, width: "80%"}}
            value={formData.temporally || ""}
            onChange={handleChange}
          />
        </label>
      </div>

      <div style={sectionStyle}>
        <QualitativePainList updateFormData={updateQualitativeData} />
      </div>

      <div style={sectionStyle}>
        <label style={headingStyle}>Numeric Scale (each out of 10):</label>
        <NumericScaleInput formData={formData} onUpdate={onUpdate} />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Working status of:
          <input
            list="working-status-options"
            name="workingStatus"
            placeholder="Working Status"
            style={inputStyle}
            value={formData.workingStatus || ""}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => onUpdate({ workingStatus: "" })}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </label>
        <datalist id="working-status-options">
          {[
            "Full-time",
            "Part-time",
            "Self-employed",
            "Seeking employment",
            "Unemployed",
            "Homemaker",
            "Retired",
            "Disabled",
            "Seeking disability",
            "Going to school",
          ].map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>

      <div style={sectionStyle}>
          <strong>Comments (Compliance, MRI, X-ray etc):</strong>
        <label style={labelStyle}>
          <input
            name="comments"
            style={{...inputStyle, width: "100%"}}
            value={
              formData.comments?.replace(
                "Comments (Compliance, MRI, X-ray etc): ",
                ""
              ) || ""
            }
            onChange={(e) =>
              handleChange({
                target: {
                  name: "comments",
                  value: `Comments (Compliance, MRI, X-ray etc): ${e.target.value}`,
                },
              })
            }
          />
        </label>
      </div>
    </div>
  );
};

export default CharacteristicsOfPain;
