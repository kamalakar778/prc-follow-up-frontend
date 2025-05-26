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
  { direction: true, label: "lumbar medial branch blocks at", levels: ["L3/4, L4/5, L5/S1", "Level 2", "Level 3"] },
  { direction: true, label: "radiofrequency ablation at", levels: ["L3/4, L4/5, L5/S1", "Level 2", "Level 3"] },
  { direction: true, label: "cervical medial branch blocks at", levels: ["C5/6, C6/7, C7/T1", "Level 2", "Level 3"] },
  { direction: true, label: "radiofrequency ablation at", levels: ["C5/6, C6/7, C7/T1", "Level 2", "Level 3"] },
  { label: "thoracic medial branch blocks at", levels: ["T2/3, T3/4, and T4/5", "T5/6, T6/7, and T7/8", "T9/10, T10/11, and T11/12"], direction: true },
  { label: "radiofrequency ablation at", levels: ["T2/3, T3/4, and T4/5", "T5/6, T6/7, and T7/8", "T9/10, T10/11, and T11/12"], direction: true },
  { label: "midline epidural steroid injection at", levels: [], direction: false },
  { label: "midline caudal block ", levels: [], direction: false },
  { label: "TFESI at", levels: [], direction: true, directionAfter: true },
  { label: "SIJ Injection at ", levels: [], direction: true, directionAfter: true },
  { label: "hip injection (intra-articularly) at", levels: [], direction: true, directionAfter: true },
  { label: "trochanteric bursa hip injection at", levels: [], direction: true, directionAfter: true },
  { label: "knee injection (intra-articularly) at", levels: [], direction: true, directionAfter: true },
  { label: "subacromial shoulder injection at", levels: [], direction: true, directionAfter: true },
  { label: "shoulder injection (intra-articularly) at", levels: [], direction: true, directionAfter: true },
  { label: "SCS trial lumbar at", levels: [], direction: false },
  { label: "SCS implantation lumbar at", levels: [], direction: false },
  { label: "trigger point injection at", levels: [], direction: false },
  { label: "", levels: [], direction: false }
];

const getInitialInjections = () =>
  baseInjections.map((item) => ({
    ...item,
    timing: "Later schedule ",
    directionSelected: "",
    selectedLevel: item.levels[0] || "",
    notes: "",
    included: false
  }));

const injectionSchema = Yup.object().shape({
  label: Yup.string().required("Label is required"),
  timing: Yup.string().oneOf(["Now schedule", "Later shedule"]).required(),
  directionSelected: Yup.string().when("direction", {
    is: true,
    then: Yup.string().required("Direction is required"),
    otherwise: Yup.string().notRequired()
  }),
  selectedLevel: Yup.string().required("Level is required"),
  notes: Yup.string().max(200, "Notes must be under 200 characters"),
  included: Yup.boolean()
});

const fullInjectionSchema = Yup.array()
  .of(injectionSchema)
  .test(
    "direction-required-if-included-or-later",
    function (injections) {
      if (!injections) return true;

      const failingIndexes = injections
        .map((inj, idx) => {
          const needsDirection =
            inj.direction &&
            (inj.included || inj.timing === "Later");

          return needsDirection && !inj.directionSelected?.trim()
            ? idx + 1
            : null;
        })
        .filter(Boolean);

      if (failingIndexes.length > 0) {
        return this.createError({
          message: `Direction is required for injection(s) at position(s): ${failingIndexes.join(
            ", "
          )}`,
        });
      }

      return true;
    }
  );

