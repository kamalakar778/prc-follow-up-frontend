import React, { useEffect } from "react";

const ComplianceWithTreatmentPlan = ({ formData = {}, setFormData }) => {
  const handleChange = (baseKey, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [`${baseKey}_yes`]: selectedOption === "Yes" ? "Yes" : "",
      [`${baseKey}_no`]: selectedOption === "No" ? "No" : "",
      [`${baseKey}_na`]: selectedOption === "NA" ? "NA" : ""
    }));
  };

  const questions = [
    { label: "U-tox and/or Pill Count O.K.?", key: "tox_count" },
    { label: "KASPER report O.K.?", key: "kasper" },
    { label: "Participates in PT or home exercise prgm", key: "pt" },
    { label: "Ordered imaging studies completed", key: "imaging" },
    { label: "Participated in Weight Loss Prgm", key: "weightloss" },
    { label: "Participated with Counselor if recommended", key: "counselor" }
  ];

  useEffect(() => {
    const changeType = formData.weightloss_change_type || "";
    const lbs = formData.weightloss_lbs || "";
    const bmi = formData.weightloss_bmi || "";
    const weightStatus = formData.weightloss_weight_status || "";
    const manualComment = formData.weightloss_manual_comment || "";

    const hasAnyValue = changeType || lbs || bmi || weightStatus;

    const autoComment = hasAnyValue
      ? `${changeType} ${lbs} lbs. BMI: ${bmi}. Weight: ${weightStatus}`
      : "";

    setFormData((prev) => ({
      ...prev,
      weightloss_comment: `${autoComment}${
        manualComment ? (autoComment ? ".  " : "") + manualComment : ""
      }`
    }));
  }, [
    formData.weightloss_change_type,
    formData.weightloss_lbs,
    formData.weightloss_bmi,
    formData.weightloss_weight_status,
    formData.weightloss_manual_comment
  ]);

  useEffect(() => {
    const base = formData.kasper_source || "";
    const frequency = formData.kasper_frequency || "";
    const unit = formData.kasper_frequency_unit || "";
    const sessions = formData.kasper_sessions || "";
    const status = formData.kasper_status || "";
    const manualComment = formData.pt_manual_comment || "";

    const hasAnyValue = base || frequency || unit || sessions || status;

    const autoComment = hasAnyValue
      ? `${base} ${frequency} ${unit}. Number of sessions done: ${sessions} ${status}`
      : "";

    setFormData((prev) => ({
      ...prev,
      pt_comment: `${autoComment}${
        manualComment ? (autoComment ? ".  " : "") + manualComment : ""
      }`
    }));
  }, [
    formData.kasper_source,
    formData.kasper_frequency,
    formData.kasper_frequency_unit,
    formData.kasper_sessions,
    formData.kasper_status,
    formData.pt_manual_comment
  ]);

  const styles = {
    container: {
      marginTop: 8,
      padding: 12,
      border: "1px solid #ccc",
      borderRadius: 8,
      fontSize: 14,
      lineHeight: "18px",
      backgroundColor: "#fafafa",
      maxWidth: 1000
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      borderBottom: "1px solid #aaa",
      padding: "4px 6px",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 13
    },
    td: {
      borderBottom: "1px solid #ddd",
      padding: "0px 8px",
      verticalAlign: "top",
      textAlign: "center",
      whiteSpace: "nowrap"
    },
    btnGroup: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 6
    },
    button: {
      width: "100%",
      padding: "6px 5px",
      margin: "1px 2px",
      fontSize: 13,
      borderRadius: 4,
      border: "0.7px solid #ccc",
      cursor: "pointer",
      userSelect: "none",
      backgroundColor: "#f5f5f5",
      color: "black",
      transition: "background-color 0.2s, border-color 0.2s",
      boxSizing: "border-box"
    },
    buttonSelected: {
      backgroundColor: "#25ab13",
      color: "white",
      borderColor: "#0a0a0d"
    },
    inputText: {
      width: "100%",
      padding: "10px 6px",
      border: "1px solid #ccc",
      borderRadius: 4,
      marginBottom: 6,
      fontSize: 15
    },
    select: {
      padding: "6px 6px",
      border: "1px solid #ccc",
      borderRadius: 4,
      minWidth: 90,
      marginBottom: 6,
      fontSize: 13
    },
    miniInput: {
      width: 60,
      padding: "8px 8px",
      border: "1px solid #ccc",
      borderRadius: 4,
      marginBottom: 6,
      fontSize: 13
    },
    textarea: {
      width: "100%",
      padding: "4px 6px",
      border: "1px solid #ccc",
      borderRadius: 4,
      resize: "vertical",
      marginBottom: 6,
      fontSize: 15
    },
    subFieldRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      alignItems: "center",
      marginBottom: 6,
      fontSize: 13
    },
    commentGroup: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}></th>
            <th style={styles.th}>Yes</th>
            <th style={styles.th}>No</th>
            <th style={styles.th}>N.A.</th>
            <th style={styles.th}>Comments</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(({ label, key }, index) => (
            <tr key={index}>
              <td style={styles.td}>{label}</td>
              {["Yes", "No", "NA"].map((option) => {
                const isSelected =
                  formData[`${key}_${option.toLowerCase()}`] === option;
                return (
                  <td style={styles.td} key={option}>
                    <button
                      type="button"
                      style={{
                        ...styles.button,
                        ...(isSelected ? styles.buttonSelected : {})
                      }}
                      onClick={() => handleChange(key, option)}
                    >
                      {option}
                    </button>
                  </td>
                );
              })}
              <td style={{ ...styles.td, textAlign: "left" }}>
                {key === "weightloss" ? (
                  <div style={styles.commentGroup}>
                    <input
                      type="text"
                      style={styles.inputText}
                      readOnly
                      placeholder="Auto-generated comment"
                      name="weightloss_comment"
                      value={formData.weightloss_comment || ""}
                    />
                    <div style={styles.subFieldRow}>
                      <select
                        name="weightloss_change_type"
                        style={styles.select}
                        value={formData.weightloss_change_type || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      >
                        <option value="">Select</option>
                        <option value="Increased">Increased</option>
                        <option value="Decreased">Decreased</option>
                      </select>
                      <input
                        type="text"
                        name="weightloss_lbs"
                        placeholder="lbs"
                        style={styles.miniInput}
                        value={formData.weightloss_lbs || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      />
                      <span>BMI:</span>
                      <input
                        type="text"
                        name="weightloss_bmi"
                        placeholder="BMI"
                        style={styles.miniInput}
                        value={formData.weightloss_bmi || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      />
                      <select
                        name="weightloss_weight_status"
                        style={styles.select}
                        value={formData.weightloss_weight_status || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      >
                        <option value="">Weight Status</option>
                        <option value="Gain">Gain</option>
                        <option value="Loss">Loss</option>
                        <option value="Same">Same</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      name="weightloss_manual_comment"
                      style={styles.textarea}
                      placeholder="Additional comments (optional)"
                      value={formData.weightloss_manual_comment || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value
                        }))
                      }
                    />
                  </div>
                ) : key === "pt" ? (
                  <div style={styles.commentGroup}>
                    <input
                      type="text"
                      name="pt_comment"
                      style={styles.inputText}
                      readOnly
                      placeholder="Auto-generated comment"
                      value={formData.pt_comment || ""}
                    />
                    <div style={styles.subFieldRow}>
                      <select
                        name="kasper_source"
                        style={styles.select}
                        value={formData.kasper_source || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      >
                        <option value="">Select Source</option>
                        <option value="At Home">At Home</option>
                        <option value="HEP">HEP</option>
                        <option value="On Base">On Base</option>
                        <option value="KASPER">KASPER</option>
                      </select>
                      <input
                        type="text"
                        name="kasper_frequency"
                        placeholder="e.g. 2"
                        style={styles.miniInput}
                        value={formData.kasper_frequency || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      />
                      <select
                        name="kasper_frequency_unit"
                        style={styles.select}
                        value={formData.kasper_frequency_unit || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      >
                        <option value="">Unit</option>
                        <option value="per week">per week</option>
                        <option value="per month">per month</option>
                      </select>
                      <input
                        type="text"
                        name="kasper_sessions"
                        placeholder="Sessions"
                        style={styles.miniInput}
                        value={formData.kasper_sessions || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      />
                      <select
                        name="kasper_status"
                        style={styles.select}
                        value={formData.kasper_status || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value
                          }))
                        }
                      >
                        <option value="">Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="None">None</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      name="pt_manual_comment"
                      style={styles.textarea}
                      placeholder="Additional comments (optional)"
                      value={formData.pt_manual_comment || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.name]: e.target.value
                        }))
                      }
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    style={styles.inputText}
                    placeholder="Comments"
                    name={`${key}_comment`}
                    value={formData[`${key}_comment`] || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value
                      }))
                    }
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔽 Added complianceComments input field */}
      <div style={{ marginTop: 16 }}>
        <label htmlFor="complianceComments" style={{ fontWeight: 600 }}>
          Comments (compliance, MRI, X-Ray, etc):
        </label>
        <textarea
          rows={3}
          name="complianceComments"
          style={styles.textarea}
          placeholder="Enter overall compliance comments here..."
          value={formData.complianceComments || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [e.target.name]: e.target.value
            }))
          }
        />
      </div>
    </div>
  );
};

export default ComplianceWithTreatmentPlan;
