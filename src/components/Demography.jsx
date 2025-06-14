import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

// Responsive CSS injected directly
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

// Styles object
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 1200,
    margin: "10px auto",
    padding: "0.5rem",
    // backgroundColor: "#fff",
    backgroundColor: "1px solid rgb(0, 0, 0)",

    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
  },
  section: {
    padding: "0.75rem",
    border: "1px solid rgb(0, 0, 0)",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    marginTop: "1rem"
  },
  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.5rem"
  },
  label: {
    backgroundColor: "1px solid rgb(0, 0, 0)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "14px",
    color: "#333",
    gap: "0.3rem",
    marginBottom: "-0.2rem"
  },
  fileNameinput: {
    margin: "auto",
    flex: 1,
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "15px"
  },
  input: {
    width: "140px",
    flex: 1,
    padding: "6px 6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    margin: "6px"
  },
  select: {
    width: "150px",
    flex: 1,
    marginTop: "10px",
    margin: "5px",
    padding: "0.4rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
    marginTop: "0.5rem"
  },
  button: {
    padding: "0.6rem 0.8rem",
    margin: "0.5rem",
    borderRadius: "4px",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "#fff",
    transition: "background-color 0.2s ease"
  },
  optionButton: (isSelected) => ({
    marginRight: 4,
    marginTop: 4,
    padding: "8px 8px",
    borderRadius: "6px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "gray",
    backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    color: isSelected ? "green" : "gray",
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-block",
    fontSize: "15px"
  })
};

// Option lists
const insuranceOptions = [
  "Aetna", "BCBS", "Ambetter", "Cigna", "Commercial", "Humana", "PP",
  "Medicare", "Medicare B", "Medicaid", "TriCare", "Trieast", "WellCare",
  "Work. Comp", "UHC", "Other"
];

const locationOptions = ["Louisville", "E-town"];

const providerOptions = [
  { "Cortney Lacefield": "Cortney Lacefield, APRN" },
  { "Lauren Ellis": "Lauren Ellis, APRN" },
  { "Taja Elder": "Taja Elder, APRN" },
  { "Dr. Klickovich": "Robert Klickovich, M.D" },
];

const cmaOptions = [
  "Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie", "MS", "Nick",
  "PP", "SC", "Steph", "Tony", "Tina", "DJ", "Other"
];

// Yup validation schema
const validationSchema = Yup.object().shape({
  provider: Yup.string().required("Provider is required"),
  patientName: Yup.string().required("Patient Name is required"),
  dob: Yup.date()
    .typeError("Date of Birth must be a valid date")
    .required("Date of Birth is required"),
  dateOfEvaluation: Yup.date()
    .typeError("Date of Evaluation must be a valid date")
    .required("Date of Evaluation is required"),
});

