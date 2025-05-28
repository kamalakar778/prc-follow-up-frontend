import React, { useState, useEffect } from "react";
import * as Yup from "yup";

const directionOptions = [
  "right to left",
  "bilateral",
  "right",
  "left",
  "left to right",
];

const baseInjections = [
  {
    label: "L4-5",
    levels: ["left", "right", "bilateral"],
    direction: true,
    directionAfter: false,
    directionSelected: "",
    timing: "Later schedule",
    selectedLevel: "",
    notes: "",
    included: false,
  },
  {
    label: "L5-S1",
    levels: ["left", "right", "bilateral"],
    direction: true,
    directionAfter: false,
    directionSelected: "",
    timing: "Later schedule",
    selectedLevel: "",
    notes: "",
    included: false,
  },
  {
    label: "SI Joint",
    levels: ["left", "right", "bilateral"],
    direction: true,
    directionAfter: false,
    directionSelected: "",
    timing: "Later schedule",
    selectedLevel: "",
    notes: "",
    included: false,
  },
];

const styles = {
  container: { padding: 8, maxWidth: 900, margin: "auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  injectionRow: { display: "flex", alignItems: "center", gap: 4, borderBottom: "1px solid #ddd", padding: 6, background: "#f9fafb", overflowX: "auto" },
  injectionRowEditable: { display: "flex", alignItems: "center", gap: 4, borderBottom: "1px solid #ddd", padding: 6, overflowX: "auto" },
  select: { border: "1px solid #ccc", borderRadius: 4, padding: "6px 4px", fontSize: 13 },
  textInput: { border: "1px solid #ccc", borderRadius: 4, padding: "5px 4px", fontSize: 13 },
  notesInput: { border: "1px solid #ccc", borderRadius: 4, padding: "5px", fontSize: 13, minWidth: 220 },
  moveSelect: { border: "1px solid #ccc", borderRadius: 4, padding: "6px", fontSize: 13 },
  buttonGroup: { marginTop: 12, display: "flex", gap: 8 },
  button: { padding: "4px 8px", borderRadius: 6, border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  addButton: { backgroundColor: "#2563eb", color: "white" },
  resetButton: { backgroundColor: "#6b7280", color: "white" },
  removeButton: { color: "#dc2626", cursor: "pointer", background: "none", border: "none", fontSize: 13 },
  labelText: { whiteSpace: 'nowrap' },
};

const InjectionsList = ({ onInjectionChange }) => {
  const [injections, setInjections] = useState(baseInjections);

  const sortInjections = (list) => {
    return [...list].sort((a, b) => {
      if (a.timing === "Now schedule" && b.timing !== "Now schedule") return -1;
      if (a.timing !== "Now schedule" && b.timing === "Now schedule") return 1;
      return 0;
    });
  };

  const handleChange = (index, field, value) => {
    const updated = [...injections];
    if (field === "timing") {
      updated.forEach((inj, i) => {
        inj.timing = i === index ? value : "Later schedule";
        if (i === index && value === "Now schedule") inj.included = true;
      });
    } else {
      updated[index][field] = field === "notes" ? value.trim() : value;
    }
    setInjections(sortInjections(updated));
  };

  const toggleIncluded = (index) => {
    const updated = [...injections];
    updated[index].included = !updated[index].included;
    setInjections(sortInjections(updated));
  };

  const removeInjection = (index) => {
    const updated = [...injections];
    updated.splice(index, 1);
    setInjections(sortInjections(updated));
  };

  const addInjection = () =>
    setInjections(sortInjections([
      ...injections,
      {
        label: "",
        levels: [],
        direction: false,
        directionAfter: false,
        timing: "Later schedule",
        directionSelected: "",
        selectedLevel: "",
        notes: "",
        included: false,
      },
    ]));

  const moveInjection = (index, newPos) => {
    if (newPos === index + 1) return;
    const updated = [...injections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newPos - 1, 0, moved);
    setInjections(sortInjections(updated));
  };

  const resetAll = () => setInjections(baseInjections);

  useEffect(() => {
    const included = injections.filter((inj) => inj.included);
    const lines = included.map((inj, idx) => {
      const parts = [
        inj.timing,
        inj.direction && !inj.directionAfter ? inj.directionSelected : "",
        inj.label,
        inj.selectedLevel,
        inj.direction && inj.directionAfter ? inj.directionSelected : "",
      ].filter(Boolean);
      return `\t${idx + 1}. ${parts.join(" ")}${inj.notes ? ` ${inj.notes}` : ""}`;
    });

    if (onInjectionChange) {
      onInjectionChange({
        injections: lines.join("\n"),
        INJECTION_SUMMARY: lines.length ? `INJECTIONS:\n${lines.join("\n  ")}` : "",
      });
    }
  }, [injections, onInjectionChange]);

  return (
    <div style={styles.container}>
      {injections.filter((inj) => inj.included).map((inj, idx) => (
        <div key={`preview-${idx}`} style={styles.injectionRow}>
          <strong>{inj.timing}</strong>
          {inj.direction && !inj.directionAfter && inj.directionSelected}
          {" "}<span style={styles.labelText}>{inj.label}</span> {inj.selectedLevel}
          {inj.direction && inj.directionAfter && inj.directionSelected}
          {inj.notes && ` ${inj.notes}`}
          <button onClick={() => toggleIncluded(injections.indexOf(inj))} style={styles.removeButton}>Remove</button>
        </div>
      ))}

      {injections.map((inj, index) => (
        <div key={index} style={styles.injectionRowEditable}>
          <button
            style={{
              ...styles.button,
              backgroundColor: inj.included ? "#dc2626" : "#16a34a",
              color: "white",
              fontSize: 12,
              padding: "6px",
            }}
            onClick={() => toggleIncluded(index)}
          >
            {inj.included ? "Remove" : "Add"}
          </button>

          <strong>{index + 1}.</strong>

          <button
            style={{
              ...styles.button,
              backgroundColor: inj.timing === "Now schedule" ? "#2563eb" : "#6b7280",
              color: "white",
              fontSize: 12,
              padding: "6px",
            }}
            onClick={() => handleChange(index, "timing", inj.timing === "Now schedule" ? "Later schedule" : "Now schedule")}
          >
            {inj.timing}
          </button>

          {inj.direction && !inj.directionAfter && (
            <select style={styles.select} value={inj.directionSelected} onChange={(e) => handleChange(index, "directionSelected", e.target.value)}>
              <option value="">-- Select --</option>
              {directionOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}

          <span style={{ ...styles.labelText, fontWeight: 500 }}>{inj.label}</span>

          {inj.direction && inj.directionAfter && (
            <select style={styles.select} value={inj.directionSelected} onChange={(e) => handleChange(index, "directionSelected", e.target.value)}>
              <option value="">Direction</option>
              {directionOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}

          {inj.levels.length > 0 ? (
            <select style={styles.select} value={inj.selectedLevel} onChange={(e) => handleChange(index, "selectedLevel", e.target.value)}>
              <option value="">Select Level</option>
              {inj.levels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
          ) : (
            <input style={styles.textInput} type="text" placeholder="Enter level" value={inj.selectedLevel} onChange={(e) => handleChange(index, "selectedLevel", e.target.value)} />
          )}

          <select style={styles.moveSelect} value={index + 1} onChange={(e) => moveInjection(index, parseInt(e.target.value, 10))}>
            {injections.map((_, idx) => (
              <option key={idx} value={idx + 1} disabled={idx === index}>
                Move to {idx + 1}
              </option>
            ))}
          </select>

          <input style={styles.notesInput} type="text" placeholder="Notes" value={inj.notes} onChange={(e) => handleChange(index, "notes", e.target.value)} />

          <button style={styles.removeButton} onClick={() => removeInjection(index)}>Remove</button>
        </div>
      ))}

      <div style={styles.buttonGroup}>
        <button style={{ ...styles.button, ...styles.addButton }} onClick={addInjection}>Add Injection</button>
        <button style={{ ...styles.button, ...styles.resetButton }} onClick={resetAll}>Reset All</button>
      </div>
    </div>
  );
};

export default InjectionsList;