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
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    // border:"-10px",
    border: "2px solid #ccc"
  },
  input: {
    padding: "8px",
    minWidth: "80%",
    maxWidth: "100%",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginLeft: "8px"
  },
  inputComplaints: {
    padding: "8px",
    minWidth: "20%",
    maxWidth: "100%",
    fontSize: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginLeft: "8px"
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
    width: "20%",
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
    marginLeft: -2,
    marginBottom: 4,
    cursor: "pointer",
    padding: "4px 10px",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "gray",
    backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    color: isSelected ? "green" : "gray",
    fontWeight: isSelected ? "bold" : "normal",
    transition: "all 0.3s ease"
  }),
  inlineOptions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "6px",
    marginLeft: "8px"
  }
};

const sections = {
  "Other Issues": [`Other: `, `ROM is grossly decreased on`],
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
    `Lumbar spine tenderness of paraspinal and or quadratus muscles`,
    `Gluteal tenderness`,
    `Lumbar facet loading signs at`,
    `Quadrant test`,
    `Slump/SLR`,
    `Patrick test `,
    `SIJ tenderness`,
    `Thigh-Thrust`,
    `Gaenslen test`
  ],
  "Aplyes-Scratch": [
    "  Apley scratch test",
    "Crepitus test",
    "Crossover test ",
    "ROM is grossly decreased .",
    "Subacromial tenderness ",
    "Neer Impingement",
    "Drop Arm Test",
    "Empty Can Test"
  ],

  "Hip-Squat": [
    "(hip) Squat test",
    "Trochanteric bursa tenderness",
    "ROM is grossly decreased",
    "Patrick.",
    "FADIR (flexion, adduction and medial hip rotation)"
  ],

  "Peri-Patella": [
    "Peri-Patella tenderness",
    "Joint line tenderness",
    "ROM is grossly decreased.",
    "Drawer Test.",
    "Valgus/Varus stress test",
    "McMurray"
  ]
};

const LocationOptions = [
  "left", 
  "right",
  "bilaterally", 
];
const CervicalLevels = ["at C2-C5", "at C5-T1"];
const ThoracicLevels = ["at T1-T4", "at T2-T5"];
const LumbarLevels = ["at L2-L5", "at L3-L5"];

const OptionSelector = ({ options, selectedValue, onSelect }) => (
  <div style={styles.inlineOptions}>
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
          const finalLine = `${line} ${userInput} ${location} ${level}`.trim();
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
            {lines.map((line, lineIdx) => {
              const flatIndex = Object.values(sections)
                .flat()
                .slice(0, Object.values(sections).flat().indexOf(line) + 1)
                .lastIndexOf(line);

              const isManuallySelected = manualSelectedLines.has(flatIndex);

              const toggleSelection = () => {
                setManualSelectedLines((prev) => {
                  const updated = new Set(prev);
                  if (updated.has(flatIndex)) {
                    updated.delete(flatIndex);
                  } else {
                    updated.add(flatIndex);
                  }
                  return updated;
                });
              };

              const needsExtraInput =
                (sectionName === "Cervical" && lineIdx === 2) ||
                (sectionName === "Thoracic" && lineIdx === 2) ||
                (sectionName === "Lumbar" && lineIdx === 2);

              let levelOptions = [];
              if (sectionName === "Cervical" && lineIdx === 2)
                levelOptions = CervicalLevels;
              if (sectionName === "Thoracic" && lineIdx === 2)
                levelOptions = ThoracicLevels;
              if (sectionName === "Lumbar" && lineIdx === 2)
                levelOptions = LumbarLevels;

              const isOtherIssues = sectionName === "Other Issues";

              return (
                <div key={flatIndex} style={styles.row}>
                  <button
                    onClick={toggleSelection}
                    style={{
                      fontSize: "14px",
                      marginRight: "8px",
                      backgroundColor: isManuallySelected ? "red" : "#16A34A",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 4px",
                      cursor: "pointer"
                    }}
                  >
                    {isManuallySelected ? "Remove" : "Add"}
                  </button>

                  <span>{line}</span>

                  {isOtherIssues && lineIdx === 0 && (
                    <input
                      type="text"
                      placeholder="Enter detail"
                      value={userInputs[flatIndex] || ""}
                      onChange={(e) =>
                        setUserInputs((prev) => ({
                          ...prev,
                          [flatIndex]: e.target.value
                        }))
                      }
                      style={styles.input}
                    />
                  )}

                  {isOtherIssues && lineIdx === 1 && (
                    <OptionSelector
                      options={LocationOptions}
                      selectedValue={
                        selectedOptions[`${flatIndex}-location`] || ""
                      }
                      onSelect={(val) =>
                        handleOptionChange(`${flatIndex}-location`, val)
                      }
                    />
                  )}

                  {!isOtherIssues && (
                    <>
                      {levelOptions.length > 0 && (
                        <OptionSelector
                          options={levelOptions}
                          selectedValue={
                            selectedOptions[`${flatIndex}-level`] || ""
                          }
                          onSelect={(val) =>
                            handleOptionChange(`${flatIndex}-level`, val)
                          }
                        />
                      )}
                      <OptionSelector
                        options={LocationOptions}
                        selectedValue={
                          selectedOptions[`${flatIndex}-location`] || ""
                        }
                        onSelect={(val) =>
                          handleOptionChange(`${flatIndex}-location`, val)
                        }
                      />
                      {needsExtraInput && (
                        <input
                          type="text"
                          placeholder="Enter additional info"
                          value={userInputs[flatIndex] || ""}
                          onChange={(e) =>
                            setUserInputs((prev) => ({
                              ...prev,
                              [flatIndex]: e.target.value
                            }))
                          }
                          style={styles.inputComplaints}
                        />
                      )}
                    </>
                  )}
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
