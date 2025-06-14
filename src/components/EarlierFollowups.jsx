import React, { useState, useEffect } from "react";

const createEmptySection = () => ({
  date: "",
  preExisting: "",
  cc: "",
  palpationMuscle: "",
  palpationJoint: "",
  rom: "",
  comments: "",
  sensoryFrequency: "",
  sensoryLevels: [],
  sensoryNote: ""
});

const sensoryLevelOptions = [
  "right",
  "left",
  "L3", "L4", "L5", "S1", "S2",
  "C6", "C7", "C8",
  "T1", "T2"
];

const styles = {
  container: {
    padding: "14px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: "0px"
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "8px"
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "600",
    margin: 0,
    color: "#111827"
  },
  section: {

    minWidth: "150px",
    maxWidth: "280px",
    border: "1px solid #d1d5db",
    padding: "18px 10px",
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flexShrink: 0
  },
  subHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "8px",
    width: "75%",
    fontSize: "14px",
    marginBottom: "0.5rem"
  },
  label: {
    fontWeight: 500,
    fontSize: "14px",
    marginBottom: "0px"
  },
  sensoryTag: (selected) => ({
    marginRight: "2px",
    marginBottom: "0px",
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: "10px",
    border: `1px solid ${selected ? "#10b981" : "#9ca3af"}`,
    backgroundColor: selected ? "#d1fae5" : "#f3f4f6",
    color: selected ? "#065f46" : "#6b7280",
    display: "inline-block",
    fontSize: "14px"
  }),
  optionButton: (isSelected) => ({
    marginRight: 4,
    marginBottom: 4,
    cursor: "pointer",
    padding: "6px 6px",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: isSelected ? "#10b981" : "#d1d5db",
    backgroundColor: isSelected ? "#d1fae5" : "#f3f4f6",
    color: isSelected ? "#065f46" : "#6b7280",
    display: "inline-block",
    fontWeight: isSelected ? "600" : "normal",
    transition: "all 0.3s ease"
  }),
  addButton: {
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: 600,
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "background-color 0.2s ease"
  },
  addButtonHover: {
    backgroundColor: "#1d4ed8"
  },
  removeButton: {
    color: "#dc2626",
    fontSize: "14px",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none"
  }
};

