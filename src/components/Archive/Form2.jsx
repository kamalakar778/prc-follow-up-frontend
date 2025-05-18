import React, { useState } from "react";
import PatientDemography from "./PatientDemography2";

const Form = () => {
  const initialFormData = {
    patientName: "",
    dob: "",
    dateOfEvaluation: "",
    dateOfDictation: "",
    physician: "Robert Klickovich, M.D",
    provider: "",
    referringPhysician: "",
    insurance: "",
    location: "",
    cma: "",
    roomNumber: "",
    chiefComplaint: "",
    historyOfPresentIllness: {
      pain_illnessLevel: "",
      activity_illnessLevel: "",
      social_illnessLevel: "",
      job_illnessLevel: "",
      sleep_illnessLevel: ""
    }
  };

  const [formData, setFormData] = useState(initialFormData);
  const [fileName, setFileName] = useState("FollowUpVisit");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("_illnessLevel")) {
      setFormData((prev) => ({
        ...prev,
        historyOfPresentIllness: {
          ...prev.historyOfPresentIllness,
          [name]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to generate document");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileName || "FollowUpVisit"}.docx`;
      link.click();
    } catch (error) {
      console.error("Error generating document:", error);
      alert("Failed to generate document. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFileName("FollowUpVisit");
  };

  const illnessOptions = ["More tolerable", "Less tolerable", "Worse", "The same"];

  return (
    <form onSubmit={handleSubmit}>
      {/* <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          File Name:
          <input
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="Follow Up File Name"
          />
        </label>
        <button type="submit">Generate Document</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </div>

      <label>PATIENT NAME: <input name="patientName" value={formData.patientName} onChange={handleChange} /></label><br />
      <label>DATE OF BIRTH: <input name="dob" value={formData.dob} onChange={handleChange} /></label><br />
      <label>DATE OF EVALUATION: <input name="dateOfEvaluation" value={formData.dateOfEvaluation} onChange={handleChange} /></label><br />
      <label>DATE OF DICTATION: <input name="dateOfDictation" value={formData.dateOfDictation} onChange={handleChange} /></label><br />

      <label>PHYSICIAN: <input name="physician" value={formData.physician} onChange={handleChange} /></label><br />

      <label>
        Provider:
        <input list="provider-options" name="provider" value={formData.provider} onChange={handleChange} />
        <datalist id="provider-options">
          {["Cortney Lacefield, APRN", "Lauren Ellis, APRN", "Taja Elder, APRN", "Robert Klickovich, M.D"].map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </label><br />

      <label>Referring Physician: <input name="referringPhysician" value={formData.referringPhysician} onChange={handleChange} /></label><br />

      <label>
        Insurance:
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            list="insurance-options"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
          />
          <button type="button" onClick={() => setFormData({ ...formData, insurance: "" })}>Clear</button>
        </div>
        <datalist id="insurance-options">
          {["Aetna", "BCBS", "Ambetter", "Commercial", "Humana", "PP", "Medicare", "Medicaid", "TriCare", "Trieast", "WellCare", "Work. Comp", "UHC"].map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      </label><br />

      <label>
        Location:
        <input
          list="location-options"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <button type="button" onClick={() => setFormData({ ...formData, location: "" })}>Clear</button>
        <datalist id="location-options">
          <option value="Louisville" />
          <option value="E-town" />
        </datalist>
      </label><br />

      <label>
        CMA:
        <input
          list="cma-options"
          name="cma"
          value={formData.cma}
          onChange={handleChange}
        />
        <button type="button" onClick={() => setFormData({ ...formData, cma: "" })}>Clear</button>
        <datalist id="cma-options">
          {["Alyson", "Brenda", "Erika", "Janelle", "Laurie", "Melanie", "MS", "Nick", "PP", "SC", "Steph", "Tony", "Tina", "DJ"].map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </label><br />

      <label>Room #: <input name="roomNumber" value={formData.roomNumber} onChange={handleChange} /></label><br />
      <label>CHIEF COMPLAINT: <input name="chiefComplaint" value={formData.chiefComplaint} onChange={handleChange} /></label><br />

      <fieldset>
        <legend>HISTORY OF PRESENT ILLNESS</legend>
        {formData.historyOfPresentIllness &&
          Object.keys(formData.historyOfPresentIllness).map((field) => (
            <label key={field}>
              {field.replace("_illnessLevel", "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").toUpperCase()}:
              <input
                list="illness-options"
                name={field}
                value={formData.historyOfPresentIllness[field]}
                onChange={handleChange}
              />
              <br />
            </label>
          ))}
        <datalist id="illness-options">
          {illnessOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </fieldset> */}
      <PatientDemography formData={formData} onChange={handleChange} />
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          File Name:
          <input
            type="text"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="Follow Up File Name"
          />
        </label>
        <button type="submit">Generate Document</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
};

export default Form;
