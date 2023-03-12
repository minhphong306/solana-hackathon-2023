import {
  Transaction,
  Connection,
  TransactionSignature,
  SimulatedTransactionResponse,
  Commitment,
  SignatureStatus,
  RpcResponseAndContext
} from "@solana/web3.js";
import {DEFAULT_TIMEOUT} from "./constants";
import {getUnixTs, sleep} from "./various";

export async function sendSignedTransaction({signedTransaction, connection, timeout = DEFAULT_TIMEOUT}: {
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
      throw new Error('Transaction failed: Custom instruction error');
    }

    slot = confirmation?.slot || 0;
  } catch (err) {
    if (err.timeout) {
      throw new Error('Timed out awaiting confirmation on transaction');
    }
    let simulateResult: SimulatedTransactionResponse | null = null;
    try {
      simulateResult = (
        await simulateTransaction(connection, signedTransaction, 'single')
      ).value;
    } catch (e) {
      console.error(e.message);
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
  } finally {
    done = true;
  }
  return {txid, slot};
}

async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection,
  commitment: Commitment = 'recent',
  queryStatus = false,
): Promise<SignatureStatus | null | void> {
  let done = false;
  let status: SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null,
  };
  let subId = 0;
  // eslint-disable-next-line no-async-promise-executor
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return;
      }
      done = true;
      reject({timeout: true});
    }, timeout);
    try {
      subId = connection.onSignature(
        txid,
        (result, context) => {
          done = true;
          status = {
            err: result.err,
            slot: context.slot,
            confirmations: 0,
          };
          if (result.err) {
            reject(status);
          } else {
            resolve(status);
          }
        },
        commitment,
      );
    } catch (e) {
      done = true;
    }
    // while (!done && queryStatus) {
    //   // eslint-disable-next-line no-loop-func
    //   (async () => {
    //     try {
    //       const signatureStatuses = await connection.getSignatureStatuses([
    //         txid,
    //       ]);
    //       status = signatureStatuses && signatureStatuses.value[0];
    //       if (!done) {
    //         if (!status) {
    //           console.log('REST null result for', txid, status);
    //         } else if (status.err) {
    //           console.log('REST error for', txid, status);
    //           console.log(JSON.stringify(status));
    //           done = true;
    //           reject(status.err);
    //         } else if (!status.confirmations) {
    //           console.log('REST no confirmations for', txid, status);
    //         } else {
    //           console.log('REST confirmation for', txid, status);
    //           done = true;
    //           resolve(status);
    //         }
    //       }
    //     } catch (e) {
    //       if (!done) {
    //         console.log('REST connection error: txid', txid, e);
    //       }
    //     }
    //   })();
    //   await sleep(2000);
    // }
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (connection._signatureSubscriptions[subId])
    connection.removeSignatureListener(subId);
  done = true;
  return status;
}

async function simulateTransaction(
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
