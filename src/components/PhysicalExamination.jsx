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
    marginBottom: 12
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

const ButtonOptions = ({ label, options, value, onChange, multi = false }) => {
  const handleClick = (option) => {
    if (multi) {
      if (value.includes(option)) {
        onChange(value.filter((item) => item !== option));
      } else {
        onChange([...value, option]);
      }
    } else {
      onChange(option);
    }
  };

  const isSelected = (option) => (multi ? value.includes(option) : value === option);

  return (
    <div style={{ ...styles.group, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      {label && (
        <label style={{ ...styles.labelText, marginRight: 12, minWidth: 200 }}>{label}</label>
      )}
      <div>
        {options.map((option) => (
          <span
            key={option}
            style={styles.optionButton(isSelected(option))}
            onClick={() => handleClick(option)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") handleClick(option);
            }}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
};

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

  const [generalAppearance, setGeneralAppearance] = useState([]);
  const [orientation, setOrientation] = useState("Correct");
  const [moodAffect, setMoodAffect] = useState([]);
  const [gait, setGait] = useState([]);
  const [stationStance, setStationStance] = useState("steady");
  const [cardiovascular, setCardiovascular] = useState("Not present");
  const [pittingEdema, setPittingEdema] = useState("");
  const [lymphadenopathy, setLymphadenopathy] = useState("Not present");
  const [coordinationBalance, setCoordinationBalance] = useState("Negative");
  const [motorFunction, setMotorFunction] = useState({ status: "No", description: "" });

  useEffect(() => {
    const vitalsFormatted = `BP: ${vitals.bp || "--"}. Ht: ${vitals.heightFeet || "--"} feet ${
      vitals.heightInches || "--"
    } inches. Wt: ${vitals.weight || "--"} lbs. BMI: ${vitals.bmi || "--"}`;

    const motorFunctionText = `${motorFunction.status} and observed change in motor and/or sensory function since last visit. ${motorFunction.description}`;

    onChangeRef.current({
      vitals: vitalsFormatted,
      generalAppearance: generalAppearance.length ? generalAppearance.join(", ") : "None",
      orientation,
      moodAffect: moodAffect.length ? moodAffect.join(", ") : "None",
      gait: gait.length ? gait.join(", ") : "None",
      stationStance,
      cardiovascular:
        cardiovascular === "Present with pitting edema"
          ? `${cardiovascular} of ${pittingEdema}`
          : cardiovascular,
      lymphadenopathy,
      coordinationBalance,
      motorFunction: motorFunctionText
    });
  }, [
    vitals,
    generalAppearance,
    orientation,
    moodAffect,
    gait,
    stationStance,
    cardiovascular,
    pittingEdema,
    lymphadenopathy,
    coordinationBalance,
    motorFunction
  ]);

  return (
    <div style={styles.container}>
      {/* Vitals */}
      <div style={styles.group}>
        <label style={styles.labelText}>Vitals:</label>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          {/* BP: */}
          <input
            type="text"
            value={vitals.bp}
            onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
            placeholder="BP"
            style={styles.input}
          />
          Ht:
          <input
            type="number"
            value={vitals.heightFeet}
            onChange={(e) => setVitals({ ...vitals, heightFeet: e.target.value })}
            placeholder="ft"
            style={styles.inputSmall}
          />
          <input
            type="number"
            value={vitals.heightInches}
            onChange={(e) => setVitals({ ...vitals, heightInches: e.target.value })}
            placeholder="in"
            style={styles.inputSmall}
          />
          Wt:
          <input
            type="number"
            value={vitals.weight}
            onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
            placeholder="lbs"
            style={styles.input}
          />
          BMI:
          <input
            type="number"
            value={vitals.bmi}
            onChange={(e) => setVitals({ ...vitals, bmi: e.target.value })}
            placeholder="BMI"
            style={styles.input}
          />
        </div>
      </div>

      <ButtonOptions
        label="General appearance is:"
        options={["Well groomed and content", "Disheveled", "Fatigued", "Anxious", "Agitated"]}
        value={generalAppearance}
        onChange={setGeneralAppearance}
        multi={true}
      />

      <ButtonOptions
        label="Orientation to person, place, and time is:"
        options={["Correct", "Incorrect"]}
        value={orientation}
        onChange={setOrientation}
      />

      <ButtonOptions
        label="Mood and Affect are:"
        options={["Appropriate", "Depressed", "Anxious", "Flat", "Euphoric"]}
        value={moodAffect}
        onChange={setMoodAffect}
        multi={true}
      />

      <ButtonOptions
        label="Gait is:"
        options={["Within normal limits", "Antalgic", "Ataxic", "Spastic", "________"]}
        value={gait}
        onChange={setGait}
        multi={true}
      />
      <ButtonOptions
        label="Assistive device (Gait):"
        options={["wheelchair-bound", "wheelchair"]}
        value={gait}
        onChange={setGait}
        multi={true}
      />

      <ButtonOptions
        label="Station (stance) is:"
        options={["steady", "unsteady"]}
        value={stationStance}
        onChange={setStationStance}
      />

      <ButtonOptions
        label="Cardiovascularly ankle swelling is:"
        options={["Not present", "Present with pitting edema"]}
        value={cardiovascular}
        onChange={setCardiovascular}
      />

      {cardiovascular === "Present with pitting edema" && (
        <input
          type="text"
          value={pittingEdema}
          onChange={(e) => setPittingEdema(e.target.value)}
          placeholder="e.g., lower limbs"
          style={styles.inputMedium}
        />
      )}

      <ButtonOptions
        label="Lymphadenopathy in cervical/inguinal nodes:"
        options={["Not present", "Present"]}
        value={lymphadenopathy}
        onChange={setLymphadenopathy}
      />

      <ButtonOptions
        label="Romberg test is:"
        options={["Negative", "Positive"]}
        value={coordinationBalance}
        onChange={setCoordinationBalance}
      />

      <ButtonOptions
        label="Motor Function Observed:"
        options={["No", "Positive"]}
        value={motorFunction.status}
        onChange={(status) => setMotorFunction({ ...motorFunction, status })}
      />

      <div style={styles.group}>
        <label style={styles.labelText}>Motor Function Description:</label>
        <input
          type="text"
          value={motorFunction.description}
          onChange={(e) =>
            setMotorFunction({ ...motorFunction, description: e.target.value })
          }
          placeholder="e.g., weakness in right leg"
          style={{ ...styles.inputMedium, width: 300 }}
        />
      </div>
    </div>
  );
};

export default PhysicalExamination;
