import React, { useState, useEffect } from "react";

const styles = {
  section: {
    marginBottom: "4px ",
    padding: "8px 10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px"
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "10px",
    color: "#444"
  },
  row: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    marginRight: 84,
    flexWrap: "wrap",
    gap: "6px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderBottom: "1px solid #ddd"
  },
  input: {
    padding: "6px",
    maxWidth: "160px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc"
  },
  otherIssuesInput: {
    padding: "6px",
    width: "60%",
    // maxWidth: "300px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#fff"
  },
  button: {
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "#ffffff",
    border: "1px solid #007BFF",
    borderRadius: "4px",
    transition: "background-color 0.3s",
    marginTop: "5px"
  },
  actionBar: {
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: "2px"
  },
  customTextArea: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
    backgroundColor: "#fff"
  },
  predefinedTextList: {
    listStyleType: "none",
    marginBottom: "2px",
    padding: "10px"
  },
  predefinedTextItem: {
    fontSize: "14px",
    lineHeight: "1.6"
  },
  optionButton: (isSelected) => ({
    marginLeft: 10,
    marginBottom: 6,
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "gray",
    backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    color: isSelected ? "green" : "gray",
    display: "inline-block",
    fontWeight: isSelected ? "bold" : "normal",
    transition: "all 0.3s ease"
  })
};

const sections = {
  "Other Issues": [`'Other: `, `ROM is grossly decreased on`],
  Cervical: [
    `Cervical spine tenderness of paraspinal muscles `,
    `Traps/levator scapula tenderness `,
    `Cervical facet loading signs`,
    `Pain (worst) with extension.`
  ],
  Thoracic: [
    `Thoracic spine tenderness of paraspinal muscles `,
    `Trapezius/rhomboid tenderness `,
    `Thoracic facet loading signs .`,
    `Pain (worst) with rotation.`
  ],
  Lumbar: [
    `Lumbar spine tenderness of paraspinal and or quadratus muscles `,
    `Gluteal tenderness `,
    `Lumbar facet loading signs at `,
    `Quadrant test `,
    `Slump/SLR `,
    `Patrick `,
    `SIJ tenderness `,
    `Thigh-Thrust `,
    `Gaenslen `
  ],
  "Apley's ROM": [
    `Apley scratch `,
    `Crepitus `,
    `Crossover test `,
    `ROM is grossly decreased. `,
    `Subacromial tenderness `,
    `Neer Impingement `,
    `Drop Arm Test `,
    `Empty Can Test `
  ],
  "Hip/Squat": [
    `(hip) Squat test `,
    `Trochanteric bursa tenderness `,
    `ROM is grossly decreased `,
    `Patrick test`,
    `FADIR (flexion, adduction and medial hip rotation) `
  ],
  "Peri Patella": [
    `Peri-Patella tenderness `,
    `Joint line tenderness `,
    `ROM is grossly decreased,`,
    `Drawer Test `,
    `Valgus/Varus stress test `,
    `McMurray test `
  ]
};

const LocationOptions = ["bilaterally", "on left", "on right"];
const CervicalLevels = ["C2-C5", "C5-T1"];
const ThoracicLevels = ["T1-T4", "T2-T5"];
const LumbarLevels = ["L2-L5", "L3-L5"];

const OptionSelector = ({ options, selectedValue, onSelect }) => (
  <div>
    {options.map((option) => (
      <span
        key={option}
        onClick={() => onSelect(selectedValue === option ? "" : option)}
        style={styles.optionButton(selectedValue === option)}
      >
        {option}
      </span>
    ))}
  </div>
);

