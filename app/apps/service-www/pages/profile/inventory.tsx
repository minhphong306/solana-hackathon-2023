import * as React from 'react';
import Box from '@mui/material/Box';
import Profile from '../../components/Layout/Profile';
import InventoryMain from '../../containers/Inventory';
import requireUserLogin from "../../containers/Account/requireUserLogin";

export default function Inventory() {
  return (
    <Profile
      childrent={
        <Box sx={{flexGrow: 1}}>
          <InventoryMain/>
        </Box>
      }
    ></Profile>
  );
}

export const getServerSideProps = requireUserLogin;
