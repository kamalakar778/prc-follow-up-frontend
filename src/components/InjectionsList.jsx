import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const directionOptions = [
  "right to left",
  "bilateral",
  "right",
  "left",
  "left to right"
];

const injectionSet1 = [
  { direction: true, label: "lumbar medial branch blocks at", levels: ["L3/4, L4/5, L5/S1", ""] },
  { direction: true, label: "radiofrequency ablation at", levels: ["L3/4, L4/5, L5/S1", ""] },
  { direction: true, label: "cervical medial branch blocks at", levels: ["C5/6, C6/7, C7/T1", ""] },
  { direction: true, label: "radiofrequency ablation at", levels: ["C5/6, C6/7, C7/T1", ""] },
  {
    label: "thoracic medial branch blocks at",
    levels: ["T2/3, T3/4, and T4/5", "T5/6, T6/7, and T7/8", "T9/10, T10/11, and T11/12", ""],
    direction: true
  },
  {
    label: "radiofrequency ablation at",
    levels: ["T2/3, T3/4, and T4/5", "T5/6, T6/7, and T7/8", "T9/10, T10/11, and T11/12", ""],
    direction: true
  }
];

const injectionSet2 = [
  { label: "midline epidural steroid injection at", levels: [], direction: false },
  { label: "midline caudal block", levels: [], direction: false },
  { label: "TFESI at", levels: [], direction: true, directionAfter: true },
  { label: "SIJ Injection at", levels: [], direction: true, directionAfter: true },
  { label: "hip injection (intra-articularly) at", levels: [], direction: true, directionAfter: true },
  { label: "trochanteric bursa hip injection at", levels: [], direction: true, directionAfter: true },
  { label: "knee injection (intra-articularly) at", levels: [], direction: true, directionAfter: true },
  { label: "subacromial shoulder injection at", levels: [], direction: true, directionAfter: true },
  { label: "shoulder injection (intra-articularly) at", levels: [], direction: true, directionAfter: true },
  { label: "SCS trial lumbar at", levels: [], direction: false },
  { label: "SCS implantation lumbar", levels: [], direction: false },
  { label: "trigger point injection at", levels: [], direction: false }
];

const baseInjections = [...injectionSet1, ...injectionSet2, { label: "", levels: [], direction: false }];

const getInitialInjections = () =>
  baseInjections.map((item) => ({
    ...item,
    timing: "Later schedule",
    directionSelected: "",
    selectedLevel: item.levels[0] || "",
    notes: "",
    included: false,
    addedOrder: null
  }));

const styles = {
  container: { maxWidth: 1000, margin: "auto", padding: 0 },
  injectionRow: {
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 8px",
    fontSize: 14
  },
  injectionRowEditable: {
    display: "flex",
    marginBottom: "8px",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    padding: "0px 0px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 14
  },
  button: {
    border: "none",
    padding: "2px 5px",
    borderRadius: 3,
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1.2,
    minWidth: 40,
    whiteSpace: "nowrap"
  },
  select: {
    fontSize: 14,
    padding: "5px 8px",
    minWidth: 60,
    maxWidth: 130,
    margin: "auto"
  },
  notesInput: {
    flex: 1,
    minWidth: "5%",
    padding: "6px 6px",
    fontSize: 14,
    borderRadius: 3,
    border: "1px solid #d1d5db"
  },
  removeButton: {
    marginRight: "auto",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 3,
    padding: "2px 6px",
    fontSize: 14,
    cursor: "pointer",
    lineHeight: 1.2
  },
  index: {
    fontWeight: "bold",
    fontSize: 12,
    minWidth: 0,
    textAlign: "left"
  }
};

