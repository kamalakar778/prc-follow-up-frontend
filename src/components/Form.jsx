import React, { useState } from "react";
import Demography from "./Demography";
import ReviewOfSystems from "./ReviewOfSystems";
import HistoryOfPresentIllness from "./HistoryOfPresentIllness";
import CharacteristicsOfPain from "./CharacteristicsOfPain";
import ChiefComplaint from "./ChiefComplaint";
import ComplianceWithTreatmentPlan from "./ComplianceWithTreatmentPlan";
import PhysicalExamination from "./PhysicalExamination";
import EstablishedComplaints from "./EstablishedComplaints";
import AssessmeCodes from "./AssessmeCodes";
import FollowupPlan from "./FollowupPlan";
import MedicationManagement from "./MedicationManagement";
import SignatureLine from "./SignatureLine";
import InjectionsList from "./InjectionList";
import EarlierFollowups from "./EarlierFollowups";
import "./Form.css";

const Form = () => {
  const [fileName, setFileName] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [earlierFollowupsText, setEarlierFollowupsText] = useState("");
  const [establishedComplaintsLines, setEstablishedComplaintsLines] = useState(
    []
  );
  const [signatureData, setSignatureData] = useState("");
  const [docSections, setDocSections] = useState({
    section1: "",
    section2: "",
    section3: "",
    section4: ""
  });

  const [formData, setFormData] = useState({
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
    // sectionTwo: "",
    docSections: [],
    complaintsData: {
      cervical: { enabled: true, side: "bilaterally" },
      thoracic: { enabled: true, side: "bilaterally" },
      lumbar: { enabled: true, side: "bilaterally" },
      hip: { enabled: true, side: "bilaterally" },
      patella: { enabled: true, side: "bilaterally" }
    },
    signature: signatureData
  });

  const [followupData, setFollowupData] = useState({
    nonComplianceSeverity: "",
    actionTaken: "",
    willOrderUDT: false,
    unexpectedUTox: false,
    pillCount: false,
    ptEval: "",
    imaging: "",
    xrayOf: "",
    behavioralFocus: "",
    referral: ""
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

  const handleFollowupChange = (field, value) => {
    setFollowupData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignatureChange = (data) => {
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
      // sectionTwo: examData.sectionTwo || prev.sectionTwo
    }));
  };

  const handleFileNameChange = (e) => setFileName(e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewChange = ({ allergic, neuro }) => {
    const allergicData = allergic.reduce((acc, cur, i) => {
      acc[`allergic_symptom_${i + 1}`] = cur;
      return acc;
    }, {});
    const neuroData = neuro.reduce((acc, cur, i) => {
      acc[`neurological_symptom_${i + 1}`] = cur;
      return acc;
    }, {});
    setFormData((prev) => ({ ...prev, ...allergicData, ...neuroData }));
  };

  const handlePainUpdate = (updatedPainData) => {
    setFormData((prev) => ({ ...prev, ...updatedPainData }));
  };

  const handleReset = () => {
    setFileName("");
    setSelected(new Set());
    setChiefComplaint({ finalText: "", inputValues: {}, addedLines: [] });
    setEstablishedComplaintsLines([]);
    setFollowupData({
      nonComplianceSeverity: "",
      actionTaken: "",
      willOrderUDT: false,
      unexpectedUTox: false,
      pillCount: false,
      ptEval: "",
      imaging: "",
      xrayOf: "",
      behavioralFocus: "",
      referral: ""
    });
    setFormData((prev) => ({
      ...prev,
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
      // sectionTwo: "",
      complaintsData: {
        cervical: { enabled: true, side: "bilaterally" },
        thoracic: { enabled: true, side: "bilaterally" },
        lumbar: { enabled: true, side: "bilaterally" },
        hip: { enabled: true, side: "bilaterally" },
        patella: { enabled: true, side: "bilaterally" }
      }
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    const complaintsSummary = getComplaintsSummary();
    const establishedComplaintsText =
      establishedComplaintsLines.length > 0
        ? establishedComplaintsLines.join("\n")
        : "";
    const assessmentCodesFinalList = Array.from(selected).join("\n");

    const payload = {
      fileName,
      ...formData,
      chiefComplaint: chiefComplaint.finalText,
      complaintsSummary,
      earlier_followups: earlierFollowupsText,
      establishedComplaintsText,
      assessment_codes: assessmentCodesFinalList,
      ...followupData,
      signature: signatureData
    };

    try {
      const response = await fetch("http://localhost:8000/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors" // explicitly allow CORS if needed
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.detail || "Failed to generate document");
      }

      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute(
      //   "download",
      //   fileName ? `${fileName}.docx` : "follow_up.docx"
      // );
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      // window.URL.revokeObjectURL(url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // a.download = fileName ? `${fileName}.docx` : "follow_up.docx";
      const nameToUse = fileName || formData.patientName || "follow_up";
      a.download = `${nameToUse.replace(/\s+/g, "_")}.docx`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating or downloading DOCX:", error);
    }

    // try {
    //   const response = await fetch("http://localhost:5000/generate-doc", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(payload)
    //   });

    //   if (!response.ok) throw new Error("Network response was not ok");

    //   const blob = await response.blob();
    //   const url = window.URL.createObjectURL(blob);
    //   const a = document.createElement("a");
    //   a.href = url;
    //   a.download = fileName ? `${fileName}.docx` : "follow_up.docx";
    //   document.body.appendChild(a);
    //   a.click();
    //   a.remove();
    //   window.URL.revokeObjectURL(url);
    // } catch (error) {
    //   console.error("Error generating document:", error);
    // }
  };

  return (
    <>
      <div className="form-section">
        <h2 className="section-title">FOLLOW-UP VISIT via In-Office</h2>

        {/* <h2 className="section-title">Demography</h2> */}
        <Demography
          fileName={fileName}
          formData={formData}
          onFileNameChange={handleFileNameChange}
          onChange={handleChange}
          onReset={handleReset}
          onSubmit={handleSubmit}
          setFormData={setFormData}
        />
      </div>
      <div className="form-section">
        <h2 className="section-title">Chief Complaint</h2>
        <ChiefComplaint initialValues={{}} onChange={setChiefComplaint} />
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

        <ReviewOfSystems onReviewChange={handleReviewChange} />
      </div>
      <div className="form-section">
        <h2 className="section-title">
          Patient Compliance with Treatment Plan
        </h2>
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
        {/* <EarlierFollowups onChange={(text) => setEarlierFollowupsText(text)} /> */}
      </div>
      <div className="form-section">
        <h2 className="section-title">Established Complaints</h2>

        <EstablishedComplaints
          lines={establishedComplaintsLines}
          setLines={setEstablishedComplaintsLines}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Follow-Up Plan</h2>

        {/* ✅ Added FollowupPlan Section */}
        <FollowupPlan
          followupData={followupData}
          onChange={handleFollowupChange}
        />
      </div>

      <div className="form-section">
        <h2 className="section-title">Medication Management</h2>

        <MedicationManagement />
      </div>
      <div className="form-section">
        <h2 className="section-title">Injections List</h2>
        <InjectionsList />
      </div>
      <div className="form-section">
        <h2 className="section-title">Assessme Codes</h2>
        <AssessmeCodes selected={selected} setSelected={setSelected} />
      </div>
      <div className="form-section">
        <h2 className="section-title">Signature Line</h2>
        {/* <SignatureLine onChange={(data) => setDocSections(data)} /> */}

        <SignatureLine onChange={handleSignatureChange} />
      </div>

      {/* .docx Placeholder Output Section */}
      {/* <div className="mt-8">
        <h2 className="font-semibold text-lg mb-2">📄 .docx Placeholder Output:</h2>
        <p className="mb-2 text-gray-600">
          Use this content in your template at <code>{{`{{ earlier_followups }}`}}</code>
        </p>
        <textarea
          value={earlierFollowupsText}
          readOnly
          rows={15}
          className="w-full border p-3 font-mono"
        />
      </div> */}
    </>
  );
};

export default Form;
