import {get} from 'dot-prop';
import Typography from "@mui/material/Typography";
import {updateStateDialogSetupAccount, useAppContext} from "../AppContext";
import {useUser} from '../../lib/Hooks';
import SetUpAccont from "../Inventory/SetupAccountModal";
import VerifyAccont from "../Inventory/VerifyAccountModal";
import * as React from "react";

export default function LinkSetupAccount() {
  const {state, dispatch} = useAppContext();
  const checkUser = useUser();
  const checkWalletLinked = get(checkUser, 'profileInfo.isWalletLinked', true);
  // const checkEmailConfirm = get(checkUser, 'profileInfo.isEmailConfirmed', false);

  return (
    <>
      {!checkWalletLinked && (
        <Typography>
          Let&#39;s complete setting up your account.{' '}
          <Typography
            onClick={() => dispatch(updateStateDialogSetupAccount(true))}
            component="span"
            sx={{
              color: '#00F8FF', textDecoration: 'underline', cursor: 'pointer',
            }}
          >
            Set up email {'&'} password
          </Typography>
        </Typography>
      )}
      <SetUpAccont/>
      <VerifyAccont/>
    </>
  );
}

