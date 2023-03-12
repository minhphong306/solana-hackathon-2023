import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {
  useAppContext,
  updateStateDialogChangePassword,
  updateStateloadingPage,
} from '../AppContext';
import isEmpty from 'lodash/isEmpty';
// import isObject from 'lodash/isObject';
import { gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { isEqual } from 'lodash';
import { passwordValidation } from '@mp-workspace/util';
import { LIMIT_LENGTH_PASSWORD } from '../../utils/helpers/constants';
import PasswordTextfield from '../../components/PasswordTextfield';
import { setTokenCookie } from '../../lib/AuthCookies';
import { ACCESS_TOKEN } from '../../constants';
import { updateStateDialogForgotPassword } from '../Login/actions';
import { useLoginContext } from '../Login/selectors';

const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      input: { currentPassword: $currentPassword, newPassword: $newPassword }
    ) {
      accessToken
    }
  }
`;

export default function ChangePasswordModal() {
  const { state, dispatch } = useAppContext();
  const { dispatch: dispatchLoginContext } = useLoginContext();
  const { enqueueSnackbar } = useSnackbar();
  const [changePasswordMutation] = useMutation(CHANGE_PASSWORD_MUTATION);
  const [valueCurrentPassword, setCurrentPassword] = React.useState<string>('');
  const [valuePassword, setPassword] = React.useState<string>('');

  const [valueRepassword, setRepassword] = React.useState<string>('');

  const [errorCurrentPassword, setErrorCurrentPassword] =
    React.useState<boolean>(false);

  const [errorPassword, setErrorPassword] = React.useState<boolean>(false);

  const [isShowBtnConfirm, setIsShowBtnConfirm] = React.useState<boolean>(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeCurrentPassword = (event: React.ChangeEvent<any>) => {
    setCurrentPassword(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangePassword = (event: React.ChangeEvent<any>) => {
    setPassword(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeRepassword = (event: React.ChangeEvent<any>) => {
    setRepassword(event.target.value);
  };

  const closeModalSetupAccount = () => {
    dispatch(updateStateDialogChangePassword(false));
    setRepassword('');
    setCurrentPassword('');
    setPassword('');
  };

  const changePasswordForm = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    setErrorCurrentPassword(false);
    setErrorPassword(false);
    try {
      dispatch(updateStateloadingPage(true));

      if (!passwordValidation(valueCurrentPassword)) {
        setErrorCurrentPassword(true);
        throw new Error(
          'Password has to include 8 or more characters with a mix of upper letters, normal letters, numbers & symbols'
        );
      }

      if (!passwordValidation(valuePassword)) {
        setErrorPassword(true);
        throw new Error(
          'Password has to include 8 or more characters with a mix of upper letters, normal letters, numbers & symbols'
        );
      }

      if (valueCurrentPassword.length > LIMIT_LENGTH_PASSWORD) {
        setErrorCurrentPassword(true);
        throw new Error('Your password is too long');
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

      await changePasswordMutation({
        variables: {
          currentPassword: valueCurrentPassword,
          newPassword: valuePassword,
        },
        onCompleted: (data) => {
          setTokenCookie(ACCESS_TOKEN, data.changePassword.accessToken);
          dispatch(updateStateloadingPage(false));
          dispatch(updateStateDialogChangePassword(false));
          setRepassword('');
          setCurrentPassword('');
          setPassword('');
          enqueueSnackbar('Change password success', { variant: 'success' });
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

  function onClickForgetPasswordLink() {
    dispatch(updateStateDialogChangePassword(false));
    dispatchLoginContext(updateStateDialogForgotPassword(true));
  }

  React.useEffect(() => {
    if (valueCurrentPassword.length > 0 && valuePassword.length > 0) {
      isShowBtnConfirm && setIsShowBtnConfirm(false);
    } else {
      !isShowBtnConfirm && setIsShowBtnConfirm(true);
    }
  }, [valueCurrentPassword, valuePassword]);

  return (
    <Modal
      open={state.profile.dialogChangePassword}
      aria-labelledby="modal-setup-account"
      aria-describedby="modal-setup-account"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={changePasswordForm}>
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
              Change password
            </Typography>

            <PasswordTextfield
              value={valueCurrentPassword}
              onChange={onChangeCurrentPassword}
              label={'Enter current password'}
              bgColor={'#32257B'}
              error={errorCurrentPassword}
            />

            <Box
              textAlign={'right'}
              sx={{
                width: '100%',
                '&.MuiBox-root': {
                  marginTop: 0,
                },
              }}
            >
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
              disabled={isShowBtnConfirm}
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
              Confirm
            </Button>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
}
