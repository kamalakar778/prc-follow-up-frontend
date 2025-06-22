import React, { useState, useEffect } from "react";
import Demography from "./Demography";
import ReviewOfSystems from "./ReviewOfSystems";
import HistoryOfPresentIllness from "./HistoryOfPresentIllness";
import CharacteristicsOfPain from "./CharacteristicsOfPain";
import ChiefComplaint from "./ChiefComplaint";
import ComplianceWithTreatmentPlan from "./ComplianceWithTreatmentPlan";
import PhysicalExamination from "./PhysicalExamination";
import EstablishedComplaints from "./EstablishedComplaints";
import AssessmentCodes from "./AssessmentCodes";
import FollowupPlan from "./FollowupPlan";
import MedicationManagement from "./MedicationManagement";
import SignatureLine from "./SignatureLine";
import InjectionsList from "./InjectionsList";
import EarlierFollowups from "./EarlierFollowups";
// import CustomAutoComplete from "./components/CustomAutoComplete";
import ShortcutSection from "./ShortcutSection";
import { MedicationProvider } from "./context/MedicationContext";
import SidebarNav from "./Home/SidebarNav";

import "./Form.css";

const Form = ({ onChange }) => {
  const [fileName, setFileName] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [earlierFollowupsText, setEarlierFollowupsText] = useState("");
  const [signatureData, setSignatureData] = useState("");
  const [selectedCodes, setSelectedCodes] = useState([]); // Must be an array
  const [dateOfEvaluation, setDateOfEvaluation] = useState("");
  const [autoCompleteData, setAutoCompleteData] = useState({
    item1: "",
    item2: ""
  });

  const [painSelected, setPainSelected] = useState(new Set());
  const [abbrSelected, setAbbrSelected] = useState(new Set());
  const [hasNowSchedule, setHasNowSchedule] = useState(false);
  const [followUpValue, setFollowUpValue] = useState("Four weeks");
  const [dateInputISO, setDateInputISO] = useState("");

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      followUpAppointment: "Four weeks"
    }));
  }, []);
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      followUpAppointment: followUpValue
    }));
  }, [followUpValue]);

  const painLocation = {
    burning: "Burning",
    stabbing: "Stabbing",
    dull: "Dull",
  };

  const abbreviations = {
    PT: "Physical Therapy",
    OT: "Occupational Therapy",
    ROM: "Range of Motion",
  };

  const [formData, setFormData] = useState({
    patientName: "________________",
    dob: "________________",
    dateOfEvaluation: "",
    dateOfDictation: "________________",
    physician: "Robert Klickovich, M.D",
    provider: "________________",
    referringPhysician: "",
    insurance1Input: "",
    insurance1Other: "",
    insurance2Input: "",
    insurance2Other: "",
    location: "Louisville",
    CMA: "",
    CMAInput: "",
    insuranceList: [],
CMA: [],
insuranceListCustomInput: "",  // for input field
CMACustomInput: "",  
    roomNumber: "",
    allergic_symptom_1: "No",
    allergic_symptom_2: "No",
    allergic_symptom_3: "No",
    allergic_symptom_4: "No",
    allergic_symptom_5: "No",
    neurological_symptom_1: "No",
    neurological_symptom_2: "No",
    neurological_symptom_3: "No",
    neurological_symptom_4: "No",
    neurological_symptom_5: "No",
    pain: {
      temporally: "",
      qualitativePain: "________________",
      numericScaleFormatted: "________________",
      workingStatus: "",
      comments: ""
    },
    numericScale: "",
    intervalComments: "",
    historyOfPresentIllness: {
      pain_illnessLevel: "The same",
      activity_illnessLevel: "The same",
      social_illnessLevel: "The same",
      job_illnessLevel: "The same",
      sleep_illnessLevel: "The same"
    },

    complianceComments: "",
    vitals: "", // Physical Examination
    generalAppearance: "",
    orientation: "",
    moodAffect: "",
    gait: "",
    stationStance: "",
    cardiovascular: "",
    lymphadenopathy: "",
    coordinationBalance: "",
    motorFunction: "",
    establishedComplaints: [], // Established Complaints lumbar cervical thoracic
    // followUpPlan: "",
    medication_management: "", // Medication Management
    nonComplianceSeverity: "",
    actionTaken: "",
    udtStatus: "",
    willOrderUDT: false,
    unexpectedUTox: "",
    pillCount: "",
    ptEval: "",
    imaging: "",
    xrayOf: "",
    behavioralFocus: "",
    referral: "",
    injections: "",
    INJECTION_SUMMARY: "",
    formattedLines: "",
    followUpAppointment: "",
    signature: {
      otherPlans: "",
      formattedLines: "",
      followUpAppointment: "",
      signatureLine: "",
      dateTranscribed: ""
    },
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
          `${region.charAt(0).toUpperCase() + region.slice(1)}: ${enabled ? "Yes" : "No"
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

  // const handleCharacteristicPainData = (updatedData) => {
  //   setFormData((prev) => ({ ...prev, ...updatedData }));
  // };

  const handleReviewChange = (updatedFields) => {
    setFormData((prev) => ({ ...prev, ...updatedFields }));
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    // If called with event object (normal HTML input)
    if (e?.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      // If called with object directly (like from SignatureLine)
      setFormData((prev) => ({ ...prev, ...e }));
    }
  };
  const handleDemographySubmit = async (values, actions) => {

  };

  const handlePainUpdate = (updatedPainSection) => {
    setFormData((prev) => ({
      ...prev,
      pain: {
        ...prev.pain,
        ...updatedPainSection.pain // assuming `CharacteristicsOfPain` sends { pain: { ... } }
      }
    }));
  };
  const handleSectionUpdate = (sectionUpdate) => {
    setFormData((prev) => ({
      ...prev,
      ...sectionUpdate,
      pain: {
        ...prev.pain,
        ...sectionUpdate.pain
      }
    }));
  };

  const handleInjectionChange = ({ injections, INJECTION_SUMMARY }) => {
    setFormData((prev) => ({
      ...prev,
      injections,
      INJECTION_SUMMARY
    }));
  };

  const formattedAssessmentCodes = selectedCodes
    .sort((a, b) => a.index - b.index) // Ensure correct order
    .map((item) => `\t${item.index}. ${item.label}`)
    .join("\n");

  if (!formData.dateOfEvaluation?.trim() && dateInputISO) {
    const [yyyy, mm, dd] = dateInputISO.split("-");
    const fallbackFormatted = `${mm}/${dd}/${yyyy}`;
    formData.dateOfEvaluation = fallbackFormatted;
    setFormData((prev) => ({ ...prev, dateOfEvaluation: fallbackFormatted }));
  }

  const handleSubmit = async () => {
    // if (!fileName.trim() || !formData.patientName?.trim()) {
    //   alert("File name and patient name are required.");
    //   return;
    // }
    let finalDateOfEval = formData.dateOfEvaluation;

    // const insuranceFinal1 =
    //   formData.insurance1Input?.trim() ||
    //   formData.insurance1 ||
    //   formData.insurance1Other ||
    //   "";
    // const insuranceFinal2 =
    //   formData.insurance2Input?.trim() ||
    //   formData.insurance2 ||
    //   formData.insurance2Other ||
    //   "";
    // const finalCMA = formData.CMAInput?.trim() || formData.CMA || "";

    const complaintsSummary = getComplaintsSummary();
    // const assessmentCodesFinalList = Array.from(selected || []).join("\n");

    const cleanString = (v) => (typeof v === "string" ? v.trim() : v || "");

    // console.log("Form Data Before Payload:", formData);
    console.log("Form Data Before Payload:", formData);
    const getOrNoValue = (val) => val?.trim() || "No Value";

    const isPlaceholder = (val) =>
      !val || val.trim() === "" || /^[_/]+$/.test(val);

    if (isPlaceholder(formData.dateOfEvaluation) && dateInputISO) {
      const [yyyy, mm, dd] = dateInputISO.split("-");
      const fallbackFormatted = `${mm}/${dd}/${yyyy}`;
      setFormData((prev) => ({
        ...prev,
        dateOfEvaluation: fallbackFormatted,
      }));
    }



    // const payload = {
    //   ...formData,
    //   fileName: cleanString(fileName),
    //   patientName: cleanString(formData.patientName),
    //   dob: cleanString(formData.dob),
    //   dateOfEvaluation: cleanString(finalDateOfEval),
    //   // dateOfEvaluation: cleanString(formData.dateOfEvaluation),
    //   provider: cleanString(formData.provider),
    //   referringPhysician: cleanString(formData.referringPhysician) || capitalizedPhysician,
    //   insurance1: insuranceFinal1,
    //   insurance2: insuranceFinal2,
    //   location: cleanString(formData.location),
    //   CMA: finalCMA,
    //   roomNumber: cleanString(formData.roomNumber),
    //   chiefComplaint: cleanString(chiefComplaint?.finalText),
    //   complaintsSummary,

    //   pain_illnessLevel: getOrNoValue(
    //     formData.historyOfPresentIllness.pain_illnessLevel
    //   ),
    //   activity_illnessLevel: getOrNoValue(
    //     formData.historyOfPresentIllness.activity_illnessLevel
    //   ),
    //   social_illnessLevel: getOrNoValue(
    //     formData.historyOfPresentIllness.social_illnessLevel
    //   ),
    //   job_illnessLevel: getOrNoValue(
    //     formData.historyOfPresentIllness.job_illnessLevel
    //   ),
    //   sleep_illnessLevel: getOrNoValue(
    //     formData.historyOfPresentIllness.sleep_illnessLevel
    //   ),

    //   // Characteristics of Pain Include
    //   temporally: formData.pain?.temporally || "",
    //   qualitativePain: formData.pain?.qualitativePain || "",
    //   // numericScaleFormatted: pain.numericScaleFormatted,
    //   numericScaleFormatted: formData.pain.numericScaleFormatted,
    //   workingStatus: formData.pain?.workingStatus || "",
    //   comments: formData.pain?.comments || "",

    //   // REVIEW OF SYSTEMS:
    //   allergic_symptom_1: formData.formatted_allergic_1,
    //   allergic_symptom_2: formData.formatted_allergic_2,
    //   allergic_symptom_3: formData.formatted_allergic_3,
    //   allergic_symptom_4: formData.formatted_allergic_4,
    //   allergic_symptom_5: formData.formatted_allergic_5,
    //   neurological_symptom_1: formData.formatted_neuro_1,
    //   neurological_symptom_2: formData.formatted_neuro_2,
    //   neurological_symptom_3: formData.formatted_neuro_3,
    //   neurological_symptom_4: formData.formatted_neuro_4,
    //   neurological_symptom_5: formData.formatted_neuro_5,

    //   // Compliance with Treatment Plan
    //   complianceComments: formData.complianceComments,
    //   intervalComments: formData.intervalComments,
    //   // complianceComments: formData.complianceComments,

    //   // Physical Examination Default Data
    //   vitals: formData.vitals,
    //   generalAppearance: formData.generalAppearance,
    //   orientation: formData.orientation,
    //   moodAffect: formData.moodAffect,
    //   gait: formData.gait,
    //   stationStance: formData.stationStance,
    //   cardiovascular: formData.cardiovascular,
    //   lymphadenopathy: formData.lymphadenopathy,
    //   coordinationBalance: formData.coordinationBalance,
    //   motorFunction: formData.motorFunction,

    //   earlier_followups: cleanString(earlierFollowupsText || ""),

    //   establishedComplaints: formData.establishedComplaints,

    //   assessment_codes: formattedAssessmentCodes,
    //   // assessment_codes: assessmentCodesFinalList,

    //   // followUpPlan: cleanString(formData.followUpPlan),
    //   nonComplianceSeverity: cleanString(formData?.nonComplianceSeverity),
    //   actionTaken: formData.actionTaken,
    //   udtStatus: formData.udtStatus,
    //   // willNotOrderUDT: !!formData.willNotOrderUDT,
    //   // udtStatus: formData.udtStatusFormatted,
    //   unexpectedUTox: formData.formattedUnexpectedUTox,
    //   pillCount: formData.formattedPillCount,
    //   ptEval: formData.formattedPtEval,
    //   imaging: formData.formattedImaging,
    //   xrayOf: formData.formattedXrayOf,
    //   behavioralFocus: formData.formattedBehavioralFocus,
    //   referral: formData.formattedReferral,

    //   medication_management: formData.medication_management,

    //   INJECTION_SUMMARY: formData?.INJECTION_SUMMARY
    //     ? `\n\n${formData?.INJECTION_SUMMARY}`
    //     : "",
    //   // medicationOutput: Array.isArray(formData.medicationOutput)
    //   //   ? formData.medicationOutput.join("\n")
    //   //   : cleanString(formData.medicationOutput),
    //   signature: {
    //     ...signatureData,
    //     otherPlans: signatureData.otherPlans
    //       ? `\n\n${signatureData.otherPlans}`
    //       : "",
    //     // otherPlans: (signatureData.otherPlans?.lines || []).join("\n"),
    //     formattedLines: signatureData?.formattedLines
    //       ? `\n${signatureData?.formattedLines}`
    //       : "",
    //     followUpAppointment: signatureData?.followUpAppointment || "",
    //     signatureLine: signatureData?.signatureLine || "",
    //     dateTranscribed: formData?.dateTranscribed || "",

    //     autocompleteItem1: autoCompleteData.item1,
    //     autocompleteItem2: autoCompleteData.item2
    //   }
    // };
    const selectedInsurances = formData.insuranceList || [];
    const selectedCMA = formData.CMA || [];

    const insuranceFinal1 = selectedInsurances[0] || "";
    const insuranceFinal2 = selectedInsurances[1] || "";
    const finalCMA = selectedCMA.join(", "); // Or keep as array if needed elsewhere

    const payload = {
      ...formData,
      fileName: cleanString(fileName),
      patientName: cleanString(formData.patientName),
      dob: cleanString(formData.dob),
      dateOfEvaluation: cleanString(finalDateOfEval),
      provider: cleanString(formData.provider),
      referringPhysician: cleanString(formData.referringPhysician) || capitalizedPhysician,

      // ✅ Updated multi-select mapping
      insurance1: insuranceFinal1,
      insurance2: insuranceFinal2,
      insuranceList: selectedInsurances, // keep full list if backend uses it

      location: cleanString(formData.location),
      CMA: finalCMA, // can be array or string based on backend format

      roomNumber: cleanString(formData.roomNumber),
      chiefComplaint: cleanString(chiefComplaint?.finalText),
      complaintsSummary,

      // ⏩ Keep rest unchanged...
      pain_illnessLevel: getOrNoValue(formData.historyOfPresentIllness.pain_illnessLevel),
      activity_illnessLevel: getOrNoValue(formData.historyOfPresentIllness.activity_illnessLevel),
      social_illnessLevel: getOrNoValue(formData.historyOfPresentIllness.social_illnessLevel),
      job_illnessLevel: getOrNoValue(formData.historyOfPresentIllness.job_illnessLevel),
      sleep_illnessLevel: getOrNoValue(formData.historyOfPresentIllness.sleep_illnessLevel),

      temporally: formData.pain?.temporally || "",
      qualitativePain: formData.pain?.qualitativePain || "",
      numericScaleFormatted: formData.pain.numericScaleFormatted,
      workingStatus: formData.pain?.workingStatus || "",
      comments: formData.pain?.comments || "",

      allergic_symptom_1: formData.formatted_allergic_1,
      allergic_symptom_2: formData.formatted_allergic_2,
      allergic_symptom_3: formData.formatted_allergic_3,
      allergic_symptom_4: formData.formatted_allergic_4,
      allergic_symptom_5: formData.formatted_allergic_5,
      neurological_symptom_1: formData.formatted_neuro_1,
      neurological_symptom_2: formData.formatted_neuro_2,
      neurological_symptom_3: formData.formatted_neuro_3,
      neurological_symptom_4: formData.formatted_neuro_4,
      neurological_symptom_5: formData.formatted_neuro_5,

      complianceComments: formData.complianceComments,
      intervalComments: formData.intervalComments,

      vitals: formData.vitals,
      generalAppearance: formData.generalAppearance,
      orientation: formData.orientation,
      moodAffect: formData.moodAffect,
      gait: formData.gait,
      stationStance: formData.stationStance,
      cardiovascular: formData.cardiovascular,
      lymphadenopathy: formData.lymphadenopathy,
      coordinationBalance: formData.coordinationBalance,
      motorFunction: formData.motorFunction,

      earlier_followups: cleanString(earlierFollowupsText || ""),
      establishedComplaints: formData.establishedComplaints,

      assessment_codes: formattedAssessmentCodes,
      nonComplianceSeverity: cleanString(formData?.nonComplianceSeverity),
      actionTaken: formData.actionTaken,
      udtStatus: formData.udtStatus,
      unexpectedUTox: formData.formattedUnexpectedUTox,
      pillCount: formData.formattedPillCount,
      ptEval: formData.formattedPtEval,
      imaging: formData.formattedImaging,
      xrayOf: formData.formattedXrayOf,
      behavioralFocus: formData.formattedBehavioralFocus,
      referral: formData.formattedReferral,

      medication_management: formData.medication_management,

      INJECTION_SUMMARY: formData?.INJECTION_SUMMARY ? `\n\n${formData?.INJECTION_SUMMARY}` : "",

      signature: {
        ...signatureData,
        otherPlans: signatureData.otherPlans ? `\n\n${signatureData.otherPlans}` : "",
        formattedLines: signatureData?.formattedLines ? `\n${signatureData?.formattedLines}` : "",
        followUpAppointment: signatureData?.followUpAppointment || "",
        signatureLine: signatureData?.signatureLine || "",
        dateTranscribed: formData?.dateTranscribed || "",

        autocompleteItem1: autoCompleteData.item1,
        autocompleteItem2: autoCompleteData.item2
      }
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
      link.setAttribute("download", extractedFilename);
      // link.setAttribute("download", extractedFilename.replace(/\s+/g, "_"));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating or downloading DOCX:", error);
    }
  };

   useEffect(() => {
    const scrollToId = localStorage.getItem("scrollToId");
    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      localStorage.removeItem("scrollToId"); // Clear it after use
    }
  }, []);
  return (
    <>
      <div className="form-section"  id="demography">
        <h2 className="section-title">FOLLOW-UP VISIT via In-Office</h2>


        <Demography
          fileName={fileName}
          onFileNameChange={handleFileNameChange}
          formData={formData}
          setFormData={setFormData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          dateInputISO={dateInputISO}
          setDateInputISO={setDateInputISO}
          setDateOfEvaluation={(val) => {
            // Keep formData.dateOfEvaluation in sync if needed
            setFormData((prev) => ({ ...prev, dateOfEvaluation: val }));
          }}
        />

      </div>

      <div className="form-section" id="chief-complaint">
        <h2 className="section-title">Chief Complaint</h2>
        <ChiefComplaint initialValues={{}} onChange={setChiefComplaint}
          painSelected={painSelected}
          setPainSelected={setPainSelected}
          painLocation={painLocation}
          abbrSelected={abbrSelected}
          setAbbrSelected={setAbbrSelected}
          abbreviations={abbreviations}
        />
      </div>

      <div className="form-section" id="history-of-present-illness">
        <h2 className="section-title">History Of Present Illness</h2>
        <HistoryOfPresentIllness
          formData={formData.historyOfPresentIllness}
          setFormData={(updatedSection) =>
            setFormData((prev) => ({
              ...prev,
              historyOfPresentIllness: {
                ...prev.historyOfPresentIllness,
                ...updatedSection
              }
            }))
          }
        />
      </div>

      <div className="form-section" id="characteristics-of-pain">
        <h2 className="section-title">Characteristics Of Pain Include:</h2>
        <CharacteristicsOfPain
          formData={formData.pain}
          onUpdate={handlePainUpdate}
        />
      </div>

      <div className="form-section"  id="review-of-systems">
        <h2 className="section-title">Review Of Systems</h2>
        <ReviewOfSystems
          formData={formData}
          setFormData={setFormData}
          onReviewChange={handleReviewChange}
        />
        {/* <ReviewOfSystems formData={formData} setFormData={setFormData} /> */}
      </div>
      <div className="form-section" id="compliance">
        <h2 className="section-title">
          Patient Compliance with Treatment Plan
        </h2>
        <ComplianceWithTreatmentPlan
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      <div className="form-section" id="physical-examination">
        <h2 className="section-title">Physical Examination</h2>
        <PhysicalExamination onChange={handlePhysicalExamChange} />
      </div>

      <div className="form-section" id="earlier-followups">
        <h2 className="section-title">Earlier Followups</h2>
        <EarlierFollowups onDataChange={setEarlierFollowupsText} />
      </div>

      <div className="form-section" id="established-complaints">
        <h2 className="section-title">Established Complaints</h2>
        <EstablishedComplaints onChange={handleEstablishedComplaintsChange} />
      </div>

      <div className="form-section" id="assessment-codes">
        <h2 className="section-title">Assessment Codes</h2>
        {/* <AssessmentCodes selected={selected} setSelected={setSelected} /> */}
        <AssessmentCodes
          selected={selectedCodes}
          setSelected={setSelectedCodes}
        />
      </div>

      <div className="form-section" id="follow-up-plan">
        <h2 className="section-title">Follow-Up Plan</h2>
        <FollowupPlan setFormData={setFormData} />
      </div>

      <div className="form-section" id="medication-management">
        <h2 className="section-title">Medication Management</h2>
        <MedicationProvider>
          <MedicationManagement
            setMedicationListData={(text) =>
              setFormData((prev) => ({ ...prev, medication_management: text }))
            }
          />
        </MedicationProvider>
      </div>

      <div className="form-section" id="injections-list">
        <h2 className="section-title">Injections List</h2>
        {/* <InjectionsList onInjectionChange={handleInjectionChange} /> */}
        <InjectionsList
          onInjectionChange={handleInjectionChange}
          onAutoSetFollowUp={setFollowUpValue}
          setHasNowSchedule={setHasNowSchedule}
          onHasNowSchedule={setHasNowSchedule}
        />

      </div>

      <div className="form-section" id="signature-line">
        <h2 className="section-title">Signature Line</h2>
        {/* <SignatureLine
          onChange={handleSignatureChange}
          dateOfEvaluation={dateOfEvaluation}
        /> */}
        {/* <SignatureLine
          onChange={handleSignatureChange}
          dateOfEvaluation={dateOfEvaluation}
          followUpValue={followUpValue}
          setFollowUpValue={setFollowUpValue}
        /> */}
        <SignatureLine
          hasNowSchedule={hasNowSchedule}
          followUpValue={followUpValue}
          setFollowUpValue={setFollowUpValue}
          onChange={handleSignatureChange}
          // onChange={handleSignatureLineChange}
          // dateOfEvaluation={dateOfEvaluation}
          dateOfEvaluation={formData.dateOfEvaluation}
        />


      </div>
    </>
  );
};

export default Form;
