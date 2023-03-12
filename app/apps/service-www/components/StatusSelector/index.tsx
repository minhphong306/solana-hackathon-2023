import * as React from 'react';
import Box from '@mui/material/Box';
import CustomToggleButton from '../ToggleButton';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function StatusSelector() {
  return (
    <Box sx={{ p: '1rem' }}>
      <Typography fontSize={'1rem'} component="div">
        Status
      </Typography>
      <Box sx={{ mt: '1rem' }}>
        <Grid justifyContent="center" container spacing={1} columns={{ xs: 2 }}>
          <Grid item xs={1}>
            <CustomToggleButton name={'Common'} />
          </Grid>
          <Grid item xs={1}>
            <CustomToggleButton name={'Uncommon'} />
          </Grid>
          <Grid item xs={1}>
            <CustomToggleButton name={'Rare'} />
          </Grid>
          <Grid item xs={1}>
            <CustomToggleButton name={'Epic'} />
          </Grid>
          <Grid item xs={1}>
            <CustomToggleButton name={'Mythical'} />
          </Grid>
          <Grid item xs={1}>
            <CustomToggleButton name={'Legendary'} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
