import * as React from 'react';
import * as spl from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import {gql, useMutation} from '@apollo/client';
import {useWallet, useConnection} from '@solana/wallet-adapter-react';
import {
  useAppContext,
  updateStateloadingPage,
  updateStateDialogClaimToken,
} from '../AppContext';
import {useSnackbar} from 'notistack';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
// import {get} from "dot-prop";
import {getATATokenWallet} from './constants';
import isEmpty from 'lodash/isEmpty';

export type Props = {
  tokenCoin: string;
  tokenClaimable: number;
  feeClaim: number;
  minClaimAmount: number;
};

const CLAIM_MUTATION = gql`
  mutation claimToken($amount: Int!) {
    claimToken(input: { amount: $amount })
  }
`;

const ClaimGearModal = ({
  tokenCoin,
  tokenClaimable: vGear,
  feeClaim,
  minClaimAmount,
}: Props): JSX.Element => {
  const {state, dispatch} = useAppContext();
  const {enqueueSnackbar} = useSnackbar();
  const [claimTokenMutation] = useMutation(CLAIM_MUTATION);
  const [inputClaim, setInputClaim] = React.useState<number>(0);
  const [gearReceive, setGearReceive] = React.useState<number>(0);
  const [showBtnSubmit, setShowBtnSubmit] = React.useState<boolean>(true);
  const {publicKey, signTransaction} = useWallet();
  const connection = useConnection();

  const closeModalClaim = () => {
    dispatch(updateStateDialogClaimToken(false));
    setGearReceive(0);
    setInputClaim(0);
  };

  const onChangeInputClaim = (event: React.ChangeEvent<any>) => {
    setInputClaim(event.target.value);
  };

  const claimTokenForm = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    dispatch(updateStateloadingPage(true));
    setShowBtnSubmit(true);
    try {
      const getATAToken = await getATATokenWallet(
        publicKey.toBase58(),
        tokenCoin
      );
      const accountInfo = await connection.connection.getParsedAccountInfo(
        getATAToken
      );

      if (isEmpty(accountInfo.value)) {
        const createATA =
          await spl.Token.createAssociatedTokenAccountInstruction(
            spl.ASSOCIATED_TOKEN_PROGRAM_ID,
            spl.TOKEN_PROGRAM_ID,
            new anchor.web3.PublicKey(tokenCoin),
            await getATATokenWallet(publicKey.toBase58(), tokenCoin),
            publicKey,
            publicKey
          );

        const transaction = new anchor.web3.Transaction();
        transaction.instructions = [createATA];
        transaction.recentBlockhash = (
          await connection.connection.getLatestBlockhash('finalized')
        ).blockhash;
        transaction.setSigners(publicKey);

        const singedtx = await signTransaction(transaction);

        const sendtx = await connection.connection.sendRawTransaction(
          singedtx.serialize(),
          {preflightCommitment: 'finalized'}
        );

        const {signatureResult} = await new Promise((resolve, reject) => {
          connection.connection.onSignature(
            sendtx,
            (signatureResult, context) => {
              return resolve({signatureResult: signatureResult});
            },
            'finalized'
          );
        });
      }

      await claimTokenMutation({
        variables: {
          amount: parseInt(String(inputClaim)),
        },
        onCompleted: (data) => {
          setShowBtnSubmit(false);
          dispatch(updateStateloadingPage(false));
          dispatch(updateStateDialogClaimToken(false));
          setGearReceive(0);
          setInputClaim(0);
          enqueueSnackbar('Claim success', {variant: 'success'});
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      });
    } catch (error) {
      setShowBtnSubmit(false);
      setInputClaim(0);
      dispatch(updateStateloadingPage(false));
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const maxGearAvailable = () => {
    setInputClaim(vGear);
  };

  React.useEffect(() => {
    if (minClaimAmount > 0) {
      const receive = inputClaim - feeClaim;
      setGearReceive(receive >= 0 ? receive : 0);
      if (inputClaim < feeClaim + minClaimAmount || inputClaim > vGear) {
        setShowBtnSubmit(true);
      } else {
        setShowBtnSubmit(false);
      }
    }
  }, [inputClaim]);

  return (
    <Modal
      open={state.profile.claimToken.dialogClaimToken}
      aria-labelledby="modal-setup-account"
      aria-describedby="modal-setup-account"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={claimTokenForm}>
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
            onClick={closeModalClaim}
            sx={{cursor: 'pointer'}}
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
            sx={{px: '1rem'}}
          >
            <Avatar
              sx={{
                width: '6rem',
                height: '6rem',
              }}
              variant={'square'}
              alt="icon_gear"
              src="/service-www/icon/icon_gear.png"
            ></Avatar>
            <Typography
              variant="h5"
              component={'div'}
              sx={{
                fontWeight: '600',
                '&.MuiTypography-root': {
                  m: 1,
                },
              }}
            >
              Claimable {vGear} vGear
            </Typography>
            <TextField
              fullWidth
              id="outlined-end-adornment"
              type={'number'}
              value={inputClaim}
              onChange={onChangeInputClaim}
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
                      src="/service-www/icon/icon_vgear_mini.png"
                    ></Avatar>
                    <Typography sx={{color: 'white'}}>vGear</Typography>
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
                You&rsquo;ll receive
                <Typography
                  component={'span'}
                  fontSize={'0.875rem'}
                  color={'aqua'}
                >
                  {' '}
                  {gearReceive} GEAR
                </Typography>{' '}
                after subtracting
                <Typography
                  component={'span'}
                  fontSize={'0.875rem'}
                  color={'aqua'}
                >
                  {' '}
                  {feeClaim} GEAR
                </Typography>{' '}
                network fee.
              </Typography>
            </Box>
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
              }}
            >
              <Typography fontSize={'0.975rem'} color={'gold'}>
                Minimum {feeClaim + minClaimAmount} vGear - Maximum {vGear}{' '}
                vGear
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
              Claim Gear
            </Button>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
};

export default ClaimGearModal;
