import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";
const styles = {
  container: { fontFamily: "Arial, sans-serif", maxWidth: 1200, margin: "10px auto", padding: "0.5rem", backgroundColor: "#f9f9f9", borderRadius: 4, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" },
  label: { display: "flex", flexDirection: "row", alignItems: "center", fontSize: 16, color: "#333", gap: "0.3rem", marginBottom: "-0.2rem" },
  input: { display: "flex", maxWidth: "40%", minWidth: 180, flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, margin: 6 },
  button: { padding: "0.5rem 0.8rem", margin: "0.5rem", borderRadius: 8, border: "none", fontWeight: "bold", fontSize: 16, cursor: "pointer", backgroundColor: "#3498db", color: "#fff" },
  dateInput: { padding: 6, borderRadius: 4, border: "1px solid #ccc", fontSize: 17, width: 160, marginTop: 15, marginLeft: -16 },
  optionButton: (sel) => ({ alignItems: "center", margin: "5px 2px", padding: "8px 12px", borderRadius: "8px", border: "1px solid", borderColor: sel ? "green" : "#999", backgroundColor: sel ? "#e0f7e9" : "#f0f0f0", color: sel ? "green" : "#333", fontWeight: sel ? "bold" : "normal", cursor: "pointer", fontSize: 15, display: "inline-block" }),
  // optionButton: (isChecked) => ({ alignItems: "center", border: `1px solid ${isChecked ? "#3498db" : "#ccc"}`, backgroundColor: isChecked ? "#e1f5fe" : "#fff", cursor: "pointer", transition: "all 0.3s ease" }),
  checkboxContainer: { display: "flex", flexWrap: "wrap", marginBottom: 15 },

  noteCopyRow: { display: "flex", gap: "0.1rem", margin: "0.5rem 0", flexWrap: "wrap" },
  noteItem: { display: "flex", alignItems: "center", flex: 1, minWidth: 450, gap: "0.5rem" },
  noteLabel: (copied) => ({ cursor: "pointer", fontWeight: "bold", minWidth: 120, color: copied ? "#27ae60" : "#333", userSelect: "none" }),
  noteInput: { flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, backgroundColor: "#fdfdfd" },

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
    roomNumber: Yup.string()
  });
};

const Demography = ({ fileName, formData, onFileNameChange, onChange, onSubmit: onSubmitExternal, setFormData, setDateOfEvaluation }) => {
  const [dateISO, setDateISO] = useState(() => formData.dateOfEvaluation && /^\d{2}\/\d{2}\/\d{4}$/.test(formData.dateOfEvaluation) ? formatDateToISO(parseMMDDYYYYtoDate(formData.dateOfEvaluation)) : formatDateToISO(new Date(Date.now() - 86400000)));
  const [localPatientName, setLocalPatientName] = useState(formData.patientName || "");
  const [referringInput, setReferringInput] = useState(formData.referringPhysician || "");
  const [filteredPhysicians, setFilteredPhysicians] = useState([]), [allPhysicians, setAllPhysicians] = useState([]);
  const insuranceRef = useRef(), cmaRef = useRef();
  const [uploading, setUploading] = useState(false);


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

  const handleFieldChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    const val = name === "patientName" ? value.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : value;
    if (name === "patientName") setLocalPatientName(val);
    setFieldValue(name, val); onChange({ target: { name, value: val } });
  };

  const handleUploadPDFs = async (formData) => {
    if (!fileName || !formData?.dateOfEvaluation) {
      console.error("❌ fileName or dateOfEvaluation missing");
      alert("Missing file name or date of evaluation.");
      return;
    }

    const payload = {
      dateOfEvaluation: formData.dateOfEvaluation,
      rawFolderPath: "G:/FOLDERS/PRC 2025/JULY 2025/07-19-2025",
      rawFileName: fileName,
      transcribedFolderPath: "G:/PYTHON/PROJECTS/full_stack_projects/followup-docx-app/backend/PRC_Files_Folder",
      transcribedFileName: fileName,
    };

    try {
      const response = await fetch("http://localhost:8000/upload-documents/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("❌ Upload failed:", result);
        alert("❌ Upload failed: " + (result.detail || "Unknown server error"));
      } else {
        console.log("✅ Upload success:", result.message);
        alert("✅ PDFs uploaded successfully.");
      }
    } catch (error) {
      console.error("❌ Network/upload error:", error);
      alert("❌ Upload error. Check console.");
    }
  };


  const handleReferringChange = (e, setFieldValue) => {
    const v = e.target.value;
    setReferringInput(v); setFieldValue("referringPhysician", v);
    onChange({ target: { name: "referringPhysician", value: v } });
    setFilteredPhysicians(v ? allPhysicians.filter(d => d.toLowerCase().includes(v.toLowerCase())) : []);
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
    if (cap && !allPhysicians.some(p => p.toLowerCase() === cap.toLowerCase())) {
      try { await axios.post(`${BACKEND_URL}/physicians`, { name: cap }); setAllPhysicians(p => [...p, cap]); } catch (e) { console.error(e); }
    }
    await onSubmitExternal({ ...values, referringPhysician: cap }, actions);
  };

  return (
    <Formik initialValues={formData} validationSchema={getValidationSchema(providerOptions, fileName)} enableReinitialize onSubmit={onSubmit}>
      {({ values, errors, touched, setFieldValue, handleSubmit }) => (
        <form onSubmit={handleSubmit} style={styles.container}>
          {/* Modern Notes Copy Section (1 row) */}
          {/* Modern Notes Copy Section (1 row) */}
          <div style={styles.noteCopyRow}>
            {["RAW", "Transcribed"].map((type) => {
              const note = `${type} Data Follow up visit notes on ${formData.dateOfEvaluation || "____"}`;
              const [copied, setCopied] = useState(false);

              return (
                <div key={type} style={styles.noteItem}>
                  <label
                    onClick={() => {
                      navigator.clipboard.writeText(note);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    style={styles.noteLabel(copied)}
                  >
                    {copied ? "Copied!" : `${type} Notes:`}
                  </label>
                  <input readOnly value={note} style={styles.noteInput} />
                </div>
              );
            })}
          </div>
          
          <div style={styles.label}>
            <span>File Name:</span>
            <input type="text" value={fileName} onChange={(e) => onFileNameChange(e.target.value)} style={styles.input} />
            <button type="submit" style={styles.button}>Generate Document</button>
            <button
              type="button"
              style={styles.button}
              // className="bg-blue-500 text-white px-4 py-2"
              onClick={() => handleUploadPDFs(values)} // ✅ now passes values correctly
            >
              Upload PDFs
            </button>


          </div>
          {[
            { label: "Patient Name", name: "patientName", type: "input" },
            { label: "Date of Birth", name: "dob", type: "input" },
            { label: "Date of Evaluation", name: "dateOfEvaluation", type: "inputWithDate" },
            { label: "Provider", name: "provider", type: "toggle", options: providerOptions },
            { label: "Referring Physician", name: "referringPhysician", type: "referring" },
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
                    <input name={f.name} value={f.name === "patientName" ? localPatientName : val} style={styles.input} onChange={(e) => handleFieldChange(e, setFieldValue)} />
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

                          // 👇 Clean DOB if it starts with "DOB :"
                          const dobVal = values.dob || "";
                          const cleanedDob = dobVal.replace(/^DOB\s*:\s*/i, "");
                          if (dobVal !== cleanedDob) {
                            setFieldValue("dob", cleanedDob);
                            onChange({ target: { name: "dob", value: cleanedDob } });
                          }
                        }}
                        style={{ ...styles.button, marginLeft: 0, }}
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