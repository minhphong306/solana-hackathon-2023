import * as React from 'react';
import { useAppContext, updateStateloadingPage } from '../AppContext';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import isEqual from 'lodash/isEqual';
import { useSnackbar } from 'notistack';
import PasswordTextfield from '../../components/PasswordTextfield';
import TextField from '@mui/material/TextField';
import { passwordValidation } from '@mp-workspace/util';
import { LIMIT_LENGTH_PASSWORD } from '../../utils/helpers/constants';
const CONFIRM_PASSWORD = gql`
  mutation ConfirmForgotPassword(
    $email: String!
    $password: String!
    $code: String!
  ) {
    confirmForgotPassword(
      input: { email: $email, password: $password, code: $code }
    ) {
      isSet
    }
  }
`;

export default function ResetPassword() {
  const { enqueueSnackbar } = useSnackbar();
  const [confirmPassword, { data, loading, error }] =
    useMutation(CONFIRM_PASSWORD);
  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const paramPath = router.query;
  const [valueCode, setCode] = React.useState('');
  const [valuePassword, setPassword] = React.useState('');
  const [valueRepassword, setRepassword] = React.useState('');
  const [errorEmail, setErrorEmail] = React.useState<boolean>(false);

  const [errorPassword, setErrorPassword] = React.useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangeCode = (event: React.ChangeEvent<any>) => {
    setCode(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangePassword = (event: React.ChangeEvent<any>) => {
    setPassword(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeRepassword = (event: React.ChangeEvent<any>) => {
    setRepassword(event.target.value);
  };

  React.useEffect(() => {
    if (!isEmpty(paramPath.email)) {
      localStorage.setItem('email', paramPath.email.toString());
    }
  }, []);

  const submitFunction = async (event) => {
    event.preventDefault();
    setErrorEmail(false);
    setErrorPassword(false);
    try {
      dispatch(updateStateloadingPage(true));
      if (!passwordValidation(valuePassword)) {
        setErrorPassword(true);
        throw new Error(
          'Password has to include 8 or more characters with a mix of upper letters, normal letters, numbers & symbols'
        );
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

      await confirmPassword({
        variables: {
          email: localStorage.getItem('email'),
          password: valuePassword,
          code: valueCode,
        },
        onCompleted: (data) => {
          dispatch(updateStateloadingPage(false));
          enqueueSnackbar('Change password success', {
            variant: 'success',
          });
          if (!isEmpty(data)) {
            if (isObject(data.confirmForgotPassword)) {
              router.push('/');
            }
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
  return (
    <Stack
      justifyContent={'center'}
      alignItems={'center'}
      direction={'row'}
      sx={{ mt: '15rem' }}
    >
      <form onSubmit={submitFunction}>
        <Stack
          sx={{
            p: '1rem',
            bgcolor: '#32257b',
            border: '1px solid #5b4e94',
            borderRadius: '0.6rem',
            width: '30rem',
          }}
          spacing={2}
        >
          <Typography textAlign={'center'} fontWeight={'bold'}>
            Reset new password
          </Typography>

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
          <TextField
            required
            id="outlined-email-input"
            label="Enter confirmation code"
            type="text"
            onChange={handleChangeCode}
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

          <Button
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
            type={'submit'}
          >
            Confirm new password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
