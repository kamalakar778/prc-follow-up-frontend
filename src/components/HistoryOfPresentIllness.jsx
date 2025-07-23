import React, { useEffect, useState } from "react";

const styles = {
  container: { fontFamily: "Arial, sans-serif", maxWidth: 1000, margin: "0 auto", padding: 16, backgroundColor: "#f0f0f0", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#333", borderBottom: "2px solid #ddd", paddingBottom: 8, },
  inlineGroup: { marginBottom: 10, },
  // labelText: {    fontWeight: 600,    fontSize: 14,    color: "#444",    marginBottom: 8,    display: "block",  },
  optionButton: (isSelected) => ({ marginRight: 4, marginBottom: 3, cursor: "pointer", padding: "6px 12px", borderRadius: "10px", border: "1px solid", borderColor: isSelected ? "green" : "gray", backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5", color: isSelected ? "green" : "gray", display: "inline-block", fontWeight: isSelected ? "bold" : "normal", transition: "all 0.3s ease", }),
};

const illnessOptions = ["More tolerable", "Less tolerable", "Improved", "Worse", "The same",];

const items = [
  { label: "Pain is:", name: "pain_illnessLevel" },
  { label: "Activity level/functioning is:", name: "activity_illnessLevel" },
  { label: "Social relationships are:", name: "social_illnessLevel" },
  { label: "Job performance is (if working):", name: "job_illnessLevel" },
  { label: "Sleep patterns are:", name: "sleep_illnessLevel" },
];

const HistoryOfPresentIllness = ({ formData = {}, setFormData }) => {
  const [selections, setSelections] = useState({});

  // Load initial formData
  useEffect(() => {
    const initial = {};
    items.forEach(({ name }) => {
      if (formData[name]) initial[name] = formData[name];
    });
    setSelections(initial);
  }, [formData]);

  // Send updates to parent
  useEffect(() => {
    setFormData({ ...selections });
  }, [selections]);

  const handleSelect = (name, value) => {
    setSelections((prev) => ({
      ...prev,
      [name]: prev[name] === value ? "" : value,
    }));
  };

  return (
    <div style={styles.container}>
      {/* <div style={styles.sectionTitle}>History of Present Illness</div> */}
      {items.map(({ label, name }) => (
        <div key={name} style={styles.inlineGroup}>
          <label style={styles.labelText}>{label} &nbsp;&nbsp;

            {illnessOptions.map((option) => {
              const isSelected = selections[name] === option;
              return (
                <span
                  key={option}
                  style={styles.optionButton(isSelected)}
                  onClick={() => handleSelect(name, option)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleSelect(name, option);
                  }}
                >
                  {option}
                </span>
              );
            })}
          </label>

        </div>
      ))}
    </div>
  );
};

export default HistoryOfPresentIllness;
