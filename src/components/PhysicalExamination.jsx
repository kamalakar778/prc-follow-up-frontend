import React, { useState, useEffect } from "react";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 1000,
    margin: "0 auto",
    padding: 2,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    borderBottom: "2px solid #ddd",
    paddingBottom: 8,
  },
  group: {
    marginBottom: "-0.85rem",
  },
  labelText: {
    fontWeight: "600",
    marginRight: 6,
    fontSize: 14,
    color: "#444",

  },
  input: {
    width: 60,
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    marginRight: 8,
  },
  inputSmall: {
    width: 40,
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    marginRight: 8,
  },
  inputMedium: {
    width: 120,
    padding: "6px 8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    marginRight: 8,
  },
  select: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    fontSize: 14,
    marginRight: 12,
    minWidth: 160,
    cursor: "pointer",
  },
  inlineGroup: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
};

const PhysicalExamination = ({ onChange }) => {
  // Vitals state
  const [vitals, setVitals] = useState({
    bp: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
    bmi: "",
  });

  // Other physical exam states
  const [generalAppearance, setGeneralAppearance] = useState(
    "Well groomed and content"
  );
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

  // Send combined data up to parent whenever any input changes
  useEffect(() => {
    const vitalsFormatted = `BP: ${vitals.bp || "--"}. Ht: ${
      vitals.heightFeet || "--"
    } feet ${vitals.heightInches || "--"} inches. Wt: ${
      vitals.weight || "--"
    } lbs. BMI: ${vitals.bmi || "--"}`;
    onChange({
      vitals: vitalsFormatted,
      generalAppearance,
      orientation,
      moodAffect,
      gait: `${gait} and with ${assistiveDevice}`,
      stationStance,
      cardiovascular:
        cardiovascular === "Present with pitting edema"
          ? `${cardiovascular} of ${pittingEdema}`
          : cardiovascular,
      lymphadenopathy,
      coordinationBalance,
      motorFunction,
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
    motorFunction,
    onChange,
  ]);

  return (
    <div style={styles.container}>
      <h3 style={styles.sectionTitle}>Physical Examination - Section 1</h3>

      <div style={styles.group}>
        <span style={styles.labelText}>Vitals:</span>
        <input
          type="text"
          value={vitals.bp}
          onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
          placeholder="BP"
          style={styles.input}
        />
        <span style={styles.labelText}>Ht:</span>
        <input
          type="number"
          value={vitals.heightFeet}
          onChange={(e) => setVitals({ ...vitals, heightFeet: e.target.value })}
          placeholder="ft"
          style={styles.inputSmall}
        />
        feet
        <input
          type="number"
          value={vitals.heightInches}
          onChange={(e) =>
            setVitals({ ...vitals, heightInches: e.target.value })
          }
          placeholder="in"
          style={styles.inputSmall}
        />
        inches.
        <span style={{ ...styles.labelText, marginLeft: 12 }}>Wt:</span>
        <input
          type="number"
          value={vitals.weight}
          onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
          placeholder="weight"
          style={styles.input}
        />
        lbs.
        <span style={{ ...styles.labelText, marginLeft: 12 }}>BMI:</span>
        <input
          type="number"
          value={vitals.bmi}
          onChange={(e) => setVitals({ ...vitals, bmi: e.target.value })}
          placeholder="BMI"
          style={styles.input}
        />
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>General appearance is:</span>
        <select
          value={generalAppearance}
          onChange={(e) => setGeneralAppearance(e.target.value)}
          style={styles.select}
        >
          <option>Well groomed and content</option>
          <option>Disheveled</option>
          <option>Fatigued</option>
          <option>Anxious</option>
          <option>Agitated</option>
        </select>
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>Orientation to person, place, and time is:</span>
        <select
          value={orientation}
          onChange={(e) => setOrientation(e.target.value)}
          style={styles.select}
        >
          <option>Correct</option>
          <option>Incorrect</option>
        </select>
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>Mood and Affect are:</span>
        <select
          value={moodAffect}
          onChange={(e) => setMoodAffect(e.target.value)}
          style={styles.select}
        >
          <option>Appropriate</option>
          <option>Depressed</option>
          <option>Anxious</option>
          <option>Flat</option>
          <option>Euphoric</option>
        </select>
      </div>

      <div style={{ ...styles.group, ...styles.inlineGroup }}>
        <span style={styles.labelText}>Gait is:</span>
        <select value={gait} onChange={(e) => setGait(e.target.value)} style={styles.select}>
          <option>Within normal limits</option>
          <option>Antalgic</option>
          <option>Ataxic</option>
          <option>Spastic</option>
        </select>

        <span style={styles.labelText}>and with</span>

        <select
          value={assistiveDevice}
          onChange={(e) => setAssistiveDevice(e.target.value)}
          style={styles.select}
        >
          <option>No assistive device</option>
          <option>Cane</option>
          <option>Walker</option>
          <option>Wheelchair</option>
        </select>
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>Station (stance) is:</span>
        <select
          value={stationStance}
          onChange={(e) => setStationStance(e.target.value)}
          style={styles.select}
        >
          <option>steady</option>
          <option>unsteady</option>
        </select>
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>Cardiovascularly ankle swelling is:</span>
        <select
          value={cardiovascular}
          onChange={(e) => setCardiovascular(e.target.value)}
          style={styles.select}
        >
          <option>Not present</option>
          <option>Present with pitting edema</option>
        </select>

        {cardiovascular === "Present with pitting edema" && (
          <input
            type="text"
            value={pittingEdema}
            onChange={(e) => setPittingEdema(e.target.value)}
            placeholder="e.g., lower limbs"
            style={styles.inputMedium}
          />
        )}
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>Lymphadenopathy in cervical/inguinal nodes:</span>
        <select
          value={lymphadenopathy}
          onChange={(e) => setLymphadenopathy(e.target.value)}
          style={styles.select}
        >
          <option>Not present</option>
          <option>Present</option>
        </select>
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>Coordination and Balance shows Romberg test is:</span>
        <select
          value={coordinationBalance}
          onChange={(e) => setCoordinationBalance(e.target.value)}
          style={styles.select}
        >
          <option>Negative</option>
          <option>Positive</option>
        </select>
      </div>

      <div style={styles.group}>
        <span style={styles.labelText}>Motor function:</span>
        <select
          value={motorFunction}
          onChange={(e) => setMotorFunction(e.target.value)}
          style={styles.select}
        >
          <option>No change</option>
          <option>Weakness present</option>
        </select>
      </div>
    </div>
  );
};

export default PhysicalExamination;
