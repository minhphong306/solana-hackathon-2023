import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useAppContext, updateStateloadingPage} from '../AppContext';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {useSnackbar} from 'notistack';
import PasswordTextfield from '../../components/PasswordTextfield';
import {
  emailValidation,
  passwordValidation,
} from '@mp-workspace/util';
import {
  LIMIT_LENGTH_EMAIL,
  LIMIT_LENGTH_PASSWORD,
} from '../../utils/helpers/constants';
import Link from 'next/link';

const CreateAccountMutation = gql`
  mutation SignUpWithWallet($username: String!, $password: String!) {
    signUpWithWallet(input: { username: $username, password: $password }) {
      cognitoUserId
    }
  }
`;

export default function CreateAccount() {
  const {enqueueSnackbar} = useSnackbar();
  const router = useRouter();
  const {state, dispatch} = useAppContext();
  const [signUp] = useMutation(CreateAccountMutation);
  const [inpuEmail, setInpuEmail] = React.useState('');

  const [errorEmail, setErrorEmail] = React.useState<boolean>(false);

  const [errorPassword, setErrorPassword] = React.useState<boolean>(false);

  const [valuePassword, setPassword] = React.useState('');

  const [valueRepassword, setRepassword] = React.useState('');

  const [isShowBtnCreatAccount, setIsShowBtnCreatAccount] =
    React.useState<boolean>(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangePassword = (event: React.ChangeEvent<any>) => {
    setPassword(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeRepassword = (event: React.ChangeEvent<any>) => {
    setRepassword(event.target.value);
  };

  const createAccountButton = async (e) => {
    e.preventDefault();
    setErrorEmail(false);
    setErrorPassword(false);
    try {
      dispatch(updateStateloadingPage(true));
      if (!emailValidation(inpuEmail)) {
        setErrorEmail(true);
        throw new Error('Enter a valid email');
      }

      if (!passwordValidation(valuePassword)) {
        setErrorPassword(true);
        throw new Error(
          'Password has to include 8 or more characters with a mix of upper letters, normal letters, numbers & symbols'
        );
      }

      if (inpuEmail.length > LIMIT_LENGTH_EMAIL) {
        setErrorEmail(true);
        throw new Error('Your email is too long');
      }

      if (valuePassword.length > LIMIT_LENGTH_PASSWORD) {
        setErrorPassword(true);
        throw new Error('Your password is too long');
      }

      if (isEmpty(valuePassword) || isEmpty(valueRepassword)) {
        setErrorPassword(true);
        throw new Error('Password and repassword required');
      }

      if (!isEqual(valuePassword, valueRepassword)) {
        setErrorPassword(true);
        throw new Error('Password doesn’t match');
      }

      await signUp({
        variables: {
          username: inpuEmail,
          password: valuePassword,
        },
        onCompleted: (data) => {
          dispatch(updateStateloadingPage(false));
          router.push(
            {
              pathname: '/verify',
              query: {email: inpuEmail, sendmail: false},
            },
            '/verify'
          );
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      });
    } catch (err) {
      dispatch(updateStateloadingPage(false));
      enqueueSnackbar(err.message, {
        variant: 'error',
      });
    }
  };

  React.useEffect(() => {
    if (inpuEmail.length > 0 && valuePassword.length > 0) {
      isShowBtnCreatAccount && setIsShowBtnCreatAccount(false);
    } else {
      !isShowBtnCreatAccount && setIsShowBtnCreatAccount(true);
    }
  }, [inpuEmail, valuePassword]);

  return (
    <Box
      sx={{
        px: '2rem',
        py: '5rem',
      }}
    >
      <form onSubmit={createAccountButton}>
        <Typography
          variant="h5"
          textAlign={'left'}
          fontWeight={'bold'}
          marginBottom={2}
          sx={{textTransform: 'uppercase'}}
        >
          Create Game Account
        </Typography>
        <Stack spacing={3}>
          <TextField
            error={errorEmail}
            required
            id="outlined-email-input"
            label="Enter your email address"
            type="email"
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
              fieldset: {
                borderColor: '#675cab',
                borderRadius: '0.6rem',
              },
            }}
          />

          <PasswordTextfield
            value={valuePassword}
            onChange={onChangePassword}
            label={'Enter your password'}
            bgColor={'#130C35'}
            error={errorPassword}
          />

          <PasswordTextfield
            value={valueRepassword}
            onChange={onChangeRepassword}
            label={'Enter your password again'}
            bgColor={'#130C35'}
            error={errorPassword}
          />

          <Button
            disabled={isShowBtnCreatAccount}
            size="large"
            fullWidth
            type={'submit'}
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
          >
            Create new game account
          </Button>
          <Box textAlign={'center'} sx={{}}>
            By continuing, you agree to our{' '}
            <Link href="/terms" passHref>
              <a target={'_blank'} rel="noreferrer">
                <Box
                  textAlign={'center'}
                  component={'span'}
                  sx={{
                    color: 'aqua',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Terms Of Use
                </Box>
              </a>
            </Link>
          </Box>
          {/* <Box textAlign={'center'} sx={{}}>
            You already have an account?{' '}
            <Box
              textAlign={'center'}
              component={'span'}
              sx={{
                color: '#df9eff',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={() => {
                router.push('/');
              }}
            >
              Connect now
            </Box>
          </Box> */}
        </Stack>
      </form>
    </Box>
  );
}
