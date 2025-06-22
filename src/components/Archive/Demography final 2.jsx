import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

const responsiveStyles = `
@media (max-width: 768px) {
  .responsive-grid { grid-template-columns: 1fr !important; }
  .responsive-label { flex-direction: column !important; align-items: flex-start !important; }
  .responsive-input, .responsive-select { width: 100% !important; }
  .button-row { flex-direction: column !important; align-items: stretch !important; }
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
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
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
    fontSize: "14px",
    color: "#333",
    gap: "0.3rem",
    marginBottom: "-0.2rem",
  },
  fileNameinput: {
    margin: "auto",
    flex: 1,
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  input: {
    width: "140px",
    flex: 1,
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    margin: "6px",
  },
  dateInputContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  dateInput: {
    padding: "6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "160px",
  },
  buttonSmall: {
    padding: "4px 8px",
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
    marginRight: 4,
    marginTop: 4,
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "gray",
    backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    color: isSelected ? "green" : "gray",
    fontWeight: isSelected ? "bold" : "normal",
    cursor: "pointer",
    display: "inline-block",
    fontSize: "15px",
  }),
};

// Option arrays
const providerOptions = [
  { "Cortney Lacefield": "Cortney Lacefield, APRN" },
  { "Klickovich": "Robert Klickovich, M.D" },
  { "Lauren Ellis": "Lauren Ellis, APRN" },
  { "Taja Elder": "Taja Elder, APRN" },
];
const locationOptions = ["Louisville", "E-town"];
const insuranceOptions = [
  "Aetna", "BCBS", "Ambetter", "Cigna", "Commercial", "Humana", "PP", "MCR", "Medicare", "Medicare B",
  "Medicaid", "TriCare", "Trieast", "WellCare", "Work. Comp", "UHC", "Other", "Self pay"
];
const cmaOptions = [
  "Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie", "MS", "Nick", "PP", "SC", "Steph",
  "Tony", "Tina", "DJ", "Tammy", "Other"
];

// Helper date functions
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

// Formik validation schema
const validationSchema = Yup.object({
  provider: Yup.string().required("Provider is required"),
  patientName: Yup.string().required("Patient Name is required"),
  dob: Yup.string().required("Date of Birth is required")
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/, "MM/DD/YYYY format")
    .test("valid", "Invalid date", isValidDate),
  location: Yup.string().test("et-check",
    "Location must be E-town if (ET) is in the file name",
    function (v) {
      const fn = this.options.context.fileName || "";
      return /\(ET\)/i.test(fn) ? v === "E-town" : true;
    }
  ),
});

const Demography = ({
  fileName,
  formData,
  onFileNameChange,
  onChange,
  onSubmit: onSubmitExternal,
  setFormData,
  setDateOfEvaluation
}) => {
  const [localPatientName, setLocalPatientName] = useState(formData.patientName || "");
  const [referringInput, setReferringInput] = useState(formData.referringPhysician || "");
  const [filteredPhysicians, setFilteredPhysicians] = useState([]);
  const [allPhysicians, setAllPhysicians] = useState([]);

  const getInitialISO = () => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfEvaluation || "")) {
      return formatDateToISO(parseMMDDYYYYtoDate(formData.dateOfEvaluation));
    }
    const y = new Date(); y.setDate(y.getDate() - 1);
    return formatDateToISO(y);
  };
  const [dateISO, setDateISO] = useState(getInitialISO());

  useEffect(() => {
    if (!formData.dateOfEvaluation) {
      const [yy, mm, dd] = dateISO.split("-");
      const m = `${mm}/${dd}/${yy}`;
      setFormData(p => ({ ...p, dateOfEvaluation: m }));
      setDateOfEvaluation?.(m);
    }
    axios.get(`${BACKEND_URL}/physicians`)
      .then(res => setAllPhysicians(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (/\(ET\)/i.test(fileName)) {
      setFormData(p => ({ ...p, location: "E-town" }));
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
    setFormData(p => ({ ...p, [key]: nv }));
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
    setFormData(p => ({ ...p, dateOfEvaluation: mmdd }));
    setDateOfEvaluation?.(mmdd);
  };

  const onSubmit = async (values, actions) => {
    if (!values.dateOfEvaluation && dateISO) {
      const [yy, mm, dd] = dateISO.split("-");
      const d = `${mm}/${dd}/${yy}`;
      values.dateOfEvaluation = d;
      setFormData(p => ({ ...p, dateOfEvaluation: d }));
      setDateOfEvaluation?.(d);
    }

    const ref = values.referringPhysician.trim();
    const cap = ref.charAt(0).toUpperCase() + ref.slice(1);
    if (cap && !allPhysicians.some(p => p.toLowerCase() === cap.toLowerCase())) {
      try {
        await axios.post(`${BACKEND_URL}/physicians`, { name: cap });
        setAllPhysicians(p => [...p, cap]);
      } catch (err) {
        console.error("Failed to save referring physician", err);
      }
    }

    await onSubmitExternal({ ...values, referringPhysician: cap }, actions);
  };

  const fields = [
    { label: "Patient Name", name: "patientName", type: "input" },
    { label: "Date of Evaluation", name: "dateOfEvaluation", type: "inputWithDate" },
    { label: "Date of Birth", name: "dob", type: "input" },
    { label: "Referring Physician", name: "referringPhysician", type: "referring" },
    { label: "Provider", name: "provider", type: "toggle", options: providerOptions },
    { label: "Location", name: "location", type: "toggle", options: locationOptions },
    { label: "Insurance", name: "insurance", type: "select", options: insuranceOptions },
    { label: "CMA", name: "cma", type: "select", options: cmaOptions },
  ];

  return (
    <div style={styles.container}>
      <style>{responsiveStyles}</style>
      <Formik
        initialValues={{ ...formData }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={true}
        context={{ fileName }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, errors, touched }) => (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={styles.grid} className="responsive-grid">
              {fields.map(f => {
                const val = values[f.name] || "";
                const err = touched[f.name] && errors[f.name];
                if (f.type === "inputWithDate") {
                  return (
                    <div key={f.name} style={{ marginBottom: 12 }}>
                      <label style={styles.label} htmlFor={f.name}>{f.label}</label>
                      <div style={styles.dateInputContainer}>
                        <input
                          id={f.name}
                          name={f.name}
                          type="text"
                          placeholder="MM/DD/YYYY"
                          style={styles.dateInput}
                          value={val}
                          onChange={(e) => {
                            setFieldValue(f.name, e.target.value);
                            setDateISO("");
                            onChange(e);
                          }}
                          onBlur={handleBlur}
                        />
                        <input
                          type="date"
                          value={dateISO}
                          style={styles.dateInput}
                          onChange={(e) => {
                            const v = e.target.value;
                            setDateISO(v);
                            const [yy, mm, dd] = v.split("-");
                            const mmdd = `${mm}/${dd}/${yy}`;
                            setFieldValue(f.name, mmdd);
                            onChange({ target: { name: f.name, value: mmdd } });
                          }}
                        />
                        <button
                          type="button"
                          style={styles.buttonSmall}
                          onClick={() => changeDate(-1, setFieldValue)}
                          aria-label="Previous day"
                        >
                          &lt;
                        </button>
                        <button
                          type="button"
                          style={styles.buttonSmall}
                          onClick={() => changeDate(1, setFieldValue)}
                          aria-label="Next day"
                        >
                          &gt;
                        </button>
                        <div style={{ marginLeft: 8, fontWeight: "bold", fontSize: "14px" }}>
                          {getWeekday(val)}
                        </div>
                      </div>
                      {err && <div style={{ color: "red", fontSize: "12px" }}>{err}</div>}
                    </div>
                  );
                }
                if (f.type === "toggle") {
                  let options = [];
                  if (Array.isArray(f.options)) {
                    if (typeof f.options[0] === "string") {
                      options = f.options.map((opt) => ({ [opt]: opt }));
                    } else {
                      options = f.options;
                    }
                  }
                  const currentVal = values[f.name] || "";
                  const isOther = currentVal && !options.some(opt => Object.values(opt)[0] === currentVal);
                  return (
                    <div key={f.name} style={{ marginBottom: 12 }}>
                      <label style={styles.label}>{f.label}</label>
                      <div>
                        {options.map((opt, idx) => {
                          const key = Object.keys(opt)[0];
                          const value = Object.values(opt)[0];
                          const isSelected = currentVal === value;
                          return (
                            <span
                              key={key + idx}
                              style={styles.optionButton(isSelected)}
                              onClick={() => toggleOption(f.name, value, setFieldValue)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleOption(f.name, value, setFieldValue);
                                }
                              }}
                              aria-pressed={isSelected}
                            >
                              {key}
                            </span>
                          );
                        })}
                        {isOther && (
                          <input
                            style={{
                              marginLeft: 6,
                              borderColor: "green",
                              borderWidth: 2,
                              padding: "4px",
                              borderRadius: "6px",
                            }}
                            type="text"
                            value={currentVal}
                            onChange={(e) => {
                              setFieldValue(f.name, e.target.value);
                              onChange({ target: { name: f.name, value: e.target.value } });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
                if (f.type === "select") {
                  return (
                    <div key={f.name} style={{ marginBottom: 12 }}>
                      <label htmlFor={f.name} style={styles.label}>{f.label}</label>
                      <select
                        id={f.name}
                        name={f.name}
                        value={val}
                        onChange={(e) => {
                          handleFieldChange(e, setFieldValue);
                        }}
                        onBlur={handleBlur}
                        style={styles.select}
                      >
                        <option value="">Select {f.label}</option>
                        {f.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {err && <div style={{ color: "red", fontSize: "12px" }}>{err}</div>}
                    </div>
                  );
                }
                if (f.type === "referring") {
                  return (
                    <div key={f.name} style={{ marginBottom: 12 }}>
                      <label htmlFor={f.name} style={styles.label}>{f.label}</label>
                      <input
                        id={f.name}
                        name={f.name}
                        type="text"
                        autoComplete="off"
                        value={referringInput}
                        onChange={(e) => handleReferringChange(e, setFieldValue)}
                        onBlur={handleBlur}
                        style={styles.input}
                        aria-autocomplete="list"
                        aria-haspopup="true"
                        aria-expanded={filteredPhysicians.length > 0}
                        aria-controls="referring-list"
                      />
                      {filteredPhysicians.length > 0 && (
                        <ul
                          id="referring-list"
                          role="listbox"
                          style={{
                            border: "1px solid #ccc",
                            maxHeight: "150px",
                            overflowY: "auto",
                            marginTop: 0,
                            paddingLeft: "1rem",
                            backgroundColor: "#fff",
                            position: "absolute",
                            zIndex: 10,
                            width: "150px",
                          }}
                        >
                          {filteredPhysicians.map((doc) => (
                            <li
                              key={doc}
                              role="option"
                              onClick={() => {
                                setReferringInput(doc);
                                setFieldValue("referringPhysician", doc);
                                setFilteredPhysicians([]);
                                onChange({ target: { name: "referringPhysician", value: doc } });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setReferringInput(doc);
                                  setFieldValue("referringPhysician", doc);
                                  setFilteredPhysicians([]);
                                  onChange({ target: { name: "referringPhysician", value: doc } });
                                }
                              }}
                              tabIndex={0}
                              style={{
                                cursor: "pointer",
                                padding: "2px 6px",
                              }}
                            >
                              {doc}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }
                // default input type
                return (
                  <div key={f.name} style={{ marginBottom: 12 }}>
                    <label htmlFor={f.name} style={styles.label}>{f.label}</label>
                    <input
                      id={f.name}
                      name={f.name}
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange(e, setFieldValue)}
                      onBlur={handleBlur}
                      style={styles.input}
                    />
                    {err && <div style={{ color: "red", fontSize: "12px" }}>{err}</div>}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }} className="button-row">
              <button
                type="button"
                style={styles.button}
                onClick={() => {
                  // Transform Patient Name from "Last, First" to "First Last"
                  const name = values.patientName || "";
                  if (name.includes(",")) {
                    const [last, first] = name.split(",").map(s => s.trim());
                    if (last && first) {
                      const newName = `${first} ${last}`;
                      setFieldValue("patientName", newName);
                      setLocalPatientName(newName);
                      onChange({ target: { name: "patientName", value: newName } });
                    }
                  }
                }}
              >
                Transform Patient Name
              </button>
              <button
                type="submit"
                style={styles.button}
                disabled={Object.keys(errors).length > 0}
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Demography;
