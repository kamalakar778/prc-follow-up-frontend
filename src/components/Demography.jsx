import React from "react";

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  minWidth: "250px",
  width: "50%"
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem"
};

const sectionStyle = {
  padding: "1rem",
  marginTop: "1rem",
  border: "1px solid #ddd",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9"
};

const buttonStyle = {
  // padding: "0.15rem 1.0rem",
  // background: "#3498db",
  // color: "white",
  // border: "none",
  // borderRadius: "8px",
  // fontSize: "1rem",
  // cursor: "pointer",
  // marginRight: "1rem",
  // transition: "background 0.3s ease"
  padding: "0.5rem 1rem",
  marginLeft: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  cursor: "pointer",
  backgroundColor: "#3498db"
};

const flexRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  marginBottom: "1rem"
};

const Demography = ({
  fileName,
  formData,
  onFileNameChange,
  onChange,
  onReset,
  onSubmit,
  setFormData
}) => {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{ maxWidth: 800, margin: "auto" }}
    >
      <div style={flexRow}>
        <label style={{ ...labelStyle, flex: 1 }}>
          File Name:
          <input
            type="text"
            style={inputStyle}
            value={fileName}
            onChange={onFileNameChange}
            placeholder="Follow Up File Name"
          />
        </label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <button type="button" onClick={onSubmit} style={buttonStyle}>
            Generate Document
          </button>
          <button type="button" onClick={onReset} style={buttonStyle}>
            Reset
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>
          PATIENT NAME:
          <input
            name="patientName"
            style={inputStyle}
            value={formData.patientName}
            onChange={onChange}
          />
        </label>

        <label style={labelStyle}>
          DATE OF BIRTH:
          <input
            name="dob"
            style={inputStyle}
            value={formData.dob}
            onChange={onChange}
          />
        </label>

        <label style={labelStyle}>
          DATE OF EVALUATION:
          <input
            name="dateOfEvaluation"
            style={inputStyle}
            value={formData.dateOfEvaluation}
            onChange={onChange}
          />
        </label>

        <label style={labelStyle}>
          DATE OF DICTATION:
          <input
            name="dateOfDictation"
            style={inputStyle}
            value={formData.dateOfDictation}
            onChange={onChange}
          />
        </label>

        <label style={labelStyle}>
          PHYSICIAN:
          <input
            name="physician"
            style={inputStyle}
            value={formData.physician}
            onChange={onChange}
            placeholder="Robert Klickovich, M.D"
          />
        </label>

        <label style={labelStyle}>
          Provider:
          <select
            name="provider"
            style={inputStyle}
            value={formData.provider}
            onChange={onChange}
          >
            <option value="">-- Select Provider --</option>
            <option value="Cortney Lacefield, APRN">
              Cortney Lacefield, APRN
            </option>
            <option value="Lauren Ellis, APRN">Lauren Ellis, APRN</option>
            <option value="Taja Elder, APRN">Taja Elder, APRN</option>
            <option value="Robert Klickovich, M.D">
              Robert Klickovich, M.D
            </option>
          </select>
        </label>

        <label style={labelStyle}>
          Referring Physician:
          <input
            name="referringPhysician"
            style={inputStyle}
            value={formData.referringPhysician}
            onChange={onChange}
          />
        </label>

        <label style={labelStyle}>
          Insurance:
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select
              name="insurance"
              style={inputStyle}
              value={formData.insurance}
              onChange={onChange}
            >
              <option value="">-- Select Insurance --</option>
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
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <button
              type="button"
              style={buttonStyle}
              onClick={() =>
                setFormData((prev) => ({ ...prev, insurance: "" }))
              }
            >
              Clear
            </button>
          </div>
        </label>

        <label style={labelStyle}>
          Location:
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select
              name="location"
              style={inputStyle}
              value={formData.location}
              onChange={onChange}
            >
              <option value="">-- Select Location --</option>
              <option value="Louisville">Louisville</option>
              <option value="E-town">E-town</option>
            </select>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setFormData((prev) => ({ ...prev, location: "" }))}
            >
              Clear
            </button>
          </div>
        </label>

        <label style={labelStyle}>
  CMA:
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <select
      name="cma"
      style={inputStyle}
      value={formData.cma}
      onChange={onChange}
    >
      <option value="">-- Select CMA --</option>
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
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <button
      type="button"
      style={buttonStyle}
      onClick={() => setFormData((prev) => ({ ...prev, cma: "" }))}
    >
      Clear
    </button>
  </div>
</label>


        <label style={labelStyle}>
          Room #:
          <input
            name="roomNumber"
            style={inputStyle}
            value={formData.roomNumber}
            onChange={onChange}
          />
        </label>
      </div>
    </form>
  );
};

export default Demography;
