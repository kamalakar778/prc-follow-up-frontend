import React, { useState, useEffect, useCallback } from "react";

const SignatureLine = ({ onChange }) => {
  const buttonTexts = {
    "Dr. Klickovich": `Robert Klickovich, M.D. personally performed the initial service evaluation and treatment plan of the patient.`,
    APRN: `personally performed today's follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during today's follow-up patient encounter.`,
    "Dr. Olivia Kelley": `personally performed today's follow-up evaluation and treatment plan of the patient, while Olivia Kelley, M.D. (locum tenens) (or another physician) supervised.`
  };

  const initialLines = [
    "Facet, RFA, & ESI/Caudal Injection Notes:",
    "MBB INITIAL:  The patient reports axial pain...",
    "RFA INITIAL:  The patient has received 80% temporary relief...",
    "RFA REPEAT:  The patient reports 50% pain relief for 6 months...",
    "RFA will be ordered...",
    "RFA with spinal fusion...",
    "ESI/Caudal Indication:  Patient reports 4 weeks of radicular pain...",
    "ESI/Caudal Indication:  Imaging shows...",
    "ESI/Caudal Indication:  Quality of life and function impacted...",
    "ESI/Caudal Indication:  Patient completed 4 weeks of PT...",
    "ESI/Caudal REPEAT SUCCESS:  50% pain relief OR improved function...",
    "ESI/Caudal REPEAT FAILURE:  Try different spinal level or approach..."
  ];

  const optionMap = {
    0: ["≥ 3 months", "≥ 6 weeks", "ADL reduced", "Medications tried"],
    1: ["Left", "Right", "Confirmatory Bilateral MBB"],
    2: ["≥ 50% relief", "≥ 50% ADL improvement"],
    3: ["Bilateral", "Unilateral", "Left only", "Right only"],
    4: ["Different levels", "Posterior approach"],
    5: ["Intermittently", "Continuously", "FBSS", "FNSS"],
    6: ["HNP", "Bulging", "Protrusion"],
    7: ["ADLs impacted", "Severe radicular pain"],
    8: ["Completed PT", "Unsuccessful PT due to pain"],
    9: ["50% relief", "Improved ADLs"],
    10: ["Different spinal level", "Different approach"]
  };

  const initialFollowUp = "Four weeks";
  const getTodayFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [lines, setLines] = useState(initialLines);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherPlans, setOtherPlans] = useState([""]);
  const [followUpAppointment, setFollowUpAppointment] = useState(initialFollowUp);
  const [selectedButton, setSelectedButton] = useState("");
  const [dateTranscribed, setdateTranscribed] = useState(getTodayFormatted());

  const lineDropdownOptions = lines.reduce((acc, _, idx) => {
    acc[idx] = optionMap[idx] || ["Custom option A", "Custom option B"];
    return acc;
  }, {});

  const formatProcessedLines = useCallback(() => {
    return lines.map((line, idx) => {
      const opts = selectedOptions[idx];
      if (!opts || opts.length === 0) return `${line} {{option_${idx + 1}}}`;
      return `${line} ${opts.join(", ")}`;
    });
  }, [lines, selectedOptions]);

  const formatOtherPlans = () => {
    return otherPlans
      .filter((line, idx, arr) => idx < arr.length - 1 || line.trim() !== "")
      .map((line, idx) => `${idx + 1}. ${line.trim() || "_________"}`)
      .join("\n");
  };

  // === Section Variables ===
  const section1 = `Other Plans:\n${formatOtherPlans()}`;
  const section2 = formatProcessedLines().join("\n");
  const section3 = `Follow-up Appointment in: ${followUpAppointment}`;
  const section4 = `${buttonTexts[selectedButton] || ""}\n\nDate Signed: ${dateTranscribed}`;

  // === Notify parent with updated values ===
  useEffect(() => {
    if (onChange) {
      onChange({
        section1,
        section2,
        section3,
        section4
      });
    }
  }, [section1, section2, section3, section4, onChange]);

  // === Handlers ===
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
    setdateTranscribed(getTodayFormatted());
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
            <button onClick={(e) => handleRemoveOtherPlan(e, idx)}>Remove</button>
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
          onChange={(e) => setdateTranscribed(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SignatureLine;
