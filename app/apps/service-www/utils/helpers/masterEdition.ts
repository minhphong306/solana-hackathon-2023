import * as anchor from '@project-serum/anchor';
import { TOKEN_METADATA_PROGRAM_ID } from './constants';
import { deserializeUnchecked } from 'borsh';
import BN from 'bn.js';

type StringPublicKey = string;

export const METADATA_PREFIX = 'metadata';
export const EDITION = 'edition';
export const RESERVATION = 'reservation';

export const MAX_NAME_LENGTH = 32;

export const MAX_SYMBOL_LENGTH = 10;

export const MAX_URI_LENGTH = 200;

export const MAX_CREATOR_LIMIT = 5;

export const MAX_CREATOR_LEN = 32 + 1 + 1;
export const MAX_METADATA_LEN =
    1 +
    32 +
    32 +
    MAX_NAME_LENGTH +
    MAX_SYMBOL_LENGTH +
    MAX_URI_LENGTH +
    MAX_CREATOR_LIMIT * MAX_CREATOR_LEN +
    2 +
    1 +
    1 +
    198;

export const MAX_EDITION_LEN = 1 + 32 + 8 + 200;

export const EDITION_MARKER_BIT_SIZE = 248;

export enum MetadataKey {
    Uninitialized = 0,
    MetadataV1 = 4,
    EditionV1 = 1,
    MasterEditionV1 = 2,
    MasterEditionV2 = 6,
    EditionMarker = 7,
}

export enum MetadataCategory {
    Audio = 'audio',
    Video = 'video',
    Image = 'image',
    VR = 'vr',
    HTML = 'html',
}

export type MetadataFile = {
    uri: string;
    type: string;
};

export type FileOrString = MetadataFile | string;

export type Attribute = {
    trait_type?: string;
    display_type?: string;
    value: string | number;
};

export interface IMetadataExtension {
    name: string;
    symbol: string;

    creators: Creator[] | null;
    description: string;
    // preview image absolute URI
    image: string;
    animation_url?: string;

    attributes?: Attribute[];

    // stores link to item on meta
    external_url: string;

    seller_fee_basis_points: number;

    properties: {
        files?: FileOrString[];
        category: MetadataCategory;
        maxSupply?: number;
        creators?: {
            address: string;
            shares: number;
        }[];
    };
}

export class MasterEditionV1 {
  key: MetadataKey;
  supply: BN;
  maxSupply?: BN;
  /// Can be used to mint tokens that give one-time permission to mint a single limited edition.
  printingMint: StringPublicKey;
  /// If you don't know how many printing tokens you are going to need, but you do know
  /// you are going to need some amount in the future, you can use a token from this mint.
  /// Coming back to token metadata with one of these tokens allows you to mint (one time)
  /// any number of printing tokens you want. This is used for instance by Auction Manager
  /// with participation NFTs, where we dont know how many people will bid and need participation
  /// printing tokens to redeem, so we give it ONE of these tokens to use after the auction is over,
  /// because when the auction begins we just dont know how many printing tokens we will need,
  /// but at the end we will. At the end it then burns this token with token-metadata to
  /// get the printing tokens it needs to give to bidders. Each bidder then redeems a printing token
  /// to get their limited editions.
  oneTimePrintingAuthorizationMint: StringPublicKey;

  constructor(args: {
        key: MetadataKey;
        supply: BN;
        maxSupply?: BN;
        printingMint: StringPublicKey;
        oneTimePrintingAuthorizationMint: StringPublicKey;
    }) {
    this.key = MetadataKey.MasterEditionV1;
    this.supply = args.supply;
    this.maxSupply = args.maxSupply;
    this.printingMint = args.printingMint;
    this.oneTimePrintingAuthorizationMint = args.oneTimePrintingAuthorizationMint;
  }
}

export class MasterEditionV2 {
  key: MetadataKey;
  supply: BN;
  maxSupply?: BN;

