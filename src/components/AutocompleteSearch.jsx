import React, { useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import Fuse from 'fuse.js';
import axios from 'axios';

const list1 = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
const list2 = ['Fig', 'Grape', 'Honeydew', 'Indian Fig', 'Jackfruit'];

const AutocompleteSearch = () => {
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [selectedItem2, setSelectedItem2] = useState(null);

  const fuse1 = new Fuse(list1, { includeScore: true });
  const fuse2 = new Fuse(list2, { includeScore: true });

  const handleSave = async () => {
    try {
      await axios.post('https://your-backend-api.com/save', {
        item1: selectedItem1,
        item2: selectedItem2,
      });
      alert('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  return (
    <Box sx={{ width: 300, margin: 'auto', paddingTop: 2 }}>
      <Autocomplete
        options={list1}
        getOptionLabel={(option) => option}
        renderInput={(params) => <TextField {...params} label="Select Item 1" />}
        onChange={(_, value) => setSelectedItem1(value)}
        filterOptions={(options, { inputValue }) =>
          fuse1.search(inputValue).map(({ item }) => item)
        }
      />
      <Autocomplete
        options={list2}
        getOptionLabel={(option) => option}
        renderInput={(params) => <TextField {...params} label="Select Item 2" />}
        onChange={(_, value) => setSelectedItem2(value)}
        filterOptions={(options, { inputValue }) =>
          fuse2.search(inputValue).map(({ item }) => item)
        }
      />
      <button onClick={handleSave}>Save</button>
    </Box>
  );
};

export default AutocompleteSearch;
