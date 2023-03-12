import {gql, useMutation} from '@apollo/client';
import React, {useState, useEffect, useContext} from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  IconButton,
  CardMedia,
} from '@mui/material';
import {useAppContext} from '../AppContext';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {useRouter} from 'next/router';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

const linkWalletMutation = gql`
  mutation linkWallet($wallet: String!) {
    linkWallet(linkInput: { wallet: $wallet })
  }
`;

export default function LinkAccount() {
  const router = useRouter();
  const {state, dispatch} = useAppContext();
  const paramPath = router.query;
  const [linkWallet, {data, loading, error}] =
    useMutation(linkWalletMutation);
  const [ValuePassword, setPassword] = React.useState({
    showPassword: false,
    password: '',
  });
  const [inpuEmail, setInpuEmail] = React.useState('');

  const handleChangePassword = (prop) => (event) => {
    setPassword({...ValuePassword, [prop]: event.target.value});
  };

  const handleClickShowPassword = () => {
    setPassword({
      ...ValuePassword,
      showPassword: !ValuePassword.showPassword,
    });
  };

  const LinkAccountButton = async () => {
    linkWallet({
      variables: {
        wallet: paramPath.publicKey,
      },
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log('error handle', error);
        alert(error.message);
      },
    });
  };
  return (
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
        sx={{textTransform: 'uppercase'}}
      >
        link to game account
      </Typography>
      <Stack spacing={3}>
        <TextField
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

        <FormControl
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
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">
            Enter your password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={ValuePassword.showPassword ? 'text' : 'password'}
            value={ValuePassword.password}
            onChange={handleChangePassword('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {ValuePassword.showPassword ? (
                    <VisibilityOffOutlinedIcon sx={{color: 'white'}}/>
                  ) : (
                    <VisibilityOutlinedIcon sx={{color: 'white'}}/>
                  )}
                </IconButton>
              </InputAdornment>
            }
            label="Enter your password"
          />
        </FormControl>

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
          onClick={LinkAccountButton}
        >
          Link to existing game account
        </Button>
        <Box textAlign={'center'} sx={{}}>
          By continuing, you agree to our{' '}
          <Box textAlign={'center'} component={'span'} sx={{color: 'aqua'}}>
            Terms Of Use
          </Box>
        </Box>
        <Box textAlign={'center'} sx={{}}>
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
              router.push('/createaccount');
            }}
          >
            Create now
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
