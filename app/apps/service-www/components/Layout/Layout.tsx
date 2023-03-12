import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../Navbar/Navbar';
import Meta from './Meta';

const Layout = ({ children }) => {
  return (
    <>
      <Meta
        title={process.env.NEXT_PUBLIC_SITE_TITLE}
        description={process.env.NEXT_PUBLIC_SITE_DESCRIPTION}
      />
      <Navbar />
      <React.Fragment>
        <CssBaseline />
        {children}
      </React.Fragment>
    </>
  );
};

export default Layout;
