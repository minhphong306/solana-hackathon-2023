import {handleActions} from 'redux-actions';
import {clusterApiUrl, Connection} from '@solana/web3.js';
import {get, set} from 'dot-prop';
import cloneDeep from 'lodash/cloneDeep';
import {
  SWITCH_ENDPOINT,
  CONNECT_SUCCESS,
  READY,
  INIT,
  UPDATE_WALLET_CONNECTION,
  UPDATE_STATE_LOADING_PAGE,
  UPDATE_STATE_USER_NAME,
  UPDATE_STATE_IS_CONNECT_ACCOUNT,
  UPDATE_STATE_INSTALL_WALLET,
  READY_MINT,
  UPDATE_USER_PUBLIC_KEY,
  BODY,
  CLEAR_DATA_NFT_PAGE,
  GADGET,
  LOADING,
  UPDATE_ATA_ADDRESS_NFT_ROBOT,
  UPDATE_INVALID_MASTER_EDITION_DIALOG,
  UPDATE_INVALID_NFT_ADDRESS_DIALOG,
  UPDATE_NFT_PAGE_LOADING_STATE,
  UPDATE_NFT_PAGE_READY_STATE,
  UPDATE_NFT_PARTS,
  UPDATE_NFT_PART_STATE,
  UPDATE_NFT_ROBOT_METADATA,
  UPDATE_NOT_ENOUGH_BALANCE_DIALOG,
  UPDATE_SUCCESS_SWAP_DIALOG,
  UPDATE_SWAP_ACTION_STATE,
  UPDATE_TRANSFER_STATE_NFT,
  UPDATE_UNSUCCESS_DIALOG,
  UPDATE_WRONG_WALLET_DIALOG,
  WEAPON,
  WHEEL1,
  WHEEL2,
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

export type Login = {
  isConnected: boolean;
  userName: string;
  dialogInstallWallet: boolean;
};

export type NFTPartState = {
  partState: string;
  category: null | string;
  imgUrl: null | string;
  name: null | string;
  type: null | string;
};

export type NFTRobotState = {
  name: null | string;
  url: null | string;
  nftAddress: null | string;
  ataAddress: null | string;
  isTransfer: boolean;
};

export type SwapNftPage = {
  pageState: string; // INIT, LOADING, ERROR, READY
  swapping: boolean;
  robot: NFTRobotState;
  body: NFTPartState;
  wheel1: NFTPartState;
  wheel2: NFTPartState;
  gadget: NFTPartState;
  weapon: NFTPartState;
  isOpenInvalidOwnerDialog: boolean;
  isOpenInvalidNFTAddressDialog: boolean;
  isOpenNotEnoughBalanceDialog: boolean;
  isOpenInvalidMasterEditionDialog: boolean;
  isOpenUnsuccessDialog: boolean;
  isOpenSuccessSwapDialog: boolean;
  isOpenWrongWalletDialog: boolean;
};

export type Inventory = {
  dialogSetupAccount: boolean;
  dialogVerifyAccount: boolean;
};

export type ClaimToken = {
  dialogClaimToken: boolean;
  dialogWithdrawalToken: boolean;
  dialogDepositToken: boolean;
};

export type Renting = {
  dialogListRentOut: boolean;
  dialogUpdateRentOut: boolean;
};

export type Profile = {
  dialogChangePassword: boolean;
  claimToken: ClaimToken;
};

export type InitialStateType = {
  // api: null | ApiPromise;
  isSyncing: boolean;
  apiError: null;
  apiState: null | string;
  endpoint: null | string;
  network: null | string;
  connection: null | Connection;
  loadingPage: boolean;
  login: Login;
  userPublicKey: null | string;
  swapNFTPage: SwapNftPage;
  inventory: Inventory;
  profile: Profile;
  renting: Renting;
};

// The initial state of the App
export const initialState: InitialStateType = {
  isSyncing: false,
  loadingPage: false,
  // api: null,
  apiError: null,
  apiState: null,
  endpoint: null,
  network: null,
  connection: null,
  userPublicKey: null,
  login: {
    isConnected: false,
    userName: '',
    dialogInstallWallet: false,
  },
  swapNFTPage: {
    pageState: INIT,
    swapping: false,
    robot: {
      name: null,
      url: null,
      nftAddress: null,
      ataAddress: null,
      isTransfer: false,
    },
    body: {
      partState: READY_MINT,
      category: null,
      imgUrl: null,
      name: null,
      type: null,
    },
    wheel1: {
      partState: READY_MINT,
      category: null,
      imgUrl: null,
      name: null,
      type: null,
    },
    wheel2: {
      partState: READY_MINT,
      category: null,
      imgUrl: null,
      name: null,
      type: null,
    },
    gadget: {
      partState: READY_MINT,
      category: null,
      imgUrl: null,
      name: null,
      type: null,
    },
    weapon: {
      partState: READY_MINT,
      category: null,
      imgUrl: null,
      name: null,
      type: null,
    },
    isOpenInvalidOwnerDialog: false,
    isOpenInvalidNFTAddressDialog: false,
    isOpenNotEnoughBalanceDialog: false,
    isOpenInvalidMasterEditionDialog: false,
    isOpenUnsuccessDialog: false,
    isOpenSuccessSwapDialog: false,
    isOpenWrongWalletDialog: false,
  },
  inventory: {
    dialogSetupAccount: false,
    dialogVerifyAccount: false,
  },
  profile: {
    dialogChangePassword: false,
    claimToken: {
      dialogClaimToken: false,
      dialogWithdrawalToken: false,
      dialogDepositToken: false,
    },
  },
  renting: {
    dialogListRentOut: false,
    dialogUpdateRentOut: false
  }
};

const initialStatePrimarily = cloneDeep(initialState);

export default handleActions(
  {
    /** connect to network */
    [SWITCH_ENDPOINT]: (state: InitialStateType, {payload}: any) => {
      const {input} = payload;

      return Object.assign({}, state, {
        apiState: INIT,
        endpoint: clusterApiUrl(input),
        network: input,
      });
    },

    [UPDATE_WALLET_CONNECTION]: (state: InitialStateType, {payload}: any) => {
      const {status} = payload;

      return Object.assign({}, state, {
        isConnectedWallet: status,
      });
    },

    [CONNECT_SUCCESS]: (state: InitialStateType, {payload}: any) => {
      const {connection, wallets} = payload;

      return Object.assign({}, state, {
        apiState: READY,
        connection,
        wallets,
      });
    },

    [UPDATE_USER_PUBLIC_KEY]: (state: InitialStateType, {payload}: any) => {
      return Object.assign({}, state, {
        userPublicKey: payload.userPublicKey,
      });
    },

    [UPDATE_STATE_LOADING_PAGE]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        loadingPage: payload.loadingPage,
      });
    },

    [UPDATE_STATE_IS_CONNECT_ACCOUNT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        login: {
          ...state.login,
          isConnected: payload.isConnected,
        },
      });
    },

    [UPDATE_STATE_USER_NAME]: (state: InitialStateType, {payload}: any) => {
      return Object.assign({}, state, {
        login: {
          ...state.login,
          userName: payload.userName,
        },
      });
    },

    [UPDATE_STATE_INSTALL_WALLET]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        login: {
          ...state.login,
          dialogInstallWallet: payload.dialogInstallWallet,
        },
      });
    },

    /**
     * Syncing state
     */
    [UPDATE_IS_SYNCING_STATE]: (state: InitialStateType, {payload}: any) => {
      const newState = set(state, 'isSyncing', payload.isSyncing);
      return Object.assign({}, newState);
    },

    /**
     * Swap page
     */
    [UPDATE_INVALID_NFT_ADDRESS_DIALOG]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.isOpenInvalidNFTAddressDialog',
        payload.open
      );
      return Object.assign({}, newState);
    },

    [UPDATE_INVALID_OWNER_DIALOG]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.isOpenInvalidOwnerDialog',
        payload.open
      );
      return Object.assign({}, newState);
    },

    [UPDATE_INVALID_MASTER_EDITION_DIALOG]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.isOpenInvalidMasterEditionDialog',
        payload.open
      );
      return Object.assign({}, newState);
    },

    [UPDATE_WRONG_WALLET_DIALOG]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.isOpenWrongWalletDialog',
        payload.open
      );
      return Object.assign({}, newState);
    },

    [UPDATE_UNSUCCESS_DIALOG]: (state: InitialStateType, {payload}: any) => {
      const newState = set(
        state,
        'swapNFTPage.isOpenUnsuccessDialog',
        payload.open
      );
      return Object.assign({}, newState);
    },

    [UPDATE_SUCCESS_SWAP_DIALOG]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.isOpenSuccessSwapDialog',
        payload.open
      );
      return Object.assign({}, newState);
    },

    [UPDATE_NOT_ENOUGH_BALANCE_DIALOG]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.isOpenNotEnoughBalanceDialog',
        payload.open
      );
      return Object.assign({}, newState);
    },

    [UPDATE_NFT_ADDRESS_NFT_ROBOT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.robot.nftAddress',
        payload.nftAddress
      );
      return Object.assign({}, newState);
    },

    [UPDATE_ATA_ADDRESS_NFT_ROBOT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.robot.ataAddress',
        payload.ataAddress
      );
      return Object.assign({}, newState);
    },

    [UPDATE_NFT_ROBOT_METADATA]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      let newState = set(state, 'swapNFTPage.robot.name', payload.name);
      newState = set(state, 'swapNFTPage.robot.url', payload.url);
      return Object.assign({}, newState);
    },

    [UPDATE_NFT_PARTS]: (state: InitialStateType, {payload}: any) => {
      let newState;
      newState = set(state, 'swapNFTPage.body', {
        ...get(state, 'swapNFTPage.body', {}),
        ...payload.parts[BODY],
      });
      newState = set(state, 'swapNFTPage.wheel1', {
        ...get(state, 'swapNFTPage.wheel1', {}),
        ...payload.parts[WHEEL1],
      });
      newState = set(state, 'swapNFTPage.wheel2', {
        ...get(state, 'swapNFTPage.wheel2', {}),
        ...payload.parts[WHEEL2],
      });
      newState = set(state, 'swapNFTPage.weapon', {
        ...get(state, 'swapNFTPage.weapon', {}),
        ...payload.parts[WEAPON],
      });
      newState = set(state, 'swapNFTPage.gadget', {
        ...get(state, 'swapNFTPage.gadget', {}),
        ...payload.parts[GADGET],
      });
      return Object.assign({}, newState);
    },

    [UPDATE_NFT_PART_STATE]: (state: InitialStateType, {payload}: any) => {
      let newState;
      switch (payload.idx) {
      case BODY:
        newState = set(
          state,
          'swapNFTPage.body.partState',
          payload.partState
        );
        break;
      case WHEEL1:
        newState = set(
          state,
          'swapNFTPage.wheel1.partState',
          payload.partState
        );
        break;
      case WHEEL2:
        newState = set(
          state,
          'swapNFTPage.wheel2.partState',
          payload.partState
        );
        break;
      case WEAPON:
        newState = set(
          state,
          'swapNFTPage.weapon.partState',
          payload.partState
        );
        break;
      case GADGET:
        newState = set(
          state,
          'swapNFTPage.gadget.partState',
          payload.partState
        );
        break;
      }
      return Object.assign({}, newState);
    },

    [UPDATE_NFT_PAGE_LOADING_STATE]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      let newState = set(state, 'swapNFTPage.pageState', LOADING);
      newState = set(
        newState,
        'swapNFTPage.robot.nftAddress',
        payload.nftAddress
      );
      return Object.assign({}, newState);
    },

    [UPDATE_NFT_PAGE_READY_STATE]: (state: InitialStateType) => {
      const newState = set(state, 'swapNFTPage.pageState', READY);
      return Object.assign({}, newState);
    },

    [CLEAR_DATA_NFT_PAGE]: (state: InitialStateType) => {
      const newState = set(
        state,
        'swapNFTPage',
        get(cloneDeep(initialStatePrimarily), 'swapNFTPage')
      );
      return Object.assign({}, newState);
    },

    [UPDATE_SWAP_ACTION_STATE]: (state: InitialStateType, {payload}: any) => {
      const newState = set(state, 'swapNFTPage.swapping', payload.swapping);
      return Object.assign({}, newState);
    },

    [UPDATE_TRANSFER_STATE_NFT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      const newState = set(
        state,
        'swapNFTPage.robot.isTransfer',
        payload.isTransfer
      );
      return Object.assign({}, newState);
    },

    [UPDATE_STATE_POPUP_SETUP_ACCOUNT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        inventory: {
          ...state.inventory,
          dialogSetupAccount: payload.dialogSetupAccount,
        },
      });
    },

    [UPDATE_STATE_POPUP_VERIFY_ACCOUNT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        inventory: {
          ...state.inventory,
          dialogVerifyAccount: payload.dialogVerifyAccount,
        },
      });
    },

    [UPDATE_STATE_POPUP_CHANGE_PASSWORD]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        profile: {
          ...state.profile,
          dialogChangePassword: payload.dialogChangePassword,
        },
      });
    },

    [UPDATE_STATE_POPUP_CLAIM_TOKEN]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        profile: {
          ...state.profile,
          claimToken: {
            ...state.profile.claimToken,
            dialogClaimToken: payload.dialogClaimToken,
          },
        },
      });
    },

    [UPDATE_STATE_POPUP_WITHDRAWAL_TOKEN]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        profile: {
          ...state.profile,
          claimToken: {
            ...state.profile.claimToken,
            dialogWithdrawalToken: payload.dialogWithdrawalToken,
          },
        },
      });
    },

    [UPDATE_STATE_POPUP_DEPOSIT_TOKEN]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        profile: {
          ...state.profile,
          claimToken: {
            ...state.profile.claimToken,
            dialogDepositToken: payload.dialogDepositToken,
          },
        },
      });
    },

    [UPDATE_STATE_POPUP_LIST_RENT_OUT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        renting: {
          ...state.renting,
          dialogListRentOut: payload.dialogListRentOut,
        },
      });
    },

    [UPDATE_STATE_POPUP_UPDATE_RENT_OUT]: (
      state: InitialStateType,
      {payload}: any
    ) => {
      return Object.assign({}, state, {
        renting: {
          ...state.renting,
          dialogUpdateRentOut: payload.dialogUpdateRentOut,
        },
      });
    },
  },

  initialState
);
