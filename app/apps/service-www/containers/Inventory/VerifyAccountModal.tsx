import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import {
  useAppContext,
  updateStateDialogVerifyAccount,
  updateStateloadingPage,
} from '../AppContext';
import isEmpty from 'lodash/isEmpty';
// import isObject from 'lodash/isObject';
import { gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { setTokenCookie } from '../../lib/AuthCookies';
import { ACCESS_TOKEN } from '../../constants';
import { useRouter } from 'next/router';

const RESEND_MAIL = gql`
  mutation resendConfirmationCode($email: String!) {
    resendConfirmationCode(input: { email: $email }) {
      isSent
    }
  }
`;
const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($email: String!, $code: String!) {
    confirmEmail(input: { email: $email, code: $code }) {
      accessToken
    }
  }
`;

export default function VerifyAccont() {
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [resendMail] = useMutation(RESEND_MAIL);
  const [inpuCode, setInpuEmail] = React.useState<string>('');
  const [confirmMail] = useMutation(CONFIRM_EMAIL);

  const sendMail = async (email: string) => {
    await resendMail({
      variables: {
        email: email,
      },
      onCompleted: (data) => {
        enqueueSnackbar('An email has been sent', { variant: 'success' });
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
    });
  };

  const codeConfirm = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    dispatch(updateStateloadingPage(true));
    try {
      await confirmMail({
        variables: {
          email: localStorage.getItem('email'),
          code: inpuCode,
        },
        onCompleted: (data) => {
          dispatch(updateStateloadingPage(false));
          dispatch(updateStateDialogVerifyAccount(false));
          enqueueSnackbar('Verify account success', { variant: 'success' });
          if (!isEmpty(data)) {
            localStorage.removeItem('email');
            setTokenCookie(ACCESS_TOKEN, data.confirmEmail.accessToken);
            router.reload();
          }
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      });
    } catch (error) {
      dispatch(updateStateloadingPage(false));
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const closeModalVerifyAccount = () => {
    dispatch(updateStateDialogVerifyAccount(false));
    localStorage.removeItem('email');
  };

  return (
    <Modal
      open={state.inventory.dialogVerifyAccount}
      aria-labelledby="modal-setup-account"
      aria-describedby="modal-setup-account"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={codeConfirm}>
        <Box
          sx={{
            color: 'text.primary',
            borderRadius: '0.6rem',
            bgcolor: '#6c48da',
            p: '1rem',
            pb: '2rem',
            width: '33rem',
          }}
        >
          <Stack
            justifyContent={'end'}
            direction={'row'}
            onClick={closeModalVerifyAccount}
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
            spacing={2}
            sx={{ px: '1rem' }}
          >
            <Typography
              variant="h5"
              component={'div'}
              sx={{ fontWeight: '600' }}
            >
              Verify your email
            </Typography>
            <Box textAlign={'center'} fontSize={16}>
              We have sent a verification code to your email.
              <br /> Please enter the verification code.
            </Box>
            <TextField
              required
              fullWidth
              id="outlined-code-input"
              label="Enter code"
              type="text"
              value={inpuCode}
              onChange={(e) => {
                e.preventDefault();
                setInpuEmail(e.target.value);
              }}
              sx={{
                borderRadius: '0.6rem',
                backgroundColor: '#32257B',
                label: {
                  color: 'white',
                },
                mt: '1rem',
                fieldset: {
                  borderColor: '#675cab',
                  borderRadius: '0.6rem',
                },
              }}
            />
            <Box sx={{ width: '100%' }}>
              <Box
                component={'span'}
                fontSize={12}
                sx={{
                  color: 'aqua',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={(e: React.MouseEvent<any>) => {
                  e.preventDefault();
                  if (!isEmpty(localStorage.getItem('email'))) {
                    sendMail(localStorage.getItem('email'));
                  }
                }}
              >
                Resend verification code
              </Box>
            </Box>
            <Button
              size="large"
              fullWidth
              type={'submit'}
              sx={{
                color: 'text.primary',
                borderRadius: '0.6rem',
                textTransform: 'none',
                background:
                  'linear-gradient(#4A399F,#4A399F) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
                border: '1px solid transparent',
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
}
