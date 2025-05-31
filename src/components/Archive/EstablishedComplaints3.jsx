import React, { useState, useEffect } from "react";

const baseInput = {
  padding: "4px",
  fontSize: "13px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginLeft: "4px"
};

const styles = {
  section: {
    marginBottom: 12,
    padding: "6px 8px",
    background: "#f9f9f9",
    borderRadius: 6
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
    color: "#444"
  },
  input: { ...baseInput, minWidth: "75%", maxWidth: "100%" },
  inputSmall: { ...baseInput, minWidth: "20%", maxWidth: "100%" },
  button: {
    padding: "8px 12px",
    fontSize: 13,
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
  list: { listStyle: "none", marginBottom: 2, padding: 8 },
  listItem: { fontSize: 13, lineHeight: 1.4 },
  optionButton: (selected) => ({
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: 8,
    border: "1px solid",
    borderColor: selected ? "green" : "gray",
    background: selected ? "#e0f7e9" : "#f5f5f5",
    color: selected ? "green" : "gray",
    fontWeight: selected ? "bold" : "normal",
    transition: "all 0.3s ease"
  }),
  optionRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    marginLeft: 4
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

const levels = {
  Cervical: ["at C2-C5", "at C5-T1"],
  Thoracic: ["at T1-T4", "at T2-T5"],
  Lumbar: ["at L2-L5", "at L3-L5"]
};

const LocationOptions = [
  { L: "on left" },
  { R: "on right" },
  { B: "on bilaterally" }
];

const OptionSelector = ({ options, selectedValue, onSelect }) => (
  <div style={styles.optionRow}>
    {options.map((optObj, index) => {
      const [label, value] = Object.entries(optObj)[0];
      const isSelected = selectedValue === value;
      return (
        <span
          key={index}
          onClick={() => onSelect(isSelected ? "" : value)}
          style={styles.optionButton(isSelected)}
        >
          {label}
        </span>
      );
    })}
  </div>
);

const EstablishedComplaints = ({ onChange }) => {
  const [finalExamLines, setFinalExamLines] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [userInputs, setUserInputs] = useState({});
  const [manualSelected, setManualSelected] = useState(new Set());
  const [showPredefined, setShowPredefined] = useState(true);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    const result = [];
    let idx = 0;
    for (const [section, lines] of Object.entries(sections)) {
      const current = lines
        .map((line) => {
          const loc = selectedOptions[`${idx}-location`] || "";
          const lvl = selectedOptions[`${idx}-level`] || "";
          const input = userInputs[idx] || "";
          const selected = manualSelected.has(idx);
          idx++;
          return loc || lvl || input || selected
            ? `${line} ${input} ${loc} ${lvl}`.trim()
            : null;
        })
        .filter(Boolean);
      if (current.length) result.push(current.join("\n"));
    }
    if (customText.trim()) result.push(customText.trim());
    setFinalExamLines(result.join("\n").split("\n"));
    if (onChange) onChange(result.join("\n"));
  }, [selectedOptions, userInputs, manualSelected, customText, onChange]);

  const handleReset = () => {
    setSelectedOptions({});
    setUserInputs({});
    setManualSelected(new Set());
    setCustomText("");
    setFinalExamLines([]);
  };

  return (
    <div style={{ fontFamily: "Arial", fontSize: 13 }}>
      <p>The following findings of ESTABLISHED complaints were positive:</p>

      {!!finalExamLines.length && (
        <div style={styles.section}>
          <ul style={styles.list}>
            {finalExamLines.map((line, i) => (
              <li key={i} style={styles.listItem}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={styles.actions}>
        <button
          style={styles.button}
          onClick={() => setShowPredefined((p) => !p)}
          disabled={!!customText.trim()}
        >
          {showPredefined ? "Input Custom Text" : "Use Predefined Text"}
        </button>
        <button style={styles.button} onClick={handleReset}>
          Reset
        </button>
      </div>

      {showPredefined ? (
        Object.entries(sections).map(([section, lines], sIdx) => (
          <div key={sIdx} style={styles.section}>
            <div style={styles.title}>{section}</div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8
              }}
            >
              {lines.map((line, lIdx) => {
                const flatIdx = Object.values(sections)
                  .flat()
                  .indexOf(line, lIdx);
                const selected = manualSelected.has(flatIdx);
                const toggle = () => {
                  setManualSelected((prev) => {
                    const next = new Set(prev);
                    next.has(flatIdx)
                      ? next.delete(flatIdx)
                      : next.add(flatIdx);
                    return next;
                  });
                };
                const showLevel = levels[section]?.length && lIdx === 2;

                return (
                  <div>
                    <div
                      key={flatIdx}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        padding: "1px 10px",
                        // margin: 4,
                        // minWidth: 280,
                        flexGrow: 0,
                        flexShrink: 0,
                        // flexBasis: "auto",
                        backgroundColor: selected ? "#d1f7d1" : "#fff",
                        boxShadow: selected ? "0 0 6px #4CAF50" : "none",
                        display: "flex",
                        // flexDirection: "row",
                      }}
                    >
                      <button
                        onClick={toggle}
                        style={{
                          fontSize: 12,
                          background: selected ? "red" : "#16A34A",
                          color: "#fff",
                          border: "none",
                          borderRadius: 3,
                          padding: "2px 4px",
                          cursor: "pointer",
                          marginBottom: 4
                        }}
                      >
                        {selected ? "Remove" : "Add"}
                      </button>
                      {line}
                      {section === "Other Issues" && lIdx === 0 && (
                        <input
                          type="text"
                          placeholder="Enter detail"
                          value={userInputs[flatIdx] || ""}
                          onChange={(e) =>
                            setUserInputs((p) => ({
                              ...p,
                              [flatIdx]: e.target.value
                            }))
                          }
                          style={{ ...styles.input, marginTop: 4 }}
                        />
                      )}
                      {((section === "Other Issues" && lIdx === 1) ||
                        section !== "Other Issues") && (
                        <OptionSelector
                          options={LocationOptions}
                          selectedValue={
                            selectedOptions[`${flatIdx}-location`] || ""
                          }
                          onSelect={(v) =>
                            setSelectedOptions((p) => ({
                              ...p,
                              [`${flatIdx}-location`]: v
                            }))
                          }
                        />
                      )}
                      {showLevel && (
                        <>
                          <OptionSelector
                            options={levels[section].map((l) => ({ [l]: l }))}
                            selectedValue={
                              selectedOptions[`${flatIdx}-level`] || ""
                            }
                            onSelect={(v) =>
                              setSelectedOptions((p) => ({
                                ...p,
                                [`${flatIdx}-level`]: v
                              }))
                            }
                          />
                          <input
                            type="text"
                            placeholder="Additional info"
                            value={userInputs[flatIdx] || ""}
                            onChange={(e) =>
                              setUserInputs((p) => ({
                                ...p,
                                [flatIdx]: e.target.value
                              }))
                            }
                            style={{ ...styles.inputSmall, marginTop: 4 }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div style={styles.section}>
          <textarea
            rows={6}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Enter custom physical examination text..."
            style={styles.textarea}
          />
        </div>
      )}
    </div>
  );
};

export default EstablishedComplaints;
