import * as spl from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';

export const getATATokenWallet = async (userPublicKey: string, tokenPublicKey: string) => {
  try {
    return await spl.Token.getAssociatedTokenAddress(
      spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      spl.TOKEN_PROGRAM_ID,
      new anchor.web3.PublicKey(tokenPublicKey),
      new anchor.web3.PublicKey(userPublicKey)
    );
  } catch (e) {
    throw new Error(e.message);
  }
};
