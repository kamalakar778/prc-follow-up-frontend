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

  return (
    <div className="mt-4 border p-4 rounded-lg">
      {/* <h2 className="text-xl font-bold mb-2">Patient Compliance with Treatment Plan</h2> */}
      <table className="w-full border border-black text-sm">
        <thead>
          <tr className="border border-black">
            <th className="border px-2 py-1"></th>
            <th className="border px-2 py-1">Yes</th>
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">N.A.</th>
            <th className="border px-2 py-1">Comments</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(({ label, key }, index) => (
            <tr key={index} className="border border-black">
              <td className="border px-2 py-1">{label}</td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="radio"
                  name={key}
                  checked={formData[`${key}_yes`] === "Yes"}
                  onChange={() => handleChange(key, "Yes")}
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="radio"
                  name={key}
                  checked={formData[`${key}_no`] === "No"}
                  onChange={() => handleChange(key, "No")}
                />
              </td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="radio"
                  name={key}
                  checked={formData[`${key}_na`] === "NA"}
                  onChange={() => handleChange(key, "NA")}
                />
              </td>
              <td className="border px-2 py-1 ">
                {key === "weightloss" ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        type="text"
                        className="border px-1 w-full "
                        placeholder="Auto-generated comment"
                        value={formData.weightloss_comment || ""}
                        readOnly
                      />
                      <select
                        className="border px-1"
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
                        className="border px-1 w-16"
                        value={formData.weightloss_lbs || ""}
                        onChange={(e) => handleSpecialWeightChange("weightloss_lbs", e.target.value)}
                      />
                      <span>BMI:</span>
                      <input
                        type="number"
                        placeholder="BMI"
                        className="border px-1 w-16"
                        value={formData.weightloss_bmi || ""}
                        onChange={(e) => handleSpecialWeightChange("weightloss_bmi", e.target.value)}
                      />
                      <select
                        className="border px-1"
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
                      className="border px-1 mt-1 w-full"
                      rows={2}
                      placeholder="Additional comments (optional)"
                      value={formData.weightloss_manual_comment || ""}
                      onChange={(e) => handleManualWeightCommentChange(e.target.value)}
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    className="w-full border px-1"
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