const styles = {
  container: { padding: 8, maxWidth: 900, margin: "auto", marginBottom: "0px 30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  header: { fontSize: 20, fontWeight: 700, textDecoration: "underline", marginBottom: 8 },
  injectionRow: { display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 2, margin: "0px -60px", borderBottom: "1px solid #ddd", paddingBottom: 2, whiteSpace: "nowrap", overflowX: "auto" },
  injectionRowEditable: { display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 1, margin: "-5px -60px", borderBottom: "1px solid #ddd", paddingBottom: 2, whiteSpace: "nowrap", overflowX: "auto" },
  index: { fontWeight: 600, minWidth: 20 },
  select: { border: "1px solid #ccc", borderRadius: 4, padding: "6px 4px", margin: "10px 0px", fontSize: 13, minWidth: 100, maxWidth: 60 },
  textInput: { border: "1px solid #ccc", borderRadius: 4, padding: "5px 4px", fontSize: 13, minWidth: 150 },
  notesInput: { border: "1px solid #ccc", borderRadius: 4, padding: "6px 1px", margin: "10px 0px", fontSize: 13, minWidth: 220 },
  moveSelect: { border: "1px solid #ccc", borderRadius: 4, padding: "6px 4px", margin: "10px 0px", fontSize: 13, minWidth: 80, maxWidth: 20 },
  removeButton: { color: "#dc2626", cursor: "pointer", background: "none", border: "none", fontSize: 13, fontWeight: 600, padding: "1px 4px" },
  buttonGroup: { marginTop: 12, display: "flex", gap: 8 },
  button: { padding: "4px 8px", borderRadius: 6, border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  addButton: { backgroundColor: "#2563eb", color: "white", gap: 4 },
  addButtonHover: { backgroundColor: "#1d4ed8" },
  resetButton: { backgroundColor: "#6b7280", color: "white" },
  resetButtonHover: { backgroundColor: "#4b5563" }
};

const InjectionsList = ({ onInjectionChange }) => {
  const [injections, setInjections] = useState(getInitialInjections);
  const [addHover, setAddHover] = useState(false);
  const [resetHover, setResetHover] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...injections];
    if (field === "timing") {
      updated.forEach((inj, i) => {
        if (i === index) {
          inj.timing = value;
          if (value === "Now schedule") inj.included = true;
        } else if (value === "Now schedule") {
          inj.timing = "Later schedule";
        }
      });
    } else {
      updated[index][field] = field === "notes" ? value.trim() : value || "";
    }
    setInjections(updated);
  };

  const toggleIncluded = (index) => {
    const updated = [...injections];
    updated[index].included = !updated[index].included;
    setInjections(updated);
  };

  const removeFromPreview = (index) => {
    const updated = [...injections];
    updated[index].included = false;
    setInjections(updated);
  };

  const removeInjection = (index) => {
    const updated = [...injections];
    updated.splice(index, 1);
    setInjections(updated);
  };

  const addInjection = () =>
    setInjections([
      ...injections,
      {
        label: "schedule",
        levels: ["schedule"],
        direction: false,
        directionAfter: false,
        timing: "Later",
        directionSelected: "",
        selectedLevel: "",
        notes: "",
        included: false
      }
    ]);

  const moveInjection = (index, newPos) => {
    if (newPos === index + 1) return;
    const updated = [...injections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newPos - 1, 0, moved);
    setInjections(updated);
  };

  const resetAll = () => setInjections(getInitialInjections());

  useEffect(() => {
    const now = injections.filter((inj) => inj.timing === "Now schedule");
    const later = injections.filter((inj) => inj.timing !== "Now schedule");
    const reordered = [...now, ...later];
    const sameOrder = reordered.length === injections.length && reordered.every((inj, idx) => inj === injections[idx]);
    if (!sameOrder) setInjections(reordered);
  }, [injections]);

  useEffect(() => {
    const included = injections.filter((inj) => inj.included);
    const lines = included.map((inj, idx) => {
      const parts = [
        inj.timing === "Now schedule" ? "Now schedule" : "Later schedule",
        inj.directionSelected || "",
        inj.label,
        inj.selectedLevel || inj.levels?.join(", ") || "",
      ];
      const line = parts.filter(Boolean).join(" ").trim();
      const notesPart = inj.notes ? ` ${inj.notes}` : "";
      return `\t${idx + 1}. ${line}${notesPart}`;
    });

    if (onInjectionChange) {
      onInjectionChange({
        injections: lines.join("\n"),
        INJECTION_SUMMARY: lines.length ? `INJECTIONS:\n${lines.join("\n  ")}` : ""
      });
    }
  }, [injections, onInjectionChange]);

  return (
    <div style={styles.container}>
      {injections.filter((inj) => inj.included).map((inj, idx) => (
        <div key={idx} style={{ ...styles.injectionRow, background: "#f9fafb" }}>
          <strong>{inj.timing}</strong>
          {inj.direction && !inj.directionAfter && inj.directionSelected && `${inj.directionSelected}`}
          {" "}{inj.label} {inj.selectedLevel}
          {inj.direction && inj.directionAfter && inj.directionSelected && `${inj.directionSelected}`}
          {inj.notes && ` ${inj.notes}`}
          <button onClick={() => removeFromPreview(injections.indexOf(inj))} style={styles.removeButton}>Remove</button>
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
              padding: "6px 6px"
            }}
            onClick={() => toggleIncluded(index)}
          >
            {inj.included ? "Remove" : "Add"}
          </button>

          <span style={styles.index}>{index + 1}.</span>

          <button
            style={{
              ...styles.button,
              backgroundColor: inj.timing === "Now schedule" ? "#2563eb" : "#6b7280",
              color: "white",
              fontSize: 12,
              padding: "6px 6px"
            }}
            onClick={() => handleChange(index, "timing", inj.timing === "Now schedule" ? "Later schedule" : "Now schedule")}
          >
            {inj.timing}
          </button>

          {inj.direction && !inj.directionAfter && (
            <select
              style={styles.select}
              value={inj.directionSelected}
              onChange={(e) => handleChange(index, "directionSelected", e.target.value)}
            >
              <option value="">-- Select --</option>
              {directionOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}

          <span style={{ fontWeight: 500 }}>{inj.label}</span>

          {inj.direction && inj.directionAfter && (
            <select
              style={styles.select}
              value={inj.directionSelected}
              onChange={(e) => handleChange(index, "directionSelected", e.target.value)}
            >
              <option value="">Direction</option>
              {directionOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}

          {inj.label === "" ? (
            <input
              style={styles.textInput}
              type="text"
              placeholder="Enter description"
              value={inj.selectedLevel}
              onChange={(e) => handleChange(index, "selectedLevel", e.target.value)}
            />
          ) : (
            inj.levels.length > 0 && (
              <select
                style={styles.select}
                value={inj.selectedLevel}
                onChange={(e) => handleChange(index, "selectedLevel", e.target.value)}
              >
                <option value="">Select Level</option>
                {inj.levels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            )
          )}

          <select
            style={styles.moveSelect}
            value={index + 1}
            onChange={(e) => moveInjection(index, parseInt(e.target.value, 10))}
          >
            {injections.map((_, idx) => (
              <option key={idx} value={idx + 1}>
                Move to {idx + 1}
              </option>
            ))}
          </select>

          <input
            style={styles.notesInput}
            type="text"
            placeholder="Notes"
            value={inj.notes}
            onChange={(e) => handleChange(index, "notes", e.target.value)}
          />

          <button
            style={styles.removeButton}
            onClick={() => removeInjection(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <div style={styles.buttonGroup}>
        <button
          style={{ ...styles.button, ...styles.addButton, ...(addHover ? styles.addButtonHover : {}) }}
          onMouseEnter={() => setAddHover(true)}
          onMouseLeave={() => setAddHover(false)}
          onClick={addInjection}
        >
          Add Injection
        </button>

        <button
          style={{ ...styles.button, ...styles.resetButton, ...(resetHover ? styles.resetButtonHover : {}) }}
          onMouseEnter={() => setResetHover(true)}
          onMouseLeave={() => setResetHover(false)}
          onClick={resetAll}
        >
          Reset All
        </button>
      </div>
    </div>
  );
};

export default InjectionsList;