  constructor(args: { key: MetadataKey; supply: BN; maxSupply?: BN }) {
    this.key = MetadataKey.MasterEditionV2;
    this.supply = args.supply;
    this.maxSupply = args.maxSupply;
  }
}

export class EditionMarker {
  key: MetadataKey;
  ledger: number[];

  constructor(args: { key: MetadataKey; ledger: number[] }) {
    this.key = MetadataKey.EditionMarker;
    this.ledger = args.ledger;
  }

  editionTaken(edition: number) {
    const editionOffset = edition % EDITION_MARKER_BIT_SIZE;
    const indexOffset = Math.floor(editionOffset / 8);

    if (indexOffset > 30) {
      throw Error('bad index for edition');
    }

    const positionInBitsetFromRight = 7 - (editionOffset % 8);

    const mask = Math.pow(2, positionInBitsetFromRight);

    const appliedMask = this.ledger[indexOffset] & mask;

    return appliedMask != 0;
  }
}

export class Edition {
  key: MetadataKey;
  /// Points at MasterEdition struct
  parent: StringPublicKey;
  /// Starting at 0 for master record, this is incremented for each edition minted.
  edition: BN;

  constructor(args: { key: MetadataKey; parent: StringPublicKey; edition: BN }) {
    this.key = MetadataKey.EditionV1;
    this.parent = args.parent;
    this.edition = args.edition;
  }
}
export class Creator {
  address: StringPublicKey;
  verified: boolean;
  share: number;

  constructor(args: { address: StringPublicKey; verified: boolean; share: number }) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

export class Data {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Creator[] | null;
  constructor(args: {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators: Creator[] | null;
    }) {
    this.name = args.name;
    this.symbol = args.symbol;
    this.uri = args.uri;
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
    this.creators = args.creators;
  }
}

export class Metadata {
  key: MetadataKey;
  updateAuthority: StringPublicKey;
  mint: StringPublicKey;
  data: Data;
  primarySaleHappened: boolean;
  isMutable: boolean;
  editionNonce: number | null;

  // set lazy
  masterEdition?: StringPublicKey;
  edition?: StringPublicKey;

  constructor(args: {
        updateAuthority: StringPublicKey;
        mint: StringPublicKey;
        data: Data;
        primarySaleHappened: boolean;
        isMutable: boolean;
        editionNonce: number | null;
    }) {
    this.key = MetadataKey.MetadataV1;
    this.updateAuthority = args.updateAuthority;
    this.mint = args.mint;
    this.data = args.data;
    this.primarySaleHappened = args.primarySaleHappened;
    this.isMutable = args.isMutable;
    this.editionNonce = args.editionNonce ?? null;
  }

