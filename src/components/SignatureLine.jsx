import React, { useState, useEffect, useCallback, useMemo } from "react";

const SignatureLine = ({
  onChange,
  dateOfEvaluation,
  followUpValue,
  setFollowUpValue,
  hasNowSchedule,
  onHasNowSchedule
}) => {
  const getTodayISO = () => new Date().toISOString().split("T")[0];

  const [otherPlans, setOtherPlans] = useState([""]);
  const [includedLines, setIncludedLines] = useState({ 1: false, 2: false });
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedFollowUpOptions, setSelectedFollowUpOptions] = useState([]);
  const [customFollowUpInput, setCustomFollowUpInput] = useState("");
  const [selectedButton, setSelectedButton] = useState("Dr. Klickovich");
  const [dateTranscribed, setDateTranscribed] = useState(getTodayISO());
  const [hasManuallySelectedButton, setHasManuallySelectedButton] = useState(false);

  const followUpOptions = useMemo(() => [
    "One week", "Two weeks", "Three weeks", "Four weeks",
    "Six weeks", "Twelve weeks", "Several weeks after procedure",
    "PRN (as needed)", "No further follow-up", "Yet to be determined"
  ], []);

  const initialLines = useMemo(() => [
    `Facet, RFA, & ESI/Caudal Injection:  Activity/exercise modifications discussed & implemented (eg McKenzie & stretching exercises).`,
    `MBB INITIAL:  The patient reports axial pain greater than or equal to x3 months AND NO untreated radicular pain AND Unsuccessful P.T./home exercise program x6 weeks AND decreased ADLs AND Medications tried.`,
    `RFA INITIAL:  The patient has received greater than or equal to 80% temporary pain relief from left, right and confirmatory bilateral MBB.`,
    `RFA REPEAT:The patient reports `, `RFA will be ordered: `, `RFA in patient with spinal fusion, will be done: `,
    `ESI/Caudal Indication: The patient reports history of greater than or equal to 4 weeks of radicular pain `,
    `ESI/Caudal Indication: Imaging shows: `,
    `ESI/Caudal Indication: is significantly impacted due to radicular/FBSS pain complaints.`,
    `ESI/Caudal Indication: The patient reports `,
    `ESI/Caudal REPEAT SUCCESS: after last injection `,
    `ESI/Caudal REPEAT FAILURE: Will now use a `
  ], []);

  const optionMap = useMemo(() => ({
    0: [], 1: [], 2: [], 3: [
      "greater than or equal to 50% pain relief from last RFA", "to date", "for 6 months",
      "greater than or equal to 50% improvement in ability to perform ADLs and/or overall function."
    ],
    4: ["Bilaterally", "Unilaterally"],
    5: ["At levels different from the fusion", "Posteriorly as fusion was done anteriorly"],
    6: ["intermittently", "continuously", "FBSS", "FNSS"],
    7: ["HNP", "Bulging", "Protrusion", "Osteophytes", "DDD", "Stenosis", "FBNSS", "FBSS"],
    8: ["Overall quality of life", "and function (ADLs)"],
    9: ["greater than or equal to 4 weeks of P.T./home exercise done", "and unsuccessful P.T./home exercise program x4 weeks due to pain."],
    10: ["for 3 months", "to date", "50% pain relief", "Improved Function ADLs"],
    11: ["Different spinal level", "Different approach"]
  }), []);

  const buttonTexts = useMemo(() => ({
         "Dr. Olivia Kelley": `personally performed todays follow-up evaluation and treatment plan of the patient, while Olivia Kelley, M.D. (locum tenens) (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter. A clinic physician had previously performed the initial service evaluation of the patient while Dr. Kelley currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.`,
      "Dr. Klickovich": `personally performed todays follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter. A clinic physician had previously performed the initial service evaluation of the patient while Dr. Robert Klickovich currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.`,
      APRN: `personally performed todays follow-up evaluation and treatment plan of the patient.`,
      "Signature Line Missing": "__________ Page # Point # __________ "
  }), []);



  const formatDateToMMDDYYYY = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getWeekdayFromDate = (dateString) => {
    if (!dateString) return "";
    const [month, day, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const dayOfWeek = getWeekdayFromDate(dateOfEvaluation);

  useEffect(() => {
    if (!hasManuallySelectedButton) {
      switch (dayOfWeek) {
        case "Monday":
        case "Tuesday":
          setSelectedButton("APRN");
          // setSelectedButton("Dr. Olivia Kelley");
          break;
        case "Wednesday":
        case "Thursday":
          setSelectedButton("Dr. Klickovich");
          break;
        case "Friday":
          setSelectedButton("APRN");
          break;
        default:
          break;
      }
    }
  }, [dayOfWeek, hasManuallySelectedButton, dateOfEvaluation]);

  useEffect(() => {
    const defaultVal = hasNowSchedule ? followUpOptions[6] : followUpOptions[3];
    if (!selectedFollowUpOptions.includes(defaultVal) && !customFollowUpInput) {
      setSelectedFollowUpOptions([defaultVal]);
    }
  }, [hasNowSchedule, followUpOptions]);

  const formatProcessedLines = useCallback(() => {
    const hasIncluded = includedLines[1] || includedLines[2];
    const hasSelected = Object.values(selectedOptions).some((opts) => opts.length > 0);
    if (!hasIncluded && !hasSelected) return "";

    const lines = [initialLines[0]];
    if (includedLines[1]) lines.push(initialLines[1]);
    if (includedLines[2]) lines.push(initialLines[2]);

    for (let idx = 3; idx < initialLines.length; idx++) {
      const opts = selectedOptions[idx] || [];
      if (!opts.length && idx !== 0) continue;
      if (idx === 8) {
        lines.push(`ESI/Caudal Indication: ${opts.join(", ")} is significantly impacted due to radicular/FBSS pain complaints.`);
      } else {
        lines.push(`${initialLines[idx]}${opts.length ? ` ${opts.join(", ")}` : ""}`);
      }
    }

    return lines.join("\n");
  }, [selectedOptions, includedLines, initialLines]);

  const formattedOtherPlans = useMemo(() => {
    const filtered = otherPlans.filter((line, idx, arr) => idx < arr.length - 1 || line.trim());
    return filtered.map((line, idx) => `\t${idx + 1}. ${line.trim()}`);
  }, [otherPlans]);

  useEffect(() => {
    const combinedFollowUps = [...selectedFollowUpOptions];
    if (customFollowUpInput.trim()) combinedFollowUps.push(customFollowUpInput.trim());
    const followUpSummary = combinedFollowUps.join(", ");

    setFollowUpValue(followUpSummary);
    onChange?.({
      otherPlans: formattedOtherPlans.length ? `Other Plans:\n${formattedOtherPlans.join("\n")}` : "",
      formattedLines: `\n${formatProcessedLines()}`,
      followUpAppointment: followUpSummary,
      signatureLine: buttonTexts[selectedButton] || "",
      dateTranscribed: formatDateToMMDDYYYY(dateTranscribed)
    });
  }, [selectedOptions, otherPlans, selectedFollowUpOptions, customFollowUpInput, selectedButton, dateTranscribed, formatProcessedLines, formattedOtherPlans, includedLines, buttonTexts, onChange]);

  const toggleOption = (lineIndex, option) => {
    setSelectedOptions((prev) => {
      const updated = prev[lineIndex]?.includes(option)
        ? prev[lineIndex].filter((o) => o !== option)
        : [...(prev[lineIndex] || []), option];
      return { ...prev, [lineIndex]: updated };
    });
  };

  const toggleLine = (lineIndex) => {
    setIncludedLines((prev) => ({ ...prev, [lineIndex]: !prev[lineIndex] }));
  };

  const styles = {
    section: { border: "1px solid #ccc", padding: 12, marginBottom: 16, borderRadius: 6, backgroundColor: "#fafafa" },
    label: { fontWeight: "bold", fontSize: 16, display: "block", marginBottom: 8 },
    signatureLineWrapper: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" },
    signatureButtons: { display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 },
    evaluationContainer: {
      display: "flex", flexDirection: "column", alignItems: "flex-start",
      padding: "8px", marginTop: "-30px", marginRight: "30%",
      border: "1px dashed #ccc", borderRadius: "6px",
      backgroundColor: "#fdfdfd", minWidth: "160px"
    },
    optionBtn: (selected) => ({
      flexDirection: "column", cursor: "pointer", padding: "5px 8px",
      borderRadius: "6px", border: "1px solid", borderColor: selected ? "green" : "#999",
      backgroundColor: selected ? "#e0f6e9" : "#f0f0f0", color: selected ? "green" : "#333",
      marginRight: 3, marginLeft: 3, fontSize: 16, fontWeight: selected ? "bold" : "normal"
    }),
    addRemoveBtn: (selected) => ({
      border: "none", padding: "2px 5px", borderRadius: "4px", cursor: "pointer",
      fontSize: "14px", minWidth: "40px", whiteSpace: "nowrap",
      backgroundColor: selected ? "#dc2626" : "#16a34a", color: "white"
    }),
    physicianBtn: (name, selected) => {
      const colorMap = {
        "Dr. Klickovich": "#2563eb", APRN: "#FF4C4C",
        "Dr. Olivia Kelley": "#4CAF50", "Signature Line Missing": "#ffd700"
      };
      return {
        backgroundColor: selected ? colorMap[name] : "#ccc",
        color: selected ? "white" : "#000", fontWeight: "bold",
        padding: "10px 15px", borderRadius: 4, marginRight: 8,
        cursor: "pointer", border: "none"
      };
    },

    
    inputText: {
      width: "80%", padding: "5px 12px", fontSize: 15, borderRadius: 8, margin:"0px 0px",
      border: "1px solid #d1d5db", backgroundColor: "#f3fafc", margin: "4px 0",
      fontFamily: "inherit", lineHeight: 1,
      transition: "box-shadow 0.2s, border-color 0.2s",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
    },
    lineWrap: { marginBottom: 4, display: "flex", borderBottom: "2px solid #ccc", paddingBottom: 4 }
  };

  return (
    <div>
      <div style={styles.section}>
        <label style={styles.label}>Other Plans / Instructions:</label>
        {otherPlans.map((line, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "flex-start", marginBottom: 0 }}>
            <label style={{ marginRight: 8, marginTop: 10 }}>{idx + 1}.</label>
            <input
              type="text"
              value={line}
              onChange={(e) => {
                const updated = [...otherPlans];
                updated[idx] = e.target.value;

                if (idx === updated.length - 1 && e.target.value.trim() !== "") {
                  updated.push("");
                }

                const cleaned = updated.filter((val, i) =>
                  i === updated.length - 1 || val.trim() !== ""
                );

                setOtherPlans(cleaned);
              }}
              style={styles.inputText}
              placeholder="Enter other plan"
            />
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Procedure Lines:</label>
        {initialLines.map((line, idx) => (
          <div key={idx} style={styles.lineWrap}>
            {(idx === 1 || idx === 2) && (
              <button
                onClick={() => toggleLine(idx)}
                style={styles.addRemoveBtn(includedLines[idx])}
              >
                {includedLines[idx] ? "Remove" : "Add"}
              </button>
            )}
            <div style={{ fontSize: "15px" }}>{line}</div>
            {optionMap[idx]?.length > 0 && (
              <div>
                {optionMap[idx].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleOption(idx, opt)}
                    style={styles.optionBtn(selectedOptions[idx]?.includes(opt))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Follow-Up Appointment:</label>
        <div>
          {followUpOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setSelectedFollowUpOptions([opt]);
                setCustomFollowUpInput("");
              }}
              style={styles.optionBtn(selectedFollowUpOptions.includes(opt))}
            >
              {opt}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Custom follow-up"
          value={customFollowUpInput}
          onChange={(e) => {
            setCustomFollowUpInput(e.target.value);
            setSelectedFollowUpOptions([]);
          }}
          style={styles.inputText}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Physician Signature Line:</label>
        <div style={styles.signatureLineWrapper}>
          <div style={styles.signatureButtons}>
            {Object.keys(buttonTexts).map((name) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedButton(name);
                  setHasManuallySelectedButton(true);
                }}
                style={styles.physicianBtn(name, selectedButton === name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div style={styles.evaluationContainer}>
            <label style={{ ...styles.label, marginBottom: 4 }}>Evaluation Date:</label>
            <div style={{ fontSize: 16 }}>{dateOfEvaluation || "N/A"}</div>
            {dayOfWeek && <div style={{ fontSize: 16 }}>{dayOfWeek}</div>}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Date Transcribed:</label>
        <input
          type="date"
          value={dateTranscribed}
          onChange={(e) => setDateTranscribed(e.target.value)}
          style={{ ...styles.inputText, fontSize: 18, fontWeight: "bold", minWidth: 80, maxWidth: 150 }}
        />
      </div>
    </div>
  );
};

export default SignatureLine;