const EstablishedComplaints = ({ onChange }) => {
  const [finalExamLines, setFinalExamLines] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [userInputs, setUserInputs] = useState({});
  const [manualSelectedLines, setManualSelectedLines] = useState(new Set());
  const [showPredefinedText, setShowPredefinedText] = useState(true);
  const [customText, setCustomText] = useState("");

  const handleOptionChange = (key, value) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (lineIndex, value) => {
    setUserInputs((prev) => ({ ...prev, [lineIndex]: value }));
  };

  useEffect(() => {
    const groupedLines = {};
    let globalIdx = 0;
    for (const [sectionName, lines] of Object.entries(sections)) {
      groupedLines[sectionName] = [];

      lines.forEach((line) => {
        const location = selectedOptions[`${globalIdx}-location`] || "";
        const level = selectedOptions[`${globalIdx}-level`] || "";
        const userInput = userInputs[globalIdx] || "";
        const isManuallySelected = manualSelectedLines.has(globalIdx);

        if (location || level || userInput || isManuallySelected) {
          const finalLine = `${line}${location ? "" + location : ""}${
            level ? "" + level : ""
          }${userInput ? "" + userInput : ""}`.trim();
          groupedLines[sectionName].push(finalLine);
        }
        globalIdx++;
      });
    }

    const sectionedOutput = Object.entries(groupedLines)
      .filter(([, lines]) => lines.length > 0)
      .map(([, lines]) => lines.join("\n"));

    if (customText.trim()) {
      sectionedOutput.push(customText.trim());
    }

    const finalOutput = sectionedOutput.join("\n\n");
    setFinalExamLines(finalOutput.split("\n"));
    if (onChange) onChange(finalOutput);
  }, [selectedOptions, userInputs, manualSelectedLines, customText]);

  const handleResetClick = () => {
    setSelectedOptions({});
    setUserInputs({});
    setManualSelectedLines(new Set());
    setFinalExamLines([]);
    setCustomText("");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
      <p>The following findings of ESTABLISHED complaints were positive:</p>

      {finalExamLines.length > 0 && (
        <div style={styles.section}>
          <ul style={styles.predefinedTextList}>
            {finalExamLines.map((line, i) => (
              <li key={i} style={styles.predefinedTextItem}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={styles.actionBar}>
        <button
          style={styles.button}
          onClick={() => setShowPredefinedText((prev) => !prev)}
          disabled={!!customText.trim()}
        >
          {showPredefinedText ? "Input Custom Text" : "Use Predefined Text"}
        </button>
        <button style={styles.button} onClick={handleResetClick}>
          Reset
        </button>
      </div>

      {showPredefinedText ? (
        Object.entries(sections).map(([sectionName, lines], sectionIdx) => (
          <div key={sectionIdx} style={styles.section}>
            <div style={styles.sectionTitle}>{sectionName}</div>
            {lines.map((line, lineOffset) => {
              const globalIndex = Object.values(sections)
                .flat()
                .slice(0, Object.values(sections).flat().indexOf(line) + 1)
                .lastIndexOf(line);

              const isCervical = sectionName === "Cervical";
              const isThoracic = sectionName === "Thoracic";
              const isLumbar = sectionName === "Lumbar";
              const isOtherIssues = sectionName === "Other Issues";

              const levelOptions = isCervical
                ? CervicalLevels
                : isThoracic
                ? ThoracicLevels
                : isLumbar
                ? LumbarLevels
                : [];

              return (
                <div key={globalIndex} style={styles.row}>
                  <span style={{ flex: "1 1 300px" }}>{line}</span>

                  {levelOptions.length > 0 && (
                    <OptionSelector
                      options={levelOptions}
                      selectedValue={
                        selectedOptions[`${globalIndex}-level`] || ""
                      }
                      onSelect={(val) =>
                        handleOptionChange(`${globalIndex}-level`, val)
                      }
                    />
                  )}

                  {!isOtherIssues && (
                    <OptionSelector
                      options={LocationOptions}
                      selectedValue={
                        selectedOptions[`${globalIndex}-location`] || ""
                      }
                      onSelect={(val) =>
                        handleOptionChange(`${globalIndex}-location`, val)
                      }
                    />
                  )}

                  <input
                    type="text"
                    value={userInputs[globalIndex] || ""}
                    onChange={(e) =>
                      handleInputChange(globalIndex, e.target.value)
                    }
                    placeholder={
                      isOtherIssues
                        ? "Describe the other issue..."
                        : "Additional info"
                    }
                    style={
                      isOtherIssues
                        ? styles.otherIssuesInput
                        : styles.input
                    }
                  />
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div style={styles.section}>
          <textarea
            rows={8}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter custom physical examination text..."
            style={styles.customTextArea}
          />
        </div>
      )}
    </div>
  );
};

export default EstablishedComplaints;
