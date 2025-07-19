import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";
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

  .responsive-wrap {
    flex-direction: row !important;
    flex-wrap: wrap !important;
    gap: 0.3rem !important;
    max-width: 100%;
  }
}
`;

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 1200,
    margin: "10px auto",
    padding: "0.5rem",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  section: {
    padding: "0.75rem",
    border: "1px solid #000",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    marginTop: "1rem",
  },
  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.5rem",
  },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    fontSize: "16px",
    color: "#333",
    gap: "0.3rem",
    marginBottom: "-0.2rem",
  },
  fileNameinput: {
    margin: "auto",
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  input: {
    display: "flex",
    maxWidth: "40%",
    flexDirection: "row",
    minWidth: "180px",
    flex: 1,
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "15px",
    margin: "6px",
  },
  dateInputContainer: {
    display: "flex",
    maxWidth: "10%",
    alignItems: "center",
    gap: "0.25rem",
  },
  dateInput: {
    padding: "6px",
    // marginTop:"0px",
    margin: "0px 0px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "160px",
  },
  buttonSmall: {
    padding: "4px 8px",
    // marginTop:"0px",
    margin: "0px 0px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#3498db",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },
  select: {
    width: "150px",
    flex: 1,
    margin: "5px",
    padding: "0.4rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff",
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
  },
  optionButton: (isSelected) => ({
    margin: 1,
    padding: "6px 6px",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "#999",
    backgroundColor: isSelected ? "#e0f7e9" : "#f0f0f0",
    color: isSelected ? "green" : "#333",
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
    display: "inline-block"
  }),
  optionButton2: (isSelected) => ({
    margin: 0,
    marginTop: "4px",
    padding: "4px 4px",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "#999",
    backgroundColor: isSelected ? "#e0f7e9" : "#f0f0f0",
    color: isSelected ? "green" : "#333",
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
    display: "inline-block"
  }),
  selectedTag: {
    backgroundColor: "#e0f7fa",
    border: "1px solid #00acc1",
    borderRadius: "20px",
    padding: "0.25rem 0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  removeTagButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#007c91",
    fontSize: "1rem",
    lineHeight: "1",
  }
};


const providerOptions = [
  { "Cortney Lacefield": "Cortney Lacefield, APRN" },
  { "Klickovich": "Robert Klickovich, M.D" },
  { "Lauren Ellis": "Lauren Ellis, APRN" },
  { "Taja Elder": "Taja Elder, APRN" },
  { "_______": "_________________" },
];
const locationOptions = ["Louisville", "E-town"];
const insuranceOptions = [
  "Aetna", "BCBS", "Ambetter", "Cigna", "Commercial", "Humana",
  "Medicare", "Medicare B", "MCR", "TriCare", "Trieast",
  "WellCare", "PP", "UHC", "Work. Comp", "Self pay", "Medicaid",
];
const cmaOptions = [
  "Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie",
  "MS", "Nick", "PP", "SC", "Steph", "Tony", "Tina",
  "DJ", "Tammy"
];

// Date helpers
const formatDateToISO = (d) => d.toISOString().slice(0, 10);
const formatDateToMMDDYYYY = (d) => {
  const mm = String(d.getMonth() + 1).padStart(2, "0"),
    dd = String(d.getDate()).padStart(2, "0"),
    yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};
const parseMMDDYYYYtoDate = (s) => {
  const [mm, dd, yyyy] = s.split("/");
  return new Date(`${yyyy}-${mm}-${dd}`);
};
const getWeekday = (s) => {
  const d = parseMMDDYYYYtoDate(s);
  return isNaN(d) ? "" : d.toLocaleDateString("en-US", { weekday: "long" });
};
const isValidDate = (v) => {
  const [mm, dd, yyyy] = v.split("/");
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  return d && d.getMonth() + 1 === +mm && d.getDate() === +dd && d.getFullYear() === +yyyy;
};

// Dynamic schema function that accepts providerOptions
const getValidationSchema = (providerOptions = []) => {
  const providerValues = providerOptions.map(opt => Object.values(opt)[0]);

  return Yup.object({
    provider: Yup.string()
      .required("Provider is required")
      .oneOf(providerValues, "Invalid provider selection"),

    patientName: Yup.string()
      .required("Patient Name is required")
      .min(3, "Patient Name must be at least 3 characters"),

    referringPhysician: Yup.string()
      .required("Referring Physician is required")
      .min(3, "Must be at least 3 characters"),

    dob: Yup.string()
      .required("Date of Birth is required")
      .matches(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/,
        "DOB must be in MM/DD/YYYY format"
      )
      .test("valid-date", "Invalid date", isValidDate),

    dateOfEvaluation: Yup.string()
      .required("Date of Evaluation is required")
      .matches(
        /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/,
        "Date must be in MM/DD/YYYY format"
      )
      .test("valid", "Invalid date", isValidDate),

    location: Yup.string().test(
      "et-check",
      "Location must be E-town if (ET) is in the file name",
      function (v) {
        const fn = this.options.context?.fileName || "";
        return /\(ET\)/i.test(fn) ? v === "E-town" : true;
      }
    ),
  });
};



const Demography = ({
  fileName, formData, onFileNameChange, onChange,
  onSubmit: onSubmitExternal, setFormData, setDateOfEvaluation
}) => {
  const [dateISO, setDateISO] = useState(() => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfEvaluation || "")) {
      return formatDateToISO(parseMMDDYYYYtoDate(formData.dateOfEvaluation));
    }
    const y = new Date(); y.setDate(y.getDate() - 1);
    return formatDateToISO(y);
  });

  const [localPatientName, setLocalPatientName] = useState(formData.patientName || "");
  const [referringInput, setReferringInput] = useState(formData.referringPhysician || "");
  const [filteredPhysicians, setFilteredPhysicians] = useState([]);
  const [allPhysicians, setAllPhysicians] = useState([]);
  const insuranceInputRef = useRef(null);
  const cmaInputRef = useRef(null);


  // Initialize default date and fetch physicians
  useEffect(() => {
    if (!formData.dateOfEvaluation) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const mmdd = formatDateToMMDDYYYY(yesterday);
      const iso = formatDateToISO(yesterday);
      setDateISO(iso);
      setFormData(prev => ({ ...prev, dateOfEvaluation: mmdd }));
      setDateOfEvaluation?.(mmdd);
    }
    axios.get(`${BACKEND_URL}/physicians`)
      .then(res => setAllPhysicians(res.data))
      .catch(console.error);
  }, []);

  // Sync ISO <--> MMDD format
  useEffect(() => {
    if (dateISO) {
      const [yy, mm, dd] = dateISO.split("-");
      const mmdd = `${mm}/${dd}/${yy}`;
      setFormData(prev => ({ ...prev, dateOfEvaluation: mmdd }));
      setDateOfEvaluation?.(mmdd);
    }
  }, [dateISO]);

  // Auto-set location
  useEffect(() => {
    if (/\(ET\)/i.test(fileName)) {
      setFormData(prev => ({ ...prev, location: "E-town" }));
    }
  }, [fileName]);

  const handleFieldChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    if (name === "patientName") {
      const formatted = value.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
      setLocalPatientName(formatted);
      setFieldValue(name, formatted);
      onChange({ target: { name, value: formatted } });
    } else {
      setFieldValue(name, value);
      onChange(e);
    }
  };

  const handleReferringChange = (e, setFieldValue) => {
    const v = e.target.value;
    setReferringInput(v);
    setFieldValue("referringPhysician", v);
    onChange({ target: { name: "referringPhysician", value: v } });
    setFilteredPhysicians(
      v.trim()
        ? allPhysicians.filter(doc => doc.toLowerCase().includes(v.toLowerCase()))
        : []
    );
  };

  const toggleOption = (key, val, setFieldValue) => {
    const nv = formData[key] === val ? "" : val;
    setFormData(prev => ({ ...prev, [key]: nv }));
    setFieldValue(key, nv);
  };

  const changeDate = (days, setFieldValue) => {
    if (!dateISO) return;
    const d = new Date(dateISO);
    d.setDate(d.getDate() + days);
    const iso = formatDateToISO(d);
    const mmdd = formatDateToMMDDYYYY(d);
    setDateISO(iso);
    setFieldValue("dateOfEvaluation", mmdd);
    setFormData(prev => ({ ...prev, dateOfEvaluation: mmdd }));
    setDateOfEvaluation?.(mmdd);
  };

  const onSubmit = async (values, actions) => {
    // Append input field value to array fields if not already added
    const insuranceVal = insuranceInputRef.current?.value.trim();
    const cmaVal = cmaInputRef.current?.value.trim();

    if (insuranceVal && !values.insuranceList.includes(insuranceVal)) {
      values.insuranceList.push(insuranceVal);
      setFormData(prev => ({
        ...prev,
        insuranceList: [...(prev.insuranceList || []), insuranceVal],
      }));
    }

    if (cmaVal && !values.CMA.includes(cmaVal)) {
      values.CMA.push(cmaVal);
      setFormData(prev => ({
        ...prev,
        CMA: [...(prev.CMA || []), cmaVal],
      }));
    }

    if (!values.dateOfEvaluation && dateISO) {
      const [yy, mm, dd] = dateISO.split("-");
      const mmdd = `${mm}/${dd}/${yy}`;
      values.dateOfEvaluation = mmdd;
      setFormData(prev => ({ ...prev, dateOfEvaluation: mmdd }));
      setDateOfEvaluation?.(mmdd);
    }

    const ref = values.referringPhysician.trim();
    const cap = ref.charAt(0).toUpperCase() + ref.slice(1);
    if (cap && !allPhysicians.some(p => p.toLowerCase() === cap.toLowerCase())) {
      try {
        await axios.post(`${BACKEND_URL}/physicians`, { name: cap });
        setAllPhysicians(prev => [...prev, cap]);
      } catch (e) {
        console.error("Failed to save referring physician", e);
      }
    }

    await onSubmitExternal({ ...values, referringPhysician: cap }, actions);
  };


  const toggleArrayOption = (field, value, setFieldValue) => {
    const current = formData[field] || [];
    const isSelected = current.includes(value);
    const updated = isSelected
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFormData((prev) => ({ ...prev, [field]: updated }));
    setFieldValue(field, updated);
  };


  const fields = [
    { label: "Patient Name", name: "patientName", type: "input" },
    { label: "Date of Evaluation", name: "dateOfEvaluation", type: "inputWithDate" },
    { label: "Date of Birth", name: "dob", type: "input" },
    { label: "Referring Physician", name: "referringPhysician", type: "referring" },
    { label: "Provider", name: "provider", type: "toggle", options: providerOptions },
    { label: "Location", name: "location", type: "toggle", options: locationOptions },
    { label: "Insurance", name: "insuranceList", type: "insurance" },
    { label: "CMA", name: "CMA", type: "cma" },
    { label: "Room #", name: "roomNumber", type: "input" },
  ];

  return (
    <Formik
      initialValues={formData}
      // validationSchema={validationSchema}
       validationSchema={getValidationSchema(providerOptions)}
      enableReinitialize
      context={{ fileName }}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, setFieldValue, handleSubmit }) => (
        <form onSubmit={handleSubmit} style={styles.container}>
          <style>{responsiveStyles}</style>
          <div style={styles.label} className="responsive-label">
            <span>File Name:</span>
            <input
              type="text"
              style={styles.fileNameinput}
              className="responsive-input"
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              placeholder="Follow Up File Name"
            />
            <button type="submit" style={styles.button}>
              Generate Document
            </button>
          </div>
          <div style={styles.section}>
            <div style={styles.grid} className="responsive-grid">
              {fields.map((f) => {
                const err = touched[f.name] && errors[f.name];
                switch (f.type) {
                  case "input":
                    return (
                      <div key={f.name} style={styles.label} className="responsive-label">
                        <span>{f.label}:</span>
                        <input
                          name={f.name}
                          style={styles.input}
                          className="responsive-input"
                          value={
                            f.name === "patientName"
                              ? localPatientName
                              : values[f.name] || ""
                          }
                          onChange={(e) => handleFieldChange(e, setFieldValue)}
                        />
                        {f.name === "patientName" && (
                          <button
                            type="button"
                            onClick={() => {
                              const parts = localPatientName.split(",");
                              if (parts.length === 2) {
                                const transformed = parts[1].trim() + " " + parts[0].trim();
                                setLocalPatientName(transformed);
                                setFieldValue("patientName", transformed);
                                onChange({ target: { name: "patientName", value: transformed } });
                              }
                            }}
                            style={{ ...styles.button, marginLeft: 4, padding: "0.2rem 0.5rem" }}
                          >
                            Transform
                          </button>
                        )}
                        {err && <div style={{ color: "red" }}>{err}</div>}
                      </div>
                    );
                  case "inputWithDate":
                    return (
                      <div key={f.name} style={styles.label} className="responsive-label">
                        <span>{f.label}:
                          <div style={styles.dateInputContainer}>
                            <input
                              name={`${f.name}-text`}
                              className="responsive-input"
                              style={{ ...styles.input, width: "120px" }}
                              placeholder="MM/DD/YYYY"
                              value={values[f.name] || ""}
                              onChange={(e) => {
                                const val = e.target.value.trim();
                                setFieldValue(f.name, val);
                                if (val) setDateISO("");
                                setDateOfEvaluation?.(val);
                                onChange({ target: { name: f.name, value: val } });
                              }}
                              onBlur={() => {
                                if (!values[f.name]) {
                                  const [yy, mm, dd] = dateISO.split("-");
                                  const fallback = `${mm}/${dd}/${yy}`;
                                  setFieldValue(f.name, fallback);
                                  setDateOfEvaluation?.(fallback);
                                  onChange({ target: { name: f.name, value: fallback } });
                                }
                              }}
                            />
                            <button
                              type="button"
                              style={styles.buttonSmall}
                              onClick={() => changeDate(-1, setFieldValue)}
                            >
                              ◀
                            </button>
                            <input
                              type="date"
                              value={dateISO}
                              style={styles.dateInput}
                              onChange={(e) => {
                                const iso = e.target.value;
                                if (!iso) return;
                                const [yy, mm, dd] = iso.split("-");
                                const mmdd = `${mm}/${dd}/${yy}`;
                                setDateISO(iso);
                                setFieldValue(f.name, mmdd);
                                setDateOfEvaluation?.(mmdd);
                                onChange({ target: { name: f.name, value: mmdd } });
                              }}
                            />
                            <button
                              type="button"
                              style={styles.buttonSmall}
                              onClick={() => changeDate(1, setFieldValue)}
                            >
                              ▶
                            </button>
                            {values[f.name] && (
                              <span style={{ marginLeft: "8px", fontStyle: "italic", color: "#666" }}>
                                {getWeekday(values[f.name])}
                              </span>
                            )}
                            {err && <div style={{ color: "red" }}>{err}</div>}
                          </div>
                        </span>
                      </div>
                    );
                  case "referring":
                    return (
                      <div key={f.name} style={styles.label} className="responsive-label">
                        <span>{f.label}:</span>
                        <div style={{ position: "relative", width: "20%" }}>
                          <input
                            name={f.name}
                            value={referringInput}
                            className="responsive-input"
                            style={styles.input}
                            onChange={(e) => handleReferringChange(e, setFieldValue)}
                            autoComplete="off"
                          />
                          {filteredPhysicians.length > 0 && referringInput.trim() !== "" && (
                            <ul style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              margin: 0,
                              padding: 0,
                              listStyle: "none",
                              maxHeight: 150,
                              overflowY: "auto",
                              zIndex: 10,
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                            }}>
                              {filteredPhysicians.map((doc) => (
                                <li
                                  key={doc}
                                  style={{
                                    padding: 8,
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee",
                                  }}
                                  onClick={() => {
                                    setReferringInput(doc);
                                    setFilteredPhysicians([]);
                                    setFieldValue(f.name, doc);
                                    onChange({ target: { name: f.name, value: doc } });
                                  }}
                                >
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          )}

                        </div>
                        {err && <div style={{ color: "red" }}>{err}</div>}
                      </div>
                    );
                  case "toggle":
                    return (
                      <div key={f.name} style={styles.label} className="responsive-label">
                        <span>{f.label}:</span>
                        <div>
                          {f.options.map((opt) => {
                            const key = typeof opt === "object" ? Object.keys(opt)[0] : opt;
                            const value = typeof opt === "object" ? Object.values(opt)[0] : opt;
                            const isSelected = values[f.name] === value;
                            return (
                              <span
                                key={key}
                                style={styles.optionButton(isSelected)}
                                onClick={() => toggleOption(f.name, value, setFieldValue)}
                              >
                                {key}
                              </span>
                            );
                          })}
                        </div>
                        {err && <div style={{ color: "red" }}>{err}</div>}
                      </div>
                    );
                  case "insurance":
                  case "cma": {
                    const isInsurance = f.type === "insurance";
                    const list = isInsurance ? insuranceOptions : cmaOptions;
                    const selected = values[f.name] || [];

                    return (
                      <div key={f.name} style={styles.label} className="responsive-label">
                        <span>{f.label}:

                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.5rem" }}>
                            {list.map((option) => {
                              const isSelected = selected.includes(option);
                              return (
                                <span
                                  key={option}
                                  style={styles.optionButton2(isSelected)}
                                  onClick={() => {
                                    const newSelected = isSelected
                                      ? selected.filter((item) => item !== option)
                                      : [...selected, option];
                                    setFieldValue(f.name, newSelected);
                                    setFormData((prev) => ({ ...prev, [f.name]: newSelected }));
                                  }}
                                >
                                  {option}
                                </span>
                              );
                            })}
                            <input
                              name={f.name}
                              // value={""}
                              ref={isInsurance ? insuranceInputRef : cmaInputRef}
                              placeholder={`Enter ${f.label}`}
                              className="responsive-input"
                              style={styles.input}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.target.value.trim() !== "") {
                                  e.preventDefault();
                                  const val = e.target.value.trim();
                                  if (!selected.includes(val)) {
                                    const newSelected = [...selected, val];
                                    setFieldValue(f.name, newSelected);
                                    setFormData((prev) => ({ ...prev, [f.name]: newSelected }));
                                  }
                                  e.target.value = "";
                                }
                              }}
                            />
                          </div>
                        </span>

                        {/* Optionally show selected tags */}
                        {/* <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                          {selected.map((val) => (
                            <span key={val} style={styles.selectedTag}>
                              {val}
                              <button
                                style={styles.removeTagButton}
                                onClick={() => {
                                  const newSelected = selected.filter((item) => item !== val);
                                  setFieldValue(f.name, newSelected);
                                  setFormData((prev) => ({ ...prev, [f.name]: newSelected }));
                                }}
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div> */}
                      </div>
                    );
                  }

                }
              })}
            </div>
          </div>
        </form>
      )
      }
    </Formik >
  );
};

export default Demography;
