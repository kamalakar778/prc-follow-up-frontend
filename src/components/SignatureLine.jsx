import React, { useState, useEffect, useCallback } from "react";

const SignatureLine = ({ onChange }) => {
  const buttonTexts = {
    "Dr. Klickovich":
      "personally performed todays follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter.  A clinic physician had previously performed the initial service evaluation of the patient while Dr. Robert Klickovich currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
    "APRN": "personally performed todays follow-up evaluation and treatment plan of the patient.",
    "Dr. Olivia Kelley":
    "personally performed todays follow-up evaluation and treatment plan of the patient, while Olivia Kelley, M.D. (locum tenens) (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter.  A clinic physician had previously performed the initial service evaluation of the patient while Dr. Kelley currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
    "Signature Line Missing": "__________ Page # Point # __________ ",
  };

  const initialLines = [
    "Facet, RFA, & ESI/Caudal Injection Notes:",
    "MBB INITIAL:",
    "RFA INITIAL:",
    "RFA REPEAT:",
    "RFA will be ordered:",
    "RFA with spinal fusion:",
    "ESI/Caudal Indication:",
    "ESI/Caudal Indication:",
    "ESI/Caudal Indication:",
    "ESI/Caudal Indication:",
    "ESI/Caudal REPEAT SUCCESS:  ",
    "ESI/Caudal REPEAT FAILURE:  "
  ];

  const optionMap = {
    0: [""],
    1: ["Left", "Right", "Confirmatory Bilateral MBB"],
    2: ["≥ 50% relief", "≥ 50% ADL improvement"],
    3: ["Bilateral", "Unilateral", "Left only", "Right only"],
    4: ["Different levels", "Posterior approach"],
    5: ["Intermittently", "Continuously", "FBSS", "FNSS"],
    6: ["HNP", "Bulging", "Protrusion"],
    7: ["ADLs impacted", "Severe radicular pain"],
    8: ["Completed PT", "Unsuccessful PT due to pain"],
    9: ["50% relief", "Improved ADLs"],
    10: ["Different spinal level", "Different approach"],
    11: ["Recurrent symptoms", "Consider surgery"]
  };

  const initialFollowUp = "Four weeks";

  const getTodayFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`; // ISO format for input[type="date"]
  };

  const [lines, setLines] = useState(initialLines);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherPlans, setOtherPlans] = useState([""]);
  const [followUpAppointment, setFollowUpAppointment] =
    useState(initialFollowUp);
  const [selectedButton, setSelectedButton] = useState("");
  const [dateTranscribed, setDateTranscribed] = useState(getTodayFormatted());

  const lineDropdownOptions = lines.reduce((acc, _, idx) => {
    acc[idx] = optionMap[idx] || ["Custom option A", "Custom option B"];
    return acc;
  }, {});

  const formatProcessedLines = useCallback(() => {
    return lines
      .map((line, idx) => {
        const opts = selectedOptions[idx];
        if (!opts || opts.length === 0) return null;
        return `${line} ${opts.join(", ")}`;
      })
      .filter(Boolean)
      .join("\n");
  }, [lines, selectedOptions]);

  const formatOtherPlans = () => {
    const filteredLines = otherPlans.filter(
      (line, idx, arr) => idx < arr.length - 1 || line.trim() !== ""
    );

    const lines = filteredLines.map(
      (line, idx) => `${idx + 1}. ${line.trim() || "_________"}`
    );

    return {
      lines
    };
  };

  useEffect(() => {
    if (onChange) {
      onChange({
        otherPlans: formatOtherPlans(),
        formattedLines: formatProcessedLines(),
        followUpAppointment,
        signatureLine: buttonTexts[selectedButton] || "_________________",
        dateTranscribed
      });
    }
  }, [
    selectedOptions,
    lines,
    followUpAppointment,
    selectedButton,
    dateTranscribed,
    otherPlans,
    onChange,
    formatOtherPlans,
    formatProcessedLines,
    buttonTexts
  ]);

  const handleSelectChange = (e, lineIndex) => {
    const value = e.target.value;
    if (!value) return;
    setSelectedOptions((prev) => {
      const existing = prev[lineIndex] || [];
      if (existing.includes(value)) return prev;
      return { ...prev, [lineIndex]: [...existing, value] };
    });
  };

  const handleRemoveLine = (e, indexToRemove) => {
    e.preventDefault();
    setLines((prev) => prev.filter((_, i) => i !== indexToRemove));
    setSelectedOptions((prev) => {
      const copy = { ...prev };
      delete copy[indexToRemove];
      return copy;
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setOtherPlans([""]);
    setSelectedOptions({});
    setLines(initialLines);
    setSelectedButton("");
    setDateTranscribed(getTodayFormatted());
    setFollowUpAppointment(initialFollowUp);
  };

  const handleChangeOtherPlan = (e, idx) => {
    const val = e.target.value;
    setOtherPlans((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      if (idx === copy.length - 1 && val.trim() !== "") copy.push("");
      return copy;
    });
  };

  const handleRemoveOtherPlan = (e, idx) => {
    e.preventDefault();
    setOtherPlans((prev) => {
      const copy = prev.filter((_, i) => i !== idx);
      return copy.length === 0 ? [""] : copy;
    });
  };

  const handleButtonClick = (e, name) => {
    e.preventDefault();
    setSelectedButton(name);
  };

  const styles = {
    containerStyle: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "1000px",
      margin: "0 auto"
    },

    section: {
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "16px",
      backgroundColor: "#f9f9f9"
    },
    label: { fontWeight: "bold", marginRight: "8px" },
    input: {
      padding: "6px",
      marginRight: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "80%"
    },
    select: {
      padding: "6px",
      marginRight: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc"
    },
    button: {
      padding: "6px 12px",
      borderRadius: "4px",
      marginRight: "8px",
      border: "none",
      cursor: "pointer"
    },
    removeButton: {
      backgroundColor: "#e74c3c",
      color: "white"
    },
    physicianButton: (active) => ({
      backgroundColor: active ? "#ffa500" : "#ccc",
      color: "#000",
      fontWeight: "bold"
    })
  };

  return (
    <div style={styles.containerStyle}>
      <div style={styles.section}>
        <h3>Other Plans:</h3>
        {otherPlans.map((plan, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <label style={styles.label}>{idx + 1}.</label>
            <input
              type="text"
              style={styles.input}
              value={plan}
              onChange={(e) => handleChangeOtherPlan(e, idx)}
            />
            {otherPlans.length > 1 && (
              <button
                style={{ ...styles.button, ...styles.removeButton }}
                onClick={(e) => handleRemoveOtherPlan(e, idx)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h3>Facet, RFA, & ESI/Caudal Injection Notes:</h3>
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <span>{line} </span>
            <em style={{ color: "orange", fontWeight: "bold" }}>
              {(selectedOptions[index] || []).join(", ") || "(none)"}
            </em>{" "}
            {lineDropdownOptions[index] && (
              <select
                style={styles.select}
                value=""
                onChange={(e) => handleSelectChange(e, index)}
              >
                <option value="">-- Add option --</option>
                {lineDropdownOptions[index].map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            <button
              style={{ ...styles.button, ...styles.removeButton }}
              onClick={(e) => handleRemoveLine(e, index)}
            >
              Remove
            </button>
          </div>
        ))}
        <button style={styles.button} onClick={handleReset}>
          Reset
        </button>
      </div>

      <div style={styles.section}>
        <p>
          <strong>Follow-up Appointment in:</strong>{" "}
          <select
            style={styles.select}
            value={followUpAppointment}
            onChange={(e) => setFollowUpAppointment(e.target.value)}
          >
            {[
              "Four weeks",
              "Two weeks",
              "Three weeks",
              "Six weeks",
              "Eight weeks",
              "Twelve weeks",
              "Several weeks after procedure",
              "Yet to be determined",
              "Discharge"
            ].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </p>
      </div>

      <div style={styles.section}>
        <h3>Physician Signatures</h3>
        {Object.keys(buttonTexts).map((name) => (
          <button
            key={name}
            style={{
              ...styles.button,
              ...styles.physicianButton(selectedButton === name)
            }}
            onClick={(e) => handleButtonClick(e, name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Date Transcribed:</label>
        <input
          type="date"
          style={styles.input}
          value={dateTranscribed}
          onChange={(e) => setDateTranscribed(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SignatureLine;
