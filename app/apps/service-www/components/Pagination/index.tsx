import React, { useEffect, useState } from 'react';
import { Box, Button, styled, TextField, Typography } from '@mui/material';

const BootstrapButton = styled(Button)({
  backgroundColor: '#4D3A9B',
  border: '1px solid #875AB7',
  borderRadius: '.5rem',

  '&:hover': {
    backgroundColor: '#4D3A9B',
    borderColor: '#b179ed'
  },

  '&.Mui-disabled': {
    backgroundColor: "#382557",
    border: '1px solid #362F62',
    pointerEvents: 'auto',
    cursor: 'not-allowed'
  }
});

const BootstrapTextField = styled(TextField)({
  'input': {
    color: '#fff',
    backgroundColor: '#150E3A',
    padding: '.375rem .875rem',
    width: '1.5rem',
    border: '1px solid #472E5E',
    borderRadius: '.5rem',
    '&:hover, &:focus': {
      borderColor: '#764e9b'
    }
  },
  "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
    "WebkitAppearance": "none",
    "margin": 0
  },
  "input[type=number]": {
    "MozAppearance": "textfield"
  },
  '& fieldset': {
    display: 'none'
  }
});

interface PaginationProps{
  page: number,
  count: number,
  onPageChange: (e, newPage: number) => void,
}

const Pagination = ({page, onPageChange, count}: PaginationProps) => {

  const [text, setText] = useState<string>(page.toString());
  const [disablePrev, setDisablePrev] = useState<boolean>(true);
  const [disableNext, setDisableNext] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value == '') {
      setText('');
    } else if (1 < parseInt(value) && parseInt(value) < count) {
      setText(value);
    } else if (parseInt(value) <= 1) {
      setText('1');
    } else if (parseInt(value) >=count) {
      setText(count.toString());
    }
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (text === '') {
        return;
      } else if (parseInt(text) != page) {
        onPageChange(e, parseInt(text));
      }
    } 
  };

  const handleClickPrev = (e: React.MouseEvent<HTMLElement>) => {
    !disablePrev && onPageChange(e, parseInt(text) - 1);
  };

  const handleClickNext = (e: React.MouseEvent<HTMLElement>) => {
    !disableNext && onPageChange(e, parseInt(text) + 1);
  };

  useEffect(() => {
    setText(page.toString());
    if (page <= 1) {
      setDisablePrev(true);
    } else {
      setDisablePrev(false);
    }
    if (page >= count) {
      setDisableNext(true);
    } else {
      setDisableNext(false);
    }
  }, [page, count]);

  return (
    <Box sx={{display: 'flex', alignItems: 'center', gap: '1rem', color: '#fff'}}>
      <BootstrapButton disabled={disablePrev} onClick={handleClickPrev}>
        {disablePrev ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12L5 12" stroke="#514B71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L5 12L12 5" stroke="#514B71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> :
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12L5 12" stroke="#C4B7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19L5 12L12 5" stroke="#C4B7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>} 
      </BootstrapButton>
      <Typography>Page</Typography>
      <BootstrapTextField type={'number'} value={text} onChange={handleInputChange} onKeyDown={handleEnter}/>
      <Typography>of {count}</Typography>
      <BootstrapButton disabled={disableNext} onClick={handleClickNext}>
        {disableNext ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="#514B71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 5L19 12L12 19" stroke="#514B71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> :
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="#C4B7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 5L19 12L12 19" stroke="#C4B7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </BootstrapButton>
    </Box>
  );
};

export default Pagination;