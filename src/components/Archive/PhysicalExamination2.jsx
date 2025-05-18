import React, { useState } from 'react';

const PhysicalExamination = () => {
const [showTextarea, setShowTextarea] = useState(false);
const [showPredefinedText, setShowPredefinedText] = useState(false);
const [customText, setCustomText] = useState('');
const [finalExamLines, setFinalExamLines] = useState([]);
const [selectedOptions, setSelectedOptions] = useState({});
const [removedLines, setRemovedLines] = useState(new Set());

const DROPDOWN_OPTIONS = ["bilaterally", "on left", "on right", ""];

const rawPredefinedLines = `Other :  ____________ROM is grossly decreased 
    Cervical spine tenderness of paraspinal muscles
    Traps/levator scapula tenderness
    Cervical facet loading signs at C2-C5/C5-T1. Pain (worst) with extension.
    Thoracic spine tenderness of paraspinal muscles
    Trapezius/rhomboid tenderness
    Thoracic facet loading signs at T_____. Pain (worst) with rotation.
    Lumbar spine tenderness of paraspinal and/or quadratus muscles
    Gluteal tenderness
    Lumbar facet loading signs at L2–L5/L3-L5
    Quadrant test
    Slump/SLR
    Patrick test
    SIJ tenderness
    Thigh-Thrust
    Gaenslen test
    Apley scratch
    Crepitus
    Crossover test
    ROM is grossly decreased
    Subacromial tenderness
    Neer Impingement
    Drop Arm Test
    Empty Can Test
    Squat test (hip)
    Trochanteric bursa tenderness
    Patrick test (hip)
    FADIR test (hip)
    Peri-Patella tenderness
    Joint line tenderness
    Drawer Test
    Valgus/Varus stress test
    McMurray test`.trim().split('n');

const handleTextareaChange = (e) => {
setCustomText(e.target.value);
};

const handleCustomTextClick = (e) => {
e.preventDefault();
setShowTextarea(true);
setShowPredefinedText(false);
};

const handlePredefinedTextClick = (e) => {
e.preventDefault();
setShowTextarea(false);
setShowPredefinedText(true);
setRemovedLines(new Set()); // Reset removed lines
};

const handleDropdownChange = (lineIndex, value) => {
setSelectedOptions(prev => ({ ...prev, [lineIndex]: value }));
};

const handleLineClick = (lineIndex) => {
setRemovedLines(prev => {
const updated = new Set(prev);
updated.has(lineIndex) ? updated.delete(lineIndex) : updated.add(lineIndex);
return updated;
});
};

const handleResetClick = (e) => {
e.preventDefault(); // Prevent unnecessary reloads or page refreshes
let newEntries = [];


if (showPredefinedText) {
  newEntries = rawPredefinedLines.map((line, idx) => {
    const selection = selectedOptions[idx] || '';
    return removedLines.has(idx) ? null : (selection ? `${line} (${selection})` : line);
  }).filter(Boolean);
}

setCustomText('');
setSelectedOptions({});
setRemovedLines(new Set());
setShowTextarea(false);
setShowPredefinedText(false);
setFinalExamLines([]); // Reset the final exam lines
```

};

const handleSaveClick = (e) => {
e.preventDefault(); // Prevent unnecessary reloads or page refreshes
let newEntries = [];

```
if (showTextarea && customText.trim()) {
  newEntries = customText.trim().split('n').map(line => line.trim());
} else if (showPredefinedText) {
  newEntries = rawPredefinedLines.map((line, idx) => {
    const selection = selectedOptions[idx] || '';
    return removedLines.has(idx) ? null : (selection ? `${line} (${selection})` : line);
  }).filter(Boolean);
}

setFinalExamLines(prev => [...prev, ...newEntries]);
setCustomText('');
setSelectedOptions({});
setRemovedLines(new Set());
setShowTextarea(false);
setShowPredefinedText(false);


};

return ( <div> <label><strong>PHYSICAL EXAMINATION:</strong></label> <p>The following findings of ESTABLISHED complaints were positive:</p>


  <div style={{ marginTop: '10px' }}>
    <button onClick={handleCustomTextClick}>Input Custom Text</button>
    <button onClick={handlePredefinedTextClick}>Use Predefined Examination Text</button>
    <button onClick={handleSaveClick} style={{ marginLeft: '10px' }}>Save to Final List</button>
    <button onClick={handleResetClick} style={{ marginLeft: '10px' }}>Reset</button>
  </div>

  {/* Custom Textarea */}
  {showTextarea && (
    <div style={{ marginTop: '10px' }}>
      <textarea
        rows={10}
        cols={100}
        value={customText}
        onChange={handleTextareaChange}
        placeholder="Enter custom physical examination text..."
      />
    </div>
  )}

  {/* Predefined Text with Dropdowns and Remove functionality */}
  {showPredefinedText && (
    <div style={{ marginTop: '10px' }}>
      {rawPredefinedLines.map((line, index) => (
        <div
          key={index}
          onClick={() => handleLineClick(index)}
          style={{
            cursor: 'pointer',
            textDecoration: removedLines.has(index) ? 'line-through' : 'none',
            color: removedLines.has(index) ? 'gray' : 'black',
            marginBottom: '5px'
          }}
        >
          {line}
          {' '}
          <select
            value={selectedOptions[index] || ''}
            onChange={(e) => handleDropdownChange(index, e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            {DROPDOWN_OPTIONS.map((opt, i) => (
              <option key={i} value={opt}>{opt || '--Select--'}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )}

  {/* Final Output Section */}
  {finalExamLines.length > 0 && (
    <div style={{ marginTop: '20px' }}>
      <h3>Final Physical Examination Notes:</h3>
      <ul>
        {finalExamLines.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  )}
</div>


);
};

export default PhysicalExamination;
