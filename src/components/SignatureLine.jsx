import React, { useState, useEffect, useCallback } from "react";

const SignatureLine = ({ onChange }) => {
  const buttonTexts = {
    "Dr. Klickovich":
      "personally performed todays follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter. A clinic physician had previously performed the initial service evaluation of the patient while Dr. Robert Klickovich currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
    APRN:
      "personally performed todays follow-up evaluation and treatment plan of the patient.",
    "Dr. Olivia Kelley":
      "personally performed todays follow-up evaluation and treatment plan of the patient, while Olivia Kelley, M.D. (locum tenens) (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter. A clinic physician had previously performed the initial service evaluation of the patient while Dr. Kelley currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
    "Signature Line Missing": "__________ Page # Point # __________ ",
  };

  const initialLines = [
    `Facet, RFA, & ESI/Caudal Injection:  Activity/exercise modifications discussed & implemented (eg McKenzie & stretching exercises).`,
    `MBB INITIAL:  The patient reports axial pain greater than or equal to x3 months AND NO untreated radicular pain AND Unsuccessful P.T./home exercise program x6 weeks AND decreased ADLs AND Medications tried.`,
    `RFA INITIAL:  The patient has received greater than or equal to 80% temporary pain relief from left, right and confirmatory bilateral MBB.`,
    `RFA REPEAT:The patient reports `,
    `RFA will be ordered: `,
    `RFA in patient with spinal fusion, will be done: `,
    `ESI/Caudal Indication: The patient reports history of greater than or equal to 4 weeks of radicular pain `,
    `ESI/Caudal Indication: Imaging shows: `,
    `ESI/Caudal Indication: is significantly impacted due to radicular/FBSS pain complaints.`,
    `ESI/Caudal Indication: The patient reports `,
    `ESI/Caudal REPEAT SUCCESS: after last injection `,
    `ESI/Caudal REPEAT FAILURE: Will now use a `,
  ];

  const optionMap = {
    0: [],
    1: [],
    2: [],
    3: [
      "greater than or equal to 50% pain relief from last RFA",
      "to date",
      "for 6 months",
      "greater than or equal to 50% improvement in ability to perform ADLs and/or overall function.",
    ],
    4: ["Bilaterally", "Unilaterally"],
    5: ["At levels different from the fusion", "Posteriorly as fusion was done anteriorly"],
    6: ["intermittently", "continuously", "FBSS", "FNSS"],
    7: ["HNP", "Bulging", "Protrusion", "Osteophytes", "DDD", "Stenosis", "FBNSS", "FBSS"],
    8: ["Overall quality of life", "and function (ADLs)"],
    9: ["greater than or equal to 4 weeks of P.T./home exercise done", "and unsuccessful P.T./home exercise program x4 weeks due to pain."],
    10: ["to date", "50% relief", "Improved Function ADLs"],
    11: ["Different spinal level", "Different approach"],
  };

  const followUpOptions = [
    "Two weeks",
    "Three weeks",
    "Four weeks",
    "Six weeks",
    "Eight weeks",
    "Twelve weeks",
    "Several weeks after procedure",
    "Yet to be determined",
    "Discharge",
  ];

  const initialFollowUp = "Four weeks";

  const getTodayISO = () => new Date().toISOString().split("T")[0];

  const formatDateToMMDDYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const [includedLines, setIncludedLines] = useState({ 1: false, 2: false });
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherPlans, setOtherPlans] = useState([""]);
  const [followUpAppointment, setFollowUpAppointment] = useState(initialFollowUp);
  const [customFollowUp, setCustomFollowUp] = useState("");
  const [selectedButton, setSelectedButton] = useState("Dr. Klickovich");
  const [dateTranscribed, setDateTranscribed] = useState(getTodayISO());

  const formatProcessedLines = useCallback(() => {
    const lines = [initialLines[0]];
    if (includedLines[1]) lines.push(initialLines[1]);
    if (includedLines[2]) lines.push(initialLines[2]);

    for (let idx = 3; idx < initialLines.length; idx++) {
      const opts = selectedOptions[idx] || [];
      const isSelected = opts.length > 0;

      if (idx === 8 && isSelected) {
        lines.push(
          `ESI/Caudal Indication: ${opts.join(", ")} is significantly impacted due to radicular/FBSS pain complaints.`
        );
      } else {
        const appended = isSelected ? ` ${opts.join(", ")}` : "";
        if (isSelected || idx === 0) {
          lines.push(`${initialLines[idx]}${appended}`);
        }
      }
    }

    return lines.join("\n");
  }, [selectedOptions, includedLines]);

  const formatOtherPlans = () => {
    const filtered = otherPlans.filter((line, idx, arr) => idx < arr.length - 1 || line.trim() !== "");
    return {
      lines: filtered.map((line, idx) => `\t${idx + 1}. ${line.trim()}`),
    };
  };

  useEffect(() => {
    const formattedOtherPlans = formatOtherPlans();
    const otherPlansOutput =
      formattedOtherPlans.lines.length > 0 ? `Other Plans:\n${formattedOtherPlans.lines.join("\n")}` : "";

    onChange?.({
      otherPlans: otherPlansOutput,
      formattedLines: `\n${formatProcessedLines()}`,
      followUpAppointment: customFollowUp || followUpAppointment,
      signatureLine: buttonTexts[selectedButton] || "",
      dateTranscribed: formatDateToMMDDYYYY(dateTranscribed),
    });
  }, [
    selectedOptions,
    otherPlans,
    followUpAppointment,
    customFollowUp,
    selectedButton,
    dateTranscribed,
    formatProcessedLines,
    includedLines,
  ]);

  const handleOptionToggle = (lineIndex, option) => {
    setSelectedOptions((prev) => {
      const current = prev[lineIndex] || [];
      const updated = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [lineIndex]: updated };
    });
  };

  const toggleIncludeLine = (lineIndex) => {
    setIncludedLines((prev) => ({
      ...prev,
      [lineIndex]: !prev[lineIndex],
    }));
  };

  const sectionWrapperStyle = {
    border: "1px solid #ccc",
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
    backgroundColor: "#fafafa",
  };

  const styles = {
    optionButton: (isSelected) => ({
      cursor: "pointer",
      padding: "5px 15px",
      borderRadius: "6px",
      border: "1px solid",
      borderColor: isSelected ? "green" : "#999",
      backgroundColor: isSelected ? "#e0f7e9" : "#f0f0f0",
      color: isSelected ? "green" : "#333",
      marginRight: 4,
      marginBottom: 4,
      display: "inline-block",
      fontWeight: isSelected ? "bold" : "normal",
      fontSize: 14,
      lineHeight: 1.2,
    }),
    includeToggleButton: (included) => ({
      cursor: "pointer",
      padding: "2px 8px",
      borderRadius: 4,
      border: "1px solid",
      borderColor: included ? "green" : "#999",
      backgroundColor: included ? "#d9f0d9" : "#f0f0f0",
      color: included ? "green" : "#555",
      fontSize: 12,
      fontWeight: included ? "bold" : "normal",
      marginLeft: 8,
    }),
    physicianButton: (name, selected) => {
      const colorMap = {
        "Dr. Klickovich": "#2563eb",
        APRN: "#FF4C4C",
        "Dr. Olivia Kelley": "#4CAF50",
        "Signature Line Missing": "#ffd700",
      };

      return {
        backgroundColor: selected ? colorMap[name] : "#ccc",
        color: selected ? "white" : "#000",
        fontWeight: "bold",
        padding: "10px 15px",
        borderRadius: 4,
        marginRight: 8,
        cursor: "pointer",
        border: "none",
      };
    },
    label: {
      fontWeight: "bold",
      fontSize: 16,
      display: "block",
      marginBottom: 8,
    },
    inputText: {
      minWidth: "80%",
      padding: "4px 6px",
      margin:"0px 0px",
      fontSize: 14,
      borderRadius: 3,
      border: "1px solid rgb(209, 213, 219)",
    },
    lineContainer: {
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #ccc",
      paddingBottom: 8,
    },
  };

  return (
    <div>
      {/* Other Plans */}
      <div style={sectionWrapperStyle}>
        <label style={styles.label}>Other Plans:</label>
        {otherPlans.map((line, idx) => {
          const isLast = idx === otherPlans.length - 1;
          const isEmpty = line.trim() === "";
          return (
            <div key={idx} style={{ display: "flex", alignItems: "flex-start", marginBottom: 8 }}>
              <label style={{ marginRight: 8, marginTop: 4 }}>{idx + 1}.</label>
              <input
                type="text"
                value={line}
                onChange={(e) => {
                  let linesCopy = [...otherPlans];
                  linesCopy[idx] = e.target.value;
                  linesCopy = linesCopy.filter((line, i) => line.trim() !== "" || i === linesCopy.length - 1);
                  if (linesCopy.length === 0 || linesCopy[linesCopy.length - 1].trim() !== "") {
                    linesCopy.push("");
                  }
                  setOtherPlans(linesCopy);
                }}
                style={styles.inputText}
                placeholder="Enter other plan"
                disabled={isEmpty && !isLast}
              />
            </div>
          );
        })}
      </div>

      {/* Procedure Lines */}
      <div style={sectionWrapperStyle}>
        <label style={styles.label}>Procedure Lines:</label>
        {initialLines.map((line, idx) => {
          if (idx === 1 || idx === 2) {
            return (
              <div key={idx} style={styles.lineContainer}>
                <button
                  type="button"
                  onClick={() => toggleIncludeLine(idx)}
                  style={styles.includeToggleButton(includedLines[idx])}
                >
                  {includedLines[idx] ? "Remove" : "Add"}
                </button>
                <div>{line}</div>
              </div>
            );
          }

          return (
            <div key={idx} style={styles.lineContainer}>
              <div>{line}</div>
              {optionMap[idx]?.length > 0 && (
                <div>
                  {optionMap[idx].map((opt) => {
                    const isSelected = selectedOptions[idx]?.includes(opt) || false;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleOptionToggle(idx, opt)}
                        style={styles.optionButton(isSelected)}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Follow-up */}
      <div style={sectionWrapperStyle}>
        <label style={styles.label}>Follow-up Appointment:</label>
        <div>
          {followUpOptions.map((opt) => {
            const isSelected = followUpAppointment === opt && !customFollowUp;
            return (
              <button
                key={opt}
                onClick={() => {
                  setFollowUpAppointment(opt);
                  setCustomFollowUp("");
                }}
                style={styles.optionButton(isSelected)}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={customFollowUp}
          onChange={(e) => {
            setCustomFollowUp(e.target.value);
            setFollowUpAppointment("");
          }}
          placeholder="Specify custom follow-up"
          style={{ fontSize: 14, padding: "4px 4px", marginTop: 4, width: "100%" }}
        />
      </div>

      {/* Signature Line */}
      <div style={sectionWrapperStyle}>
        <label style={styles.label}>Physician Signature Line:</label>
        {Object.keys(buttonTexts).map((name) => (
          <button
            key={name}
            onClick={() => setSelectedButton(name)}
            style={styles.physicianButton(name, selectedButton === name)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Date Transcribed */}
      <div style={sectionWrapperStyle}>
        <label style={styles.label}>Date Transcribed:</label>
        <input
          type="date"
          value={dateTranscribed}
          onChange={(e) => setDateTranscribed(e.target.value)}
          style={{ ...styles.inputText, maxWidth: 150 }}
        />
      </div>
    </div>
  );
};

export default SignatureLine;
