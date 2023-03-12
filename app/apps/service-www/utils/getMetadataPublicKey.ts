import * as solanaWeb3 from '@solana/web3.js';
import { TOKEN_METADATA_PROGRAM_ID } from './helpers/constants';

export default async function getMetadataPublicKey(mint: solanaWeb3.PublicKey): Promise<solanaWeb3.PublicKey> {
  return (
    await solanaWeb3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};
