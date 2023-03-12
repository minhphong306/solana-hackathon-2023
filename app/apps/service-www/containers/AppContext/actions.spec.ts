import {
  updateStateloadingPage,
  updateStateUserName,
  updateStateIsConnectedLogin,
  updateStateInstallWallet,
  updateStateDialogVerifyAccount,
  updateStateDialogChangePassword,
  updateStateDialogSetupAccount,
  updateIsSyncingState,
  updateInvalidOwnerDialog,
  updateATAAddressNFTRobot,
  updateNFTPartState,
  updateTransferStateNFTRobotToken,
  dispatchSwapActionNFTPage,
  updateNFTRobotMetadata,
  updateUserPublicKey,
} from './actions';
import {
  UPDATE_STATE_LOADING_PAGE,
  UPDATE_STATE_USER_NAME,
  UPDATE_STATE_IS_CONNECT_ACCOUNT,
  UPDATE_STATE_INSTALL_WALLET,
  UPDATE_STATE_POPUP_VERIFY_ACCOUNT,
  UPDATE_STATE_POPUP_CHANGE_PASSWORD,
  UPDATE_STATE_POPUP_SETUP_ACCOUNT,
  UPDATE_IS_SYNCING_STATE,
  UPDATE_INVALID_OWNER_DIALOG,
  UPDATE_ATA_ADDRESS_NFT_ROBOT,
  UPDATE_NFT_PART_STATE,
  UPDATE_SWAP_ACTION_STATE,
  UPDATE_TRANSFER_STATE_NFT,
  UPDATE_USER_PUBLIC_KEY,
  UPDATE_NFT_ROBOT_METADATA,
} from './constants';

describe('containers/AppContext/actions', () => {
  it('updateStateloadingPage', () => {
    expect(updateStateloadingPage(true)).toEqual({
      type: UPDATE_STATE_LOADING_PAGE,
      payload: {
        loadingPage: true,
      },
    });
  });
  it('updateStateUserName', () => {
    expect(updateStateUserName('dungnt')).toEqual({
      type: UPDATE_STATE_USER_NAME,
      payload: {
        userName: 'dungnt',
      },
    });
  });
  it('updateStateIsConnectedLogin', () => {
    expect(updateStateIsConnectedLogin(true)).toEqual({
      type: UPDATE_STATE_IS_CONNECT_ACCOUNT,
      payload: {
        isConnected: true,
      },
    });
  });
  it('updateStateInstallWallet', () => {
    expect(updateStateInstallWallet(true)).toEqual({
      type: UPDATE_STATE_INSTALL_WALLET,
      payload: {
        dialogInstallWallet: true,
      },
    });
  });

  it('updateStateDialogVerifyAccount', () => {
    expect(updateStateDialogVerifyAccount(true)).toEqual({
      type: UPDATE_STATE_POPUP_VERIFY_ACCOUNT,
      payload: {
        dialogVerifyAccount: true,
      },
    });
  });
  it('updateStateDialogVerifyAccount', () => {
    expect(updateStateDialogVerifyAccount(true)).toEqual({
      type: UPDATE_STATE_POPUP_VERIFY_ACCOUNT,
      payload: {
        dialogVerifyAccount: true,
      },
    });
  });
  it('updateStateDialogChangePassword', () => {
    expect(updateStateDialogChangePassword(true)).toEqual({
      type: UPDATE_STATE_POPUP_CHANGE_PASSWORD,
      payload: {
        dialogChangePassword: true,
      },
    });
  });
  it('updateStateDialogSetupAccount', () => {
    expect(updateStateDialogSetupAccount(true)).toEqual({
      type: UPDATE_STATE_POPUP_SETUP_ACCOUNT,
      payload: {
        dialogSetupAccount: true,
      },
    });
  });

  it('updateIsSyncingState', () => {
    expect(updateIsSyncingState(true)).toEqual({
      type: UPDATE_IS_SYNCING_STATE,
      payload: {
        isSyncing: true,
      },
    });
  });

  it('updateInvalidOwnerDialog', () => {
    expect(updateInvalidOwnerDialog(true)).toEqual({
      type: UPDATE_INVALID_OWNER_DIALOG,
      payload: {
        open: true,
      },
    });
  });

  it('updateATAAddressNFTRobot', () => {
    expect(updateATAAddressNFTRobot('abcdc')).toEqual({
      type: UPDATE_ATA_ADDRESS_NFT_ROBOT,
      payload: {
        ataAddress: 'abcdc',
      },
    });
  });

  it('updateNFTPartState', () => {
    expect(updateNFTPartState(1, 'READY_MINT')).toEqual({
      type: UPDATE_NFT_PART_STATE,  // updateInvalidOwnerDialog,
      // updateATAAddressNFTRobot,
      // updateNFTPartState,
      // updateTransferStateNFTRobotToken,
      // dispatchSwapActionNFTPage,
      // updateNFTRobotMetadata,
      // updateUserPublicKey,
      payload: {
        idx: 1,
        partState: 'READY_MINT',
      },
    });
  });
  it('dispatchSwapActionNFTPage', () => {
    expect(dispatchSwapActionNFTPage(true)).toEqual({
      type: UPDATE_SWAP_ACTION_STATE,
      payload: {
        swapping: true,
      },
    });
  });
  it('updateTransferStateNFTRobotToken', () => {
    expect(updateTransferStateNFTRobotToken(true)).toEqual({
      type: UPDATE_TRANSFER_STATE_NFT,
      payload: {
        isTransfer: true,
      },
    });
  });
  it('updateUserPublicKey', () => {
    expect(updateUserPublicKey('123456789abcd')).toEqual({
      type: UPDATE_USER_PUBLIC_KEY,
      payload: {
        userPublicKey: '123456789abcd',
      },
    });
  });
  it('updateNFTRobotMetadata', () => {
    expect(updateNFTRobotMetadata('dung', 'http://gg.vn')).toEqual({
      type: UPDATE_NFT_ROBOT_METADATA,
      payload: {
        name: 'dung',
        url: 'http://gg.vn',
      },
    });
  });
});
