import Box from '@mui/material/Box';
import Profile from '../../components/Layout/Profile';
import AccountSetting from '../../containers/AccountSetting';
import LoginProvider from '../../containers/Login/Provider';
import ForgetPasswordModal from '../../containers/Login/ForgetPasswordModal';
import requireUserLogin from '../../containers/Account/requireUserLogin';

export default function AccountSettingPage() {
  return (
    <LoginProvider>
      <Profile
        childrent={
          <Box sx={{flexGrow: 1}}>
            <AccountSetting/>
            <ForgetPasswordModal/>
          </Box>
        }
      ></Profile>
    </LoginProvider>
  );
}

export const getServerSideProps = requireUserLogin;
