import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import Fuse from 'fuse.js';

const CustomAutoComplete = ({ label, options = [], onChange, width = 300 }) => {
  const fuse = new Fuse(options, { includeScore: true });

  return (
    <Box sx={{ width, marginY: 1 }}>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option}
        filterOptions={(opts, { inputValue }) =>
          fuse.search(inputValue).map(({ item }) => item)
        }
        onChange={(_, value) => onChange?.(value)}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Box>
  );
};

export default CustomAutoComplete;
