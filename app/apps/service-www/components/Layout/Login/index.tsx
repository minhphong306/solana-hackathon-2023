import * as React from 'react';
import Box from '@mui/material/Box';

export type LoginLayoutProps = {
  children: React.ReactNode;
};

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          bgcolor: '#271C6B',
          height: '100%',
          minHeight: '100vh',
          pt: '4rem',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default LoginLayout;