const EarlierFollowups = ({ onDataChange }) => {
  const [sections, setSections] = useState([createEmptySection()]);

  useEffect(() => {
    const formatted = sections
      .map((s) => {
        const lines = [];

        if (s.date.trim()) lines.push(`Date: ${s.date}`);
        if (s.preExisting.trim()) lines.push(`${s.preExisting}`);
        if (s.cc.trim()) lines.push(`CC: ${s.cc}`);

        if (s.palpationMuscle.trim() !== "" || s.palpationJoint.trim() !== "") {
          lines.push(`\nPalpation revealed:`);
          if (s.palpationMuscle.trim() !== "")
            lines.push(`${s.palpationMuscle} muscle tenderness`);
          if (s.palpationJoint.trim() !== "")
            lines.push(`${s.palpationJoint} joint tenderness`);
        }

        if (s.rom.trim() !== "") {
          lines.push(`\nR.O.M. revealed:`);
          lines.push(`${s.rom} decrease in gross movement`);
        }

        if (s.comments.trim()) {
          lines.push(`\nComments: ${s.comments}`);
        }

        if (s.sensoryLevels.length > 0 || s.sensoryNote.trim()) {
          lines.push(
            `\nSensory changes: (paresthesia and numbness) occur ${
              s.sensoryFrequency
            } at the levels of ${s.sensoryLevels.join(", ") || "____"} ${
              s.sensoryNote
            }`
          );
        }

        return lines.length ? lines.join("\n") : "";
      })
      .filter(Boolean)
      .join("\n\n");

    onDataChange(formatted.trim());
  }, [sections, onDataChange]);

  const handleChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const toggleFieldValue = (index, field, value, defaultValue = "") => {
    const current = sections[index][field];
    const newValue = current === value ? defaultValue : value;
    handleChange(index, field, newValue);
  };

  const toggleLevel = (index, level) => {
    setSections((prev) => {
      const updated = [...prev];
      const currentLevels = new Set(updated[index].sensoryLevels);
      currentLevels.has(level)
        ? currentLevels.delete(level)
        : currentLevels.add(level);
      updated[index].sensoryLevels = Array.from(currentLevels);
      return updated;
    });
  };

  const addSection = () => setSections([...sections, createEmptySection()]);

  const removeSection = (index) => {
    if (sections.length === 1) return;
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.header}>Earlier Followups</h2>
        <button
          onClick={addSection}
          style={styles.addButton}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.addButtonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.addButton.backgroundColor)
          }
        >
          Add Section
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          overflowX: "auto"
        }}
      >
        {sections.map((section, index) => (
          <div key={index} style={styles.section}>
            <div style={styles.subHeader}>
              <h3
                style={{
                  fontWeight: "600",
                  marginBottom: "-0.1rem",
                  marginTop: "-0.2rem"
                }}
              >
                Section {index + 1}
              </h3>
              {sections.length > 1 && (
                <button
                  onClick={() => removeSection(index)}
                  style={styles.removeButton}
                >
                  Remove
                </button>
              )}
            </div>
            <div style={{display:"flex", direction:"row"}}>
              <label style={styles.label}>
                Date:
                <input
                  type="text"
                  value={section.date}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                  style={styles.input}
                />
              </label>
            </div>
            <div>
              <label style={styles.label}>Condition Type:</label>
              {["Pre-existing", "New"].map((opt) => (
                <span
                  key={opt}
                  style={styles.optionButton(section.preExisting === opt)}
                  onClick={() =>
                    toggleFieldValue(index, "preExisting", opt, "")
                  }
                >
                  {opt}
                </span>
              ))}
            </div>
            <input
              placeholder="Chief Complaint (CC)"
              value={section.cc}
              onChange={(e) => handleChange(index, "cc", e.target.value)}
              style={styles.input}
            />
            <div>
              <label style={styles.label}>Palpation revealed:</label><br/>
              {["Positive", "Negative"].map((opt) => (
                <span
                  key={`muscle-${opt}`}
                  style={styles.optionButton(section.palpationMuscle === opt)}
                  onClick={() =>
                    toggleFieldValue(index, "palpationMuscle", opt)
                  }
                >
                  Muscle: {opt}
                </span>
              ))}
              <br />
              {["Positive", "Negative"].map((opt) => (
                <span
                  key={`joint-${opt}`}
                  style={styles.optionButton(section.palpationJoint === opt)}
                  onClick={() => toggleFieldValue(index, "palpationJoint", opt)}
                >
                  Joint: {opt}
                </span>
              ))}
            </div>
            <div>
              <label style={styles.label}>R.O.M. revealed:</label>
              {["Positive", "Negative"].map((opt) => (
                <span
                  key={`rom-${opt}`}
                  style={styles.optionButton(section.rom === opt)}
                  onClick={() => toggleFieldValue(index, "rom", opt)}
                >
                  {opt}
                </span>
              ))}
            </div>
            <input
              placeholder="Comments"
              value={section.comments}
              onChange={(e) => handleChange(index, "comments", e.target.value)}
              style={styles.input}
            />
            <div>
              <label style={styles.label}>Sensory changes:</label>
              {["continuously", "intermittently"].map((opt) => (
                <span
                  key={`freq-${opt}`}
                  style={styles.optionButton(section.sensoryFrequency === opt)}
                  onClick={() =>
                    toggleFieldValue(index, "sensoryFrequency", opt)
                  }
                >
                  {opt}
                </span>
              ))}

              <div style={{ marginTop: "6px" }}>
                {sensoryLevelOptions.map((level) => {
                  const isSelected = section.sensoryLevels.includes(level);
                  return (
                    <span
                      key={level}
                      style={styles.sensoryTag(isSelected)}
                      onClick={() => toggleLevel(index, level)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) =>
                        (e.key === "Enter" || e.key === " ") &&
                        toggleLevel(index, level)
                      }
                    >
                      {level}
                    </span>
                  );
                })}
              </div>

              <input
                placeholder="Additional sensory notes"
                value={section.sensoryNote}
                onChange={(e) =>
                  handleChange(index, "sensoryNote", e.target.value)
                }
                style={styles.input}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarlierFollowups;
