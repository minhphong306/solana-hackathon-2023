import { createAction } from 'redux-actions';
import {
  UPDATE_STATE_LOADING_PAGE,
  UPDATE_STATE_USER_NAME,
  UPDATE_STATE_IS_CONNECT_ACCOUNT,
  UPDATE_STATE_INSTALL_WALLET,
  UPDATE_INVALID_NFT_ADDRESS_DIALOG,
  UPDATE_INVALID_MASTER_EDITION_DIALOG,
  UPDATE_WRONG_WALLET_DIALOG,
  UPDATE_UNSUCCESS_DIALOG,
  UPDATE_SUCCESS_SWAP_DIALOG,
  UPDATE_NOT_ENOUGH_BALANCE_DIALOG,
  UPDATE_NFT_PAGE_LOADING_STATE,
  UPDATE_NFT_PAGE_READY_STATE,
  CLEAR_DATA_NFT_PAGE,
  UPDATE_ATA_ADDRESS_NFT_ROBOT,
  UPDATE_NFT_PARTS,
  UPDATE_NFT_PART_STATE,
  UPDATE_SWAP_ACTION_STATE,
  UPDATE_TRANSFER_STATE_NFT,
  UPDATE_USER_PUBLIC_KEY,
  UPDATE_NFT_ROBOT_METADATA,
  UPDATE_NFT_ADDRESS_NFT_ROBOT,
  UPDATE_STATE_POPUP_SETUP_ACCOUNT,
  UPDATE_STATE_POPUP_VERIFY_ACCOUNT,
  UPDATE_IS_SYNCING_STATE,
  UPDATE_INVALID_OWNER_DIALOG,
  UPDATE_STATE_POPUP_CHANGE_PASSWORD,
  UPDATE_STATE_POPUP_CLAIM_TOKEN,
  UPDATE_STATE_POPUP_WITHDRAWAL_TOKEN,
  UPDATE_STATE_POPUP_DEPOSIT_TOKEN, UPDATE_STATE_POPUP_LIST_RENT_OUT, UPDATE_STATE_POPUP_UPDATE_RENT_OUT,
} from './constants';

export const updateStateloadingPage = createAction(
  UPDATE_STATE_LOADING_PAGE,
  (loadingPage: boolean) => ({
    loadingPage,
  })
);

export const updateStateUserName = createAction(
  UPDATE_STATE_USER_NAME,
  (userName: string) => ({
    userName,
  })
);

export const updateStateIsConnectedLogin = createAction(
  UPDATE_STATE_IS_CONNECT_ACCOUNT,
  (isConnected: boolean) => ({
    isConnected,
  })
);

export const updateStateInstallWallet = createAction(
  UPDATE_STATE_INSTALL_WALLET,
  (dialogInstallWallet: boolean) => ({
    dialogInstallWallet,
  })
);

export const updateUserPublicKey = createAction(
  UPDATE_USER_PUBLIC_KEY,
  (userPublicKey: string) => ({
    userPublicKey,
  })
);

/**
 * SYNCING_STATE
 */
export const updateIsSyncingState = createAction(
  UPDATE_IS_SYNCING_STATE,
  (isSyncing: boolean) => ({
    isSyncing,
  })
);

/**
 * NFT PAGE
 */
export const updateNFTRobotMetadata = createAction(
  UPDATE_NFT_ROBOT_METADATA,
  (name: string, url: string) => ({
    name,
    url,
  })
);

export const updateInvalidNFTAddressDialog = createAction(
  UPDATE_INVALID_NFT_ADDRESS_DIALOG,
  (open: boolean) => ({
    open,
  })
);

export const updateInvalidOwnerDialog = createAction(
  UPDATE_INVALID_OWNER_DIALOG,
  (open: boolean) => ({
    open,
  })
);

export const updateInvalidMasterEditionDialog = createAction(
  UPDATE_INVALID_MASTER_EDITION_DIALOG,
  (open: boolean) => ({
    open,
  })
);

