import { clusterApiUrl, PublicKey } from '@solana/web3.js';

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

export const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

export const LISTING_PROGRAM_ID = new PublicKey('2QofFxHF1vPYKp6hUhi83iZpwLfXSKZsb1QKZwZoDSR8');

export const CREATOR_ROBOT_ADDRESS = [
  process.env.MAGIC_EDEN_SOL_ROBOTS_CREATOR,
  process.env.MAGIC_EDEN_BOT_ROBOTS_CREATOR,
];

export const SWAP_ROBOT_PROGRAM_ID = new PublicKey(
  process.env.SWAP_ROBOT_PROGRAM_ID
);

export const SWAP_ROBOT_PROGRAM_STATE_PDA = new PublicKey(
  process.env.SWAP_ROBOT_PROGRAM_STATE_PDA
);

export const STORAGE_PART_TYPE_PDA = new PublicKey(
  process.env.STORAGE_PART_TYPE_PDA
);

export const CANDY_MACHINE_CONFIG_PDA = new PublicKey(
  process.env.CANDY_MACHINE_CONFIG_PDA
);

export const NAME_PREFIX = 'Starbots #';

export const DEFAULT_TIMEOUT = 15000;

type Cluster = {
  name: string;
  url: string;
};
export const CLUSTERS: Cluster[] = [
  {
    name: 'mainnet-beta',
    url: 'https://small-silent-moon.solana-mainnet.quiknode.pro/2769beb915e8fbb93b2b21b7f643d7f177d61beb/',
  },
  {
    name: 'testnet',
    url: clusterApiUrl('testnet'),
  },
  {
    name: 'devnet',
    url: clusterApiUrl('devnet'),
  },
];
export const DEFAULT_CLUSTER = CLUSTERS[2];

export const TIER_NAME = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Mythical',
  'Legendary',
];

export const TIER_COLOR = [
  '#606467',
  '#3CA503',
  '#016EE7',
  '#8A38C8',
  '#BD2A1A',
  '#f46d01',
];

export const TYPE_PART = {
  BODY: 1,
  WEAPON: 2,
  GADGET: 3,
  WHEEL: 4,
  STAR_DOG: 5,
  ROBOT: 6,
  1: 'body',
  2: 'weapon',
  3: 'gadget',
  4: 'wheel',
  5: 'star dog',
  6: 'robot'
};

export const TIER_ROBOT = 7;

// case swap 1 phan
export const DISCRIMINATOR_LENGTH = 8;
export const OWNER_ADDRESS_LENGTH = 32;
export const OPENED_LENGTH = 1;
export const ITEM_LENGTH = OWNER_ADDRESS_LENGTH + 5 * OPENED_LENGTH;
export const MAX_ITEM_LIMIT = 5;
export const OPTION_LENGTH = 1;
export const ENUM_LENGTH = 1;

export const SWAP_INCOMPLETE = 2;
export const SWAP_NOT_USED_YET = 1;

console.log(process.env.SWAP_ROBOT_PROGRAM_ID, 'SWAP_ROBOT_PROGRAM_ID');
console.log(process.env.CANDY_MACHINE_CONFIG_PDA, 'CANDY_MACHINE_CONFIG_PDA');
console.log(process.env.SWAP_ROBOT_PROGRAM_STATE_PDA, 'SWAP_ROBOT_PROGRAM_STATE_PDA');
console.log(process.env.STORAGE_PART_TYPE_PDA, 'STORAGE_PART_TYPE_PDA');
console.log(process.env.STARBOTS_PARTS_CREATOR, 'STARBOTS_PARTS_CREATOR');
console.log(process.env.BURN_WALLET, 'BURN_WALLET');

export const LIMIT_LENGTH_EMAIL = 128;
export const LIMIT_LENGTH_PASSWORD = 256;
