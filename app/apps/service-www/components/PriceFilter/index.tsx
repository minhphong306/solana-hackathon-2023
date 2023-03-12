import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import SearchMenu from '../SearchMenu';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


interface PriceFilterProps {
  name: string;
  option: string[];
}

export default function PriceFilter({name, option}: PriceFilterProps) {
  const [priceExpanded, setPriceExpanded] = React.useState<boolean>(true);

  return (
    <Accordion
      expanded={priceExpanded}
      onChange={() => {
        priceExpanded ? setPriceExpanded(false) : setPriceExpanded(true);
      }}
      sx={{bgcolor: 'background.default'}}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{color: 'text.primary'}}/>}
        aria-controls="price-filter-content"
        id="price-filter-header"
      >
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Box
            sx={{
              marginRight: '0.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.125 17.2084H7.625M1.875 3.79175H5.70833H1.875ZM19.125 3.79175H9.54167H19.125ZM1.875 10.5001H13.375H1.875ZM19.125 10.5001H17.2083H19.125ZM1.875 17.2084H3.79167H1.875Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M7.62504 5.70833C8.68359 5.70833 9.54171 4.85021 9.54171 3.79167C9.54171 2.73312 8.68359 1.875 7.62504 1.875C6.5665 1.875 5.70837 2.73312 5.70837 3.79167C5.70837 4.85021 6.5665 5.70833 7.62504 5.70833Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M15.2917 12.4166C16.3502 12.4166 17.2083 11.5585 17.2083 10.4999C17.2083 9.44137 16.3502 8.58325 15.2917 8.58325C14.2331 8.58325 13.375 9.44137 13.375 10.4999C13.375 11.5585 14.2331 12.4166 15.2917 12.4166Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5.70829 19.1251C6.76684 19.1251 7.62496 18.267 7.62496 17.2084C7.62496 16.1499 6.76684 15.2917 5.70829 15.2917C4.64975 15.2917 3.79163 16.1499 3.79163 17.2084C3.79163 18.267 4.64975 19.1251 5.70829 19.1251Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Box>
          {name}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <SearchMenu option={option} name="Currency"/>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            my: '1rem',
            gap: '1rem',
          }}
        >
          <TextField
            id="outlined-number"
            label="Min"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4e3263',
                  borderRadius: '0.6rem',
                },
              },
              '&:hover .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'primary.dark',
                },
              },
            }}
          />
          <Typography>to</Typography>
          <TextField
            id="outlined-number"
            label="Max"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#4e3263',
                  borderRadius: '0.6rem',
                },
              },
              '&:hover .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'primary.dark',
                },
              },
            }}
          />
        </Box>
        <Button
          fullWidth
          size="large"
          sx={{
            color: 'text.primary',
            borderRadius: '0.6rem',
            textTransform: 'none',
            background:
              'linear-gradient(#271E57,#271E57) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
            border: '1px solid transparent',
          }}
        >
          Apply
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}
