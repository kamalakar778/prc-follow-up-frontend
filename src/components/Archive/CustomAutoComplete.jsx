import React, { useMemo, useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import Fuse from 'fuse.js';

const CustomAutoComplete = ({
  label,
  options = [],
  onChange,
  width = 300,
  defaultSuggestions = []
}) => {
  const [inputValue, setInputValue] = useState('');

  const fuse = useMemo(
    () => new Fuse(options, { includeScore: true, threshold: 0.4 }),
    [options]
  );

  const filteredOptions = useMemo(() => {
    if (!inputValue) return defaultSuggestions;
    return fuse.search(inputValue).map(({ item }) => item);
  }, [inputValue, fuse, defaultSuggestions]);

  return (
    <Box sx={{ width, marginY: 1 }}>
      <Autocomplete
        freeSolo
        options={filteredOptions}
        inputValue={inputValue}
        onInputChange={(e, newInput) => setInputValue(newInput)}
        onChange={(_, value) => onChange?.(value)}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Box>
  );
};

export default CustomAutoComplete;
