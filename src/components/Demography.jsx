import React, { useState } from "react";

const responsiveStyles = `
@media (max-width: 768px) {
  .responsive-grid {
    grid-template-columns: 1fr !important;
  }
  .responsive-label {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  .responsive-input,
  .responsive-select {
    width: 100% !important;
  }
  .button-row {
    flex-direction: column !important;
    align-items: stretch !important;
  }
}
`;

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 950,
    margin: "30px auto",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
  },
  section: {
    padding: "1.5rem",
    border: "1px solid rgb(217, 157, 157)",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginTop: "1.5rem"
  },
  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem"
  },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "15px",
    color: "#333",
    gap: "0.5rem"
  },
  fileNameinput: {
    margin: "auto",
    flex: 1,
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px"
  },
  input: {
    width:"160px",

    flex: 1,
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    margin:"auto"
  },
  select: {
    width:"80px",
    flex: 1,
    marginTop: "1rem",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    backgroundColor: "#fff"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1rem"
  },
  button: {
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    transition: "background-color 0.2s ease"
  },
  optionButton: (isSelected) => ({
    marginRight: 6,
    marginTop: 6,
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "gray",
    backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    color: isSelected ? "green" : "gray",
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-block"
  })
};

const insuranceOptions = [
  "Aetna",
  "BCBS",
  "Ambetter",
  "Cigna",
  "Commercial",
  "Humana",
  "PP",
  "Medicare",
  "Medicare B",
  "Medicaid",
  "TriCare",
  "Trieast",
  "WellCare",
  "Work. Comp",
  "UHC",
  "Other"
];

const locationOptions = ["Louisville", "E-town"];
const providerOptions = [
  "Cortney Lacefield, APRN",
  "Robert Klickovich, M.D",
  "Lauren Ellis, APRN",
  "Taja Elder, APRN",
];

const cmaOptions = [
  "Alyson",
  "Brenda",
  "Erika",
  "Janelle",
  "Laurie",
  "Melanie",
  "MS",
  "Nick",
  "PP",
  "SC",
  "Steph",
  "Tony",
  "Tina",
  "DJ",
  "Other"
];

