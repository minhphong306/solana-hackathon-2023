import * as React from 'react';
import Box from '@mui/material/Box';
import Profile from '../../components/Layout/Profile';
import RentingInventory from '../../containers/Renting/inventory';
import requireUserLogin from "../../containers/Account/requireUserLogin";

export default function RentingInventoryPage() {
  return (
    <Profile
      childrent={
        <Box sx={{flexGrow: 1}}>
          <RentingInventory/>
        </Box>
      }
    ></Profile>
  );
}

export const getServerSideProps = requireUserLogin;
