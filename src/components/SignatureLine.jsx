import React, { useState, useEffect, useCallback } from "react";

const SignatureLine = ({ onChange }) => {
  const buttonTexts = {
    "Dr. Klickovich":
      "personally performed todays follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter.  A clinic physician had previously performed the initial service evaluation of the patient while Dr. Robert Klickovich currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
    APRN: "personally performed todays follow-up evaluation and treatment plan of the patient.",
    "Dr. Olivia Kelley":
      "personally performed todays follow-up evaluation and treatment plan of the patient, while Olivia Kelley, M.D. (locum tenens) (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter.  A clinic physician had previously performed the initial service evaluation of the patient while Dr. Kelley currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
    "Signature Line Missing": "__________ Page # Point # __________ "
  };

    const optionMap = {
    0: [],
    1: [],
    2: [],
    3: [
      "greater than or equal to 50% pain relief from last RFA",
      "to date",
      "for 6 months",
      "greater than or equal to 50% improvement in ability to perform ADLs and/or overall function."
    ],
    4: ["Bilaterally", "Unilaterally"],
    5: [
      "At levels different from the fusion",
      "Posteriorly as fusion was done anteriorly"
    ],
    6: ["intermittently", "continuously", "FBSS", "FNSS"],
    7: ["HNP", "Bulging", "Protrusion", "Osteophytes", "DDD", "Stenosis", "FBNSS", "FBSS"],
    8: ["Overall quality of life","and function (ADLs)"],
    9: ["greater than or equal to 4 weeks of P.T./home exercise done","and unsuccessful P.T./home exercise program x4 weeks due to pain."],
    10: ["to date","50% relief", "Improved Function ADLs"],
    11: ["Different spinal level", "Different approach"]
  };

  const initialLines = [
    `Facet, RFA, & ESI/Caudal Injection:  Activity/exercise modifications discussed & implemented (eg McKenzie & stretching exercises).`,
    `MBB INITIAL:  The patient reports axial pain greater than or equal to x3 months AND NO untreated radicular pain AND Unsuccessful P.T./home exercise program x6 weeks AND decreased ADLs AND Medications tried.`,
    `RFA INITIAL:  The patient has received greater than or equal to 80% temporary pain relief from left, right and confirmatory bilateral MBB.`,
    `RFA REPEAT:The patient reports ${optionMap[3]} `,
    `RFA will be ordered: ${optionMap[4]}`,
    `RFA in patient with spinal fusion, will be done: ${optionMap[5]}`,
    `ESI/Caudal Indication: The patient reports history of greater than or equal to 4 weeks of radicular pain ${optionMap[6]}`,
    `ESI/Caudal Indication: Imaging shows: ${optionMap[7]}`,
    `ESI/Caudal Indication:  ${optionMap[8]} is significantly impacted due to radicular/FBSS pain complaints.`,
    `ESI/Caudal Indication: The patient reports ${optionMap[9]}`,
    `ESI/Caudal REPEAT SUCCESS: after last injection ${optionMap[10]}`,
    `ESI/Caudal REPEAT FAILURE: Will now use a ${optionMap[11]}`
  ];



  const followUpOptions = [
    "Two weeks",
    "Three weeks",
    "Four weeks",
    "Six weeks",
    "Eight weeks",
    "Twelve weeks",
    "Several weeks after procedure",
    "Yet to be determined",
    "Discharge"
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

  const [includedLines, setIncludedLines] = useState(initialLines.map(() => false));
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherPlans, setOtherPlans] = useState([""]);
  const [followUpAppointment, setFollowUpAppointment] = useState(initialFollowUp);
  const [customFollowUp, setCustomFollowUp] = useState("");
  const [selectedButton, setSelectedButton] = useState("Dr. Klickovich");
  const [dateTranscribed, setDateTranscribed] = useState(getTodayISO());

  const formatProcessedLines = useCallback(() => {
    const hasAnyInput =
      includedLines.some((inc) => inc) ||
      Object.values(selectedOptions).some((opts) => opts.length > 0);

    if (!hasAnyInput) return "";

    const lines = initialLines
      .map((line, idx) => {
        const opts = selectedOptions[idx] || [];
        const isSelected = opts.length > 0;
        const isIncluded = idx === 0 || includedLines[idx] || isSelected;
        if (!isIncluded) return null;
        const appended = isSelected ? ` ${opts.join(", ")}` : "";
        return `${line}${appended}`;
      })
      .filter(Boolean);

    return lines.join("\n");
  }, [selectedOptions, includedLines]);

  const formatOtherPlans = () => {
    const filteredLines = otherPlans.filter(
      (line, idx, arr) => idx < arr.length - 1 || line.trim() !== ""
    );

    return {
      lines: filteredLines.map(
        (line, idx) => `\t${idx + 1}. ${line.trim() || ""}`
      )
    };
  };

  useEffect(() => {
    const formattedOtherPlans = formatOtherPlans();
    const otherPlansOutput =
      formattedOtherPlans.lines.length > 0
        ? `Other Plans:\n${formattedOtherPlans.lines.join("\n")}`
        : "";

    onChange?.({
      otherPlans: otherPlansOutput,
      formattedLines: `\n${formatProcessedLines()}`,
      followUpAppointment: followUpAppointment || customFollowUp,
      signatureLine: buttonTexts[selectedButton] || "",
      dateTranscribed: formatDateToMMDDYYYY(dateTranscribed)
    });
  }, [
    selectedOptions,
    includedLines,
    otherPlans,
    followUpAppointment,
    customFollowUp,
    selectedButton,
    dateTranscribed
  ]);

  const handleOptionToggle = (lineIndex, option) => {
    setSelectedOptions((prev) => {
      const current = prev[lineIndex] || [];
      const exists = current.includes(option);
      const updated = exists
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [lineIndex]: updated };
    });
  };

  const styles = {
    button: {
      padding: "6px 12px",
      borderRadius: "4px",
      marginRight: "8px",
      border: "none",
      cursor: "pointer"
    },
    addButton: (active) => ({
      backgroundColor: active ? "#90ee90" : "#ccc",
      color: "#000",
      fontWeight: "bold",
      marginRight: "8px"
    }),
    optionButton: (isSelected) => ({
      cursor: "pointer",
      padding: "6px 10px",
      borderRadius: "8px",
      border: "1px solid",
      borderColor: isSelected ? "green" : "#999",
      backgroundColor: isSelected ? "#e0f7e9" : "#f0f0f0",
      color: isSelected ? "green" : "#333",
      marginRight: 6,
      marginBottom: 4,
      display: "inline-block",
      fontWeight: isSelected ? "bold" : "normal"
    }),
    physicianButton: (name, selected) => {
      if (!selected)
        return {
          backgroundColor: "#ccc",
          color: "#000",
          fontWeight: "bold"
        };
      const colorMap = {
        "Dr. Klickovich": "#2563eb",
        APRN: "#FF4C4C",
        "Dr. Olivia Kelley": "#4CAF50",
        "Signature Line Missing": "#ffd700"
      };
      return {
        backgroundColor: colorMap[name] || "#ccc",
        color: "white",
        fontWeight: "bold",
        padding: "10px 15px"
      };
    },
    input: {
      padding: "6px",
      marginRight: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "80%"
    },
    inputDate: {
      width: "15%",
      padding: "6px",
      marginRight: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc"
    },
    section: {
      border: "1px solid #ccc",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "16px",
      backgroundColor: "#f9f9f9"
    }
  };

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 1000, margin: "0 auto" }}>
      <div style={styles.section}>
        <h3>Other Plans:</h3>
        {otherPlans.map((plan, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <label>{idx + 1}.</label>
            <input
              type="text"
              style={styles.input}
              value={plan}
              onChange={(e) => {
                const copy = [...otherPlans];
                copy[idx] = e.target.value;
                if (idx === copy.length - 1 && e.target.value.trim() !== "")
                  copy.push("");
                setOtherPlans(copy);
              }}
            />
            {otherPlans.length > 1 && (
              <button
                style={{
                  ...styles.button,
                  backgroundColor: "#e74c3c",
                  color: "white"
                }}
                onClick={(e) => {
                  e.preventDefault();
                  const copy = otherPlans.filter((_, i) => i !== idx);
                  setOtherPlans(copy.length === 0 ? [""] : copy);
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h3>Facet, RFA, & ESI/Caudal Injection Notes:</h3>

        {initialLines.map((line, idx) => {
          const options = optionMap[idx] || [];
          const selected = selectedOptions[idx] || [];
          const isIncluded = idx === 0 || includedLines[idx] || selected.length > 0;

          return (
            <div key={idx} style={{ marginBottom: "12px" }}>
              {[1, 2].includes(idx) && (
                <button
                  style={styles.addButton(isIncluded)}
                  onClick={(e) => {
                    e.preventDefault();
                    const updated = [...includedLines];
                    updated[idx] = !updated[idx];
                    setIncludedLines(updated);
                  }}
                >
                  {isIncluded ? "Remove" : "Add"}
                </button>
              )}
              <span>{line}</span>
              <div style={{ marginTop: 4 }}>
                {options.map((opt, i) => (
                  <span
                    key={i}
                    style={styles.optionButton(selected.includes(opt))}
                    onClick={() => handleOptionToggle(idx, opt)}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        <button
          style={{ ...styles.button, backgroundColor: "#ddd", color: "#000" }}
          onClick={(e) => {
            e.preventDefault();
            setOtherPlans([""]);
            setSelectedOptions({});
            setIncludedLines(initialLines.map(() => false));
            setFollowUpAppointment(initialFollowUp);
            setCustomFollowUp("");
            setSelectedButton("Dr. Klickovich");
            setDateTranscribed(getTodayISO());
          }}
        >
          Reset
        </button>
      </div>

      <div style={styles.section}>
        <p>
          <strong>Follow-up Appointment in: </strong>
        </p>
        <div>
          {followUpOptions.map((opt) => {
            const isSelected = followUpAppointment === opt;
            return (
              <button
                key={opt}
                style={styles.optionButton(isSelected)}
                onClick={() => {
                  const newValue = followUpAppointment === opt ? "" : opt;
                  setFollowUpAppointment(newValue);
                  setCustomFollowUp(""); // clear custom when option selected
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: "8px" }}>
          <input
            type="text"
            placeholder="Or enter custom follow-up..."
            style={styles.input}
            value={customFollowUp}
            onChange={(e) => {
              setCustomFollowUp(e.target.value);
              setFollowUpAppointment(""); // clear option when custom input
            }}
          />
        </div>
      </div>

      <div style={styles.section}>
        <h3>Physician Signatures:&nbsp;&nbsp;
          {Object.keys(buttonTexts).map((name) => (
            <button
              key={name}
              style={{
                ...styles.button,
                ...styles.physicianButton(name, selectedButton === name)
              }}
              onClick={(e) => {
                e.preventDefault();
                setSelectedButton(name);
              }}
            >
              {name}
            </button>
          ))}
        </h3>
      </div>

      <div style={styles.section}>
        <label>Date Transcribed:</label>
        <input
          type="date"
          style={styles.inputDate}
          value={dateTranscribed}
          onChange={(e) => setDateTranscribed(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SignatureLine;
