import * as React from 'react';
import Box from '@mui/material/Box';
import Profile from '../../components/Layout/Profile';

const History = () => {
  return (
    <Profile
      childrent={
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{  pt: '4rem' }}>
            History
          </Box>
        </Box>
      }
    ></Profile>
  );
};

export default History;
