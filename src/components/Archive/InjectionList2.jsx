import React, { useState } from "react";

const directionOptions = ["right", "left", "right to left", "left to right", "bilateral"];

export const getInitialInjections = () =>
  [
    { label: "lumbar medial branch blocks", levels: ["L3/4", "L4/5", "L5/S1"], direction: true },
    { label: "radiofrequency ablation", levels: ["L3/4", "L4/5", "L5/S1"], direction: true },
    { label: "cervical medial branch blocks", levels: ["C5/6", "C6/7", "C7/T1"], direction: true },
    { label: "radiofrequency ablation", levels: ["C5/6", "C6/7", "C7/T1"], direction: true },
    { label: "thoracic medial branch blocks", levels: ["T2/3", "T3/4", "T4/5"], direction: true },
    { label: "radiofrequency ablation", levels: ["T2/3", "T3/4", "T4/5"], direction: true },
    { label: "midline epidural steroid injection", levels: [], direction: false },
    { label: "midline caudal block", levels: [], direction: false },
    { label: "TFESI", levels: [], direction: true, directionAfter: true },
    { label: "hip injection (intra-articular)", levels: [], direction: true, directionAfter: true },
    { label: "trochanteric bursa hip injection", levels: [], direction: true, directionAfter: true },
    { label: "knee injection (intra-articular)", levels: [], direction: true, directionAfter: true },
    { label: "subacromial shoulder injection", levels: [], direction: true, directionAfter: true },
    { label: "shoulder injection (intra-articular)", levels: [], direction: true, directionAfter: true },
    { label: "SCS trial lumbar", levels: [], direction: false },
    { label: "SCS implantation lumbar", levels: [], direction: false },
    { label: "trigger point injection", levels: [], direction: false },
    { label: "custom", levels: ["Custom"], direction: false }
  ].map(item => ({ ...item, timing: "Later", directionSelected: "", selectedLevel: "", notes: "" }));

const InjectionsList = () => {
  const [injections, setInjections] = useState(getInitialInjections);

  const handleChange = (index, field, value) => {
    const updated = [...injections];
    if (field === "timing" && value === "Now") {
      updated.forEach((inj, i) => inj.timing = i === index ? "Now" : "Later");
    } else {
      updated[index][field] = field === "notes" ? value.trim() : value || "";
    }
    setInjections(updated);
  };

  const addInjection = () => {
    setInjections([...injections, {
      label: "custom", levels: ["Custom"], direction: false, directionAfter: false,
      directionSelected: "", selectedLevel: "Custom", timing: "Later", notes: ""
    }]);
  };

  const removeInjection = (index) => setInjections(injections.filter((_, i) => i !== index));

  const moveInjection = (index, newPosition) => {
    if (newPosition === index + 1) return;
    const updated = [...injections];
    const [moved] = updated.splice(index, 1);
    updated.splice(newPosition - 1, 0, moved);
    setInjections(updated);
  };

  const resetAll = () => setInjections(getInitialInjections());

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold underline">INJECTIONS:</h2>
      {injections.map((inj, index) => (
        <div key={index} className="flex flex-wrap items-center gap-2">
          <span>{index + 1}.</span>
          <label><input type="radio" name={`timing-${index}`} value="Now" checked={inj.timing === "Now"} onChange={e => handleChange(index, "timing", e.target.value)} /> Now</label>
          <label><input type="radio" name={`timing-${index}`} value="Later" checked={inj.timing === "Later"} onChange={e => handleChange(index, "timing", e.target.value)} /> Later</label>
          {!inj.directionAfter && inj.direction && (
            <select value={inj.directionSelected} onChange={e => handleChange(index, "directionSelected", e.target.value)} className="border rounded p-1">
              <option value="">Select Direction</option>
              {directionOptions.map(dir => <option key={dir} value={dir}>{dir}</option>)}
            </select>
          )}
          <span>{inj.label}</span>
          {inj.directionAfter && inj.direction && (
            <select value={inj.directionSelected} onChange={e => handleChange(index, "directionSelected", e.target.value)} className="border rounded p-1">
              <option value="">Select Direction</option>
              {directionOptions.map(dir => <option key={dir} value={dir}>{dir}</option>)}
            </select>
          )}
          {inj.label === "custom" ? (
            <input type="text" placeholder="Enter custom injection description" className="border rounded p-1 w-64" value={inj.selectedLevel} onChange={e => handleChange(index, "selectedLevel", e.target.value)} />
          ) : inj.levels.length > 0 && (
            <>
              <span>at</span>
              <select value={inj.selectedLevel} onChange={e => handleChange(index, "selectedLevel", e.target.value)} className="border rounded p-1">
                <option value="">Select Level</option>
                {inj.levels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </>
          )}
          <select onChange={e => moveInjection(index, parseInt(e.target.value))} value={index + 1} className="border rounded p-1 ml-2">
            {injections.map((_, idx) => <option key={idx} value={idx + 1}>Move to {idx + 1}</option>)}
          </select>
          <button onClick={() => removeInjection(index)} className="text-red-500 hover:underline ml-2">Remove</button>
          <input type="text" placeholder="Notes" value={inj.notes} onChange={e => handleChange(index, "notes", e.target.value)} className="border rounded p-1 ml-2 w-48" />
        </div>
      ))}
      <button onClick={addInjection} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Injection</button>
      <button onClick={resetAll} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-4">Reset All</button>
    </div>
  );
};

export default InjectionsList;
