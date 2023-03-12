import * as React from 'react';
import { Box } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('components:TagBodyPart');

export type TagBodyPartProps = {
  type?: OverridableStringUnion<
    'uncommon' | 'common' | 'rare' | 'epic' | 'mythical' | 'legendary'
  >;
  sx?;
};

const backgroundColor = {
  common: '#606467',
  uncommon: '#3CA503',
  rare: '#016EE7',
  epic: '#8A38C8',
  mythical: '#BD2A1A',
  legendary: '#F46D01',
};

const TagBodyPart = ({ type = 'common', sx }: TagBodyPartProps): JSX.Element => {
  debug('render');

  const bg = backgroundColor[type];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        color: '#fff',
        textAlign: 'center',
        textTransform: 'capitalize',
        padding: '0 15px',
        borderRadius: '5px',
        backgroundColor: `tierColor.${type}`,
        ...sx,
      }}
    >
      {type}
    </Box>
  );
};

if (process.env.NODE_ENV !== 'production') {
  TagBodyPart.displayName = 'components__TagBodyPart';
}

export default TagBodyPart;
