import React, { useState, useEffect, useCallback } from "react";

const buttonTexts = {
  "Dr. Klickovich":
    "personally performed todays follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter. A clinic physician had previously performed the initial service evaluation of the patient while Dr. Robert Klickovich currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
  APRN: "personally performed todays follow-up evaluation and treatment plan of the patient.",
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

// Styles object shared by all containers
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
  },
  inputText: {
    flex: "1 1 0%",
    minWidth: "5%",
    padding: "4px 6px",
    fontSize: 14,
    borderRadius: 3,
    border: "1px solid rgb(209, 213, 219)",
  },
  section: { marginBottom: 12 },
  lineContainer: {
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ccc",
    paddingBottom: 8,
  },
};

// Other Plans container
const OtherPlansContainer = ({ otherPlans, setOtherPlans }) => {
  return (
    <div style={styles.section}>
      <label style={styles.label}>Other Plans:</label>
      {otherPlans.map((line, idx) => {
        const isLast = idx === otherPlans.length - 1;
        const isEmpty = line.trim() === "";
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <label style={{ marginRight: 8, marginTop: 4 }}>{idx + 1}.</label>
            <input
              type="text"
              value={line}
              onChange={(e) => {
                let linesCopy = [...otherPlans];
                linesCopy[idx] = e.target.value;
                linesCopy = linesCopy.filter((line, i) => {
                  return line.trim() !== "" || i === linesCopy.length - 1;
                });
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
  );
};

// Procedure Lines container
const ProcedureLinesContainer = ({
  initialLines,
  optionMap,
  selectedOptions,
  handleOptionToggle,
  includedLines,
  toggleIncludeLine,
}) => {
  return (
    <div style={styles.section}>
      {initialLines.map((line, idx) => {
        // Lines 1 & 2 have add/remove toggle buttons
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
              <div 
              // style={{ flex: "1 1 auto" }}
              >{line}</div>
            </div>
          );
        }

        // Other lines with options
        return (
          <div key={idx} style={styles.lineContainer}>
            <div 
            // style={{ flex: "1 1 auto" }}
            >{line}</div>
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
  );
};

// Follow-up container
const FollowUpContainer = ({
  followUpOptions,
  followUpAppointment,
  setFollowUpAppointment,
  customFollowUp,
  setCustomFollowUp,
}) => {
  return (
    <div style={styles.section}>
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
        style={{
          fontSize: 14,
          padding: "4px 4px",
          marginTop: 4,
          width: "100%",
        }}
      />
    </div>
  );
};

// Signature Line container
const SignatureLineContainer = ({ buttonTexts, selectedButton, setSelectedButton }) => {
  return (
    <div style={styles.section}>
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
  );
};

// Date Transcribed container
const DateTranscribedContainer = ({ dateTranscribed, setDateTranscribed }) => {
  return (
    <div style={styles.section}>
      <label style={styles.label}>Date Transcribed:</label>
      <input
        type="date"
        value={dateTranscribed}
        onChange={(e) => setDateTranscribed(e.target.value)}
        style={{ fontSize: 16, padding: 6 }}
      />
    </div>
  );
};

// Main SignatureLine component
const SignatureLine = ({ onChange }) => {
  const [otherPlans, setOtherPlans] = useState([""]);
  const [includedLines, setIncludedLines] = useState({ 1: true, 2: true }); // Only lines 1 and 2 toggleable
  const [selectedOptions, setSelectedOptions] = useState({});
  const [followUpAppointment, setFollowUpAppointment] = useState(initialFollowUp);
  const [customFollowUp, setCustomFollowUp] = useState("");
  const [selectedButton, setSelectedButton] = useState("Signature Line Missing");
  const [dateTranscribed, setDateTranscribed] = useState(getTodayISO());

  // Toggle include/remove line 1 or 2
  const toggleIncludeLine = useCallback(
    (idx) => {
      setIncludedLines((prev) => ({ ...prev, [idx]: !prev[idx] }));
      // Reset options for removed lines
      if (includedLines[idx]) {
        setSelectedOptions((prev) => {
          const copy = { ...prev };
          delete copy[idx];
          return copy;
        });
      }
    },
    [includedLines]
  );

  // Toggle options for procedure lines
  const handleOptionToggle = useCallback((lineIdx, option) => {
    setSelectedOptions((prev) => {
      const current = prev[lineIdx] || [];
      if (current.includes(option)) {
        return { ...prev, [lineIdx]: current.filter((o) => o !== option) };
      } else {
        return { ...prev, [lineIdx]: [...current, option] };
      }
    });
  }, []);

  // Compose formatted lines based on current state
  const formattedLines = React.useMemo(() => {
    const lines = [];

    // Add included initial lines 1 and 2
    if (includedLines[1]) lines.push(initialLines[1]);
    if (includedLines[2]) lines.push(initialLines[2]);

    // For other lines with options
    for (let i = 3; i < initialLines.length; i++) {
      const baseLine = initialLines[i];
      const opts = selectedOptions[i] || [];

      if (opts.length === 0) {
        // No options selected, just include base line
        lines.push(baseLine);
      } else {
        // Combine base line with selected options text
        if (i === 3) {
          // special formatting for line 3 with multiple options joined by commas
          lines.push(baseLine + " " + opts.join(", ") + ".");
        } else if (i === 4 || i === 5) {
          // line 4 & 5 options joined with " and "
          lines.push(baseLine + " " + opts.join(" and ") + ".");
        } else if (i === 6 || i === 7 || i === 8 || i === 9) {
          // lines 6-9 append options joined by ", "
          lines.push(baseLine + " " + opts.join(", ") + ".");
        } else if (i === 10 || i === 11) {
          // lines 10 and 11 append options joined by " and "
          lines.push(baseLine + " " + opts.join(" and ") + ".");
        } else {
          lines.push(baseLine);
        }
      }
    }

    // Append Other Plans lines
    const otherPlansClean = otherPlans.filter((l) => l.trim() !== "");
    if (otherPlansClean.length > 0) {
      lines.push(...otherPlansClean);
    }

    return lines;
  }, [includedLines, selectedOptions, otherPlans]);

  // Compose follow-up appointment text
  const followUpText = customFollowUp
    ? customFollowUp
    : followUpAppointment
    ? followUpAppointment
    : "";

  // Compose signature line text
  const signatureLine = buttonTexts[selectedButton] || "";

  // Combine all final output data
  const output = {
    otherPlans,
    formattedLines,
    followUpAppointment: followUpText,
    signatureLine,
    dateTranscribed,
  };

  // Inform parent onChange when any input changes
  useEffect(() => {
    onChange && onChange(output);
  }, [output, onChange]);

  return (
    <div>
      <OtherPlansContainer otherPlans={otherPlans} setOtherPlans={setOtherPlans} />

      <ProcedureLinesContainer
        initialLines={initialLines}
        optionMap={optionMap}
        selectedOptions={selectedOptions}
        handleOptionToggle={handleOptionToggle}
        includedLines={includedLines}
        toggleIncludeLine={toggleIncludeLine}
      />

      <FollowUpContainer
        followUpOptions={followUpOptions}
        followUpAppointment={followUpAppointment}
        setFollowUpAppointment={setFollowUpAppointment}
        customFollowUp={customFollowUp}
        setCustomFollowUp={setCustomFollowUp}
      />

      <SignatureLineContainer
        buttonTexts={buttonTexts}
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />

      <DateTranscribedContainer dateTranscribed={dateTranscribed} setDateTranscribed={setDateTranscribed} />
    </div>
  );
};

export default SignatureLine;
