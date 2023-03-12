import * as anchor from '@project-serum/anchor';
import {utils, web3} from '@project-serum/anchor';
import {Transaction} from "@solana/web3.js";
import {SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, TOKEN_PROGRAM_ID} from "../helpers/constants";

export default async function getRentTransaction(
  nft: string,
  ownerPKStr: string,
  rentProgram: anchor.Program,
) {
  const walletPublicKey = rentProgram.provider.wallet.publicKey;
  const connection = rentProgram.provider.connection;
  const ownerPK = new anchor.web3.PublicKey(ownerPKStr);

  const nftPK = new anchor.web3.PublicKey(nft); // public key nft
  const item = await web3.PublicKey.findProgramAddress( // find PDA con trong de thue
    [Buffer.from('ballot'),
      nftPK.toBuffer(),
      ownerPK.toBuffer()
    ],
    rentProgram.programId,
  );

  const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress( // authority cua ATA
    [Buffer.from('treasurer'), item[0].toBuffer()],
    rentProgram.programId,
  );



  const nftHolder = await utils.token.associatedAddress({
    mint: nftPK,
    owner: treasurerPublicKey,
  });

  console.log('walletPublicKey', walletPublicKey.toString());
  console.log('item', item.toString());
  console.log('ownerPK', ownerPK.toString());
  console.log('holder', nftHolder.toString());

  const instruction = rentProgram.instruction.rent({
    accounts: {
      signer: walletPublicKey,
      item: item[0],
      ownerAddress: ownerPK,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
      holder: nftHolder,
    },
  });

  const transaction = new Transaction();
  transaction.instructions = [instruction];
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash('finalized')
  ).blockhash;
  transaction.setSigners(walletPublicKey);

  return transaction;
}