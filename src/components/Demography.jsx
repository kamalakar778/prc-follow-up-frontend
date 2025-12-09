import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";
const bpRegex = /^\d{2,3}\/\d{2,3}$/;

const styles = {
  container: { fontFamily: "Arial, sans-serif", maxWidth: 1200, margin: "10px auto", padding: "0.5rem", backgroundColor: "#f9f9f9", borderRadius: 4, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  label: { display: "flex", flexDirection: "row", alignItems: "center", fontSize: 16, color: "#333", gap: "0.3rem", marginBottom: "-0.2rem" },
  input: { display: "flex", maxWidth: "40%", minWidth: 180, flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, margin: 6 },
  button: { padding: "0.5rem 0.8rem", margin: "0.5rem", borderRadius: 8, border: "none", fontWeight: "bold", fontSize: 16, cursor: "pointer", backgroundColor: "#3498db", color: "#fff" },
  dateInput: { padding: 6, borderRadius: 4, border: "1px solid #ccc", fontSize: 17, width: 160, marginTop: 15, marginLeft: -16 },
  optionButton: (sel) => ({ alignItems: "center", margin: "5px 2px", padding: "8px 12px", borderRadius: "8px", border: "1px solid", borderColor: sel ? "green" : "#999", backgroundColor: sel ? "#e0f7e9" : "#f0f0f0", color: sel ? "green" : "#333", fontWeight: sel ? "bold" : "normal", cursor: "pointer", fontSize: 15, display: "inline-block" }),
  checkboxContainer: { display: "flex", flexWrap: "wrap", marginBottom: 15 },

  noteCopyRow: { display: "flex", gap: "0.1rem", margin: "0.5rem 0", flexWrap: "wrap" },
  noteItem: { display: "flex", alignItems: "center", flex: 1, minWidth: 450, gap: "0.5rem" },
  noteLabel: (copied) => ({ cursor: "pointer", fontWeight: "bold", minWidth: 120, color: copied ? "#27ae60" : "#333", userSelect: "none" }),
  noteInput: { flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, backgroundColor: "#fdfdfd" },
  vitalsInput: { width: 70, padding: "8px 8px", borderRadius: 6, border: "3px solid #8a4a31ff", fontSize: 16, marginRight: 18 }

};



const providerOptions = [{ "Cortney Lacefield": "Cortney Lacefield, APRN" }, { Klickovich: "Robert Klickovich, M.D" }, { "Lauren Ellis": "Lauren Ellis, APRN" }, { "Taja Elder": "Taja Elder, APRN" }, { "_______": "_________________" }];
const locationOptions = ["Louisville", "E-town"];
const insuranceOptions = ["Aetna", "BCBS", "Ambetter", "Cigna", "Commercial", "Humana", "Medicare", "Medicare B", "Medicaid", "MCR", "TriCare", "Trieast", "WellCare", "PP", "UHC", "Work. Comp", "Self pay",];
const cmaOptions = ["Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie", "MS", "Nick", "PP", "SC", "Steph", "Tony", "Tina", "DJ", "Tammy"];

const formatDateToISO = (d) => d.toISOString().slice(0, 10);
const formatDateToMMDDYYYY = (d) => `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
const parseMMDDYYYYtoDate = (s) => new Date(`${s.split("/")[2]}-${s.split("/")[0]}-${s.split("/")[1]}`);
const getWeekday = (s) => !s ? "" : new Date(parseMMDDYYYYtoDate(s)).toLocaleDateString("en-US", { weekday: "long" });
const isValidDate = (v) => !isNaN(parseMMDDYYYYtoDate(v));

const getValidationSchema = (opts = [], fileName = "") => {
  const providerVals = opts.map((o) => Object.values(o)[0]);
  return Yup.object({
    provider: Yup.string().required().oneOf(providerVals),
    patientName: Yup.string().required().min(3),
    referringPhysician: Yup.string().required().min(3),
    dob: Yup.string().required().matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/).test("valid", "Invalid", isValidDate),
    dateOfEvaluation: Yup.string().required().matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/).test("valid", "Invalid", isValidDate),
    location: Yup.string().test("et-check", "Must be E-town if (ET)", (v) => /\(ET\)/i.test(fileName) ? v === "E-town" : true),
    insuranceList: Yup.array().of(Yup.string()),
    CMA: Yup.array().of(Yup.string()),
    roomNumber: Yup.string(),
    vitals: Yup.object({
      bp: Yup.string()
        // .nullable()
        .matches(bpRegex, "BP must be like 120/80")
        .required("BP is required"),
      heightFeet: Yup.number()
        .min(1, "Feet must be at least 1")
        .max(9, "Feet must be less than 9")
        .required("Height (ft) is required"),
      heightInches: Yup.number()
        .min(0, "Inches cannot be negative")
        .max(11, "Must be less than 12 inches")
        .required("Height (in) is required"),
      weight: Yup.number()
        .positive("Weight must be positive")
        .required("Weight is required"),
      bmi: Yup.number()
        .min(5, "BMI too low")
        .max(100, "BMI too high")
        .required("BMI is required")
    })
  });

};

const Demography = ({ vitals, setVitals, fileName, formData, onFileNameChange, onChange, onSubmit: onSubmitExternal, setFormData, setDateOfEvaluation }) => {
  const [dateISO, setDateISO] = useState(() => formData.dateOfEvaluation && /^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfEvaluation) ? formatDateToISO(parseMMDDYYYYtoDate(formData.dateOfEvaluation)) : formatDateToISO(new Date(Date.now() - 86400000)));
  const [localPatientName, setLocalPatientName] = useState(formData.patientName || "");
  const [referringInput, setReferringInput] = useState(formData.referringPhysician || "");
  const [filteredPhysicians, setFilteredPhysicians] = useState([]);
  const [allPhysicians, setAllPhysicians] = useState([]);
  const insuranceRef = useRef(), cmaRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [copiedType, setCopiedType] = useState(null);



  useEffect(() => {
    if (!formData.dateOfEvaluation) {
      const y = new Date(Date.now() - 86400000), mmdd = formatDateToMMDDYYYY(y), iso = formatDateToISO(y);
      setDateISO(iso); setFormData(p => ({ ...p, dateOfEvaluation: mmdd })); setDateOfEvaluation?.(mmdd);
    }
    axios.get(`${BACKEND_URL}/physicians`).then((res) => setAllPhysicians(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (dateISO) {
      const [y, m, d] = dateISO.split("-"), mmdd = `${m}/${d}/${y}`;
      setFormData(p => ({ ...p, dateOfEvaluation: mmdd })); setDateOfEvaluation?.(mmdd);
    }
  }, [dateISO]);

  useEffect(() => { if (/\(ET\)/i.test(fileName)) setFormData(p => ({ ...p, location: "E-town" })); }, [fileName]);

  // Inside your component:
  const handleCopyNote = (type, note) => {
    navigator.clipboard.writeText(note);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  useEffect(() => {
    axios.get("http://localhost:8000/get-physicians")
      .then(res => setAllPhysicians(res.data))
      .catch(err => console.error("Failed to fetch physicians:", err));
  }, []);

  const addPhysician = async (name) => {
    try {
      const res = await axios.post("http://localhost:8000/add-physician", { name });
      console.log("📌 Physician added:", res.data.message);
    } catch (err) {
      console.error("❌ Error adding physician:", err);
    }
  };

  // 🔧 PLACE THIS HELPER WITHIN THE COMPONENT TOO:
  // const addPhysicianIfMissing = async (name) => {
  //   const trimmed = name.trim();
  //   const exists = allPhysicians.some(
  //     (p) => typeof p?.name === "string" && p.name.toLowerCase() === trimmed.toLowerCase()
  //   );
  //   if (!exists && trimmed !== "") {
  //     await addPhysician(trimmed);
  //   }
  // };
  const addPhysicianIfMissing = async (name) => {
    const trimmed = name.trim();
    const exists = allPhysicians.some(
      (p) =>
        typeof p?.name === "string" &&
        p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists && trimmed !== "") {
      await addPhysician(trimmed);
    }
  };


  // ✍️ Field change handler example (used with Formik)
  const handleFieldChange = (e, setFieldValue) => {
    const { name, value } = e.target;

    if (name === "patientName") {
      const formatted = value.trim().replace(/\b\w/g, (c) => c.toUpperCase());
      setLocalPatientName(formatted);
      setFieldValue(name, value);
      // setFieldValue(name, formatted);
      onChange({ target: { name, value: formatted } });
    } else if (name === "referringPhysician") {
      // setReferringInput(value);
      // setFieldValue(name, value);
      // onChange({ target: { name, value } });
      // const physicianNames = allPhysicians.map(p => p?.name || "");
      // setFilteredPhysicians(
      //   value
      //     ? physicianNames.filter((n) => n.toLowerCase().includes(value.toLowerCase()))
      //     : []
      // );
      addPhysicianIfMissing(value);
    } else {
      setFieldValue(name, value);
      onChange({ target: { name, value } });
    }
  };

  const handleUploadPDFs = async (files) => {
    if (!files) {
      console.error("❌ No files provided to handleUploadPDFs");
      return;
    }

    // Normalize into array
    const fileArray = Array.isArray(files) ? files : Array.from(files);

    console.log(`📂 Preparing to upload ${fileArray.length} file(s)...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const { fileName, path } = file;

      console.log(`\n📤 [${i + 1}/${fileArray.length}] Uploading: ${fileName} from ${path}...`);

      try {
        const response = await fetch("http://localhost:8000/upload-documents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName, path }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error(`❌ Upload failed for ${fileName}:`, error.error);
          failCount++;
        } else {
          const result = await response.json();
          console.log(`✅ Upload success: ${result.message}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error uploading ${fileName}:`, err);
        failCount++;
      }
    }

    console.log("\n📊 Upload Summary:");
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed:  ${failCount}`);
    console.log("🎉 All files processed one by one.");
  };



  const handleReferringChange = (e, setFieldValue) => {
    const v = e.target.value;
    setReferringInput(v);
    setFieldValue("referringPhysician", v);
    onChange({ target: { name: "referringPhysician", value: v } });

    const physicianNames = allPhysicians
      .filter(p => typeof p?.name === "string")
      .map(p => p.name);

    setFilteredPhysicians(
      v
        ? physicianNames.filter(name =>
          name.toLowerCase().includes(v.toLowerCase())
        )
        : []
    );
  };

  const changeDate = (days, setFieldValue) => {
    const d = new Date(dateISO); d.setDate(d.getDate() + days);
    const iso = formatDateToISO(d), mmdd = formatDateToMMDDYYYY(d);
    setDateISO(iso); setFieldValue("dateOfEvaluation", mmdd);
    setFormData(p => ({ ...p, dateOfEvaluation: mmdd })); setDateOfEvaluation?.(mmdd);
  };

  const toggleOption = (key, val, setFieldValue) => {
    const nv = formData[key] === val ? "" : val;
    setFormData(p => ({ ...p, [key]: nv })); setFieldValue(key, nv);
  };

  const toggleArrayOption = (field, value, setFieldValue) => {
    const selected = formData[field] || [], updated = selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value];
    setFormData(p => ({ ...p, [field]: updated })); setFieldValue(field, updated);
  };

  const handleCopy = (type, note) => {
    navigator.clipboard.writeText(note);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const onSubmit = async (values, actions) => {
    const insVal = insuranceRef.current?.value.trim(), cmaVal = cmaRef.current?.value.trim();
    if (insVal && !values.insuranceList.includes(insVal)) {
      values.insuranceList.push(insVal); setFormData(p => ({ ...p, insuranceList: [...(p.insuranceList || []), insVal] }));
    }
    if (cmaVal && !values.CMA.includes(cmaVal)) {
      values.CMA.push(cmaVal); setFormData(p => ({ ...p, CMA: [...(p.CMA || []), cmaVal] }));
    }
    if (!values.dateOfEvaluation && dateISO) {
      const [y, m, d] = dateISO.split("-"), mmdd = `${m}/${d}/${y}`;
      values.dateOfEvaluation = mmdd; setFormData(p => ({ ...p, dateOfEvaluation: mmdd })); setDateOfEvaluation?.(mmdd);
    }
    const ref = values.referringPhysician.trim(), cap = ref.charAt(0).toUpperCase() + ref.slice(1);
    if (
      cap &&
      !allPhysicians.some(
        p => typeof p?.name === "string" && p.name.toLowerCase() === cap.toLowerCase()
      )
    ) {
      try {
        await axios.post(`${BACKEND_URL}/physicians`, { name: cap });
        setAllPhysicians(prev => [...prev, { name: cap }]);
      } catch (e) {
        console.error(e);
      }
    }

    // Add this part to send the fileName
    try {
      const fileName = values.fileName; // Assuming fileName is part of the values object
      await axios.post(`${BACKEND_URL}/generate-document`, { fileName });
      console.log("File name sent to backend:", fileName);
    } catch (err) {
      console.error("Error sending file name to backend:", err);
    }

    await onSubmitExternal({ ...values, referringPhysician: cap }, actions);
  };
  const initialValues = { ...formData, vitals: vitals };
  return (
    <Formik initialValues={initialValues} validationSchema={getValidationSchema(providerOptions, fileName)} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, setFieldValue, handleSubmit }) => (
        <form onSubmit={handleSubmit} style={styles.container}>
          {/* Modern Notes Copy Section (1 row) */}
          {/* Modern Notes Copy Section (1 row) */}
          {/* ✅ Modern Notes Copy Section */}
          <div style={styles.noteCopyRow}>
            {["RAW", "Transcribed"].map((type) => {
              const note = `${type} Data Follow up visit notes on ${formData.dateOfEvaluation || "____"}`;
              const copied = copiedType === type;

              return (
                <div key={type} style={styles.noteItem}>
                  <button
                    type="button"
                    onClick={() => handleCopyNote(type, note)}
                    style={{
                      ...styles.button,
                      minWidth: 120,
                      backgroundColor: copied ? "#27ae60" : "#3498db",
                      transition: "background-color 0.3s ease",
                      flexShrink: 0,
                    }}
                  >
                    {copied ? "Copied!" : `${type} Notes`}
                  </button>
                  <input
                    readOnly
                    value={note}
                    style={{
                      ...styles.noteInput,
                      width: "100%",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* ✅ File Name Row - Fully Responsive */}
          <div style={{ ...styles.label, flexWrap: "wrap", gap: "0.5rem", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ minWidth: 80 }}>File Name:</span>

            <input
              type="text"
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              style={{
                ...styles.input,
                flex: 1,
                minWidth: 200,
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "visible",
                textOverflow: "initial",
              }}
            />

            <input
              type="file"
              id="fileInput"
              accept=".pdf,.docx,.txt"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const baseName = file.name.replace(/\.[^/.]+$/, "");
                  onFileNameChange(baseName);
                }
              }}
            />

            {/* <label
              htmlFor="fileInput"
              style={{
                ...styles.button,
                backgroundColor: "#95a5a6",
                whiteSpace: "nowrap",
              }}
            >
              Choose File
            </label> */}

            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="submit" style={styles.button}>Generate Document</button>
              <button type="button" style={styles.button} onClick={() => handleUploadPDFs(values.fileName)}>
                Upload PDFs
              </button>

            </div>
          </div>

          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: 8 }}>
              <b>Vitals</b>

              {/* BP */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label><b>Blood Press:</b></label>
                <input
                  type="text"
                  value={vitals.bp}
                  onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                  placeholder="Pressure"
                  style={styles.vitalsInput}
                />
                {errors.vitals?.bp && touched.vitals?.bp && (
                  <span style={{ color: "red", fontSize: 14 }}>{errors.vitals.bp}</span>
                )}
              </div>

              {/* Height */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label><b>Height (ft):</b></label>
                <input
                  type="text"
                  value={vitals.heightFeet}
                  onChange={(e) => setVitals({ ...vitals, heightFeet: e.target.value })}
                  placeholder="Feet"
                  style={styles.vitalsInput}
                />
                {errors.vitals?.heightFeet && touched.vitals?.heightFeet && (
                  <span style={{ color: "red", fontSize: 14 }}>{errors.vitals.heightFeet}</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label><b>Inches:</b></label>
                <input
                  type="text"
                  value={vitals.heightInches}
                  onChange={(e) => setVitals({ ...vitals, heightInches: e.target.value })}
                  placeholder="Inches"
                  style={styles.vitalsInput}
                />
                {errors.vitals?.heightInches && touched.vitals?.heightInches && (
                  <span style={{ color: "red", fontSize: 14 }}>{errors.vitals.heightInches}</span>
                )}
              </div>

              {/* Weight */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label><b>Weight (lbs):</b></label>
                <input
                  type="text"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                  placeholder="lbs"
                  style={styles.vitalsInput}
                />
                {errors.vitals?.weight && touched.vitals?.weight && (
                  <span style={{ color: "red", fontSize: 14 }}>{errors.vitals.weight}</span>
                )}
              </div>

              {/* BMI */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label><b>BMI:</b></label>
                <input
                  type="text"
                  value={vitals.bmi}
                  onChange={(e) => setVitals({ ...vitals, bmi: e.target.value })}
                  placeholder="BMI"
                  style={styles.vitalsInput}
                />
                {errors.vitals?.bmi && touched.vitals?.bmi && (
                  <span style={{ color: "red", fontSize: 14 }}>{errors.vitals.bmi}</span>
                )}
              </div>
            </div>
          </div>

          {/* <hr style={{ margin: "1rem 0" }} /> */}
          {[
            { label: "Patient Name", name: "patientName", type: "input" },
            { label: "Date of Birth", name: "dob", type: "input" },
            { label: "Date of Evaluation", name: "dateOfEvaluation", type: "inputWithDate" },
            { label: "Referring Physician", name: "referringPhysician", type: "referring" },
            { label: "Provider", name: "provider", type: "toggle", options: providerOptions },
            { label: "Insurance", name: "insuranceList", type: "multi", options: insuranceOptions, ref: insuranceRef },
            { label: "CMA", name: "CMA", type: "multi", options: cmaOptions, ref: cmaRef },
            { label: "Room #", name: "roomNumber", type: "input" },
            { label: "Location", name: "location", type: "toggle", options: locationOptions },
          ].map(f => {
            const err = touched[f.name] && errors[f.name];
            const val = values[f.name] || "";
            return (
              <div key={f.name} style={styles.label}>
                <span>{f.label}:</span>
                {f.type === "input" && (
                  <>
                    <input
                      name={f.name}
                      value={f.name === "patientName" ? localPatientName : val}
                      style={styles.input}
                      onChange={(e) => handleFieldChange(e, setFieldValue)}
                    />
                    {f.name === "patientName" && (
                      <button
                        type="button"
                        style={{ ...styles.button, marginLeft: 0 }}
                        onClick={() => {
                          const cap = s => s.trim().split(" ").map(w => w[0]?.toUpperCase() + w.slice(1).toLowerCase()).join(" ");
                          const [l, f] = localPatientName.split(",").map(cap);
                          const full = f && l ? `${f} ${l}` : "";
                          full && setLocalPatientName(full);
                          full && setFieldValue("patientName", full);
                          full && onChange({ target: { name: "patientName", value: full } });

                          const dob = (values.dob || "").replace(/^DOB\s*:\s*/i, "");
                          dob !== values.dob && setFieldValue("dob", dob);
                          dob !== values.dob && onChange({ target: { name: "dob", value: dob } });
                        }}
                      >
                        Transform
                      </button>
                    )}
                  </>
                )}

                {f.type === "inputWithDate" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input name={f.name} placeholder="MM/DD/YYYY" style={{ ...styles.input, width: 120 }} value={val} onChange={(e) => {
                      const v = e.target.value.trim(); setFieldValue(f.name, v); if (v) setDateISO(""); setDateOfEvaluation?.(v); onChange({ target: { name: f.name, value: v } });
                    }} onBlur={() => {
                      if (!val && dateISO) {
                        const [y, m, d] = dateISO.split("-"), fallback = `${m}/${d}/${y}`;
                        setFieldValue(f.name, fallback); setDateOfEvaluation?.(fallback); onChange({ target: { name: f.name, value: fallback } });
                      }
                    }} />
                    <button type="button" style={{ ...styles.button, marginRight: 20 }} onClick={() => changeDate(-1, setFieldValue)}>◀</button>
                    <input type="date" value={dateISO} style={styles.dateInput} onChange={(e) => {
                      const iso = e.target.value, [y, m, d] = iso.split("-"), mmdd = `${m}/${d}/${y}`;
                      setDateISO(iso); setFieldValue(f.name, mmdd); setDateOfEvaluation?.(mmdd); onChange({ target: { name: f.name, value: mmdd } });
                    }} />
                    <button type="button" style={{ ...styles.button, }} onClick={() => changeDate(1, setFieldValue)}>▶</button>
                    {val && <span style={{ marginLeft: 8, fontStyle: "italic", fontSize: 18, color: "#666" }}>{getWeekday(val)}</span>}
                  </div>
                )}
                
                {f.type === "referring" && (
                  <div style={{ position: "relative", width: "20%" }}>
                    <input name={f.name} value={referringInput} style={styles.input} onChange={(e) => handleReferringChange(e, setFieldValue)} autoComplete="off" />
                    {filteredPhysicians.length > 0 && referringInput.trim() && (
                      <ul style={{ position: "absolute", left: 0, right: 0, margin: 0, padding: 0, listStyle: "none", maxHeight: 150, overflowY: "auto", zIndex: 10, backgroundColor: "#fff", border: "1px solid #ccc" }}>
                        {filteredPhysicians.map(doc => (
                          <li key={doc} style={{ padding: 8, cursor: "pointer", borderBottom: "1px solid #eee" }} onClick={() => {
                            setReferringInput(doc); setFilteredPhysicians([]); setFieldValue(f.name, doc); onChange({ target: { name: f.name, value: doc } });
                          }}>{doc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {f.type === "toggle" && (
                  <div>
                    {f.options.map(opt => {
                      const key = typeof opt === "object" ? Object.keys(opt)[0] : opt;
                      const value = typeof opt === "object" ? Object.values(opt)[0] : opt;
                      return <span key={key} style={styles.optionButton(val === value)} onClick={() => toggleOption(f.name, value, setFieldValue)}>{key}</span>;
                    })}
                  </div>
                )}
                {f.type === "multi" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {f.options.map(opt => (
                      <span key={opt} style={styles.optionButton(val.includes(opt))} onClick={() => toggleArrayOption(f.name, opt, setFieldValue)}>{opt}</span>
                    ))}
                    <input placeholder={`Enter ${f.label}`} ref={f.ref} style={styles.input} onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        e.preventDefault(); const v = e.target.value.trim();
                        if (!val.includes(v)) {
                          const updated = [...val, v]; setFieldValue(f.name, updated);
                          setFormData(p => ({ ...p, [f.name]: updated }));
                        } e.target.value = "";
                      }
                    }} />
                  </div>
                )}
                {err && <div style={{ color: "red" }}>{err}</div>}
              </div>
            );
          })}

        </form>
      )}
    </Formik>
  );
};

export default Demography;