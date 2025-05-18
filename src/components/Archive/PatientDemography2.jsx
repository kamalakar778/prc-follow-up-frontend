import React, { useState } from "react";

const PatientDemography = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    dob: "",
    dateOfEvaluation: "",
    dateOfDictation: "",
    physician: "Dr. Robert Klickovich", // example default
    provider: "",
    referringPhysician: "",
    insurance: "",
    location: "",
    cma: "",
    roomNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add backend call or further processing here
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        PATIENT NAME:
        <input
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        DATE OF BIRTH:
        <input name="dob" value={formData.dob} onChange={handleChange} />
      </label>
      <br />
      <label>
        DATE OF EVALUATION:
        <input
          name="dateOfEvaluation"
          value={formData.dateOfEvaluation}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        DATE OF DICTATION:
        <input
          name="dateOfDictation"
          value={formData.dateOfDictation}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        PHYSICIAN:
        <input name="physician" value={formData.physician} disabled />
      </label>
      <br />
      <label>
        Provider:
        <input
          list="provider-options"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => setFormData({ ...formData, provider: "" })}
        >
          Clear
        </button>
        <datalist id="provider-options">
          {[
            "Cortney Lacefield, APRN",
            "Lauren Ellis, APRN",
            "Taja Elder, APRN",
            "Robert Klickovich, M.D"
          ].map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </label>
      <br />
      <label>
        Referring Physician:
        <input
          name="referringPhysician"
          value={formData.referringPhysician}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Insurance:
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            list="insurance-options"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setFormData({ ...formData, insurance: "" })}
          >
            Clear
          </button>
        </div>
        <datalist id="insurance-options">
          {[
            "Aetna",
            "BCBS",
            "Ambetter",
            "Commercial",
            "Humana",
            "PP",
            "Medicare",
            "Medicaid",
            "TriCare",
            "Trieast",
            "WellCare",
            "Work. Comp",
            "UHC"
          ].map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      </label>
      <br />
      <label>
        Location:
        <input
          list="location-options"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => setFormData({ ...formData, location: "" })}
        >
          Clear
        </button>
        <datalist id="location-options">
          <option value="Louisville" />
          <option value="E-town" />
        </datalist>
      </label>
      <br />
      <label>
        CMA:
        <input
          list="cma-options"
          name="cma"
          value={formData.cma}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => setFormData({ ...formData, cma: "" })}
        >
          Clear
        </button>
        <datalist id="cma-options">
          {[
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
            "DJ"
          ].map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </label>
      <br />
      <label>
        Room #:
        <input
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PatientDemography;
