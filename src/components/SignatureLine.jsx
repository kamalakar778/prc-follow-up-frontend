import React, { useState, useEffect, useCallback } from "react";

const SignatureLine = ({ onChange }) => {
  const buttonTexts = {
    "Dr. Klickovich":
      "personally performed todays follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter.  A clinic physician had previously performed the initial service evaluation of the patient while Dr. Robert Klickovich currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan.",
    APRN: "personally performed todays follow-up evaluation and treatment plan of the patient.",
    "Dr. Olivia Kelley":
      "personally performed todays follow-up evaluation and treatment plan of the patient, while Olivia Kelley, M.D. (locum tenens) (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during todays follow-up patient encounter.  A clinic physician had previously performed the initial service evaluation of the patient while Dr. Kelley currently remains actively involved in the patient's progress and treatment plan including approving changes in medication type, strength, or dosing interval or any other aspect of their care plan."
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
    return `${mm}/${dd}/${yyyy}`;
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

  // const formatOtherPlans = () => {
  //   return otherPlans
  //     .filter((line, idx, arr) => idx < arr.length - 1 || line.trim() !== "")
  //     // .map((line, idx) => `${line.trim() || "_________"}`)

  //     .map((line, idx) => `${idx + 1}. ${line.trim() || "_________"}`)
  //     .join("\n");
  // };
  const formatOtherPlans = () => {
    const filteredLines = otherPlans.filter(
      (line, idx, arr) => idx < arr.length - 1 || line.trim() !== ""
    );

    const lines = filteredLines.map(
      (line, idx) => `${idx + 1}. ${line.trim() || "_________"}`
    );

    return {
      // heading: "Other Plans:",
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

  return (
    <div>
      <h3>Other Plans:</h3>
      {otherPlans.map((plan, idx) => (
        <div key={idx}>
          <label>{idx + 1}.</label>{" "}
          <input
            type="text"
            value={plan}
            onChange={(e) => handleChangeOtherPlan(e, idx)}
          />
          {otherPlans.length > 1 && (
            <button onClick={(e) => handleRemoveOtherPlan(e, idx)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <h3>Facet, RFA, & ESI/Caudal Injection Notes:</h3>
      {lines.map((line, index) => (
        <div key={index}>
          {line}{" "}
          <em style={{ color: "orange" }}>
            <b>{(selectedOptions[index] || []).join(", ") || "(none)"}</b>
          </em>{" "}
          {lineDropdownOptions[index] && (
            <select value="" onChange={(e) => handleSelectChange(e, index)}>
              <option value="">-- Add option --</option>
              {lineDropdownOptions[index].map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          <button onClick={(e) => handleRemoveLine(e, index)}>Remove</button>
        </div>
      ))}

      <div>
        <button onClick={handleReset}>Reset</button>
      </div>

      <p>
        <b>Follow-up Appointment in:</b>{" "}
        <select
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

      <h3>Physician Signatures</h3>
      <div>
        {Object.keys(buttonTexts).map((name) => (
          <button
            key={name}
            onClick={(e) => handleButtonClick(e, name)}
            style={{
              margin: "5px",
              backgroundColor: selectedButton === name ? "orange" : "grey"
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div>
        Date Transcribed:{" "}
        <input
          type="date"
          value={dateTranscribed}
          onChange={(e) => setDateTranscribed(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SignatureLine;
