import React from "react";

const options = [
  "No",
  "Yes",
  "Yes, The Problem is being treated",
  "Yes, The Problem is not being treated",
  "No, The problem is not being treated",
];

const allergicSymptoms = [
  "Allergies to new Meds/Foods",
  "Hives and Itchy skin",
  "Sneezing",
  "Hay fever",
  "Red & Itchy eyes",
];

const neurologicalSymptoms = [
  "Worsening Weakness in limbs",
  "Worsening Sensation in limbs",
  "Numbness/tingling sensations",
  "Loss of Bowel or Bladder",
  "New convulsions or seizures",
];

const ReviewOfSystems = () => {
  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h2 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "10px" }}>
        REVIEW OF SYSTEMS:
      </h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", fontWeight: "bold", fontSize: "16px", paddingBottom: "10px" }}>
              ALLERGIC SYMPTOMS INCLUDE:
            </th>
            <th style={{ width: "40px" }}></th>
            <th style={{ textAlign: "left", fontWeight: "bold", fontSize: "16px", paddingBottom: "10px" }}>
              NEUROLOGICAL SYMPTOMS INCLUDE:
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <tr key={idx}>
              <td style={{ padding: "5px" }}>
                {allergicSymptoms[idx] && (
                  <>
                    {allergicSymptoms[idx]}:
                    <div style={{ display: "flex", flexDirection: "row", marginTop: "5px" }}>
                      {options.map((option, i) => (
                        <label key={i} style={{ marginRight: "20px" }}>
                          <input
                            type="radio"
                            name={`allergic-symptom-${idx}`}
                            value={option}
                            style={{ marginRight: "5px" }}
                            defaultChecked={option === "No"} // Set "No" as the default
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </td>
              <td></td>
              <td style={{ padding: "5px" }}>
                {neurologicalSymptoms[idx] && (
                  <>
                    {neurologicalSymptoms[idx]}:
                    <div style={{ display: "flex", flexDirection: "row", marginTop: "5px" }}>
                      {options.map((option, i) => (
                        <label key={i} style={{ marginRight: "20px" }}>
                          <input
                            type="radio"
                            name={`neurological-symptom-${idx}`}
                            value={option}
                            style={{ marginRight: "5px" }}
                            defaultChecked={option === "No"} // Set "No" as the default
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewOfSystems;
