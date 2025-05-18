import React, { useState } from 'react';

const HistoryOfPresentIllness = () => {
  const [formData, setFormData] = useState({
    pain_illnesslevel: "",
    activity_illnesslevel: "",
    social_illnesslevel: "",
    job_illnesslevel: "",
    sleep_illnesslevel: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <label>
        HISTORY OF PRESENT ILLNESS: Since their last visit, the:
        <table>
          <tbody>
            <tr>
              <td>
                <label>
                  Pain is:
                  <input
                    list="present-illness"
                    name="pain_illnesslevel"
                    value={formData.pain_illnesslevel}
                    onChange={handleChange}
                  />
                  <datalist id="present-illness">
                    {["More tolerable", "Less tolerable", "Worse", "The same"].map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  Activity level/functioning is:
                  <input
                    list="activity_illnesslevel"
                    name="activity_illnesslevel"
                    value={formData.activity_illnesslevel}
                    onChange={handleChange}
                  />
                  <datalist id="activity_illnesslevel">
                    {["More tolerable", "Less tolerable", "Worse", "The same"].map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  Social Relationships are:
                  <input
                    list="social_illnesslevel"
                    name="social_illnesslevel"
                    value={formData.social_illnesslevel}
                    onChange={handleChange}
                  />
                  <datalist id="social_illnesslevel">
                    {["More tolerable", "Less tolerable", "Worse", "The same"].map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  Job Performance is (if working):
                  <input
                    list="job_illnesslevel"
                    name="job_illnesslevel"
                    value={formData.job_illnesslevel}
                    onChange={handleChange}
                  />
                  <datalist id="job_illnesslevel">
                    {["More tolerable", "Less tolerable", "Worse", "The same"].map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  Sleep Patterns are:
                  <input
                    list="sleep_illnesslevel"
                    name="sleep_illnesslevel"
                    value={formData.sleep_illnesslevel}
                    onChange={handleChange}
                  />
                  <datalist id="sleep_illnesslevel">
                    {["More tolerable", "Less tolerable", "Worse", "The same"].map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </label>
    </>
  );
};

export default HistoryOfPresentIllness;