  public async init() {
    //const metadata = toPublicKey(programIds().metadata);
    /*
    This nonce stuff doesnt work - we are doing something wrong here. TODO fix.
    if (this.editionNonce !== null) {
      this.edition = (
        await PublicKey.createProgramAddress(
          [
            Buffer.from(METADATA_PREFIX),
            metadata.toBuffer(),
            toPublicKey(this.mint).toBuffer(),
            new Uint8Array([this.editionNonce || 0]),
          ],
          metadata,
        )
      ).toBase58();
    } else {*/
    this.edition = (await getEdition(this.mint)).toBase58();
    //}
    this.masterEdition = this.edition;
  }
}

export const getMasterEdition = async (mint: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

export const getEditionMarkPda = async (
  mint: anchor.web3.PublicKey,
  edition: number,
): Promise<anchor.web3.PublicKey> => {
  const editionNumber = Math.floor(edition / 248);
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
        Buffer.from(editionNumber.toString()),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

export const decodeEdition = (buffer: Buffer) => {
  return deserializeUnchecked(METADATA_SCHEMA, Edition, buffer) as Edition;
};

export const decodeMasterEdition = (buffer: Buffer): MasterEditionV1 | MasterEditionV2 => {
  if (buffer[0] == MetadataKey.MasterEditionV1) {
    return deserializeUnchecked(METADATA_SCHEMA, MasterEditionV1, buffer) as MasterEditionV1;
  } else {
    return deserializeUnchecked(METADATA_SCHEMA, MasterEditionV2, buffer) as MasterEditionV2;
  }
};

export const WRAPPED_SOL_MINT = new anchor.web3.PublicKey('So11111111111111111111111111111111111111112');

export const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new anchor.web3.PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

export const BPF_UPGRADE_LOADER_ID = new anchor.web3.PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');

export const MEMO_ID = new anchor.web3.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export const METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' as StringPublicKey;

export const VAULT_ID = 'vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn' as StringPublicKey;

export const AUCTION_ID = 'auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8' as StringPublicKey;

export const METAPLEX_ID = 'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98' as StringPublicKey;

export const PACK_CREATE_ID = new anchor.web3.PublicKey('packFeFNZzMfD9aVWL7QbGz1WcU7R9zpf6pvNsw2BLu');

export const SYSTEM = new anchor.web3.PublicKey('11111111111111111111111111111111');

export const programIds = () => {
  return {
    token: TOKEN_PROGRAM_ID,
    associatedToken: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    bpf_upgrade_loader: BPF_UPGRADE_LOADER_ID,
    system: SYSTEM,
    metadata: METADATA_PROGRAM_ID,
    memo: MEMO_ID,
    vault: VAULT_ID,
    auction: AUCTION_ID,
    metaplex: METAPLEX_ID,
    pack_create: PACK_CREATE_ID,
  };
};

export async function getEdition(tokenMint: StringPublicKey): Promise<anchor.web3.PublicKey> {
  const PROGRAM_IDS = programIds();

  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        new anchor.web3.PublicKey(PROGRAM_IDS.metadata).toBuffer(),
        new anchor.web3.PublicKey(tokenMint).toBuffer(),
        Buffer.from(EDITION),
      ],
      new anchor.web3.PublicKey(PROGRAM_IDS.metadata),
    )
  )[0];
}

export const METADATA_SCHEMA = new Map<any, any>([
  [
    MasterEditionV1,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['supply', 'u64'],
        ['maxSupply', { kind: 'option', type: 'u64' }],
        ['printingMint', 'pubkeyAsString'],
        ['oneTimePrintingAuthorizationMint', 'pubkeyAsString'],
      ],
    },
  ],
  [
    MasterEditionV2,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['supply', 'u64'],
        ['maxSupply', { kind: 'option', type: 'u64' }],
      ],
    },
  ],
  [
    Edition,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['parent', 'pubkeyAsString'],
        ['edition', 'u64'],
      ],
    },
  ],
  [
    Data,
    {
      kind: 'struct',
      fields: [
        ['name', 'string'],
        ['symbol', 'string'],
        ['uri', 'string'],
        ['sellerFeeBasisPoints', 'u16'],
        ['creators', { kind: 'option', type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: 'struct',
      fields: [
        ['address', 'pubkeyAsString'],
        ['verified', 'u8'],
        ['share', 'u8'],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['updateAuthority', 'pubkeyAsString'],
        ['mint', 'pubkeyAsString'],
        ['data', Data],
        ['primarySaleHappened', 'u8'], // bool
        ['isMutable', 'u8'], // bool
        ['editionNonce', { kind: 'option', type: 'u8' }],
      ],
    },
  ],
  [
    EditionMarker,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['ledger', [31]],
      ],
    },
  ],
]);

export const checkValidMasterEdition = async (connection: anchor.web3.Connection, publicKey: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
  try {
    const masterEditionAddress = await getMasterEdition(publicKey);
    const account = await connection.getAccountInfo(masterEditionAddress, 'confirmed');
    const metadataMasterEdition = decodeMasterEdition(account.data);
    if (metadataMasterEdition.key && metadataMasterEdition.supply && metadataMasterEdition.maxSupply) {
      return masterEditionAddress;
    }
    throw new Error('Invalid Master Edition');
  } catch (error) {
    throw new Error('Invalid Master Edition');
  }
};