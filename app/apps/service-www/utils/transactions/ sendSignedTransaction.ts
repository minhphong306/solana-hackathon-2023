import { Transaction, Connection, TransactionSignature, SimulatedTransactionResponse } from "@solana/web3.js";
import { getUnixTs } from "../helpers/various";
import sleep from "../sleep";
import awaitTransactionSignatureConfirmation from "./awaitTransactionSignatureConfirmation";
import { DEFAULT_TIMEOUT } from "./constants";
import simulateTransaction from './simulateTransaction';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('utils:transactions: sendSignedTransaction');

export default async function sendSignedTransaction({
  signedTransaction,
  connection,
  timeout = DEFAULT_TIMEOUT,
}: {
  signedTransaction: Transaction;
  connection: Connection;
  sendingMessage?: string;
  sentMessage?: string;
  successMessage?: string;
  timeout?: number;
}): Promise<{ txid: string; slot: number }> {
  const rawTransaction = signedTransaction.serialize();
  const startTime = getUnixTs();
  let slot = 0;
  const txid: TransactionSignature = await connection.sendRawTransaction(
    rawTransaction,
    {
      skipPreflight: true,
    },
  );

  debug('Started awaiting confirmation for', txid);

  let done = false;
  (async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      });
      await sleep(500);
    }
  })();
  try {
    const confirmation = await awaitTransactionSignatureConfirmation(
      txid,
      timeout,
      connection,
      'confirmed',
      true,
    );

    if (!confirmation)
      throw new Error('Timed out awaiting confirmation on transaction');

    if (confirmation.err) {
      debug(confirmation.err);
      throw new Error('Transaction failed: Custom instruction error');
    }

    slot = confirmation?.slot || 0;
  } catch (err) {
    debug('Timeout Error caught', err);
    if (err.timeout) {
      throw new Error('Timed out awaiting confirmation on transaction');
    }
    let simulateResult: SimulatedTransactionResponse | null = null;
    try {
      simulateResult = (
        await simulateTransaction(connection, signedTransaction, 'single')
      ).value;
    } catch (e) {
      debug('Simulate Transaction error', e);
    }
    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i];
          if (line.startsWith('Program log: ')) {
            throw new Error(
              'Transaction failed: ' + line.slice('Program log: '.length),
            );
          }
        }
      }
      throw new Error(JSON.stringify(simulateResult.err));
    }
    debug('Got this far.');
    // throw new Error('Transaction failed');
  } finally {
    done = true;
  }

  debug('Latency (ms)', txid, getUnixTs() - startTime);
  return { txid, slot };
}
