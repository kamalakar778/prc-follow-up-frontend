import React, { useState, useEffect, useCallback } from "react";
import QualitativePainList from "./QualitativePainList";

const inputNumericStyle = {
  width: "80px",
  padding: "6px",
  margin: "4px 8px",
  border: "0.1px solid #ccc",
  borderRadius: "4px"
};

const inputStyle = {
  width: "150px",
  padding: "6px",
  margin: "4px 8px",
  border: "0.1px solid #ccc",
  borderRadius: "4px"
};

const inputCommentStyle = {
  width: "95%",
  padding: "6px",
  margin: "4px 0", // remove horizontal margin for cleaner full-width alignment
  border: "0.1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box" // ensures padding doesn't exceed container
};

const labelStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px"
};

const sectionStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "8px",
  backgroundColor: "#f9f9f9",
  display: "flex"
};
const sectionFormatStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "8px",
  backgroundColor: "#f9f9f9",
  fontfamily: "Calibri",

  // display:"flex"
};
const headingStyle = {
  fontSize: "1.25rem",
  fontWeight: "bold"
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
          withoutMeds: match[4] || ""
        }
      : {
          average: "",
          best: "",
          withMeds: "",
          withoutMeds: ""
        };
  };

  const [values, setValues] = useState(
    parseNumericScale(formData.numericScale)
  );

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
            style={inputNumericStyle}
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
  const [overrideTemporally, setOverrideTemporally] = useState(false);

  useEffect(() => {
    if (formData.qualitatively !== qualitative) {
      setQualitative(formData.qualitatively || "");
    }
  }, [formData.qualitatively, qualitative]);

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

  useEffect(() => {
    if (!formData.temporally) {
      const defaultPrimary = "Continuous";
      const defaultSecondary = "Frequent painful exacerbations";
      const combined = `'${defaultPrimary}' baseline pain with '${defaultSecondary}' painful exacerbations.`;
      onUpdate({
        temporallyPrimary: defaultPrimary,
        temporallySecondary: defaultSecondary,
        temporally: combined
      });
    }
  }, [formData.temporally, onUpdate]);

  useEffect(() => {
    if (overrideTemporally) {
      onUpdate({ temporally: "______ Page # Point # __________" });
    } else if (formData.temporallyPrimary && formData.temporallySecondary) {
      const formatted = `'${formData.temporallyPrimary}' baseline pain with '${formData.temporallySecondary}' painful exacerbations.`;
      onUpdate({ temporally: formatted });
    }
  }, [
    overrideTemporally,
    formData.temporallyPrimary,
    formData.temporallySecondary,
    onUpdate
  ]);

  return (
    <div>
      <div style={sectionStyle}>
        {!overrideTemporally && (
          <label style={labelStyle}>
            Temporally it is:
            <select
              style={inputStyle}
              value={formData.temporallyPrimary || "Continuous"}
              onChange={(e) => {
                const newPrimary = e.target.value;
                const secondary = formData.temporallySecondary || "";
                const combined = `'${newPrimary}' baseline pain with '${secondary}' painful exacerbations.`;
                onUpdate({
                  temporallyPrimary: newPrimary,
                  temporally: combined
                });
              }}
            >
              <option value="Continuous">Continuous</option>
              <option value="No">No</option>
            </select>
            <span style={{ margin: "0 8px" }}>baseline pain with</span>
            <select
              style={inputStyle}
              value={formData.temporallySecondary || "Frequent"}
              onChange={(e) => {
                const primary = formData.temporallyPrimary || "";
                const newSecondary = e.target.value;
                const combined = `'${primary}' baseline pain with '${newSecondary}' painful exacerbations.`;
                onUpdate({
                  temporallySecondary: newSecondary,
                  temporally: combined
                });
              }}
            >
              <option value="Frequent">Frequent</option>
              <option value="No">No</option>
            </select>
            <span style={{ margin: "0 8px" }}>painful exacerbations </span>
          </label>
        )}
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={overrideTemporally}
            onChange={(e) => setOverrideTemporally(e.target.checked)}
            style={{ marginRight: "10px" }}
          />
          Nothing checked
        </label>
      </div>

      <div style={sectionStyle}>
        <QualitativePainList updateFormData={updateQualitativeData} />
      </div>

      <div style={sectionFormatStyle}>
        <strong>Numeric Scale (each out of 10):</strong>
        <NumericScaleInput formData={formData} onUpdate={onUpdate} />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          Working status of:
          <select
            name="workingStatus"
            style={inputStyle}
            value={formData.workingStatus || ""}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
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
              "Going to school"
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={sectionFormatStyle}>
        <label>Comments (Compliance, MRI, X-ray etc):</label>
        <input
            name="comments"
            style={inputCommentStyle}
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
                  value: `Comments (Compliance, MRI, X-ray etc): ${e.target.value}`
                }
              })
            }
          />
      </div>
    </div>
  );
};

export default CharacteristicsOfPain;
