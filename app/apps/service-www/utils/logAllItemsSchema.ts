import { deserializeUnchecked } from 'borsh';
import * as anchor from '@project-serum/anchor';
import {
  DISCRIMINATOR_LENGTH,
  OWNER_ADDRESS_LENGTH,
  ITEM_LENGTH,
  OPTION_LENGTH,
  ENUM_LENGTH,
} from './helpers/constants';
import { Connection } from '@solana/web3.js';

export * from './borsh';
export class Total {
  total: number;

  constructor(args: { total: number }) {
    this.total = args.total;
  }

  toLog() {
    return {
      total: this.total,
    };
  }
}

export class Config {
  // index: ProgramState;
  index: number;

  constructor(args: { index: number }) {
    this.index = args.index;
  }

  toObject() {
    return {
      index: this.index,
    };
  }
}

export class Item {
  owner: string;
  opened_body: anchor.BN;
  opened_wheel1: anchor.BN;
  opened_wheel2: anchor.BN;
  opened_weapon: anchor.BN;
  opened_gadget: anchor.BN;

  constructor(args: {
    owner: string;
    opened_body: anchor.BN;
    opened_wheel1: anchor.BN;
    opened_wheel2: anchor.BN;
    opened_weapon: anchor.BN;
    opened_gadget: anchor.BN;
  }) {
    this.owner = args.owner;
    this.opened_body = args.opened_body;
    this.opened_wheel1 = args.opened_wheel1;
    this.opened_wheel2 = args.opened_wheel2;
    this.opened_weapon = args.opened_weapon;
    this.opened_gadget = args.opened_gadget;
  }

  toObject(i: number) {
    return {
      index: i,
      owner: this.owner,
      opened_body: this.opened_body,
      opened_wheel1: this.opened_wheel1,
      opened_wheel2: this.opened_wheel2,
      opened_weapon: this.opened_weapon,
      opened_gadget: this.opened_gadget,
    };
  }
}

export const SCHEMA = new Map<any, any>([
  [
    Item,
    {
      kind: 'struct',
      fields: [
        ['owner', 'pubkeyAsString'],
        ['opened_body', 'u8'],
        ['opened_wheel1', 'u8'],
        ['opened_wheel2', 'u8'],
        ['opened_weapon', 'u8'],
        ['opened_gadget', 'u8'],
      ],
    },
  ],
  [
    Total,
    {
      kind: 'struct',
      fields: [['total', 'u8']],
    },
  ],
  [
    Config,
    {
      kind: 'struct',
      fields: [['index', 'u8']],
    },
  ],
]);

export async function getTotal(
  connection: Connection,
  pageIndexer: anchor.web3.PublicKey,
) {
  let configStore: any = await connection.getAccountInfo(
    pageIndexer,
  );
  configStore = [...configStore.data];
  const { total } = decodeTotal(configStore);
  return total;
}

export const decodeItem = (data: Buffer, index: number) => {
  const pagestart =
    DISCRIMINATOR_LENGTH + OWNER_ADDRESS_LENGTH + OPTION_LENGTH + ENUM_LENGTH;
  const buffer = data.slice(
    pagestart + 4 + ITEM_LENGTH * index,
    pagestart + 4 + ITEM_LENGTH * (index + 1),
  );

  return deserializeUnchecked(SCHEMA, Item, Buffer.from(buffer)) as Item;
};

export const decodeTotal = (data: Buffer) => {
  const pagestart =
    DISCRIMINATOR_LENGTH + OWNER_ADDRESS_LENGTH + OPTION_LENGTH + ENUM_LENGTH;
  const buffer = data.slice(pagestart, pagestart + 4);

  return deserializeUnchecked(SCHEMA, Total, Buffer.from(buffer)) as Total;
};

export const decodeIndex = (data: Buffer) => {
  const pagestart = DISCRIMINATOR_LENGTH + OWNER_ADDRESS_LENGTH;
  const buffer = data.slice(
    pagestart + OPTION_LENGTH,
    pagestart + OPTION_LENGTH + ENUM_LENGTH,
  );

  return deserializeUnchecked(SCHEMA, Config, Buffer.from(buffer)) as Config;
};

