import {Box, Typography} from '@mui/material';
import React from 'react';

export type CardProps = {
  children?: JSX.Element
  sx?
}

const Card = ({children, sx}: CardProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'inline-block',
        border: '1px solid #7C52AC',
        backgroundColor: '#241856',
        padding: '1.5rem',
        borderRadius: '0.6rem',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Card;
