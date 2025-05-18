import React, { useState, useEffect } from "react";

const SignatureLine = ({ data, onChange }) => {
  const initialLines = [
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

  const defaultFollowUp = "Four weeks";

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

  const [lines, setLines] = useState(initialLines);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherPlans, setOtherPlans] = useState([""]);
  const [followUpAppointment, setFollowUpAppointment] = useState(defaultFollowUp);
  const [finalDocText, setFinalDocText] = useState("");
  const [physicianName, setPhysicianName] = useState("");
  const [signedBy, setSignedBy] = useState("");
  const [dateSigned, setDateSigned] = useState("");

  const handleOptionChange = (e, index) => {
    const value = e.target.value;
    if (!value) return;

    setSelectedOptions((prev) => {
      const updated = [...(prev[index] || [])];
      if (!updated.includes(value)) {
        updated.push(value);
      }
      return { ...prev, [index]: updated };
    });
  };

  const handleLineRemove = (indexToRemove) => {
    setLines((prev) => prev.filter((_, i) => i !== indexToRemove));
    setSelectedOptions((prev) => {
      const updated = { ...prev };
      delete updated[indexToRemove];
      return updated;
    });
  };

  const handleReset = () => {
    setLines(initialLines);
    setSelectedOptions({});
    setOtherPlans([""]);
  };

  const handleOtherPlanChange = (e, index) => {
    const updated = [...otherPlans];
    updated[index] = e.target.value;

    // Add new empty input at the end
    if (index === otherPlans.length - 1 && e.target.value.trim()) {
      updated.push("");
    }
    setOtherPlans(updated);
  };

  const handleOtherPlanRemove = (index) => {
    const updated = otherPlans.filter((_, i) => i !== index);
    setOtherPlans(updated.length ? updated : [""]);
  };

  const generateFinalDocText = () => {
    const compiledLines = lines.map((line, idx) => {
      const options = selectedOptions[idx];
      return `${line} ${options?.join(", ") || `{{option_${idx + 1}}}`}`;
    });

    const compiledPlans = otherPlans
      .filter((plan, i, arr) => i < arr.length - 1 || plan.trim())
      .map((plan, idx) => `${idx + 1}. ${plan.trim() || "_________"}`)
      .join("\n");

    const signatureNotes = `
Other Plans:
${compiledPlans}

For the planned procedure(s), if any, considerable time was spent explaining the risks, benefits, and alternatives. All questions were answered, including common complications and remedies. Handouts were also given to the patient as appropriate, including procedure and educational videos at www.tinyurl.com/PROCEDURE-Oct2022. The patient was told to stop taking all anti-coagulant medications for 3-5 days.

Once the patient has fully engaged and completed the initial treatment plan as documented, Maximum Medical Improvement (MMI) will be achieved. Narcotics will be tapered down over 3-6 months as tolerated.

Follow-up Appointment in: ${followUpAppointment}

Taja Elder, APRN personally performed today's follow-up evaluation and treatment plan, while Olivia Kelley, M.D. (locum tenens) (or another physician) supervised.

This document(s) was dictated, transcribed, but not read and is subject to review and confirmation. Please contact the author if you have any concerns/clarifications.
`;

    setFinalDocText(`${compiledLines.join("\n")}\n\n${signatureNotes.trim()}`);
  };

  useEffect(generateFinalDocText, [lines, selectedOptions, otherPlans, followUpAppointment]);

  useEffect(() => {
    const signature = `
Signature Section:
Physician Name: ${physicianName}
Signed By: ${signedBy}
Date Signed: ${dateSigned}
`.trim();
    onChange(signature);
  }, [physicianName, signedBy, dateSigned, onChange]);

  return (
    <div>
      <h3>Other Plans:</h3>
      {otherPlans.map((plan, idx) => (
        <div key={idx} style={{ marginBottom: "5px" }}>
          <label>{idx + 1}.</label>{" "}
          <input
            type="text"
            value={plan}
            onChange={(e) => handleOtherPlanChange(e, idx)}
            style={{ width: "300px" }}
          />
          {otherPlans.length > 1 && (
            <button onClick={() => handleOtherPlanRemove(idx)}>Remove</button>
          )}
        </div>
      ))}

      <h3>Injection Notes:</h3>
      {lines.map((line, idx) => (
        <div key={idx} style={{ marginBottom: "15px" }}>
          <div>
            <strong>{line}</strong> &nbsp;
            <em>
              Current: {(selectedOptions[idx] || []).join(", ") || "(none)"}
            </em>{" "}
            &nbsp;
            <select value="" onChange={(e) => handleOptionChange(e, idx)}>
              <option value="">-- Add option --</option>
              {(optionMap[idx] || ["Custom option A", "Custom option B"]).map(
                (opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>{" "}
            <button onClick={() => handleLineRemove(idx)}>Remove</button>
          </div>
        </div>
      ))}

      <div>
        <button onClick={handleReset}>Reset Section</button>
      </div>

      <div style={{ marginTop: "20px" }}>
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
      </div>

      <h3>Final Document Output:</h3>
      <textarea
        value={finalDocText}
        readOnly
        rows="25"
        cols="80"
        style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}
      />
    </div>
  );
};

export default SignatureLine;
