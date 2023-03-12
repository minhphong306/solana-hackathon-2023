// https://github.com/metaplex-foundation/metaplex/blob/master/js/packages/cli/src/helpers/transactions.ts#L180
import {
  Commitment,
  Connection,
  SignatureStatus,
  TransactionSignature,
} from '@solana/web3.js';
import sleep from '../sleep';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('utils:transactions:awaitTransactionSignatureConfirmation');

export default async function awaitTransactionSignatureConfirmation(
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
      debug('Rejecting for timeout...');
      reject({ timeout: true });
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
            debug('Rejected via websocket', result.err);
            reject(status);
          } else {
            debug('Resolved via websocket', result);
            resolve(status);
          }
        },
        commitment,
      );
    } catch (e) {
      done = true;
      debug('WS error in setup', txid, e);
    }
    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      (async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([
            txid,
          ]);
          status = signatureStatuses && signatureStatuses.value[0];
          if (!done) {
            if (!status) {
              debug('REST null result for', txid, status);
            } else if (status.err) {
              debug('REST error for', txid, status);
              done = true;
              reject(status.err);
            } else if (!status.confirmations) {
              debug('REST no confirmations for', txid, status);
            } else {
              debug('REST confirmation for', txid, status);
              done = true;
              resolve(status);
            }
          }
        } catch (e) {
          if (!done) {
            debug('REST connection error: txid', txid, e);
          }
        }
      })();
      await sleep(2000);
    }
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if (connection._signatureSubscriptions[subId])
    connection.removeSignatureListener(subId);
  done = true;
  debug('Returning status', status);
  return status;
}
