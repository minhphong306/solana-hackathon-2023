import { Box } from '@mui/material';
import * as React from 'react';
import Card from '../Card';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Card',
  args: {
    children: <Box sx={{ width: '10rem', height: '15rem' }}></Box>,
    sx: {}
  },
  // decorators: [],
};

export const CardStory = ({ ...args }) => <Card {...args} />;

CardStory.storyName = 'Card';
