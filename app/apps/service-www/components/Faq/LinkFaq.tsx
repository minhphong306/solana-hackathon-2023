import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('components:LinkFaq');

const LinkFaq = (): JSX.Element => {
  debug('render');

  return (
    <Link href="https://medium.com/@starbots_game/c965688116d8" passHref>
      <a target={'_blank'} rel="noreferrer">
        <Box
          textAlign={'center'}
          component={'span'}
          sx={{
            color: ' #DF9EFF',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {' '}
          View FAQs
        </Box>
      </a>
    </Link>
  );
};

if (process.env.NODE_ENV !== 'production') {
  LinkFaq.displayName = 'components__LinkFaq';
}

export default LinkFaq;
