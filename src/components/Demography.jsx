import React from "react";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 900,
    margin: "auto",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  section: {
    padding: "1.5rem",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginTop: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "15px",
    color: "#333",
    marginBottom: "-1.0rem",
  },
  input: {
    width: "90%",
    marginTop: "0.3rem",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  select: {
    width: "95%",
    marginTop: "0.3rem",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    backgroundColor: "#fff",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1rem",
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
    transition: "background-color 0.2s ease",
  },
};

const insuranceOptions = [
  "Aetna", "BCBS", "Ambetter", "Commercial", "Humana", "PP",
  "Medicare", "Medicaid", "TriCare", "Trieast", "WellCare",
  "Work. Comp", "UHC", "Other"
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
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
    setFormData((prev) => ({
      ...prev,
      [`${name}Input`]: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const selectName = name.replace("Input", "");
    onChange(e);
    setFormData((prev) => ({
      ...prev,
      [selectName]: "",
    }));
  };

  const renderInsuranceSelect = (label, name) => {
    const inputName = `${name}Input`;

    return (
      <div style={styles.label}>
        {label}:
        <select
          name={name}
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
          style={{ ...styles.input, marginTop: "0.5rem" }}
          value={formData[inputName] || ""}
          onChange={handleInputChange}
        />
      </div>
    );
  };

  const renderCMASelect = () => (
    <div style={styles.label}>
      CMA (select or type below):
      <select
        name="CMA"
        style={styles.select}
        value={formData.CMA || ""}
        onChange={handleSelectChange}
      >
        <option value="">-- Select CMA --</option>
        {[
          "Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie",
          "MS", "Nick", "PP", "SC", "Steph", "Tony", "Tina", "DJ",
        ].map((cma) => (
          <option key={cma} value={cma}>
            {cma}
          </option>
        ))}
      </select>
      <input
        name="CMAInput"
        placeholder="Or type CMA"
        style={{ ...styles.input, marginTop: "0.5rem" }}
        value={formData.CMAInput || ""}
        onChange={handleInputChange}
      />
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} style={styles.container}>
      {/* Header Row */}
      <div style={styles.grid}>
        <div style={styles.label}>
          File Name:
          <input
            type="text"
            style={styles.input}
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="Follow Up File Name"
          />
        </div>
        <div style={{ ...styles.buttonRow, alignItems: "flex-end" }}>
          <button type="button" onClick={onSubmit} style={styles.button}>
            Generate Document
          </button>
          <button
            type="button"
            onClick={onReset}
            style={{ ...styles.button, backgroundColor: "#95a5a6" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Demographic Section */}
      <div style={styles.section}>
        <div style={styles.grid}>
          {[{ label: "PATIENT NAME", name: "patientName" },
            { label: "DATE OF BIRTH", name: "dob" },
            { label: "DATE OF EVALUATION", name: "dateOfEvaluation" },
            { label: "DATE OF DICTATION", name: "dateOfDictation" },
          ].map(({ label, name }) => (
            <div key={name} style={styles.label}>
              {label}:
              <input
                name={name}
                style={styles.input}
                value={formData[name] || ""}
                onChange={onChange}
              />
            </div>
          ))}

          <div style={styles.label}>
            PHYSICIAN:
            <input
              name="physician"
              style={styles.input}
              value={formData.physician}
              onChange={onChange}
              placeholder="Robert Klickovich, M.D"
              disabled
            />
          </div>

          <div style={styles.label}>
            Referring Physician:
            <input
              name="referringPhysician"
              style={styles.input}
              value={formData.referringPhysician || ""}
              onChange={onChange}
            />
          </div>

          {renderInsuranceSelect("Insurance 1", "insurance1")}
          {renderInsuranceSelect("Insurance 2", "insurance2")}
          <div style={styles.label}>
            Location:
            <select
              name="location"
              style={styles.select}
              value={formData.location || ""}
              onChange={onChange}
            >
              <option value="">-- Select Location --</option>
              <option value="Louisville">Louisville</option>
              <option value="E-town">E-town</option>
            </select>
          </div>

          {renderCMASelect()}

          <div style={styles.label}>
            Room #:
            <input
              name="roomNumber"
              style={styles.input}
              value={formData.roomNumber || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Demography;
