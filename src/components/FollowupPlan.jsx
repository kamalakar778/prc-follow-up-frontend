import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const severityOptions = ["None", "Mild", "Moderate", "Significant"];
const contrastOptions = ["with contrast", "without contrast"];
const imageTypeOptions = [
  "Due to worsening pain/symptoms",
  "Due to intermittent tingling &/or numbness into extremity"
];
const imageTypes = ["MRI Scan", "CT Scan"];
const actionOptions = [
  "The patient counseled/warned on need to engage treatment plan",
  "final warning given before NNCP",
  "NNCP",
  "Discharge"
];

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
    gap: 12,
    marginBottom: 2
  },
  labelText: {
    fontWeight: 600,
    fontSize: 14,
    color: "#444",
    display: "block",
    marginBottom: 4
  },
  input: {
    flex: 1,
    marginTop: 4,
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14
  },
  // checkboxLabel: {
  //   display: "flex",
  //   alignItems: "center",
  //   fontSize: 17,
  //   color: "#444",
  //   gap: 8,
  //   marginBottom: 8
  // },
 buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  toggleButton: {
    padding: "6px 16px",
    fontSize: 16,
    border: "1px solid",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  labelText: {
    fontSize: 17,
    color: "#444",
  },
  note: {
    fontSize: 13,
    color: "#555",
    marginLeft: 24,
    marginBottom: 16,
    lineHeight: 1.5
  },
  optionButton: (isSelected) => ({
    marginRight: 3,
    marginBottom: 0,
    cursor: "pointer",
    padding: "6px 6px",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "#999",
    backgroundColor: isSelected ? "#e0f6e9" : "#f0f0f0",
    color: isSelected ? "green" : "#333",
    // borderColor: isSelected ? "green" : "gray",
    // backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    // color: isSelected ? "green" : "gray",
    display: "inline-block",
    fontWeight: isSelected ? "bold" : "normal",
    transition: "all 0.3s ease"
  })
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
  const [imagingContrast, setImagingContrast] = useState("");
  const [imaging, setImaging] = useState("");
  const [xrayOf, setXrayOf] = useState("");
  const [behavioralFocus, setBehavioralFocus] = useState("");
  const [referral, setReferral] = useState("");
  const [selectedImageTypeOptions, setSelectedImageTypeOptions] = useState([]);

  const getUDTStatus = () => {
    if (willOrderUDT) {
      return (
        "Will order a Urine Drug Test (UDT) Using an Instrumented Chemistry Analyzer to screen for drug classes of prescribed medications and drug classes for commonly abused substances used locally in the KY/Louisville area\n" +
        "\t1.If UDT ordered, will review screen results and confirm all prescribed meds (e.g. confirm a positive screen UDT and/or confirm an unexpected negative screen UDT).\n" +
        "\t2.If UDT ordered, Confirm all non-prescribed drugs that were positive on the screen UDT and will always test for:  Fentanyl, Methamphetamine and Cocaine.\n" +
        "Justification for UDT:  It is medically necessary to monitor adherence to the Prescription Medication Agreement and to identify possible misuse, diversion and/or abuse of both prescribed and unprescribed medications.  Compliance tools used to monitor patients’ include: UDT, The Prescription Drug Monitoring Program database (e.g. KASPER), Risk Stratification Tools (e.g. ORT), and current High-Risk substances in the KY/Louisville area (see below). Based on these compliance tools, especially current High-Risk substance abuse community trend locally. UDT will usually be ordered quarterly (or more frequently as applicable) for patients on opioids.\n" +
        "\t1.Kentucky Chamber Workforce Ctr, 2019, “Opioid in Kentucky Abuse”, Kentucky Chamber of Commerce, June 2019, pp. 2-18.\n" +
        "\t2.Substance Abuse and Mental Health Services Administration, 2020,“Behavioral Health Barometer: Kentucky, Volume 6:  Indicators as measured through the 2019 National Survey on Drug Use and Health and the National Survey of Substance Abuse Treatment Services”, HHS Publication No. SMA–20–Baro–19–KY, pp. 21-26:\n"
      );
    }
    if (willNotOrderUDT) return "Will not order a Urine Drug Test (UDT)";
    return "____Page #6 Point #18 _____";
  };

  useEffect(() => {
    const udtStatusFormatted = getUDTStatus();

    const formattedUnexpectedUTox = unexpectedUTox
      ? `\nUnexpected U-Tox Result: ${unexpectedUTox}`
      : "";

    const formattedPillCount = pillCount
      ? "\nWill order a random pill count and U-Tox Screen with possible laboratory confirmation, if appropriate."
      : "";

    const formattedPtEval = ptEval
      ? `\nWill order Physical Therapy Eval And Tx (ROM, Strengthening, Stretching) for: ${ptEval}`
      : "";

    const formattedImaging =
      imageType && imaging
        ? `\nWill order ${imageType} ${imagingContrast} of: ${imaging}\n\t${
            selectedImageTypeOptions.length > 0
              ? selectedImageTypeOptions.map((opt) => `• ${opt}`).join("\n\t")
              : "No specific reason selected"
          }`
        : "";

    const formattedXrayOf = xrayOf ? `\nWill order X-Ray of: ${xrayOf}` : "";

    const formattedBehavioralFocus = behavioralFocus
      ? `\nWill order Behavioral Health Consult with emphasis on: ${behavioralFocus}`
      : "";

    const formattedReferral = referral ? `\nWill Refer to: ${referral}` : "";

    if (typeof setFormData === "function") {
      setFormData((prev) => ({
        ...prev,
        nonComplianceSeverity,
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
    imagingContrast,
    imaging,
    xrayOf,
    behavioralFocus,
    referral,
    selectedImageTypeOptions,
    setFormData
  ]);

  return (
    <div style={styles.container}>
      <div style={styles.group}>
        <div style={{ marginBottom: 12 }}>
          <label style={styles.labelText}>Non-compliance severity:</label>
          {severityOptions.map((option) => {
            const isSelected = nonComplianceSeverity === option;
            return (
              <span
                key={option}
                style={styles.optionButton(isSelected)}
                onClick={() =>
                  setNonComplianceSeverity(isSelected ? "" : option)
                }
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setNonComplianceSeverity(isSelected ? "" : option);
                  }
                }}
              >
                {option}
              </span>
            );
          })}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={styles.labelText}>Action taken:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {actionOptions.map((option) => {
              const isSelected = actionTaken === option;
              return (
                <span
                  key={option}
                  style={styles.optionButton(isSelected)}
                  onClick={() => setActionTaken(isSelected ? "" : option)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActionTaken(isSelected ? "" : option);
                    }
                  }}
                >
                  {option}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={styles.labelText}>UDT Plan:</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={styles.optionButton(willOrderUDT)}
              onClick={() => {
                const newVal = !willOrderUDT;
                setWillOrderUDT(newVal);
                if (newVal) setWillNotOrderUDT(false);
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const newVal = !willOrderUDT;
                  setWillOrderUDT(newVal);
                  if (newVal) setWillNotOrderUDT(false);
                }
              }}
            >
              Will order a (UDT)
            </span>

            <span
              style={styles.optionButton(willNotOrderUDT)}
              onClick={() => {
                const newVal = !willNotOrderUDT;
                setWillNotOrderUDT(newVal);
                if (newVal) setWillOrderUDT(false);
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  const newVal = !willNotOrderUDT;
                  setWillNotOrderUDT(newVal);
                  if (newVal) setWillOrderUDT(false);
                }
              }}
            >
              Will not order (UDT)
            </span>
          </div>
        </div>

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

        {/* <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={pillCount}
            onChange={() => setPillCount(!pillCount)}
          />
          Will order pill count and U-Tox Screen
        </label> */}
        <div style={styles.buttonContainer}>
          <button
            style={{
              ...styles.toggleButton,
              backgroundColor: pillCount ? "#dc2626" : "#16a34a", // red for remove, green for add
              color: "#fff",
              borderColor: pillCount ? "#dc2626" : "#16a34a"
            }}
            onClick={() => setPillCount(!pillCount)}
          >
            {pillCount ? "Remove" : "Add"}
          </button>
          <span style={styles.labelText}>
            Will order pill count and U-Tox Screen
          </span>
        </div>

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
          <span style={styles.labelText}>Imaging Type:</span>
          {imageTypes.map((type) => (
            <span
              key={type}
              style={styles.optionButton(imageType === type)}
              onClick={() => setImageType(imageType === type ? "" : type)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setImageType(imageType === type ? "" : type);
                }
              }}
            >
              {type}
            </span>
          ))}
          {contrastOptions.map((option) => (
            <span
              key={option}
              style={styles.optionButton(imagingContrast === option)}
              onClick={() =>
                setImagingContrast(imagingContrast === option ? "" : option)
              }
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setImagingContrast(imagingContrast === option ? "" : option);
                }
              }}
            >
              {option}
            </span>
          ))}
          <input
            type="text"
            value={imaging}
            onChange={(e) => setImaging(e.target.value)}
            style={styles.input}
            placeholder="e.g. lumbar spine"
          />
          <br />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {imageTypeOptions.map((option) => {
              const isSelected = selectedImageTypeOptions.includes(option);
              return (
                <span
                  key={option}
                  style={styles.optionButton(isSelected)}
                  onClick={() => {
                    setSelectedImageTypeOptions((prev) =>
                      isSelected
                        ? prev.filter((item) => item !== option)
                        : [...prev, option]
                    );
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedImageTypeOptions((prev) =>
                        isSelected
                          ? prev.filter((item) => item !== option)
                          : [...prev, option]
                      );
                    }
                  }}
                >
                  {option}
                </span>
              );
            })}
          </div>
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
