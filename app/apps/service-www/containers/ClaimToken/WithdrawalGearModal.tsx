import * as React from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  useAppContext,
  updateStateloadingPage,
  updateStateDialogWithdrawalToken,
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
// import {get} from "dot-prop";
import Avatar from '@mui/material/Avatar';

export type Props = {
  gear: number;
  feeWithdrawal: number;
  minWithdrawAmount: number;
};

const WITHDRAWAL_MUTATION = gql`
  mutation tokenWithdraw($amount: Float!) {
    tokenWithdraw(input: { amount: $amount })
  }
`;

const WithdrawalGearModal = ({
  gear,
  feeWithdrawal,
  minWithdrawAmount,
}: Props): JSX.Element => {
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const [tokenWithdraw] = useMutation(WITHDRAWAL_MUTATION);
  const [inputWithdrawl, setInputWithdrawl] = React.useState<number>(0);
  const [gearReceive, setGearReceive] = React.useState<number>(0);
  const [showBtnSubmit, setShowBtnSubmit] = React.useState<boolean>(true);

  const closeModalWithdrawal = () => {
    dispatch(updateStateDialogWithdrawalToken(false));
    setGearReceive(0);
    setInputWithdrawl(0);
  };

  const onChangeInputWithdrawal = (event: React.ChangeEvent<any>) => {
    setInputWithdrawl(event.target.value);
  };

  const withdrawalTokenForm = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    try {
      dispatch(updateStateloadingPage(true));
      setShowBtnSubmit(true);
      await tokenWithdraw({
        variables: {
          amount: parseFloat(String(inputWithdrawl)),
        },
        onCompleted: (data) => {
          dispatch(updateStateloadingPage(false));
          dispatch(updateStateDialogWithdrawalToken(false));
          setShowBtnSubmit(false);
          setGearReceive(0);
          setInputWithdrawl(0);
          enqueueSnackbar('Withdraw successfully', { variant: 'success' });
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

  const maxGearAvailable = () => {
    setInputWithdrawl(gear);
  };

  React.useEffect(() => {
    if (minWithdrawAmount > 0) {
      const receive = inputWithdrawl - feeWithdrawal;
      setGearReceive(receive >= 0 ? receive : 0);
      if (
        inputWithdrawl < feeWithdrawal + minWithdrawAmount ||
        inputWithdrawl > gear
      ) {
        setShowBtnSubmit(true);
      } else {
        setShowBtnSubmit(false);
      }
    }
  }, [inputWithdrawl]);

  return (
    <Modal
      open={state.profile.claimToken.dialogWithdrawalToken}
      aria-labelledby="modal-setup-account"
      aria-describedby="modal-setup-account"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={withdrawalTokenForm}>
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
            onClick={closeModalWithdrawal}
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
              Withdrawal
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
              value={inputWithdrawl}
              onChange={onChangeInputWithdrawal}
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
                  {feeWithdrawal} GEAR
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
                Minimum {feeWithdrawal + minWithdrawAmount} vGear
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

export default WithdrawalGearModal;
