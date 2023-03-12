import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { SearchMenuProps } from '../SearchMenu';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CustomMultiselect(props: SearchMenuProps) {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl fullWidth sx={{ alignContent: 'center' }}>
        <InputLabel sx={{ color:'white' }}>{props.name}</InputLabel>
        <Select
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={props.name} />}
          sx={{
            borderRadius: '0.6rem',
            bgcolor: 'background.default',
            '& .MuiSelect-icon': {
              color: 'primary.main',
            },
            '& .MuiInputLabel-root': {
              color: 'red',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4e3263',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} color={'secondary'} />
              ))}
            </Box>
          )}
        >
          {props.option?.map((value, index) => (
            <MenuItem
              key={`menu-item${index}`}
              value={value}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