export const updateWrongWalletDialog = createAction(
  UPDATE_WRONG_WALLET_DIALOG,
  (open: boolean) => ({
    open,
  })
);

export const updateUnsuccessDialog = createAction(
  UPDATE_UNSUCCESS_DIALOG,
  (open: boolean) => ({
    open,
  })
);

export const updateSuccessSwapDialog = createAction(
  UPDATE_SUCCESS_SWAP_DIALOG,
  (open: boolean) => ({
    open,
  })
);

export const updateNotEnoughBalanceDialog = createAction(
  UPDATE_NOT_ENOUGH_BALANCE_DIALOG,
  (open: boolean) => ({
    open,
  })
);

export const dispatchLoadingNFTPage = createAction(
  UPDATE_NFT_PAGE_LOADING_STATE,
  (nftAddress: string) => ({
    nftAddress,
  })
);

export const dispatchReadyNFTPage = createAction(UPDATE_NFT_PAGE_READY_STATE);

export const clearDataNFTPage = createAction(CLEAR_DATA_NFT_PAGE);

export const updateNFTAddressNFTRobot = createAction(
  UPDATE_NFT_ADDRESS_NFT_ROBOT,
  (nftAddress: string) => ({
    nftAddress,
  })
);

export const updateATAAddressNFTRobot = createAction(
  UPDATE_ATA_ADDRESS_NFT_ROBOT,
  (ataAddress: string) => ({
    ataAddress,
  })
);

export const updateNFTParts = createAction(
  UPDATE_NFT_PARTS,
  (
    parts: {
      name: string;
      type: string;
      imgUrl: string;
      category: string;
    }[]
  ) => ({
    parts,
  })
);

export const updateNFTPartState = createAction(
  UPDATE_NFT_PART_STATE,
  (idx: number, partState: string) => ({
    idx,
    partState,
  })
);

export const dispatchSwapActionNFTPage = createAction(
  UPDATE_SWAP_ACTION_STATE,
  (swapping: boolean) => ({
    swapping,
  })
);

export const updateTransferStateNFTRobotToken = createAction(
  UPDATE_TRANSFER_STATE_NFT,
  (isTransfer: boolean) => ({
    isTransfer,
  })
);

export const updateStateDialogSetupAccount = createAction(
  UPDATE_STATE_POPUP_SETUP_ACCOUNT,
  (dialogSetupAccount: boolean) => ({
    dialogSetupAccount,
  })
);

export const updateStateDialogChangePassword = createAction(
  UPDATE_STATE_POPUP_CHANGE_PASSWORD,
  (dialogChangePassword: boolean) => ({
    dialogChangePassword,
  })
);

export const updateStateDialogVerifyAccount = createAction(
  UPDATE_STATE_POPUP_VERIFY_ACCOUNT,
  (dialogVerifyAccount: boolean) => ({
    dialogVerifyAccount,
  })
);

export const updateStateDialogClaimToken = createAction(
  UPDATE_STATE_POPUP_CLAIM_TOKEN,
  (dialogClaimToken: boolean) => ({
    dialogClaimToken,
  })
);

export const updateStateDialogWithdrawalToken = createAction(
  UPDATE_STATE_POPUP_WITHDRAWAL_TOKEN,
  (dialogWithdrawalToken: boolean) => ({
    dialogWithdrawalToken,
  })
);

export const updateStateDialogDepositToken = createAction(
  UPDATE_STATE_POPUP_DEPOSIT_TOKEN,
  (dialogDepositToken: boolean) => ({
    dialogDepositToken,
  })
);

export const updateStateDialogListRentOut = createAction(
  UPDATE_STATE_POPUP_LIST_RENT_OUT,
  (dialogListRentOut: boolean) => ({
    dialogListRentOut,
  })
);

export const updateStateDialogUpdateRentOut = createAction(
  UPDATE_STATE_POPUP_UPDATE_RENT_OUT,
  (dialogUpdateRentOut: boolean) => ({
    dialogUpdateRentOut,
  })
);
