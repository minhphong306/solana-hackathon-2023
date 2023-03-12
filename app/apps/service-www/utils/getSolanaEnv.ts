import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export default function getSolanaEnv() {
  return process.env.SOLANA_ENV === 'mainnet-beta' ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet;
}