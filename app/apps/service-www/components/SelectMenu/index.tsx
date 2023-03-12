import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { InputLabel, styled, Typography } from '@mui/material';
import { borderRadius } from '@mui/system';

const BootstrapSelect = styled(Select)({
  maxHeight: '3rem',
  color: '#8A8DDC',
  border: "1px solid #4B319F",
  borderRadius: '0.625rem',
  backgroundColor: '#170734',
  outline: 'none',
  '& .MuiSelect-icon': {
    color: '#8A8DDC',
    transition: 'transform .25s',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    display: 'none'
  },

});

const menuStyle = {
  '& .MuiMenu-paper': {
    border: "1px solid #4B319F",
    borderRadius: '.625rem',
    backgroundColor: "#170734",
    transform: "translateY(.5rem) !important",
    padding: '.5rem 1rem'
  }
};

const BootstrapMenuItem = styled(MenuItem)({
  padding: ".5rem",
  display: "flex",
  alignItems: 'center',
  gap: '.5rem',
  color: '#8A8DDC',
  '&:hover svg path': {
    stroke: "#BC34FF"
  },
  '&:hover': {
    color: '#BC34FF',
  },
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: 'unset',
    color: '#BC34FF'
  }
});
export interface SelectMenuProps {
  label: string,
  options: string[],
  selected?: number,
  onSelectChange?: (idx: number) => void
  width?: object | string
}

export default function SelectMenu(props: SelectMenuProps) {
  const {label, options, selected, onSelectChange, width} = {...props};

  const handleChange = (event) => {
    onSelectChange(event.target.value);
  };

  return (
    <Box sx={{ width: width ? width : '15rem' }}>
      <FormControl fullWidth sx={{ alignContent: 'center' }}>
        <BootstrapSelect
          defaultValue={0}
          value={selected}
          onChange={handleChange}
          MenuProps={{elevation: 0, sx: menuStyle}}
          renderValue={() => selected === 0 ? label : options[selected]}
        >
          {options?.map((option, index) => (
            <BootstrapMenuItem
              key={`menu-item-${index}`}
              value={index}
            >
              {index !== selected ?
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z" stroke="#8A8DDC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10.0857V11.0057C20.9988 13.1621 20.3005 15.2604 19.0093 16.9875C17.7182 18.7147 15.9033 19.9782 13.8354 20.5896C11.7674 21.201 9.55726 21.1276 7.53447 20.3803C5.51168 19.633 3.78465 18.2518 2.61096 16.4428C1.43727 14.6338 0.879791 12.4938 1.02168 10.342C1.16356 8.19029 1.99721 6.14205 3.39828 4.5028C4.79935 2.86354 6.69279 1.72111 8.79619 1.24587C10.8996 0.770634 13.1003 0.988061 15.07 1.86572" stroke="#BC34FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 3.00586L11 13.0159L8 10.0159" stroke="#BC34FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              }
              <Typography>{option}</Typography>
            </BootstrapMenuItem>
          ))}
        </BootstrapSelect>
      </FormControl>
    </Box>
  );
}
