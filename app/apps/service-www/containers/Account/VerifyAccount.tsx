import { gql, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { isObject } from 'lodash';
import { useSnackbar } from 'notistack';
import { setTokenCookie } from '../../lib/AuthCookies';
import { ACCESS_TOKEN } from '../../constants';
import { get } from 'dot-prop';

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
export default function Verify() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const paramPath = router.query;
  const [ResendMail] = useMutation(RESEND_MAIL);
  const [inpuEmail, setInpuEmail] = React.useState('');
  const [ConfirmMail] = useMutation(CONFIRM_EMAIL);

  const sendMail = async (email: string) => {
    await ResendMail({
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
  
  useEffect(() => {
    if (!isEmpty(get(paramPath, 'email', null))) {
      localStorage.setItem('email', paramPath.email.toString());
      if (paramPath.sendmail) {
        sendMail(paramPath.email.toString());
      }
    }
  }, []);

  const CodeConfirm = (e) => {
    e.preventDefault();
    ConfirmMail({
      variables: {
        email: localStorage.getItem('email'),
        code: inpuEmail,
      },
      onCompleted: (data) => {
        enqueueSnackbar('Verify account success', { variant: 'success' });
        if (!isEmpty(data)) {
          localStorage.removeItem('email');
          setTokenCookie(ACCESS_TOKEN, data.confirmEmail.accessToken);
          setTokenCookie('isConnected', true);
          router.push('/');
        }
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
    });
  };


  return (
    <form onSubmit={CodeConfirm}>
      <Box
        sx={{
          px: '2rem',
          py: '5rem',
        }}
      >
        <Typography
          variant="h5"
          textAlign={'left'}
          fontWeight={'bold'}
          marginBottom={2}
          sx={{ textTransform: 'uppercase' }}
        >
          verify game account
        </Typography>
        <Box textAlign={'left'} fontSize={12}>
          We have sent a verification code to your email. Please enter the
          verification code.
        </Box>
        <Stack spacing={3}>
          <TextField
            required
            id="outlined-code-input"
            label="Enter code"
            type="text"
            value={inpuEmail}
            onChange={(e) => {
              e.preventDefault();
              setInpuEmail(e.target.value);
            }}
            sx={{
              borderRadius: '0.6rem',
              backgroundColor: '#130C35',
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
          <Button
            size="large"
            fullWidth
            sx={{
              color: 'text.primary',
              borderRadius: '0.6rem',
              textTransform: 'none',
              background:
                'linear-gradient(#6853D3,#6853D3) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
              border: '1px solid transparent',
              fontSize: 16,
              fontWeight: 'bold',
            }}
            type={'submit'}
          >
            Complete
          </Button>
          <Box
            textAlign={'left'}
            component={'span'}
            fontSize={12}
            sx={{
              color: '#DF9EFF',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
            onClick={(e) => {
              e.preventDefault();
              if (!isEmpty(localStorage.getItem('email'))) {
                sendMail(localStorage.getItem('email'));
              }
            }}
          >
            Resend verification code
          </Box>
        </Stack>
      </Box>
    </form>
  );
}
