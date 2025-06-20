import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

// Physician list for live search
const physicianOptions = [
  "Acevedo", "Albertis", "Amin", "Arnold", "Bannes", "Baptist", "Bencovice", "Bercovici", "Bjerke", "Blair", "Bocklem", "Boggus", 
  "Bossus", "Boyles", "Briones", "Brockman", "Broderick", "Brown", "Bryson", "Burke", "Bushel", "Byers", "Caballoro", "Campus Health", 
  "Carmer", "Carner", "Carver", "Casnelle", "Catlett", "Champion", "Coleman", "Cola Sante", "Cook", "Cox", "Craig", "Crutchfield", 
  "Decarvello", "Dennison", "Desai", "Donohue", "Dripchak", "Dripcheck", "Dulle", "Duncan", "Dunagan", "Edward", "Edwards", 
  "Ehrhard", "Eldemire", "Elikotil", "Ennis", "Evans", "Fannin", "Farris", "Fernandez", "Ferguson", "Fields", "FHC", "Fireman", 
  "Fosel", "Foss", "Ft. Knox", "Gardner", "George", "Gibson", "Giles", "Glassman", "Guest", "Habbard", "Harper", "Harris", "Hasan", 
  "Hitterocope", "Hoffman", "Houk", "Humphrey", "Ireland", "Jackson", "JenCare", "Jencare", "Johnson", "Kalyn Churchil", "Kahatari", 
  "Kapp", "Kippe", "Laughlin", "Leatherman", "Mans Field", "Marion", "Marshall", "Martinez", "McCauley", "McConda", "Mccoy", 
  "Mitchell", "Morgan", "Morrison", "Morsq", "Morsy", "Morris", "Moulana", "Nair", "Nash", "Nedye", "Nelson", "Nguyn", "Norton", 
  "O'Daniel", "O’Daniels", "Olly Fox", "Ortez", "Oswary", "Pastel", "Patton", "Payne", "Pearl Medical", "Quadri", "Rajan Amin", 
  "Raybon", "Recktenwald", "Rhoads", "Rice", "Roberts", "Robinson", "Saleem", "Savago", "Saxon", "Sccor", "Shan", "Shaw", "Singham", 
  "Singletary", "Sizemore", "Smith", "Summers", "Suratt", "Swincher", "Taylor", "Thomas", "Thompson", "UofL", "ULP", "Vermachineni", 
  "Volpert", "Wang", "Warner", "Watzig", "Wheaton", "Wheeler", "White", "Wilson", "Wolf", "Woodson", "Zeherder"
];

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
    maxWidth: 1200,
    margin: "10px auto",
    padding: "0.5rem",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
  },
  section: {
    padding: "0.75rem",
    border: "1px solid #000",
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
    margin: "5px",
    padding: "0.4rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff"
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

const insuranceOptions = [
  "Aetna", "BCBS", "Ambetter", "Cigna", "Commercial", "Humana", "PP", "MCR",
  "Medicare", "Medicare B", "Medicaid", "TriCare", "Trieast", "WellCare",
  "Work. Comp", "UHC", "Other", "Self pay"
];

const locationOptions = ["Louisville", "E-town"];

const providerOptions = [
  { "Cortney Lacefield": "Cortney Lacefield, APRN" },
  { "Klickovich": "Robert Klickovich, M.D" },
  { "Lauren Ellis": "Lauren Ellis, APRN" },
  { "Taja Elder": "Taja Elder, APRN" }
];

const cmaOptions = [
  "Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie", "MS", "Nick",
  "PP", "SC", "Steph", "Tony", "Tina", "DJ", "Tammy", "Other"
];

const validationSchema = Yup.object().shape({
  provider: Yup.string().required("Provider is required"),
  patientName: Yup.string().required("Patient Name is required"),
  dob: Yup.string()
    .required("Date of Birth is required")
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/, "Date must be in MM/DD/YYYY format"),
  dateOfEvaluation: Yup.string()
    .required("Date of Evaluation is required")
    .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/, "Date must be in MM/DD/YYYY format"),
  location: Yup.string().test(
    "et-location-check",
    "Location must be E-town if (ET) is in the file name",
    function (value) {
      const { fileName } = this.options.context || {};
      if (/\(ET\)/i.test(fileName)) {
        return value === "E-town";
      }
      return true;
    }
  )
});

const getWeekday = (dateStr) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return "";
  const [mm, dd, yyyy] = dateStr.split("/");
  const date = new Date(`${yyyy}-${mm}-${dd}`);
  return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { weekday: "long" });
};

