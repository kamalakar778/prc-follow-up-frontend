import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 1000,
    margin: "0 auto",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    borderBottom: "2px solid #ddd",
    paddingBottom: 8
  },
  group: {},
  inlineGroup: {
    display: "flex",
    width: "90%",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12
  },
  labelText: {
    fontWeight: 600,
    fontSize: 14,
    color: "#444"
  },
  input: {
    flex: 1,
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14
  },
  inputMedium: {
    width: 200,
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14
  },
  select: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    minWidth: 160,
    cursor: "pointer"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: 17,
    color: "#444",
    gap: 8,
    marginBottom: 8
  },
  note: {
    fontSize: 13,
    color: "#555",
    marginLeft: 24,
    marginBottom: 16,
    lineHeight: 1.5
  }
};

const FollowupPlan = ({ setFormData }) => {
  const [nonComplianceSeverity, setNonComplianceSeverity] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [willOrderUDT, setWillOrderUDT] = useState(false);
  const [willNotOrderUDT, setWillNotOrderUDT] = useState(false);
  const [unexpectedUTox, setUnexpectedUTox] = useState("");
  const [ptEval, setPtEval] = useState("");
  const [pillCount, setPillCount] = useState(false);
  const [imageType, setImageType] = useState("");
  const [imaging, setImaging] = useState("");
  const [xrayOf, setXrayOf] = useState("");
  const [behavioralFocus, setBehavioralFocus] = useState("");
  const [referral, setReferral] = useState("");

  const getUDTStatus = () => {
    if (willOrderUDT) {
      return (
        "Will order a Urine Drug Test (UDT) Using an Instrumented Chemistry Analyzer to screen for drug classes of prescribed medications and drug classes for commonly abused substances used locally in the KY/Louisville area\n" +
        "1.\tIf UDT ordered, will review screen results and confirm all prescribed meds.\n" +
        "2.\tIf UDT ordered, Confirm all non-prescribed drugs and always test for: Fentanyl, Methamphetamine and Cocaine\n" +
        "Justification: Monitor adherence, misuse/diversion, quarterly testing recommended for opioid patients."
      );
    }
    if (willNotOrderUDT) return "Will not order a Urine Drug Test (UDT)";
    return "UDT order status unspecified";
  };

  const formattedUnexpectedUTox = unexpectedUTox
    ? `Unexpected U-Tox Result: ${unexpectedUTox}`
    : "";
  const formattedPillCount = pillCount
    ? "Will order a random pill count and U-Tox Screen with possible laboratory confirmation, if appropriate."
    : "";
  const formattedPtEval = ptEval
    ? `Will order Physical Therapy Eval And Tx for: ${ptEval}`
    : "";
  const formattedImaging =
    imageType && imaging
      ? `Will order ${imageType} of: ${imaging} (with/without contrast)`
      : "";
  const formattedXrayOf = xrayOf ? `Will order X-Ray of: ${xrayOf}` : "";
  const formattedBehavioralFocus = behavioralFocus
    ? `Behavioral Health Consult with emphasis on: ${behavioralFocus}`
    : "";
  const formattedReferral = referral ? `Will Refer to: ${referral}` : "";

  const followUpSummary = [
    "Follow-Up Plan:",
    `${nonComplianceSeverity || "____________"}`,
    actionTaken ? `\t a. Action taken if non-compliant: ${actionTaken}` : "",
    getUDTStatus(),
    formattedUnexpectedUTox,
    formattedPillCount,
    formattedPtEval,
    formattedImaging,
    formattedXrayOf,
    formattedBehavioralFocus,
    formattedReferral
  ]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    const udtStatusFormatted = (() => {
      if (willOrderUDT) {
        return (
          "Will order a Urine Drug Test (UDT) Using an Instrumented Chemistry Analyzer to screen for drug classes of prescribed medications and drug classes for commonly abused substances used locally in the KY/Louisville area\n"+
          "\t  1.If UDT ordered, will review screen results and confirm all prescribed meds (e.g. confirm a positive screen UDT and/or confirm an unexpected negative screen UDT).\n"+
          "\t  2.If UDT ordered, Confirm all non-prescribed drugs that were positive on the screen UDT and will always test for:  Fentanyl, Methamphetamine and Cocaine\n"+
          "Justification for UDT:  It is medically necessary to monitor adherence to the Prescription Medication Agreement and to identify possible misuse, diversion and/or abuse of both prescribed and unprescribed medications.  Compliance tools used to monitor patients’ include: UDT, The Prescription Drug Monitoring Program database (e.g. KASPER), Risk Stratification Tools (e.g. ORT), and current High-Risk substances in the KY/Louisville area (see below). Based on these compliance tools, especially current High-Risk substance abuse community trend locally. UDT will usually be ordered quarterly (or more frequently as applicable) for patients on opioids.\n"+
          "\t  1.Kentucky Chamber Workforce Ctr, 2019, “Opioid in Kentucky Abuse”, Kentucky Chamber of Commerce, June 2019, pp. 2-18.\n"+
          "\t  2.Substance Abuse and Mental Health Services Administration, 2020,“Behavioral Health Barometer: Kentucky, Volume 6:  Indicators as measured through the 2019 National Survey on Drug Use and Health and the National Survey of Substance Abuse Treatment Services”, HHS Publication No. SMA–20–Baro–19–KY, pp. 21-26:\n"
        );
      }
      if (willNotOrderUDT) return "Will not order a Urine Drug Test (UDT)";
      return "";
    })();

    const formattedUnexpectedUTox = unexpectedUTox
      ? `Unexpected U-Tox Result: ${unexpectedUTox}`
      : "";

    const formattedPillCount = pillCount
      ? "Will order a random pill count and U-Tox Screen with possible laboratory confirmation, if appropriate."
      : "";

    const formattedPtEval = ptEval
      ? `Will order Physical Therapy Eval And Tx for: ${ptEval}`
      : "";

    const formattedImaging =
      imageType && imaging
        ? `Will order ${imageType} of: ${imaging} (with/without contrast)`
        : "";

    const formattedXrayOf = xrayOf ? `Will order X-Ray of: ${xrayOf}` : "";

    const formattedBehavioralFocus = behavioralFocus
      ? `Behavioral Health Consult with emphasis on: ${behavioralFocus}`
      : "";

    const formattedReferral = referral ? `Will Refer to: ${referral}` : "";

    if (typeof setFormData === "function") {
      setFormData((prev) => ({
        ...prev,
        nonComplianceSeverity, // This is not a formatted field — it's raw text
        actionTaken: actionTaken
          ? `Action taken if non-compliant: ${actionTaken}`
          : "",

        udtStatus: udtStatusFormatted,
        formattedUnexpectedUTox,
        formattedPillCount,
        formattedPtEval,
        formattedImaging,
        formattedXrayOf,
        formattedBehavioralFocus,
        formattedReferral
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
    <div style={styles.container}>
      <div style={styles.group}>
        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>Non-compliance severity:</span>
          <input
            type="text"
            value={nonComplianceSeverity}
            onChange={(e) => setNonComplianceSeverity(e.target.value)}
            style={styles.inputMedium}
            placeholder="e.g. Mild"
          />
        </div>

        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>Action taken:</span>
          <input
            type="text"
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            style={styles.inputMedium}
            placeholder="e.g. Verbal warning"
          />
        </div>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={willNotOrderUDT}
            onChange={() => {
              const newVal = !willNotOrderUDT;
              setWillNotOrderUDT(newVal);
              if (newVal) setWillOrderUDT(false);
            }}
          />
          Will not order a Urine Drug Test (UDT)
        </label>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={willOrderUDT}
            onChange={() => {
              const newVal = !willOrderUDT;
              setWillOrderUDT(newVal);
              if (newVal) setWillNotOrderUDT(false);
            }}
          />
          Will order a UDT using Instrumented Chemistry Analyzer
        </label>

        {willOrderUDT && (
          <div style={styles.note}>
            <p>1. Review UDT screen results and confirm all prescribed meds.</p>
            <p>
              2. Confirm positives for non-prescribed drugs (Fentanyl, Meth,
              Cocaine).
            </p>
            <p>Quarterly UDT typically required for opioid patients.</p>
          </div>
        )}

        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>Unexpected U-Tox Result:</span>
          <input
            type="text"
            value={unexpectedUTox}
            onChange={(e) => setUnexpectedUTox(e.target.value)}
            style={styles.input}
            placeholder="e.g. THC positive"
          />
        </div>

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={pillCount}
            onChange={() => setPillCount(!pillCount)}
          />
          Will order pill count and U-Tox Screen
        </label>

        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>PT Eval & Tx for:</span>
          <input
            type="text"
            value={ptEval}
            onChange={(e) => setPtEval(e.target.value)}
            style={styles.input}
            placeholder="e.g. ROM, Strengthening"
          />
        </div>

        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>Imaging:</span>
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Type</option>
            <option value="MRI Scan">MRI Scan</option>
            <option value="CT Scan">CT Scan</option>
          </select>
          <span style={styles.labelText}>of:</span>
          <input
            type="text"
            value={imaging}
            onChange={(e) => setImaging(e.target.value)}
            style={styles.input}
            placeholder="e.g. lumbar spine"
          />
        </div>

        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>X-Ray of:</span>
          <input
            type="text"
            value={xrayOf}
            onChange={(e) => setXrayOf(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>Behavioral consult focus:</span>
          <input
            type="text"
            value={behavioralFocus}
            onChange={(e) => setBehavioralFocus(e.target.value)}
            style={styles.input}
            placeholder="e.g. coping skills"
          />
        </div>

        <div style={styles.inlineGroup}>
          <span style={styles.labelText}>Will refer to:</span>
          <input
            type="text"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

FollowupPlan.propTypes = {
  setFormData: PropTypes.func
};

export default FollowupPlan;
