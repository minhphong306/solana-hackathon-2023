import * as React from 'react';
import { Stack, CardMedia } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const CreateAccountLayout = ({ children }) => {
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      direction={'row'}
      sx={{ mt: '8rem' }}
    >
      <Paper
        elevation={16}
        sx={{
          width: '55rem',
          bgcolor: '#45349a',
          borderRadius: '0.6rem',
        }}
      >
        <Grid container>
          <Grid item xs={5}>
            <CardMedia
              component="img"
              height={620}
              image="/banner_createaccount.png"
              alt="Paella dish"
              sx={{
                borderRadius: '0.6rem 0 0 0.6rem',
              }}
            />
          </Grid>
          <Grid
            item
            xs={7}
            sx={{
              borderTop: '1px solid #6853d3',
              borderRight: '1px solid #6853d3',
              borderBottom: '1px solid #6853d3',
              borderRadius: '0 0.6rem 0.6rem 0',
            }}
          >
            {children}
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
};

export default CreateAccountLayout;
