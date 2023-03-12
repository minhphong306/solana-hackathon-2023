import * as React from 'react';
import {Typography, Box, Container, Divider} from '@mui/material';
import LoginLayout from '../components/Layout/Login';
import LoginProvider from '../containers/Login/Provider';
import ForgetPasswordModal from '../containers/Login/ForgetPasswordModal';
import LoginWithWalletButton from '../containers/Login/LoginWithWalletButton';
import LoginWithEmailPassword from '../containers/Login/LoginWithEmailPassword';
import Link from 'next/link';
import requireUserNotLoggedIn from '../containers/Account/requireUserNotLoggedIn';

export default function LoginPage() {
  return (
    <LoginProvider>
      <LoginLayout>
        <Container maxWidth="md" sx={{p: '1rem'}}>
          <Box component="span" sx={{}}>
            <Container maxWidth="sm" sx={{p: '1rem'}}>
              <Typography
                fontSize={'1.4rem'}
                fontWeight={'bold'}
                component="div"
              >
                Login to your dashboard
              </Typography>

              <LoginWithWalletButton/>
              <LoginWithEmailPassword/>

              <Box textAlign={'center'} sx={{mt: '2rem'}}>
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
              <Box sx={{my: '1rem'}}>
                <Divider
                  sx={{
                    borderColor: '#4A399F',
                  }}
                />
                <Divider
                  sx={{
                    borderColor: '#1B1342',
                  }}
                />
              </Box>
              <Box textAlign={'center'} sx={{color: '#9590b6'}}>
                Don’t have available wallet, create new wallet to join our
                marketplace by clicking &quot;Login with wallet&quot; to view
                our guide
              </Box>
            </Container>
          </Box>
        </Container>
      </LoginLayout>
      <ForgetPasswordModal/>
    </LoginProvider>
  );
}

export const getServerSideProps = requireUserNotLoggedIn;


