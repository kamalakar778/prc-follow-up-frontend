import React, { useState, useEffect } from "react";
import * as yup from "yup";

const styles = {
  input: {
    padding: "0.4rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minWidth: "250px",
    width: "50%",
    fontSize: "16px",
  },
  label: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "0.1rem",
    fontSize: "18px",
  },
  section: {
    padding: "1rem",
    marginTop: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  button: {
    padding: "0.5rem 1rem",
    marginLeft: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    cursor: "pointer",
    backgroundColor: "#3498db",
    color: "white",
  },
  flexRow: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: "1rem",
    marginBottom: "1rem",
  },
  error: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "0.25rem",
  },
};

// Yup validation schema
const schema = yup.object().shape({
  fileName: yup.string().required("File name is required."),
  patientName: yup.string().required("Patient name is required."),
  dob: yup
    .string()
    .required("Date of birth is required.")
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, "Invalid date format (MM/DD/YYYY)"),
  dateOfEvaluation: yup
    .string()
    .required("Evaluation date is required.")
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, "Invalid date format (MM/DD/YYYY)"),
  dateOfDictation: yup
    .string()
    .required("Dictation date is required.")
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/, "Invalid date format (MM/DD/YYYY)"),
  provider: yup.string().required("Provider selection is required."),
  location: yup.string().required("Location selection is required."),
});

const Demography = ({
  fileName,
  formData,
  onFileNameChange,
  onChange,
  onReset,
  onSubmit,
  setFormData,
}) => {
  const [errors, setErrors] = useState({});

  const validateField = async (fieldName, value) => {
    try {
      await schema.validateAt(fieldName, { ...formData, fileName });
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: undefined }));
    } catch (err) {
      setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: err.message }));
    }
  };

  // Individual field validation effects
  useEffect(() => {
    validateField("fileName", fileName);
  }, [fileName]);

  useEffect(() => {
    validateField("patientName", formData.patientName);
  }, [formData.patientName]);

  useEffect(() => {
    validateField("dob", formData.dob);
  }, [formData.dob]);

  useEffect(() => {
    validateField("dateOfEvaluation", formData.dateOfEvaluation);
  }, [formData.dateOfEvaluation]);

  useEffect(() => {
    validateField("dateOfDictation", formData.dateOfDictation);
  }, [formData.dateOfDictation]);

  useEffect(() => {
    validateField("provider", formData.provider);
  }, [formData.provider]);

  useEffect(() => {
    validateField("location", formData.location);
  }, [formData.location]);

  const handleValidatedSubmit = async () => {
    try {
      await schema.validate({ ...formData, fileName }, { abortEarly: false });
      setErrors({});
      onSubmit();
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    }
  };

  const renderSelect = (name, options, clearable = false) => (
    <label style={styles.label}>
      {name.charAt(0).toUpperCase() + name.slice(1)}:
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <select
          name={name}
          style={styles.input}
          value={formData[name]}
          onChange={onChange}
        >
          <option value="">-- Select {name} --</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {clearable && (
          <button
            type="button"
            style={styles.button}
            onClick={() => setFormData((prev) => ({ ...prev, [name]: "" }))}
          >
            Clear
          </button>
        )}
      </div>
      {errors[name] && <span style={styles.error}>{errors[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 800, margin: "auto" }}>
      {/* Header Row */}
      <div style={styles.flexRow}>
        <label style={styles.label}>
          File Name:&nbsp;
          <input
            type="text"
            style={styles.input}
            value={fileName}
            onChange={onFileNameChange}
            placeholder="Follow Up File Name"
          />
          {errors.fileName && <span style={styles.error}>{errors.fileName}</span>}
        </label>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <button type="button" onClick={handleValidatedSubmit} style={styles.button}>
            Generate Document
          </button>
          <button type="button" onClick={onReset} style={styles.button}>
            Reset
          </button>
        </div>
      </div>

      {/* Demography Fields */}
      <div style={styles.section}>
        {[{ label: "PATIENT NAME", name: "patientName" },
          { label: "DATE OF BIRTH", name: "dob" },
          { label: "DATE OF EVALUATION", name: "dateOfEvaluation" },
          { label: "DATE OF DICTATION", name: "dateOfDictation" },
        ].map(({ label, name }) => (
          <label key={name} style={styles.label}>
            {label}:
            <input
              name={name}
              style={styles.input}
              value={formData[name]}
              onChange={onChange}
            />
            {errors[name] && <span style={styles.error}>{errors[name]}</span>}
          </label>
        ))}

        <label style={styles.label}>
          PHYSICIAN:
          <input
            name="physician"
            style={styles.input}
            value={formData.physician}
            onChange={onChange}
            placeholder="Robert Klickovich, M.D"
            disabled
          />
        </label>

        {renderSelect("provider", [
          "Cortney Lacefield, APRN",
          "Lauren Ellis, APRN",
          "Taja Elder, APRN",
          "Robert Klickovich, M.D",
        ])}

        <label style={styles.label}>
          Referring Physician:
          <input
            name="referringPhysician"
            style={styles.input}
            value={formData.referringPhysician}
            onChange={onChange}
          />
        </label>

        {renderSelect("insurance", [
          "Aetna", "BCBS", "Ambetter", "Commercial", "Humana", "PP", "Medicare", "Medicaid",
          "TriCare", "Trieast", "WellCare", "Work. Comp", "UHC",
        ], true)}

        {renderSelect("location", ["Louisville", "E-town"], true)}

        {renderSelect("cma", [
          "Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie", "MS",
          "Nick", "PP", "SC", "Steph", "Tony", "Tina", "DJ",
        ], true)}

        <label style={styles.label}>
          Room #:
          <input
            name="roomNumber"
            style={styles.input}
            value={formData.roomNumber}
            onChange={onChange}
          />
        </label>
      </div>
    </form>
  );
};

export default Demography;
