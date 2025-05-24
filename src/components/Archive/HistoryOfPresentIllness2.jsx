import React from "react";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 1000,
    margin: "0 auto",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    borderBottom: "2px solid #ddd",
    paddingBottom: 8,
  },
  inlineGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
    marginBottom: "-0.5rem",
  },
  labelText: {
    fontWeight: 600,
    fontSize: 14,
    color: "#444",
    minWidth: 220,
  },
  select: {
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    width: 220,
  },
};

const illnessOptions = ["More tolerable", "Less tolerable", "Improved", "Worse", "The same"];

const HistoryOfPresentIllness = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  return (
    <div style={styles.container}>
      {[
        { label: "Pain is:", name: "pain_illnessLevel" },
        { label: "Activity level/functioning is:", name: "activity_illnessLevel" },
        { label: "Social relationships are:", name: "social_illnessLevel" },
        { label: "Job performance is (if working):", name: "job_illnessLevel" },
        { label: "Sleep patterns are:", name: "sleep_illnessLevel" },
      ].map(({ label, name }) => (
        <div key={name} style={styles.inlineGroup}>
          <label style={styles.labelText}>{label}</label>
          <select
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">-- Select an option --</option>
            {illnessOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default HistoryOfPresentIllness;

