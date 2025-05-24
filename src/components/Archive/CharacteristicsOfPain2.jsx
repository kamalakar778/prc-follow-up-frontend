import React, { useEffect } from "react";
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
  margin: "4px 0",
  border: "0.1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box"
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
  display: "flex",
  flexWrap: "wrap"
};

const sectionFormatStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "8px",
  backgroundColor: "#f9f9f9",
  fontFamily: "Calibri"
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

  const [values, setValues] = React.useState(
    parseNumericScale(formData.numericScale)
  );

  useEffect(() => {
    setValues(parseNumericScale(formData.numericScale));
  }, []);

  useEffect(() => {
    const formatted = `Average: ${values.average || "__"}/10. Best: ${
      values.best || "__"
    }/10. W/meds: ${values.withMeds || "__"}/10. W/o meds: ${
      values.withoutMeds || "__"
    }/10.`;
    onUpdate({ numericScale: formatted });
  }, [values]);

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
  const [temporalValues, setTemporalValues] = React.useState({
    baseline: "continuous",
    exacerbation: "frequent"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "comments") {
      onUpdate({ [name]: `Comments: ${value}` });
    } else if (name === "baseline" || name === "exacerbation") {
      setTemporalValues((prev) => ({ ...prev, [name]: value }));
    } else {
      onUpdate({ [name]: value });
    }
  };

  useEffect(() => {
    const { baseline, exacerbation } = temporalValues;
    const formattedText = `Temporally it is: ${baseline} baseline pain with ${exacerbation} painful exacerbations.`;
    onUpdate({ temporally: formattedText });
  }, [temporalValues]);

  // Call once on mount to initialize temporally
  useEffect(() => {
    const { baseline, exacerbation } = temporalValues;
    const formattedText = `Temporally it is: ${baseline} baseline pain with ${exacerbation} painful exacerbations.`;
    onUpdate({ temporally: formattedText });
  }, []);

  return (
    <div>
      <div style={sectionStyle}>
        <QualitativePainList
          formData={formData}
          updateFormData={(newData) => onUpdate(newData)}
        />
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

      <div style={sectionStyle}>
        <strong>Temporally:</strong>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <label style={labelStyle}>
            Baseline pain:
            <select
              name="baseline"
              style={inputStyle}
              value={temporalValues.baseline}
              onChange={handleChange}
            >
              <option value="continuous">continuous</option>
              <option value="no">no</option>
            </select>
          </label>
          <label style={labelStyle}>
            Painful exacerbations:
            <select
              name="exacerbation"
              style={inputStyle}
              value={temporalValues.exacerbation}
              onChange={handleChange}
            >
              <option value="frequent">frequent</option>
              <option value="no">no</option>
            </select>
          </label>
        </div>
      </div>

      <div style={sectionFormatStyle}>
        <label>Comments: </label>
        <input
          name="comments"
          style={inputCommentStyle}
          value={formData.comments?.replace("Comments: ", "") || ""}
          onChange={(e) =>
            handleChange({
              target: {
                name: "comments",
                value: e.target.value
              }
            })
          }
        />
      </div>
    </div>
  );
};

export default CharacteristicsOfPain;
