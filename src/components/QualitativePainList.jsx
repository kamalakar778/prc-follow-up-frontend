import React, { useState, useMemo, useEffect } from "react";

const QualitativePainList = ({ updateFormData }) => {
  const allItems = useMemo(() => [
    "Burning", "Stabbing", "Shooting", "Touch-sensitive", "Numb",
    "Tingling", "Dull", "Aching", "Throbbing", "Sharp with movement",
    "Non-localized", "Deep", "Crampy", "Pressure", "Squeezing"
  ], []);

  const [clickedItems, setClickedItems] = useState(new Set());

  const handleItemClick = (item) => {
    setClickedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (typeof updateFormData === "function") {
      updateFormData(Array.from(clickedItems).join(", "));
    }
  }, [clickedItems, updateFormData]);

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
    display: "inline-block"
  });

  return (
    <div>
      <strong>Qualitatively it is:</strong>
      <div style={{ marginTop: "10px" }}>
        {allItems.map((item) => {
          const isSelected = clickedItems.has(item);
          return (
            <span
              key={item}
              style={itemStyle(isSelected)}
              onClick={() => handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => (e.key === "Enter" || e.key === " ") && handleItemClick(item)}
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default QualitativePainList;
