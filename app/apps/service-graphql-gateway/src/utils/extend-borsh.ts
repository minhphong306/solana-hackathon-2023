import {PublicKey} from "@solana/web3.js";
import {BinaryReader, BinaryWriter, deserializeUnchecked} from "borsh";
import basex from 'base-x';
import * as anchor from "@project-serum/anchor";

export type StringPublicKey = string;
export const extendBorsh = () => {
  (BinaryReader.prototype as any).readPubkey = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  (BinaryWriter.prototype as any).writePubkey = function (value: PublicKey) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(value.toBuffer());
  };

  (BinaryReader.prototype as any).readPubkeyAsString = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').encode(array) as StringPublicKey;
  };

  (BinaryWriter.prototype as any).writePubkeyAsString = function (
    value: StringPublicKey,
  ) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(value));
  };
};

export class Item {
  price: number;
  start_date: anchor.BN;
  num_of_day: anchor.BN;
  is_continue_listing: anchor.BN;
  nft_address: string;
  owner_address: string;
  rent_address: string;

  constructor(args: {
    price: number;
    start_date: anchor.BN;
    num_of_day: anchor.BN;
    is_continue_listing: anchor.BN;
    nft_address: string;
    owner_address: string;
    rent_address: string;
  }) {
    this.price = args.price;
    this.start_date = args.start_date;
    this.num_of_day = args.num_of_day;
    this.is_continue_listing = args.is_continue_listing;
    this.nft_address = args.nft_address;
    this.owner_address = args.owner_address;
    this.rent_address = args.rent_address;
  }

  toObject() {
    return {
      price: this.price,
      start_date: this.start_date,
      num_of_day: this.num_of_day,
      is_continue_listing: this.is_continue_listing,
      nft_address: this.nft_address,
      owner_address: this.owner_address,
      rent_address: this.rent_address,
    };

  }
}

export const SCHEMA = new Map<any, any>([
  [
    Item,
    {
      kind: 'struct',
      fields: [
        ['price', 'u64'],
        ['start_date', 'u64'],
        ['num_of_day', 'u64'],
        ['is_continue_listing', 'u8'],
        ['nft_address', { kind: 'option', type: 'pubkeyAsString' }],
        ['owner_address', { kind: 'option', type: 'pubkeyAsString' }],
        ['rent_address', { kind: 'option', type: 'pubkeyAsString' }],
      ],
    },
  ]
]);

export const decodeItem = (data: Buffer) => {
  const buffer = data.slice(8, data.length);
  return deserializeUnchecked(SCHEMA, Item, Buffer.from(buffer)) as Item;
};
