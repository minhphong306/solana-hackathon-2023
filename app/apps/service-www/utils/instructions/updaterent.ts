import * as anchor from '@project-serum/anchor';
import {BN, utils, web3} from '@project-serum/anchor';
import {Transaction} from "@solana/web3.js";
import {SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, TOKEN_PROGRAM_ID} from "../helpers/constants";
import {getATATokenWallet} from "../../containers/ClaimToken/constants";

export default async function getUpdateTransaction(
  nft: string,
  price: number,
  numberOfDay: number,
  continueListing: number,
  rentProgram: anchor.Program,
) {
  const walletPublicKey = rentProgram.provider.wallet.publicKey;
  const connection = rentProgram.provider.connection;
  console.log(rentProgram, 'rentProgram');
  console.log('walletPublicKey: ', walletPublicKey);

  const nftPK = new anchor.web3.PublicKey(nft); // public key nft
  const item = await web3.PublicKey.findProgramAddress( // find PDA con trong de thue
    [Buffer.from('ballot'),
      nftPK.toBuffer(),
      walletPublicKey.toBuffer()
    ],
    rentProgram.programId,
  );

  const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress( // authority cua ATA
    [Buffer.from('treasurer'), item[0].toBuffer()],
    rentProgram.programId,
  );
  const treasurer = treasurerPublicKey;

  const nftAtaPK = await getATATokenWallet(walletPublicKey.toString(), nft);
  console.log('Got NFT ata PK: ', nftAtaPK);

  const nftHolder = await utils.token.associatedAddress({
    mint: nftPK,
    owner: treasurerPublicKey,
  });

  const bnPrice = new BN(price);
  const bnNumOfDay = new BN(numberOfDay * 86400);
  const bnIsListing = new BN(continueListing);

  const instruction = rentProgram.instruction.updateItem(bnPrice, bnNumOfDay, bnIsListing,{
    accounts: {
      authority: walletPublicKey,
      item: item[0],
      mint: nftPK,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
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