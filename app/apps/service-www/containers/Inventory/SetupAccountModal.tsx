import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {
  useAppContext,
  updateStateDialogSetupAccount,
  updateStateloadingPage,
  updateStateDialogVerifyAccount,
} from '../AppContext';
import isEmpty from 'lodash/isEmpty';
// import isObject from 'lodash/isObject';
import { gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { isEqual } from 'lodash';
import {
  emailValidation,
  passwordValidation,
} from '@mp-workspace/util';
import {
  LIMIT_LENGTH_EMAIL,
  LIMIT_LENGTH_PASSWORD,
} from '../../utils/helpers/constants';
import PasswordTextfield from '../../components/PasswordTextfield';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation SignUpWithWallet($username: String!, $password: String!) {
    signUpWithWallet(input: { username: $username, password: $password }) {
      cognitoUserId
    }
  }
`;

export default function SetUpAccont() {
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const [createAccount] = useMutation(CREATE_ACCOUNT_MUTATION);
  const [inpuEmail, setInpuEmail] = React.useState<string>('');
  const [valuePassword, setPassword] = React.useState('');

  const [valueRepassword, setRepassword] = React.useState('');

  const [errorEmail, setErrorEmail] = React.useState<boolean>(false);

  const [errorPassword, setErrorPassword] = React.useState<boolean>(false);

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

  const closeModalSetupAccount = () => {
    dispatch(updateStateDialogSetupAccount(false));
    setRepassword('');
    setPassword('');
    localStorage.removeItem('email');
  };

  const createAccountForm = async (e: React.MouseEvent<any>) => {
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

      await createAccount({
        variables: {
          username: inpuEmail,
          password: valuePassword,
        },
        onCompleted: (data) => {
          localStorage.setItem('email', inpuEmail);
          dispatch(updateStateloadingPage(false));
          dispatch(updateStateDialogSetupAccount(false));
          dispatch(updateStateDialogVerifyAccount(true));
          enqueueSnackbar('Create account success', { variant: 'success' });
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

  React.useEffect(() => {
    if (inpuEmail.length > 0 && valuePassword.length > 0) {
      isShowBtnCreatAccount && setIsShowBtnCreatAccount(false);
    } else {
      !isShowBtnCreatAccount && setIsShowBtnCreatAccount(true);
    }
  }, [inpuEmail, valuePassword]);

  return (
    <Modal
      open={state.inventory.dialogSetupAccount}
      aria-labelledby="modal-setup-account"
      aria-describedby="modal-setup-account"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={createAccountForm}>
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
            onClick={closeModalSetupAccount}
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
              Setup email & password
            </Typography>
            <TextField
              error={errorEmail}
              required
              fullWidth
              id="outlined-email-input"
              label="Enter your email address"
              type="email"
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
              bgColor={'#32257B'}
              error={errorPassword}
            />

            <PasswordTextfield
              value={valueRepassword}
              onChange={onChangeRepassword}
              label={'Enter your password again'}
              bgColor={'#32257B'}
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
