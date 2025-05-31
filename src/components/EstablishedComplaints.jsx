import React, { useState, useEffect, useMemo } from "react";

const baseInput = {
  padding: "8px",
  fontSize: "14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginLeft: "1px",
  marginTop: "10px"
};

const styles = {
  section: {
    marginBottom: 12,
    fontSize: "14px",
    padding: "2px 8px",
    background: "#f9f9f9",
    borderRadius: 6
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
    color: "#444"
  },
  input: { ...baseInput, minWidth: "20px", maxWidth: "50%" },
  inputSmall: { ...baseInput, minWidth: "40px", maxWidth: "100%" },
  button: {
    padding: "8px 10px",
    fontSize: 14,
    cursor: "pointer",
    background: "#007BFF",
    color: "#fff",
    border: "1px solid #007BFF",
    borderRadius: 4,
    marginTop: 4
  },
  actions: {
    display: "flex",
    gap: 8,
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 2
  },
  textarea: {
    width: "100%",
    padding: 8,
    fontSize: 13,
    borderRadius: 6,
    border: "1px solid #ccc",
    resize: "none",
    background: "#fff"
  },
  list: { listStyle: "none", padding: 1 },
  listItem: { fontSize: 13, cursor: "pointer" },
  optionButton: (selected) => ({
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: 8,
    border: "1px solid",
    borderColor: selected ? "green" : "gray",
    background: selected ? "#e0f7e9" : "#f5f5f5",
    color: selected ? "green" : "gray",
    fontWeight: selected ? "bold" : "normal",
    transition: "all 0.3s ease",
    userSelect: "none"
  }),
  optionRow: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 4
    // marginLeft: 8
  },
  clickableLine: (selected) => ({
    // cursor: "pointer",
    // padding: "0px 8px",
    // borderRadius: 6,
    // backgroundColor: selected ? "#f7b688" : "#fff",
    // // backgroundColor: selected ? "#d1f7d1" : "#fff",
    // boxShadow: selected ? "0 0 6pxrgb(175, 76, 76)" : "none",
    // border: "1px solid #ccc",
    // marginBottom: 0,
    // userSelect: "none",
    // display: "flex",
    // alignItems: "center",
    // gap: 8
    cursor: "pointer",
    // padding: "2px 6px", // Reduced vertical padding
    borderRadius: 6,
    backgroundColor: selected ? "#f7b688" : "#fff",
    boxShadow: selected ? "0 0 4px rgba(175, 76, 76, 0.5)" : "none", // Slightly lighter shadow
    border: "1px solid #ccc",
    marginBottom: 4, // Smaller margin for compact look
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    gap: 4, // Tighter spacing between elements
    fontSize: 15,
    margin:"0px",
    padding:"0px 6px"
  }),
  lineText: {
    flexShrink: 0,
    userSelect: "none"
  }
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

const groupedSections = [
  "Cervical",
  "Thoracic",
  "Lumbar",
  "Aplyes-Scratch",
  "Hip-Squat",
  "Peri-Patella"
];

const levels = {
  Cervical: ["at C2-C5", "at C5-T1"],
  Thoracic: ["at T1-T4", "at T2-T5"],
  Lumbar: ["at L2-L5", "at L3-L5"]
};

const LocationOptions = [
  { left: "on left" },
  { right: "on right" },
  { bilaterally: "on bilaterally" }
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

      lines.forEach((line) => {
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
      linesArr.push(customText.trim());
    }

    setFinalExamLines(linesArr);
    if (onChange) onChange(linesArr.join("\n"));
  }, [selectedOptions, userInputs, selectedLines, customText, onChange]);

  const toggleLine = (idx) => {
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
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

  return (
    <div style={{ fontFamily: "Arial", fontSize: 15 }}>
      <p>The following findings of ESTABLISHED complaints were positive:</p>

      {!!finalExamLines.length && (
        <div style={styles.section}>
          <ul style={styles.list}>
            {finalExamLines.map((line, i) =>
              line === "" ? (
                <hr
                  key={`hr-${i}`}
                  style={{
                    border: "none",
                    borderTop: "1px solid #ddd",
                    margin: "8px 0"
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

      <div style={styles.actions}>
        <button
          style={styles.button}
          onClick={() => setShowPredefined((p) => !p)}
          disabled={!!customText.trim()}
          title={customText.trim() ? "Clear custom text to toggle" : undefined}
        >
          {showPredefined ? "Input Custom Text" : "Use Predefined Text"}
        </button>
        <button style={styles.button} onClick={handleReset}>
          Reset
        </button>
      </div>

      {showPredefined ? (
        Object.entries(sections).map(([section, lines], sIdx) => {
          const idxBase = sectionOffsets[sIdx];
          const isGrouped = groupedSections.includes(section);

          return (
            <div key={section} style={styles.section}>
              <div style={styles.title}>{section}</div>

              {isGrouped
                ? Array.from({ length: Math.ceil(lines.length / 2) }).map(
                    (_, rowIdx) => (
                      <div key={rowIdx} style={{ display: "flex", gap: 12 }}>
                        {[0, 1].map((offset) => {
                          const lIdx = rowIdx * 2 + offset;
                          if (lIdx >= lines.length) return null;

                          const idx = idxBase + lIdx;
                          const line = lines[lIdx];
                          const selected = selectedLines.has(idx);
                          const locSelected =
                            selectedOptions[`${idx}-location`] || "";
                          const lvlSelected =
                            selectedOptions[`${idx}-level`] || "";
                          const inputValue = userInputs[idx] || "";
                          const showLevel =
                            levels[section]?.length && lIdx === 2;
                          const hideLocation =
                            (section === "Cervical" && lIdx === 3) ||
                            (section === "Thoracic" && lIdx === 3);

                          return (
                            <div
                              key={idx}
                              style={{
                                ...styles.clickableLine(selected),
                                flex: 1
                              }}
                              onClick={() => toggleLine(idx)}
                            >
                              <span style={styles.lineText}>{line}</span>

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
                                <OptionSelector
                                  options={levels[section].map((l) => ({
                                    [l]: l
                                  }))}
                                  selectedValue={lvlSelected}
                                  onSelect={(v) =>
                                    setSelectedOptions((p) => ({
                                      ...p,
                                      [`${idx}-level`]: v
                                    }))
                                  }
                                />
                              )}

                              <input
                                type="text"
                                placeholder="Additional info"
                                value={inputValue}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  setUserInputs((p) => ({
                                    ...p,
                                    [idx]: e.target.value
                                  }))
                                }
                                style={
                                  showLevel ? styles.inputSmall : styles.input
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    )
                  )
                : lines.map((line, lIdx) => {
                    const idx = idxBase + lIdx;
                    const selected = selectedLines.has(idx);
                    const locSelected =
                      selectedOptions[`${idx}-location`] || "";
                    const inputValue = userInputs[idx] || "";

                    return (
                      <div
                        key={idx}
                        style={styles.clickableLine(selected)}
                        onClick={() => toggleLine(idx)}
                      >
                        <span style={styles.lineText}>{line}</span>

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

                        <input
                          type="text"
                          placeholder="Additional info"
                          value={inputValue}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            setUserInputs((p) => ({
                              ...p,
                              [idx]: e.target.value
                            }))
                          }
                          style={styles.input}
                        />
                      </div>
                    );
                  })}
            </div>
          );
        })
      ) : (
        <div style={styles.section}>
          <textarea
            rows={6}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter your custom findings here..."
            style={styles.textarea}
          />
        </div>
      )}
    </div>
  );
};

export default EstablishedComplaints;
