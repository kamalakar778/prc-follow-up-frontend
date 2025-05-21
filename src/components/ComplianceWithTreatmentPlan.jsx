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

  const handleCommentChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [`${key}_comment`]: value }));
  };

  const handleSpecialWeightChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleManualWeightCommentChange = (value) => {
    setFormData((prev) => ({ ...prev, weightloss_manual_comment: value }));
  };

  const handleKasperFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleManualKasperCommentChange = (value) => {
    setFormData((prev) => ({ ...prev, kasper_manual_comment: value }));
  };

  useEffect(() => {
    const autoComment = `${formData.weightloss_change_type || "—"} ${
      formData.weightloss_lbs || "—"
    } lbs. BMI: ${formData.weightloss_bmi || "—"}. Weight: ${
      formData.weightloss_weight_status || "—"
    }`;
    const manualComment = formData.weightloss_manual_comment || "";
    setFormData((prev) => ({
      ...prev,
      weightloss_comment: `${autoComment}${
        manualComment ? ".  " + manualComment : ""
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
    const base = formData.kasper_source || "—";
    const frequency = formData.kasper_frequency || "—";
    const unit = formData.kasper_frequency_unit || "";
    const sessions = formData.kasper_sessions || "—";
    const status = formData.kasper_status || "—";
    const autoComment = `${base} ${frequency} ${unit}. Number of sessions done: ${sessions} (${status})`;
    const manualComment = formData.kasper_manual_comment || "";
    setFormData((prev) => ({
      ...prev,
      kasper_comment: `${autoComment}${
        manualComment ? ".  " + manualComment : ""
      }`
    }));
  }, [
    formData.kasper_source,
    formData.kasper_frequency,
    formData.kasper_frequency_unit,
    formData.kasper_sessions,
    formData.kasper_status,
    formData.kasper_manual_comment
  ]);

  const questions = [
    { label: "U-tox and/or Pill Count O.K.?", key: "tox_count" },
    { label: "KASPER report O.K.?", key: "kasper" },
    { label: "Participates in PT or home exercise prgm", key: "pt" },
    { label: "Ordered imaging studies completed", key: "imaging" },
    { label: "Participated in Weight Loss Prgm", key: "weightloss" },
    { label: "Participated with Counselor if recommended", key: "counselor" }
  ];

  // inside the styles object
const styles = {
  container: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    lineHeight: '1.3rem', // slightly reduced
    backgroundColor: '#fafafa'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    border: '1px solid #aaa',
    backgroundColor: '#f0f0f0',
    padding: '0.3rem',
    textAlign: 'center'
  },
  td: {
    border: '1px solid #ddd',
    padding: '0.3rem',
    verticalAlign: 'top'
  },
  inputText: {
    width: '95%',
    padding: '0.25rem',
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    marginBottom: '0.3rem'
  },
  select: {
    padding: '0.25rem',
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    minWidth: '7rem',
    marginBottom: '0.3rem'
  },
  miniInput: {
    width: '4rem',
    padding: '0.25rem',
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    marginBottom: '0.3rem'
  },
  textarea: {
    width: '95%',
    padding: '0.25rem',
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    resize: 'vertical',
    marginBottom: '0.3rem'
  },
  radio: {
    textAlign: 'center'
  },
  subFieldRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
    alignItems: 'center',
    marginBottom: '0.3rem'
  },
  commentGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    marginBottom: '0.3rem'
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
              {["Yes", "No", "NA"].map((option) => (
                <td style={{ ...styles.td, ...styles.radio }} key={option}>
                  <input
                    type="radio"
                    name={key}
                    checked={
                      formData[`${key}_${option.toLowerCase()}`] === option
                    }
                    onChange={() => handleChange(key, option)}
                  />
                </td>
              ))}
              <td style={styles.td}>
                {key === "weightloss" ? (
                  <div style={styles.commentGroup}>
                    <input
                      type="text"
                      style={styles.inputText}
                      readOnly
                      placeholder="Auto-generated comment"
                      value={formData.weightloss_comment || ""}
                    />
                    <div style={styles.subFieldRow}>
                      <select
                        style={styles.select}
                        value={formData.weightloss_change_type || ""}
                        onChange={(e) =>
                          handleSpecialWeightChange(
                            "weightloss_change_type",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select</option>
                        <option value="Increased">Increased</option>
                        <option value="Decreased">Decreased</option>
                      </select>
                      <input
                        type="number"
                        placeholder="lbs"
                        style={styles.miniInput}
                        value={formData.weightloss_lbs || ""}
                        onChange={(e) =>
                          handleSpecialWeightChange(
                            "weightloss_lbs",
                            e.target.value
                          )
                        }
                      />
                      <span>BMI:</span>
                      <input
                        type="number"
                        placeholder="BMI"
                        style={styles.miniInput}
                        value={formData.weightloss_bmi || ""}
                        onChange={(e) =>
                          handleSpecialWeightChange(
                            "weightloss_bmi",
                            e.target.value
                          )
                        }
                      />
                      <select
                        style={styles.select}
                        value={formData.weightloss_weight_status || ""}
                        onChange={(e) =>
                          handleSpecialWeightChange(
                            "weightloss_weight_status",
                            e.target.value
                          )
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
                      style={styles.textarea}
                      placeholder="Additional comments (optional)"
                      value={formData.weightloss_manual_comment || ""}
                      onChange={(e) =>
                        handleManualWeightCommentChange(e.target.value)
                      }
                    />
                  </div>
                ) : key === "kasper" ? (
                  <div style={styles.commentGroup}>
                    <input
                      type="text"
                      style={styles.inputText}
                      readOnly
                      placeholder="Auto-generated comment"
                      value={formData.kasper_comment || ""}
                    />
                    <div style={styles.subFieldRow}>
                      <select
                        style={styles.select}
                        value={formData.kasper_source || ""}
                        onChange={(e) =>
                          handleKasperFieldChange(
                            "kasper_source",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Source</option>
                        <option value="HEP">HEP</option>
                        <option value="KASPER">KASPER</option>
                        <option value="At Home">At Home</option>
                      </select>
                      <input
                        type="text"
                        placeholder="e.g. 2"
                        style={styles.miniInput}
                        value={formData.kasper_frequency || ""}
                        onChange={(e) =>
                          handleKasperFieldChange(
                            "kasper_frequency",
                            e.target.value
                          )
                        }
                      />
                      <select
                        style={styles.select}
                        value={formData.kasper_frequency_unit || ""}
                        onChange={(e) =>
                          handleKasperFieldChange(
                            "kasper_frequency_unit",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Frequency</option>
                        <option value="years +">years +</option>
                        <option value="times a week">times a week</option>
                        <option value="times a month">times a month</option>
                      </select>
                      <span>Sessions:</span>
                      <input
                        type="text"
                        placeholder="#"
                        style={styles.miniInput}
                        value={formData.kasper_sessions || ""}
                        onChange={(e) =>
                          handleKasperFieldChange(
                            "kasper_sessions",
                            e.target.value
                          )
                        }
                      />
                      <select
                        style={styles.select}
                        value={formData.kasper_status || ""}
                        onChange={(e) =>
                          handleKasperFieldChange(
                            "kasper_status",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Status</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      style={styles.textarea}
                      placeholder="Additional comments (optional)"
                      value={formData.kasper_manual_comment || ""}
                      onChange={(e) =>
                        handleManualKasperCommentChange(e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    style={styles.inputText}
                    placeholder="Enter comments"
                    value={formData[`${key}_comment`] || ""}
                    onChange={(e) => handleCommentChange(key, e.target.value)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplianceWithTreatmentPlan;
