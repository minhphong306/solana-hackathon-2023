import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useUser } from '../../lib/Hooks';
import LinkSetupAccount from '../../containers/Account/SetupAccountLinkModal';
import {
  useAppContext,
  updateStateloadingPage,
  updateStateDialogChangePassword,
} from '../AppContext';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { ChangeEvent } from 'react';
import { Stack } from '@mui/material';
import { get } from 'dot-prop';
import { gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import ChangePasswordModal from './ChangePasswordModal';
import { setTokenCookie } from '../../lib/AuthCookies';
import { ACCESS_TOKEN } from '../../constants';
import { useRouter } from 'next/router';

const CHANGE_USER_NAME = gql`
  mutation changeUsername($username: String!) {
    changeUsername(input: { username: $username }) {
      accessToken
    }
  }
`;

const AccountSetting = () => {
  const { state, dispatch } = useAppContext();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [changeNameMutation] = useMutation(CHANGE_USER_NAME);
  const checkUser = useUser();
  const [inputName, setInputName] = React.useState<string>('');
  const isEmailConfirmed = get(
    checkUser,
    'profileInfo.isEmailConfirmed',
    false
  );
  const emailUser = get(checkUser, 'profileInfo.email', '');
  const isWalletLinked = get(checkUser, 'profileInfo.isWalletLinked', false);
  const isChangedNickName = get(
    checkUser,
    'profileInfo.isChangedNickName',
    true
  );
  const nameUser = get(checkUser, 'profileInfo.nickname', '');
  const onChangeInputName = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputName(e.target.value);
  };

  const changeNameFunction = async (event: React.MouseEvent<never>) => {
    event.preventDefault();
    dispatch(updateStateloadingPage(true));
    try {
      await changeNameMutation({
        variables: {
          username: inputName,
        },
        onCompleted: (data) => {
          setTokenCookie(ACCESS_TOKEN, data.changeUsername.accessToken);
          router.reload();
          dispatch(updateStateloadingPage(false));
          enqueueSnackbar('Successfully renamed', { variant: 'success' });
        },
        onError: (error) => {
          throw new Error(error.message);
        },
      });
    } catch (e) {
      console.log(e);
      dispatch(updateStateloadingPage(false));
      enqueueSnackbar(e.message, {
        variant: 'error',
      });
    }
  };

  const openModalChangePassword = () => {
    dispatch(updateStateDialogChangePassword(true));
  };

  return (
    <Box sx={{ py: '1rem' }}>
      <LinkSetupAccount />
      <Typography
        component="h3"
        sx={{ fontSize: '1.5rem', fontWeight: 700, mt: '1rem' }}
      >
        Account settings
      </Typography>
      <Divider sx={{ borderColor: '#4A399F', my: '1rem' }} />
      <Typography component="div" sx={{ fontSize: '1.2rem', mx: '0.5rem' }}>
        Name
      </Typography>
      <FormControl
        sx={{
          m: 1,
          width: 2 / 5,
          borderRadius: '0.6rem',
          backgroundColor: '#130C35',
          label: {
            color: 'white',
          },
          fieldset: {
            borderColor: '#675CAB',
            borderRadius: '0.6rem',
          },
        }}
        variant="outlined"
      >
        <OutlinedInput
          disabled={isChangedNickName}
          id="outlined-adornment-inputName"
          value={isChangedNickName ? nameUser : inputName}
          onChange={onChangeInputName}
          placeholder={isChangedNickName ? '' : nameUser}
          endAdornment={
            <InputAdornment onClick={changeNameFunction} position="end">
              <Button
                disabled={!(inputName.length > 0)}
                sx={{
                  color: 'white',
                  textTransform: 'capitalize',
                  '&.Mui-disabled': {
                    color: '#9e9e9e',
                  },
                }}
              >
                Save change
              </Button>
            </InputAdornment>
          }
          aria-describedby="outlined-inputName-helper-text"
          sx={{
            '& .MuiOutlinedInput-input.MuiInputBase-input.Mui-disabled': {
              '-webkitTextFillColor': '#9e9e9e',
            },
          }}
        />
      </FormControl>
      <Typography
        component="div"
        sx={{ fontSize: '1.2rem', mx: '0.5rem', mt: '0.6rem' }}
      >
        Email address
      </Typography>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          m: 0.9,
          px: '1rem',
          py: '0.8rem',
          width: 2 / 5,
          borderRadius: '0.6rem',
          backgroundColor: '#241E4F',
          border: '1px solid #675CAB',
        }}
      >
        <Typography>{isWalletLinked && emailUser}</Typography>
        <Typography sx={{ color: isEmailConfirmed ? '#0BCD36' : '#F96800' }}>
          {isEmailConfirmed ? 'Verified' : 'Not Verified'}
        </Typography>
      </Stack>
      <Typography
        component="div"
        sx={{ fontSize: '1.2rem', mx: '0.5rem', mt: '0.6rem' }}
      >
        Password
      </Typography>
      <Button
        disabled={!(isWalletLinked && isEmailConfirmed)}
        size="large"
        onClick={openModalChangePassword}
        sx={{
          color: 'text.primary',
          borderRadius: '0.6rem',
          textTransform: 'none',
          background:
            'linear-gradient(#6853D3,#6853D3) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
          border: '1px solid transparent',
          fontSize: 16,
          fontWeight: 'bold',
          width: 2 / 5,
          m: 1,
          py: '0.6rem',
        }}
      >
        Change password
      </Button>
      <ChangePasswordModal />
    </Box>
  );
};

export default AccountSetting;
