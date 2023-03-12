import {
  Commitment,
  Connection,
  RpcResponseAndContext,
  SimulatedTransactionResponse,
  Transaction,
} from '@solana/web3.js';

export default async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment,
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection._disableBlockhashCaching,
  );

  const signData = transaction.serializeMessage();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString('base64');
  const config: any = {encoding: 'base64', commitment};
  const args = [encodedTransaction, config];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args);
  if (res.error) {
    throw new Error('failed to simulate transaction: ' + res.error.message);
  }
  return res.result;
}
