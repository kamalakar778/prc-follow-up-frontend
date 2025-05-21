import React, { useState, useEffect } from "react";

// 👉 Available direction options
const directionOptions = [
  "Schedule right",
  "Schedule left",
  "Schedule right to left",
  "Schedule left to right",
  "Schedule bilateral"
];

// 👉 Base injection templates
const baseInjections = [
  { label: "lumbar medial branch blocks at", levels: ["L3/4, L4/5, L5/S1"], direction: true },
  { label: "radiofrequency ablation at", levels: ["L3/4 , L4/5 , L5/S1"], direction: true },
  { label: "cervical medial branch blocks at", levels: ["C5/6, C6/7, C7/T1"], direction: true },
  { label: "radiofrequency ablation at", levels: ["C5/6, C6/7, C7/T1"], direction: true },
  { label: "thoracic medial branch blocks at", levels: ["T2/3, T3/4, and T4/5", "T5/6, T6/7, and T7/8", "T9/10, T10/11, and T11/12"], direction: true },
  { label: "radiofrequency ablation at", levels: ["T2/3, T3/4, and T4/5", "T5/6, T6/7, and T7/8", "T9/10, T10/11, and T11/12"], direction: true },
  { label: "schedule midline epidural steroid injection at", levels: [], direction: false },
  { label: "schedule midline caudal block at", levels: [], direction: false },
  { label: "schedule TFESI at", levels: [], direction: true, directionAfter: true },
  { label: "schedule hip injection (intra-articular) at", levels: [], direction: true, directionAfter: true },
  { label: "schedule trochanteric bursa hip injection at", levels: [], direction: true, directionAfter: true },
  { label: "schedule knee injection (intra-articular) at", levels: [], direction: true, directionAfter: true },
  { label: "schedule subacromial shoulder injection at", levels: [], direction: true, directionAfter: true },
  { label: "schedule shoulder injection (intra-articular) at", levels: [], direction: true, directionAfter: true },
  { label: "schedule SCS trial lumbar at", levels: [], direction: false },
  { label: "schedule SCS implantation lumbar at", levels: [], direction: false },
  { label: "schedule trigger point injection at", levels: [], direction: false },
  { label: "schedule", levels: ["schedule at"], direction: false }
];

// 👉 Initialize state with added control fields
const getInitialInjections = () =>
  baseInjections.map(item => ({
    ...item,
    timing: "Later",
    directionSelected: "",
    selectedLevel: "",
    notes: "",
    included: false
  }));

// 👉 Basic inline styles for layout
const styles = {
  container: {
    padding: 16,
    maxWidth: 900,
    margin: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    textDecoration: "underline",
    marginBottom: 12,
  },
  injectionRow: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
    borderBottom: "1px solid #ddd",
    paddingBottom: 4,
    whiteSpace: "nowrap",
    overflowX: "auto",
  },
  index: {
    fontWeight: "600",
    minWidth: 20,
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    cursor: "pointer",
    fontSize: 13,
  },
  select: {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: 13,
    minWidth: 100,
    maxWidth: 60
  },
  textInput: {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "4px 6px",
    fontSize: 13,
    minWidth: 150,
  },
  notesInput: {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "8px 1px",
    fontSize: 13,
    minWidth: 280,
  },
  moveSelect: {
    border: "1px solid #ccc",
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: 13,
    minWidth: 80,
  },
  removeButton: {
    color: "#dc2626",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    padding: "2px 6px",
  },
  buttonGroup: {
    marginTop: 16,
    display: "flex",
    gap: 12,
  },
  button: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#2563eb",
    color: "white",
  },
  addButtonHover: {
    backgroundColor: "#1d4ed8",
  },
  resetButton: {
    backgroundColor: "#6b7280",
    color: "white",
  },
  resetButtonHover: {
    backgroundColor: "#4b5563",
  },
};

