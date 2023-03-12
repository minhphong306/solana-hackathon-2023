import * as React from 'react';
import {
  Grid,
  Box,
} from '@mui/material';

export type RentingProps = {
  childrent: React.ReactNode;
};

const Renting = (props: RentingProps) => {
  return (
    <Box sx={{flexGrow: 1, height: '100%', minHeight: '100vh', pt: '4rem', backgroundColor: '#190C49'}}>
      {props.childrent}
    </Box>
  );
};
export default Renting;
