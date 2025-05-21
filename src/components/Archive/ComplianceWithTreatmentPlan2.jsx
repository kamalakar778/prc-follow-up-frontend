import React, { useEffect } from 'react';

const ComplianceWithTreatmentPlan = ({ formData = {}, setFormData }) => {
  const handleChange = (baseKey, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [`${baseKey}_yes`]: selectedOption === "Yes" ? "Yes" : "",
      [`${baseKey}_no`]: selectedOption === "No" ? "No" : "",
      [`${baseKey}_na`]: selectedOption === "NA" ? "NA" : ""
    }));
  };

  const handleCommentChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [`${key}_comment`]: value
    }));
  };

  const handleSpecialWeightChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualWeightCommentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      weightloss_manual_comment: value
    }));
  };

  useEffect(() => {
    const autoComment = `${formData.weightloss_change_type || "—"} ${formData.weightloss_lbs || "—"} lbs. BMI: ${formData.weightloss_bmi || "—"}. Weight: ${formData.weightloss_weight_status || "—"}`;
    const manualComment = formData.weightloss_manual_comment || "";
    setFormData(prev => ({
      ...prev,
      weightloss_comment: `${autoComment}${manualComment ? ".  " + manualComment : ""}`
    }));
  }, [
    formData.weightloss_change_type,
    formData.weightloss_lbs,
    formData.weightloss_bmi,
    formData.weightloss_weight_status,
    formData.weightloss_manual_comment
  ]);

  const questions = [
    { label: "U-tox and/or Pill Count O.K.?", key: "tox_count" },
    { label: "KASPER report O.K.?", key: "kasper" },
    { label: "Participates in PT or home exercise prgm", key: "pt" },
    { label: "Ordered imaging studies completed", key: "imaging" },
    { label: "Participated in Weight Loss Prgm", key: "weightloss" },
    { label: "Participated with Counselor if recommended", key: "counselor" }
  ];

  const styles = {
    container: {
      marginTop: '1rem',
      padding: '0.5rem',
      border: '1px solid black',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      lineHeight: '1.25rem'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '1px solid black',
      padding: '0.25rem',
      textAlign: 'center'
    },
    td: {
      border: '1px solid black',
      padding: '0.25rem',
      verticalAlign: 'top'
    },
    inputText: {
      width: '95%',
      padding: '0.125rem',
      border: '1px solid #ccc'
    },
    select: {
      padding: '0.125rem',
      border: '1px solid #ccc',
      marginRight: '0.25rem'
    },
    
    miniInput: {
      width: '3.5rem',
      padding: '0.125rem',
      border: '1px solid #ccc',
      marginRight: '0.25rem'
    },
    textarea: {
      width: '95%',
      padding: '0.10rem',
      border: '1px solid #ccc',
      resize: 'vertical',
      marginTop: '0.25rem'
    },
    radio: {
      textAlign: 'center'
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
              <td style={{ ...styles.td, ...styles.radio }}>
                <input
                  type="radio"
                  name={key}
                  checked={formData[`${key}_yes`] === "Yes"}
                  onChange={() => handleChange(key, "Yes")}
                />
              </td>
              <td style={{ ...styles.td, ...styles.radio }}>
                <input
                  type="radio"
                  name={key}
                  checked={formData[`${key}_no`] === "No"}
                  onChange={() => handleChange(key, "No")}
                />
              </td>
              <td style={{ ...styles.td, ...styles.radio }}>
                <input
                  type="radio"
                  name={key}
                  checked={formData[`${key}_na`] === "NA"}
                  onChange={() => handleChange(key, "NA")}
                />
              </td>
              <td style={styles.td}>
                {key === "weightloss" ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        style={styles.inputText}
                        placeholder="Auto-generated comment"
                        value={formData.weightloss_comment || ""}
                        readOnly
                      />
                      <select
                        style={styles.select}
                        value={formData.weightloss_change_type || ""}
                        onChange={(e) => handleSpecialWeightChange("weightloss_change_type", e.target.value)}
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
                        onChange={(e) => handleSpecialWeightChange("weightloss_lbs", e.target.value)}
                      />
                      <span>BMI:</span>
                      <input
                        type="number"
                        placeholder="BMI"
                        style={styles.miniInput}
                        value={formData.weightloss_bmi || ""}
                        onChange={(e) => handleSpecialWeightChange("weightloss_bmi", e.target.value)}
                      />
                      <select
                        style={styles.select}
                        value={formData.weightloss_weight_status || ""}
                        onChange={(e) => handleSpecialWeightChange("weightloss_weight_status", e.target.value)}
                      >
                        <option value="">Weight Change</option>
                        <option value="Gain">Gain</option>
                        <option value="Loss">Loss</option>
                        <option value="Same">Same</option>
                      </select>
                    </div>
                    <textarea
                      style={styles.textarea}
                      rows={2}
                      placeholder="Additional comments (optional)"
                      value={formData.weightloss_manual_comment || ""}
                      onChange={(e) => handleManualWeightCommentChange(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    style={styles.inputText}
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
