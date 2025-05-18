import React, { useState, useEffect } from 'react';

const createEmptySection = () => ({
  date: '',
  preExisting: '',
  cc: '',
  palpationMuscle: '',
  palpationJoint: '',
  rom: '',
  comments: '',
  sensory: '',
});

const EarlierFollowups = ({ onDataChange }) => {
  const [sections, setSections] = useState([createEmptySection()]);

  useEffect(() => {
    const formatted = sections.map((s, i) => (
      // `Section ${i + 1}:\n` +
      `Date: ${s.date}\n` +
      `Pre-existing: ${s.preExisting}\n` +
      `CC: ${s.cc}\n` +
      `\n`+
      `Palpation revealed: \n`+
      `${s.palpationMuscle} muscle tenderness`+
      `${s.palpationJoint} joint tenderness\n` +
      `\n`+
      `R.O.M. revealed: \n` +
      `${s.rom} decrease in gross movement\n` +
      `\n`+
      `Comments: ${s.comments}\n` +
      `\n`+
      `Sensory changes: ${s.sensory}\n`
    )).join('\n');
    onDataChange(formatted);
  }, [sections, onDataChange]);

  const handleChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const addSection = () => {
    setSections([...sections, createEmptySection()]);
  };

  const removeSection = (index) => {
    if (sections.length === 1) return;
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  return (
    <div className="p-4 space-y-6 border rounded shadow">
      <h2 className="font-bold text-lg">Earlier Followups</h2>
      {sections.map((section, index) => (
        <div key={index} className="border p-4 rounded space-y-2">
          <h3 className="font-semibold">Section {index + 1}</h3>
          <input
            type="date"
            value={section.date}
            onChange={e => handleChange(index, 'date', e.target.value)}
            className="block w-full border p-1"
          />
          <input placeholder="Pre-existing" value={section.preExisting} onChange={e => handleChange(index, 'preExisting', e.target.value)} className="block w-full border p-1" />
          <input placeholder="CC" value={section.cc} onChange={e => handleChange(index, 'cc', e.target.value)} className="block w-full border p-1" />
          <input placeholder="Muscle tenderness" value={section.palpationMuscle} onChange={e => handleChange(index, 'palpationMuscle', e.target.value)} className="block w-full border p-1" />
          <input placeholder="Joint tenderness" value={section.palpationJoint} onChange={e => handleChange(index, 'palpationJoint', e.target.value)} className="block w-full border p-1" />
          <input placeholder="R.O.M. decrease" value={section.rom} onChange={e => handleChange(index, 'rom', e.target.value)} className="block w-full border p-1" />
          <input placeholder="Comments" value={section.comments} onChange={e => handleChange(index, 'comments', e.target.value)} className="block w-full border p-1" />
          <input placeholder="Sensory changes" value={section.sensory} onChange={e => handleChange(index, 'sensory', e.target.value)} className="block w-full border p-1" />
          <button onClick={() => removeSection(index)} className="text-red-500 mt-2">Remove</button>
        </div>
      ))}

      <button onClick={addSection} className="bg-green-500 text-white px-4 py-2 rounded">Add Section</button>
    </div>
  );
};

export default EarlierFollowups;
