import { Connection } from "@solana/web3.js";
import { SWAP_ROBOT_PROGRAM_STATE_PDA } from "./helpers/constants";
import { decodeItem } from "./logAllItemsSchema";

export async function logAllItemsInPage(connection: Connection) {
  let isStop = false;
  // Check if the greeting account has already been created
  const pageIndexerAccount = await connection.getAccountInfo(SWAP_ROBOT_PROGRAM_STATE_PDA);
  if (pageIndexerAccount === null) {
    isStop = true;
  }
  const items = [];
  while (!isStop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataPage: any = await connection.getAccountInfo(SWAP_ROBOT_PROGRAM_STATE_PDA);
    dataPage = [...dataPage.data];
    for (let i = 0; i < 10000; i++) {
      const decodeindex = decodeItem(dataPage, i);
      items.push(decodeindex.toObject(i));
    }
    isStop = true;
  }
  return items;
}
