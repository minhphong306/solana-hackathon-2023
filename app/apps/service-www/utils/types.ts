import * as solanaWeb3 from '@solana/web3.js';

export interface Part {
  trait_type: string,
  value: string
}
export interface MetadataRobot {
  attributes : Part[],
  collection : any,
  description: string,
  external_url: string,
  image: string,
  name: string,
  properties: any,
  seller_fee_basis_points: number,
  symbol: string
}
export interface NftRobot {
  ataAddress: solanaWeb3.PublicKey,
  metadata: MetadataRobot,
  publicKey: solanaWeb3.PublicKey
}

export interface NftPart {
  name: string,
  type: string,
  category: string,
  imgUrl: string,
}
