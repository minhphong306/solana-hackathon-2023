const createSymbol = (name: string) => `app-context/${name}`;

const createSymbolNFTPage = (name: string) => `nft-page/${name}`;

/**
 * STATUS
 */
export const INIT = createSymbol('INIT');

export const LOADING = createSymbol('LOADING');

export const ERROR = createSymbol('ERROR');

export const READY = createSymbol('READY');

/**
 * STATUS PART
 */
export const READY_MINT = createSymbolNFTPage('READY_MINT');
export const MINTING = createSymbolNFTPage('MINTING');
export const MINTED = createSymbolNFTPage('MINTED');
export const FAILED_MINT = createSymbolNFTPage('FAILED_MINT');

/**
 * PART INDEX
 */
export const BODY = 0;
export const WHEEL1 = 1;
export const WHEEL2 = 2;
export const WEAPON = 3;
export const GADGET = 4;

/**
 * ACTIONS CONECTION API
 */
export const SWITCH_ENDPOINT = createSymbol('SWITCH_ENDPOINT');

export const CONNECT = createSymbol('CONNECT');

export const CONNECT_SUCCESS = createSymbol('CONNECT_SUCCESS');

export const CONNECT_ERROR = createSymbol('CONNECT_ERROR');

/**
 * ADDRESSES
 */
export const LOAD_ADDRESSES = createSymbol('LOAD_ADDRESSES');

export const SWITCH_ADDRESS = createSymbol('SWITCH_ADDRESS');

export const UPDATE_WALLET_CONNECTION = createSymbol(
  'UPDATE_WALLET_CONNECTION'
);

export const UPDATE_STATE_LOADING_PAGE = createSymbol(
  'UPDATE_STATE_LOADING_PAGE'
);

export const UPDATE_STATE_USER_NAME = createSymbol('UPDATE_STATE_USER_NAME');
export const UPDATE_STATE_IS_CONNECT_ACCOUNT = createSymbol(
  'UPDATE_STATE_IS_CONNECT_ACCOUNT'
);
export const UPDATE_STATE_INSTALL_WALLET = createSymbol(
  'UPDATE_STATE_INSTALL_WALLET'
);

/**
 * SYNCING STATE
 */
export const UPDATE_IS_SYNCING_STATE = createSymbol('UPDATE_IS_SYNCING_STATE');

/**
 * PUBLIC KEY
 */
export const UPDATE_USER_PUBLIC_KEY = createSymbol('UPDATE_USER_PUBLIC_KEY');

/**
 * NFT PAGE STATE
 */
export const UPDATE_NFT_PAGE_LOADING_STATE = createSymbolNFTPage(
  'UPDATE_NFT_PAGE_LOADING_STATE'
);

export const UPDATE_NFT_PAGE_READY_STATE = createSymbolNFTPage(
  'UPDATE_NFT_PAGE_READY_STATE'
);

export const UPDATE_SWAP_ACTION_STATE = createSymbolNFTPage(
  'UPDATE_SWAP_ACTION_STATE'
);

export const CLEAR_DATA_NFT_PAGE = createSymbolNFTPage('CLEAR_DATA_NFT_PAGE');
/**
 * INVALID NFT ADDRESS DIALOG
 */
export const UPDATE_INVALID_NFT_ADDRESS_DIALOG = createSymbolNFTPage(
  'UPDATE_INVALID_NFT_ADDRESS_DIALOG'
);
/**
 * INVALID OWNER DIALOG
 */
export const UPDATE_INVALID_OWNER_DIALOG = createSymbolNFTPage(
  'UPDATE_INVALID_OWNER_DIALOG'
);
/**
 * NOT ENOUGH BALANCE DIALOG
 */
export const UPDATE_NOT_ENOUGH_BALANCE_DIALOG = createSymbolNFTPage(
  'UPDATE_NOT_ENOUGH_BALANCE_DIALOG'
);
/**
 * INVALID MASTER EDITION DIALOG
 */
export const UPDATE_INVALID_MASTER_EDITION_DIALOG = createSymbolNFTPage(
  'UPDATE_INVALID_MASTER_EDITION_DIALOG'
);
/**
 * WRONG WALLET DIALOG
 */
export const UPDATE_WRONG_WALLET_DIALOG = createSymbolNFTPage(
  'UPDATE_WRONG_WALLET_DIALOG'
);
/**
 * UNSUCCESS DIALOG
 */
export const UPDATE_UNSUCCESS_DIALOG = createSymbolNFTPage(
  'UPDATE_UNSUCCESS_DIALOG'
);
/**
 * SUCCESS SWAP DIALOG
 */
export const UPDATE_SUCCESS_SWAP_DIALOG = createSymbolNFTPage(
  'UPDATE_SUCCESS_SWAP_DIALOG'
);

export const UPDATE_NFT_ADDRESS_NFT_ROBOT = createSymbolNFTPage(
  'UPDATE_NFT_ADDRESS_NFT_ROBOT'
);

export const UPDATE_ATA_ADDRESS_NFT_ROBOT = createSymbolNFTPage(
  'UPDATE_ATA_ADDRESS_NFT_ROBOT'
);

export const UPDATE_NFT_ROBOT_METADATA = createSymbolNFTPage(
  'UPDATE_NFT_ROBOT_METADATA'
);

export const UPDATE_NFT_PARTS = createSymbolNFTPage('UPDATE_NFT_PARTS');

export const UPDATE_NFT_PART_STATE = createSymbolNFTPage(
  'UPDATE_NFT_PART_STATE'
);

export const UPDATE_TRANSFER_STATE_NFT = createSymbolNFTPage(
  'UPDATE_TRANSFER_STATE_NFT'
);

// INVENTORY
export const UPDATE_STATE_POPUP_SETUP_ACCOUNT = createSymbol(
  'UPDATE_STATE_POPUP_SETUP_ACCOUNT'
);

export const UPDATE_STATE_POPUP_CHANGE_PASSWORD = createSymbol(
  'UPDATE_STATE_POPUP_CHANGE_PASSWORD'
);

export const UPDATE_STATE_POPUP_VERIFY_ACCOUNT = createSymbol(
  'UPDATE_STATE_POPUP_VERIFY_ACCOUNT'
);

export const UPDATE_STATE_POPUP_CLAIM_TOKEN = createSymbol(
  'UPDATE_STATE_POPUP_CLAIM_TOKEN'
);

export const UPDATE_STATE_POPUP_WITHDRAWAL_TOKEN = createSymbol(
  'UPDATE_STATE_POPUP_WITHDRAWAL_TOKEN'
);

export const UPDATE_STATE_POPUP_DEPOSIT_TOKEN = createSymbol(
  'UPDATE_STATE_POPUP_DEPOSIT_TOKEN'
);

export const UPDATE_STATE_POPUP_LIST_RENT_OUT = createSymbol(
  'UPDATE_STATE_POPUP_LIST_RENT_OUT'
);

export const UPDATE_STATE_POPUP_UPDATE_RENT_OUT = createSymbol(
  'UPDATE_STATE_POPUP_UPDATE_RENT_OUT'
);
