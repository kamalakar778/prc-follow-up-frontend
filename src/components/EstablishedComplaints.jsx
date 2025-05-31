import React, { useState, useEffect, useMemo } from "react";

const baseInput = {
  padding: "4px 6px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #d1d5db",
  marginLeft: "1px",
  marginTop: "4px"
};

const styles = {

  container: { maxWidth: 1000, margin: "auto", fontFamily:"Calibri", padding: 0 },
  section: {
    marginBottom: 8,
    fontSize: "18px",
    padding: "4px 8px",
    background: "#f3f4f6",
    borderRadius: 4
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
    color: "#444"
  },
  input: { ...baseInput, minWidth: "30px",padding:"5px 3px", maxWidth: "50%" },
  inputSmall: { ...baseInput, minWidth: "80px", maxWidth: "50%" },
  button: {
    padding: "2px 5px",
    fontSize: 14,
    cursor: "pointer",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    marginTop: 2,
    lineHeight: 1.2,
    minWidth: 60
  },
  actions: {
    display: "flex",
    gap: 6,
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: 4,
    marginBottom: 8
  },
  textarea: {
    width: "100%",
    padding: 6,
    fontSize: 13,
    borderRadius: 4,
    border: "1px solid #d1d5db",
    resize: "none",
    background: "#fff"
  },
  list: { listStyle: "none", padding: 0 },
  listItem: { fontSize: 13, marginBottom: 2 },
  optionButton: (selected) => ({
    cursor: "pointer",
    padding: "6px 6px",
    borderRadius: 6,
    border: "1px solid",
    borderColor: selected ? "green" : "#999",
    background: selected ? "#e0f7e9" : "#f9f9f9",
    color: selected ? "green" : "#555",
    fontWeight: selected ? "bold" : "normal",
    userSelect: "none",
    fontSize: 13
  }),
  optionRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    marginLeft: 6
  },
  clickableLine: (selected) => ({
    cursor: "pointer",
    borderRadius: 4,
    backgroundColor: selected ? "#fde68a" : "#c2bebe",
    border: "1px solid #d1d5db",
    marginTop:"5px",
    marginBottom:"-10px",
    margin: "2px 0",
    padding: "0px 6px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 16
  }),
  lineText: {
    flexShrink: 0,
    userSelect: "none",
    marginRight: 4
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

  return (
    <div style={styles.container}>
      <p>The following findings of ESTABLISHED complaints were positive:</p>

      {!!finalExamLines.length && (
        <div style={styles.section}>
          <ul style={styles.list}>
            {finalExamLines.map((line, i) =>
              line === "" ? (
                <hr
                  key={`hr-${i}`}
                  style={{ border: "none", borderTop: "1px solid #ddd", margin: "6px 0" }}
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

      {!showPredefined && (
        <textarea
          rows={3}
          placeholder="Enter custom findings text here..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          style={styles.textarea}
        />
      )}

      {showPredefined &&
        Object.entries(sections).map(([section, lines], sIdx) => {
          const idxBase = sectionOffsets[sIdx];
          return (
            <div key={section} style={styles.section}>
              <div style={styles.title}>{section}</div>
              {lines.map((line, lIdx) => {
                const idx = idxBase + lIdx;
                const selected = selectedLines.has(idx);
                const locSelected = selectedOptions[`${idx}-location`] || "";
                const lvlSelected = selectedOptions[`${idx}-level`] || "";
                const inputValue = userInputs[idx] || "";
                const showLevel = levels[section]?.length && lIdx === 2;
                const hideLocation =
                  (section === "Cervical" && lIdx === 3) ||
                  (section === "Thoracic" && lIdx === 3) ||
                  (section === "Other Issues" && lIdx === 0);

                return (
                  <div
                    key={idx}
                    style={styles.clickableLine(selected)}
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
                        options={levels[section].map((l) => ({ [l]: l }))}
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
                      placeholder="Info"
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
        })}
    </div>
  );
};

export default EstablishedComplaints;
