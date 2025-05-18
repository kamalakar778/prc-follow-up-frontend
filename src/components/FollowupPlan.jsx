import React, { useState } from 'react';

const FollowupPlan = () => {
  const [nonComplianceSeverity, setNonComplianceSeverity] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [willOrderUDT, setWillOrderUDT] = useState(false);
  const [willNotOrderUDT, setWillNotOrderUDT] = useState(false); // Added state for "Will not order"
  const [unexpectedUTox, setUnexpectedUTox] = useState(false);
  const [pillCount, setPillCount] = useState(false);
  const [ptEval, setPtEval] = useState('');
  const [imaging, setImaging] = useState('');
  const [xrayOf, setXrayOf] = useState('');
  const [behavioralFocus, setBehavioralFocus] = useState('');
  const [referral, setReferral] = useState('');

  const sectionStyle = {
    padding: '16px 0',
    borderBottom: '1px solid #ddd',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    fontWeight: '500',
  };

  const selectStyle = {
    marginLeft: '10px',
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flexShrink: 0,
  };

  const inputStyle = {
    marginLeft: '10px',
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    flex: 1,
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    cursor: 'pointer',
  };

  const checkboxStyle = {
    marginRight: '8px',
  };

  const ulStyle = {
    listStyleType: 'disc',
    paddingLeft: '20px',
    marginTop: '8px',
  };

  const infoTextStyle = {
    marginLeft: '20px',
    marginTop: '8px',
    marginBottom: '16px',
    color: '#555',
    fontSize: '0.9rem',
    lineHeight: 1.4,
  };

  // Handler for "Will not order UDT"
  const handleWillNotOrderChange = () => {
    if (willNotOrderUDT) {
      // if already checked, uncheck it
      setWillNotOrderUDT(false);
    } else {
      setWillNotOrderUDT(true);
      setWillOrderUDT(false);
    }
  };

  // Handler for "Will order UDT"
  const handleWillOrderChange = () => {
    if (willOrderUDT) {
      setWillOrderUDT(false);
    } else {
      setWillOrderUDT(true);
      setWillNotOrderUDT(false);
    }
  };

  const bothUnchecked = !willOrderUDT && !willNotOrderUDT;

  return (
    <div style={{ padding: '16px' }}>
      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>Follow-Up Plan</h2>

        <label style={labelStyle}>
          F/u severity of non-compliance per history:
          <select
            value={nonComplianceSeverity}
            onChange={e => setNonComplianceSeverity(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Significant">Significant</option>
          </select>
        </label>

        <label style={labelStyle}>
          Action taken if non-compliant:
          <select value={actionTaken} onChange={e => setActionTaken(e.target.value)} style={selectStyle}>
            <option value="">Select</option>
            <option value="Counseled">Patient counseled</option>
            <option value="Warned">Final warning before NNCP</option>
            <option value="Discharged">Discharged</option>
          </select>
        </label>

        <p style={{ marginBottom: '12px', fontWeight: '500' }}>
          F/u Review completed for: U-Tox/ORT, KASPER, Medication list, Nursing notes, Treatment goals, etc.
        </p>

        <ul style={ulStyle}>
          <li>Engage in physical therapy and home-based McKenzie stabilization exercises.</li>
          <li>Participate in weight loss program if BMI ≥ 30 (MyFitnessPal app, dietician consult if diabetic).</li>
          <li>Behavioral health program for mental health conditions (coping skills like distraction, guided imagery).</li>
          <li>Stable conditions continue with current treatment.</li>
          <li>Continue or adjust procedure based on 50%+ pain relief.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px' }}>F/u Orders</h2>

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={willNotOrderUDT}
            onChange={handleWillNotOrderChange}
            style={checkboxStyle}
          />
          Will not order a Urine Drug Test (UDT)
        </label>

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={willOrderUDT}
            onChange={handleWillOrderChange}
            style={checkboxStyle}
          />
          Will order a UDT using Instrumented Chemistry Analyzer
        </label>

        {bothUnchecked && (
          <p style={{ fontStyle: 'italic', marginLeft: '24px', color: '#888' }}>
            ________page # point # __________
          </p>
        )}

        {willOrderUDT && (
          <div style={{ marginLeft: '24px', marginBottom: '16px', fontSize: '0.9rem', color: '#444', lineHeight: 1.5 }}>
            <p>1. Review screen results and confirm all prescribed meds.</p>
            <p>2. Confirm non-prescribed drugs and always test for Fentanyl, Meth, Cocaine.</p>
            <p>
              Justification: Monitor adherence, detect misuse/diversion via tools like UDT, KASPER, ORT, etc.
            </p>
            <p>Usually ordered quarterly or more if on opioids.</p>
          </div>
        )}

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={unexpectedUTox}
            onChange={() => setUnexpectedUTox(!unexpectedUTox)}
            style={checkboxStyle}
          />
          Unexpected U-Tox Result (will order pill count + confirmatory screen)
        </label>

        <label style={labelStyle}>
          Physical Therapy Eval & Tx for:
          <input
            type="text"
            value={ptEval}
            onChange={e => setPtEval(e.target.value)}
            style={inputStyle}
            placeholder="e.g. ROM, Strengthening"
          />
        </label>

        <label style={labelStyle}>
          MRI/CT with/without contrast of:
          <input
            type="text"
            value={imaging}
            onChange={e => setImaging(e.target.value)}
            style={inputStyle}
            placeholder="e.g. lumbar spine"
          />
        </label>

        <label style={labelStyle}>
          X-Ray of:
          <input
            type="text"
            value={xrayOf}
            onChange={e => setXrayOf(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Behavioral Health Consult with emphasis on:
          <input
            type="text"
            value={behavioralFocus}
            onChange={e => setBehavioralFocus(e.target.value)}
            style={inputStyle}
            placeholder="e.g. coping skills"
          />
        </label>

        <label style={labelStyle}>
          Will refer to:
          <input
            type="text"
            value={referral}
            onChange={e => setReferral(e.target.value)}
            style={inputStyle}
          />
        </label>
      </div>
    </div>
  );
};

export default FollowupPlan;
