import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { updateStateDialogForgotPassword } from './actions';
import { useLoginContext } from './selectors';
import { emailValidation } from '@mp-workspace/util';

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(input: { email: $email }) {
      isSent
    }
  }
`;

export default function ForgetPasswordModal() {
  const { state, dispatch } = useLoginContext();
  const { enqueueSnackbar } = useSnackbar();
  const [forgotPassword] = useMutation(FORGOT_PASSWORD_MUTATION);
  const router = useRouter();
  const [email, setEmail] = React.useState('');

  function onClose() {
    dispatch(updateStateDialogForgotPassword(false));
  }

  const submitFunction = async (event: React.MouseEvent<any>) => {
    event.preventDefault();
    try {
      if (!emailValidation(email)) {
        throw new Error('Email is not valid');
      }
      await forgotPassword({
        variables: {
          email: email,
        },
        onCompleted: (data) => {
          if (!isEmpty(data)) {
            if (isObject(data.forgotPassword)) {
              enqueueSnackbar('An email has been sent', { variant: 'success' });
              dispatch(updateStateDialogForgotPassword(false));
              router.push(
                {
                  pathname: '/resetpassword',
                  query: { email: email },
                },
                '/resetpassword'
              );
            }
          }
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  return (
    <Modal
      open={state.isOpenFogotPasswordDialog}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={submitFunction}>
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
            onClick={() => dispatch(updateStateDialogForgotPassword(false))}
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
              Forget password?
            </Typography>
            <Typography component={'div'} textAlign={'center'}>
              Enter the email address linked with your account. <br /> We will
              email you a link to reset your password.
            </Typography>
            <TextField
              id="outlined-email-input"
              label="Enter your email address"
              type="email"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                borderRadius: '0.6rem',
                backgroundColor: '#32257B',
                label: {
                  color: 'white',
                },
                fieldset: {
                  borderColor: '#675cab',
                  borderRadius: '0.6rem',
                },
              }}
            />
            <Button
              variant="contained"
              type={'submit'}
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
              Email me
            </Button>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
}
