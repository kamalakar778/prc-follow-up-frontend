import React, { useState, useEffect, useMemo } from "react";

const styles = {
  container: { maxWidth: 1200, margin: "auto", padding: 0 },
  injectionRowEditable: {
    height: "27px",
    // maxWidth:"35%",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 0,
    padding: "3px 2px",
    // marginBottom: 8, // ensure spacing between rows
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid rgb(164, 170, 189)", // thick dark border
    backgroundColor: "#f9fafb", // subtle light background
    transition: "background-color 0.3s ease, box-shadow 0.3s ease"
  },

  button: {
    border: "none",
    padding: "8px 8px",
    borderRadius: 3,
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1,
    minWidth: 40,
    whiteSpace: "nowrap",
    background: "#007BFF",
    color: "#fff"
  },
  select: {
    fontSize: 14,
    padding: "0px 6px",
    minWidth: 60,
    maxWidth: 130,
    margin: "auto"
  },
  notesInput: {
    flex: 1,
    margin: "0px 2px",
    minWidth: "5%",
    maxWidth: "20%",
    padding: "5px 6px",
    fontSize: 14,
    borderRadius: 5
    // border: "1px solidrgb(9, 20, 37)"
  },
  otherNotesInput: {
    flex: 1,
    margin: "0px 2px",
    padding: "5px 6px",
    fontSize: 14,
    borderRadius: 5,
    width: "100%", // make it take up its parent width
    boxSizing: "border-box"
  },

  index: {
    fontSize: 14,
    minWidth: 0,
    display:"flex",
    textAlign: "left",
    marginBottom:"2px"
  },
  sectionBox: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    padding: "4px 8px"
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#444",
    marginBottom: 4
  },
  optionButton: (selected) => ({
    marginLeft: "0px",
    cursor: "pointer",
    padding: "4px 3px",
    borderRadius: 4,
    border: "1px solid",
    borderColor: selected ? "green" : "#999",
    background: selected ? "#e0f7e9" : "#f9f9f9",
    color: selected ? "green" : "#555",
    fontWeight: selected ? "bold" : "normal",
    fontSize: 13
  }),
  optionRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4
  },
  textarea: {
    width: "100%",
    padding: 6,
    fontSize: 13,
    borderRadius: 4,
    border: "1px solid #d1d5db",
    resize: "both",
    background: "#fff",
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    overflowY: "auto",
    minHeight: "120px"
  },
  list: { listStyle: "none", padding: 0 },
  listItem: { fontSize: 13, marginBottom: 2 }
};