const InjectionsList = ({ onInjectionChange, onAutoSetFollowUp, onHasNowSchedule }) => {
  const [injections, setInjections] = useState(getInitialInjections);
  const [addCounter, setAddCounter] = useState(0);
  const [hasNowSchedule, setHasNowSchedule] = useState(false);

  useEffect(() => {
    const anyNowScheduled = injections.some(inj => inj.timing === "Now schedule");
    setHasNowSchedule(anyNowScheduled);
    onHasNowSchedule?.(anyNowScheduled);
  }, [injections, onHasNowSchedule]);

  const ensureEmptyInjectionAtEnd = (list) => {
    const last = list[list.length - 1];
    const isFilled =
      last?.label?.trim() ||
      last?.directionSelected?.trim() ||
      last?.selectedLevel?.trim() ||
      last?.notes?.trim();
    if (isFilled) {
      return [
        ...list,
        {
          label: "",
          levels: [],
          direction: false,
          timing: "Later schedule",
          directionSelected: "",
          selectedLevel: "",
          notes: "",
          included: false,
          addedOrder: null
        }
      ];
    }
    return list;
  };

  const reorderIncluded = (result) => {
    if (!result.destination) return;
    const includedInjections = injections.filter((inj) => inj.included);
    const notIncluded = injections.filter((inj) => !inj.included);
    const [moved] = includedInjections.splice(result.source.index, 1);
    includedInjections.splice(result.destination.index, 0, moved);
    setInjections([...includedInjections, ...notIncluded]);
  };

  const toggleIncluded = (index) => {
    const updated = [...injections];
    const inj = updated[index];
    inj.included = !inj.included;
    inj.addedOrder = inj.included ? addCounter : null;
    if (inj.included) setAddCounter((prev) => prev + 1);
    setInjections(ensureEmptyInjectionAtEnd(updated));
  };

  const handleChange = (index, field, value) => {
    const updated = [...injections];
    if (field === "notes") {
      updated[index].notes = value;
      if (value.trim()) {
        updated[index].selectedLevel = "";
      }
    } else {
      updated[index][field] = value || "";
    }

    if (field === "timing") {
      updated.forEach((inj, i) => {
        if (i === index) {
          inj.timing = value;
          if (value === "Now schedule" || value === "Later schedule") {
            if (!inj.included) {
              inj.included = true;
              if (inj.addedOrder === null) {
                inj.addedOrder = addCounter;
                setAddCounter((prev) => prev + 1);
              }
            }
            if (value === "Now schedule" && onAutoSetFollowUp) {
              onAutoSetFollowUp("Several weeks after procedure");
            }
          }
        } else if (value === "Now schedule") {
          inj.timing = "Later schedule";
        }
      });
    } else {
      const inj = updated[index];
      const shouldInclude =
        inj.label?.trim() ||
        inj.directionSelected?.trim() ||
        inj.selectedLevel?.trim() ||
        inj.notes?.trim();

      if (shouldInclude && !inj.included) {
        inj.included = true;
        if (inj.addedOrder === null) {
          inj.addedOrder = addCounter;
          setAddCounter((prev) => prev + 1);
        }
      }
    }

    setInjections(ensureEmptyInjectionAtEnd(updated));
  };

  const removeFromPreview = (index) => {
    const updated = [...injections];
    updated[index].included = false;
    updated[index].addedOrder = null;
    setInjections(ensureEmptyInjectionAtEnd(updated));
  };

  useEffect(() => {
    const included = injections.filter((inj) => inj.included);
    const orderedIncluded = [...included].sort((a, b) => {
      if (a.timing === "Now schedule" && b.timing !== "Now schedule") return -1;
      if (b.timing === "Now schedule" && a.timing !== "Now schedule") return 1;
      return (a.addedOrder ?? 0) - (b.addedOrder ?? 0);
    });

    const set1Labels = injectionSet1.map((i) => i.label);
    const lines = orderedIncluded.map((inj, idx) => {
      const isSet1 = set1Labels.includes(inj.label);
      const parts = isSet1
        ? [
            inj.timing + "",
            inj.directionAfter ? null : inj.directionSelected || "",
            inj.label,
            inj.directionAfter ? inj.directionSelected || "" : null,
            inj.selectedLevel || ""
          ]
        : [
            inj.timing + "",
            inj.label,
            inj.directionAfter ? null : inj.directionSelected || "",
            inj.selectedLevel || "",
            inj.directionAfter ? inj.directionSelected || "" : null
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

  const included = injections
    .filter((inj) => inj.included)
    .sort((a, b) => {
      if (a.timing === "Now schedule" && b.timing !== "Now schedule") return -1;
      if (b.timing === "Now schedule" && a.timing !== "Now schedule") return 1;
      return (a.addedOrder ?? 0) - (b.addedOrder ?? 0);
    });

  return (
    <div style={styles.container}>
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>Included Injections (Drag to Reorder)</h3>
      <DragDropContext onDragEnd={reorderIncluded}>
        <Droppable droppableId="included-injections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {included.map((inj, idx) => (
                <Draggable key={idx} draggableId={`included-${idx}`} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...styles.injectionRow, ...provided.draggableProps.style }}
                    >
                      {`${idx + 1}. `}
                      <strong>{inj.timing}</strong>&nbsp;
                      {inj.direction && !inj.directionAfter && inj.directionSelected && ` ${inj.directionSelected}`} {inj.label} {inj.selectedLevel}
                      {inj.direction && inj.directionAfter && inj.directionSelected && ` ${inj.directionSelected}`}
                      {inj.notes && ` ${inj.notes}`}&nbsp;&nbsp;
                      <button onClick={() => removeFromPreview(injections.indexOf(inj))} style={styles.removeButton}>
                        Remove
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <h3 style={{ fontSize: 14, marginTop: 24, marginBottom: 8 }}>All Injections (Edit / Include)</h3>
      {injections.map((inj, index) => (
        <div key={index} style={styles.injectionRowEditable}>
          <button
            style={{
              ...styles.button,
              backgroundColor: inj.included ? "#dc2626" : "#16a34a",
              color: "white"
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
              color: "white"
            }}
            onClick={() => handleChange(index, "timing", inj.timing === "Now schedule" ? "Later schedule" : "Now schedule")}
          >
            {inj.timing}
          </button>

          {inj.direction && !inj.directionAfter && (
            <select style={styles.select} value={inj.directionSelected} onChange={(e) => handleChange(index, "directionSelected", e.target.value)}>
              <option value="">-- Select --</option>
              {directionOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}

          <span style={{ fontWeight: 500 }}>{inj.label}</span>

          {inj.levels.length > 0 && (
            <select style={styles.select} value={inj.selectedLevel} onChange={(e) => handleChange(index, "selectedLevel", e.target.value)}>
              {inj.levels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          )}

          {inj.direction && inj.directionAfter && (
            <select style={styles.select} value={inj.directionSelected} onChange={(e) => handleChange(index, "directionSelected", e.target.value)}>
              <option value="">Direction</option>
              {directionOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}

          <input
            style={styles.notesInput}
            value={inj.notes}
            placeholder="Notes..."
            onChange={(e) => handleChange(index, "notes", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default InjectionsList;