const Demography = ({
  fileName,
  formData,
  onFileNameChange,
  onChange,
  onReset,
  onSubmit,
  setFormData,
  setDateOfEvaluation
}) => {
  const [localPatientName, setLocalPatientName] = useState(formData.patientName || "");
  const [referringInput, setReferringInput] = useState(formData.referringPhysician || "");
  const [filteredPhysicians, setFilteredPhysicians] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (/\(ET\)/i.test(fileName)) {
      setFormData((prev) => ({ ...prev, location: "E-town" }));
    }
  }, [fileName]);

  const handlePatientNameChange = (e, setFieldValue) => {
    const rawValue = e.target.value;
    const formatted = rawValue.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setLocalPatientName(formatted);
    setFieldValue("patientName", formatted);
    onChange({ target: { name: "patientName", value: formatted } });
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
      context={{ fileName }}
      onSubmit={onSubmit}
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
              {[
                { label: "Patient Name", name: "patientName", type: "input" },
                { label: "Date of Evaluation", name: "dateOfEvaluation", type: "input" },
                { label: "Date of Birth", name: "dob", type: "input" },
                { label: "Referring Physician", name: "referringPhysician", type: "referring" },
                { label: "Provider", name: "provider", type: "toggle", options: providerOptions },
                { label: "Location", name: "location", type: "toggle", options: locationOptions },
                { label: "Insurance 1", name: "insurance1", type: "insurance" },
                { label: "CMA", name: "CMA", type: "cma" },
                { label: "Insurance 2", name: "insurance2", type: "insurance" },
                { label: "Room #", name: "roomNumber", type: "input" }
              ].map(({ label, name, type, options }) => {
                const error = touched[name] && errors[name];

                if (type === "input") {
                  return (
                    <div key={name} className="responsive-label" style={styles.label}>
                      <span>{label}:</span>
                      <input
                        name={name}
                        className="responsive-input"
                        style={styles.input}
                        value={name === "patientName" ? localPatientName : values[name] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (name === "patientName") {
                            handlePatientNameChange(e, setFieldValue);
                          } else {
                            setFieldValue(name, val);
                            onChange(e);
                            if (name === "dateOfEvaluation" && setDateOfEvaluation) {
                              setDateOfEvaluation(val);
                            }
                          }
                        }}
                      />
                      {name === "patientName" && (
                        <button
                          type="button"
                          onClick={() => transformPatientName(setFieldValue)}
                          style={{ ...styles.button, marginLeft: "0.3rem", padding: "0.2rem 0.5rem" }}
                        >
                          Transform
                        </button>
                      )}
                      {name === "dateOfEvaluation" && values.dateOfEvaluation && (
                        <span style={{ marginLeft: "8px", fontStyle: "italic", color: "#666" }}>
                          {getWeekday(values.dateOfEvaluation)}
                        </span>
                      )}
                      {error && <div style={{ color: "red" }}>{error}</div>}
                    </div>
                  );
                }

                if (type === "referring") {
                  return (
                    <div key={name} className="responsive-label" style={styles.label}>
                      <span>{label}:</span>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          name={name}
                          className="responsive-input"
                          style={styles.input}
                          value={referringInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            setReferringInput(val);
                            const matches = physicianOptions.filter((doc) =>
                              doc.toLowerCase().includes(val.toLowerCase())
                            );
                            setFilteredPhysicians(matches);
                            setFieldValue(name, val);
                            onChange({ target: { name, value: val } });
                          }}
                        />
                        {filteredPhysicians.length > 0 && referringInput.trim() !== "" && (
                          <ul style={{
                            position: "absolute", top: "100%", left: 0, right: 0,
                            backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "4px",
                            maxHeight: "150px", overflowY: "auto", zIndex: 10, margin: 0, padding: 0
                          }}>
                            {filteredPhysicians.map((doc) => (
                              <li key={doc}
                                style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
                                onClick={() => {
                                  setReferringInput(doc);
                                  setFilteredPhysicians([]);
                                  setFieldValue(name, doc);
                                  onChange({ target: { name, value: doc } });
                                }}
                              >
                                {doc}
                              </li>
                            ))}
                          </ul>
                        )}
                        {error && <div style={{ color: "red" }}>{error}</div>}
                      </div>
                    </div>
                  );
                }

                if (type === "toggle") {
                  return (
                    <div key={name} className="responsive-label" style={styles.label}>
                      <span>{label}:</span>
                      <div>
                        {options.map((opt) => {
                          const key = typeof opt === "object" ? Object.keys(opt)[0] : opt;
                          const value = typeof opt === "object" ? Object.values(opt)[0] : opt;
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
                      {error && <div style={{ color: "red" }}>{error}</div>}
                    </div>
                  );
                }

                if (type === "insurance" || type === "cma") {
                  const optionsList = type === "insurance" ? insuranceOptions : cmaOptions;
                  const inputKey = `${name}Input`;
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
                          setFieldValue(inputKey, "");
                        }}
                      >
                        <option value="">-- Select {label} --</option>
                        {optionsList.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <input
                        name={inputKey}
                        className="responsive-input"
                        style={styles.input}
                        placeholder={`Or type ${label}`}
                        value={values[inputKey] || ""}
                        onChange={(e) => {
                          onChange(e);
                          setFieldValue(inputKey, e.target.value);
                          setFieldValue(name, e.target.value.trim() ? "Other" : "");
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
