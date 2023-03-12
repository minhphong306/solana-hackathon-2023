import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Renting from '../../components/Layout/Renting';
import RentingMain from '../../containers/Renting';
import requireUserLogin from "../../containers/Account/requireUserLogin";
import SidebarContainer from "../../components/SidebarContainer";

export default function Index() {
  return (
    <Renting
      childrent={
        <Box sx={{flexGrow: 1}}>
          <Grid container>
            <Grid
              item
              sm={5}
              md={4}
              lg={3}
              xl={2.5}
              bgcolor={'background.default'}
            >
              <SidebarContainer/>
            </Grid>
            <Grid
              item
              sm={7}
              md={8}
              lg={9}
              xl={9.5}
              sx={{backgroundColor: '#190C49'}}
            >
              <RentingMain/>
            </Grid>
          </Grid>
        </Box>
      }></Renting>
  );
}

export const getServerSideProps = requireUserLogin;
