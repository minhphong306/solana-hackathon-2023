import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AccordionSummary from '@mui/material/AccordionSummary';
import TextField from '@mui/material/TextField';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import {useSnackbar} from 'notistack';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import router from 'next/router';
import {ApolloError, gql, useMutation} from '@apollo/client';
import {useAppContext, updateStateloadingPage} from '../AppContext';
import {setTokenCookie} from '../../lib/AuthCookies';
import {ACCESS_TOKEN} from '../../constants';
import {updateStateDialogForgotPassword} from './actions';
import {useLoginContext} from './selectors';
import PasswordTextfield from '../../components/PasswordTextfield';
import { emailValidation } from '@mp-workspace/util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('containers:Login:LoginWithEmailPassword');

const SIGN_IN_WITH_ACCOUNT_MUTATION = gql`
  mutation SignInWithAccount($username: String!, $password: String!) {
    signInWithAccount(input: { username: $username, password: $password }) {
      isConfirmed
      isWalletLinked
      accessToken
    }
  }
`;

const LoginWithEmailPassword = (): JSX.Element => {
  debug('render');

  const {dispatch: dispatchLoginContext} = useLoginContext();
  const {dispatch} = useAppContext();
  const {enqueueSnackbar} = useSnackbar();
  const [signIn] = useMutation(SIGN_IN_WITH_ACCOUNT_MUTATION);

  const [inputEmail, setInpuEmail] = React.useState<string>('');
  const [inputPassword, setInputPassword] = React.useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangePassword = (event: React.ChangeEvent<any>) => {
    setInputPassword(event.target.value);
  };

  const loginFunction = async (event) => {
    event.preventDefault();
    dispatch(updateStateloadingPage(true));
    try {
      if (!emailValidation(inputEmail)) {
        throw new Error('Email is not valid');
      }
      await signIn({
        variables: {
          username: inputEmail,
          password: inputPassword,
        },
        onCompleted: (data) => {
          if (!isEmpty(data)) {
            if (isObject(data.signInWithAccount)) {
              if (!data.signInWithAccount.isConfirmed) {
                router.push(
                  {
                    pathname: '/verify',
                    query: {email: inputEmail, sendmail: true},
                  },
                  '/verify'
                );
              } else {
                enqueueSnackbar('Login success', {variant: 'success'});
                setTokenCookie(
                  ACCESS_TOKEN,
                  data.signInWithAccount.accessToken
                );
                setTokenCookie('isConnected', true);
                router.push('/profile/renting?page=1');
              }
            }
          }
          dispatch(updateStateloadingPage(false));
        },
        onError: (error: ApolloError) => {
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

  function onClickForgetPasswordLink() {
    dispatchLoginContext(updateStateDialogForgotPassword(true));
  }

  return (
    <Accordion
      sx={{
        color: 'text.primary',
        borderRadius: '0.6rem',
        textTransform: 'none',
        background:
          'linear-gradient(#4A399F,#4A399F) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
        border: '1px solid transparent',
        mt: '1rem',
        fontSize: 16,
      }}
    >
      <AccordionSummary
        aria-controls="Login-content"
        id="Login-header"
        sx={{
          '& .MuiAccordionSummary-content': {
            justifyContent: 'center',
            '&.Mui-expanded': {
              fontWeight: '500',
              fontSize: 18,
            },
          },
        }}
      >
        Login with Email & Password
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={loginFunction}>
          <Stack spacing={2}>
            <TextField
              required
              id="outlined-email-input"
              label="Enter your email address"
              type="email"
              value={inputEmail}
              onChange={(e) => setInpuEmail(e.target.value)}
              sx={{
                borderRadius: '0.6rem',
                backgroundColor: '#130C35',
                label: {
                  color: 'white',
                },
                fieldset: {
                  borderColor: '#675cab',
                  borderRadius: '0.6rem',
                },
              }}
            />

            <PasswordTextfield
              value={inputPassword}
              onChange={onChangePassword}
              label={'Enter your password'}
              bgColor={'#130C35'}
            />

            <Box textAlign={'right'}>
              <Box
                component={'span'}
                sx={{
                  color: 'aqua',
                  '&:hover': {
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  },
                }}
                onClick={onClickForgetPasswordLink}
              >
                Forget Password?
              </Box>
            </Box>
            <Button
              disabled={false}
              type={'submit'}
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
                fontWeight: 'bold',
              }}
            >
              Login
            </Button>
          </Stack>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default LoginWithEmailPassword;
