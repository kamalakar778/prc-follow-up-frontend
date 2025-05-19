import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Basic styles
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
  padding: "0.5rem 1rem",
  marginLeft: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
  cursor: "pointer",
  backgroundColor: "#3498db",
  color: "white"
};

const flexRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  marginBottom: "1rem"
};

const errorStyle = {
  borderColor: "red"
};

const errorTextStyle = {
  color: "red",
  fontSize: "0.8rem",
  marginTop: "0.25rem"
};

// Yup Schema
const schema = yup.object().shape({
  fileName: yup.string().required("File Name is required"),
  patientName: yup.string().required("Patient Name is required"),
  dob: yup
    .string()
    .required("Date of Birth is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  dateOfEvaluation: yup
    .string()
    .required("Evaluation Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  dateOfDictation: yup
    .string()
    .required("Dictation Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  physician: yup.string().required("Physician is required"),
  provider: yup.string().required("Provider is required")
});

const Demography = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fileName: "",
      patientName: "",
      dob: "",
      dateOfEvaluation: "",
      dateOfDictation: "",
      physician: "Robert Klickovich, M.D",
      provider: "",
      referringPhysician: "",
      roomNumber: "",
      insurance: "",
      location: "",
      cma: ""
    }
  });

  const watchFields = watch();
  const fileName = watch("fileName");

  const handleReset = () => {
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: 800, margin: "auto" }}
    >
      <div style={flexRow}>
        <label style={{ ...labelStyle, flex: 1 }}>
          File Name:
          <input
            type="text"
            style={inputStyle}
            {...register("fileName")}
            value={fileName || watchFields.patientName}
            onChange={(e) => setValue("fileName", e.target.value)}
          />
          {errors.provider && (
            <div style={errorTextStyle}>{errors.fileName.message}</div>
          )}
        </label>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <button type="submit" style={buttonStyle}>
            Generate Document
          </button>
          <button type="button" onClick={handleReset} style={buttonStyle}>
            Reset
          </button>
        </div>
      </div>

      <div style={sectionStyle}>
        {[
          { label: "PATIENT NAME:", name: "patientName" },
          { label: "DATE OF BIRTH:", name: "dob" },
          { label: "DATE OF EVALUATION:", name: "dateOfEvaluation" },
          { label: "DATE OF DICTATION:", name: "dateOfDictation" },
          {
            label: "PHYSICIAN:",
            name: "physician",
            placeholder: "Robert Klickovich, M.D"
          },
          { label: "Referring Physician:", name: "referringPhysician" },
          { label: "Room #:", name: "roomNumber" }
        ].map(({ label, name, placeholder }) => (
          <label key={name} style={labelStyle}>
            {label}
            <input
              name={name}
              placeholder={placeholder}
              style={{ ...inputStyle, ...(errors[name] && errorStyle) }}
              {...register(name)}
            />
            {errors[name] && (
              <div style={errorTextStyle}>{errors[name].message}</div>
            )}
          </label>
        ))}

        <label style={labelStyle}>
          Provider:
          <select
            name="provider"
            style={{ ...inputStyle, ...(errors.provider && errorStyle) }}
            {...register("provider")}
          >
            <option value="">-- Select Provider --</option>
            {[
              "Cortney Lacefield, APRN",
              "Lauren Ellis, APRN",
              "Taja Elder, APRN",
              "Robert Klickovich, M.D"
            ].map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
          {errors.provider && (
            <div style={errorTextStyle}>{errors.provider.message}</div>
          )}
        </label>

        <label style={labelStyle}>
          Insurance:
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select style={inputStyle} {...register("insurance")}>
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
              ].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setValue("insurance", "")}
            >
              Clear
            </button>
          </div>
        </label>

        <label style={labelStyle}>
          Location:
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select style={inputStyle} {...register("location")}>
              <option value="">-- Select Location --</option>
              <option value="Louisville">Louisville</option>
              <option value="E-town">E-town</option>
            </select>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setValue("location", "")}
            >
              Clear
            </button>
          </div>
        </label>

        <label style={labelStyle}>
          CMA:
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <select style={inputStyle} {...register("cma")}>
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
              ].map((cma) => (
                <option key={cma} value={cma}>
                  {cma}
                </option>
              ))}
            </select>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setValue("cma", "")}
            >
              Clear
            </button>
          </div>
        </label>
      </div>
    </form>
  );
};

export default Demography;