const InjectionsList = () => {
  const [injections, setInjections] = useState(getInitialInjections);
  const [addHover, setAddHover] = useState(false);
  const [resetHover, setResetHover] = useState(false);

  // 👉 Handle change in field value
  const handleChange = (index, field, value) => {
    const updated = [...injections];
    if (field === "timing" && value === "Now")
      updated.forEach((inj, i) => (inj.timing = i === index ? "Now" : "Later"));
    else
      updated[index][field] = field === "notes" ? value.trim() : value || "";
    setInjections(updated);
  };

  // 👉 Toggle inclusion of injection in preview
  const toggleIncluded = (index) => {
    const updated = [...injections];
    updated[index].included = !updated[index].included;
    setInjections(updated);
  };

  // 👉 Remove from preview
  const removeFromPreview = (index) => {
    const updated = [...injections];
    updated[index].included = false;
    setInjections(updated);
  };

  // 👉 Add blank injection
  const addInjection = () => {
    setInjections([
      ...injections,
      {
        label: "schedule",
        levels: ["schedule"],
        direction: false,
        directionAfter: false,
        timing: "Later",
        directionSelected: "",
        selectedLevel: "schedule",
        notes: "",
        included: false
      }
    ]);
  };

  // 👉 Move injection to new position
  const moveInjection = (index, newPosition) => {
    if (newPosition === index + 1) return;
    const updated = [...injections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newPosition - 1, 0, moved);
    setInjections(updated);
  };

  // 👉 Reset all injections
  const resetAll = () => setInjections(getInitialInjections());

  // 👉 Keep "Now" injections at the top
  useEffect(() => {
    const now = injections.filter(inj => inj.timing === "Now");
    const later = injections.filter(inj => inj.timing !== "Now");
    const reordered = [...now, ...later];

    const isSame = reordered.every((inj, idx) => inj === injections[idx]);
    if (!isSame) setInjections(reordered);
  }, [injections]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>INJECTION PREVIEW:</h2>
      {injections.filter(inj => inj.included).map((inj, idx) => (
        <div key={idx} style={{ ...styles.injectionRow, background: "#f9fafb" }}>
          <strong>{inj.timing}</strong>{" "}
          {inj.direction && !inj.directionAfter && inj.directionSelected && ` - ${inj.directionSelected}`}{" "}
          {inj.label} {inj.selectedLevel}{" "}
          {inj.direction && inj.directionAfter && inj.directionSelected && ` - ${inj.directionSelected}`}{" "}
          {inj.notes && ` - Notes: ${inj.notes}`}
          <button
            onClick={() => removeFromPreview(injections.indexOf(inj))}
            style={styles.removeButton}
          >
            Remove
          </button>
        </div>
      ))}

      <h2 style={styles.header}>INJECTIONS:</h2>
      {injections.map((inj, index) => (
        <div key={index} style={styles.injectionRow}>
          <input
            type="checkbox"
            checked={inj.included}
            onChange={() => toggleIncluded(index)}
          />

          <span style={styles.index}>{index + 1}.</span>

          {["Now", "Later"].map(t => (
            <label key={t} style={styles.radioLabel}>
              <input
                type="radio"
                name={`timing-${index}`}
                value={t}
                checked={inj.timing === t}
                onChange={(e) => handleChange(index, "timing", e.target.value)}
              />{" "}
              {t}
            </label>
          ))}

          {(inj.direction && !inj.directionAfter) && (
            <select
              value={inj.directionSelected}
              onChange={(e) => handleChange(index, "directionSelected", e.target.value)}
              style={styles.select}
            >
              <option value="">Direction</option>
              {directionOptions.map((dir) => (
                <option key={dir} value={dir}>{dir}</option>
              ))}
            </select>
          )}

          <span style={{ fontWeight: 500 }}>{inj.label}</span>

          {(inj.direction && inj.directionAfter) && (
            <select
              value={inj.directionSelected}
              onChange={(e) => handleChange(index, "directionSelected", e.target.value)}
              style={styles.select}
            >
              <option value="">Direction</option>
              {directionOptions.map((dir) => (
                <option key={dir} value={dir}>{dir}</option>
              ))}
            </select>
          )}

          {inj.label === "schedule" ? (
            <input
              type="text"
              placeholder="Enter description"
              value={inj.selectedLevel}
              onChange={(e) => handleChange(index, "selectedLevel", e.target.value)}
              style={styles.textInput}
            />
          ) : inj.levels.length > 0 && (
            <select
              value={inj.selectedLevel}
              onChange={(e) => handleChange(index, "selectedLevel", e.target.value)}
              style={styles.select}
            >
              <option value="">Select Level</option>
              {inj.levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          )}

          <select
            onChange={(e) => moveInjection(index, parseInt(e.target.value))}
            value={index + 1}
            style={styles.moveSelect}
          >
            {injections.map((_, idx) => (
              <option key={idx} value={idx + 1}>Move to {idx + 1}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Notes"
            value={inj.notes}
            onChange={(e) => handleChange(index, "notes", e.target.value)}
            style={styles.notesInput}
          />
        </div>
      ))}

      <div style={styles.buttonGroup}>
        <button
          onClick={addInjection}
          style={{
            ...styles.button,
            ...styles.addButton,
            ...(addHover ? styles.addButtonHover : {})
          }}
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
        >
          Add Injection
        </button>

        <button
          onClick={resetAll}
          style={{
            ...styles.button,
            ...styles.resetButton,
            ...(resetHover ? styles.resetButtonHover : {})
          }}
          onMouseEnter={() => setResetHover(true)}
          onMouseLeave={() => setResetHover(false)}
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default InjectionsList;

