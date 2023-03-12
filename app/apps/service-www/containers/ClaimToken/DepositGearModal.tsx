import * as React from 'react';
import { gql, useMutation } from '@apollo/client';
import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import {
  useAppContext,
  updateStateloadingPage,
  updateStateDialogDepositToken,
} from '../AppContext';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { get } from 'dot-prop';
import Avatar from '@mui/material/Avatar';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getATATokenWallet } from './constants';

export type Props = {
  tokenCoin: string;
  walletDepositAddress: string;
  minDepositAmount: number;
};

const DEPOSIT_MUTATION = gql`
  mutation depositToken($tx: String!) {
    depositToken(input: { tx: $tx })
  }
`;

const DepositGearModal = ({
  tokenCoin,
  walletDepositAddress,
  minDepositAmount,
}: Props): JSX.Element => {
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const [depositToken] = useMutation(DEPOSIT_MUTATION);
  const [inputDeposit, setInputDeposit] = React.useState<number>(0);
  const [gear, setGear] = React.useState<number>(0);
  const [feeDeposit, setFeeDeposit] = React.useState<number>(0.00001);
  const [showBtnSubmit, setShowBtnSubmit] = React.useState<boolean>(true);
  const { publicKey, signTransaction } = useWallet();
  const connection = useConnection();

  const closeModalDeposit = () => {
    dispatch(updateStateDialogDepositToken(false));
    setGear(0);
    setInputDeposit(0);
  };

  const onChangeInputDeposit = (event: React.ChangeEvent<any>) => {
    setInputDeposit(event.target.value);
  };

  const depositTokenForm = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    dispatch(updateStateloadingPage(true));
    setShowBtnSubmit(true);
    try {
      const [tx] = await Promise.all([
        spl.Token.createTransferInstruction(
          spl.TOKEN_PROGRAM_ID,
          await getATATokenWallet(publicKey.toBase58(), tokenCoin),
          await getATATokenWallet(walletDepositAddress, tokenCoin),
          publicKey,
          [],
          inputDeposit
        ),
      ]);

      const transaction = new anchor.web3.Transaction();
      transaction.instructions = [tx];
      transaction.recentBlockhash = (
        await connection.connection.getLatestBlockhash('finalized')
      ).blockhash;
      transaction.setSigners(publicKey);

      const singedtx = await signTransaction(transaction);

      const sendtx = await connection.connection.sendRawTransaction(
        singedtx.serialize(),
        { preflightCommitment: 'finalized' }
      );

      const { signatureResult } = await new Promise((resolve, reject) => {
        connection.connection.onSignature(
          sendtx,
          (signatureResult, context) => {
            return resolve({ signatureResult: signatureResult });
          },
          'finalized'
        );
      });

      await depositToken({
        variables: {
          tx: sendtx,
        },
        onCompleted: (data) => {
          dispatch(updateStateloadingPage(false));
          dispatch(updateStateDialogDepositToken(false));
          setShowBtnSubmit(false);
          setGear(0);
          setInputDeposit(0);
          enqueueSnackbar('Deposit successfully', { variant: 'success' });
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      });
    } catch (error) {
      dispatch(updateStateloadingPage(false));
      setShowBtnSubmit(false);
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const getBalanceUserDeposit = async () => {
    try {
      const getATAToken = await getATATokenWallet(
        publicKey.toBase58(),
        tokenCoin
      );
      const accountInfo = await connection.connection.getParsedAccountInfo(
        getATAToken
      );
      setGear(
        get(accountInfo, 'value.data.parsed.info.tokenAmount.uiAmount', 0)
      );
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };

  const maxGearAvailable = () => {
    setInputDeposit(gear);
  };

  React.useEffect(() => {
    if (state.profile.claimToken.dialogDepositToken) {
      getBalanceUserDeposit();
    }
  }, [state.profile.claimToken.dialogDepositToken]);

  React.useEffect(() => {
    if (minDepositAmount > 0) {
      if (inputDeposit < minDepositAmount || inputDeposit > gear) {
        setShowBtnSubmit(true);
      } else {
        setShowBtnSubmit(false);
      }
    }
  }, [inputDeposit]);

  return (
    <Modal
      open={state.profile.claimToken.dialogDepositToken}
      aria-labelledby="modal-setup-account"
      aria-describedby="modal-setup-account"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={depositTokenForm}>
        <Box
          sx={{
            color: 'text.primary',
            borderRadius: '0.6rem',
            bgcolor: '#6c48da',
            p: '1rem',
            pb: '3rem',
            width: '33rem',
          }}
        >
          <Stack
            justifyContent={'end'}
            direction={'row'}
            onClick={closeModalDeposit}
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
            <Typography
              variant="h5"
              component={'div'}
              sx={{ fontWeight: '600' }}
            >
              Deposit
            </Typography>
            <Box sx={{ width: '100%' }} textAlign={'right'}>
              <Typography
                component={'div'}
                fontSize={'0.875rem'}
                color={'#BBB8FF'}
              >
                Available: {gear} GEAR
              </Typography>
            </Box>
            <TextField
              fullWidth
              id="outlined-end-adornment"
              type={'number'}
              value={inputDeposit}
              onChange={onChangeInputDeposit}
              sx={{
                m: 1,
                borderRadius: '0.6rem',
                backgroundColor: '#130C35',
                label: {
                  color: 'white',
                },
                fieldset: {
                  borderColor: '#675CAB',
                  borderRadius: '0.6rem',
                },
                '&.MuiFormControl-root': {
                  marginTop: 1,
                },
                '& input[type=number]': {
                  '-moz-appearance': 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position={'end'}>
                    <Chip
                      label="Max"
                      size={'small'}
                      onClick={maxGearAvailable}
                      sx={{
                        px: '0.5rem',
                        backgroundImage:
                          'linear-gradient(to right, #5B55D9, #B82BF6);',
                      }}
                    />
                    <Avatar
                      sx={{
                        mx: '0.3rem',
                        width: '1.8rem',
                        height: '1.8rem',
                      }}
                      alt="icon_gear"
                      src="/service-www/icon/icon_gear_mini.png"
                    ></Avatar>
                    <Typography sx={{ color: 'white' }}>Gear</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
                '&.MuiBox-root': {
                  marginTop: 1,
                },
              }}
            >
              <Typography fontSize={'0.875rem'} color={'white'}>
                You need to prepare about
                <Typography
                  component={'span'}
                  fontSize={'0.875rem'}
                  color={'aqua'}
                >
                  {' '}
                  {feeDeposit} SOL
                </Typography>{' '}
                SOL to pay network fee for this transaction.
              </Typography>
            </Box>
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
              }}
            >
              <Typography fontSize={'0.975rem'} color={'gold'}>
                Minimum {minDepositAmount} Gear
              </Typography>
            </Box>

            <Button
              disabled={showBtnSubmit}
              variant="contained"
              type={'submit'}
              fullWidth
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
              size={'large'}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
};

export default DepositGearModal;
