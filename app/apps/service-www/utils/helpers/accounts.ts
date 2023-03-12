import * as anchor from '@project-serum/anchor';
import {PublicKey} from '@solana/web3.js';
import {
  SWAP_ROBOT_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  LISTING_PROGRAM_ID
} from './constants';
import {getCluster} from './various';

export async function loadCandyProgramV2(
  wallet: anchor.Wallet,
  env: string,
  customRpcUrl?: string,
) {
  const solConnection = new anchor.web3.Connection(
    customRpcUrl || getCluster(env),
  );

  const provider = new anchor.Provider(solConnection, wallet, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(
    SWAP_ROBOT_PROGRAM_ID,
    provider,
  );
  const program = new anchor.Program(
    idl,
    SWAP_ROBOT_PROGRAM_ID,
    provider,
  );
  return program;
}

export const getMetadata = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

export const getTokenWallet = async function (
  wallet: PublicKey,
  mint: PublicKey,
) {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];
};

export const getMasterEdition = async (
  mint: anchor.web3.PublicKey,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

export const getCandyMachineCreator = async (
  candyMachine: anchor.web3.PublicKey,
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    SWAP_ROBOT_PROGRAM_ID,
  );
};

export async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (await PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  ))[0];
}

export async function loadListingProgram(
  wallet: anchor.Wallet,
  env: string,
  customRpcUrl?: string,
) {
  const solConnection = new anchor.web3.Connection(
    customRpcUrl || getCluster(env),
  );

  const provider = new anchor.Provider(solConnection, wallet, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(
    LISTING_PROGRAM_ID,
    provider,
  );
  const program = new anchor.Program(
    idl,
    LISTING_PROGRAM_ID,
    provider,
  );
  return program;
}
