export interface IGetUsersByWalletsRequest {
  wallets: string[]
  secretKey: string
}

export interface IGetUsersByWalletsResponse {
  id: string,
  wallet: string
}
