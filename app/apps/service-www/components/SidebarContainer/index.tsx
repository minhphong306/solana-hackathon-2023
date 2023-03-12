import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import PriceFilter from '../PriceFilter';
// import BodyPart from '../BodyPart';
// import StatusSelector from '../StatusSelector';
import {Typography} from '@mui/material';
import {currencyOption, durationOption} from '../../constants';

export default function SidebarContainer() {
  return (
    <Box>
      <Box
        bgcolor={'background.default'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: '1rem',
        }}
      >
        <Typography variant="h6" component="div">
          Filters
        </Typography>
        <Button
          color={'primary'}
          sx={{
            py: '0.8rem',
            px: '0.5rem',
            textTransform: 'capitalize',
            background:
              'linear-gradient(#271E57,#271E57) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
            border: '1px solid transparent',
            borderRadius: '0.6rem',
          }}
        >
          Reset Filter
        </Button>
      </Box>
      <Divider sx={{borderColor: 'black'}}/>
      <PriceFilter name={'Price Filter'} option={currencyOption}/>
      <PriceFilter name={'Duration'} option={durationOption}/>
      <Divider sx={{borderColor: 'black'}}/>
      {/* <BodyPart/> */}
      {/*<Divider sx={{ borderColor: 'black' }} />*/}
      {/*<StatusSelector />*/}
    </Box>
  );
}
