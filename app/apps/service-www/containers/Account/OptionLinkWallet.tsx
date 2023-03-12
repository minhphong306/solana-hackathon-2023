import React, {useState, useEffect, useContext} from 'react';
import {Box, Stack, Typography, Button} from '@mui/material';
import {useAppContext} from '../AppContext';
import {useRouter} from 'next/router';
import {gql, useMutation} from '@apollo/client';
import {useWallet} from '@solana/wallet-adapter-react';
import {useSnackbar} from 'notistack';

const DontAsk = gql`
  mutation DontAskAgain {
    dontAskAgain
  }
`;

export default function OptionLinkWallet() {
  const {enqueueSnackbar} = useSnackbar();
  const {state, dispatch} = useAppContext();
  const router = useRouter();
  const [dontAsk, {data, loading, error}] = useMutation(DontAsk);
  const {publicKey} = useWallet();

  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      direction={'row'}
      sx={{mt: '15rem'}}
    >
      <Stack
        sx={{
          p: '1rem',
          bgcolor: '#6c48db',
          border: '1px solid #9C85FF',
          borderRadius: '0.6rem',
          width: '30rem',
          position: 'relative'
        }}
        spacing={2}
      >
        <Box
          onClick={() => router.push('/')}
          sx={{cursor: 'pointer', position: 'absolute', top: '.5rem', right: '.5rem'}}
          component={'span'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L1 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1L13 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
        <Typography variant='h5' textAlign={'center'} fontWeight={'bold'}>
          Connect your game account?
        </Typography>
        <Button
          size="large"
          fullWidth
          sx={{
            color: 'text.primary',
            borderRadius: '0.6rem',
            textTransform: 'none',
            background:
              'linear-gradient(#4A399F,#4A399F) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
            border: '1px solid transparent',
            fontSize: 16,
          }}
          disabled={true}
          onClick={() => {
            router.push(
              {
                pathname: '/link',
                query: {publickey: publicKey.toString()},
              },
              '/link'
            );
          }}
        >
          Link to existing game account
        </Button>
        <Button
          variant="contained"
          sx={{
            color: '#5B47C0',
            backgroundColor: 'white',
            borderRadius: '0.4rem',
            textTransform: 'initial',
            '&:hover': {
              color: 'white',
            },
          }}
          size={'large'}
          onClick={() => router.push('/createaccount')}
        >
          Create new game account
        </Button>
        <Stack justifyContent={'center'} direction={'row'}>
          <Box
            onClick={() => {
              dontAsk({
                onCompleted: (data) => {
                  router.push('/');
                },
                onError: (error) => {
                  enqueueSnackbar(error.message, {variant: 'error'});
                },
              });
            }}
            sx={{
              cursor: 'pointer',
              color: 'aqua',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            component={'span'}
          >
            Don&apos;t ask me again
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
