import React, { useState, useEffect } from "react";

const SignatureLine = ({ data, onChange }) => {

  // Predefined button statements
  const buttonTexts = {
    "Dr. Klickovich": `Robert Klickovich, M.D. personally performed the initial service evaluation and treatment plan of the patient.`,
    APRN: `personally performed today's follow-up evaluation and treatment plan of the patient, while Dr. Robert Klickovich (or different Physician noted/documented above) provided direct supervision of the APRN and was immediately available to assist if needed during today's follow-up patient encounter.`,
    "Dr. Olivia Kelley": `personally performed today's follow-up evaluation and treatment plan of the patient, while Olivia Kelley, M.D. (locum tenens) (or another physician) supervised.`,
  };

  // Initial notes lines
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

  const [lines, setLines] = useState(initialLines);
  const [otherPlans, setOtherPlans] = useState([""]);
  const [followUpAppointment, setFollowUpAppointment] =
    useState(initialFollowUp);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [lineDropdownOptions, setLineDropdownOptions] = useState({});
  const [selectedButton, setSelectedButton] = useState("");
  const [finalDocText, setFinalDocText] = useState("");

  const [physicianName, setPhysicianName] = useState("");
  const [signedBy, setSignedBy] = useState("");
  const [dateSigned, setDateSigned] = useState("");

  

  useEffect(() => {
    const defaultOptions = {};
    lines.forEach((_, index) => {
      defaultOptions[index] = optionMap[index] || [
        "Custom option A",
        "Custom option B"
      ];
    });
    setLineDropdownOptions(defaultOptions);
  }, [lines]);

  useEffect(() => {
    const selectedStatement = buttonTexts[selectedButton] || "";

    const processedLines = lines.map((line, index) => {
      const values = selectedOptions[index];
      if (!values || values.length === 0) {
        return `${line} {{option_${index + 1}}}`;
      } else {
        return `${line} ${values.join(", ")}`;
      }
    });

    const formattedOtherPlans = otherPlans
      .filter((line, idx, arr) => idx < arr.length - 1 || line.trim() !== "")
      .map((line, idx) => `${idx + 1}. ${line.trim() || "_________"}`)
      .join("\n");

    const staticNotes = `...`; // same as your static notes

    const fullDoc = `
${processedLines.join("\n")}

${staticNotes}

${selectedStatement}

Physician Name: ${physicianName}
Signed By: ${signedBy}
Date Signed: ${dateSigned}
`.trim();

    setFinalDocText(fullDoc);
    onChange(fullDoc); // <-- pass back final document
  }, [
    lines,
    selectedOptions,
    otherPlans,
    followUpAppointment,
    selectedButton,
    physicianName,
    signedBy,
    dateSigned
  ]);

  useEffect(() => {
    const formattedSignature = `
      Signature Section:
      Physician Name: ${physicianName}
      Signed By: ${signedBy}
      Date Signed: ${dateSigned}
      `.trim();

    onChange(formattedSignature); // Send formatted signature back to parent
  }, [physicianName, signedBy, dateSigned, onChange]);

  const selectedStatement = buttonTexts[selectedButton] || "";
  setFinalDocText(
    processedLines.join("\n") +
      "\n\n" +
      staticNotes.trim() +
      "\n\n" +
      selectedStatement.trim()
  );

  const handleSelectChange = (e, lineIndex) => {
    e.preventDefault();
    const value = e.target.value;
    if (!value) return;
    setSelectedOptions((prev) => {
      const existing = prev[lineIndex] || [];
      if (existing.includes(value)) return prev;
      return {
        ...prev,
        [lineIndex]: [...existing, value]
      };
    });
  };

  const handleRemoveLine = (e, indexToRemove) => {
    e.preventDefault();
    setLines((prevLines) =>
      prevLines.filter((_, index) => index !== indexToRemove)
    );
    setSelectedOptions((prevOptions) => {
      const updated = { ...prevOptions };
      delete updated[indexToRemove];
      return updated;
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setOtherPlans([""]);
    setSelectedOptions({});
    setLines(initialLines);
  };

  const handleChangeOtherPlan = (e, index) => {
    e.preventDefault();
    const value = e.target.value;
    const updated = [...otherPlans];
    updated[index] = value;
    if (index === otherPlans.length - 1 && value.trim() !== "") {
      updated.push("");
    }
    setOtherPlans(updated);
  };

  const handleRemoveOtherPlan = (e, index) => {
    e.preventDefault();
    const updated = otherPlans.filter((_, i) => i !== index);
    setOtherPlans(updated.length === 0 ? [""] : updated);
  };

  useEffect(() => {
    const processedLines = lines.map((line, index) => {
      const values = selectedOptions[index];
      if (!values || values.length === 0) {
        return `${line} {{option_${index + 1}}}`;
      } else {
        return `${line} ${values.join(", ")}`;
      }
    });

    const formattedOtherPlans = otherPlans
      .filter((line, idx, arr) => idx < arr.length - 1 || line.trim() !== "")
      .map((line, idx) => `${idx + 1}. ${line.trim() || "_________"}`)
      .join("\n");

    const staticNotes = `
Other Plans:
${formattedOtherPlans}

For the planned procedure(s), if any, considerable time was spent explaining the risks, benefits, and alternatives. All questions were answered, including common complications and remedies. Handouts were also given to the patient as appropriate, including procedure and educational videos at www.tinyurl.com/PROCEDURE-Oct2022. The patient was told to stop taking all anti-coagulant medications for 3-5 days.

Once the patient has fully engaged and completed the initial treatment plan as documented, Maximum Medical Improvement (MMI) will be achieved. Narcotics will be tapered down over 3-6 months as tolerated.

Follow-up Appointment in: ${followUpAppointment}

Taja Elder, APRN personally performed today's follow-up evaluation and treatment plan, while Olivia Kelley, M.D. (locum tenens) (or another physician) supervised.

This document(s) was dictated, transcribed, but not read and is subject to review and confirmation. Please contact the author if you have any concerns/clarifications.
`;

    setFinalDocText(processedLines.join("\n") + "\n\n" + staticNotes.trim());
  }, [lines, selectedOptions, otherPlans, followUpAppointment]);

 

  const handleButtonClick = (e, buttonName) => {
    e.preventDefault();
    setSelectedButton(buttonName);
  };

  return (
    <>
      <div>
        <h3>Other Plans:</h3>
        {otherPlans.map((plan, idx) => (
          <div key={idx} style={{ marginBottom: "5px" }}>
            <label>{idx + 1}.</label>{" "}
            <input
              type="text"
              value={plan}
              onChange={(e) => handleChangeOtherPlan(e, idx)}
              style={{ width: "300px" }}
            />
            {otherPlans.length > 1 && (
              <button
                onClick={(e) => handleRemoveOtherPlan(e, idx)}
                style={{ marginLeft: "5px" }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <h3>Facet, RFA, & ESI/Caudal Injection Notes:</h3>
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                {line} &nbsp;
                <em>
                  Current:{" "}
                  {(selectedOptions[index] || []).join(", ") || "(none)"}
                </em>{" "}
                &nbsp;
                {lineDropdownOptions[index] && (
                  <select
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
                <button onClick={(e) => handleRemoveLine(e, index)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <div style={{ marginTop: "15px" }}>
          <button onClick={handleReset}>Reset Section</button>
        </div>
      </div>

      <p>
        <b>Follow-up Appointment in:</b>
        <select
          value={followUpAppointment}
          onChange={(e) => {
            e.preventDefault();
            setFollowUpAppointment(e.target.value);
          }}
        >
          <option value="Four weeks">Four weeks</option>
          <option value="Two weeks">Two weeks</option>
          <option value="Three weeks">Three weeks</option>
          <option value="Six weeks">Six weeks</option>
          <option value="Eight weeks">Eight weeks</option>
          <option value="Twelve weeks">Twelve weeks</option>
          <option value="Several weeks after procedure">
            Several weeks after procedure
          </option>
          <option value="Yet to be determined">Yet to be determined</option>
          <option value="Discharge">Discharge</option>
        </select>
      </p>

      <h3>Final Document Output:</h3>
      <textarea
        value={finalDocText}
        readOnly
        rows="25"
        cols="80"
        style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}
      />

      <div>
        <button onClick={(e) => handleButtonClick(e, "Dr. Klickovich")}>
          Dr. Klickovich
        </button>
        <p>
          {selectedButton === "Dr. Klickovich" && buttonTexts["Dr. Klickovich"]}
        </p>
      </div>
      <div>
        <button onClick={(e) => handleButtonClick(e, "APRN")}>APRN</button>
        <p>{selectedButton === "APRN" && buttonTexts["APRN"]}</p>
      </div>
      <div>
        <button onClick={(e) => handleButtonClick(e, "Dr. Olivia Kelley")}>
          Dr. Olivia Kelley
        </button>
        <p>
          {selectedButton === "Dr. Olivia Kelley" &&
            buttonTexts["Dr. Olivia Kelley"]}
        </p>
      </div>

      {/* ---------------------- */}
      {/* <div>
        <h3>Signature Section</h3>
        <label>
          Physician Name:
          <input
            type="text"
            value={physicianName}
            onChange={(e) => setPhysicianName(e.target.value)}
            placeholder="Enter Physician Name"
          />
        </label>
        <br />
        <label>
          Signed By:
          <input
            type="text"
            value={signedBy}
            onChange={(e) => setSignedBy(e.target.value)}
            placeholder="Enter Who Signed"
          />
        </label>
        <br />
        <label>
          Date Signed:
          <input
            type="date"
            value={dateSigned}
            onChange={(e) => setDateSigned(e.target.value)}
          />
        </label>
      </div> */}

      <h3>Physician Signature Section</h3>
      <h3>Who Evaluated Today?</h3>
      {Object.keys(buttonTexts).map((name) => (
        <button
          key={name}
          onClick={(e) => handleButtonClick(e, name)}
          style={{
            marginRight: "10px",
            backgroundColor: selectedButton === name ? "lightblue" : "white"
          }}
        >
          {name}
        </button>
      ))}

      <div>
        <label>Physician Name: </label>
        <input
          type="text"
          value={physicianName}
          onChange={(e) => setPhysicianName(e.target.value)}
        />
      </div>
      <div>
        <label>Signed By: </label>
        <input
          type="text"
          value={signedBy}
          onChange={(e) => setSignedBy(e.target.value)}
        />
      </div>
      <div>
        <label>Date Signed: </label>
        <input
          type="date"
          value={dateSigned}
          onChange={(e) => setDateSigned(e.target.value)}
        />
      </div>
    </>
  );
};

export default SignatureLine;
