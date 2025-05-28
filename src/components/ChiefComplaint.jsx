import React, { useState, useEffect } from "react";
import CustomAutoComplete from "./CustomAutoComplete2";

const watermelonRed = "#FF4C4C";

const styles = {
  container: {
    fontFamily: "Calibri",
    fontSize: "16px",
    padding: "20px",
    lineHeight: 1.6
  },
  section: {
    marginBottom: "16px"
  },
  label: {
    display: "inline-block",
    minWidth: "200px"
  },
  input: {
    width: "180px",
    padding: "4px 6px",
    margin: "0 5px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  button: (active) => ({
    marginLeft: 10,
    backgroundColor: active ? "green" : watermelonRed,
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "4px 10px",
    cursor: "pointer"
  }),
  checkboxContainer: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center"
  },
  outputBox: {
    whiteSpace: "pre-wrap",
    backgroundColor: "#f0f0f0",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #ddd"
  }
};

const ChiefComplaint = ({ initialValues = {}, onChange }) => {
  const [inputs, setInputs] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
    input7: "",
    input8: "",
    input9: "",
    input10: "",
    input11: "",
    ...initialValues
  });

  const [removedLines, setRemovedLines] = useState({
    flareUp: false,
    reEvaluation: false,
    spLine: false,
    currentDecrease: false,
    newComplaint: false
  });

  const [addedProcedureReport, setAddedProcedureReport] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRemoveLine = (lineKey) => {
    setRemovedLines((prev) => ({ ...prev, [lineKey]: !prev[lineKey] }));
  };

  const toggleProcedureReport = () => {
    setAddedProcedureReport((prev) => !prev);
  };

  const hasValue = (...names) =>
    names.some((name) => inputs[name]?.trim() !== "");

  const renderFinalText = () => {
    if (!hasValue("input1")) return <em>No information entered yet.</em>;

    const parts = [];

    parts.push(
      <>
        The patients worst pain complaint today is located in their{" "}
        <strong>{inputs.input1 || "__________"}</strong>
        {inputs.input2?.trim() && (
          <>
            , in addition to their other <strong>{inputs.input2}</strong> pain
            complaints
          </>
        )}{" "}
        and presents today to the clinic today for a routine f/u of their usual
        pain complaints and/or medication refill
      </>
    );

    if (!removedLines.flareUp && hasValue("input3")) {
      parts.push(
        <>
          ; flare up of known pain complaints especially pain in the{" "}
          <strong>{inputs.input3 || "__________"}</strong>
        </>
      );
    }

    if (!removedLines.newComplaint && hasValue("input11")) {
      parts.push(
        <>
          ; W/U of a new pain complaint, specifically:{" "}
          <strong>{inputs.input11 || "__________"}</strong>
        </>
      );
    }

    if (!removedLines.reEvaluation && hasValue("input4", "input5", "input6")) {
      parts.push(
        <>
          ; re-evaluation S/P <strong>{inputs.input4 || "__________"}</strong>{" "}
          with <strong>{inputs.input5 || "__________"}</strong> % decrease in
          pain for a duration of{" "}
          <strong>{inputs.input6 || "__________"}</strong>
        </>
      );
    }

    if (!removedLines.spLine && hasValue("input7", "input8", "input9")) {
      parts.push(
        <>
          {" "}
          and S/P <strong>{inputs.input7 || "__________"}</strong> with{" "}
          <strong>{inputs.input8 || "__________"}</strong> decrease in pain
          for a duration of <strong>{inputs.input9 || "__________"}</strong>
        </>
      );
    }

    if (!removedLines.currentDecrease && hasValue("input10")) {
      parts.push(
        <>
          {" "}
          and currently with <strong>{inputs.input10 || "__________"}</strong> %
          decrease in pain.
        </>
      );
    } else {
      parts.push(".");
    }

    if (addedProcedureReport) {
      parts.push(
        <>
          <br />
          Report that they have received at least 80% temporary pain relief from
          left, right and bilateral medial branch blocks - confirmed per
          procedure log record.
        </>
      );
    }

    return parts.reduce((prev, curr) => [prev, curr]);
  };

  const finalText = (() => {
    if (!hasValue("input1")) return "";

    let text = `The patients worst pain complaint today is located in their ${inputs.input1}`;
    if (inputs.input2?.trim()) {
      text += `, in addition to their other ${inputs.input2} pain complaints`;
    }
    text += ` and presents today to the clinic today for a routine f/u of their usual pain complaints and/or medication refill`;

    if (!removedLines.flareUp && hasValue("input3")) {
      text += `; flare up of known pain complaints especially pain in the ${inputs.input3}`;
    }

    if (!removedLines.newComplaint && hasValue("input11")) {
      text += `; W/U of a new pain complaint, specifically: ${inputs.input11}`;
    }

    if (!removedLines.reEvaluation && hasValue("input4", "input5", "input6")) {
      text += `; re-evaluation S/P ${inputs.input4} with ${inputs.input5} % decrease in pain for a duration of ${inputs.input6}`;
    }

    if (!removedLines.spLine && hasValue("input7", "input8", "input9")) {
      text += ` and S/P ${inputs.input7} with ${inputs.input8} % decrease in pain for a duration of ${inputs.input9}`;
    }

    if (!removedLines.currentDecrease && hasValue("input10")) {
      text += ` and currently with ${inputs.input10} decrease in pain.`;
    } else {
      text += ".";
    }

    if (addedProcedureReport) {
      text +=
        "\nReport that they have received at least 80% temporary pain relief from left, right and bilateral medial branch blocks - confirmed per procedure log record.";
    }

    return text;
  })();

  useEffect(() => {
    if (onChange) {
      onChange({
        inputValues: inputs,
        finalText,
        removedLines,
        addedProcedureReport
      });
    }
  }, [inputs, finalText, removedLines, addedProcedureReport, onChange]);

  return (
    <div style={styles.container}>
      <div style={styles.outputBox}>{renderFinalText()}</div>
      <div style={styles.section}>
        The patient's worst pain complaint today is located in their
        <input
          type="text"
          name="input1"
          value={inputs.input1}
          onChange={handleChange}
          style={styles.input}
          placeholder="Location"
        />
        , in addition to their other
        <input
          type="text"
          name="input2"
          value={inputs.input2}
          onChange={handleChange}
          style={styles.input}
          placeholder="Other pain"
        />
        complaints.
      </div>
      <div style={styles.section}>
        Flare up in
        <input
          type="text"
          name="input3"
          value={inputs.input3}
          onChange={handleChange}
          style={styles.input}
          placeholder="input3"
        />
        <button
          onClick={() => toggleRemoveLine("flareUp")}
          style={styles.button(removedLines.flareUp)}
        >
          {removedLines.flareUp ? "Add" : "Remove"}
        </button>
      </div>
      <div style={styles.section}>
        W/U of a new pain complaint, specifically:
        <input
          type="text"
          name="input11"
          value={inputs.input11}
          onChange={handleChange}
          style={styles.input}
          placeholder="New pain complaint"
        />
        <button
          onClick={() => toggleRemoveLine("newComplaint")}
          style={styles.button(removedLines.newComplaint)}
        >
          {removedLines.newComplaint ? "Add" : "Remove"}
        </button>
      </div>
      <div style={styles.section}>
        Re-evaluation S/P
        <input
          type="text"
          name="input4"
          value={inputs.input4}
          onChange={handleChange}
          style={styles.input}
          placeholder="input4"
        />
        with
        <input
          type="text"
          name="input5"
          value={inputs.input5}
          onChange={handleChange}
          style={styles.input}
          placeholder="input5"
        />
        % decrease for
        <input
          type="text"
          name="input6"
          value={inputs.input6}
          onChange={handleChange}
          style={styles.input}
          placeholder="input6"
        />
        <button
          onClick={() => toggleRemoveLine("reEvaluation")}
          style={styles.button(removedLines.reEvaluation)}
        >
          {removedLines.reEvaluation ? "Add" : "Remove"}
        </button>
      </div>
      <div style={styles.section}>
        And S/P
        <input
          type="text"
          name="input7"
          value={inputs.input7}
          onChange={handleChange}
          style={styles.input}
          placeholder="input7"
        />
        with
        <input
          type="text"
          name="input8"
          value={inputs.input8}
          onChange={handleChange}
          style={styles.input}
          placeholder="input8"
        />
        % decrease for
        <input
          type="text"
          name="input9"
          value={inputs.input9}
          onChange={handleChange}
          style={styles.input}
          placeholder="input9"
        />
        <button
          onClick={() => toggleRemoveLine("spLine")}
          style={styles.button(removedLines.spLine)}
        >
          {removedLines.spLine ? "Add" : "Remove"}
        </button>
      </div>
      <div style={styles.section}>
        Currently with
        <input
          type="text"
          name="input10"
          value={inputs.input10}
          onChange={handleChange}
          style={styles.input}
          placeholder="input10"
        />
        % decrease
        <button
          onClick={() => toggleRemoveLine("currentDecrease")}
          style={styles.button(removedLines.currentDecrease)}
        >
          {removedLines.currentDecrease ? "Add" : "Remove"}
        </button>
      </div>
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={addedProcedureReport}
          onChange={toggleProcedureReport}
          style={{ marginRight: 8 }}
        />
        Include procedure report summary
      </div>
    </div>
  );
};

export default ChiefComplaint;
