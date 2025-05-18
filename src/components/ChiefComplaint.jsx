import React, { useState, useEffect } from "react";

const watermelonRed = "#FF4C4C";

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
    ...initialValues
  });

  const [removedLines, setRemovedLines] = useState({
    flareUp: false,
    reEvaluation: false,
    spLine: false,
    currentDecrease: false
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
    if (!hasValue("input1", "input2"))
      return <em>No information entered yet.</em>;

    const parts = [];

    parts.push(
      <>
        The patients worst pain complaint today is located in their{" "}
        <strong>{inputs.input1 || "__________"}</strong>, in addition to their
        other <strong>{inputs.input2 || "__________"}</strong> pain complaints
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
          <strong>{inputs.input8 || "__________"}</strong> % decrease in pain
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

  let finalText = "";

  if (hasValue("input1", "input2")) {
    finalText += `The patients worst pain complaint today is located in their ${
      inputs.input1 || "__________"
    }, in addition to their other ${
      inputs.input2 || "__________"
    } pain complaints and presents today to the clinic today for a routine f/u of their usual pain complaints and/or medication refill`;
  }

  if (!removedLines.flareUp && hasValue("input3")) {
    finalText += `; flare up of known pain complaints especially pain in the ${
      inputs.input3 || "__________"
    }`;
  }

  if (!removedLines.reEvaluation && hasValue("input4", "input5", "input6")) {
    finalText += `; re-evaluation S/P ${inputs.input4 || "__________"} with ${
      inputs.input5 || "__________"
    } % decrease in pain for a duration of ${inputs.input6 || "__________"}`;
  }

  if (!removedLines.spLine && hasValue("input7", "input8", "input9")) {
    finalText += ` and S/P ${inputs.input7 || "__________"} with ${
      inputs.input8 || "__________"
    } % decrease in pain for a duration of ${inputs.input9 || "__________"}`;
  }

  if (!removedLines.currentDecrease && hasValue("input10")) {
    finalText += ` and currently with ${
      inputs.input10 || "__________"
    } % decrease in pain.`;
  } else {
    finalText += ".";
  }

  if (addedProcedureReport) {
    finalText +=
      "\nReport that they have received at least 80% temporary pain relief from left, right and bilateral medial branch blocks - confirmed per procedure log record.";
  }

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
    <div style={{ fontFamily: "Calibri", fontSize: "16px" }}>
      <strong>CHIEF COMPLAINT:</strong>
      <h3>Final Text Output:</h3>
      <div
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px"
        }}
      >
        {renderFinalText()}
      </div>

      {/* Input fields */}
      <p>
        The patients worst pain complaint today is located in their{" "}
        <input
          type="text"
          name="input1"
          value={inputs.input1}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input1"
        />
        , in addition to their other{" "}
        <input
          type="text"
          name="input2"
          value={inputs.input2}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input2"
        />{" "}
        pain complaints and presents today to the clinic today for a routine f/u
        of their usual pain complaints and/or medication refill.
      </p>

      <p>
        Flare up of known pain complaints especially pain in the{" "}
        <input
          type="text"
          name="input3"
          value={inputs.input3}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input3"
        />
        .
        <button
          onClick={() => toggleRemoveLine("flareUp")}
          style={{
            marginLeft: 10,
            backgroundColor: removedLines.flareUp ? "green" : watermelonRed,
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer"
          }}
        >
          {removedLines.flareUp ? "Add" : "Remove"}
        </button>
      </p>

      <p>
        Re-evaluation S/P{" "}
        <input
          type="text"
          name="input4"
          value={inputs.input4}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input4"
        />{" "}
        with{" "}
        <input
          type="text"
          name="input5"
          value={inputs.input5}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input5"
        />{" "}
        % decrease in pain for a duration of{" "}
        <input
          type="text"
          name="input6"
          value={inputs.input6}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input6"
        />
        .
        <button
          onClick={() => toggleRemoveLine("reEvaluation")}
          style={{
            marginLeft: 10,
            backgroundColor: removedLines.reEvaluation
              ? "green"
              : watermelonRed,
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer"
          }}
        >
          {removedLines.reEvaluation ? "Add" : "Remove"}
        </button>
      </p>

      <p>
        And S/P{" "}
        <input
          type="text"
          name="input7"
          value={inputs.input7}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input7"
        />{" "}
        with{" "}
        <input
          type="text"
          name="input8"
          value={inputs.input8}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input8"
        />{" "}
        % decrease in pain for a duration of{" "}
        <input
          type="text"
          name="input9"
          value={inputs.input9}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input9"
        />
        .
        <button
          onClick={() => toggleRemoveLine("spLine")}
          style={{
            marginLeft: 10,
            backgroundColor: removedLines.spLine ? "green" : watermelonRed,
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer"
          }}
        >
          {removedLines.spLine ? "Add" : "Remove"}
        </button>
      </p>

      <p>
        Currently with{" "}
        <input
          type="text"
          name="input10"
          value={inputs.input10}
          onChange={handleChange}
          style={{ width: 150 }}
          placeholder="input10"
        />{" "}
        % decrease in pain.
        <button
          onClick={() => toggleRemoveLine("currentDecrease")}
          style={{
            marginLeft: 10,
            backgroundColor: removedLines.currentDecrease
              ? "green"
              : watermelonRed,
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer"
          }}
        >
          {removedLines.currentDecrease ? "Add" : "Remove"}
        </button>
      </p>

      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={addedProcedureReport}
            onChange={toggleProcedureReport}
            style={{ marginRight: 8 }}
          />
          Include procedure report summary
        </label>
      </div>
    </div>
  );
};

export default ChiefComplaint;
