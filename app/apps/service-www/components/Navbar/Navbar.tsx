import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {useAppContext} from '../../containers/AppContext';
import {Box, Typography, Avatar, Chip} from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {getCookie, setTokenCookie} from '../../lib/AuthCookies';
import {useUser} from '../../lib/Hooks';
import {useWallet} from '@solana/wallet-adapter-react';
import {WalletMultiButton as MaterialUIWalletMultiButton} from '@solana/wallet-adapter-material-ui';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const checkUser = useUser();
  const {state, dispatch} = useAppContext();
  const router = useRouter();
  const wallet = useWallet();
  useEffect(() => {
    if (!isEmpty(checkUser)) {
      if (!isEmpty(checkUser.profileInfo)) {
        setTokenCookie('isConnected', true);
      }
    }
  }, [checkUser]);

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="fixed" sx={{backgroundColor: '#070418'}}>
        <Toolbar>
          <Typography component="div" sx={{flexGrow: 1}}>
            {/*<Link href={'/Renting'} passHref>*/}
            <Box component="span">
              <LazyLoadImage
                src="/SOLPLAY.png"
                alt="Picture of the author"
                effect="blur"
                width={121}
                height={28}
              />
            </Box>
            {/*</Link>*/}
          </Typography>
          {(!isEmpty(checkUser) &&
            !isEmpty(checkUser.profileInfo)) && (
            <>
              <Link href="/renting" passHref>
                <Typography component="div" sx={{flexGrow: 6, cursor: 'pointer'}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.123 7.25L6.914 2H2.8L1.081 6.5C1.028 6.66 1 6.826 1 7C1 8.104 2.15 9 3.571 9C4.881 9 5.964 8.236 6.123 7.25ZM10 9C11.42 9 12.571 8.104 12.571 7C12.571 6.959 12.568 6.918 12.566 6.879L12.057 2H7.943L7.433 6.875C7.431 6.916 7.429 6.957 7.429 7C7.429 8.104 8.58 9 10 9ZM15 10.046V14H5V10.052C4.562 10.21 4.08 10.3 3.571 10.3C3.376 10.3 3.187 10.277 3 10.251V16.6C3 17.37 3.629 18 4.398 18H15.6C16.37 18 17 17.369 17 16.6V10.252C16.811 10.281 16.6202 10.2974 16.429 10.301C15.9414 10.3005 15.4577 10.2142 15 10.046ZM18.92 6.5L17.199 2H13.086L13.876 7.242C14.03 8.232 15.113 9 16.429 9C17.849 9 19 8.104 19 7C19 6.826 18.972 6.66 18.92 6.5Z"
                        fill="white"
                      />
                    </svg>
                    <Box sx={{fontWeight: 'bold'}}>
                      Renting
                    </Box>
                  </Box>
                </Typography>
              </Link>
              {/* <Link href="/profile/renting?page=1" passHref>
                <Typography component="div" sx={{flexGrow: 5, cursor: 'pointer'}}>
                  <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <AccountCircleIcon/>
                    <Box sx={{fontWeight: 'bold'}}>Profile</Box>
                  </Box>
                </Typography>
              </Link>*/}
            </>
          )}
          {/*  todo: tách dashboard vs marketplace, thêm link menu điều hướng 2 page */}
          {/* <MaterialUIWalletMultiButton
              sx={{
                backgroundImage:
                  'linear-gradient(to right, rgba(90,9,251), rgba(151,39,237));',
                borderRadius: 6,
                textTransform: 'capitalize',
                fontWeight: '600',
              }}
            /> */}
          {!wallet.publicKey &&
            (router.pathname === '/swap/[nftAddress]' ||
              router.pathname === '/profile/claim-token') &&
            (
              <MaterialUIWalletMultiButton
                sx={{
                  marginRight: '1rem',
                  backgroundImage:
                    'linear-gradient(to right, rgba(90,9,251), rgba(151,39,237));',
                  borderRadius: 6,
                  textTransform: 'capitalize',
                  fontWeight: '600',
                }}
              />
            )}
          {!isEmpty(checkUser) &&
            !isEmpty(checkUser.profileInfo) &&
            getCookie('isConnected') == 'true' &&
            (
              <Link href="/profile/renting?page=1" passHref>
                <Chip
                  avatar={
                    <Avatar
                      alt="avatar"
                      src="/service-www/avatar_profile.png"
                    />
                  }
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '1rem',
                    '& .MuiChip-avatar': {
                      width: '2.5rem',
                      height: '2.5rem',
                    },
                  }}
                  label={
                    checkUser?.profileInfo?.nickname.length > 10
                      ? checkUser.profileInfo?.nickname.slice(0, 10) + '...'
                      : checkUser.profileInfo?.nickname
                  }
                  variant="filled"
                />
              </Link>
            )}
        </Toolbar>
        {state.loadingPage ? <LinearProgress color="inherit"/> : ''}
      </AppBar>
    </Box>
  );
};

export default Navbar;
