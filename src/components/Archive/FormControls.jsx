import React, { useState } from 'react';

const FormControls = ({ onGenerate }) => {
  const [fileName, setFileName] = useState('');

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleReset = () => {
    setFileName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    // Call parent handler or local logic
    if (onGenerate) {
      onGenerate(fileName);
    } else {
      console.log('Generating document with file name:', fileName);
      // Add your logic to generate a document here
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginTop: "1rem"
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        File Name:
        <input
          type="text"
          value={fileName}
          onChange={handleFileNameChange}
          placeholder="Follow Up File Name"
        />
      </label>

      <button type="submit">Generate Document</button>

      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

export default FormControls;