const Demography = ({
  fileName,
  formData,
  onFileNameChange,
  onChange,
  onReset,
  onSubmit,
  setFormData
}) => {
  const [localPatientName, setLocalPatientName] = useState(
    formData.patientName || ""
  );

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    setFormData((prev) => ({ ...prev, [`${name}Input`]: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const selectName = name.replace("Input", "");
    onChange(e);
    const isCMA = name === "CMAInput";
    setFormData((prev) => ({
      ...prev,
      [selectName]: value.trim() ? "Other" : "",
      [name]: value,
      ...(isCMA && { CMA: value.trim() ? "Other" : "" })
    }));
  };

  const handleToggle = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value
    }));
  };

  const handlePatientNameChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = rawValue
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setLocalPatientName(formattedValue);
    onChange({ target: { name: "patientName", value: formattedValue } });
  };

  const transformPatientName = () => {
    const parts = localPatientName.split(",");
    if (parts.length === 2) {
      const transformed = `${parts[1].trim()} ${parts[0].trim()}`;
      setLocalPatientName(transformed);
      onChange({ target: { name: "patientName", value: transformed } });
    }
  };

  const renderInsuranceSelect = (label, name) => {
    const inputName = `${name}Input`;
    return (
      <div className="responsive-label" style={styles.label} key={name}>
        <span>{label}:</span>
        <select
          name={name}
          className="responsive-select"
          style={styles.select}
          value={formData[name] || ""}
          onChange={handleSelectChange}
        >
          <option value="">-- Select {label} --</option>
          {insuranceOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          name={inputName}
          placeholder={`Or type ${label}`}
          className="responsive-input"
          style={styles.input}
          value={formData[inputName] || ""}
          onChange={handleInputChange}
        />
      </div>
    );
  };

  const renderCMASelect = () => (
    <div className="responsive-label" style={styles.label} key="CMA">
      <span>CMA :</span>
      <select
        name="CMA"
        className="responsive-select"
        style={styles.select}
        value={formData.CMA || ""}
        onChange={handleSelectChange}
      >
        <option value="">-- Select CMA --</option>
        {cmaOptions.map((cma) => (
          <option key={cma} value={cma}>
            {cma}
          </option>
        ))}
      </select>
      <input
        name="CMAInput"
        placeholder="Or type CMA"
        className="responsive-input"
        style={styles.input}
        value={formData.CMAInput || ""}
        onChange={handleInputChange}
      />
    </div>
  );

  const renderToggleButtons = (label, name, options) => (
    <div className="responsive-label" style={styles.label} key={name}>
      <span>{label}:</span>
      <div>
        {options.map((option) => {
          const isSelected = formData[name] === option;
          return (
            <span
              key={option}
              style={styles.optionButton(isSelected)}
              onClick={() => handleToggle(name, option)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleToggle(name, option);
                }
              }}
            >
              {option}
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} style={styles.container}>
      <style>{responsiveStyles}</style>

      <div className="responsive-label" style={styles.label}>
        <span>File Name:</span>
        <br />
        <input
          type="text"
          className="responsive-input"
          style={styles.fileNameinput}
          value={fileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="Follow Up File Name"
        />
        <button type="button" onClick={onSubmit} style={styles.button}>
          Generate Document
        </button>
      </div>
      <div className="responsive-grid" style={styles.grid}>
        <div className="button-row" style={styles.buttonRow}>
          {/* <button
            type="button"
            onClick={onReset}
            style={{ ...styles.button, backgroundColor: "#95a5a6" }}
          >
            Reset
          </button> */}
        </div>
      </div>

      <div style={styles.section}>
        <div className="responsive-grid" style={styles.grid}>
          {[
            { label: "Patient Name", name: "patientName", type: "input" },
            {
              label: "Date of Evaluation",
              name: "dateOfEvaluation",
              type: "input"
            },
            { label: "Date of Birth", name: "dob", type: "input" },
            {
              label: "Referring Physician",
              name: "referringPhysician",
              type: "input"
            },
            {
              label: "Provider",
              name: "provider",
              type: "toggle",
              options: providerOptions
            },
            {
              label: "Location",
              name: "location",
              type: "toggle",
              options: locationOptions
            },
            { label: "Insurance 1", name: "insurance1", type: "insurance" },
            { label: "CMA", name: "CMA", type: "cma" },
            { label: "Insurance 2", name: "insurance2", type: "insurance" },
            { label: "Room #", name: "roomNumber", type: "input" }
          ].map(({ label, name, type, options }) => {
            if (type === "input") {
              if (name === "patientName") {
                return (
                  <div
                    key={name}
                    className="responsive-label"
                    style={styles.label}
                  >
                    <span>{label}:</span>
                    <input
                      name={name}
                      className="responsive-input"
                      style={styles.input}
                      value={localPatientName}
                      onChange={handlePatientNameChange}
                    />
                    <button
                      type="button"
                      onClick={transformPatientName}
                      style={{
                        ...styles.button,
                        marginLeft: "0.5rem",
                        padding: "0.3rem 0.6rem"
                      }}
                    >
                      Transform
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={name}
                  className="responsive-label"
                  style={styles.label}
                >
                  <span>{label}:</span>
                  <input
                    name={name}
                    className="responsive-input"
                    style={styles.input}
                    value={formData[name] || ""}
                    onChange={onChange}
                  />
                </div>
              );
            }
            if (type === "insurance") return renderInsuranceSelect(label, name);
            if (type === "toggle")
              return renderToggleButtons(label, name, options);
            if (type === "cma") return renderCMASelect();
            return null;
          })}
        </div>
      </div>
    </form>
  );
};

export default Demography;
