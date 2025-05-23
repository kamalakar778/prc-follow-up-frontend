import React, { useState } from "react";
import Demography from "../Demography";
import ReviewOfSystems from "../ReviewOfSystems";
import HistoryOfPresentIllness from "../HistoryOfPresentIllness";
import CharacteristicsOfPain from "../CharacteristicsOfPain";
import ChiefComplaint from "../ChiefComplaint";
import ComplianceWithTreatmentPlan from "../ComplianceWithTreatmentPlan";
import PhysicalExamination from "../PhysicalExamination";
import EstablishedComplaints from "../EstablishedComplaints";
import AssessmentCodes from "../AssessmentCodes";
import FollowupPlan from "../FollowupPlan";
import MedicationManagement from "../MedicationManagement";
import SignatureLine from "../SignatureLine";
import InjectionsList from "../InjectionsList";
import EarlierFollowups from "../EarlierFollowups";
import "./Form.css";

const Form = () => {
  const [fileName, setFileName] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [earlierFollowupsText, setEarlierFollowupsText] = useState("");
  const [medications, setMedications] = useState([]);
  const [signatureData, setSignatureData] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    dob: "",
    dateOfEvaluation: "",
    dateOfDictation: "",
    physician: "Robert Klickovich, M.D",
    provider: "",
    referringPhysician: "",
    insurance1: "",
    insurance1Other: "",
    insurance2: "",
    insurance2Other: "",
    location: "",
    CMA: "",
    CMAInput: "",
    roomNumber: "",
    allergic_symptom_1: "",
    allergic_symptom_2: "",
    allergic_symptom_3: "",
    allergic_symptom_4: "",
    allergic_symptom_5: "",
    neurological_symptom_1: "",
    neurological_symptom_2: "",
    neurological_symptom_3: "",
    neurological_symptom_4: "",
    neurological_symptom_5: "",
    temporally: "",
    numericScale: "",
    workingStatus: "",
    comments: "",
    qualitatively: "",
    intervalComments: "",
    complianceComments: "",
    establishedComplaints: [],
    vitals: "",
    generalAppearance: "",
    orientation: "",
    moodAffect: "",
    gait: "",
    stationStance: "",
    cardiovascular: "",
    lymphadenopathy: "",
    coordinationBalance: "",
    motorFunction: "",
    followUpPlan: "",
    medicationOutput: [],
    complaintsData: {
      cervical: { enabled: true, side: "bilaterally" },
      thoracic: { enabled: true, side: "bilaterally" },
      lumbar: { enabled: true, side: "bilaterally" },
      hip: { enabled: true, side: "bilaterally" },
      patella: { enabled: true, side: "bilaterally" }
    },
    nonComplianceSeverity: "",
    actionTaken: "",
    udtStatus: "",
    willOrderUDT: false,
    unexpectedUTox: false,
    pillCount: false,
    ptEval: "",
    imaging: "",
    xrayOf: "",
    behavioralFocus: "",
    referral: "",
    injections: "",
    INJECTION_SUMMARY: "",
    otherPlans: "",
    formattedLines: "",
    followUpAppointment: "",
    signatureLine: "",
    dateTranscribed: ""
  });

  const [chiefComplaint, setChiefComplaint] = useState({
    finalText: "",
    inputValues: {},
    addedLines: []
  });

  const getComplaintsSummary = () => {
    const complaints = formData.complaintsData;
    if (!complaints) return "";
    return Object.entries(complaints)
      .map(
        ([region, { enabled, side }]) =>
          `${region.charAt(0).toUpperCase() + region.slice(1)}: ${
            enabled ? "Yes" : "No"
          } (Side: ${side})`
      )
      .join("; ");
  };

  const handleFollowupChange = (formattedText) => {
    setFormData((prev) => ({
      ...prev,
      followUpPlan: formattedText
    }));
  };

  const handleEstablishedComplaintsChange = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      establishedComplaints: newData
    }));
  };

  const handleSignatureChange = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setSignatureData(data);
  };

  const handlePhysicalExamChange = (examData) => {
    setFormData((prev) => ({
      ...prev,
      vitals: examData.vitals || prev.vitals,
      generalAppearance: examData.generalAppearance || prev.generalAppearance,
      orientation: examData.orientation || prev.orientation,
      moodAffect: examData.moodAffect || prev.moodAffect,
      gait: examData.gait || prev.gait,
      stationStance: examData.stationStance || prev.stationStance,
      cardiovascular: examData.cardiovascular || prev.cardiovascular,
      lymphadenopathy: examData.lymphadenopathy || prev.lymphadenopathy,
      coordinationBalance:
        examData.coordinationBalance || prev.coordinationBalance,
      motorFunction: examData.motorFunction || prev.motorFunction
    }));
  };

  const handleFileNameChange = (newFileName) => {
    setFileName(newFileName);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePainUpdate = (updatedPainData) => {
    setFormData((prev) => ({ ...prev, ...updatedPainData }));
  };

  const handleInjectionChange = ({ injections, INJECTION_SUMMARY }) => {
    setFormData((prev) => ({
      ...prev,
      injections,
      INJECTION_SUMMARY
    }));
  };

  const handleReset = () => {
    setFileName("");
    setSelected(new Set());
    setChiefComplaint({ finalText: "", inputValues: {}, addedLines: [] });
    setFormData((prev) => ({
      ...prev,
      patientName: "",
      dob: "",
      dateOfEvaluation: "",
      dateOfDictation: "",
      provider: "",
      referringPhysician: "",
      insurance1: "",
      insurance1Other: "",
      insurance2: "",
      insurance2Other: "",
      location: "",
      CMA: "",
      CMAInput: "",
      roomNumber: "",
      allergic_symptom_1: "",
      allergic_symptom_2: "",
      allergic_symptom_3: "",
      allergic_symptom_4: "",
      allergic_symptom_5: "",
      neurological_symptom_1: "",
      neurological_symptom_2: "",
      neurological_symptom_3: "",
      neurological_symptom_4: "",
      neurological_symptom_5: "",
      temporally: "",
      numericScale: "",
      workingStatus: "",
      comments: "",
      qualitatively: "",
      intervalComments: "",
      complianceComments: "",
      establishedComplaints: [],
      vitals: "",
      generalAppearance: "",
      orientation: "",
      moodAffect: "",
      gait: "",
      stationStance: "",
      cardiovascular: "",
      lymphadenopathy: "",
      coordinationBalance: "",
      motorFunction: "",
      followUpPlan: "",
      medicationOutput: [],
      complaintsData: {
        cervical: { enabled: true, side: "bilaterally" },
        thoracic: { enabled: true, side: "bilaterally" },
        lumbar: { enabled: true, side: "bilaterally" },
        hip: { enabled: true, side: "bilaterally" },
        patella: { enabled: true, side: "bilaterally" }
      },
      nonComplianceSeverity: "",
      actionTaken: "",
      udtStatus: "",
      willOrderUDT: false,
      unexpectedUTox: false,
      pillCount: false,
      ptEval: "",
      imaging: "",
      xrayOf: "",
      behavioralFocus: "",
      referral: "",
      injections: "",
      INJECTION_SUMMARY: "",
      otherPlans: "",
      formattedLines: "",
      followUpAppointment: "",
      signatureLine: "",
      dateTranscribed: ""
    }));
  };

  const handleSubmit = async () => {
    if (!fileName.trim() || !formData.patientName?.trim()) {
      alert("File name and patient name are required.");
      return;
    }

    const insuranceFinal1 =
      formData.insurance1Input?.trim() || formData.insurance1 || "";
    const insuranceFinal2 =
      formData.insurance2Input?.trim() || formData.insurance2 || "";
    const finalCMA = formData.CMAInput?.trim() || formData.CMA || "";

    const complaintsSummary = getComplaintsSummary();
    const assessmentCodesFinalList = Array.from(selected || []).join("\n");

    const cleanString = (v) => (typeof v === "string" ? v.trim() : v || "");

    const payload = {
      fileName: cleanString(fileName),
      patientName: cleanString(formData.patientName),
      insurance1: insuranceFinal1,
      insurance2: insuranceFinal2,
      CMA: finalCMA,
      chiefComplaint: cleanString(chiefComplaint?.finalText),
      complaintsSummary,
      establishedComplaints: formData.establishedComplaints,
      assessment_codes: assessmentCodesFinalList,
      INJECTION_SUMMARY: formData?.INJECTION_SUMMARY || "",
      medicationOutput: Array.isArray(formData.medicationOutput)
        ? formData.medicationOutput.join("\n")
        : cleanString(formData.medicationOutput),
      followUpPlan: cleanString(formData.followUpPlan),
      signature: {
        ...signatureData,
        formattedLines: signatureData?.formattedLines || "",
        followUpAppointment: signatureData?.followUpAppointment || "",
        signatureLine: signatureData?.signatureLine || "",
        dateTranscribed: formData?.dateTranscribed || ""
      },
      udtStatus: formData.udtStatus,
      willNotOrderUDT: !!formData.willNotOrderUDT,
      nonComplianceSeverity: cleanString(formData?.nonComplianceSeverity),
      actionTaken: cleanString(formData?.actionTaken),
      unexpectedUTox: !!formData?.unexpectedUTox,
      pillCount: !!formData?.pillCount,
      ptEval: cleanString(formData?.ptEval),
      imaging: cleanString(formData?.imaging),
      xrayOf: cleanString(formData?.xrayOf),
      behavioralFocus: cleanString(formData?.behavioralFocus),
      referral: cleanString(formData?.referral),
      earlier_followups: cleanString(earlierFollowupsText),
      intervalComments: formData.intervalComments,
      complianceComments: formData.complianceComments
    };

    try {
      const response = await fetch("http://localhost:8000/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors"
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const match = contentDisposition?.match(/filename="?([^"]+)"?/i);
      const extractedFilename =
        match?.[1] ||
        (fileName || formData.patientName || "follow_up") + ".docx";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", extractedFilename.replace(/\s+/g, "_"));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating or downloading DOCX:", error);
    }
  };

  return (
    <>
      <div className="form-section">
        <h2 className="section-title">FOLLOW-UP VISIT via In-Office</h2>
        <Demography
          fileName={fileName}
          onFileNameChange={handleFileNameChange}
          formData={formData}
          setFormData={setFormData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Chief Complaint</h2>
        <ChiefComplaint initialValues={{}} onChange={setChiefComplaint} />
      </div>

      <div className="form-section">
        <h2 className="section-title">History Of Present Illness</h2>
        <HistoryOfPresentIllness />
      </div>

      <div className="form-section">
        <h2 className="section-title">Characteristics Of Pain Include:</h2>
        <CharacteristicsOfPain
          formData={{
            temporally: formData.temporally,
            numericScale: formData.numericScale,
            workingStatus: formData.workingStatus,
            comments: formData.comments,
            qualitatively: formData.qualitatively
          }}
          onUpdate={handlePainUpdate}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Review Of Systems</h2>
        <ReviewOfSystems
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Patient Compliance with Treatment Plan</h2>
        <ComplianceWithTreatmentPlan
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Physical Examination</h2>
        <PhysicalExamination onChange={handlePhysicalExamChange} />
      </div>

      <div className="form-section">
        <h2 className="section-title">Earlier Followups</h2>
        <EarlierFollowups onDataChange={setEarlierFollowupsText} />
      </div>

      <div className="form-section">
        <h2 className="section-title">Established Complaints</h2>
        <EstablishedComplaints onChange={handleEstablishedComplaintsChange} />
      </div>

      <div className="form-section">
        <h2 className="section-title">Assessment Codes</h2>
        <AssessmentCodes selected={selected} setSelected={setSelected} />
      </div>

      <div className="form-section">
        <h2 className="section-title">Follow-Up Plan</h2>
        <FollowupPlan setFormData={setFormData} />
      </div>

      <div className="form-section">
        <h2 className="section-title">Medication Management</h2>
        <MedicationManagement
          medications={medications}
          setMedications={setMedications}
          onOutputChange={(outputArray) =>
            setFormData((prev) => ({
              ...prev,
              medicationOutput: outputArray
            }))
          }
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Injections List</h2>
        <InjectionsList onInjectionChange={handleInjectionChange} />
      </div>

      <div className="form-section">
        <h2 className="section-title">Signature Line</h2>
        <SignatureLine onChange={handleSignatureChange} />
      </div>
    </>
  );
};

export default Form;