const sections = {
  "Other Issues": ["Other: ", "ROM is grossly decreased on"],
  Cervical: [
    "Cervical spine tenderness of paraspinal muscles ",
    "Traps/levator scapula tenderness ",
    "Cervical facet loading signs",
    "Pain (worst) with extension."
  ],
  Thoracic: [
    "Thoracic spine tenderness of paraspinal muscles ",
    "Trapezius/rhomboid tenderness ",
    "Thoracic facet loading signs .",
    "Pain (worst) with rotation."
  ],
  Lumbar: [
    "Lumbar spine tenderness of paraspinal and or quadratus muscles",
    "Gluteal tenderness",
    "Lumbar facet loading signs at",
    "Quadrant test",
    "Slump/SLR",
    "Patrick test ",
    "SIJ tenderness",
    "Thigh-Thrust",
    "Gaenslen test"
  ],
  "Aplyes-Scratch": [
    "Apley scratch test",
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
    "Patrick's test.",
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

const levels = {
  Cervical: ["at C2-C5", "at C5-T1"],
  Thoracic: ["at T1-T4", "at T2-T5"],
  Lumbar: ["at L2-L5", "at L3-L5"]
};

const LocationOptions = [
  { left: "on left" },
  { right: "on right" },
  { bilateral: "bilaterally" }
];

const OptionSelector = ({ options, selectedValue, onSelect }) => (
  <div style={styles.optionRow}>
    {options.map((optionObj, index) => {
      const key = Object.keys(optionObj)[0];
      const value = optionObj[key];
      const isSelected = selectedValue === value;
      return (
        <span
          key={key || index}
          onClick={() => onSelect(isSelected ? "" : value)}
          style={styles.optionButton(isSelected)}
        >
          {key}
        </span>
      );
    })}
  </div>
);

const isLocationExcluded = (section, lIdx) =>
  (section === "Cervical" && lIdx === 3) ||
  (section === "Thoracic" && lIdx === 3) ||
  (section === "Other Issues" && lIdx === 0) ||
  (section === "Hip-Squat" && lIdx === 0);

const getGroupedIndices = (section) => {
  switch (section) {
    case "Other Issues":
      return [[0, 1]];
    case "Cervical":
      return [[0, 1],[2,3]];

    case "Thoracic":
      return [
        [0, 1],
        [2, 3]
      ];
    case "Lumbar":
      return [
        [0, 1],
        [2, 3],
        [4, 5, 6, 7, 8]
      ];
    case "Aplyes-Scratch":
      return [
        [0, 1, 2, 3],
        [4, 5, 6, 7]
      ];
    case "Hip-Squat":
      return [
        [0, 1, 2],
        [3, 4]
      ];
    case "Peri-Patella":
      return [
        [0, 1, 2],
        [3, 4, 5]
      ];
    default:
      return sections[section].map((_, idx) => [idx]);
  }
};

const EstablishedComplaints = ({ onChange }) => {
  const [finalExamLines, setFinalExamLines] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [userInputs, setUserInputs] = useState({});
  const [selectedLines, setSelectedLines] = useState(new Set());
  const [showPredefined, setShowPredefined] = useState(true);
  const [customText, setCustomText] = useState("");

  const sectionOffsets = useMemo(() => {
    const offsets = [];
    let sum = 0;
    for (const lines of Object.values(sections)) {
      offsets.push(sum);
      sum += lines.length;
    }
    return offsets;
  }, []);

  useEffect(() => {
    const linesArr = [];
    let idx = 0;

    for (const [section, lines] of Object.entries(sections)) {
      const normalLines = [];
      const levelLines = [];

      lines.forEach((line, lIdx) => {
        const locValue = selectedOptions[`${idx}-location`] || "";
        const lvl = selectedOptions[`${idx}-level`] || "";
        const input = userInputs[idx] || "";
        const selected = selectedLines.has(idx);
        const includeLine = selected || locValue || lvl || input.trim() !== "";

        if (includeLine) {
          let formattedLine = line.trim();
          if (input.trim()) formattedLine += ` ${input.trim()}`;
          if (locValue) formattedLine += ` ${locValue}`;
          if (lvl) formattedLine += ` ${lvl}`;
          const targetArray = lvl ? levelLines : normalLines;
          targetArray.push(formattedLine.trim());
        }

        idx++;
      });

      if (normalLines.length + levelLines.length > 0) {
        linesArr.push(...normalLines, ...levelLines, "");
      }
    }

    if (customText.trim()) {
      linesArr.push(...customText.trim().split("\n"));
    }

    setFinalExamLines(linesArr);
    if (onChange) onChange(linesArr.join("\n"));
  }, [selectedOptions, userInputs, selectedLines, customText, onChange]);

  const toggleLine = (idx) => {
    setSelectedLines((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleReset = () => {
    setSelectedOptions({});
    setUserInputs({});
    setSelectedLines(new Set());
    setCustomText("");
    setFinalExamLines([]);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const cleaned = text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "");
    const cursorPosition = e.target.selectionStart;
    const newText =
      customText.slice(0, cursorPosition) +
      cleaned +
      customText.slice(cursorPosition);
    setCustomText(newText);
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          style={styles.button}
          onClick={() => setShowPredefined((p) => !p)}
          disabled={!!customText.trim()}
          title={customText.trim() ? "Clear custom text to toggle" : undefined}
        >
          {showPredefined ? "Input Custom Text" : "Use Predefined Text"}
        </button>
        <button
          style={{ ...styles.button, backgroundColor: "#6b7280" }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {!showPredefined && (
        <textarea
          rows={10}
          placeholder="Enter custom findings text here..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onPaste={handlePaste}
          style={styles.textarea}
          spellCheck={false}
        />
      )}

      {showPredefined &&
        Object.entries(sections).map(([section, lines], sIdx) => {
          const idxBase = sectionOffsets[sIdx];
          const rowGroups = getGroupedIndices(section);
          return (
            <div key={section} style={styles.sectionBox}>
              <div style={styles.sectionTitle}>{section}</div>
              {rowGroups.map((group, gIdx) => (
                <div key={`group-${section}-${gIdx}`} style={styles.optionRow}>
                  {group.map((lIdx) => {
                    const idx = idxBase + lIdx;
                    const line = lines[lIdx];
                    const selected = selectedLines.has(idx);
                    const locSelected =
                      selectedOptions[`${idx}-location`] || "";
                    const lvlSelected = selectedOptions[`${idx}-level`] || "";
                    const inputValue = userInputs[idx] || "";

                    const isInteracted =
                      selected ||
                      locSelected ||
                      lvlSelected ||
                      inputValue.trim() !== "";

                    const rowStyle = {
                      ...styles.injectionRowEditable,
                      backgroundColor: isInteracted ? "#e39b1e" : "transparent",
                      flex: "1 1 auto"
                    };

                    const showLevel = levels[section]?.length && lIdx === 2;
                    const hideLocation = isLocationExcluded(section, lIdx);

                    return (
                      <div
                        key={idx}
                        style={rowStyle}
                        onClick={() => toggleLine(idx)}
                      >
                        <span style={styles.index}>
                          {line}
                          {section === "Other Issues" && lIdx === 0 && (
                            <input
                              type="text"
                              placeholder="Enter other issue"
                              value={userInputs[idx] || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setUserInputs((p) => ({
                                  ...p,
                                  [idx]: e.target.value
                                }))
                              }
                              style={{
                                ...styles.otherNotesInput,
                                marginLeft: 8,
                                minWidth:"175%",
                                maxWidth:"150%"
                              }}
                            />
                          )}
                        </span>

                        {!hideLocation && (
                          <OptionSelector
                            options={LocationOptions}
                            selectedValue={locSelected}
                            onSelect={(v) =>
                              setSelectedOptions((p) => ({
                                ...p,
                                [`${idx}-location`]: v
                              }))
                            }
                          />
                        )}

                        {showLevel && (
                          <>
                            <OptionSelector
                              options={levels[section].map((l) => ({ [l]: l }))}
                              selectedValue={lvlSelected}
                              onSelect={(v) =>
                                setSelectedOptions((p) => ({
                                  ...p,
                                  [`${idx}-level`]: v
                                }))
                              }
                            />
                            <input
                              type="text"
                              placeholder="level"
                              value={inputValue}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                setUserInputs((p) => ({
                                  ...p,
                                  [idx]: e.target.value
                                }))
                              }
                              style={styles.notesInput}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}

      <p>The following findings of ESTABLISHED complaints were positive:</p>

      {!!finalExamLines.length && (
        <div style={styles.sectionBox}>
          <ul style={styles.list}>
            {finalExamLines.map((line, i) =>
              line === "" ? (
                <hr
                  key={`hr-${i}`}
                  style={{
                    border: "none",
                    borderTop: "1px solid #ddd",
                    margin: "6px 0"
                  }}
                />
              ) : (
                <li key={i} style={styles.listItem}>
                  {line}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EstablishedComplaints;