const Demography = ({
  fileName,
  formData,
  onFileNameChange,
  onChange,
  onReset,
  onSubmit,
  setFormData
}) => {
  const [localPatientName, setLocalPatientName] = useState(formData.patientName || "");

  const handlePatientNameChange = (e, setFieldValue) => {
    const rawValue = e.target.value;
    const formattedValue = rawValue
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    setLocalPatientName(formattedValue);
    setFieldValue("patientName", formattedValue);
    onChange({ target: { name: "patientName", value: formattedValue } });
  };

  const transformPatientName = (setFieldValue) => {
    const parts = localPatientName.split(",");
    if (parts.length === 2) {
      const transformed = `${parts[1].trim()} ${parts[0].trim()}`;
      setLocalPatientName(transformed);
      setFieldValue("patientName", transformed);
      onChange({ target: { name: "patientName", value: transformed } });
    }
  };

  const handleToggle = (key, value, setFieldValue) => {
    const newValue = formData[key] === value ? "" : value;
    setFormData((prev) => ({ ...prev, [key]: newValue }));
    setFieldValue(key, newValue);
  };

  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, errors, touched, setFieldValue, handleSubmit }) => (
        <form onSubmit={handleSubmit} style={styles.container}>
          <style>{responsiveStyles}</style>

          <div className="responsive-label" style={styles.label}>
            <span>File Name:</span>
            <input
              type="text"
              className="responsive-input"
              style={styles.fileNameinput}
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              placeholder="Follow Up File Name"
            />
            <button type="submit" style={styles.button}>Generate Document</button>
          </div>

          <div style={styles.section}>
            <div className="responsive-grid" style={styles.grid}>
              {[{ label: "Patient Name", name: "patientName", type: "input" },
                { label: "Date of Evaluation", name: "dateOfEvaluation", type: "input" },
                { label: "Date of Birth", name: "dob", type: "input" },
                { label: "Referring Physician", name: "referringPhysician", type: "input" },
                { label: "Provider", name: "provider", type: "toggle", options: providerOptions },
                { label: "Location", name: "location", type: "toggle", options: locationOptions },
                { label: "Insurance 1", name: "insurance1", type: "insurance" },
                { label: "CMA", name: "CMA", type: "cma" },
                { label: "Insurance 2", name: "insurance2", type: "insurance" },
                { label: "Room #", name: "roomNumber", type: "input" }].map(({ label, name, type, options }) => {
                const error = touched[name] && errors[name];

                if (type === "input") {
                  if (name === "patientName") {
                    return (
                      <div key={name} className="responsive-label" style={styles.label}>
                        <span>{label}:</span>
                        <input
                          name={name}
                          className="responsive-input"
                          style={styles.input}
                          value={localPatientName}
                          onChange={(e) => handlePatientNameChange(e, setFieldValue)}
                        />
                        <button
                          type="button"
                          onClick={() => transformPatientName(setFieldValue)}
                          style={{ ...styles.button, marginLeft: "0.3rem", padding: "0.2rem 0.5rem" }}
                        >
                          Transform
                        </button>
                        {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                      </div>
                    );
                  }
                  return (
                    <div key={name} className="responsive-label" style={styles.label}>
                      <span>{label}:</span>
                      <input
                        name={name}
                        className="responsive-input"
                        style={styles.input}
                        value={values[name] || ""}
                        onChange={(e) => {
                          onChange(e);
                          setFieldValue(name, e.target.value);
                        }}
                      />
                      {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                    </div>
                  );
                }

                if (type === "toggle") {
                  return (
                    <div key={name} className="responsive-label" style={styles.label}>
                      <span>{label}:</span>
                      <div>
                        {options.map((opt) => {
                          const value = typeof opt === "object" ? Object.values(opt)[0] : opt;
                          const key = typeof opt === "object" ? Object.keys(opt)[0] : opt;
                          const isSelected = values[name] === value;
                          return (
                            <span
                              key={key}
                              style={styles.optionButton(isSelected)}
                              onClick={() => handleToggle(name, value, setFieldValue)}
                              role="button"
                              tabIndex={0}
                            >
                              {key}
                            </span>
                          );
                        })}
                      </div>
                      {error && <div className="error" style={{ color: "red" }}>{error}</div>}
                    </div>
                  );
                }

                if (type === "insurance") {
                  const inputName = `${name}Input`;
                  return (
                    <div key={name} className="responsive-label" style={styles.label}>
                      <span>{label}:</span>
                      <select
                        name={name}
                        className="responsive-select"
                        style={styles.select}
                        value={values[name] || ""}
                        onChange={(e) => {
                          onChange(e);
                          setFieldValue(name, e.target.value);
                          setFieldValue(inputName, "");
                        }}
                      >
                        <option value="">-- Select {label} --</option>
                        {insuranceOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <input
                        name={inputName}
                        placeholder={`Or type ${label}`}
                        className="responsive-input"
                        style={styles.input}
                        value={values[inputName] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(e);
                          setFieldValue(inputName, val);
                          setFieldValue(name, val.trim() ? "Other" : "");
                        }}
                      />
                    </div>
                  );
                }

                if (type === "cma") {
                  return (
                    <div key={name} className="responsive-label" style={styles.label}>
                      <span>CMA:</span>
                      <select
                        name="CMA"
                        className="responsive-select"
                        style={styles.select}
                        value={values.CMA || ""}
                        onChange={(e) => {
                          onChange(e);
                          setFieldValue("CMA", e.target.value);
                          setFieldValue("CMAInput", "");
                        }}
                      >
                        <option value="">-- Select CMA --</option>
                        {cmaOptions.map((cma) => (
                          <option key={cma} value={cma}>{cma}</option>
                        ))}
                      </select>
                      <input
                        name="CMAInput"
                        placeholder="Or type CMA"
                        className="responsive-input"
                        style={styles.input}
                        value={values.CMAInput || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(e);
                          setFieldValue("CMAInput", val);
                          setFieldValue("CMA", val.trim() ? "Other" : "");
                        }}
                      />
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default Demography;
