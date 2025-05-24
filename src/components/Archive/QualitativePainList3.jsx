// import React, { useState, useEffect } from "react";

// const options = [
//   "Burning",
//   "Stabbing",
//   "Shooting",
//   "Touch-sensitive",
//   "Numb",
//   "Tingling",
//   "Dull",
//   "Aching",
//   "Throbbing",
//   "Sharp with movement",
//   "Non-localized",
//   "Deep",
//   "Crampy",
//   "Pressure",
//   "Squeezing"
// ];

// const itemStyle = (isSelected) => ({
//   marginRight: "10px",
//   marginBottom: "5px",
//   cursor: "pointer",
//   padding: "5px 10px",
//   borderRadius: "10px",
//   border: "1px solid",
//   borderColor: isSelected ? "green" : "gray",
//   backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
//   color: isSelected ? "green" : "gray",
//   display: "inline-block",
//   fontWeight: isSelected ? "bold" : "normal",
//   transition: "all 0.3s ease"
// });

// const QualitativePainList = ({ formData, updateFormData }) => {
//   const [selectedOptions, setSelectedOptions] = useState(new Set());

//   useEffect(() => {
//     if (formData?.qualitativePain && selectedOptions.size === 0) {
//       const initialValues =
//         Array.isArray(formData.qualitativePain)
//           ? formData.qualitativePain
//           : formData.qualitativePain.split(",").map((s) => s.trim());
//       setSelectedOptions(new Set(initialValues));
//     }
//   }, [formData]);

//   useEffect(() => {
//     const formatted = Array.from(selectedOptions).join(", ");
//     updateFormData({ qualitativePain: formatted });
//   }, [selectedOptions]);

//   const toggleOption = (option) => {
//     setSelectedOptions((prev) => {
//       const updated = new Set(prev);
//       updated.has(option) ? updated.delete(option) : updated.add(option);
//       return updated;
//     });
//   };

//   return (
//     <div>
//       <strong>Qualitatively it is:</strong>
//       <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap" }}>
//         {options.map((option) => {
//           const isSelected = selectedOptions.has(option);
//           return (
//             <span
//               key={option}
//               style={itemStyle(isSelected)}
//               onClick={() => toggleOption(option)}
//               role="button"
//               tabIndex={0}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter" || e.key === " ") toggleOption(option);
//               }}
//             >
//               {option}
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default QualitativePainList;
import React, { useState, useEffect } from "react";

const options = [
  "Burning",
  "Stabbing",
  "Shooting",
  "Touch-sensitive",
  "Numb",
  "Tingling",
  "Dull",
  "Aching",
  "Throbbing",
  "Sharp with movement",
  "Non-localized",
  "Deep",
  "Crampy",
  "Pressure",
  "Squeezing"
];

const itemStyle = (isSelected) => ({
  marginRight: "10px",
  marginBottom: "5px",
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: "10px",
  border: "1px solid",
  borderColor: isSelected ? "green" : "gray",
  backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
  color: isSelected ? "green" : "gray",
  display: "inline-block",
  fontWeight: isSelected ? "bold" : "normal",
  transition: "all 0.3s ease"
});

const QualitativePainList = ({ formData, updateFormData }) => {
  const [selectedOptions, setSelectedOptions] = useState(new Set());

  useEffect(() => {
    if (formData?.qualitativePain && selectedOptions.size === 0) {
      const initialValues =
        Array.isArray(formData.qualitativePain)
          ? formData.qualitativePain
          : formData.qualitativePain.split(",").map((s) => s.trim());
      setSelectedOptions(new Set(initialValues.filter(Boolean)));
    }
  }, [formData]);

  useEffect(() => {
    const formatted =
      selectedOptions.size === 0
        ? "________________"
        : Array.from(selectedOptions).join(", ");
    updateFormData({ qualitativePain: formatted });
  }, [selectedOptions]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      const updated = new Set(prev);
      updated.has(option) ? updated.delete(option) : updated.add(option);
      return updated;
    });
  };

  return (
    <div>
      <strong>Qualitatively it is:</strong>
      <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap" }}>
        {options.map((option) => {
          const isSelected = selectedOptions.has(option);
          return (
            <span
              key={option}
              style={itemStyle(isSelected)}
              onClick={() => toggleOption(option)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleOption(option);
              }}
            >
              {option}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default QualitativePainList;
