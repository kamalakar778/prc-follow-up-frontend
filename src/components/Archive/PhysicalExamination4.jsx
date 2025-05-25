import React, { useState, useEffect, useRef } from "react";

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
  group: {
    marginBottom: 20
  },
  labelText: {
    fontWeight: 600,
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    display: "block"
  },
  input: {
    width: 60,
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    marginRight: 8
  },
  inputSmall: {
    width: 40,
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    marginRight: 8
  },
  inputMedium: {
    width: 120,
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    marginRight: 8
  },
  optionButton: (isSelected) => ({
    marginRight: 6,
    marginBottom: 6,
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: isSelected ? "green" : "gray",
    backgroundColor: isSelected ? "#e0f7e9" : "#f5f5f5",
    color: isSelected ? "green" : "gray",
    display: "inline-block",
    fontWeight: isSelected ? "bold" : "normal"
  })
};

const ButtonOptions = ({ label, options, value, onChange }) => (
  <div style={{ ...styles.group, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
    <label style={{ ...styles.labelText, marginRight: 12, minWidth: 200 }}>{label}</label>
    <div>
      {options.map((option) => (
        <span
          key={option}
          style={styles.optionButton(value === option)}
          onClick={() => onChange(option)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") onChange(option);
          }}
        >
          {option}
        </span>
      ))}
    </div>
  </div>
);

const PhysicalExamination = ({ onChange }) => {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [vitals, setVitals] = useState({
    bp: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    bmi: ""
  });

  const [generalAppearance, setGeneralAppearance] = useState("Well groomed and content");
  const [orientation, setOrientation] = useState("Correct");
  const [moodAffect, setMoodAffect] = useState("Appropriate");
  const [gait, setGait] = useState("Within normal limits");
  const [assistiveDevice, setAssistiveDevice] = useState("No assistive device");
  const [stationStance, setStationStance] = useState("steady");
  const [cardiovascular, setCardiovascular] = useState("Not present");
  const [pittingEdema, setPittingEdema] = useState("");
  const [lymphadenopathy, setLymphadenopathy] = useState("Not present");
  const [coordinationBalance, setCoordinationBalance] = useState("Negative");
  const [motorFunction, setMotorFunction] = useState("No change");

  useEffect(() => {
    const vitalsFormatted = `BP: ${vitals.bp || "--"}. Ht: ${vitals.heightFeet || "--"} feet ${vitals.heightInches || "--"} inches. Wt: ${vitals.weight || "--"} lbs. BMI: ${vitals.bmi || "--"}`;
    onChangeRef.current({
      vitals: vitalsFormatted,
      generalAppearance,
      orientation,
      moodAffect,
      gait: `${gait} and with ${assistiveDevice}`,
      stationStance,
      cardiovascular: cardiovascular === "Present with pitting edema" ? `${cardiovascular} of ${pittingEdema}` : cardiovascular,
      lymphadenopathy,
      coordinationBalance,
      motorFunction
    });
  }, [
    vitals,
    generalAppearance,
    orientation,
    moodAffect,
    gait,
    assistiveDevice,
    stationStance,
    cardiovascular,
    pittingEdema,
    lymphadenopathy,
    coordinationBalance,
    motorFunction
  ]);

  return (
    <div style={styles.container}>
      {/* Vitals Input */}
      <div style={styles.group}>
        <label style={styles.labelText}>Vitals:</label>
        <input type="text" value={vitals.bp} onChange={(e) => setVitals({ ...vitals, bp: e.target.value })} placeholder="BP" style={styles.input} />
        <input type="number" value={vitals.heightFeet} onChange={(e) => setVitals({ ...vitals, heightFeet: e.target.value })} placeholder="ft" style={styles.inputSmall} />
        <input type="number" value={vitals.heightInches} onChange={(e) => setVitals({ ...vitals, heightInches: e.target.value })} placeholder="in" style={styles.inputSmall} />
        <input type="number" value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} placeholder="lbs" style={styles.input} />
        <input type="number" value={vitals.bmi} onChange={(e) => setVitals({ ...vitals, bmi: e.target.value })} placeholder="BMI" style={styles.input} />
      </div>

      <ButtonOptions label="General appearance is:" options={["Well groomed and content", "Disheveled", "Fatigued", "Anxious", "Agitated"]} value={generalAppearance} onChange={setGeneralAppearance} />
      <ButtonOptions label="Orientation to person, place, and time is:" options={["Correct", "Incorrect"]} value={orientation} onChange={setOrientation} />
      <ButtonOptions label="Mood and Affect are:" options={["Appropriate", "Depressed", "Anxious", "Flat", "Euphoric"]} value={moodAffect} onChange={setMoodAffect} />
      <ButtonOptions label="Gait is:" options={["Within normal limits", "Antalgic", "Ataxic", "Spastic"]} value={gait} onChange={setGait} />
      <ButtonOptions label="Assistive device:" options={["No assistive device", "Cane", "Walker", "Wheelchair"]} value={assistiveDevice} onChange={setAssistiveDevice} />
      <ButtonOptions label="Station (stance) is:" options={["steady", "unsteady"]} value={stationStance} onChange={setStationStance} />
      <ButtonOptions label="Cardiovascularly ankle swelling is:" options={["Not present", "Present with pitting edema"]} value={cardiovascular} onChange={setCardiovascular} />

      {cardiovascular === "Present with pitting edema" && (
        <input type="text" value={pittingEdema} onChange={(e) => setPittingEdema(e.target.value)} placeholder="e.g., lower limbs" style={styles.inputMedium} />
      )}

      <ButtonOptions label="Lymphadenopathy in cervical/inguinal nodes:" options={["Not present", "Present"]} value={lymphadenopathy} onChange={setLymphadenopathy} />
      <ButtonOptions label="Romberg test is:" options={["Negative", "Positive"]} value={coordinationBalance} onChange={setCoordinationBalance} />
      <ButtonOptions label="Motor function:" options={["No change", "Weakness present"]} value={motorFunction} onChange={setMotorFunction} />
    </div>
  );
};

export default PhysicalExamination;
