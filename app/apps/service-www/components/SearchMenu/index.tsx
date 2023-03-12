import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

export interface SearchMenuProps {
  name: string;
  option: string[];
  width?: number;
}

export default function SearchMenu(props: SearchMenuProps) {
  const [currency, setCurrency] = React.useState(0);

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };
  return (
    <Box>
      <FormControl fullWidth sx={{ alignContent: 'center' }}>
        <Select
          inputProps={{ 'aria-label': 'Without label' }}
          defaultValue={0}
          value={currency}
          onChange={handleChange}
          sx={{
            maxHeight: '3.1rem',
            borderRadius: '0.6rem',
            bgcolor: 'background.default',
            '& .MuiSelect-icon': {
              color: 'primary.main',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4e3263',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.dark',
            },
          }}
        >
          {props.option?.map((value, index) => (
            <MenuItem
              key={`menu-item${index}`}
              value={index}
              sx={{
                color: 'primary',
                bgcolor: 'background.paper',
              }}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
