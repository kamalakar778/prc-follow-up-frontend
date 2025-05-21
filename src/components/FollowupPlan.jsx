import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const FollowupPlan = ({ setFormData }) => {
  const [nonComplianceSeverity, setNonComplianceSeverity] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [willOrderUDT, setWillOrderUDT] = useState(false);
  const [willNotOrderUDT, setWillNotOrderUDT] = useState(false);
  const [unexpectedUTox, setUnexpectedUTox] = useState(""); // Changed to string
  const [ptEval, setPtEval] = useState("");
  const [pillCount, setPillCount] = useState(false);

  const [imageType, setImageType] = useState("");
  const [imaging, setImaging] = useState("");
  const [xrayOf, setXrayOf] = useState("");
  const [behavioralFocus, setBehavioralFocus] = useState("");
  const [referral, setReferral] = useState("");

  const sectionStyle = {
    padding: "16px 0",
    borderBottom: "1px solid #ddd"
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    fontWeight: "500"
  };

  const selectStyle = {
    marginLeft: "10px",
    padding: "6px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    flexShrink: 0
  };

  const inputStyle = {
    marginLeft: "10px",
    padding: "6px 10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    flex: 1
  };

  const checkboxLabelStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    cursor: "pointer"
  };

  const checkboxStyle = {
    marginRight: "8px"
  };

  const getUDTStatus = () => {
    if (willOrderUDT) {
      return (
        "Will order a Urine Drug Test (UDT) Using an Instrumented Chemistry Analyzer to screen for drug classes of prescribed medications and drug classes for commonly abused substances used locally in the KY/Louisville area\n" +
        "1.\tIf UDT ordered, will review screen results and confirm all prescribed meds (e.g. confirm a positive screen UDT and/or confirm an unexpected negative screen UDT).\n" +
        "2.\tIf UDT ordered, Confirm all non-prescribed drugs that were positive on the screen UDT and will always test for:  Fentanyl, Methamphetamine and Cocaine\n" +
        "Justification for UDT:  It is medically necessary to monitor adherence to the Prescription Medication Agreement and to identify possible misuse, diversion and/or abuse of both prescribed and unprescribed medications.  Compliance tools used to monitor patients’ include: UDT, The Prescription Drug Monitoring Program database (e.g. KASPER), Risk Stratification Tools (e.g. ORT), and current High-Risk substances in the KY/Louisville area (see below). Based on these compliance tools, especially current High-Risk substance abuse community trend locally. UDT will usually be ordered quarterly (or more frequently as applicable) for patients on opioids.\n" +
        "1.\tKentucky Chamber Workforce Ctr, 2019, “Opioid in Kentucky Abuse”, Kentucky Chamber of Commerce, June 2019, pp. 2-18.\n" +
        "2.\tSubstance Abuse and Mental Health Services Administration, 2020,“Behavioral Health Barometer: Kentucky, Volume 6:  Indicators as measured through the 2019 National Survey on Drug Use and Health and the National Survey of Substance Abuse Treatment Services”, HHS Publication No. SMA–20–Baro–19–KY, pp. 21-26:"
      );
    }
    if (willNotOrderUDT) {
      return "Will not order a Urine Drug Test (UDT)";
    }
    return "UDT order status unspecified";
  };

  const getUnexpectedUTox = () =>
    unexpectedUTox
      ? `Unexpected U-Tox Result: ${unexpectedUTox}`
      : "";

  const getPT = () =>
    ptEval
      ? `Will order Physical Therapy Eval And Tx (ROM, Strengthening, Stretching) for: ${ptEval}`
      : "";

  const getPillCount = () =>
    pillCount
      ? `Will order a random pill count and U-Tox Screen with possible laboratory confirmation, if appropriate.`
      : "";

  const getImaging = () =>
    imaging
      ? `Will order ${imageType}(MRI/CT) with/without contrast of: ${imaging}\n\tDue to Worsening pain/symptoms\n\tDue to intermittent tingling and/or numbness into extremity.`
      : "";

  const getXray = () => (xrayOf ? `Will order X-Ray of: ${xrayOf}` : "");

  const getBehavioral = () =>
    behavioralFocus
      ? `Will order Behavioral Health Consult with emphasis on: ${behavioralFocus}`
      : "";

  const getReferral = () => (referral ? `Will Refer to: ${referral}` : "");

  useEffect(() => {
    const followUpSummary = [
      "Follow-Up Plan:",
      `${nonComplianceSeverity || "____________"}`,
      actionTaken ? `\t a. Action taken if non-compliant: ${actionTaken}` : "",
      getUDTStatus(),
      getUnexpectedUTox(),
      getPillCount(),
      getPT(),
      getImaging(),
      getXray(),
      getBehavioral(),
      getReferral()
    ].filter(Boolean).join("\n");

    if (typeof setFormData === "function") {
      setFormData((prev) => ({
        ...prev,
        nonComplianceSeverity,
        actionTaken,
        unexpectedUTox,
        ptEval,
        pillCount,
        imageType,
        imaging,
        xrayOf,
        behavioralFocus,
        referral,
        udtStatus: getUDTStatus(),
        followUpPlan: followUpSummary
      }));
    }
  }, [
    nonComplianceSeverity,
    actionTaken,
    willOrderUDT,
    willNotOrderUDT,
    unexpectedUTox,
    ptEval,
    pillCount,
    imageType,
    imaging,
    xrayOf,
    behavioralFocus,
    referral,
    setFormData
  ]);

  return (
    <div style={{ padding: "16px" }}>
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "16px" }}>
          F/u Orders
        </h2>

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={willNotOrderUDT}
            onChange={() => {
              const newVal = !willNotOrderUDT;
              setWillNotOrderUDT(newVal);
              if (newVal) setWillOrderUDT(false);
            }}
            style={checkboxStyle}
          />
          Will not order a Urine Drug Test (UDT)
        </label>

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={willOrderUDT}
            onChange={() => {
              const newVal = !willOrderUDT;
              setWillOrderUDT(newVal);
              if (newVal) setWillNotOrderUDT(false);
            }}
            style={checkboxStyle}
          />
          Will order a UDT using Instrumented Chemistry Analyzer
        </label>

        {willOrderUDT && (
          <div style={{ marginLeft: "24px", marginBottom: "16px", fontSize: "0.9rem", color: "#444", lineHeight: 1.5 }}>
            <p>1. Review screen results and confirm all prescribed meds.</p>
            <p>2. Confirm non-prescribed drugs and always test for Fentanyl, Meth, Cocaine.</p>
            <p>Justification: Monitor adherence, detect misuse/diversion via tools like UDT, KASPER, ORT, etc.</p>
            <p>Usually ordered quarterly or more if on opioids.</p>
          </div>
        )}

        {/* 🔹 Updated unexpected U-Tox input */}
        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>
            Unexpected U-Tox Result:
            <input
              type="text"
              value={unexpectedUTox}
              onChange={(e) => setUnexpectedUTox(e.target.value)}
              placeholder="e.g. THC positive, confirmatory screen needed"
              style={inputStyle}
            />
          </label>
        </div>

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={pillCount}
            onChange={() => setPillCount(!pillCount)}
            style={checkboxStyle}
          />
          Will order pill count and U-Tox Screen
        </label>

        <label style={labelStyle}>
          Physical Therapy Eval & Tx for:
          <input
            type="text"
            value={ptEval}
            onChange={(e) => setPtEval(e.target.value)}
            style={inputStyle}
            placeholder="e.g. ROM, Strengthening"
          />
        </label>

        <label style={labelStyle}>
          Imaging:
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select Type</option>
            <option value="MRI Scan">MRI Scan</option>
            <option value="CT Scan">CT Scan</option>
          </select>
          <span style={{ marginLeft: "10px" }}>of:</span>
          <input
            type="text"
            value={imaging}
            onChange={(e) => setImaging(e.target.value)}
            style={inputStyle}
            placeholder="e.g. lumbar spine"
          />
        </label>

        <label style={labelStyle}>
          X-Ray of:
          <input
            type="text"
            value={xrayOf}
            onChange={(e) => setXrayOf(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Behavioral Health Consult with emphasis on:
          <input
            type="text"
            value={behavioralFocus}
            onChange={(e) => setBehavioralFocus(e.target.value)}
            style={inputStyle}
            placeholder="e.g. coping skills"
          />
        </label>

        <label style={labelStyle}>
          Will refer to:
          <input
            type="text"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            style={inputStyle}
          />
        </label>
      </div>
    </div>
  );
};

FollowupPlan.propTypes = {
  setFormData: PropTypes.func
};

export default FollowupPlan;
