import React, { useState, useEffect } from "react";

const options = [
  "Burning", "Stabbing", "Shooting", "Touch-sensitive", "Numb",
  "Tingling", "Dull", "Aching", "Throbbing", "Sharp with movement",
  "Non-localized", "Deep", "Crampy", "Pressure", "Squeezing"
];

const optionStyle = (selected) => ({
  padding: "8px 12px",
  borderRadius: "20px",
  border: "1px solid #ccc",
  cursor: "pointer",
  backgroundColor: selected ? "#4CAF50" : "#f0f0f0",
  color: selected ? "#fff" : "#333",
  fontWeight: selected ? "bold" : "normal",
  transition: "background-color 0.3s, color 0.3s"
});

const QualitativePainList = ({ formData, updateFormData }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (formData.qualitativePain) {
      const savedOptions = formData.qualitativePain.split(", ").filter(Boolean);
      setSelectedOptions(savedOptions);
    }
  }, [formData.qualitativePain]);

  const toggleOption = (option) => {
    const updated = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updated);
    updateFormData({ qualitativePain: updated.join(", ") });
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {options.map((option) => (
        <div
          key={option}
          style={optionStyle(selectedOptions.includes(option))}
          onClick={() => toggleOption(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default QualitativePainList;
