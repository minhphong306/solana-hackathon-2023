import React, { useState, useEffect, useContext } from 'react';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import { useAppContext, updateStateInstallWallet } from '../AppContext';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { WalletConnectButton as MaterialUIWalletConnectButton } from '@solana/wallet-adapter-material-ui';

type propsWallet = {
  walletName: string;
};

export default function InstallWallet(props: propsWallet) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const NotifyMessage = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };
  const { state, dispatch } = useAppContext();
  // useEffect(() => {
  //   console.log('w', wallet, wallets);
  //   if (
  //     !isEmpty(localStorage.getItem('walletName')) &&
  //     wallet?.readyState !== 'Installed'
  //   ) {
  //     if (
  //       localStorage.getItem('walletName') === '"Phantom"' &&
  //       isEmpty(localStorage.getItem('token'))
  //     ) {
  //       dispatch(updateStateInstallWallet(true));
  //     }
  //   }
  // }, [wallet]);
  return (
    <>
      <Box
        sx={{
          color: 'text.primary',
          borderRadius: '0.6rem',
          textTransform: 'none',
          background:
            'linear-gradient(#6c48da,#6c48da) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
          border: '1px solid transparent',
          p: '1rem',
          width: '33rem',
        }}
      >
        <Stack
          justifyContent={'end'}
          direction={'row'}
          onClick={() => dispatch(updateStateInstallWallet(false))}
          sx={{ cursor: 'pointer' }}
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
        </Stack>
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          direction={'column'}
          spacing={3}
          sx={{ px: '1rem' }}
        >
          <Typography variant="h5" component={'div'} sx={{ fontWeight: '600' }}>
            Phantom Wallet not found
          </Typography>
          <Typography component={'div'}>
            You need setup Phantom wallet to continue
          </Typography>
          <MaterialUIWalletConnectButton
            sx={{
              color: '#5B47C0',
              backgroundColor: 'white',
              borderRadius: '0.4rem',
              textTransform: 'capitalize',
              fontWeight: 'bold',
              '&:hover': {
                color: 'white',
              },
            }}
          >
            Install Phantom Wallet
          </MaterialUIWalletConnectButton>
        </Stack>
      </Box>
      {/* <Modal
        open={state.login.dialogInstallWallet}
        onClose={() => dispatch(updateStateInstallWallet(false))}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <InstallWallet walletName="aaa" />
      </Modal> */}
    </>
  );
}
